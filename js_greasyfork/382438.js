// ==UserScript==
// @name         豆瓣信息自动填充
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  readfree上传页面豆瓣信息自动填充
// @author       You
// @match        https://readfree.me/upload/diy/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/382438/%E8%B1%86%E7%93%A3%E4%BF%A1%E6%81%AF%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/382438/%E8%B1%86%E7%93%A3%E4%BF%A1%E6%81%AF%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

(function() {
    let link=$("#id_link")
    let link_p=link.parent()
    let btn=$("#write_button")
    btn.remove()
    link_p.append('<input id="write_button" type="button" value="自动填充"/>')
    btn=$("#write_button")
    btn.click(function(){
        //event.preventDefault();
        let url=encodeURI(link.val())
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function (response) {
                if (response.status === 200) {
                    let data =response.response
                    let wrapper= $(data).filter("#wrapper")
                    let info= wrapper.get(0).querySelector("#info")
                    $("#id_title").val(wrapper.find("h1").children("span").text())
                    let info_list=info.querySelectorAll(".pl")
                    let info_val_list={}
                    for (let i=0;i<info_list.length;i++){
                        info_val_list[info_list[i].innerText.replace(/ |:/g,"")]=info_list[i]
                    }
                    let data_list=['作者','译者','出版社','ISBN']
                    try{
                        let authors=info_val_list[data_list[0]]
                        $("#id_authors").val(Array.from(authors.parentNode.querySelectorAll("a")).map(function(currentValue){return currentValue.innerText}).join(","))
                    }catch(err){
                    }
                    try{
                        let translators=info_val_list[data_list[1]]
                        $("#id_translators").val(Array.from(translators.parentNode.querySelectorAll("a")).map(function(currentValue){return currentValue.innerText}).join(","))
                    }catch(err){
                    }
                    try{
                        let publisher=info_val_list[data_list[2]]
                        $("#id_publisher").val(publisher.nextSibling.nodeValue.replace(/\n| /g,""))
                    }catch(err){
                    }
                    try{
                        let isbn13=info_val_list[data_list[3]]
                        $("#id_isbn13").val(isbn13.nextSibling.nodeValue.replace(/\n| /g,""))
                    }catch(err){
                    }




                    try{
                        let related_info= wrapper.get(0).querySelector("#link-report")
                        $(related_info.querySelector(".short")).remove()
                        related_info=related_info.querySelector(".intro")
                        let related_info_list=related_info.querySelectorAll("p")
                        $("#id_summ").val(Array.from(related_info_list).map(function(currentValue){return currentValue.innerText}).join("\n"))
                    }catch(err){}

                    try{
                        let tags= wrapper.get(0).querySelectorAll("a.tag")
                        $("#id_tags").val(Array.from(tags).map(function(currentValue){return currentValue.innerText}).join(",")+",DIY")
                    }catch(err){}
                }
                else{
                    alert("error: "+url+" "+response.status)
                }
            }
        })
    })
    //link.after('<input id="submit_button" type="submit" value="自动填充"/>')
})();