// ==UserScript==
// @name        bili评论区粘贴图片picPaste
// @namespace   Violentmonkey Scripts
// @include      https://www.bilibili.com/video/*
// @include      https://www.bilibili.com/list/*
// @include      https://www.bilibili.com/bangumi/*
// @noframes
// @grant       GM_addStyle
// @version     1.0
// @author      vurses
// @license    GPL
// @description 对bilibili的评论功能增强，发图不再需要点击按钮打开文件夹选中图片。如截图工具截图后后不需要额外保存直接粘贴，可以自己从文件夹选中多张图片复制，
// 因为桌面软件对图文的处理和浏览器有差异，比如微信的聊天框中仅存在一张图片时复制粘贴到评论输入区才有效，所以不能同时粘贴聊天框里的多张图。
// 使用方法：复制好图片后点击评论区触发输入光标，ctrl+v或者右键菜单粘贴即可。
// @downloadURL https://update.greasyfork.org/scripts/512937/bili%E8%AF%84%E8%AE%BA%E5%8C%BA%E7%B2%98%E8%B4%B4%E5%9B%BE%E7%89%87picPaste.user.js
// @updateURL https://update.greasyfork.org/scripts/512937/bili%E8%AF%84%E8%AE%BA%E5%8C%BA%E7%B2%98%E8%B4%B4%E5%9B%BE%E7%89%87picPaste.meta.js
// ==/UserScript==
(() => {
  const interval = setInterval(() => {
    try {
      const commentBox = document
        .querySelector("bili-comments")
        .shadowRoot.querySelector("bili-comments-header-renderer")
        .shadowRoot.querySelector("bili-comment-box");
      if (commentBox) {
        clearInterval(interval);
        scriptCallback();
      }
    } catch (error) {}
  }, 100);
  setTimeout(() => {
    // 不管是否加载完成，15s之后关闭定时器检测
    clearInterval(interval);
  }, 15000);
  const scriptCallback = () => {
    // 获取评论区盒子及其内部的文字、图片输入区
    const commentBox = document
      .querySelector("bili-comments")
      .shadowRoot.querySelector("bili-comments-header-renderer")
      .shadowRoot.querySelector("bili-comment-box");
    // 兼容bangumi评论区
    const textarea = commentBox.richTextarea || commentBox.textarea;
    const picturesUpload = commentBox.picturesUpload;
    const inputarea = textarea?.brt?.editor || textarea.shadowRoot.querySelector('textarea');

    inputarea.addEventListener("paste", async (event) => {
      // 获取剪贴板中的项目
      const items = (event.clipboardData || navigator.clipboardData).items;
      // 多个上传图片任务
      const uploadTasks = [];
      // 遍历所有的剪贴板数据项（一个数据项可能包含多张图片）
      for (let i = 0; i < items.length; i++) {
        // 检查是否是文本类型
        if (items[i].kind === "string") {
        }
        // 检查是否是文件类型（图片）
        else if (
          items[i].kind === "file" &&
          items[i].type.startsWith("image/")
        ) {
          // 获取文件并处理图片
          const file = items[i].getAsFile();
          // 显示图片区
          picturesUpload.style.display = "flex";
          // 初始化图片显示并拿到图片对象方便修改数据
          const taskItem = initPicData(commentBox);
          // 分割每份上传任务避免阻塞
          uploadTasks.push(taskTemplate(taskItem, file, commentBox));
        }
      }
      await Promise.all(uploadTasks);
    });

    // 获取文件的base64编码
    function getBase64FromFile(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    }

    // 将数据交给picturesUpload和commentBox,一个用于显示一个准备上传给服务器
    function initPicData(commentBox) {
      const item = {
        data: {},
        msg: "",
        src: "",
        // 根据status决定图片显示,0为初始化，1正常显示，2显示上传失败
        status: 0,
      };
      commentBox.picturesUpload.items.push(item);
      commentBox.pics.push(item.data);
      return item;
    }

    // 获取cookie某个值
    function getCookie(name) {
      const cookies = document.cookie.split("; ");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split("=");
        const cookieName = cookie[0].trim();
        if (cookieName === name) {
          return decodeURIComponent(cookie[1].trim());
        }
      }
      return null;
    }

    // 上传文件
    function uploadFile(file) {
      const formData = new FormData();
      formData.append("file_up", file);
      formData.append("biz", "new_dyn");
      formData.append("category", "daily");
      formData.append("csrf", getCookie("bili_jct"));

      // 不用显式设置 Content-Type 头，浏览器会自动设置 multipart/form-data
      return fetch("https://api.bilibili.com/x/dynamic/feed/draw/upload_bfs", {
        method: "POST",
        headers: {
          Accept: "*/*",
        },
        credentials: "include",
        body: formData,
      })
        .then((response) => {
          return response.json();
        })
        .catch((reason) => {
          // 网络问题上传失败或者返回0以外的code需要显示图片上传失败
          console.log(reason);
          return { code: -1 };
        });
    }

    // 每个文件上传到返回响应结果后的流程
    async function taskTemplate(taskItem, file, commentBox) {
      // 图片本地上传后更新显示
      const base64String = await getBase64FromFile(file);
      taskItem.src = base64String;
      // hack源码得到的api，修改属性数据时调用更新
      commentBox.picturesUpload.update();

      // 图片上传服务器后更新显示和状态
      const res = await uploadFile(file);
      if (res.code >= 0) {
        const fileInfo = res.data;
        taskItem.data.img_size = fileInfo.img_size;
        taskItem.data.img_width = fileInfo.image_width;
        taskItem.data.img_height = fileInfo.image_height;
        taskItem.data.img_src = fileInfo.image_url;
      }
      taskItem.status = res.code === 0 ? 1 : 2;
      // 响应结果后再次更新
      commentBox.picturesUpload.update();
      commentBox.update();
    }
  };
})();
