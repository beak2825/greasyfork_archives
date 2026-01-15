// ==UserScript==
// @name         ZJSU抢课小棉袄
// @namespace    https://github.com/Zzzcy-tx/ZJSU_GetMyCoursePLZ
// @version      2.43
// @description  发送包含指定的数据的HTTP POST，用以模拟单次点击。
// @author       Zzzcy
// @match        *://*/jwglxt/xsxk/zzxkyzb_cxZzxkYzbIndex.html*
// @icon         https://jwxt.zjgsu.edu.cn/jwglxt/logo/favicon.ico?t=1725699891340
// @grant        unsafeWindow
// @license      MPL
// @downloadURL https://update.greasyfork.org/scripts/474701/ZJSU%E6%8A%A2%E8%AF%BE%E5%B0%8F%E6%A3%89%E8%A2%84.user.js
// @updateURL https://update.greasyfork.org/scripts/474701/ZJSU%E6%8A%A2%E8%AF%BE%E5%B0%8F%E6%A3%89%E8%A2%84.meta.js
// ==/UserScript==

var data1, route, responseData;
let draggableBox;
const qqNumber = '552241992'
let shouldCaptureFetch = false;

const open = XMLHttpRequest.prototype.open;
const send = XMLHttpRequest.prototype.send;
const originalSend = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.open = function (method, url) {
    //console.log(`yicibuhuo,method=${method}, data=${data}`)
    console.log(url, method);
    if (shouldCaptureFetch) {
        const parser = document.createElement('a');
        parser.href = url;
        //stuNumber = url.substring(58,69);
        //console.log(stuNumber);
    }
    return open.apply(this, arguments);
};

XMLHttpRequest.prototype.send = function (data) {
    console.log(data);
    if (shouldCaptureFetch) {
        data1 = data;
    }
    console.log(data1);
    originalSend.call(this, data);
};

const footer = document.getElementById('footerID');

const resultDiv = document.createElement('div');

resultDiv.textContent = ' 等待开启。';
resultDiv.style.textAlign = 'center';
resultDiv.style.fontFamily = 'Arial';
resultDiv.style.fontWeight = 'bold';
resultDiv.style.fontSize = '20px';
resultDiv.style.marginTop = '20px';
resultDiv.style.marginBottom = '20px';

footer.insertAdjacentElement('beforebegin', resultDiv);

const buttonContainer = document.createElement('div');
buttonContainer.style.display = 'flex';
buttonContainer.style.justifyContent = 'center';
buttonContainer.style.gap = '40px';
buttonContainer.style.marginTop = '20px';
buttonContainer.style.marginBottom = '20px';
buttonContainer.style.textAlign = 'center';
buttonContainer.style.fontFamily = 'Arial';
buttonContainer.style.fontSize = '18px';

// 创建发送 POST 请求按钮
const requestButton = document.createElement('button');
requestButton.style.padding = '5px 15px';
requestButton.textContent = '开始模拟点击';
buttonContainer.appendChild(requestButton); // 将按钮添加到容器中
// 创建停止按钮
const stopButton = document.createElement('button');
stopButton.style.padding = '5px 15px';
stopButton.textContent = '停止模拟点击';
buttonContainer.appendChild(stopButton); // 将按钮添加到容器中
// 创建录制 POST 按钮
const recordButton = document.createElement('button');
recordButton.style.padding = '5px 15px';
recordButton.textContent = '录制点击数据';
buttonContainer.appendChild(recordButton); // 将按钮添加到容器中

// 将按钮容器插入到 footer 之前
footer.insertAdjacentElement('beforebegin', buttonContainer);


let isRequesting = false;


requestButton.addEventListener('click', () => {
  if (!isRequesting) {
    isRequesting = true;
    requestLoop();
  }
});

stopButton.addEventListener('click', () => {
    isRequesting = false;
    resultDiv.textContent = '等待开启。'
});

recordButton.addEventListener('click', () => {
    if(shouldCaptureFetch){
        shouldCaptureFetch = false
        resultDiv.textContent = '未开始监听POST'
    } else {
        shouldCaptureFetch = true
        resultDiv.textContent = '正在监听POST……'
    }
});



async function sendPostRequest() {
  try {
      const data = data1;
      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      const postUrl = `${location.origin}/jwglxt/xsxk/zzxkyzb_xkBcZyZzxkYzb.html?gnmkdm=N253512`;
      xhr.open('POST', postUrl);
      xhr.setRequestHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0');
      xhr.setRequestHeader('Accept', 'application/json, text/javascript, */*; q=0.01');
      xhr.setRequestHeader('Accept-Language', 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2');
      xhr.setRequestHeader('Accept-Encoding', 'gzip, deflate, br');
      xhr.setRequestHeader('Referer', location.href);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.setRequestHeader('Origin', location.origin);
      xhr.setRequestHeader('DNT', '1');
      xhr.setRequestHeader('Connection', 'keep-alive');
      xhr.setRequestHeader('Cookie', `${route}`);
      xhr.setRequestHeader('Sec-Fetch-Dest', 'empty');
      xhr.setRequestHeader('Sec-Fetch-Mode', 'cors');
      xhr.setRequestHeader('Sec-Fetch-Site', 'same-origin');

      xhr.onload = await function() {
          responseData = xhr.response;
          console.log(xhr.response);
      };

      await xhr.send(data);
      var flag = JSON.parse(responseData).flag;
      console.log(flag);

      if(flag === '-1'){
          resultDiv.textContent = '正在等待余量放出，请耐心等待……'
      } else if( flag === '0' ){
          resultDiv.textContent = '排课时间冲突或未正确录制点击数据！请刷新界面'
      } else if( flag === '1' ){
          resultDiv.textContent = '恭喜，抢课成功！ \\^_^// '
      } else {
          resultDiv.textContent = `未知错误，请联系技术人员QQ:${qqNumber}`
      }
      //resultDiv.textContent = JSON.stringify(responseData, null, 2);
      // 如果data.flag等于1，或者停止按钮按下，则停止请求
      if (flag === '1' || flag === '0' || !isRequesting) {
          isRequesting = false;
      }
  } catch (error) {
    console.error('发生错误：', error);
  }
};

async function requestLoop() {
    while (isRequesting) {
        await sendPostRequest();
        await sleep(1000);
        route = document.cookie;
    }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};


//提示界面
(function () {
    const style = document.createElement('style');
    style.textContent =
        `
        .grabclasscontainer {
            width: 320px;
            text-align: center;
            position: fixed;
            right: 0px;
            bottom: 0px;
            height: 350px;
            border: 2px #333 solid;
            background-color: #d5e8fc;
            z-index: 999;
        }

        .grabclasscontainer label {
            flex: 1;
            text-align: right;
            margin-right: 10px;
        }


        .grabclasscontainer .dragBar {
            height: 30px;
            line-height: 30px;
            background-color: #505860;
            cursor: move;
            margin-bottom: 9px;
        }

        .grabclasscontainer .content {
            overflow-y: auto;
            height: 309px;
        }

        .grabclasscontainer .dragBar {
            height: 30px;
            line-height: 30px;
            background-color: #07c160;
            cursor: move;
            margin-bottom: 9px;
        }

        .grabclasscontainer .copyright {
            text-align: left;
        }

        .grabclasscontainer .graberror {
            color: #e91a0b;
        }

        .grabclasscontainer .grabsuccess {
            color: #0be94e;
        }
        `
    document.head.appendChild(style);
    const grabclasscontainer = document.createElement('div');
    grabclasscontainer.className = 'grabclasscontainer';
    grabclasscontainer.id = 'grabclasscontainer';
    grabclasscontainer.innerHTML = `
        <div class="dragBar" id="dragBar">
            按住拖动
        </div>
        <div class="content">
            <div class="copyright">
                【使用方式】<br>
                1.点开你想要的课，确保这课的时间段没有冲突。<br>
                2.滚动到网页最下方，点击“录制点击数据”，然后点右边的“选课”<br>
                3.中间会弹出提示“已无余量，不可选”的提示，点确定。<br>
                4.接着点击网页最下方的“开始模拟点击”，观察按钮上方提示，“正在等待余量放出，请耐心等待……”则为正常<br>
                5.不要关闭网页，不要关闭电脑，最好把网页最大化，等待抢课成功。<br><br><br>
                【联系作者】有偿帮助：QQ：${qqNumber}<br>
            </div>
        </div>
        `
    document.body.appendChild(grabclasscontainer);
    draggableBox = document.getElementById("grabclasscontainer");
    const dragBar = draggableBox.querySelector(".dragBar");
    let isDragging = false;
    let offsetX, offsetY;
    dragBar.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - draggableBox.getBoundingClientRect().left;
        offsetY = e.clientY - draggableBox.getBoundingClientRect().top;
        draggableBox.style.transition = "none";
    });
    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;
        draggableBox.style.left = x + "px";
        draggableBox.style.top = y + "px";
    });
    document.addEventListener("mouseup", () => {
        isDragging = false;
        draggableBox.style.transition = "all 0.3s ease"; // 添加平滑的过渡效果
    });
    draggableBox.querySelector('.clear').addEventListener('click', () => {
        localStorage.removeItem('targetTeacher');
        localStorage.removeItem('targetTime');
        localStorage.removeItem('firstmenu');
        localStorage.removeItem('secondmenu');
    });
})();
