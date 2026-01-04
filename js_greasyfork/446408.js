// ==UserScript==
// @name         btnPullSpider
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  this is scipt
// @author       You
// @match        https://siva.jobstreet.co.id/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=co.id
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant        GM_xmlhttpRequest
// @connect      *

// @downloadURL https://update.greasyfork.org/scripts/446408/btnPullSpider.user.js
// @updateURL https://update.greasyfork.org/scripts/446408/btnPullSpider.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Your code here...
    $(function(){
        console.log('btn running')
        var btn = $('<div id="SP-BTN"></div>')
            btn.css({
                'z-index': 999999,
                'width': '50px',
                'height': '10px',
                //'border': '1px solid #000',
                //'border-radius': '100px',
                'background': '#ccc',
                'position':'fixed',
                'right': '22.4%',
                'bottom': '20%',
                'text-align': 'center',
                'line-height': '50px',
                'font-size': '20px',
                'cursor': 'pointer',
                'clip-path':'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
                'transform':'rotate(90deg)'
            })
            btn.click(function(e){
                console.log(this)
                console.log(e)
                var dom = $('#applicant-listing')
                console.log(dom)
                console.log(dom.parent())
                var resumeid = dom.parent().attr('resumeid')
                console.log(resumeid)


                var token = $.cookie('siva_idp_auth_token')
                console.log(token)
                getData(resumeid, token)
            })
        $(document.body).append(btn)
        var host = window.location.host
        var protocol = window.location.protocol
        var base_url = protocol + '://' +host
        console.log(base_url)
        var HEADERS = {
            'accept': 'application/json, text/plain, */*',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9,pt;q=0.8',
            'locale-language': 'id',
            'origin': base_url,
            'referer': base_url,
            'sec-ch-ua':' " Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'time-zone': 'Asia/Jakarta',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36'
        }

        function getData(rid, token ){
            HEADERS['authorization'] = 'Bearer ' + token;
            console.log(HEADERS)
            var href = window.location.href;
            console.log(href)
            var jobid = /s\/([\d.]+?)\//.exec(href)
            console.log(jobid)
            var url = 'https://api.jobstreet.com/v3/applications/me/jobs/'+jobid[1]+'/resumes/'+rid+'?talent_search_flag=false'
            console.log(url)
            //return;
            GM_xmlhttpRequest({
                method: "get",
                url: url,
                data: {},
                headers: HEADERS,
                onload: function(r) {
                    // code
                    console.log(r)
                    if(r.status == 200){
                        var res = JSON.parse(r.response)
                        console.log(res)

                        var fp = {
                            candidate_uuid: res['candidate']['uuid'],
                            docswap_server_code: res['resume']['docswap_server_code'],
                            docswap_type: 64,
                            document_type_code: 1,
                            job_id: parseInt(jobid[1])
                        }
                        console.log(fp)
                        pullData(rid, res, fp)
                        var timer = setTimeout(function(){
                            pullFile(rid, fp, res['resume']['siva_resume_id'])
                            clearTimeout(timer)
                        }, 2000)
                    }
                }
            });
        }

        function pullFile(rid, fp, resume_id){
            var url = 'https://siva.jobstreet.co.id/candidate-uploaded-resume'
            var headers = {
                'accept': 'application/json, text/plain, */*',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'en-US,en;q=0.9,pt;q=0.8',
                'content-length': 142,
                //'cookie':document.cookie,
                'content-type': 'application/json;charset=UTF-8',
                'origin': base_url,
                'referer': base_url,
                'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36'
            }
            console.log(headers)
            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                data: JSON.stringify(fp),
                headers: headers,
                responseType:'arraybuffer',
                onload: function(r) {
                    // code
                    console.log(r)
                    console.log(r.responseHeaders)
                    //console.log(typeof(r.responseHeaders))
                    //var resHeaders = r.resonseHeaders.toString()
                    //var match = resHeaders.match(/x-file-content-type: (\S*)/)
                    //console.log(match)

                    if(r.status == 200){
                        var data = new Blob([r.response], {type:'application/pdf'})
                        console.log(data)
                        var form = new FormData()
                        form.append('id', resume_id)
                        form.append('name', fp.candidate_uuid)
                        form.append('file', data)
                        console.log(form)
                        GM_xmlhttpRequest({
                            method: "post",
                            url: 'http://hradmin.daxiong.fun/index.php?s=apiadmin/spider/save_refile',
                            data:form,
                            headers: {
                                //'Content-Type':'application/x-www-urlencode'
                            },
                            //responseType:'arraybuffer',
                            onload: function(r) {
                                // code
                                console.log(r.response)

                                //var e = window.document.createElement('a')
                                //e.href = window.webkitURL.createObjectURL(data)
                                //e.download= fp.candidate_uuid+'.pdf';
                                //window.document.body.appendChild(e)
                                //e.click()
                                //window.document.body.removeChild(e)
                            }

                        })
                    }
                }
            });
        }
        function pullData(rid, data, fp){
            var form = new FormData()
            form.append('type', 1)
            form.append('data_id', data['resume']['siva_resume_id'])
            form.append('content', JSON.stringify(data))
            form.append('platform', 'user')
            console.log(data)
            console.log(form)
            GM_xmlhttpRequest({
                method: "post",
                url: 'http://hradmin.daxiong.fun/index.php?s=apiadmin/spider/save_data',
                data:form,
                headers: {},
                onload: function(r) {
                    // code
                    console.log(r.response)
                }

            })
        }
    })
})();
