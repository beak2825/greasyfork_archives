// ==UserScript==
// @name         导出日亚Kindle漫画
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  从漫画阅读器页面打包图片资源导出到本地
// @match        https://read.amazon.co.jp/manga/*
// @require      https://unpkg.com/jszip@3.10.1/dist/jszip.js
// @require      https://unpkg.com/@sifrr/storage@0.0.9/dist/sifrr.storage.js
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.co.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535384/%E5%AF%BC%E5%87%BA%E6%97%A5%E4%BA%9AKindle%E6%BC%AB%E7%94%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/535384/%E5%AF%BC%E5%87%BA%E6%97%A5%E4%BA%9AKindle%E6%BC%AB%E7%94%BB.meta.js
// ==/UserScript==

// 等待
function sleep(timeout) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}
// 生成token
async function getToken(asin) {
  const { token, expiresAt } = await (
    await fetch(`/api/manga/getToken/${asin}?sample=true`)
  ).json();

  console.debug(`token有效期至`, new Date(expiresAt));

  return { token, expiresAt };
}

// 解析render tar包数据
class DecompressTar {
  constructor(e) {
    (this.entries = new Map()),
      (this.view = new Uint8Array(e)),
      (this.buffer = e);
  }
  init() {
    let i = 512;
    let e = 0,
      t = 0,
      n = "",
      r = null;
    for (
      ;
      e < this.view.byteLength - 512 &&
      ((n = this.readFileName(e)), 0 != n.length);

    ) {
      (r = this.readFileType(e)), (t = this.readFileSize(e));
      let o = {
        name: n,
        type: r,
        size: t,
        headerOffset: e,
      };
      this.entries.set(n, o),
        (e += i + i * Math.trunc(t / i)),
        t % i && (e += i);
    }
  }
  getEntries() {
    return this.entries;
  }
  readString(e, t) {
    let n = 0,
      r = "";
    for (; 0 != this.view[e + n] && n < t; )
      (r += String.fromCharCode(this.view[e + n])), n++;
    return r;
  }
  readFileName(e) {
    return this.readString(e + 0, 100);
  }
  readFileType(e) {
    let t = String.fromCharCode(this.view[e + 156]);
    return "0" === t ? "file" : "5" === t ? "directory" : t;
  }
  readFileSize(e) {
    let t = "";
    for (let n = 0; n < 12; n++)
      t += String.fromCharCode(this.view[e + 124 + n]);
    return parseInt(t, 8);
  }
  readFileBlob(e, t) {
    let n = new Uint8Array(this.buffer, e, t);
    return new Blob([n]);
  }
  readTextFile(e, t) {
    let n = this.buffer.slice(e, e + t);
    return new TextDecoder().decode(n);
  }
  getText(e) {
    const t = this.entries.get(e);
    if (t) return this.readTextFile(t.headerOffset + 512, t.size);
    throw Error(`Unable to find entry ${e}`);
  }
  getBlob(e) {
    const t = this.entries.get(e);
    if (t) return this.readFileBlob(t.headerOffset + 512, t.size);
    throw Error(`Unable to find entry ${e}`);
  }
}
// 解析render tar包数据
class RenderData {
  constructor(e, r) {
    (this.karamelToken = r), (this.ASSETS_DIR = "assets/");
    (this.pages = new Map()),
      (this.layoutPages = new Map()),
      (this.images = new Map()),
      (this.tokens = new Map()),
      (this.panels = new Map()),
      (this.reader = new DecompressTar(e)),
      this.reader.init();
    this.reader.getEntries().forEach(async (e) => {
      const t = e.name;
      if (
        t.startsWith("img_") ||
        t.startsWith(this.ASSETS_DIR) ||
        t.startsWith("rsrc") ||
        t.endsWith(".png")
      ) {
        await this.addImage(e);
      } else if (t.startsWith("page_")) {
        this.addPage(e);
      } else if (t.startsWith("layout_data_")) {
        this.addLayoutPage(e);
      } else if (t.startsWith("tokens_")) {
        this.addTokens(e);
      } else if (t.startsWith("panels_")) {
        this.addPanels(e);
      } else if (t === "glyphs.json") {
        this.addGlyphs(e);
      } else if (t === "toc.json") {
        this.addTableOfContent(e);
      } else if (t === "metadata.json") {
        this.addMetadata(e);
      } else if (t === "manifest.json") {
        this.addManifest(e);
      } else if (t === "location_map.json") {
        this.addLocationMap(e);
      }
    });
  }
  getType() {
    return "TAR";
  }
  addLocationMap(e) {
    e = this.reader.getText(e.name);
    this.locationMap = JSON.parse(e);
  }

  addManifest(e) {
    e = this.reader.getText(e.name);
    this.manifest = JSON.parse(e);
  }
  async addImage(e) {
    let t = this.reader.getBlob(e.name);
    const encrypt = await t.arrayBuffer();
    const n = await decrypt(encrypt, this.karamelToken);
    t = new Blob([n]);
    this.images.set(e.name, t);
  }
  addPage(e) {
    e = this.reader.getText(e.name);
    JSON.parse(e).forEach((e) => {
      this.pages.set(e.pageIndex, e);
    });
  }
  addLayoutPage(e) {
    e = this.reader.getText(e.name);
    JSON.parse(e).forEach((e) => {
      this.layoutPages.set(e.pageIndex, e);
    });
  }
  addTokens(e) {
    e = this.reader.getText(e.name);
    JSON.parse(e).forEach((e) => {
      this.tokens.set(e.pageIndex, e);
    });
  }
  addPanels(e) {
    e = this.reader.getText(e.name);
    JSON.parse(e).forEach((e) => {
      this.panels.set(e.pageIndex, e);
    });
  }
  addGlyphs(e) {
    e = this.reader.getText(e.name);
    this.fonts = JSON.parse(e);
  }
  addTableOfContent(e) {
    e = this.reader.getText(e.name);
    this.tableOfContent = JSON.parse(e);
  }
  addMetadata(e) {
    e = this.reader.getText(e.name);
    this.metadata = JSON.parse(e);
  }
}


// blob转换文件体积带单位
function formatBlobSize(blobSize) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let bytes = blobSize;
  let unitIndex = 0;

  while (bytes >= 1024 && unitIndex < units.length - 1) {
    bytes /= 1024;
    unitIndex++;
  }

  return `${bytes.toFixed(2)} ${units[unitIndex]}`;
}

//毫秒转换成mm:ss格式
function formatMillisecondsToMinutesSeconds(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const minutesStr = minutes.toString().padStart(2, "0");
  const secondsStr = remainingSeconds.toString().padStart(2, "0");

  return `${minutesStr}:${secondsStr}`;
}

//图片水平合并
function mergeBlobsHorizontally(blobs) {
  return new Promise((resolve, reject) => {
    const images = new Map();

    // 加载所有图片
    blobs.forEach((blob, index) => {
      const image = new Image();
      image.onload = () => {
        images.set(index, image);

        if (images.size === blobs.length) {
          // 所有图片已加载，开始合并
          mergeImages(
            Array.from(images.keys())
              .sort()
              .map((key) => {
                return images.get(key);
              })
          )
            .then(resolve)
            .catch(reject);
        }
      };
      image.onerror = reject;

      // 创建一个URL对象，指向Blob数据
      const url = URL.createObjectURL(blob);
      image.src = url;
    });
  });

  function mergeImages(images) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      let width = 0;
      let height = 0;

      // 计算总宽度和最高高度
      images.forEach((image) => {
        width += image.width;
        if (image.height > height) {
          height = image.height;
        }
      });

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      let xOffset = 0;

      // 绘制每个图片到canvas上
      images.forEach((image) => {
        ctx.drawImage(image, xOffset, 0, image.width, image.height);
        xOffset += image.width;
      });

      // 将canvas内容转换为Blob
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg"); // 可以根据需要更改图片格式
    });
  }
}


let menu_observer=null
var file_db=Sifrr.Storage.getStorage({
  priority: ['indexeddb'], // Priority Array of type of storages to use
  name: 'manga_db', // name of table (treat this as a variable name, i.e. no Spaces or special characters allowed)
})
console.info(`ifrr.Storage version:${file_db.version}`)
onload=()=>{
  
  menu_observer&&menu_observer.disconnect()
  let menu=null

  let bookInfo = document.querySelector("#bookInfo");
  
  let bookInfoJson = JSON.parse(bookInfo.innerText);
  do{
    sleep(200)
    menu=document.querySelector(".kw-rd-chrome-dot-menu")
  }while(menu===null)

    menu_observer=new MutationObserver(([{addedNodes}])=>{
    if(addedNodes.length===1&&addedNodes[0].id==='readerDotMenu'){
      let menu_list=document.querySelector('.kw-rd-dot-menu-items-list')
      let li,button

      function create_export_menu(text){
        li=menu_list.querySelector('li:last-child').cloneNode(true)
        button=li.querySelector('button')
        button.id='export_kindle'
        button.innerText='导出'
        button.onclick=()=>{
          
          if(confirm(text)){
            main(bookInfoJson)
          }
          document.querySelector('#readerChromeTitleBar').click()
        }
        menu_list.appendChild(li)
      }

      const zipName=bookInfoJson.title+'.zip'
      file_db.keys().then(async (keys)=>{
        
        if(keys.includes(zipName)){
          create_export_menu(`将会读取缓存图片数据保存到本地，点击确定继续`)
          li=menu_list.querySelector('li:last-child').cloneNode(true)
          button=li.querySelector('button')
          button.id='clear_current_comic'
          
          const {[zipName]:blob}=await file_db.get(zipName)
          button.innerText=`清空本漫画缓存的${formatBlobSize(blob.size)}数据`
          button.onclick=()=>{
            file_db.del(zipName)

            document.querySelector('#readerChromeTitleBar').click()
          }
          menu_list.appendChild(li)
          
        }else{
          create_export_menu(`将会在后台打包漫画图片资源，请留意页面底部翻页进度下方的红色打包进度条，打包完成会出现一个默认以漫画标题命名的文件另存为弹窗，点击确定继续`)
        }


        if(keys.length>0){
          li=menu_list.querySelector('li:last-child').cloneNode(true)
          button=li.querySelector('button')
          button.id='clear_all_comic'

          const all_manga_data=await file_db.all()
          let manga_value=Object.values(all_manga_data)
          
          button.innerText=`清空所有漫画缓存的${formatBlobSize(manga_value.reduce((a,b)=>{a+=b.size;return a},0))}数据`
          button.onclick=()=>{
            file_db.clear()

            document.querySelector('#readerChromeTitleBar').click()
          }
          menu_list.appendChild(li)
        }

      })

      
    }
  })
  menu_observer.observe(menu,{subtree:true,childList:true})
}
onbeforeunload=()=>{
  menu_observer&&menu_observer.disconnect()
}
async function main(bookInfoJson){
  const startTime = Date.now();
  
  let { contentGuid: revision, asin, title } = bookInfoJson;
  //打包文件名
  const zipName = `${title}.zip`;

  const db_keys=await file_db.keys()
  if(db_keys.includes(zipName)){
    const {[zipName]:blob}=await file_db.get(zipName)
    debugger
    saveAs(blob,zipName)
    return
  }

  let { expiresAt, token } = await getToken(asin);
  async function get_render_data(startingPosition, numPage,locationMap=false) {
    let reply = 3;
    let second = 30;
    while (reply-- > 0) {
      try {
        const render_data = await fetch(
          `https://read.amazon.co.jp/renderer/render?version=3.0&asin=${asin}&contentType=Sample&revision=${revision}&fontFamily=Bookerly&fontSize=4.95&lineHeight=1.4&dpi=160&height=1272&width=1947&marginBottom=0&marginLeft=9&marginRight=9&marginTop=0&maxNumberColumns=2&theme=dark&locationMap=${locationMap}&packageType=TAR&encryptionVersion=NONE&numPage=${numPage}&skipPageCount=0&startingPosition=${startingPosition}&bundleImages=false`,
          {
            headers: {
              "x-amz-rendering-token": token,
            },
          }
        );

        const contentType = render_data.headers.get("content-type");
        if (render_data.status === 200 && contentType === "application/x-tar") {
          return new RenderData(await render_data.arrayBuffer(), {
            expiresAt,
            token,
          });
        } else if (render_data.status === 419) {
          const karamelToken = await getToken(asin);
          expiresAt = karamelToken.karamelToken;
          token = karamelToken.token;
          continue;
        } else {
          console.error(
            `非法render数据，请求状态码：${render_data.status},response content type:${contentType}，${second}秒后请求重试`
          );

          await sleep(second * 1000);
          continue;
        }
      } catch (e) {
        console.error(`render请求失败`, e, `${second}秒后请求重试`);
        await sleep(second * 1000);
        continue;
      }
    }
  }

  console.info(`开始解析漫画${title}  render数据`);
  let render_data = await get_render_data(0, 0,true);
  console.info(`render_data.locationMap.locations`,render_data.locationMap.locations)
  // debugger
  let { images: imageLength, slice } = { images: null, slice:5 };

  // const totalImageLength = render_data.locationMap.locations.length;
  const totalImageLength =new Set(render_data.locationMap.locations).size

  console.debug(`locations:${render_data.locationMap.locations.at(-1)}`)
  if (imageLength === null || imageLength > totalImageLength) {
    imageLength = totalImageLength;
  }

  console.info(`总共要下载${imageLength}张图片`);

  let pageCount = 0;
  let progress
  let totalSize = 0;
  let startingPosition = 1;
  let { per_img_timeout, page_timeout } = {
    per_img_timeout: 500,
    page_timeout: 0,
  };
  console.info(
    `每抓取1张图片等待${per_img_timeout}毫秒，每抓取${slice}张图片等待${page_timeout}毫秒`
  );

  const zip = new JSZip();

  // 获取原始翻页进度元素
  let originalDiv 
  do{
    originalDiv = document.querySelector('#readerChromeOverlayBottom')
    await sleep(100)
  }while(originalDiv===null)

  // 添加下载进度元素
  let download_progress_bg = document.createElement('div')
  download_progress_bg.style.cssText=`width: 100%;height: 10px;background-color: gray;`
  download_progress_bg.innerHTML=`<div  style="width:0;height: 100%;background-color: red;"/>`
  let download_progress=download_progress_bg.querySelector('div')

  originalDiv.appendChild(download_progress_bg )

  do {
    console.debug("startingPosition", startingPosition);

    async function refreshAuth() {
      const renderStartTime = Date.now();
      render_data = await get_render_data(startingPosition, slice);

      console.info(
        "漫画render数据解析完成，耗时：",
        Date.now() - renderStartTime + "ms",
        "\nrender_data",
        render_data
      );

      const {
        manifest: {
          cdn: { baseUrl, authParameter, isEncrypted },
          cdnResources,
        },
        pages,
      } = render_data;

      const pageData = [];
      for (const { children, endPositionId } of pages.values()) {
        let img_filter=children.filter(item=>item.type==='image')
        img_filter.forEach((item) => {
          item.cdnResources = cdnResources.find(
            ({ url }) => item.imageReference === url
          );
          if (item.cdnResources === undefined) {
            console.error(`无法找到图片【${item.imageReference}】二进制数据`);
          }
        });

        pageData.push({
          endPositionId,
          children: img_filter.sort((a, b) => b.elementId - a.elementId),
        });
      }
      return {
        baseUrl,
        pageData,
        cdnResources,
        authParameter,
        isEncrypted,
      };
    }

    let { baseUrl, isEncrypted, pageData, cdnResources, authParameter } =
      await refreshAuth();

  
    console.debug(`分段信息`, pageData);

    console.info("开始下载图片");

    // debugger

    for (let index = 0; index < pageData.length; index++) {
      let { endPositionId, children } = pageData[index];

      let filename;

      let lastImgBlob;

      for (let childIndex = 0,startCount=pageCount; childIndex < children.length; childIndex++,pageCount++) {
        let {
          cdnResources: { url },
        } = children[childIndex];
        authParameter =
          authParameter || children[childIndex].cdnResources.authParameter;

        console.debug(`下载第${pageCount + 1}张图片`);
        const imgStartTime = Date.now();
        let reply = 3,
          c,
          fullurl = `${baseUrl}/${url}?${authParameter}&expiration=${expiresAt}&token=${encodeURIComponent(
            token
          )}`;

        while (reply-- > 0) {
          try {
            c = await fetch(fullurl);
            // debugger
            let u,
              contentType = c.headers.get("content-type");
            if (isEncrypted && contentType === "text/plain") {
              console.debug(`解密第${pageCount + 1}张图片`);
              const e = await c.arrayBuffer();
              const t = await decrypt(e, { token, expiresAt });
              u = new Blob([t]);
            } else if (
              !isEncrypted &&
              contentType === "application/octet-stream"
            ) {
              u = await c.blob();
            } else {
              throw new Error(
                `isEncrypted:${isEncrypted},response content-type:${contentType}`
              );
            }
            // debugger
            console.debug(`第${pageCount + 1}张图片尺寸`, formatBlobSize(u.size));
            totalSize += u.size;

            if (lastImgBlob !== undefined) {
              u = await mergeBlobsHorizontally([lastImgBlob, u]);
              filename = `${startCount + 1}_${startCount + children.length}`;
            } else {
              filename = `${startCount + 1}`;
            }
            lastImgBlob = u;

  
            // debugger
            console.debug(
              `当前图片处理时间${
                Date.now() - imgStartTime
              }ms，累计处理时间${formatMillisecondsToMinutesSeconds(
                Date.now() - startTime
              )}`
            );
          

            if ((pageCount+1) % slice === 0) {
              console.info(
                `抓取了${pageCount+1}张图片，等待${page_timeout}ms继续抓取`
              );
              await sleep(page_timeout);
            } else {
              await sleep(per_img_timeout);
            }
          } finally {
            if (c && c.status === 200 && filename) {
              break;
            } else {
              const error = `下载第${pageCount + 1}张图片出现异常${
                c !== undefined ? `,请求状态码：${c.status}` : ""
              }`;
              console.error(error);
              debugger
              localStorage.setItem("error",  { e: error, fullurl, time: Date.now() });
              const errWait = 30 * 1000;
              console.info(`${errWait}ms 后重新请求`);

              await sleep(errWait);

              if (c && c.status === 403) {
                let newAuth = await refreshAuth();

                baseUrl = newAuth.baseUrl;
                isEncrypted = newAuth.isEncrypted;
                pageData = newAuth.pageData;
                children = pageData[index].children;
                url = children[childIndex].cdnResources.url;
                authParameter =
                  newAuth.authParameter ||
                  children[childIndex].cdnResources.authParameter;

                debugger;
              } else if (c && c.status === 419) {
                const karamelToken = await getToken(asin);
                expiresAt = karamelToken.karamelToken;
                token = karamelToken.token;
              }

              continue;
            }
          }
        }

        progress = +((pageCount * 100) / imageLength).toFixed(2);
        console.info(`处理进度：${progress}%`)
      }

      startingPosition = endPositionId + 1;

      console.debug(`打包${filename}.jfif`);
      filename && zip.file(`${filename}.jfif`, lastImgBlob);
    

      download_progress.style.width = `${progress}%`
    }
  
    
  } while (pageCount<imageLength);

  download_progress.style.width ='100%'

  console.info(
    `${imageLength}张图片打包完成，累计处理时间${formatMillisecondsToMinutesSeconds(
      Date.now() - startTime
    )}`
  );

  zip
    .generateAsync({ type: "blob" })
    .then(function (content) {
      // see FileSaver.js
      console.info({
        title,
        status: "打包完成，下载弹窗中选择保存路径。",
      });
      const zipSize = formatBlobSize(content.size);
      console.info("图片压缩包体积", zipSize);
      
      // 下载完成音效
      //download_complete.play();

      file_db.set(zipName,content)
      saveAs(content, zipName);

      download_progress_bg.remove()
    })
    .finally(() => {
      console.info(`漫画打包完成`);
      onbeforeunload = null;
    });
}


