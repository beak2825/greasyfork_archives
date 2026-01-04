// ==UserScript==
// @name         pan-link
// @namespace    pan-link
// @version      1.1.2
// @author       monkey
// @description  文件一键上传,并获取链接
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @match        *://115.com/*
// @match        *://*.115.com/*
// @match        *://*.miyoushe.com/*
// @match        *://*.console.cloud.tencent.com/*
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/preact/10.6.6/preact.min.js
// @require      https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/axios/0.26.0/axios.min.js
// @require      https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/aws-sdk/2.1083.0/aws-sdk.min.js
// @grant        GM_addStyle
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/499195/pan-link.user.js
// @updateURL https://update.greasyfork.org/scripts/499195/pan-link.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const o=document.createElement("style");o.textContent=e,document.head.append(o)})(" .file-input{display:none}.p-input{padding:10px;width:500px;border-radius:5px;font-size:16px;outline:none;border:none;background-color:#f6c6d954;border-bottom:1px solid #EA4C89}.p-button{background-color:#ea4c89;border-radius:8px;border-style:none;box-sizing:border-box;color:#fff;cursor:pointer;display:inline-block;font-family:Haas Grot Text R Web,Helvetica Neue,Helvetica,Arial,sans-serif;font-size:14px;font-weight:700;height:40px;line-height:20px;list-style:none;margin:0;outline:none;padding:10px 16px;position:relative;text-align:center;text-decoration:none;transition:.3s;vertical-align:baseline;user-select:none;-webkit-user-select:none;touch-action:manipulation}.p-button:hover,.p-button:focus{background-color:#f082ac}@keyframes bar{0%{opacity:0;height:0}}.progress-div p{font-size:16px}.progress-div .bar-container{background-color:#f6c6d9;width:1000px;max-width:95%;height:10px;border-radius:5px;overflow:hidden;animation:bar .4s ease}.progress-div .bar-container>div{width:0;height:100%;background-color:#ea4c89;transition:.4s ease-in-out}@keyframes dialogRotateIn{0%{opacity:0;transform:rotateX(-90deg) translate(-1000px) translateY(-1000px)}}dialog{margin:auto;animation:dialogRotateIn .5s;border:none;outline:none;width:400px;border-radius:10px;padding:20px;box-shadow:0 0 10px #00000040;min-height:200px;font-size:16px;display:flex;flex-direction:column;gap:10px;align-items:center;justify-content:space-around;word-wrap:break-word;word-break:break-all}dialog a{border:none;outline:none}dialog a span{color:#5af}dialog>div{display:flex;gap:10px}dialog::backdrop{background:#251f1f40}.main-div{overflow:hidden;width:100%;top:0;position:sticky;display:flex;flex-direction:column;perspective:1000px;z-index:999999}html{display:flex;flex-direction:column}.main-pan{display:flex;align-items:center;width:100%;min-height:50px}.main-pan .app-main{z-index:999999;top:0;position:sticky;width:100%;background-color:#f0f8ff;display:flex;gap:20px;flex-wrap:wrap;padding:20px} ");

(function (preact, axios, AWS) {
  'use strict';

  var f$1 = 0;
  function u$1(e2, t2, n, o2, i2, u2) {
    t2 || (t2 = {});
    var a2, c2, p2 = t2;
    if ("ref" in p2) for (c2 in p2 = {}, t2) "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
    var l2 = { type: e2, props: p2, key: n, ref: a2, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: --f$1, __i: -1, __u: 0, __source: i2, __self: u2 };
    if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2]);
    return preact.options.vnode && preact.options.vnode(l2), l2;
  }
  const MIX_API = {
    progress: () => {
    },
    abort: null,
    url: "",
    key: ""
  };
  function genFormData(object) {
    let formData = new FormData();
    for (let key in object) {
      object[key] && formData.append(key, object[key]);
    }
    return formData;
  }
  async function copyToClipboard(text) {
    var _a;
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      await navigator.clipboard.writeText(text);
      (_a = window.clipboardData) == null ? void 0 : _a.setData("text", text);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
    document.body.removeChild(textArea);
  }
  function genRandomStr(length = 12, keys = "abcdef0123456789") {
    let result = "";
    for (let i2 = 0; i2 < length; i2++) {
      result += keys[Math.random() * keys.length ^ 0];
    }
    return result;
  }
  function getType(file) {
    let contentType = file.type;
    if (!(contentType == null ? void 0 : contentType.endsWith("; charset=UTF-8"))) {
      contentType += "; charset=UTF-8";
    }
    return contentType;
  }
  function getDownloadHeader(file) {
    return {
      "content-disposition": `inline;filename=${encodeURIComponent(file.name)}`
    };
  }
  function getFileSize(bytes) {
    if (bytes === 0) return "0 B";
    let k2 = 1024;
    let sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    let i2 = Math.floor(Math.log(bytes) / Math.log(k2));
    return (bytes / Math.pow(k2, i2)).toPrecision(3) + " " + sizes[i2];
  }
  function fakeFile() {
    const byteArray = new Uint8Array([72, 101, 108, 108, 111]);
    const blob = new Blob([byteArray], { type: "text/plain" });
    return new File([blob], "hello.txt", { type: "text/plain" });
  }
  function getCookie(name) {
    const cookies = document.cookie.split(";");
    for (let i2 = 0; i2 < cookies.length; i2++) {
      const cookie = cookies[i2].trim();
      if (cookie.indexOf(name + "=") === 0) {
        return cookie.substring((name + "=").length, cookie.length);
      }
    }
    return null;
  }
  async function postObjectUpload(file, key = MIX_API.key || genRandomStr(40), { accessid, policy, signature, url }, extra = {}, resultUrl = () => `${url}${key}`) {
    let data = genFormData({
      name: file.name,
      key,
      policy,
      OSSAccessKeyId: accessid,
      signature,
      "Content-Disposition": getDownloadHeader(file)["content-disposition"],
      ...extra,
      file
    });
    let controller = new AbortController();
    MIX_API.abort = () => controller.abort();
    await axios.post(url, data, {
      headers: {
        "content-type": getType(file)
      },
      timeout: 1e3 * 60 * 60,
      signal: controller.signal,
      onUploadProgress(event) {
        if (!MIX_API.abort) return;
        MIX_API.progress(event.total, event.loaded);
      }
    });
    return resultUrl();
  }
  async function get115Auth() {
    const response = await axios.post(
      "https://uplb.115.com/3.0/sampleinitupload.php",
      {},
      {
        withCredentials: true
      }
    );
    return response.data;
  }
  async function upload115(file, key = MIX_API.key || genRandomStr(40)) {
    const token = await get115Auth();
    const { accessid, callback, host, object, policy, signature } = token;
    return await postObjectUpload(file, key, {
      accessid,
      callback,
      host,
      object,
      policy,
      signature,
      url: "https://fhnfile.oss-cn-shenzhen.aliyuncs.com"
    }, {
      "x-oss-object-acl": "public-read"
    }, () => `${host}/${key}`);
  }
  var t, r, u, i, o = 0, f = [], c = [], e = preact.options, a = e.__b, v = e.__r, l = e.diffed, m = e.__c, s = e.unmount, d = e.__;
  function h(n, t2) {
    e.__h && e.__h(r, n, o || t2), o = 0;
    var u2 = r.__H || (r.__H = { __: [], __h: [] });
    return n >= u2.__.length && u2.__.push({ __V: c }), u2.__[n];
  }
  function p(n) {
    return o = 1, y(D, n);
  }
  function y(n, u2, i2) {
    var o2 = h(t++, 2);
    if (o2.t = n, !o2.__c && (o2.__ = [D(void 0, u2), function(n2) {
      var t2 = o2.__N ? o2.__N[0] : o2.__[0], r2 = o2.t(t2, n2);
      t2 !== r2 && (o2.__N = [r2, o2.__[1]], o2.__c.setState({}));
    }], o2.__c = r, !r.u)) {
      var f2 = function(n2, t2, r2) {
        if (!o2.__c.__H) return true;
        var u3 = o2.__c.__H.__.filter(function(n3) {
          return !!n3.__c;
        });
        if (u3.every(function(n3) {
          return !n3.__N;
        })) return !c2 || c2.call(this, n2, t2, r2);
        var i3 = false;
        return u3.forEach(function(n3) {
          if (n3.__N) {
            var t3 = n3.__[0];
            n3.__ = n3.__N, n3.__N = void 0, t3 !== n3.__[0] && (i3 = true);
          }
        }), !(!i3 && o2.__c.props === n2) && (!c2 || c2.call(this, n2, t2, r2));
      };
      r.u = true;
      var c2 = r.shouldComponentUpdate, e2 = r.componentWillUpdate;
      r.componentWillUpdate = function(n2, t2, r2) {
        if (this.__e) {
          var u3 = c2;
          c2 = void 0, f2(n2, t2, r2), c2 = u3;
        }
        e2 && e2.call(this, n2, t2, r2);
      }, r.shouldComponentUpdate = f2;
    }
    return o2.__N || o2.__;
  }
  function _(n, u2) {
    var i2 = h(t++, 3);
    !e.__s && C(i2.__H, u2) && (i2.__ = n, i2.i = u2, r.__H.__h.push(i2));
  }
  function g() {
    var n = h(t++, 11);
    if (!n.__) {
      for (var u2 = r.__v; null !== u2 && !u2.__m && null !== u2.__; ) u2 = u2.__;
      var i2 = u2.__m || (u2.__m = [0, 0]);
      n.__ = "P" + i2[0] + "-" + i2[1]++;
    }
    return n.__;
  }
  function j() {
    for (var n; n = f.shift(); ) if (n.__P && n.__H) try {
      n.__H.__h.forEach(z), n.__H.__h.forEach(B), n.__H.__h = [];
    } catch (t2) {
      n.__H.__h = [], e.__e(t2, n.__v);
    }
  }
  e.__b = function(n) {
    r = null, a && a(n);
  }, e.__ = function(n, t2) {
    n && t2.__k && t2.__k.__m && (n.__m = t2.__k.__m), d && d(n, t2);
  }, e.__r = function(n) {
    v && v(n), t = 0;
    var i2 = (r = n.__c).__H;
    i2 && (u === r ? (i2.__h = [], r.__h = [], i2.__.forEach(function(n2) {
      n2.__N && (n2.__ = n2.__N), n2.__V = c, n2.__N = n2.i = void 0;
    })) : (i2.__h.forEach(z), i2.__h.forEach(B), i2.__h = [], t = 0)), u = r;
  }, e.diffed = function(n) {
    l && l(n);
    var t2 = n.__c;
    t2 && t2.__H && (t2.__H.__h.length && (1 !== f.push(t2) && i === e.requestAnimationFrame || ((i = e.requestAnimationFrame) || w)(j)), t2.__H.__.forEach(function(n2) {
      n2.i && (n2.__H = n2.i), n2.__V !== c && (n2.__ = n2.__V), n2.i = void 0, n2.__V = c;
    })), u = r = null;
  }, e.__c = function(n, t2) {
    t2.some(function(n2) {
      try {
        n2.__h.forEach(z), n2.__h = n2.__h.filter(function(n3) {
          return !n3.__ || B(n3);
        });
      } catch (r2) {
        t2.some(function(n3) {
          n3.__h && (n3.__h = []);
        }), t2 = [], e.__e(r2, n2.__v);
      }
    }), m && m(n, t2);
  }, e.unmount = function(n) {
    s && s(n);
    var t2, r2 = n.__c;
    r2 && r2.__H && (r2.__H.__.forEach(function(n2) {
      try {
        z(n2);
      } catch (n3) {
        t2 = n3;
      }
    }), r2.__H = void 0, t2 && e.__e(t2, r2.__v));
  };
  var k = "function" == typeof requestAnimationFrame;
  function w(n) {
    var t2, r2 = function() {
      clearTimeout(u2), k && cancelAnimationFrame(t2), setTimeout(n);
    }, u2 = setTimeout(r2, 100);
    k && (t2 = requestAnimationFrame(r2));
  }
  function z(n) {
    var t2 = r, u2 = n.__c;
    "function" == typeof u2 && (n.__c = void 0, u2()), r = t2;
  }
  function B(n) {
    var t2 = r;
    n.__c = n.__(), r = t2;
  }
  function C(n, t2) {
    return !n || n.length !== t2.length || t2.some(function(t3, r2) {
      return t3 !== n[r2];
    });
  }
  function D(n, t2) {
    return "function" == typeof t2 ? t2(n) : t2;
  }
  function ProgressBar({ percent }) {
    const id = g();
    _(() => {
      document.getElementById(id).style.width = `${percent.current / Math.max(percent.total, 1) * 100}%`;
    }, [percent]);
    return /* @__PURE__ */ u$1("div", { class: "progress-div", children: [
      /* @__PURE__ */ u$1("div", { className: "bar-container", children: /* @__PURE__ */ u$1("div", { id }) }),
      /* @__PURE__ */ u$1("p", { children: [
        "当前上传进度: ",
        getFileSize(percent.current),
        "/",
        getFileSize(percent.total)
      ] })
    ] });
  }
  function FileDialog({ open = true }) {
    const id = g();
    function close() {
      const dialog = document.getElementById(id);
      if (dialog) {
        dialog.close();
        dialog.style.display = "none";
      }
    }
    _(() => {
      const dialog = document.getElementById(id);
      if (open && dialog) {
        dialog.style.display = "flex";
        dialog.showModal();
      } else {
        close();
      }
    }, [open]);
    return open && /* @__PURE__ */ u$1("dialog", { id, style: {
      display: "none"
    }, children: [
      /* @__PURE__ */ u$1("h2", { children: "上传成功!" }),
      /* @__PURE__ */ u$1("a", { href: MIX_API.url, target: "__blank", children: [
        "文件地址: ",
        /* @__PURE__ */ u$1("span", { children: MIX_API.url })
      ] }),
      /* @__PURE__ */ u$1("div", { children: [
        /* @__PURE__ */ u$1("button", { className: "p-button", onClick: () => {
          MIX_API.url = "";
          close();
        }, children: "关闭" }),
        /* @__PURE__ */ u$1("button", { className: "p-button", onClick: async () => {
          await copyToClipboard(MIX_API.url);
        }, children: "复制地址" })
      ] })
    ] });
  }
  async function getMiyousheAuth() {
    const response = await axios.post(
      "https://bbs-api.miyoushe.com/apihub/wapi/getUploadParams",
      {
        "md5": genRandomStr(32),
        "ext": "jpg",
        "biz": "community",
        "support_content_type": true,
        "support_extra_form_data": true,
        "extra": {
          "upload_source": "UPLOAD_SOURCE_COMMUNITY"
        }
      },
      {
        withCredentials: true
      }
    );
    return response.data;
  }
  async function uploadMiyoushe(file) {
    const token = await getMiyousheAuth();
    let data = token.data;
    let { file_name } = data;
    const { accessid, host, policy, signature } = data.oss;
    let url = host + "/";
    await postObjectUpload(fakeFile(), file_name, {
      accessid,
      policy,
      signature,
      url
    }, {
      "x-oss-object-acl": "public-read-write",
      "x-oss-content-type": "image/jpeg"
    });
    return await postObjectUpload(file, file_name, {
      url
    }, {
      "x-oss-content-type": file.type
    }, () => `${host}/${file_name}`);
  }
  async function getTencentToken() {
    const response = await axios.post(
      "https://console.cloud.tencent.com/cgi/capi",
      {
        "serviceType": "tandon",
        "cmd": "GetCosKeysAndPrefix",
        "data": {
          "Language": "zh-CN",
          "RequestSource": "MC",
          "Version": "2023-01-04"
        },
        "regionId": 1
      },
      {
        params: {
          "cmd": "GetCosKeysAndPrefix",
          "action": "delegate",
          "version": "3",
          "uin": getUIN(),
          "ownerUin": getUIN(),
          "csrfCode": getCSRF()
        }
      }
    );
    return response.data.data.data.Response.Data;
  }
  async function uploadTencent(file) {
    const token = await getTencentToken();
    const {
      Bucket,
      Region,
      Prefix,
      Credentials: {
        SessionToken,
        TmpSecretId,
        TmpSecretKey
      }
    } = token;
    AWS.config.update({
      credentials: new AWS.Credentials(TmpSecretId, TmpSecretKey, SessionToken),
      region: Bucket,
      endpoint: "https://cos.ap-shanghai.myqcloud.com/",
      apiVersion: "2006-03-01"
    });
    const key = Prefix + "/" + genRandomStr();
    const upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket,
        Key: key,
        Body: file,
        ACL: "public-read",
        ContentDisposition: getDownloadHeader(file)["content-disposition"],
        ContentType: file.type
      }
    });
    MIX_API.abort = () => upload.abort();
    upload.on("httpUploadProgress", (progress) => {
      if (!MIX_API.abort) return;
      MIX_API.progress(progress.total, progress.loaded);
    });
    await upload.promise();
    return `https://${Bucket}.cos.${Region}.myqcloud.com/${key}`;
  }
  function getUIN() {
    return getCookie("uin").substring(1);
  }
  function getCSRF(skey = getCookie("skey")) {
    for (var t2 = 5381, r2 = 0, n = skey.length; r2 < n; r2 += 1)
      t2 += (t2 << 5) + skey.charCodeAt(r2);
    return 2147483647 & t2;
  }
  async function startUploadFile(file) {
    let uploadFunc = upload115;
    const domain = window.location.hostname;
    if (domain.endsWith("miyoushe.com")) {
      uploadFunc = uploadMiyoushe;
    }
    if (domain.endsWith("tencent.com")) {
      uploadFunc = uploadTencent;
    }
    try {
      const result = await uploadFunc(file);
      MIX_API.url = result;
    } catch (e2) {
      if (e2.message === "canceled" || e2.message === "Request aborted by user") return;
      alert(`上传失败,发生错误: ${e2.message}`);
    } finally {
      MIX_API.abort = null;
    }
  }
  function App() {
    const fileInputId = g();
    p(0);
    const [percent, setPercent] = p({
      total: 0,
      current: 0
    });
    return /* @__PURE__ */ u$1("div", { className: "app-main", children: [
      percent.total > 0 && /* @__PURE__ */ u$1(ProgressBar, { percent }),
      /* @__PURE__ */ u$1("button", { onClick: () => {
        if (MIX_API.abort) {
          MIX_API.abort();
          return;
        }
        document.getElementById(fileInputId).click();
      }, className: "p-button", children: MIX_API.abort ? "取消上传" : "上传文件" }),
      /* @__PURE__ */ u$1(FileDialog, { open: !!MIX_API.url }),
      /* @__PURE__ */ u$1("input", { type: "file", onChange: async (event) => {
        const file = event.target.files[0];
        event.target.value = "";
        MIX_API.progress = (total, current) => {
          setPercent({
            total,
            current
          });
        };
        await startUploadFile(file);
        setPercent({
          total: 0,
          current: 0
        });
      }, className: "file-input", id: fileInputId })
    ] });
  }
  preact.render(
    /* @__PURE__ */ u$1(App, {}),
    (() => {
      if (document.contentType !== "text/html" && !document.contentType.startsWith("application/json")) {
        return;
      }
      const app = document.createElement("div");
      app.classList.add("main-pan");
      const newDiv = document.createElement("div");
      newDiv.classList.add("main-div");
      document.documentElement.prepend(newDiv);
      newDiv.prepend(app);
      return app;
    })()
  );

})(preact, axios, AWS);