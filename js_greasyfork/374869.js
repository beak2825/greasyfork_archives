// ==UserScript==
// @name         Mangadex matcher for Mangaupdates
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  It tries to find a mangadex's upload associated with the mangaupdates' entry you are seeing. You need to have tampermonkey installed to use it
// @author       Oceko
// @include       https://www.mangaupdates.com/series.html?id=*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require     http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/374869/Mangadex%20matcher%20for%20Mangaupdates.user.js
// @updateURL https://update.greasyfork.org/scripts/374869/Mangadex%20matcher%20for%20Mangaupdates.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var evaluateUrl = function(url,sid2search){
        return new Promise((resolve,reject)=>{
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(r) {
                    if(r.status==200 && r.responseText != undefined){
                        var link = $(r.responseText).find('a[href*=mangaupdates]')

                        if(link.length != 0){
                            link = link.attr('href').split('?id=')
                            var sid = link[link.length-1]

                            if(sid==sid2search){
                                resolve(true)
                            }else{
                                resolve(false)
                            }

                        }else{
                            resolve(false)
                        }
                    }else{
                        reject(r.status)
                    }
                },
                onerror: function(r){
                    reject(r.status)
                }
            });
        })
    }

    function checkUrlList(urls,evaluateUrl,sid){
        return new Promise((resolve,reject)=>{
            var f_stop = false;
            var i = 0;

            (function fself(i){
                if(i<urls.length && !f_stop){
                    evaluateUrl(urls[i],sid).then((r)=>{
                        if(r){
                            f_stop=true
                            resolve({"status":"found","res":urls[i],"i":i
                            })
                        }else{
                            fself(++i)
                        }
                    }).catch((err)=>{
                        f_stop=true
                        reject({"status":"err","res":err,"i":i})
                    })

                }else{
                    f_stop=true
                    resolve({"status":"empty","res":urls[i-1],"i":i-1})
                }
            })(i)
        })
    }

    function findParamInUrl(url_string,param){
        var url = new URL(url_string);
        var result = url.searchParams.get(param);
        return result
      }

    window.addEventListener('load', function() {
        /*
            #1: We append the u2d dom element to give feedback to the user
        */
        GM_addStyle("#u2d img{width:15px;margin-right:5px;}#u2d{font-size: 10pt;font-weight: initial;float:right;}#u2d a{text-decoration-line: underline;}#u2d-loading{display:inline-block;width:8px;height:8px;border:3px solid rgba(247,147,30,.3);border-radius:50%;border-top-color:#272B30;animation:spin 1s ease-in-out infinite;-webkit-animation:spin 1s ease-in-out infinite;margin-right:5px;}@keyframes spin{to{-webkit-transform:rotate(360deg) }}@-webkit-keyframes spin{to{-webkit-transform:rotate(360deg) }}")


        var $title = $(".releasestitle")
        var sid = findParamInUrl(window.location.href,"id")
        var query_string = "https://mangadex.org/quick_search/"+$title.html()


        var $u2d = $("<div id='u2d'><div id='u2d-loading'></div><span id='u2d-search'>Searching...</span></div>")

        $u2d.insertAfter($title)

        /*
        #2: We get the urls of all the results from our quick search
        */

        GM_xmlhttpRequest({
            method: "GET",
            url: query_string,
            onload: function(r) {
                if(r.status == 200){
                    var results = $(r.responseText).find("a.manga_title")
                    var urls = results.map((i,r_found)=>{
                        return "https://mangadex.org"+$(r_found).attr("href")
                    })

                    /*
                        #3: We check all the urls searching for one that has an id that matches ours
                    */

                    checkUrlList(urls,evaluateUrl,sid).then(r=>{
                        console.log(r)
                        if(r.status=="found"){

                            var r_arr = r.res.split("/")
                            r_arr.length-2
                            var dex_id = r_arr[r_arr.length-2]

                            console.log(dex_id)

                            $u2d.html("<img style='15px' src='https://i.imgur.com/iNuvgJK.png'><a target='_blank' href='"+r.res+"'>#"+dex_id+"</a>")
                        }else{
                            $u2d.html("<img style='15px' src='https://i.imgur.com/iNuvgJK.png'><a target='_blank' href='"+query_string+"'>Not found</a>")
                        }
                    }).catch(err=>{
                        console.error(err)
                        $u2d.html("mangadex server error")
                    })


                }else{
                    console.log('error search!')
                }
            }
        })



    })

})();