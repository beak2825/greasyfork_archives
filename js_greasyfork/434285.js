// ==UserScript==
// @name         云班课作业助手
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  解放雙手神器~
// @author       汐
// @match        https://www.mosoteach.cn/web/index.php?c=interaction_quiz&m=*&clazz_course_id=*&id=*&order_item=*
// @icon         https://www.google.com/s2/favicons?domain=mosoteach.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434285/%E4%BA%91%E7%8F%AD%E8%AF%BE%E4%BD%9C%E4%B8%9A%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/434285/%E4%BA%91%E7%8F%AD%E8%AF%BE%E4%BD%9C%E4%B8%9A%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

;(function(_this) {
    function MyPage(menu){
        this.axios = _this.axios;
        this.Qs =_this.Qs;
        this.$ = _this.$;
        this.json = _this.JSON
        this.namespace = menu.id;
        this.menu = menu;
        this.config = {};
        this.initMenu();
        return this;
    }
    MyPage.prototype.urlToObject = function(url){
        let obj = {}
        let arr1 = url.split("?")
        let arr2 = arr1[1].split("&")
        for(let i=0;i<arr2.length;i++){
            let res = arr2[i].split("=")
            obj[res[0]]=res[1]
        }
        return obj;
    }
    MyPage.prototype.resoluAnswers=function(data){
        let newData = {};
        newData.id = data.id;
        newData.title = data.title;
        newData.rows = [];
        data.rows.forEach(row=>{
            let _data = {};
            _data.id = row.id;
            _data.subject = row.subject;
            _data.options = [];
            row.answers.forEach(index =>{
                row.options.forEach(option=>{
                    if(option.item_no == index){
                        _data.options.push(option.content);
                    }
                });
            });
            newData.rows.push(_data);
        });
        return newData;
    }
    MyPage.prototype.getListMember = function(clazzcourseId){
        return new Promise((resolve,rejcet)=>{
            this.$.ajax({
                type: 'post',
                url:"https://www.mosoteach.cn/web/index.php?c=member&m=get_list_member",
                dataType:"json",
                data: {
                    clazz_course_id: clazzcourseId,
                    order_item: 'score'
                },
                success: function(res) {
                    resolve(res.data.member_data);
                }
            });
        });
    }
    MyPage.prototype.personResult = function(ccId,userId){
        return this.axios({
            method: 'post',
            data: this.Qs.stringify({
                id: ccId,
                user_id: userId,
            }),
            url: 'https://www.mosoteach.cn/web/index.php?c=interaction_quiz&m=person_result',
        });
    }
    MyPage.prototype.initMenu = function(){
        let $ = this.$,menu = this.menu;
        let $menu = $(
            `<div id='${menu.id}' style="text-align:center;width:${menu.width}px;height:${menu.height}px;position:absolute;left:${menu.pos.x}px;top:${menu.pos.y}px;background:${menu.background};opacity:${menu.opacity};">
                <button id="x_init" style="width:100%;" onclick="my.initData()">初始化數據</button>
                <button id="x_start" style="width:100%;" onclick="my.start()">開始腳本</button>
            </div>`);
        $('body').append($menu);
    }
    MyPage.prototype.initData = async function(){
        this.config = this.urlToObject(window.location.href);
        let {data:objectList} = await (this.getListMember(this.config.clazz_course_id));
        if(objectList.length <= 0 ){
            return alert("user_id獲取失敗");
        }
        this.config.user_id = objectList[0].user_id;
        let {data:res} = await (this.personResult(this.config.id,this.config.user_id));
        if(res.result_code != 0){
            return alert(res.result_msg);
        }
        this.config.answers = this.resoluAnswers(res.data);
        console.log(this.config);
        alert('汐: 初始化完成');
        _this.dumpData = this.config;
    }
    MyPage.prototype.toLog=function(explain){
        alert('汐: '+explain);
        this.initData();
        return this;
    }
    MyPage.prototype.start = function(){
        let config = this.config,$ = this.$;
        if(this.json.stringify(config) == '{}' || config.answers.rows.length <= 0){
            return alert('(#`O′)兄弟,數據都沒初始化怎麼能行?');
        }
        $('.topic-item').each(function(index,div){
            let Id = $(div).find('a').attr('name');
            let $options = $(div).find('label');
            $options.each(function(i,label){
                let content = $(label).find('.option-content.moso-text.moso-editor').text();
                config.answers.rows.forEach(row=>{
                    if(row.id == Id){
                        row.options.forEach(answer =>{
                            if(content == answer){
                                $(label).css('color','red');
                            }
                        });
                    }
                });
            });
        });
        alert('汐: 操作完成');
    }
    _this.MyPage = MyPage;
})(window);


window.my = new window.MyPage({
    id:"xidaren",
    width:100,
    background:'#fff',
    opacity:1,
    pos:{
        x:50,
        y:100
    }
}).toLog('切記切記,使用此腳本存在限制.1.老師必須開放可以查看答案解析 2.至少有兩次做作業的機會!!!');