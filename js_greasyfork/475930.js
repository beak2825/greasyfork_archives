// ==UserScript==
// @name         自动下载微信公众号文章中的视频
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动下载微信公众号文章视频
// @author       Zep
// @match        https://mp.weixin.qq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com

// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_addStyle
// @require      https://lib.baomitu.com/axios/0.27.2/axios.min.js
// @require      https://lib.baomitu.com/jquery/1.12.4/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475930/%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E4%B8%AD%E7%9A%84%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/475930/%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E4%B8%AD%E7%9A%84%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(()=>{
    console.log('axios', axios)
    function downloadVideo1(url) {
        // 这是传统的下载方式
        const downloadFileA = unsafeWindow.document.createElement('a')
        unsafeWindow.document.body.append(downloadFileA)
        downloadFileA.href = url
        // http://mpvideo.qpic.cn/0bc3cyabeaaa2maoapqhensfafwdcilaaeqa.f10002.mp4?dis_k=97a32be63138ce2a2f2bde95e491119e&dis_t=1695370394&play_scene=10120&auth_info=Ws+SvC4/Xkm+rqDbJXVtXXtmQlMRLHRjWHgdFWRDLz5hUEkyPwVVHDgFMjpFNlRSbzA=&auth_key=409cd067a1d042d130c471012ecfb8fa&vid=wxv_2829481345448984576&format_id=10002&support_redirect=0&mmversion=false
        const filenameArr = url.split('?')[0].split('/')
        const filename = filenameArr[filenameArr.length - 1]
        downloadFileA.download = filename
        downloadFileA.rel = 'noopener noreferrer'
        // downloadFileA.click()
        unsafeWindow.document.body.removeChild(downloadFileA)
    }

    function downloadVideo2(url) {
        axios({
            method: 'get',
            url: url,
            // 必须显式指明响应类型是一个Blob对象，这样生成二进制的数据，才能通过window.URL.createObjectURL进行创建成功
            responseType: 'blob',
        }).then((res) => {
            if (!res) {
                return
            }
            // 将lob对象转换为域名结合式的url
            let blobUrl = window.URL.createObjectURL(res.data)
            let link = document.createElement('a')
            document.body.appendChild(link)
            link.style.display = 'none'
            link.href = blobUrl
            // 设置a标签的下载属性，设置文件名及格式，后缀名最好让后端在数据格式中返回
            const filenameArr = url.split('?')[0].split('/')
            const filename = filenameArr[filenameArr.length - 1]
            link.download = filename
            // 自触发click事件
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(blobUrl);
        })
    }


    function downloadVideo3(url) {
        GM_xmlhttpRequest({
            url:"url",
            method :"GET",
            headers: {
                // "Content-type": "application/x-www-form-urlencoded",
                "Host": "mpvideo.qpic.cn",

            },
            responseType: 'blob',
            onload:function(xhr){
                console.log("success", xhr);
                // 将lob对象转换为域名结合式的url
                // let blobUrl = window.URL.createObjectURL(xhr.response)
                var blob = this.response;
                var reader = new FileReader();

                reader.readAsDataURL(blob); // 转换为base64，可以直接放入a表情href

                reader.onload = function (e) {
                    let link = document.createElement('a')
                    document.body.appendChild(link)
                    link.style.display = 'none'
                    link.href = e.target.result
                    // 设置a标签的下载属性，设置文件名及格式，后缀名最好让后端在数据格式中返回
                    const filenameArr = url.split('?')[0].split('/')
                    const filename = filenameArr[filenameArr.length - 1]
                    link.download = filename
                    // 自触发click事件
                    link.click()
                    document.body.removeChild(link)
                    // window.URL.revokeObjectURL(blobUrl);
                };

                // console.log('blobUrl', blobUrl)

            }
        });


    }

    console.log('GM_xmlhttpRequest', GM_xmlhttpRequest)





    function promise_GM_download(url,i, filename, options = {}){

        return new Promise((resolve, reject) => {
            GM_download({
                url: url,
                name: filename, //不填则自动获取文件名
                saveAs: true, //布尔值，显示"保存为"对话框
                onerror: function (error) {
                    //如果下载最终出现错误，则要执行的回调
                    // console.log(`${filename}下载失败，请重试！`,error)

                    reject(error)

                },
                onprogress: (pro) => {
                    //如果此下载取得了一些进展，则要执行的回调
                    // console.log(pro.loaded) //文件加载量
                    // console.log(pro.totalSize) //文件总大小
                    const pecentage = (pro.loaded / pro.totalSize).toFixed(2) * 100
                    // console.log('.percentage'+ i, 'percentage', pecentage)

                    $('.percentage'+ i).text(pecentage + '%')
                    $('.progress'+ i).val(pecentage)
                    // console.log(`${filename}下载进度：${pecentage}%`)
                },
                ontimeout: () => {
                    //如果此下载由于超时而失败，则要执行的回调
                },
                onload: () => {
                    //如果此下载完成，则要执行的回调
                    // console.log(`${filename}下载成功`)
                    resolve(`${filename}下载成功`)
                },
                ...options
            })


        })

    }



    async function downloadVideo4(url,i, filename) {
        try {
            const res = await promise_GM_download(url,i, filename,{})
            console.log(res)
        }catch(err) {

            $('.error'+ i).removeClass('hiddenTip')
            console.log(err)
        }
        /* GM_download({
            url: url,
            name: filename, //不填则自动获取文件名
            saveAs: true, //布尔值，显示"保存为"对话框
            onerror: function (error) {
                //如果下载最终出现错误，则要执行的回调
                console.log(`${filename}下载失败，请重试！`,error)
            },
            onprogress: (pro) => {
                //如果此下载取得了一些进展，则要执行的回调
                // console.log(pro.loaded) //文件加载量
                // console.log(pro.totalSize) //文件总大小
                const pecentage = pro.loaded / pro.totalSize * 100
                console.log(`${filename}下载进度：${pecentage}%`)
            },
            ontimeout: () => {
                //如果此下载由于超时而失败，则要执行的回调
            },
            onload: () => {
                //如果此下载完成，则要执行的回调
                console.log(`${filename}下载成功`)
            }
        })
        */
    }

    // 往页面上注入弹窗页面
    function addPage() {
        GM_addStyle( `
            .myPage {
           position: fixed;
    top: 50%;
    right: 0;
    padding: 10px;
    background: #eee;
    min-height: 500px;
    width: 500px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    border: 2px solid deepskyblue;
    transform: translate(0%, -50%);
      }
      .title {
        color: deepskyblue;
        font-size: 18px;
        margin: 10px 0;
        font-weight: 700;
      }
      .list {
        /* display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        align-items: flex-start; */
        overflow-x: auto;
        height: 400px;
      }
      .list-title {
        font-size: 14px;
      }
      .list-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 5px;
      }
      .top {
          width: 100%;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
      }
      .bottom {
        width: 100%;
        display: flex;
        justify-content: flex-start;
      }
      .error {
        font-size: 12px;
        color: red;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin: 0 10px;
      }
      .hiddenTip {
        display: none!important;
      }
      .error-tip {

      }
      .progress {
        margin: 0 10px;
      }
      .retryBtn {
        padding: 5px;
        color: #fff;
        background-color: #409eff;
        border: none;
        border-radius: 10%;
        font-size: 12px;
      }
      .line {
        width: 100%;
        height: 1px;
        background-color: #fff;
        margin: 10px 0;
      }
        `)
        const div = document.createElement('div')
        div.classList.add('myPage');
        div.innerHTML = `
     <div class="title">自动下载微信公众号文章中的所有视频</div>
      <div class="list-title">该页面共存在<span class='count'>10</span>个视频文件：</div>
      <div class="list">



      </div>

     `
     document.body.append(div)

    }





    window.onload = function(){
        $('body').on('click', '.retryBtn', function(e) {
            let url = e.target.attributes.getNamedItem('data-src').nodeValue
            const filename = e.target.attributes.getNamedItem('data-filename').nodeValue
            const i = e.target.attributes.getNamedItem('data-i').nodeValue
            // 点击事件处理程序
            console.log('点击了动态添加的元素', e, url,filename,i);
            // url = url.replace('12345', '')
            $('.error'+ i).addClass('hiddenTip')
            downloadVideo4(url, i, filename)

        })
        console.log('onload')
        addPage()
        const videos = window.document.querySelectorAll('video')
        $('.count').text(videos.length)
        for(let i = 0; i < videos.length; i++) {
            let url = videos[i].getAttribute('src')
            const filenameArr = url.split('?')[0].split('/')
            let filename = i+1 + '-' + filenameArr[filenameArr.length - 1]
            const suffixs = filename.split('.')
            const suffix = suffixs[suffixs.length - 1]
            filename =  i+1 + '-' + new Date().getTime() + '.' + suffix
            // if(i === 1) {
            //    url = '12345' + url
            // }

            $('.list').append(`
            <div class="list-item">
          <div class="top">
            <div>${i+1}.</div>
            <div>${filename}:</div>
          </div>
          <div class="bottom">
            <progress class="progress${i+1}" value="0" max="100"></progress>
            <div class="percentage${i+1}">0%</div>
          </div>
          <div class="error hiddenTip error${i+1}">
            <div class="error-tip error-tip${i+1}">下载失败，请重试！</div>
            <button class="retryBtn" data-src=${url} data-i=${i+1} data-filename=${filename}>重试</button>
          </div>
          <div class="line"></div>
        </div>

            `)

            downloadVideo4(url, i+1, filename)
        }

    }


}
)()