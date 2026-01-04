// ==UserScript==
// @name         微信读书代码复制与图片下载
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @match        https://weread.qq.com/web/reader*
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        GM_notification




// @downloadURL https://update.greasyfork.org/scripts/412094/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E4%BB%A3%E7%A0%81%E5%A4%8D%E5%88%B6%E4%B8%8E%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/412094/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E4%BB%A3%E7%A0%81%E5%A4%8D%E5%88%B6%E4%B8%8E%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // 基于jQuery检测dom出现
    function jianceDOM(classname){
        return new Promise(res=>{
            let max=80;
            let jiance=setInterval(()=>{
                if(document.querySelectorAll(classname).length){
                    clearInterval(jiance)
                    res(true)
                }
                if(max<=0){
                    clearInterval(jiance)
                    res(false)
                }
                max--
            },100)
        })
    }

    // 检测文章内容发生变化
    // $(document).on("DOMNodeInserted","pre", async()=>{
    //     console.log('文章发生变化了')
    //     add_copy_code_btn()
    //     add_copy_img_btn()
    // })
    $("body").append(`
    <div id="module_box" style="
    position: fixed;
    left:0;
    top:200px;
    bottom:0;
    right:0;
    margin:auto;
    width: 200px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    background-color: rgba(0, 0, 0, 0.3);
    font-size: 24px;
    z-index:999999;
    display:none;">复制成功</div>
    `)


    async function add_copy_code_btn() {
        // 检测代码段是否存在
        let res_dom_code = await jianceDOM("pre")
        let copy_code_btn_length = $("#copy_code").length
        if (res_dom_code && copy_code_btn_length==0) {
            // $("pre").css("position","relative")
            $("pre").append(`
            <button id="copy_code" style="position: absolute;right: 0;top: 0;color:white;cursor:pointer;z-index:99999;">📋</button>
            `)
        }
    }

    add_copy_code_btn()

    // 复制按钮
    $(document).on("click","#copy_code",function(){
        // let code_text = $(this).closest('pre').text().replace("📋","")
        let code_text = $(this).closest('pre')[0].childNodes[0].textContent
        GM_setClipboard(code_text)
        $("#module_box").fadeIn()
        setTimeout(() => {
            $("#module_box").fadeOut()
        },1000)
        // GM_notification({text:'复制成功',timeout:0})
    })

    $(document).on("click","button[title='下一章']",function(){
        // console.log("下一章按钮")
        add_copy_code_btn()
        add_copy_img_btn()
    })
    $(document).on("click",".chapterItem",function(){
        add_copy_code_btn()
        add_copy_img_btn()
    })

    async function add_copy_img_btn() {
        let res_dom_img = await jianceDOM('.wr_readerImage_opacity')
        let open_img_btn_length = $("button[name='btn_cxy_open_img_page']").length
        let get_img_btn_length = $("button[name='btn_cxy_get_img']").length
        if (res_dom_img && open_img_btn_length == 0 && get_img_btn_length == 0) {
            console.log("图片个数===",$('.wr_readerImage_opacity').length)
            $('.wr_readerImage_opacity').each((ind,ele) => {
                let btn =  document.createElement("button")
                btn.name = "btn_cxy_open_img_page"
                btn.innerHTML = "📋"

                let btn2 =  document.createElement("button")
                btn2.name = "btn_cxy_get_img"
                btn2.innerHTML = "▼"

                // 设置指定位置
                // let xy = $(ele)[0].getBoundingClientRect()

                btn.style.cssText = `position: absolute;right: 0px;top: ${ele.offsetTop-50}px;color:white;z-index:9999; cursor:pointer`
                btn2.style.cssText = `position: absolute;right: 0px;top: ${ele.offsetTop-20}px;color:#888;z-index:9999; cursor:pointer`

                // 添加按钮
                ele.after(btn)
                ele.after(btn2)
            })
        }
    }
    add_copy_img_btn()


    // 打开新窗口 显示图片
    $(document).on("click","button[name='btn_cxy_open_img_page']",function(){
        let link = $(this).prev().prev().attr("src")
        GM_openInTab(link, { active: true });
    })

    // 下来图片按钮
    $(document).on("click","button[name='btn_cxy_get_img']",function(){
        let link = $(this).prev().attr("src")
        // console.log(link);
        GM_download({
            url: link,
            name: new Date().getTime()+'.jpg',
            headers: {
              "User-Agent": "netdisk;6.7.1.9;PC;PC-Windows;10.0.17763;WindowsBaiduYunGuanJia",
            },
            onprogress: function (e) {
            //   console.log(JSON.stringify(e))
            },
        });
    })
})();