// ==UserScript==
// @name        Pixiv图片下载
// @namespace   Violentmonkey Scripts
// @match       https://www.pixiv.net/*
// @grant       unsafeWindow
// @version    1.0
// @author      52lcx
// @grant GM_addStyle
// @grant GM_xmlhttpRequest
// @grant GM_download
// @require    https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js
// @description 添加一个按钮🤤来下载图片
// @downloadURL https://update.greasyfork.org/scripts/488259/Pixiv%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/488259/Pixiv%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
GM_addStyle('.sc-12n125f-0{display:none!important}')
var old_url=""
var observer_url =new MutationObserver(function(){
    var now_url=location.href

    if(old_url===now_url){return}
    else{old_url=now_url
         console.log('url发生变化')
         allFUN();
        }
})
observer_url.observe(document.head,{attributes: true, childList: true, subtree: true})


function allFUN(){

console.log('我执行了')
var novel_have=location.href.match(/novel/)
if (location.href.match(/(\d+)$/)&&novel_have===null){
  setTimeout(function(){
     var button_has=document.querySelector('#download_button')
  if(button_has===null)
    {console.log('没有找到，所以我执行了')
      addButton()}

  },5000)


  var callback = function (mutationsList, observer) {

    // 检查是否已经有了目标图片
    var img = document.querySelector('.sc-1qpw8k9-1');
    if (img) {

//监测链接是否一致

setTimeout(function(){
addButton()


},1000)

      // 停止观察
      observer.disconnect();
    }
  };

  var img_observer = new MutationObserver(callback);
  var config = { attributes: true, childList: true, subtree: true };
  img_observer.observe(document, config);
}
  function addButton(){


      // 创建按钮
      var button = document.createElement('button');
      button.textContent = '🥰';
      button.setAttribute('id', 'download_button');
      button.setAttribute('style', `
        border: none;
        transform: scale(1.3);
        background-color: transparent;
        cursor: pointer;
      `);
      // 下载事件，单张图片，多组图片，插图
      button.addEventListener('click', function () {
        // //进度条
        // function createProgressBar(){
        //   return new Promise(resolve=>{
        //     var  progressBar = document.createElement('progress');
        //        progressBar.max = 100;
        //    progressBar.value = 0;
        //   document.body.appendChild(progressBar);
        //     resolve(progressBar)
        //   })
        // }
var  progressBar = document.createElement('progress');
progressBar.max = 100;
progressBar.value = 0;
progressBar.setAttribute('class', 'progressBar');
progressBar.setAttribute('style', `
    position: fixed;
    top: 10px;
    right: 20px;
    width: 300px;
    height: 20px;
    background-color:white;
`);
document.body.appendChild(progressBar);

        if (document.querySelector(".sc-d98f2c-0.sc-1y32dbe-0.bvRXUX.new-header-logo").getAttribute("href") === "/manga") {
          console.log("这是漫画");
          // 点击阅读全部
          var all = document.querySelector('.sc-emr523-2');
          var all_length = document.querySelector('.sc-1mr081w-0').textContent.split('/')[1];
          all.click();
        loding_img(all_length)
        }
         else if(document.querySelector('.sc-1mr081w-2')){
          console.log('这是多插图')
           var load_all=document.querySelector('.sc-emr523-2')
            all_length = document.querySelector('.sc-1mr081w-0').textContent.split('/')[1];
           if(load_all!==null){load_all.click()
    //        与漫画相同逻辑


           loding_img(all_length)}
           else{
             download_img(all_length)
           }



        }
        else if(document.querySelector('.sc-1qpw8k9-1')){
          console.log('这是单张插画')
          var link=document.querySelector('.sc-1qpw8k9-3').href
          var name=document.querySelector('.sc-1u8nu73-3')
          if(name===null)
          {
          name='插画'
          }
            else{
            name=name.textContent}
          var end=link.split('.').pop()
          if(name==null){name='未知'}
 progressBar=document.querySelector('.progressBar')

GM_xmlhttpRequest({
    method: 'GET',
    url: link,
    responseType: 'blob',
    headers: { referer: "https://i.pximg.net/*" },
    onprogress: function(event) {
        if (event.lengthComputable) {
            var percentComplete = (event.loaded / event.total) * 100;
            progressBar.value = percentComplete;
            console.log('下载进度: ' + percentComplete + '%');
        }
    },
    onload: function(response) {
        var url = URL.createObjectURL(response.response);
        var a = document.createElement('a');
        a.href = url;
        a.download = name + '.' + end;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
        document.querySelector('.progressBar').remove()
    },
    onerror: function(error) {
        console.log('下载失败: ' + error);
       document.querySelector('.progressBar').remove()

    }
});

        }
      });
      // 将按钮添加到指定的父节点
      var place = document.querySelector('.sc-ye57th-1');
      place.appendChild(button);


    GM_addStyle('#download_button { transition: transform 0.3s ease-out !important; } #download_button:hover { transform: scale(2) rotate(360deg) !important; }')

       console.log('按钮添加成功')
  }
function loding_img(all_length)
{
    // 监听页面元素变化，直到图片长度和漫画长度相等为止
          var config = { childList: true, subtree: true };
          function callback() {
            var all_img = document.querySelectorAll('.gtm-expand-full-size-illust');
            var all_img_length = all_img.length;
            var zip = new JSZip();
            if (all_length == all_img_length) {
              var links = Array.from(all_img).map(element => element.href);
              Promise.all(links.map((link, index) => {
                console.log('图片链接')
                console.log(`这是第${index}张图片`);
                var end = link.split('.').pop();
                return new Promise((resolve, reject) => {
                  var progressBar=document.querySelector('.progressBar')
                  GM_xmlhttpRequest({
                    method: 'GET',
                    url: link,
                    responseType: 'blob',
                    headers:{referer:"https://i.pximg.net/*"},
                      onprogress: function(event) {
        if (event.lengthComputable) {
            var percentComplete = (event.loaded / event.total) * 100;
            progressBar.value = percentComplete;
            console.log('下载进度: ' + percentComplete + '%');
        }
    },
                    onload: function (response) {
                      console.log(`下载第${index + 1}张图片成功`);
                      var img_name = `${index + 1}.${end}`;
                      zip.file(img_name, response.response, { binary: true });

                      resolve();
                    },
                    onerror: function () {
                      alert('下载失败！');
                      document.querySelector('.progressBar').remove()
                      observer.disconnect();
                      reject();
                    }
                  });
                });
              })).then(() => {
            document.querySelector('.progressBar').remove()
                zip.generateAsync({ type: 'blob' }).then((content) => {
                  var a = document.createElement('a');
                  a.href = URL.createObjectURL(content);
                  var name = document.querySelector('.sc-1u8nu73-15');

if (name!==null) {
  name = name.textContent;
} else {
  name = document.querySelector('.sc-1qpw8k9-1').alt.split('#').pop()
}



                  a.download = name + '.zip';
                  a.click();

                  console.log('压缩包下载完成');
                });
              }).catch(error => {
                console.error('下载图片或生成 ZIP 文件时出错:', error);
              });
              observer.disconnect();
            }
          }
          var observer = new MutationObserver(callback);
          observer.observe(document, config);
}
function download_img(all_length){
   var all_img = document.querySelectorAll('.gtm-expand-full-size-illust');
            var all_img_length = all_img.length;
            var zip = new JSZip();
            if (all_length == all_img_length) {
              var links = Array.from(all_img).map(element => element.href);
              Promise.all(links.map((link, index) => {
                console.log('图片链接')
                console.log(`这是第${index}张图片`);
                var end = link.split('.').pop();
                var progressBar=document.querySelector('.progressBar')
                return new Promise((resolve, reject) => {
                  GM_xmlhttpRequest({
                    method: 'GET',
                    url: link,
                    responseType: 'blob',
                    headers:{referer:"https://i.pximg.net/*"},
                      onprogress: function(event) {
        if (event.lengthComputable) {
            var percentComplete = (event.loaded / event.total) * 100;
            progressBar.value = percentComplete;
            console.log('下载进度: ' + percentComplete + '%');
        }
    },
                    onload: function (response) {
                      console.log(`下载第${index + 1}张图片成功`);
                      var img_name = `${index + 1}.${end}`;
                      zip.file(img_name, response.response, { binary: true });

                      resolve();
                    },
                    onerror: function () {
                      alert('下载失败！');
                      observer.disconnect();
                      reject();
                    }
                  });
                });
              })).then(() => {
                document.querySelector('.progressBar').remove()
                zip.generateAsync({ type: 'blob' }).then((content) => {
                  var a = document.createElement('a');
                  a.href = URL.createObjectURL(content);

                  var name = document.querySelector('.sc-1u8nu73-15');

if (name!==null) {
  name = name.textContent;
} else {
  name = document.querySelector('.sc-1qpw8k9-1').alt.split('#').pop()
}



                  a.download = name + '.zip';
                  a.click();
                  console.log('压缩包下载完成');
                });
              }).catch(error => {
                console.error('下载图片或生成 ZIP 文件时出错:', error);
              });

            }
}

}

