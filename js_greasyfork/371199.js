// ==UserScript==
// @name         V2EX帖子盖楼显示
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  V2EX帖子盖楼,浏览帖子更直观！
// @author       why2fly@aliyun.com
// @match        *://www.v2ex.com/*
// @icon         http://www.v2ex.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371199/V2EX%E5%B8%96%E5%AD%90%E7%9B%96%E6%A5%BC%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/371199/V2EX%E5%B8%96%E5%AD%90%E7%9B%96%E6%A5%BC%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var xuhao = $('div.cell > table > tbody > tr > td:nth-child(3) > div.fr > span').get().map(i=>i.innerHTML);/*楼层序号a[20]*/
    var content = $('div.cell > table > tbody > tr > td:nth-child(3) > div.reply_content').get().map(i=>i.innerHTML);/*每层内容b[20]*/
    var name = $('div.cell > table > tbody > tr > td:nth-child(3) > strong > a').get().map(i=>i.innerHTML);/*层主名称c[20]*/

    var d = $('div.cell > table > tbody > tr > td:nth-child(3) > div.reply_content');/*每层内容obj*/
    var m = $('#Main > div:nth-child(4) > div[id].cell');/*楼层obj*/

    var name_obj = $('div.cell > table > tbody > tr > td:nth-child(3) > strong > a');/*层主名称obj*/
    var louzhu = $('#Main > div:nth-child(2) > div.header > small > a')[0].innerHTML;/*楼主名称*/
    var youname = $('#Rightbar > div:nth-child(2) > div:nth-child(1) > table:nth-child(1) > tbody > tr > td:nth-child(3) > span > a');/*当前用户名称*/
    youname = youname.length?youname[0].innerHTML :null ;
    var guanzhu = "why2fly";/*特别关注的人*/

    var deep = new Array(m.length).fill(0); /*每层的深度，默认0，如移动一级则深度加1 */ /*主要解决深度太大导致显示面太小的问题*/
    var maxdeep = 4;/*支持的最大堆叠深度,超过后将只右移一点点距离，可修改*/
    var allsamll = false;/*全部只右移一点点距离,默认关闭*/

    function change_color(i,name,color)
    {
        if( name[i] == name )
        {
            name_obj[i].setAttribute('style',color);/*当前层主为楼主，标记为蓝色*/
        }
    }

    /*将i层移到j层下面*/
    function gailou_with_deep(i,j)
    {
        if(deep[j] >= maxdeep-1)
        {
            console.log(xuhao[j]+" deep = "+ deep[j]);
            d[j].parentNode.parentNode.parentNode.parentNode.parentNode.append(m[i]);
            deep[i] = deep[j];
        }
        else
        {
            allsamll ? d[j].parentNode.parentNode.parentNode.parentNode.parentNode.append(m[i]) : d[j].append(m[i]);
            deep[i] = deep[j]+1;
        }
    }

    var i = 1;/*从第二层开始*/
    while(i< m.length)
    {
        change_color(i,louzhu, 'color:blue');/*当前层主为楼主，标记为蓝色*/
        change_color(i,louzhu, 'color:red');/*当前层主你自己，标记为红色*/
        change_color(i,louzhu, 'color:yellow');/*当前层主为特别关注的人，标记为黄色*/

        if(content[i].match("楼上"))
        {
            console.log(xuhao[i]+" have @楼上 #"+i);
            gailou_with_deep(i,i-1);
            i++;continue;
        }

        var num = content[i].search(/#\d+ /);/*内容包含 #14 xxxx  ,脚本认为是回复14楼的，移过去*/
        if(num != -1)
        {
            num = parseInt(content[i].slice(num+1));
            console.log(xuhao[i]+" have @ #"+num);
            gailou_with_deep(i,num-1);
            i++;continue;
        }

        /*从当前层i往前开始逆序匹配名称，成功则移动当前层i移动到目标j层的下面 */
        for(var j=i-1;j>=0;j--){
            if(content[i].match(name[j]))
            {
                console.log(xuhao[i]+" have @"+name[j] + " #"+(j+1));
                gailou_with_deep(i,j);
                break;
            }
        }
        i++;
    }
})();