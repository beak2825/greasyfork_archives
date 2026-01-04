// ==UserScript==
// @name         netcare 收藏夹
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  使用说明:可添加开发域收藏夹,动态添加快捷链接在开发域header上,需结合chrome插件,tampermonkey安装此脚本;使用方法,在gde开发域,打开常用页签后,可将页签链接添加到header全局上,也在控制台调用_addMyFav()添加,n对应开发已打开的tab页签;
// @author       longfei 30003589
// @require      https://cdn.bootcdn.net/ajax/libs/vue/3.2.45/vue.global.min.js
// @match        *://gdedev.icta138.huawei.com:38443/adc-studio-web/*
// @match        *://gdesit.icta138.huawei.com:38443/adc-studio-web/*
// @match        *://netcare-uat.huawei.com/adc-studio-web/*
// @match        *://netcare.huawei.com/adc-studio-web/*
// @match        *://netcare-de.gts.huawei.com/adc-studio-web/*
// @grant        none
// @date         2023-07-29
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471976/netcare%20%E6%94%B6%E8%97%8F%E5%A4%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/471976/netcare%20%E6%94%B6%E8%97%8F%E5%A4%B9.meta.js
// ==/UserScript==
// https://greasyfork.org/zh-CN/scripts/454575-netcare-%E5%BC%80%E5%8F%91%E5%9F%9F%E6%94%B6%E8%97%8F%E5%A4%B9%E8%AE%BE%E7%BD%AE
(function () {
  'use strict';
  // https://unpkg.com/axios
  console.log('netcare 收藏夹')
  //$(document).ready(function(){ 页面未初始化,无效
  setTimeout(function () {
    if (!window.$) {
      // 在子页面无jquery
      //getJS('https://unpkg.com/jquery@3.6.0/dist/jquery.min.js')
      return;
    }
    window.Vue = Vue;
    window._app = window.$vm; //|| document.querySelector('#app').__vue_app__;
    // 开发域后台
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
    .header .mid-context {width: auto;display:flex;flex: 1;position: static;transform: none;}
    .header .mid-context .app-name{width: auto;position: relative;}
    .mid-context .app-name .myFollow{position: fixed;top: 50px;display: none;z-index: 1000;line-height:2;background-color: rgba(0,0,0,.2);padding: 0 6px;}
    .mid-context .app-name .myFollow a {color: #007dff;}
    .mid-context .app-name:hover .myFollow{display: block;}
    .mid-context .el-icon-s-tools{color:#fff;line-height: 50px;}
    #myFav{display: flex;line-height: 50px; color:#fff;flex:1;flex-wrap: wrap;align-items: center;}
    #myFav span{padding-left: 12px;cursor:pointer;line-height: 20px;}
    #myLove span{padding-left: 12px;cursor:pointer;}
    `;
    //.serviceScriptConfig-container-ui .input-codeEditor {width:1128px!important}
    document.head.appendChild(style);
    $('.mid-context').parent().css({'display': 'flex','flex':1}).parent().css('display', 'flex');
    // 弹窗管理 ☼
    $('body').append('<div id="myFavDialog"></div>');
    let app = Vue.createApp({
      name: 'my-fav',
      template: `
      <div ref="myfavDialog" hidden>
        <div class="el-message-box__wrapper" style="z-index: 2003">
        <div class="el-message-box" style="width: 700px">
          <div class="el-message-box__header">
            <div class="el-message-box__title"><span>管理收藏夹</span></div>
            <button type="button" aria-label="Close" class="el-message-box__headerbtn"><i class="el-message-box__close el-icon-close" @click="close"></i></button>
          </div>
          <div class="el-message-box__content">
            <div class="el-message-box__container">
              <div id="myFaveTab">
                <span style="display: inline-block; width: 110px">添加页签</span>
                <select style="width: 100px" v-model="sel" @change="doSel">
                  <option v-for="itm in opens" :value="itm.id">{{itm.title}}</option>
                </select>
                <button @click="addSel" size="small" class="el-button" style="padding: 3px 8px">添加</button>
              </div>
              <ul>
                <li v-for="(item, index) in list" :key="index">
                  <p>
                    <span style="display: inline-block; width: 110px">标签名:</span>
                    <input type="text" v-model="item.title" />
                    <input type="text" v-model="item.url" style="margin: 0 4px" />
                    <button @click="del(index)" size="small" class="el-button" style="padding: 3px 8px">删除</button>
                    <button @click="move('up', index)" v-if="index>0" size="small" class="el-button" style="padding: 3px 8px">上移</button>
                    <button @click="move('down',index)" v-if="index<list.length-1" size="small" class="el-button" style="padding: 3px 8px">下移</button>
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <div class="el-message-box__btns">
            <button type="button" class="el-button el-button--small" @click="close"><span> 取消 </span></button>
            <button type="button" class="el-button el-button--small el-button--primary" @click="save"><span>保存 </span></button>
          </div>
        </div>
        </div>
        <div class="v-modal" tabindex="0" style="z-index: 2002;"></div>
      </div>`,
      data() {
        return {
          sel: '',
          opens: [],
          list: localStorage.myFavorite ? JSON.parse(localStorage.myFavorite) : [] //;myArr
        };
      },
      methods: {
        addSel() {
          //{id,path,realUrl,title,type,url}
          let obj = this.opens.find(i => i.id === this.sel);
          if (!this.sel || !obj) {
            alert('请先打开要添加的页签');
            // _app.$message?.warning('请先打开要添加的页签');
            return;
          }
          if (this.list.find(itm => itm.url === obj.url && itm.title === obj.title)) {
            _app.$message?.error('请勿重复添加');
            console.error('请勿重复添加');
            return;
          }
          /*
          obj = {
            label: obj.label,
            url: obj.url,
            params: obj.params,
            type: obj.type || ''
          };*/
          this.list.push(obj);
        },
        move(dire, index) {
          let tmp = this.list[index];
          if (dire == 'up') {
            this.list.splice(index, 1);
            this.list.splice(index - 1, 0, tmp);
          } else {
            this.list.splice(index, 1);
            this.list.splice(index + 1, 0, tmp);
          }
        },
        doSel() {
          // console.log('sel:', this.sel);
        },
        show() {
          this.opens = _app.tabs; //.slice(1);
          this.sel = _app.tabs[0]?.id || '';
          this.$refs.myfavDialog.hidden = false;
        },
        close() {
          this.$refs.myfavDialog.hidden = true;
        },
        del(ind) {
          this.list.splice(ind, 1);
        },
        save() {
          localStorage.setItem('myFavorite', JSON.stringify(this.list));
          window._initMyFav();
          this.close();
        }
      }
    }).mount('#myFavDialog');

    // 收藏夹链接
    $('.mid-context').on('click', '.el-icon-s-tools', () => app.show());
    // $('<i class="el-icon-s-tools" title="管理收藏夹"></i>').appendTo('#leftLogo .e_top_left')
    // $('<div id="myFav"></div>').appendTo('#leftLogo .e_top_left');
    // 添加我关注的工程
    axios.get('/adc-studio-project-mgt/web/rest/v1/projects?sort=updateTime%3Adesc&extendFields=LOGO%2CFAVORITE&start=0&limit=50&favorite=true').then(res=>{
       $('.mid-context .app-name').append('<ul class="myFollow">'+res.data.data.map(i=>`<li><a href="/adc-studio-web/project-mgt/project/resource-designer.html?project_id=${i.id}">${i.display_name}</a>`).join(''))
    })

    window._initMyFav();
  }, 2000);
  window._initMyFav = () => {
    let myArr = localStorage.myFavorite ? JSON.parse(localStorage.myFavorite) : [];
    if (!$('.mid-context .el-icon-s-tools').length) {
      $('.mid-context').append('<i class="el-icon-s-tools" title="管理收藏夹"></i>');
    }
    if (!$('#myFav').length) {
      $('<div id="myFav"></div>').appendTo('.mid-context').on('click', 'span', function () {
        // 左键跳转链接
        let myArr = localStorage.myFavorite ? JSON.parse(localStorage.myFavorite) : [];
        _app.addTab(myArr.find(i => i.title === this.innerHTML));
      });
    }
    $('#myFav').html(`${myArr.map((i, idx) => `<span title="${i.title}" data-label="${i.title}" data-index="${idx}">${i.title}</span>`).join(' ')}`)
  };
  // 使用说明:可动态添加快捷链接在开发域header上,需结合chrome插件,tampermonkey安装此脚本;使用方法,_addMyFav(_app.tabs[n])添加,n对应开发已打开的tab页签
  window._addMyFav = function (obj = {}, ind) {
    let myArr = JSON.parse(localStorage.myFavorite || '[]');
    if (myArr.find(i => i.title === obj.title)) {
      return console.error('已添加过当前链接!');
    }
    if (typeof ind === 'number' && ind < myArr.length) {
      ind < 0 && (ind = 0);
      myArr.splice(ind, 0, obj);
      $('#myFav span')
        .eq(ind)
        .before($(`<span title="${obj.title}" data-label="${obj.title}" data-index="${myArr.length - 1}">${obj.title}</span>`));
    } else {
      myArr.push(obj);
      $('#myFav').append(`<span title="${obj.title}" data-label="${obj.title}" data-index="${myArr.length - 1}">${obj.title}</span>`);
    }
    localStorage.myFavorite = JSON.stringify(myArr);
  };
  window._delMyFav = function (key) {
    let myArr = JSON.parse(localStorage.myFavorite || '[]');
    if (typeof key === 'number') {
      if (key < 0) {
        key = myArr.length + key;
      } else if (key > myArr.length - 1) {
        key = myArr.length - 1;
      }
      myArr.splice(key, 1);
    } else if (typeof key === 'string') {
      myArr = myArr.filter(i => i.title !== key);
    }
    localStorage.myFavorite = JSON.stringify(myArr);
    $('#myFav').find(`[data-label=${key}],[data-index=${key}]`).remove();
  };
})();

window._getJS = url => {
  const script = document.createElement('script');
  script.src = url;
  script.async = true;
  script.defer = true;
  const head = document.head || document.getElementsByTagName('head')[0];
  const node = (head && (head.firstChild || head.lastChild)) || document.getElementsByTagName('script')[0];
  if (node) {
    node.parentNode.insertBefore(script, node);
  }
};
