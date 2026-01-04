// ==UserScript==
// @name         B站学习进度记录
// @namespace    https://laijiahao.cn/
// @author       Mrhuanhao赖佳豪
// @description  一个可以记录分P视频进度的脚本
// @version      2.2
// @grant        GM_addStyle
// @exclude      http://search.bilibili.com/*
// @match        https://www.bilibili.com/*
// @match        https://bilibili.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466582/B%E7%AB%99%E5%AD%A6%E4%B9%A0%E8%BF%9B%E5%BA%A6%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/466582/B%E7%AB%99%E5%AD%A6%E4%B9%A0%E8%BF%9B%E5%BA%A6%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

function createAPP() {
  // 创建一个button元素打开box页面
  const open_button = document.createElement('button');
  open_button.innerHTML = '学习进度'; // 设置按钮文本
  open_button.className = 'open-box-button'

  // 将按钮添加到页面上
  document.body.appendChild(open_button);

    //一个信息气泡框
  const  displayNotification = function(text){
    const notification = document.createElement('div');
    notification.textContent = text;
    notification.className = 'notification'
    const closeTimeout = 1000; // 1秒后关闭气泡框
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, closeTimeout);
  };


  let displayVideosList_ = null;

  // 点击open_button后的页面
  const addbox = function () {
    const box = document.createElement('div');

    box.className = 'my-box'

    //搜素的输入框
    const search_input = document.createElement('input');
    search_input.className = 'box-search-input'

    const search_button = document.createElement('button');
    search_button.innerHTML = '搜索'
    search_button.className = 'search-collection-button'

    const collect_button = document.createElement('button');
    collect_button.innerHTML = '收藏'
    collect_button.className = 'collection-button'



    const close_box_button = document.createElement('button');

    const output_button = document.createElement('button');
    const input_button = document.createElement('button')
    
    output_button.innerHTML = '导出'
    output_button.className = 'output-button'

    input_button.innerHTML = '导入'
    input_button.className = 'input-button'
    

    close_box_button.className = 'close-box-button'


    //输出函数
    const outputInfo = function (){
      // 将 collectVideosList 转换为 JSON 字符串
      let collectVideosList = JSON.parse(localStorage.getItem('collectVideosList')) || [];
      const jsonData = JSON.stringify(collectVideosList);
      // 创建一个带有下载链接的 <a> 元素
      const downloadLink = document.createElement('a');
      downloadLink.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonData);
      downloadLink.download = 'collectVideosList.json';

      // 模拟 <a> 元素的点击，触发文件下载
      downloadLink.click();
    }
    const inputInfo = function (){
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.json';
      fileInput.style.display = 'none';
  
      // 监听文件选择事件
      fileInput.addEventListener('change', function(event) {
          const file = event.target.files[0];
          const reader = new FileReader();
  
          reader.onload = function(e) {
              const importedData = JSON.parse(e.target.result);
              // 在这里处理导入的 JSON 数据
              processImportedData(importedData);
          };
  
          reader.readAsText(file);
          document.body.removeChild(fileInput);
      });
  
      document.body.appendChild(fileInput);
      fileInput.click();
    }

    // 处理导入的 JSON 数据
    const processImportedData = function(data) {
      
      console.log('导入的 JSON 数据:', data);
      localStorage.setItem('collectVideosList',JSON.stringify(data))
      displayNotification('导入成功')
      //先移除本地的列表元素
      const videoListContainer = document.querySelector('.my-collection-lists');
      if (videoListContainer) {
        videoListContainer.parentNode.removeChild(videoListContainer);
      }
      //展示列表
      displayVideosList()
    }

    //搜索函数
    const searchInfo = function (){
      // 获取用户输入的关键字
      const keyword = search_input.value.toLowerCase();

      // 获取视频列表容器
      const videoListContainer = document.querySelector('.my-collection-lists');

      // 遍历收藏视频列表
      const videoItems = videoListContainer.getElementsByClassName('lists-item');

      let searchResult = []

      for (let i = 0; i < videoItems.length; i++) {
        const videoItem = videoItems[i];
        const titleElement = videoItem.querySelector('a');
        const title = titleElement.innerText.toLowerCase();

        // 判断标题是否包含关键字
        if (title.includes(keyword)) {
          searchResult.push(title)
          // 显示匹配的视频列表项
          videoItem.style.display = 'block';
        } else {
          // 隐藏不匹配的视频列表项
          videoItem.style.display = 'none';

        }


      }

      if (searchResult.length === 0) {
          displayNotification("没有该视频的相关信息")

      }
    }


    //给关闭按钮一个监听事件 -> 关闭box
    close_box_button.addEventListener('click', function () {
      box.remove();
    })

    //给收藏按钮一个监听事件 -> 获取当前信息
    collect_button.addEventListener('click', collectVideo)


    // 添加点击事件监听器
    box.appendChild(close_box_button);
    box.appendChild(search_input);
    box.appendChild(search_button);
    box.appendChild(collect_button);
    box.appendChild(output_button);
    box.appendChild(input_button);
    document.body.appendChild(box);



    // 搜索按钮点击事件处理程序
    search_button.addEventListener('click',searchInfo);

    // 设置按钮点击事件处理程序
    output_button.addEventListener('click',outputInfo);
    input_button.addEventListener('click',inputInfo)

    //展示视频列表
    const displayVideosList = function () {
      //先去自动获取本地的视频信息
      let collectVideosList = JSON.parse(localStorage.getItem('collectVideosList')) || [];
      //检索一下当前页面的视频

      const my_collection_lists = document.createElement('ul');
      my_collection_lists.className = 'my-collection-lists'


      //{title: title, url: video_url, current: current, total: total}
      //对当前的视频信息进行检索，如果本地缓存存在，就获取信息且显示，否则就不显示


      for (let i = 0; i < collectVideosList.length; i++) {
        let video = collectVideosList[i];
        let listItem = document.createElement('li');

        listItem.className = 'lists-item';

        //视频的标题
        listItem.innerHTML = `
                          <div>
                              <a href ="${video.url}" target="_blank" ">${video.title}</a>
                          </div>
                      `;


        //创建一个信息容器
        let infoContainer = document.createElement('div');
        infoContainer.style.display = 'flex';
        infoContainer.style.justifyContent = 'space-between';
        //视频的进度信息
        let progressText = document.createElement('p');
        progressText.innerText = `视频进度: ${video.current}/${video.total}`;


        // 创建移除按钮
        let removeButton = document.createElement('button');
        removeButton.className = 'remove-button'
        removeButton.innerText = '移除';


        // 在点击移除按钮时执行删除操作
        removeButton.addEventListener('click', function () {
          try {

            collectVideosList.splice(i, 1); // 从数组中删除当前项
            //更新本地存储
            localStorage.setItem('collectVideosList', JSON.stringify(collectVideosList));
            listItem.remove(); // 从页面中删除当前列表项
            displayNotification("删除成功")
          } catch (error) {
            displayNotification("删除失败,错误: ", error)
          }


        });




        // 将视频进度和移除按钮添加到容器元素中
        infoContainer.appendChild(progressText);
        infoContainer.appendChild(removeButton);

        // 将容器元素添加到列表项中
        listItem.appendChild(infoContainer);
        // listItem.appendChild(removeButton);
        my_collection_lists.appendChild(listItem);

      }


      //把视频列表添加到页面
      box.appendChild(my_collection_lists)



    };




    displayVideosList_ = displayVideosList;
    //页面加载之后去加载一下列表
    displayVideosList();




  };

  open_button.addEventListener('click', addbox);

  const collectVideo = function () {
    let collectVideosList = JSON.parse(localStorage.getItem('collectVideosList')) || [];

    try {


      //获取视频的信息
      let videoInfo =  getVideoInfo();
      console.log(videoInfo);


      if (videoInfo.status === "success"){
        //判断是否重复
        let bvList = []
        for (let item of collectVideosList) {
          // 将 .title 直接添加到数组中
          bvList.push(item.bv_id)
        }
        // const bv_id = current_url.match(/\/(BV[\w-]+)/)[1];
        bvList.push(videoInfo.data.bv_id)

        if (bvList.length > 0) {
          // 使用 Set 数据结构进行去重
          let uniqueBvLists = new Set(bvList)

          if (uniqueBvLists.size !== bvList.length) {
            throw new Error('存在重复')
          }

        }



        // 存储到本地
        collectVideosList.push(videoInfo.data);
        localStorage.setItem('collectVideosList', JSON.stringify(collectVideosList));
        // 清空视频列表容器
        const videoListContainer = document.querySelector('.my-collection-lists');
        if (videoListContainer) {
          videoListContainer.parentNode.removeChild(videoListContainer);
        }

        displayNotification("收藏成功")

        //去重新加载视频列表
        displayVideosList_();

        // console.log(collectVideosList)

      }else{
        displayNotification("当前不是分P视频，无法收藏")
      }

    } catch (error) {
      displayNotification("收藏失败")
    }




  };


  //获取页面的当前的视频信息 点击收藏之后会进行触发
  const getVideoInfo = function () {

    let current = null;
    let total = null;
    //先判断当前视频是不是属于分p的 head-left
    let existing_left = document.getElementsByClassName('head-left')

    if (existing_left) {
      let tag_total = existing_left[0].innerText
      //对括号进行匹配
      let tag_total_list = tag_total.match(/\d+/g);

      //定义集数信息
      current = tag_total_list[0]
      total = tag_total_list[1]



    } else {
      console.log("当前不是分P视频");
      return {
        "status": "error",
        "msg": "当前不是分P视频"

      }

    }

    try {


      // 获取url
      let title = document.getElementsByClassName('video-title')[0].innerHTML
      let current_url = window.location.href;
      let bv_id = current_url.match(/\/(BV[\w-]+)/)[1];

      //对当前的url进行切割判断，先只提取问号前面的基本url
      let index = current_url.indexOf('?');
      let base_url = current_url.substring(0, index);

      let video_url = base_url + '?p=' + current + '&totalPage=' + total



      const videoInfo = {bv_id: bv_id ,title: title, url: video_url, current: current, total: total }

      // 获取本地的视频信息
      // let collectVideosList = JSON.parse(localStorage.getItem('collectVideosList')) || [];
      // collectVideosList.push({ title: title, url: video_url, current: current, total: total });

      return {
        "status": "success",
        "data": videoInfo,
      }



    } catch (error) {

      displayNotification("当前视频信息获取失败")

    }


  };




  //监听当前进度是否发生变化
  const progressObserve = function (){

    // 监听的目标元素为左侧的选集
    let targetElement = document.getElementsByClassName('head-left');
    // 初始化目标元素的状态

    let previousState = targetElement[0].innerText


    // 定时器间隔时间（毫秒）
    const interval = 5000;
    // 定时器回调函数
    const checkElementState = function () {
    const currentState = targetElement[0].innerText

      // 判断元素状态是否发生变化
      if (currentState !== previousState) {
        console.log(currentState);
        // 元素状态发生变化
        console.log('当前的进度发生变化');
        // 去执行更新的操作
        updateProgress();

        // 更新前一个状态
        previousState = currentState;
      }



  };



  // 获取元素状态的函数，启动计时器
  const timerId = setInterval(checkElementState, interval);

  }


  //更新视频进度
  const updateProgress = function(){

    let videoInfo = getVideoInfo();
    console.log(videoInfo);
    //如果不是分P的视频
    if (videoInfo.status === "success" ){
      let collectVideosList = JSON.parse(localStorage.getItem('collectVideosList')) || [];
      //只有当bv_id存在的是否才去执行这一个更新的操作
      let current_url = window.location.href;
      const bv_id = current_url.match(/\/(BV[\w-]+)/)[1];
      for (let i = 0; i < collectVideosList.length; i++) {
        item = collectVideosList[i]
        if (bv_id == item.bv_id){

          collectVideosList[i] = videoInfo.data
          localStorage.setItem('collectVideosList', JSON.stringify(collectVideosList));
          displayNotification("视频进度更新成功")
        }
      }



    }



  }


  progressObserve();


}


function addStyle() {
  let css = `
.my-box {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99999;
    border: 1px solid #ccc;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    max-height: 100%;
    max-width: 400px;
    width: 90%;
  }

  .open-box-button {
    font-size: 16px;
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 10px;
    z-index: 9999;
    background-color: #FF69B4;
    color: #fff;
    border: none;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .open-box-button:hover {
    cursor: pointer;
    background-color: #ff80bf;
  }

  .my-collection-lists{
    list-style-type: none; /* 去除默认的列表样式 */
    padding: 0; /* 去除列表的内边距 */
    margin: 0; /* 去除列表的外边距 */
    overflow-y: scroll;
    max-height:670px;
  }

.notification {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px;
    border-radius: 5px;
    z-index: 99999;
  }


.lists-item{
    background-color: #f2f2f2; /* 列表项的背景颜色 */
    border: 1px solid #ccc; /* 列表项的边框 */
    padding: 10px; /* 列表项的内边距 */
    margin-bottom: 5px; /* 列表项之间的间距 */
}
.remove-button{
  background-color: #ff4040;
  border: none;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  color: white;
  cursor: pointer;
  font-size: 10px;
  font-weight: bold;
  padding: 5px 7px;
  transition: background-color 0.3s ease-in-out;

}
  .collection-button,
  .search-collection-button {
    padding: 8px 12px;
    background-color: #0094ec;
    font-size: 16px;
    color: #fff;
    border: none;
    border-radius: 4px;
    margin-right: 10px;
    margin-bottom: 10px; /* 调整按钮之间的垂直间距 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .collection-button:hover,
  .search-collection-button:hover {
    background-color: #00AEEC;
    cursor: pointer;
  }

  .box-search-input {
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: none;
    outline: none;
    font-size: 16px;
    font-family: inherit;
    margin-right: 10px; /* 调整输入框和按钮之间的水平间距 */
  }

  .box-search-input:focus {
    border-color: #FF69B4;
    box-shadow: 0 0 4px #FF69B4;
  }

  .output-button {
    position: absolute;
    bottom: 0;
    right: 0;
    outline: none;
    font-size: 12px;
    border: none;
    background: none;

  }
  .output-button:hover{
    cursor: pointer;
  }

  .input-button {
    position: absolute;
    bottom: 0;
    right: 30px;
    outline: none;
    font-size: 12px;
    border: none;
    background: none;

  }
  .input-button:hover{
    cursor: pointer;
  }


.close-box-button {
  position: absolute;
  top: 0;
  right: 0;
  margin: 8px;
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 50%;
  background-color: #ff0000;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: center;
  align-items: center;
}

.close-box-button:hover {
  cursor: pointer;
  background-color: #ff4040;
}

  .close-box-button::before {
    content: "X";
    font-weight: bold;
  }

`
  GM_addStyle(css);
}


(function () {
  'use strict';
  addStyle()
  createAPP()

})();