// ==UserScript==
// @name         显示及抓取aliexpress bought信息
// @namespace    http://tampermonkey.net/
// @version      0.5
// @include           *aliexpress.ru/item*
// @connect           *
// @supportURL        http://www.burningall.com
// @compatible        chrome  完美运行
// @compatible        firefox  完美运行
// @description  显示抓取aliexpress bought信息
// @author       You
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js
// @license      No License
// @downloadURL https://update.greasyfork.org/scripts/458172/%E6%98%BE%E7%A4%BA%E5%8F%8A%E6%8A%93%E5%8F%96aliexpress%20bought%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/458172/%E6%98%BE%E7%A4%BA%E5%8F%8A%E6%8A%93%E5%8F%96aliexpress%20bought%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    $('head').append('<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css">')
    var requestUrl = window.localStorage.getItem('requestUrl'),
        currentPageUrl = null,
        social_platform = 'YouTube',
        secret_key = window.localStorage.getItem('secretKey'),
        creator = window.localStorage.getItem('creator');

    window.onload = function(){
        $(document).ready(function(){
            $('#saveParamsToLocalStorage').click(function() {
                console.log('??11')
                requestUrl = $('#request-url').val()
                secret_key = $('#secret-key').val()
                creator = $('#creator').val()
                if(!requestUrl) {
                    alert('请填写 请求Url')
                    return false
                }
                if(!secret_key) {
                    alert('请填写 密钥')
                    return false
                }
                if(!creator) {
                    alert('请填写 上传者')
                    return false
                }
                window.localStorage.setItem('requestUrl', requestUrl);
                window.localStorage.setItem('secretKey', secret_key);
                window.localStorage.setItem('creator', creator);
                location.reload();
            })
        });
        if(!requestUrl || !secret_key || !creator) {
            console.log('没来')
            $('#__aer_root__').prepend('<button type="button" id="testBtn" class="btn btn-primary hidden" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo"></button><div class="modal fade" id="exampleModal" style="z-index:99999;" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"><div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="exampleModalLabel">显示及抓取Aliexpress Bought信息填写必要参数</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body"><form><div class="mb-3"><label for="request-url" class="col-form-label">请求Url:</label><input type="text" class="form-control" id="request-url"></div><div class="mb-3"><label for="secret-key" class="col-form-label">密钥:</label><input type="text" class="form-control" id="secret-key"></div><div class="mb-3"><label for="creator" class="col-form-label">上传者:</label><input type="text" class="form-control" id="creator"></div></form></div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button><button type="button" class="btn btn-primary" id="saveParamsToLocalStorage">保存</button></div></div></div></div>')
            $('#testBtn').click()
            return false
        }
        boughtInfoHandle()
    }


    // setTimeout(function() {
    // }, 5000);

    console.log('来了')


    var boughtInfoHandle = function() {
        // var intId = setInterval(function () {

        //     clearInterval(intId)
        // }, 1200)
        currentPageUrl = window.location.href
        var uPattern = /^https:\/\/aliexpress.ru\/item\/.*$/
        console.log(1)
        if(!uPattern.test(currentPageUrl)) return false;
        console.log(2)
        var boughtQuantity = $('.snow-ali-kit_Typography__base__1shggo.snow-ali-kit_Typography__base__1shggo.snow-ali-kit_Typography__sizeTextM__1shggo.SnowProductDescription_SnowProductDescription__textItem__1421i').text().replace(' bought','')
        var params = {
            infoUrl: currentPageUrl,
            handle_method: 'create_and_query_aliexpress_bought',
            secret_key: secret_key,
            creator: creator,
            boughtQuantity: boughtQuantity,
            time_stamp: Date.now()
        }
        //requestUrl = 'http://127.0.0.1:8002/319bi/social_intercourse/social-interaction-info/'
        $.get(requestUrl, params, function(resp) {
            console.log(3)
            if(resp.success) {
                if(resp.bought_data.length > 0) {
                    console.log(resp.bought_data)
                    var boughtTrTdStr = ''
                    resp.bought_data.forEach(function(data) {
                        boughtTrTdStr += '<tr>'
                        boughtTrTdStr += '<td>' + data.upload_date + '</td>'
                        boughtTrTdStr += '<td>' + data.bought_quantity + '</td>'
                        boughtTrTdStr += '<td>' + data.creator + '</td>'
                        boughtTrTdStr += '<td>' + data.upload_time + '</td>'
                        boughtTrTdStr += '</tr>'
                    })
                    var strHtml = '<button type="button" id="seeDetail" class="btn btn-primary btn-sm hidden" data-bs-toggle="modal" data-bs-target="#detailModal">历史数据</button><div class="modal fade" id="detailModal" style="z-index:99999;" tabindex="-1" aria-labelledby="detailModalLabel" aria-hidden="true"><div class="modal-dialog modal-xl modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="detailModalLabel">历史抓取数据</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body"><table class="table"><thead class="table-light"><tr><th scope="col">上传日期</th><th scope="col">购买数量</th><th scope="col">上传者</th><th scope="col">上传时间</th></tr></thead><tbody>' +
                    boughtTrTdStr + '</tbody></table></div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button></div></div></div></div>'
                    // var strHtml = '<button type="button" id="seeDetail" class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#detailModal">历史数据</button><div class="modal fade" id="detailModal" style="z-index:99999;" tabindex="-1" aria-labelledby="detailModalLabel" aria-hidden="true"><div class="modal-dialog modal-xl modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="detailModalLabel">历史抓取数据</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body">'
                    //  + boughtHtml + '</div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button></div></div></div></div>'
                    if($('.snow-ali-kit_Typography__base__1shggo.snow-ali-kit_Typography__base__1shggo.snow-ali-kit_Typography__sizeTextM__1shggo.SnowProductDescription_SnowProductDescription__textItem__1421i')[0]){
                        $('.snow-ali-kit_Typography__base__1shggo.snow-ali-kit_Typography__base__1shggo.snow-ali-kit_Typography__sizeTextM__1shggo.SnowProductDescription_SnowProductDescription__textItem__1421i').append(strHtml)
                    }else{
                        $('.SnowProductDescription_SnowProductDescription__extraInfo__1421i').prepend(strHtml)
                    }

                }else{
                    console.log(resp)
                }
                if(resp.bought_avg_data.length) {
                    var avgHtml = ''
                    resp.bought_avg_data.forEach(function(avgStr) {
                        avgHtml += avgStr + '&nbsp;&nbsp;&nbsp;'
                    })
                    //$('.SnowProductDescription_SnowProductDescription__extraInfo__1421i').append('<div style="width: 500px;" class="SnowProductDescription_SnowProductDescription__extraInfo__1421i"></div>')
                    $('.SnowProductDescription_SnowProductDescription__extraInfo__1421i').append(avgHtml)
                }else{
                    console.log(resp)
                }
            }else{
                alert('获取购买数据异常：' + resp.info)
            }
        })
    }



    //boughtInfoHandle()
    // var boughtIntervalId = setInterval(function() {
    //     if(currentPageUrl && currentPageUrl != window.location.href) {
    //         console.log('currentPageUrl != window.location.href')
    //         boughtInfoHandle()
    //     }
    // }, 3000)
})();
