// ==UserScript==
// @name         微博-批量删除微博
// @namespace    https://www.jwang0614.top/scripts
// @version      0.2.0
// @description  批量删除微博
// @author       Olivia Wang
// @match        https://weibo.com/*/profile*
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/383633/%E5%BE%AE%E5%8D%9A-%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E5%BE%AE%E5%8D%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/383633/%E5%BE%AE%E5%8D%9A-%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E5%BE%AE%E5%8D%9A.meta.js
// ==/UserScript==

var keepDeleting = true;

$(document).ready(function(){
    sleep(1000).then(()=>{
        insertUI();

        var delete_btn = $("#delete_btn");
        delete_btn.click(function(){
            if(confirm("确定删除所有微博吗？")) {
                keepDeleting = true;
                sessionStorage.setItem("keep_deleting", true);
                $("#status_label").css("display","block");
                deletePost();

            }
        });

        var stop_btn = $("#stop_btn");
        stop_btn.click(function(){
            keepDeleting = false;
            sessionStorage.clear();
            $("#status_label").css("display","none");
        });

        if (sessionStorage.getItem("keep_deleting")) {
            keepDeleting = true;
            $("#status_label").css("display","block");
            deletePost();
        } 

        

    })
    

})

function insertUI() {
    var $tab_box = $(".WB_tab_a .tab_box");

    var $new_tab_box = $('<div class="tab_box tab_box_c S_bg1 clearfix" style="margin-top:10px;"><ul class="tab W_fl"><li id="delete_btn" class="tab_li" style="background:#fa7d3c;color:white;">删除</li><li id="stop_btn" class="tab_li">停止</li><li id="status_label" class="tab_li" style="color:#fa7d3c;display:none;">删除中</li></ul></div>')
    $new_tab_box.insertAfter($tab_box);

}

function sleep(milliseconds){
    console.log("sleep");
    return new Promise(resolve => setTimeout(function(){console.log("sleep resolve");resolve();}, milliseconds))
}



function deletePost() {
    var posts = document.querySelectorAll(".WB_feed_detail");
    var total_number = posts.length;

    if (total_number != 0 && keepDeleting) {
        delete_single_post().then(()=>{
            sleep(1000).then(()=>{
                deletePost();
            })
        });
    } else {
        sleep(3000).then(()=>{
            $("#stop_btn").click();
            alert("删除完毕");
        })
    }
}

async function delete_single_post() {
    return new Promise(async resolve=>{
        var posts = document.querySelectorAll(".WB_feed_detail");
        var post = posts[0];
        console.log(post);
        console.log(posts.length);

        var text = post.querySelector(".WB_text");
        console.log(text);

        var delete_post = post.querySelectorAll(".layer_menu_list li a")[0];
        console.log(delete_post);
        console.log(post);
        console.log("");
        await delete_post.click();

        var confirm_btn = post.querySelectorAll(".layer_mini_opt .btn a")[0];
        console.log(confirm_btn);
        console.log(post);
        console.log("");
        await confirm_btn.click();

        resolve();
        
    });
}

