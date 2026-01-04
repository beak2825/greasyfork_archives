// ==UserScript==
// @name           Virtonomica:old-interface
// @description    Добавляет признак старого интерфейса в ссылки
// @namespace      virtonomica
// @version        1.101
// @grant          none
// @include        *virtonomic*.*/*/main/*
// @author         tux
// @downloadURL https://update.greasyfork.org/scripts/404604/Virtonomica%3Aold-interface.user.js
// @updateURL https://update.greasyfork.org/scripts/404604/Virtonomica%3Aold-interface.meta.js
// ==/UserScript==

var run = function () {
    var re_off = /(\?|\#).+$/;
    var re_on = [/сompany\/view\/\d+/,
             /company\/view\/\d+\/unit_list$/,
             /unit\/view\/\d+$/,
             /unit\/view\/\d+\/supply$/,
             /unit\/view\/\d+\/sale$/,
             /user\/privat\/persondata\/knowledge/,
             /unit\/create\/\d+$/,
             /unit\/create\/\d+$/,
             /company\/view\/\d+\/unit_list\/employee$/,
             /company\/view\/\d+\/unit_list\/employee\/salary$/,
             /company\/view\/\d+\/unit_list\/employee\/holiday$/,
             /company\/view\/\d+\/unit_list\/equipment$/,
             /company\/view\/\d+\/unit_list\/animals$/,
             /company\/view\/\d+\/unit_list\/technology$/,
             /management_action\/\d+\/artefact\/list$/,
            ];
    //$("a[href^='https:\/\/virtonomica\.']").each(function(){
    $("a[href^='https:\/\/virtonomica\.']").on('click',function(){
        var str = this.href;
        if(this.href.match(/\/window\/company\//)){
            this.href = this.href.replace(/\/window\/company\//,'/main/company/');
            //console.log(this.href + ' changed to main');
        }
        if (str.search(re_off) == -1){
            var can_add = false;
            for(var i=0;i<re_on.length;i++){
                if(str.search(re_on[i]) != -1){
                    can_add = true;
                }
            }
            if(can_add){
                str += '?old';
                this.href=str;
                //console.log(str + ' changed to old');
            }
        }
    });
}
if (window.top == window) {
  var script = document.createElement('script');
  script.textContent = '(' + run.toString() + ')();';
  document.documentElement.appendChild(script);
}