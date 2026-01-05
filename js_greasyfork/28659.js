// ==UserScript==
// @name         NGA 帖子过滤器
// @namespace    https://greasyfork.org/zh-CN/scripts/28659-nga-%E5%B8%96%E5%AD%90%E8%BF%87%E6%BB%A4%E5%99%A8
// @version      0.0.1.9
// @description  超简易NGA论坛帖子过滤器
// @author       F1re
// @include      /^https?://(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn|nga\.donews\.com)/thread.php.+/
// @grant        none
// @require      http://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/28659/NGA%20%E5%B8%96%E5%AD%90%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/28659/NGA%20%E5%B8%96%E5%AD%90%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

var $Q = jQuery.noConflict();

(function() {
    var numSaves = 10;
    var defaultRegex = '.+剧透慎入.+';
    
    var box = $Q('table#topicrows.forumbox')[0];
    
    // use localStorage to preserve configuration
    if (!window.localStorage) {
        // localStorage not supported, abort
        alert('请使用支持HTML5的浏览器！');
        return;
    }
    if (typeof localStorage.ngaPostRegexList != 'string'){
        var defaultList = [];
        for(i=0;i<numSaves;i++) defaultList[i] = defaultRegex;
        localStorage.ngaPostRegexList = JSON.stringify(defaultList);
    }
    if (typeof localStorage.ngaPostDoFilter != 'string') {
        localStorage.ngaPostDoFilter = ''; //default to false
    }
    if (typeof localStorage.ngaPostSelected != 'string') {
        localStorage.ngaPostSelected = '0';
    }
    // listbox for save slots
    var regex_selection=document.createElement('select');
    regex_selection.id = 'regex_selection';
    regex_selection.onchange = function(){
        localStorage.ngaPostSelected = regex_selection.selectedIndex;
        reload_textbox();
    };
    var list = JSON.parse(localStorage.ngaPostRegexList);
    for(i=0;i<numSaves;i++) {
        var optn=document.createElement('option');
        optn.text='Slot ' + i;
        optn.value=list[i];
        regex_selection.appendChild(optn);
    }
    regex_selection.selectedIndex = Number(localStorage.ngaPostSelected);
    
    // textbox for regular expression
    var regex_textbox=document.createElement('input');
    regex_textbox.type = 'text';
    regex_textbox.onchange=function(){
        update_textbox();
    };
    
    // filter button
    var filter_btn=document.createElement('input');
    filter_btn.type='button';
    filter_btn.value= localStorage.ngaPostDoFilter ? '还原' : '过滤';
    filter_btn.onclick = filter_handler;
    
    box.parentNode.insertBefore(regex_selection,box);
    box.parentNode.insertBefore(regex_textbox,box);
    box.parentNode.insertBefore(filter_btn,box);
    
    function update_textbox(){
        regex_selection.options[regex_selection.selectedIndex].value=regex_textbox.value;
        var list = JSON.parse(localStorage.ngaPostRegexList);
        list[regex_selection.selectedIndex] = regex_textbox.value;
        localStorage.ngaPostRegexList = JSON.stringify(list);
        if (localStorage.ngaPostDoFilter) filter(); else showall();
    }
    
    function reload_textbox(){
        regex_textbox.value= regex_selection.value;
        if (localStorage.ngaPostDoFilter) filter(); else showall();
    }
    
    function filter_handler(){
        if(localStorage.ngaPostDoFilter){
            localStorage.ngaPostDoFilter = '';
            this.value="过滤";
            showall();
        } else {
            localStorage.ngaPostDoFilter = 'doFilter';
            this.value="还原";
            filter();
        }
    }
    
    function showall(){
        var rows = $Q('.topicrow*');
        for(i = 0; i < rows.length; i++) {
            rows[i].style.display = '';
        }
    }
    
    function filter(){
        var regex = new RegExp(regex_textbox.value);
        var rows = $Q('.topicrow*');
        for(i = 0; i < rows.length; i++) {
            var row = rows[i];
            // filter posts matched by regex
            if(regex.test(row.childNodes[3].innerText)) {
                row.style.display = 'none';
            } else {
                row.style.display = '';
            }
        }
    }
    
    reload_textbox();
    
})();