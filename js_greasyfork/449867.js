// ==UserScript==
// @name         新志数据共享
// @namespace    http://tampermonkey.net/
// @version      1.0.14
// @description  把页面上的部分信息抽取成JSON并放入剪切板!
// @author       Ade
// @license      MIT
// @match        https://fz.wanfangdata.com.cn/details/*.do?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setClipboard
// @require      https://code.jquery.com/jquery-1.11.min.js
// @downloadURL https://update.greasyfork.org/scripts/449867/%E6%96%B0%E5%BF%97%E6%95%B0%E6%8D%AE%E5%85%B1%E4%BA%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/449867/%E6%96%B0%E5%BF%97%E6%95%B0%E6%8D%AE%E5%85%B1%E4%BA%AB.meta.js
// ==/UserScript==

(function() {
    //'use strict';

    // Your code here...
    let _data = {
      chronclesAuthor:'',
      chronclesUnit:'',
      word:'',
      menuList:[],
      remark:''
    }

    initButton();
    /** 创建按钮 */
    function initButton() {
    $(".content").append("<button class='cjwk_btn cjwk_btn_arr'>复制全部</button>");
        const _all_btn = `
                        <button class='cjwk_btn cjwk_btn_all_intro'>复制内容简介</button>
                        <button class='cjwk_btn cjwk_btn_all_personnel'>复制编纂人员</button>
                        <button class='cjwk_btn cjwk_btn_all_unit'>复制编纂单位</button>
                        <button class='cjwk_btn cjwk_btn_all_time'>复制内容时限</button>
                      `
    $(".mod-topbar").append(`<button class='cjwk_btn cjwk_btn_all_catalogue'>复制目录</button>`);
    $(".mod-cover").append(`<div class="cjwk_all_btn_warp">${_all_btn}</div>`);
    $('.cjwk_btn').css({
        "background-color": "#f98c51",
        "display": "inline-block",
        "height": "32px",
        "width": "auto",
        "padding": "0 10px",
        "font-size": "14px",
        "text-indent": "0",
        "text-align": "center",
        "color": "#fff",
        "line-height": "32px",
        "font-family": "Microsoft Yahei,serif",
        "border-radius": "4px",
        "overflow": "visible",
    });
    $(".cjwk_btn_arr").css({
        "position": "fixed",
        "top": "100px",
        "right": "14%",
        "z-index": "99",
    });
    $(".cjwk_all_btn_warp").css({
        "display": "fixe",
    });
    $(".cjwk_all_btn_warp button").css({
        "margin-right": "5px",
    });
  }


    class GetWanfangdata{
        constructor() {
            this.modCoverpText = $('.mod-cover p')//获取所有内容及标题
            this.intro = $(".mod-cover p:eq(0)").text()//内容简介
            this.personnel = $('.mod-cover p:eq(1)').text()//编纂人员
            this.unitText = $('.mod-cover p:eq(2) strong').text()//编纂人员
            this.unit = $('.mod-cover p:eq(2)').text()//编纂单位
            this.timelimit = $('.mod-cover p:eq(3)').text()//内容时限
            this.qukg = /\s+/mg, ''
            this.tihuan = /\d+\.(\S+?)(?=\d+\.|$)/mg

            this.titleText_0 = $('.mod-cover p:eq(0) strong').text()//判断是否有内容简介
            this.titleText_1 = $('.mod-cover p:eq(1) strong').text()//判断是否有编纂人员
            this.titleText_2 = $('.mod-cover p:eq(2) strong').text()//判断是否有编纂单位
            this.titleText_3 = $('.mod-cover p:eq(3) strong').text()//判断是否有内容时限
        }
        switchTitle(text){//判断标题内容
            let _text = '';
             for(let i=0;i<this.modCoverpText.length;i++){
                 let li = this.modCoverpText[i].innerText
                 if(li.indexOf(text)>-1){
                    _text = li
                      console.log(i,li)
                    break;
                 }
            }
            return _text
        }
        getintro() {//内容简介
            let _text = this.switchTitle('内容简介：')
            return _text?.substring(5,_text.length)||'暂无简介';
        }
        getpersonnel() {//编纂人员
            let _text = this.switchTitle('编纂人员：')
            return _text?.substring(5,_text.length)||'暂无人员';
        }
        getunit() {//编纂单位
            let _text = this.switchTitle('编纂单位：')
            return _text?.substring(5,_text.length)||'暂无单位';
        }
        gettimelimit() {//内容时限
            let _text = this.switchTitle('内容时限：')
            return _text?.substring(5,_text.length)||'暂无时间';
        }
        getcatalogue() {//获取目录
            let _menuList = [];
            return this.setDataString('list').arr;
        }
        setDataString(listDom) {
            let _list = document.getElementById(listDom).children;
            let _listData = [], _listDataString = '';
            for (let i = 0; i < _list.length; i++) {
                if (!_list[i].children[2]) break;
                let _noeData = _list[i].children[2].children; //一级子数据集合
                if (!_noeData.length) { //只有一级目录--判断是否有子级,没有子级添加一级
                    let _oneText = {
                        label: _list[i].children[1].innerText,
                        children: [],
                        level:1
                    };
                    _listData.push(_oneText);//保存一级菜单
                    _listDataString += _list[i].children[1].innerText + '\n';
                    delete _noeData[i]
                } else {
                    let _towText = {
                        label: _list[i].children[1].innerText,
                        children: [],
                        level:1
                    };
                    for (let j = 0; j < _noeData.length; j++) {
                        let _towData = _noeData[j].children[1]; //二级子数据集合
                        if (!_towData.children.length) {
                            _towText.children.push({
                                label: _noeData[j].children[0].innerText,
                                children: [],
                                level:2
                            });
                            delete _towData[j];
                        } else {
                            let _threeText = {
                                label: _noeData[j].children[0].innerText,
                                children: [],
                                level:2
                            };
                            for (let k = 0; k < _towData.children.length; k++) {
                                let _three = _towData.children[k].children[0].innerText; //第三级单个目录
                                _threeText.children.push({
                                    label: _three,
                                    children: [],
                                    level:3
                                });
                            };
                            _towText.children.push(_threeText);//保存三级菜单
                        }
                      //  _towText.text += '\n   ' + _noeData[j].children[0].innerText;//设置二级字符串,若保存正常集合 需要把这行注释
                    }
                    _listData.push(_towText);//保存二级菜单
                    _listDataString += _towText.text + '\n';
                };
            };
            return {
                arr: _listData,//输出数组集合
                str: _listDataString//输出字符串
            };
        };
        cleardata(){
           _data = {
               chronclesAuthor:'',
               chronclesUnit:'',
               word:'',
               menuList:[],
               remark:''
           }
        }
    }
    let _getData = new GetWanfangdata();
    $('.content').on('click','.cjwk_btn_arr',()=>{
      _data.word = _getData.getintro();
      _data.chronclesAuthor = _getData.getpersonnel();
      _data.chronclesUnit = _getData.getunit();
      _data.menuList = _getData.getcatalogue();
      _data.remark = _getData.gettimelimit();
         GM_setClipboard(JSON.stringify(_data), 'text');
        console.log(_data)
         alert('全部信息获取成功,已复制')
    })
    $('.mod-cover').on('click','.cjwk_btn_all_intro',()=>{
       _getData.cleardata();
      _data.word = _getData.getintro();
         GM_setClipboard(JSON.stringify(_data), 'text');
        console.log(_data)
        alert('内容简介信息获取成功,已复制')
    })
    $('.mod-cover').on('click','.cjwk_btn_all_personnel',()=>{
       _getData.cleardata();
      _data.chronclesAuthor = _getData.getpersonnel();
        console.log(_data)
         GM_setClipboard(JSON.stringify(_data), 'text');
         alert('编纂人员信息获取成功,已复制')
    })
    $('.mod-cover').on('click','.cjwk_btn_all_unit',()=>{
       _getData.cleardata();
      _data.chronclesUnit = _getData.getunit();
        console.log(_data)
         GM_setClipboard(JSON.stringify(_data), 'text');
        alert('编纂单位信息获取成功,已复制')
    })
    $('.mod-cover').on('click','.cjwk_btn_all_time',()=>{
       _getData.cleardata();
      _data.remark = _getData.gettimelimit();
        console.log(_data)
         GM_setClipboard(JSON.stringify(_data), 'text');
        alert('内容时限信息获取成功,已复制')
    })
    $('.mod-topbar').on('click','.cjwk_btn_all_catalogue',()=>{
       _getData.cleardata();
      _data.menuList = _getData.getcatalogue()
        console.log(_data)
         GM_setClipboard(JSON.stringify(_data), 'text');
        alert('目录信息获取成功,已复制')
    })

})();