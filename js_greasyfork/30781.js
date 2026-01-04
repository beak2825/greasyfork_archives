// ==UserScript==
// @name         自动保存煎蛋(jandan.net/ooxx)妹子图
// @version      0.2
// @description  在浏览煎蛋妹子图的时候可以自动保存评分大于200（可以修改）的妹子图。默认的评分方法是oo-xx的值。
// @description  目前只在Chrome Tampermonkey下测试通过。Chrome需在“设置-高级设置-下载内容”中指定保存位置，并将“下载前询问每个文件的保存位置”的选勾支掉。
// @description  注意如果重复打开同一个页面的话，会重复保存图片
// @author       lemodd@qq.com
// @match        https://jandan.net/ooxx*
// @match        http://jandan.net/ooxx*
// @namespace    http://jandan.net/
// @grant        GM_log
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/30781/%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%E7%85%8E%E8%9B%8B%28jandannetooxx%29%E5%A6%B9%E5%AD%90%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/30781/%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%E7%85%8E%E8%9B%8B%28jandannetooxx%29%E5%A6%B9%E5%AD%90%E5%9B%BE.meta.js
// ==/UserScript==

//评分函数，可自行修改
function mark(oo,xx){
    //大于等于此值的图片会自动保存
    tvalue=150;
    //最简单的打分的计算，可以自己修改
    grade = oo - xx ;

    if(grade>=tvalue){
        return true;
    }else{
        return false;
    }
}


(function(){
    //$('li[id*="comment"]').each(function(){
    $('.row').each(function(){
        var jd_vote = $(this).find("div.jandan-vote span span");
        var oo = jd_vote.eq(0).text();
        var xx = jd_vote.eq(1).text();
        GM_log(oo);
        GM_log(xx);
        GM_log('--------------');

        if(mark(oo,xx)){
            var imgs = $(this).find("p img");
            GM_log(imgs);
            imgs.each(function(){
                pic_url ='http:'+ $(this).attr('src');
                GM_log(pic_url);
                var filename = pic_url.split('/').pop();
                filename = oo+"_"+xx+"_"+"_"+filename;
                var ext = filename.slice(-3).toLowerCase();

                if(ext=='jpg'){
                    GM_download(pic_url,filename);
                }else if(ext=='gif'){
                    pic_url = 'http:'+ $(this).attr('org_src');
                    filename = pic_url.split('/').pop();
                    filename = oo+"_"+xx+"_"+"_"+filename;
                    ext = filename.slice(-3).toLowerCase();
                    GM_download(pic_url,filename);
                }
            });

        }
    });


})();
