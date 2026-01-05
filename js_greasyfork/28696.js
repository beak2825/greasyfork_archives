// ==UserScript==
// @name         获取ICC集合结构
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  获取ICC集合结构 English
// @author       Killua Chen
// @match        http://cloud.umaman.com/
// @grant        none
// @require      https://cdn.bootcss.com/jquery/2.1.4/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/28696/%E8%8E%B7%E5%8F%96ICC%E9%9B%86%E5%90%88%E7%BB%93%E6%9E%84.user.js
// @updateURL https://update.greasyfork.org/scripts/28696/%E8%8E%B7%E5%8F%96ICC%E9%9B%86%E5%90%88%E7%BB%93%E6%9E%84.meta.js
// ==/UserScript==

/**
 * 是否打开了属性管理
 */
function isOpen(){
    var dom=$("span[id^='idatabaseStructureWindow']")[0];
    if(dom===undefined||dom.innerHTML!=  '属性管理'){
        return false;
    }
    return true;
}
function setContent(code){
    if(code===''){
        return false;
    }
    $('#icc_content').val(code).show().select();
    console.log(code);
}
(function() {

    $('body').dblclick(function(){
        if(isOpen()){
            var num=$("tbody[id^='gridview']").length-1;
            var tab =$($("tbody[id^='gridview']")[num]);
            var tr = tab.find("tr");
            var data_code=[];
            var data_doc={};
            var postman='';
            //组装数组结构
            for(var i=0;i<tr.length;i++){
                var attr_list=$(tr[i]).find('div');
                var key=attr_list[1].innerHTML;
                var val=attr_list[2].innerHTML;
                var type=attr_list[3].innerHTML;
                var filter=attr_list[4].innerHTML;
                var required=attr_list[6].innerHTML;
                var unique=attr_list[8].innerHTML;
                data_code.push({'key':key,'name':val,'type':type,'filter':filter,'unique':unique,'required':required});
                data_doc[key]=val;
                postman+=key+':\n';
            }
            var code=JSON.stringify(data_code);
            var doc=JSON.stringify(data_doc);
            //动态添加DOM
            if ( $("#icc_struct").length === 0 ) {
                $(document.body).append("<input id='icc_content' style='display:none;position: absolute; top: 224px; left: 32.8%; z-index: 9999999999; width: 40px; border-radius: 3px; border: 0px;'/><div id='icc_struct' style='position: absolute;top: 257px;left:66%;z-index: 9999999999;'><button id='icc_code'>C</button>&nbsp;<button id='icc_doc'>D</button>&nbsp;<button id='icc_postman'>P</button></div>");
                $('#icc_code').click(function(){
                    setContent(code);
                });
                $('#icc_doc').click(function(){
                    setContent(doc);
                });
                $('#icc_postman').click(function(){
                    setContent(postman);
                });
            }
            //轮询关闭按钮
            setInterval(function(){
                if(!isOpen()){
                    $('#icc_struct').remove();
                    $('#icc_content').val('').hide();
                }
            },100);

        }
    });
})();

