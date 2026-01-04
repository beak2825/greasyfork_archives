// ==UserScript==
// @name         一点支撑支持库
// @namespace    https://www.kisslove.com.cn/
// @version      1.1
// @description  和谐
// @author       KiSs.LoVe
// @match        http://10.25.24.106:9988/oss-web/main.jsp*
// @icon         http://tampermonkey.net/favicon.ico
// @grant        GM_addStyle
// @grant        unsafeWindow
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @license      KiSs.LoVe
// ==/UserScript==
//========================================================学习笔记========================================================
//        http://10.25.24.106:9988/isa-ws-web-ps/frame.jsp*
(function() {
    'use strict';
    // Your code here...
    if(unsafeWindow.location.href.indexOf('main.jsp')!=-1){
       unsafeWindow.onload=function(){
          setTimeout(function(){
             let li=document.createElement("li");
             li.style='user-select: none;';
             li.innerHTML='<a id="a-1"><span id="span-1" class="span-class" style="vertical-align: middle;">优化</span></a>';
             li.onclick=function(event){
                if(event.target.id=="a-1"||event.target.id=="span-1"){
                   let btn=document.createElement("label");
                   btn.id='switch_btn';
                   btn.class='switch_on';
                   btn.style.cssText="margin:7px; position:relative; top:10px; zoom:1.95";
                   btn.innerHTML='<input type="checkbox" id="switch_check"><span class="input checked"></span>';
                   btn.onclick=function(){
                      let cbx = document.querySelector('iframe').contentDocument.querySelector('#switch_check');
                      if(cbx.checked == true){
                         var timer = setInterval(function(){
                            document.querySelector('iframe').contentDocument.querySelector('.ps-workorderquery-notAcceptOrderQueryView-search-btn').click();
                            let dj=document.querySelector('iframe').contentDocument.querySelector('#ps-workorderquery-notAcceptOrderQueryView-not_accept_btn_accepted')
                            if(cbx.checked==true&&dj!=null){
                               dj.click();
                               cbx.checked = false;
                               clearInterval(timer);
                     //          alert("来单请处理！");
                               Swal.fire({
                                  icon: 'warning',
                                  title: '心平静气，和谐接单！',
                                  text: '【一点支撑来单】',
                                  footer: '<span style="color:#ff0000">（友情提醒：注意工作纪律！）</span>'
                               })
                               //document.querySelector('iframe').contentDocument.querySelector('#imchat-iframe').contentDocument.querySelector('.layim-chat-textarea textarea').value='12vvvvvv3123'
                               //document.querySelector('iframe').contentDocument.querySelector('#imchat-iframe').contentDocument.querySelector('.layim-send-btn').click();
                                //document.querySelector('iframe').contentDocument.querySelector('#imchat-iframe').contentDocument.querySelector('.layim-chat.layim-chat-group.layui-show .layim-chat-textarea textarea').value='123123'

                                //document.querySelector('iframe').contentDocument.querySelector('.col-xs-12.form-group')
                               return;
                            }
                         },3000);
                      }
                   }
                   let iframe=document.querySelector('iframe').contentDocument.querySelector('#ps-workbenchView-li-imchat');
                   if(document.querySelector('iframe').contentDocument.querySelector('#switch_btn')==null){
                      iframe.parentElement.insertBefore(btn,iframe);
                   }
                }

                    //------------------------------------------------
             var timer = setInterval(function(){
              let banjie=document.querySelector('iframe').contentDocument.querySelector('#imchat-iframe').contentDocument.querySelector('.layim-chat.layim-chat-group.layui-show .layui-icon.layim-tool-shenqingbanjie');
             if(banjie!=null){
                 //1111111111111111111111
                 let divkuaijie=document.createElement("span");
                 divkuaijie.className="classlist3";
                 divkuaijie.style='user-select: none;font-size:15px;';
                 divkuaijie.innerHTML='<select><option value="快捷回复" selected="selected">快捷回复</option><option value="很高兴为您服务！请工单发起时直接表明需求，减少来回等待的沟通成本。格式为：用户账号（关联工单）+设备序列号+问题说明+实际需求" selected="selected">很高兴为您服务！</option><option value="" selected="selected">【未配置】</option><option value="该工单问题已处理，现在跟您办结了，如还有需求请在您这边评价后再次发起工单。">现在跟您办结了！</option></select>';
                if(document.querySelector('iframe').contentDocument.querySelector('#imchat-iframe').contentDocument.querySelector('.layim-chat.layim-chat-group.layui-show .classlist3')==null){
                 banjie.parentElement.insertBefore(divkuaijie,banjie)
                 let list3=document.querySelector('iframe').contentDocument.querySelector('#imchat-iframe').contentDocument.querySelector('.classlist3 select');
                 let textarea123=document.querySelector('iframe').contentDocument.querySelector('#imchat-iframe').contentDocument.querySelector('.layim-chat.layim-chat-group.layui-show .layim-chat-textarea textarea')
                 let fasong=document.querySelector('iframe').contentDocument.querySelector('#imchat-iframe').contentDocument.querySelector('.layim-chat.layim-chat-group.layui-show .layim-send-btn')
                 list3.options.selectedIndex=0;
                 list3.onchange=function(){
                     textarea123.value=list3.value;
                     fasong.click()
                     list3.options.selectedIndex=0;
                 }
                    }

                 //11111111111111111




              //     clearInterval(timer);
                 banjie.onclick=function(event){
              setTimeout(function(){
             let divv=document.createElement("div");
             divv.class='CarInfo'
             divv.style='user-select: none;';
             divv.innerHTML='<span class="classlist1"><select><option value="台账分类" selected="selected">台账分类</option><option value="[修改网关配置]">修改网关配置</option><option value="[信息查询]">信息查询</option><option value="[AAA账号维护]">AAA账号维护</option><option value="[工单修改上网账号、免验证]">工单修改上网账号、免验证</option><option value="[综合支撑]">综合支撑</option><option value="[工单交付环节异常]">工单交付环节异常</option><option value="[武汉网管]">武汉网管</option><option value="[特殊办结]">特殊办结</option></select></span><span class="classlist2"><select></select></span>';
             let dingwei=document.querySelector('iframe').contentDocument.querySelector('#ps-ordermanager-prOrderBanjieShenqing-banjieDesc-div');

          //办结选项   dingwei.parentElement.insertBefore(divv,dingwei)
             let list1=document.querySelector('iframe').contentDocument.querySelector('.classlist1 select');
             let list2=document.querySelector('iframe').contentDocument.querySelector('.classlist2 select');
             list1.onchange=function(){
             list2.options.length=0;
             if(list1.value=="[修改网关配置]"){
                list2.add(new Option("二级分类","二级分类"))
                list2.add(new Option("教会操作","[教会操作]"))
                list2.add(new Option("应急远程无工单","[应急远程无工单]"))
                list2.add(new Option("工单无功能选项","[工单无功能选项]"))
                list2.add(new Option("网关LAN口换绑","[网关LAN口换绑]"))
                list2.add(new Option("46不通提供超密","[46不通提供超密]"))
                list2.add(new Option("关键信息未提供或不正确","[关键信息未提供或不正确]"))
             }else if(list1.value=="[信息查询]"){
                list2.add(new Option("二级分类","二级分类"))
                list2.add(new Option("教会APP操作","[教会APP操作]"))
                list2.add(new Option("网关配置查询","[网关配置查询]"))
                list2.add(new Option("画像功能异常应急查询","[画像功能异常应急查询]"))
                list2.add(new Option("关键信息未提供或不正确","[关键信息未提供或不正确]"))
             }else if(list1.value=="[AAA账号维护]"){
                list2.add(new Option("二级分类","二级分类"))
                list2.add(new Option("账号信息查询","[账号信息查询]"))
                list2.add(new Option("教会APP操作","[教会APP操作]"))
                list2.add(new Option("应急解绑、强踢、改密无工单","[应急解绑、强踢、改密无工单]"))
                list2.add(new Option("开户、强开、宽带带宽恢复","[开户、强开、宽带带宽恢复]"))
                list2.add(new Option("关键信息未提供或不正确","[关键信息未提供或不正确]"))
             }else if(list1.value=="[工单修改上网账号、免验证]"){
                list2.add(new Option("二级分类","二级分类"))
                list2.add(new Option("账号销户","[账号销户]"))
                list2.add(new Option("拆迁区域","[拆迁区域]"))
                list2.add(new Option("工单无账号","[工单无账号]"))
                list2.add(new Option("非移动故障","[非移动故障]"))
                list2.add(new Option("账号不正确","[账号不正确]"))
                list2.add(new Option("催装类投诉","[催装类投诉]"))
                list2.add(new Option("第三方维护","[第三方维护]"))
                list2.add(new Option("免质差终端","[免质差终端]"))
                list2.add(new Option("关键信息未提供或不正确","[关键信息未提供或不正确]"))
             }else if(list1.value=="[综合支撑]"){
                list2.add(new Option("二级分类","二级分类"))
                list2.add(new Option("无法上网","[无法上网]"))
                list2.add(new Option("和TV故障","[和TV故障]"))
                list2.add(new Option("电话IMS故障","[电话IMS故障]"))
                list2.add(new Option("网慢、掉线","[网慢、掉线]"))
                list2.add(new Option("感知类投诉","[感知类投诉]"))
             }else if(list1.value=="[工单交付环节异常]"){
                list2.add(new Option("二级分类","二级分类"))
                list2.add(new Option("APP故障","[APP故障]"))
                list2.add(new Option("资源错误","[资源错误]"))
                list2.add(new Option("网管异常","[网管异常]"))
                list2.add(new Option("工单异常","[工单异常]"))
                list2.add(new Option("业务异常","[业务异常]"))
             }else if(list1.value=="[武汉网管]"){
                list2.add(new Option("二级分类","二级分类"))
                list2.add(new Option("做数据/应急激活","[做数据/应急激活]"))
                list2.add(new Option("做数据/VLAN调整","[做数据/VLAN调整]"))
                list2.add(new Option("删数据/移机下发失败","[删数据/移机下发失败]"))
                list2.add(new Option("删数据/设备类型变更","[删数据/设备类型变更]"))
                list2.add(new Option("删数据/翻新终端清理","[删数据/翻新终端清理]"))
                list2.add(new Option("删数据/PON带宽不足","[删数据/PON带宽不足]"))
                list2.add(new Option("删数据/APP下发数据异常","[删数据/APP下发数据异常]"))
                list2.add(new Option("删数据/槽口迁改","[删数据/槽口迁改]"))
             }else if(list1.value=="[特殊办结]"){
                list2.add(new Option("二级分类","二级分类"))
                list2.add(new Option("未表明需求","[未表明需求]"))
                list2.add(new Option("工单重复发起","[工单重复发起]"))
             }
             }
                 list2.onchange=function(){
                 let textarea123=document.querySelector('iframe').contentDocument.querySelector('#ps-ordermanager-prOrderBanjieShenqing-banjieDesc-div textarea')
                     textarea123.value = list1.value+list2.value
                 }
              },3000);
          }
             }
                      },2000);
                  //-------------------------------------------------

             }
          let dropdown=document.querySelector('.dropdown.workbech.workbech-menu');
          dropdown.parentElement.insertBefore(li,dropdown)
          },120);
       }
    }
  //  return;
})();