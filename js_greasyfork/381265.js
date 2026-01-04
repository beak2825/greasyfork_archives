// ==UserScript==
// @name         文件上传
// @namespace    http://www.guahao.com/
// @version      0.1
// @description  上传文件
// @author       aoqh
// @match        *://git.guahao-inc.com/*
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcss.com/vue/2.6.8/vue.min.js
// @connect      catbox.moe
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/381265/%E6%96%87%E4%BB%B6%E4%B8%8A%E4%BC%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/381265/%E6%96%87%E4%BB%B6%E4%B8%8A%E4%BC%A0.meta.js
// ==/UserScript==

(function () {
    const box = document.createElement("div");
    var name = null;
    box.setAttribute("id","imgupload")
    box.innerHTML = `<img-uploader></img-uploader>`
    document.body.append(box);
    Vue.component('img-uploader',{
        data() {
            return {
                message: "上传文件:",
                file: null,
                name:null,
                url: [],
                open: false,
                openHistory: false,
                urlList: [],
                uploadApi: 'catbox',
            };
        },
        computed: {
            notices() {
                if (!this.file) {
                    return ['拖动或者粘贴文件到此处', '支持多个文件']
                } else if (this.file == 'dragenter') {
                    return ['松手']
                } else {
                    function renderSize(value) {
                        if (!value) {
                            return "0 Bytes";
                        }
                        var unitArr = new Array("Bytes", "KB", "MB", "GB", "TB");
                        var index = 0;
                        var srcsize = parseFloat(value);
                        index = Math.floor(Math.log(srcsize) / Math.log(1024));
                        var size = srcsize / Math.pow(1024, index);
                        size = size.toFixed(2);//保留的小数位数
                        return size + unitArr[index];
                    }
                    return Array.from(this.file, el => el.name + ',' + renderSize(el.size))
                }
            }
        },
        methods: {
            pushToUpload() {
                if (!this.file) return;
                this.url = Array.from({ length: this.file.length }, () => '')
                Array.prototype.forEach.call(this.file, (el, index) => {
                    this.upload(el, index)
                })
            },
            upload(file, index) {
                const formData = new FormData();
                let api = "https://catbox.moe/user/api.php";
                formData.append("fileToUpload", file)
                formData.append("reqtype", "fileupload")
                new Promise((resove, reject) => {
                    GM_xmlhttpRequest({
                        url: api,
                        method: "post",
                        data: formData,
                        onload: res => {
                            let resUrl = '';
                            if (res.status == 200) {
                                resUrl = res.responseText
                                if (resUrl) {
                                    resove(resUrl)
                                } else {
                                    reject('失败')
                                }
                            } else {
                                reject('失败')
                            }
                        }
                    });
                }).then((url) => {
                    this.$set(this.url, index, url)
                    this.saveToLocal(url);
                }).catch(text => {
                    this.$set(this.url, index, text)
                })
            },
            copyToClipboard(id) {
                let focus = document.getElementById(id);
                focus.select();
                document.execCommand("copy");
            },
            saveToLocal(url) {
                this.urlList.push(url);
                localStorage.setItem("imgUrl", JSON.stringify(this.urlList));
            },
            fileFilt(file){
                return Array.prototype.filter.call(file,el=> el.type!=null)
            },
            dodrop(ev) {
                this.file = this.fileFilt(ev.dataTransfer.files)
                this.url = []
            },
            pasteEvt(ev) {
                this.file = this.fileFilt(ev.clipboardData.files)
                this.url = []
            },
            change(ev) {
                this.file = this.fileFilt(ev.target.files)
                name = ev.target.files[0].name;
                this.url = []
            },
        },
        filters: {
            addHttp(url) {
                if (/^http(s)?/.test(url)) {
                    return url
                } else {
                    return "https://" + url
                }
            },
            addWithTag(url) {
                if (!url) return '在传了.....';
                return `wget ${url} -O `+name;
            },
        },
        mounted() {
            if (localStorage.getItem("imgUrl")) {
                this.urlList = JSON.parse(localStorage.getItem("imgUrl"));
            } else {
                localStorage.setItem("imgUrl", "[]");
            }
        },
        template:`<div>
<div class="openUpload imgupload-toggle" @click="open = !open">upload</div>
<transition name="warp">
<div class="imgupload-warp upload-layout" v-show="open">
<p>{{message}}</p>
<input
type="file"
multiple="multiple"
:files = "file"
@change="change($event)"
>
<input type="button" value="上传" @click="pushToUpload"/>
<div class="url-box"  v-for="(imgurl,index) in url"  :key = "index">
<input :value="imgurl | addWithTag" :id="'img-url-' + index" readonly>
<input type="button" value="点击复制" @click="copyToClipboard('img-url-' + index)">
</div>

</div>
</transition>
</div>`
    })
    new Vue({ el: "#imgupload" })


    const style = document.createElement("style");
    const heads = document.getElementsByTagName("head");
    style.setAttribute("type", "text/css");
    style.innerHTML = `
.imgupload-warp {
position: fixed;
width: 300px;
padding: 15px;
box-sizing: border-box;
background-color: #eee;
border-radius: 5px;
box-shadow: 0 0 15px #aaa;
z-index: 99;
}
.upload-layout {
min-height: 100px;
top: 93px;
right: 60px;
}
.history-layout {
height: 300px;
right: 60px;
top: 260px;
overflow-y: scroll;
}
.history-layout img {
height: 60px;
vertical-align: middle;

}
.url-box {
margin: 8px 0px;
}
.imgupload-toggle {
position: fixed;
height: 50px;
width: 50px;
font-size:12px;
line-height: 48px;
text-align: center;
border-radius: 50%;
background-color: #fff;
opacity: 0.7;
cursor: pointer;
box-shadow: 0 0 15px #aaa;
user-select: none;
z-index: 99;
}
.imgupload-toggle:hover {
opacity: 1;
}
.openUpload {
top: 203px;
right: 10px;
}
.openHistory {
top: 260px;
right: 10px;
}
.drop-area{
min-height: 100px;
white-space: nowrap;
border: 1px solid black;
padding:2px;
background-color:#fff;
font-size:10px;
over-flow:hidden;
}
.img-history-list{
display:flex;
justify-content : space-between
}
.img-history-list:nth-of-type(2n+1){
background-color:#fff;
}
.img-history-list:nth-of-type(2n){
background-color:#ccc;
}
.warp-enter-active,
.warp-leave-active {
transition: opacity 0.5s;
}
.warp-enter,
.warp-leave-to {
opacity: 0;
}
`
    heads[0].append(style)
})();
