// ==UserScript==
// @name         偶书发帖豆瓣信息自动填充
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  偶书发帖页面豆瓣信息自动填充
// @author       obook.cc
// @match        https://obook.cc/?thread-create-*.htm
// @match        https://obook.cc/?post-update-*.htm
// @match        https://obook.cc/thread-create-*
// @match        https://obook.cc/post-update-*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/393665/%E5%81%B6%E4%B9%A6%E5%8F%91%E5%B8%96%E8%B1%86%E7%93%A3%E4%BF%A1%E6%81%AF%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/393665/%E5%81%B6%E4%B9%A6%E5%8F%91%E5%B8%96%E8%B1%86%E7%93%A3%E4%BF%A1%E6%81%AF%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==
function message_add(html) {
    if (typeof(KindEditor) != 'undefined') {
        KindEditor.insertHtml('#message', html);
    } else if (typeof(UE) != 'undefined') {
        UE.getEditor('message').execCommand('insertHtml', html);
    } else if (typeof(UM) != 'undefined') {
        UM.getEditor('message').execCommand('insertHtml', html);
    } else if (typeof(tinyMCE) != 'undefined') {
        tinyMCE.editors['message'].insertContent(html);
    } else {
        var msg = document.getElementById('message');
        if (document.selection) {
            this.focus();
            var sel = document.selection.createRange();
            sel.text = html;
            this.focus();
        } else if (msg.selectionStart || msg.selectionStart == '0') {
            var startPos = msg.selectionStart;
            var endPos = msg.selectionEnd;
            var scrollTop = msg.scrollTop;
            msg.value = msg.value.substring(0, startPos) + html + msg.value.substring(endPos, msg.value.length);
            this.focus();
            msg.selectionStart = startPos + html.length;
            msg.selectionEnd = startPos + html.length;
            msg.scrollTop = scrollTop;
        } else {
            this.value += html;
            this.focus();
        };
    };
};
(function() {
    let link=$("#subject")
    let link_p=link.parent()
    let btn=$("#write_button")
    btn.remove()
    link_p.append('<table class="table" style="min-width: 800px"><tbody><tr align="center"><td width="90%"><input type="text" class="form-control" name="db-link" id="db-link" value="" placeholder="豆瓣链接"></td><td width="10%"><a role="button" class="btn btn-primary submit-image" id="write_button"  style="color:fff">自动填充</a></td></tr></tbody></table>')
    btn=$("#write_button")
    btn.click(function(){
        let db_link=$("#db-link")
        let url=encodeURI(db_link.val())
        //let url=encodeURI("https://book.douban.com/subject/34890450/")
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function (response) {
                if (response.status === 200) {
                    let data =response.response
                    let wrapper= $(data).filter("#wrapper")
                    let info= wrapper.get(0).querySelector("#info")
                    let mainpic=$(data).filter("#mainpic")
                    let info_list=info.querySelectorAll(".pl")
                    let info_val_list={}
                    for (let i=0;i<info_list.length;i++){
                        info_val_list[info_list[i].innerText.replace(/ |:/g,"")]=info_list[i]
                    }

                    let data_list=['作者','定价','出版社','ISBN']
                    try{
                        //标题
                        let authors=info_val_list[data_list[0]]
                        //alert(authors)
                        let subject=Array.from(authors.parentNode.querySelectorAll("a")).map(function(currentValue){return currentValue.innerText}).join(",")
                        let tetle=wrapper.find("h1").children("span").text()
                        $("#subject").val(tetle+" - "+subject+"（epub+mobi+azw3）")
                    }catch(err){
                    }
                    try{
                        //图片
                        let temp=wrapper.get(0).querySelector("#mainpic")
                        let ima=temp.getElementsByTagName('img')[0].src;
                        message_add('<p style="text-align: center;"><img src="' + ima + '" width="240"/></p>');
                    }catch(err){
                    }


                    try{
                        //简介
                        let related_info= wrapper.get(0).querySelector("#link-report")
                        $(related_info.querySelector(".short")).remove()
                        related_info=related_info.querySelector(".intro")
                        let related_info_list=related_info.querySelectorAll("p")
                        let mess=Array.from(related_info_list).map(function(currentValue){return currentValue.innerHTML}).join("<br>")
                        message_add('<p><h2>内容简介</h2>[hide-line]'+mess+'[/hide-line]</p><p></p>');
                    }catch(err){}

                }
                else{
                    alert("error: "+url+" "+response.status)
                }
            }
        })
    })
})();