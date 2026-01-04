// ==UserScript==
// @name         添加自定义css和js(广告屏蔽等)
// @description  可自定义css选择器屏蔽页面广告,添加js脚本
// @namespace    _cus_ad_sp
// @version      2.11.2
// @author       vizo
// @license      MIT
// @include      /https?\:\/\/(?!greasyfork).*/
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addElement
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        unsafeWindow
// @connect      *
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @require      https://unpkg.com/vue@2.6.14/dist/vue.min.js
// @require      https://unpkg.com/tiny-oss@0.5.1/dist/tiny-oss.min.js
// @require      https://unpkg.com/vio-utils@2.7.8/index.js
// @require      https://unpkg.com/@vizoy/tmk-utils@1.4.1/index.js
// @require      https://unpkg.com/@vizoy/sw2@1.0.3/sw2.js
// @require      https://unpkg.com/axios@0.27.2/dist/axios.min.js
// @noframes

// @downloadURL https://update.greasyfork.org/scripts/419964/%E6%B7%BB%E5%8A%A0%E8%87%AA%E5%AE%9A%E4%B9%89css%E5%92%8Cjs%28%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%E7%AD%89%29.user.js
// @updateURL https://update.greasyfork.org/scripts/419964/%E6%B7%BB%E5%8A%A0%E8%87%AA%E5%AE%9A%E4%B9%89css%E5%92%8Cjs%28%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%E7%AD%89%29.meta.js
// ==/UserScript==
Object.assign(TMK, vio)
TMK.sw = sw
unsafeWindow.TMK = TMK
unsafeWindow.$j = $
unsafeWindow.axios = axios

const html = (s) => {
  return s[0]
}

const G = {
  hostIgnore: /\b(taobao|jd|tmall|bilibili|iviewui)\.com|^(192\.|localhost|127\.)\b|\bbaidu\.com\/s\?wd=|quicker/i,
  ifrIgnore: /\b(github|qq|geetest|taobao|aliyundrive|163)\.com|\brecaptcha/i,
  linkIgnore: /\b(github|gitee)\.com/i,
  tmpTime: 0,
  cusStyCnt: '',
  html: html`
    <div id="wp5rh" v-show="dialog1s">
      <div class="mwp_5c" :class="{'expandJS': isExpandJS, 'ld': isLoad}">
        <div class="tit1v">设置</div>
        <div class="tamp-cfg-modal" v-show="isShowTampModal">
          <textarea class="txa-cfg" @change="changeTampCfg" v-model="tampCfgVal" placeholder="oss配置"></textarea>
        </div>
        <div class="c7d-item">
          <p class="stiz">
            <span class="s0l">打开面板快捷键</span>
            <span class="oss-zbtn" @click="hdlTgOssModal">oss</span>
            <span class="view-all-set" @click="hdlViewAllSet">{{ viewSetText }}</span>
          </p>
          <input type="text" class="inpy" v-model="eKey" placeholder="请输入a-z 用逗号隔开">
        </div>
        <div class="c7d-item css-item-xh" v-show="!showAllSet">
          <p class="stiz">
            <span class="s0l">添加css(不含style标签)</span>
            <span class="s0r" :class="{on: disCSS}" @click="hdlTgDisCss">{{ disCssText }}</span>
          </p>
          <textarea class="txtr1z" :class="{'disabled': disCSS}" v-model="texCssVal" :readonly="disCSS" spellcheck="false" placeholder="请输入css代码" @click="hdlExpandJSJs(1)"></textarea>
        </div>
        <div class="c7d-item js-item-xh" v-show="!showAllSet">
          <p class="stiz">
            <span class="s0l">添加js(不含script标签)</span>
            <span class="s0r" :class="{on: disJS}" @click="hdlTgDisJs">{{ disJsText }}</span>
          </p>
          <textarea class="txtr1z" :class="{'disabled': disJS}" v-model="texJsVal" :readonly="disJS" spellcheck="false" placeholder="请输入js代码" @click="hdlExpandJSJs(2)"></textarea>
        </div>
        <div class="c7d-item allset-item" v-show="showAllSet">
          <p class="stiz st1k">
            <span class="s1p">已添加的网站(可删除) {{ addedNum }} 个 </span>
            <span class="s2p imt-c" @click="hdlImportCfg">导入配置</span>
            <span class="s2p ext-c" @click="hdlExportCfg">导出配置</span>
          </p>
          <input type="file" hidden ref="inp_hide" @change="hdlUpFile">  
          <textarea class="txtr1z" v-model="allAddedText"></textarea>
        </div>
        <div class="btn-w">
          <button class="c5kbtn b2" @click="hdlCancel">取消</button>
          <button class="c5kbtn b1" @click="hdlSave">保存</button>
        </div>
      </div>
    </div>
  `,
}

;(function() {
  if (TMK.isMobile()) return
  let k = GM_getValue(`_cfg_${location.host}`) || {}
  k = typeof k === 'string' ? JSON.parse(k) : k
  if (k.css && !k.disCSS) {
    tryAddCusSty(k.css)
  }
})();

tryAddGmSty()

function tryAddGmSty() {
  const isAdd = document.head.querySelector('.sty777rx')
  if (!isAdd) {
    GM_addElement('style', {
      class: 'sty777rx',
      textContent: `
        html body .dn8x {
          display: none !important;
          visibility: hidden !important;
          overflow: hidden !important;
          height: 0 !important;
          width: 0 !important;
          transform: scale(0) !important;
          position: fixed !important;
          top: -99999px !important;
          left: -99999px !important;
          z-index: -100;
        }
        html body .GM-Asd-yisi,
        html body .GM-Asd-certain {
          overflow: hidden !important;
          background-image: none !important;
        }
        html body .adsbygoogle {
          display: none !important;
        }
        .GM-Asd-yisi::before,
        .GM-Asd-certain::before {
          content: attr(fxkasd);
          width: 100% !important;
          height: 100% !important;
          font-size: 16px;
          color: #ddd !important;
          background-color: transparent !important;
          display: flex !important;
          justify-content: center;
          align-items: center;
          font-weight: normal;
          font-style: normal;
          font-family: Arial sans-serif;
          position: absolute !important;
          top: 0;
          left: 0;
          z-index: 1;
        }
        .GM-Asd-certain.imgRx,
        .GM-Asd-certain.ifrIx,
        img.GM-Asd-certain {
          visibility: hidden !important;
          overflow: hidden !important;
          height: 0 !important;
        }
           
        .GM-Asd-certain.bdAsd::before {
          content: '百度广告' !important;
        }
        .GM-Asd-certain.gooAsd::before {
          content: '谷歌广告' !important;
        }
        .GM-Asd-certain.qrc7Box::before {
          content: '二维码';
        }
        .GM-Asd-yisi > *,
        .GM-Asd-certain > * {
          visibility: hidden !important;
          opacity: 0 !important;
        }
        .GM-Asd-yisi:hover > *,
        .GM-Asd-certain:hover > * {
          visibility: visible !important;
          opacity: 0.8 !important;
          animation: anim5z 1.7s both;
        }
        html .rtv8x {
          position: relative !important;
        }
        @keyframes anim5z {
          0% {
            opacity: 0;
          }
          30% {
            opacity: 0;
          }
          100% {
            opacity: 0.8;
          }
        }
        @keyframes anim8z {
          90% {
            visibility: visible;
          }
          100% {
            opacity: 0;
            visibility: hidden;
          }
        }
           
        .GM-Asd-yisi:hover::before,
        .GM-Asd-certain:hover::before {
          animation: anim8z 1.5s both;
        }
        #wp5rh [hidden] {
          display: none !important;
        }
        #wp5rh, #wp5rh * {
          margin: 0;
          padding: 0;
          box-sizing: border-box !important;
        }
        #wp5rh {
          width: 28vw;
          height: 68vh;
          min-width: 440px;
          min-height: 400px;
          padding: 30px;
          background: #fff;
          border-radius: 3px;
          font-family: sans-serif,"HelveticaNeue",Helvetica,"PingFangSC","MicrosoftYaHei","HiraginoSansGB",Arial;
          line-height: 1.5;
          font-size: 12px;
          resize: both;
          box-shadow: 0 0 5px #ccc;
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 50050;
          margin: auto;
        }
        #wp5rh .mwp_5c {
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        #wp5rh .mwp_5c::before {
          content: '加载中...';
          background: #fff9;
          font-size: 14px;
          color: #999;
          justify-content: center;
          align-items: center;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 1;
          display: none;
        }
        #wp5rh .mwp_5c.ld::before {
          display: flex;
        }
        #wp5rh .tit1v {
          color: #555;
          font-size: 18px;
          text-align: center;
          margin-bottom: 15px;
        }
        #wp5rh .c7d-item {
          margin-bottom: 10px;
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
        }
        #wp5rh .allset-item {
          flex: 1;
        }
        #wp5rh .css-item-xh {
          flex: 3;
          transition: flex .3s;
        }
        #wp5rh .js-item-xh {
          flex: 1;
          transition: flex .3s;
        }
        #wp5rh .mwp_5c.expandJS .css-item-xh {
          flex: 1;
        }
        #wp5rh .mwp_5c.expandJS .js-item-xh {
          flex: 3;
        }
        #wp5rh .stiz {
          font-size: 14px;
          color: #555;
          margin-bottom: 3px;
          position: relative;
          text-align: left;
          display: flex;
        }
        #wp5rh .tamp-cfg-modal {
          width: 250px;
          height: 170px;
          padding: 10px;
          border-radius: 2px;
          background: #f1f1f1;
          position: absolute;
          top: -50px;
          right: 0;
          bottom: 0;
          left: 0;
          margin: auto;
          z-index: 2;
        }
        #wp5rh .tamp-cfg-modal .txa-cfg {
          width: 100%;
          height: 100%;
          resize: none;
          color: #777 !important;
          font-family: Consolas;
          font-size: 12px;
          padding: 6px;
          overflow-y: auto;
          border: 1px solid #e6e6e6;
          background: #fafafa;
        }
        #wp5rh .tamp-cfg-modal .txa-cfg::-webkit-input-placeholder {
          color: #ccc !important;
        }
        #wp5rh .stiz .s0l {
          flex: 1;
        }
        #wp5rh .stiz .s0r {
          color: #09e;
          cursor: pointer;
          user-select: none;
          margin-left: 10px;
        }
        #wp5rh .stiz .s0r.on {
          color: #9a9a9a;
        }
        #wp5rh .oss-zbtn {
          color: #c7c7c7;
          cursor: pointer;
          user-select: none;
          margin-right: 10px;
        }
        #wp5rh .view-all-set {
          color: #09e;
          cursor: pointer;
          user-select: none;
        }
        #wp5rh .st1k {
          display: flex;
        }
        #wp5rh .st1k .s1p {
          flex: 1;
        }
        #wp5rh .st1k .s2p {
          width: 65px;
          color: #09e;
          cursor: pointer;
          text-align: right;
          white-space: nowrap;
          overflow: hidden;
        }
        #wp5rh .inpy {
          flex: 0 0 auto;
          height: 32px;
          border: 1px solid #ddd;
          color: #555;
          background: #fff;
          border-radius: 2px;
          padding: 0 10px;
          outline: none;
        }
        #wp5rh .inpy:focus {
          border: 1px solid #c1c1c1;
        }
        #wp5rh .txtr1z {
          width: 100%;
          flex: 1;
          color: #555;
          padding: 6px;
          line-height: 1.4;
          overflow-x: hidden;
          overflow-y: auto;
          border-radius: 2px;
          border: 1px solid #ddd;
          background: #fff;
          font-size: 12px;
          resize: none;
          white-space: pre-line;
          outline: none;
          font-family: Consolas,sans-serif,"Helvetica Neue",Helvetica,"PingFang SC","Microsoft YaHei";
        }
        #wp5rh .txtr1z::-webkit-input-placeholder {
          color: #c5c5c5;
        }
        #wp5rh .txtr1z:focus {
          border: 1px solid #39e;
        }
        #wp5rh .txtr1z.disabled {
          color: #999;
          background: #f5f5f5;
        }
        #wp5rh .txtr1z::-webkit-scrollbar {
          width: 4px;
        }
        #wp5rh .txtr1z::-webkit-scrollbar-corner,
        #wp5rh .txtr1z::-webkit-scrollbar-track {
          background-color: #fff;
        }
        #wp5rh .txtr1z::-webkit-scrollbar-thumb {
          background: #fff;
        }
        #wp5rh .txtr1z:hover::-webkit-scrollbar-thumb {
          background: #e1e1e1;
        }
        #wp5rh .txtr1z:hover::-webkit-scrollbar-corner,
        #wp5rh .txtr1z:hover::-webkit-scrollbar-track {
          background-color: #f7f7f7;
        }
        #wp5rh .btn-w {
          margin-top: 5px;
          display: flex;
          flex-direction: row-reverse;
        }
        #wp5rh .btn-w .c5kbtn {
          width: 90px;
          height: 32px;
          border-radius: 2px;
          margin-right: 10px;
          font-family: sans-serif,"Helvetica Neue",Helvetica,"PingFang SC","Microsoft YaHei" !important;
          cursor: pointer;
          outline: none;
          border: 0;
        }
        #wp5rh .btn-w .c5kbtn.b1 {
          color: #fff !important;
          background: #09e !important;
        }
        #wp5rh .btn-w .c5kbtn.b2 {
          color: #555 !important;
          background: #f1f1f1 !important;
        }
        #wp5rh .btn-w .c5kbtn:first-child {
          margin-right: 0;
        }
        #wp5rh .btn-w .c5kbtn:focus {
          border: 0;
        }
        #wp5rh .btn-w .c5kbtn:hover {
          opacity: 0.9;
        }
      `,
    })
  }
}

const vm = new Vue({
  data() {
    return {
      // 模态框状态
      dialog1s: false,
      // 快捷键名称
      eKey: '',
      showAllSet: false,
      // css代码
      texCssVal: '',
      // js代码
      texJsVal: '',
      // 已添加的网站
      allAddedText: '',
      disCSS: false,
      disJS: false,
      // 是否展开js
      isExpandJS: false,
      isLoad: false,
      // oss配置modal
      isShowTampModal: false,
      tampCfgVal: '',
    }
  },
  computed: {
    viewSetText() {
      return this.showAllSet ? '查看当前网站' : '查看全部网站'
    },
    addedNum() {
      return this.allAddedText
        .split('\n')
        .filter(v => !!v)
        .length
    },
    disCssText() {
      return this.disCSS ? '已禁用' : '禁用css'
    },
    disJsText() {
      return this.disJS ? '已禁用' : '禁用js'
    },
  },
  watch: {
    eKey(nVal) {
      this.eKey = /[a-z\,]/.test(nVal) ? nVal : ''
      GM_setValue('_gus_keyboard', this.eKey)
    },
    dialog1s(nVal) {
      if (!nVal) {
        this.showAllSet = false
        this.isShowTampModal = false
      }
    },
  },
  methods: {
    setGmVal(obj) {
      obj.firstTime = obj.firstTime ?? Math.trunc(Date.now() / 1e3)
      return GM_setValue(`_cfg_${location.host}`, obj)
    },
    getGmVal() {
      let gmVal = GM_getValue(`_cfg_${location.host}`) || {}
      return typeof gmVal === 'string' ? JSON.parse(gmVal) : gmVal
    },
    hdlTgOssModal() {
      this.isShowTampModal = !this.isShowTampModal
    },
    hdlExpandJSJs(type) {
      this.isExpandJS = type === 2
    },
    changeTampCfg() {
      GM_setValue('tampOssCfg7n', this.tampCfgVal)
    },
    async hdlSave() {
      if (!this.showAllSet) {
        this.saveCssAndJs()
        this.initAddedWebToTextArea()
      } else {
        this.updateTextAreaValToGm()
        await this.saveJsonToOss('state')
        await this.saveJsonToOss('cfg')
        location.reload()
      }
      this.dialog1s = false
    },
    hdlCancel() {
      this.dialog1s = false
    },
    // 禁用css
    hdlTgDisCss() {
      this.disCSS = !this.disCSS
    },
    // 禁用js
    hdlTgDisJs() {
      this.disJS = !this.disJS
    },
    async saveCssAndJs() {
      tryAddCusSty(this.texCssVal)
      
      document.querySelectorAll('.cusSty9z1p').forEach((v, i, y) => {
        if (i !== y.length - 1) {
          v.remove()
        } else {
          v.disabled = this.disCSS
        }
      })
      
      const gm = this.getGmVal()
      this.setGmVal({
        ...gm,
        css: this.texCssVal,
        js: this.texJsVal,
        disCSS: this.disCSS,
        disJS: this.disJS,
      })
      
      if (!this.texCssVal && !this.texJsVal) {
        GM_deleteValue(`_cfg_${location.host}`)
      }
      
      // 同步至oss
      if ( !await this.saveJsonToOss('state') ) {
        alert('同步失败, 请导出配置后在其他网站重新导入配置就能同步了')
        return
      }
      await this.saveJsonToOss('cfg')
      
      if (
        gm.disJS !== this.disJS
        || gm.js !== this.texJsVal
        || !this.texCssVal.trim()
        && !this.texJsVal.trim()
      ) {
        await TMK.timeout(500)
        location.reload()
      }
      
    },
    saveJsonToOss(name) {
      let gmCfg = GM_getValue('tampOssCfg7n')
      if (!gmCfg) return Promise.resolve(true)
      gmCfg = typeof gmCfg === 'string' ? JSON.parse(gmCfg) : gmCfg
      const oss = new TinyOSS(gmCfg.ossParams)
      const lastTime = Date.now()
      const data = name === 'state' ? { lastTime } : this.getAllCfg()
      const blob = new Blob([JSON.stringify(data)], { type: 'text/json' })
      const date = TMK.fmt(Date.now(), 'Y-M-D')
      
      GM_setValue('tampCfgUpdateTime', lastTime)
      return new Promise(async (resolve) => {
        try {
          if (name === 'cfg') {
            oss.put(`json/tamp-cfg/cus-cssjs/${date}/${name}.json`, blob)
            await TMK.timeout(300)
          }
          await oss.put(`json/tamp-cfg/cus-cssjs/1-cfg/${name}.json`, blob, {
            onprogress(e) {
              if (e.total > 0) {
                return resolve(true)
              }
            }
          })
        } catch (err) {
          return resolve(false)
        }
      })
    },
    
    GM_req(url) {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          url,
          method: 'get',
          responseType: 'json',
          onload: function(xhr) {
            resolve(xhr.response)
          },
        })
      })
    },
    
    async updateCfgFromOss() {
      const gmCfg = this.getOssCfg()
      const gmLastTime = GM_getValue('tampCfgUpdateTime')
      if (gmCfg) {
        try {
          const url1 = `${gmCfg.state}&t=${Date.now()}`
          const url2 = `${gmCfg.cfg}&t=${Date.now()}`
          const res = await this.GM_req(url1)
          const { lastTime } = res
          const now = Date.now()
          
          if (
            !gmLastTime
            || lastTime > gmLastTime
            || now - gmLastTime > 3e4
          ) {
            const rCfg = await this.GM_req(url2)
            this.updateJsonToGm(rCfg)
            // 这里也初始化一次
            this.initAddedWebToTextArea()
            GM_setValue('tampCfgUpdateTime', now)
          }
        } catch (e) {
          TMK.log( e.message )
        }
      }
    },
    
    // 判断是否从远程更新
    tryUpdateCfgFromOss() {
      const gmTime = GM_getValue('pageRefreshTime')
      const now = Date.now()
      if (!gmTime || now - gmTime > 5000) {
        GM_setValue('pageRefreshTime', now)
        return new Promise(async (resolve) => {
          this.isLoad = true
          await this.updateCfgFromOss()
          this.isLoad = false
          resolve()
        })
      }
    },
    
    updateTextAreaValToGm() {
      const gmArr = GM_listValues()
        .filter(v => v.startsWith('_cfg_'))
        .map(v => v.replace(/^_cfg_/, ''))
      const cArr = this.allAddedText.split('\n')
      gmArr.forEach(v => {
        if (!cArr.some(c => v === c)) {
          GM_deleteValue(`_cfg_${v}`)
        }
      })
    },
    
    updateJsonToGm(obj) {
      if (!obj) return
      GM_listValues()
        .filter(v => /^_gus_|^_cfg_/.test(v))
        .forEach(v => {
          GM_deleteValue(v)
        })
      
      // 初始化firstTime
      for (let i in obj) {
        if (!obj[i].firstTime) {
          obj[i].firstTime = Math.trunc(Date.now() / 1e3)
        }
      }
        
      for (let k in obj) {
        GM_setValue(k, obj[k])
      }
    },
    
    tgCfgDialog() {
      this.dialog1s = !this.dialog1s
    },
    hdlViewAllSet() {
      this.showAllSet = !this.showAllSet
    },
    // 导入配置
    hdlImportCfg() {
      this.$refs.inp_hide.click()
    },
    // 导出配置
    hdlExportCfg() {
      const obj = this.getAllCfg()
      TMK.downloadText(JSON.stringify(obj, null, 2), '1.json')
    },
    
    // 获取oss配置
    getOssCfg() {
      let gmCfg = GM_getValue('tampOssCfg7n')
      if (!gmCfg) return
      try {
        return typeof gmCfg === 'string' ? JSON.parse(gmCfg) : gmCfg
      } catch (err) {}
    },
    
    initOssVal() {
      const gmCfg = this.getOssCfg()
      if (gmCfg) {
        this.tampCfgVal = JSON.stringify(gmCfg)
      }
    },
    
    // 获取所有已配置的网站数据
    getAllCfg() {
      const obj = GM_listValues()
        .filter(v => /^_gus_|^_cfg_/.test(v))
        .reduce((acc, v) => {
          let gmVal = GM_getValue(v)
          gmVal = typeof gmVal === 'string' && gmVal > 1 ? JSON.parse(gmVal) : gmVal
          return {
            ...acc,
            [v]: gmVal
          }
        }, {})
      for (let k in obj) {
        if (k.startsWith('_cfg_')) {
          if (!obj[k]?.css.trim() && !obj[k]?.js.trim()) {
            Reflect.deleteProperty(obj, k)
          }
        }
      }
      return obj
    },
    
    hdlUpFile(e) {
      let file = e.target.files[0]
      if (file) {
        let reader = new FileReader()
        reader.readAsText(file, 'utf-8')
        reader.onload = async (evt) => {
          try {
            oUp = JSON.parse(evt.target.result)
            this.updateJsonToGm(oUp)
            
            if (!await this.saveJsonToOss('state')) {
              alert('上传失败, 请选择其他网站重新上传')
              return
            }
            await this.saveJsonToOss('cfg')
            
            this.initCssJsVal()
            this.initAddedWebToTextArea()
            this.initAddedScript()
            
            setTimeout(() => {
              location.reload()
            }, 200)
          } catch (e) {
            // 上传失败
          }
        }
      }
    },
    async resetCss() {
      this.texCssVal = ''
      this.disCSS = false
      this.setGmVal({
        ...this.getGmVal(),
        css: '',
        disCSS: false,
      })
      await this.saveJsonToOss('state')
      await this.saveJsonToOss('cfg')
      location.reload()
    },
    async resetJs() {
      this.texJsVal = ''
      this.disJS = false
      this.setGmVal({
        ...this.getGmVal(),
        js: '',
        disJS: false,
      })
      await this.saveJsonToOss('state')
      await this.saveJsonToOss('cfg')
      location.reload()
    },
    initEvt() {
      document.addEventListener('keydown', e => {
        const el = e.target
        const edt = el.getAttribute('contenteditable')
        const unEdt = edt !== 'true' && edt !== ''
        if (
          !(/text|search|number|password|tel|url|email/.test(el.type))
          && el.tagName !== 'TEXTAREA'
          && unEdt
          && !e.altKey
          && !e.ctrlKey
          && this.eKey.split(',').map(v => v.trim()).includes(e.key)
        ) {
          this.tgCfgDialog()
        }
        if (/esc/i.test(e.key)) {
          this.dialog1s = false
        }
      })
    },
    initEkey() {
      this.eKey = GM_getValue('_gus_keyboard') || ''
    },
    
    initCssJsVal() {
      this.texCssVal = this.getGmVal().css || ''
      this.texJsVal = this.getGmVal().js || ''
      this.disCSS = !!this.getGmVal().disCSS
      this.disJS = !!this.getGmVal().disJS
    },
    
    initAddedWebToTextArea() {
      const sorted = this.sortSiteList(GM_listValues())
      const nArr = sorted
        .filter(v => v.startsWith('_cfg_'))
        .map(v => v.replace(/^_cfg_/, ''))
      this.allAddedText = nArr.join('\n')
    },
    
    initAddedScript() {
      let js = this.getGmVal().js
      let isDisabled = this.getGmVal().disJS
      if (js && !isDisabled) {
        GM_addElement('script', {
          type: 'module',
          textContent: js,
        })
      }
    },
    
    // 网站列表排序, 按时间倒序排列
    sortSiteList(siteList) {
      if (!siteList.length) return []
      const nArr = siteList.map(v => {
        return {
          name: v,
          t: GM_getValue(v)?.firstTime,
        }
      })
      .sort((a, b) => {
        return a.t - b.t > 0 ? -1 : 0
      })
      .map(v => v.name)
      return nArr
    },
    
  },
  async mounted() {
    this.initEvt()
    this.initOssVal()
    this.initEkey()
    await this.tryUpdateCfgFromOss()
    this.initAddedWebToTextArea()
    this.initCssJsVal()
    this.initAddedScript()
  },
})


function tryAddCusSty(styCnt) {
  const clsName = 'cusSty9z1p'
  if (document.querySelector('.' + clsName)) {
    return
  }
  if (styCnt) {
    G.cusStyCnt = styCnt
  } else {
    styCnt = G.cusStyCnt
  }
  GM_addElement('style', {
    class: clsName,
    textContent: styCnt
  })
}

function tryAppendWp5() {
  const wp5 = document.getElementById('wp5rh')
  if (!wp5) {
    document.body.insertAdjacentHTML('beforeend', G.html)
  }
}

// MKS
// ==== 规则 start gvz =======================
function isIgnHost() {
  return G.hostIgnore.test(location.host + location.pathname)
}

function isIgnLink(linkUrl) {
  try {
    const lnk = new URL(linkUrl.replace(/^\/\//, 'https://'))
    return G.linkIgnore.test(lnk.host + lnk.pathname)
  } catch {
    return false
  }
}

function isIgnIfr(url) {
  try {
    const ifr = new URL(url.replace(/^\/\//, 'https://'))
    return G.ifrIgnore.test(ifr.host + ifr.pathname)
  } catch {
    return false
  }
}

// 是否是广告商
function isAdvertiser(str) {
  return /\b(cpu\.baidu|pos\.baidu|google(sy|ad)|mediav)\b|adsbygoogle|adx\.php/.test(str)
}

function isBlank(el) {
  return /_blank/i.test(el.target)
}

function isHtmlOrBody(el) {
  return /^(body|html)$/i.test(el.nodeName)
}

function imgSrcYsAd(src) {
  if (!src || src.includes('data:image/')) {
    return false
  }
  const str = src.slice(0, 80) + src.slice(-120)
  return /(\b|_)(ad[sv]?|close|adve\w+)[-_]?\d*\.(png|jpg|gif|webp)/i.test(str)
}

function adTxt(s) {
  if (!s) return false
  return /(?<=[^个有打是癣很的多小种])广告(?=[^好太很多不有真比也是还])/.test(s.slice(0, 2000))
}

function adm(s) {
  if (!s || !s.length) return false
  if (typeof s !== 'string' || s.includes('data:image/')) {
    return false
  }
  if (s.length > 2000) {
    s = s.slice(0, 800) + s.slice(-800)
  }
  return (
    /(\b|_)ad[sv]?(ver)?[-_]?\d{0,10}(\b|_)|Adver|\badsense|(\b|_)ad[sv]?[_-]\w+/i.test(s)
    || /(\b|_)ad[A-Z][a-z]{2,6}\d{0,4}\b|[a-z]{4}Ad(\b|_)|(\b|_)sinaad|topAd/.test(s)
    || /[\b_]ave[-_]{1,6}/.test(s)
    || isAdvertiser(s)
  ) && !hasUUID(s)
}

// sgn
function hasAdSign(el, rmTxt = false) {
  if (!el) return false
  const attArr = [...el.attributes].filter(v => v.nodeName !== 'style')
  
  return (adTxt(el.textContent) && !rmTxt)
    || hasAdTextInBeAf(el)
    || attArr.some(v => adm(v.nodeValue) || adTxt(v.nodeValue))
}

function hasSibling(el) {
  return TMK.getSiblings(el).length > 1
}

function isGif(str) {
  if (!str) return false
  return /(\.(gif|php|jsp|asp)(\b|_))|^data:image\/gif;/i.test(str)
}

function ysGifAd(el) {
  const lazy = attr(el, 'data-src')
  const src = attr(el, 'src')
  return isGif(src)
    && !lazy
    && !isSwiper(el.parentElement)
    && likeAdSize(el)
    && !isSmallSize(el)
}

function ysVideoAd(el) {
  if (el.tagName !== 'VIDEO') {
    return
  }
  const loop = attr(el, 'loop')
  const autoplay = attr(el, 'autoplay')
  const muted = attr(el, 'muted')
  return hasAdSign(el)
    || (loop && autoplay && muted && likeAdSize(el))
}

function lnkEqImgUrl(link, imgUrl) {
  return link === imgUrl
}

function isAbs(url) {
  return /^https?|^\/\//i.test(url)
}

function isSwiper(el) {
  const pEl = el.parentElement
  const gEl = pEl.parentElement
  const inc = (ex) => {
    const p = attr(ex, 'class')
    return p ? p.includes('swiper') : false
  }
  return inc(el) || inc(pEl) || inc(gEl)
}

// 大小是否符合广告的尺寸(面积)
function likeAdSize(el) {
  return (
    !isSmallSize(el)
    && !isLargerSize(el)
    && bcr(el).height < 710
  )
}

function isLargerSize(el) {
  return bcr(el).width * bcr(el).height >= 900 * 600
    && !biggerRatio(el)
}

function isSmallSize(el) {
  const w = bcr(el).width
  const h = bcr(el).height
  return (
    (w * h) <= (80 * 40)
    || w < 65
    || h < 30
  )
  && w > 0
  && h > 0
}

function siblingHasAd(el) {
  const sib = TMK.getSiblings(el).filter(v => !/style|script/i.test(v.nodeName))
  return sib.some(v => hasAdSign(v))
}

// 判断是否在页面边角吗角落
function isCorner(el) {
  const winW = window.innerWidth
  const winH = window.innerHeight
  const x = bcr(el).x
  const y = bcr(el).y
  const w = bcr(el).width
  const h = bcr(el).height
  const p = 40
  return (
    (x - p <= 0 && y - p <= 0)
    || (x - p <= 0 && y + h + p >= winH)
    || (x + w + p >= winW && y - p <= 0)
    || (x + w + p >= winW && y + h + p >= winH)
  )
  && (w > 0 && w < 580)
  && (h > 0 && h < 620)
  && isFixed(el)
}

// 靠近顶部
function isNearTop(el) {
  const y = bcr(el).top
  const ht = bcr(document.documentElement).top
  return y >= 0
    && y <= 60
    && ht > -10
    && bcr(el).width > 30
    && bcr(el).height > 30
}

function likeLogo(el) {
  return isNearTop(el)
    && bcr(el).left < 800
    && bcr(el).width < 330
}

function hasUUID(str) {
  return /[a-f\d]{4}(?:[a-f\d]{4}-){4}[a-f\d]{12}/i.test(str)
}

function hasScript(el) {
  return el.querySelectorAll('script').length > 0
}

function hasIframe(el) {
  return el.querySelectorAll('iframe').length > 0
}

function hasAdTextInBeAf(el) {
  const bf = (str) => {
    const cnt = getComputedStyle(el, str).getPropertyValue('content')
    return adTxt(cnt)
  }
  return bf('::before')|| bf('::after')
}

function likeQrcSize(el) {
  const iw = bcr(el).width
  const ih = bcr(el).height
  return iw > 80 && ih > 80 &&
    iw < 385 && ih < 390 &&
    iw / ih > 0.7 && iw / ih < 1.1
}

function isFixed(el) {
  return getComputedStyle(el).position === 'fixed'
}

function isFxk(el) {
  const arr = TMK.pEls(el)
  return !!attr(el, 'fxkasd') || arr.some(v => !!attr(v, 'fxkasd'))
}

// 宽高比例疑似
function ysAdRatio(el) {
  const w = bcr(el).width
  const h = bcr(el).height
  return ( (w / h) > 3.6 || (h / w) > 3.6 )
    && w > 30
    && h > 30
}

function biggerRatio(el) {
  const w = bcr(el).width
  const h = bcr(el).height
  return (w / h) > 10
    && w > 30
    && h > 30
}

function ifrHasIfr(el) {
  try {
    const doc = el.contentWindow?.document
    return [...doc.querySelectorAll('iframe')].length > 0
  } catch {
    return false
  }
}

// MKS
// ===== 规则 end =========================================

function bcr(el) {
  return el.getBoundingClientRect()
}

function setFxK(el, str) {
  el.setAttribute('fxkasd', str.toUpperCase())
}

function attr(el, p) {
  return el ? el.getAttribute(p) : ''
}

// 内联a标签转换为inline-block
function setInlineBlock(link) {
  if (getComputedStyle(link).display === 'inline') {
    link.style.display = 'inline-block'
  }
}

// 如果是static则设置为relative
function setEleAsRelative(el) {
  if (getComputedStyle(el).position === 'static') {
    el.style.position = 'relative'
    el.classList.add('rtv8x')
  }
}

function linkHost(url) {
  return TMK.isAbsUrl(url) ? new URL(url).host : null
}

function compareTwoBox(el1, el2) {
  const w = bcr(el1).width
  const h = bcr(el1).height
  const pw = bcr(el2).width
  const ph = bcr(el2).height
  const cs = getComputedStyle
  const pTop = Number(cs(el1).paddingTop.slice(0, -2))
  const pRight = Number(cs(el1).paddingRight.slice(0, -2))
  const pBom = Number(cs(el1).paddingBottom.slice(0, -2))
  const pLeft = Number(cs(el1).paddingLeft.slice(0, -2))
  return (Math.abs(pw + pLeft + pRight - w) < 32
    && Math.abs(ph + pTop + pBom - h) < 32
    && pw > 36
    && ph > 36)
    || (w < 6 || h < 6)
}

function setCertainCls(el, cls = '') {
  const hasFk = (fk) => {
    return !!el?.src?.includes(fk) || [...el.querySelectorAll('iframe')]?.some(ifr => ifr?.src?.includes(fk))
  }
  const bdCls = hasFk('pos.baidu') ? 'bdAsd' : ''
  const ggCls = hasFk('googlead') ? 'gooAsd' : ''
  const clsStr = `GM-Asd-certain ${bdCls} ${ggCls} ${cls}`.trim().replace(/\s{2,}/, ' ').split(' ')
  el.classList.add(...clsStr)
}

// 删除添加的屏蔽class和标记
function removeAsdMk(el, isRecursive) {
  let dArr = [el]
  if (isRecursive) {
    dArr = [...dArr, ...TMK.pEls(el)]
  }
  dArr.forEach(v => {
    v.classList.remove(
      'GM-Asd-yisi',
      'GM-Asd-certain',
      'bdAsd',
      'gooAsd',
      'qrc7Box',
      'x8x',
    )
    v.removeAttribute('fxkasd')
  })
}

function tryBkSiblingAndReturnRes(el) {
  const sib = TMK.getSiblings(el).filter(v => !/style|script/i.test(v.nodeName))
  let isSuc = false
  sib.forEach(v => {
    if (hasAdSign(v)) {
      isSuc = true
      trySetMkRecursive(v, 'sib01', 'sib02')
    }
  })
  return isSuc
}

function imgIsLargeSize(img) {
  if (img.nodeName !== 'IMG') {
    return false
  }
  return isLargerSize(img)
}

function trySetMkRecursive(el, mk1, mk2, clsStr = '') {
  if (
    !el
    || isFxk(el)
    || el.id === 'wp5rh'
  ) {
    return
  }
  
  const isForce = clsStr.includes('dn8x')
  
  el.classList.add('x8x')
  setEleAsRelative(el)
  
  const zArr = [...[el], ...TMK.pEls(el)].reverse()
  const laEl = zArr[zArr.length - 1]
  
  let isAdd = false
  
  for (let pl of zArr) {
    // 避免Dom嵌套过深
    if (zArr.length > 20) {
      break
    }
    if (compareTwoBox(pl, laEl) && pl !== el) {
      if (
        !isHtmlOrBody(pl)
        && (likeAdSize(laEl) || isForce)
      ) {
        setEleAsRelative(pl)
        setCertainCls(pl, clsStr)
        setFxK(pl, mk1)
        isAdd = true
      }
      break
    }
  }
  
  const ipl = el.parentElement
  if (!likeAdSize(el) && !isForce) {
    return
  }
  
  if (
    !isAdd
    && !isHtmlOrBody(el)
  ) {
    setCertainCls(el, clsStr)
    setFxK(el, mk2)
  } else if (
    !isHtmlOrBody(ipl)
    && (
      !isAdd
      || imgIsLargeSize(el)
    )
  ) {
    setEleAsRelative(ipl)
    setCertainCls(ipl, clsStr + ' imgRx')
    setFxK(ipl, mk2)
  }
}

// 屏蔽body直接子元素疑似AD bda
function blockBodyCdYsAd() {
  document.querySelectorAll('body > *, body > * > *, div[class*="fixed"], div[id*="fixed"]').forEach(el => {
    const isLnk = el.tagName === 'A'
    
    const largesAd = isLnk
      && isLargerSize(el)
      && document.querySelectorAll('*').length > 800
      
    const largerZdx = Number(getComputedStyle(el).zIndex) > 9980
    const imgInLnk = el.querySelectorAll('a > img').length > 0
    const hasVdo = el.querySelectorAll('video').length > 0
    
    if (
      largesAd
      || (
        (
          largerZdx
          || hasScript(el)
          || imgInLnk
          || hasVdo
        )
        && isCorner(el)
        && likeAdSize(el)
      )
    ) {
      el.classList.add('dn8x')
      el.style.display = 'none'
      return
    }
    
  })
}

// 屏蔽div中含有script的疑似AD spt
function blockScriptInDiv() {
  document.querySelectorAll('body script').forEach(el => {
    const pEl = el.parentElement
    
    if (isLargerSize(pEl)) {
      removeAsdMk(el, true)
      return
    }
    
    if (isFxk(pEl)) {
      return
    }
    
    let prevNum = 0
    let prevEl = el.previousElementSibling
    while (prevEl) {
      if (prevEl.nodeName === 'SCRIPT') {
        prevNum++
      }
      prevEl = prevEl.previousElementSibling
    }
    
    if (!prevNum && tryBkSiblingAndReturnRes(el)) {
      return
    }
    
    if (hasAdSign(el) || hasAdSign(pEl)) {
      trySetMkRecursive(pEl, 's01', 's02')
    }
  })
}

// 屏蔽疑似ad的box  sltad
function blockYsSlt() {
  const sArr = ['div[class*="-ad" i]', 'div[class*="ad-" i]', 'div[class*="_ad" i]', 'div[class*="ad_" i]',
  'div[id*="-ad" i]', 'div[id*="ad-" i]', 'div[id*="_ad" i]', 'div[id*="ad_" i]',
  'li[class*="-ad" i]', 'li[class*="ad-" i]', 'li[class*="_ad" i]', 'li[class*="ad_" i]',
  'li[id*="-ad" i]', 'li[id*="ad-" i]', 'li[id*="_ad" i]', 'li[id*="ad_" i]',
  'li[class*="mediav" i]',
  'div[class*="mediav" i]',
  'div[data-spm*="ad-" i]', 'div[class*="ave" i]', 'div[aria-label*="ad-" i]', 'div[id*="ave" i]', 'li[class*="ave" i]', 'li[id*="ave" i]', 'li[data-spm*="ave" i]', 'ins[class*="ad" i]', 'ins[id*="ad" i]',
  ]
  document.querySelectorAll(sArr.join(',')).forEach(el => {
    if (isLargerSize(el)) {
      removeAsdMk(el, true)
      return
    }
    
    if (isFxk(el)) {
      return
    }
    
    if (adm(el.id) || adm(el.className)) {
      if (
        hasAdSign(el)
        && (likeAdSize(el) || isFixed(el))
      ) {
        trySetMkRecursive(el, 's51', 's52')
      }
    }
    
  })
}

// 屏蔽注释中包含广告的下一元素  cmt
function blockCommentsHasAd() {
  let dgLmt = 12
  const cdArr = []
  let cdNds = Array.from(document.body?.childNodes || [])
  while (--dgLmt && cdNds.length) {
    cdArr.push(...cdNds)
    cdNds = cdNds.map(v => [...v.childNodes]).flat(1)
  }
  
  const cmtArr = cdArr.filter(v => {
    return v.nodeType === 8
      && v.nodeValue.length < 50
      && /廣告|广告|\bAD\b|\badsense|\badv/.test(v.nodeValue)
      && !/结束|end/i.test(v.nodeValue)
  })
  
  cmtArr.forEach(v => {
    let nextEl = v.nextElementSibling
    while (nextEl && /style|script/i.test(nextEl.nodeName)) {
      nextEl = nextEl.nextElementSibling
    }
    trySetMkRecursive(nextEl, 'C01', 'C02')
  })
}

// 屏蔽iframe广告 ifs
function blockIfrAd() {
  document.querySelectorAll('iframe').forEach(v => {
    const src = attr(v, 'src')
    
    if (isIgnIfr(src)) {
      return
    }
    
    if (isLargerSize(v)) {
      removeAsdMk(v, true)
      return
    }
    
    if (isAdvertiser(src)) {
      trySetMkRecursive(v, 'f01', 'f02', 'ifrIx dn8x')
      return
    }
    
    const pEl = v.parentElement
    const rLen = () => {
      return [
        hasAdSign(v),
        hasAdSign(pEl),
        ysAdRatio(v),
      ].filter(v => !!v).length
    }
    
    if (
      rLen() >= 1
      || (
        ifrHasIfr(v)
        && ysAdRatio(v)
      )
      || (
        isNearTop(v)
        && ysAdRatio(v)
      )
    ) {
      trySetMkRecursive(v, 'f01', 'f02', 'ifrIx')
    }
  })
}

function blockYsVideoAd() {
  document.querySelectorAll('video').forEach(vdo => {
    const rLen = () => {
      return [
        ysVideoAd(vdo),
      ]
        .filter(v => !!v)
        .length
    }
    
    if (
      rLen() >= 1
      || ysAdRatio(vdo)
    ) {
      trySetMkRecursive(vdo, 'vdo01', 'vdo02', 'vdoRb')
    }
    
  })
}

// ims
function blockYsImgInLink() {
  Array.from(document.querySelectorAll('a > img, a > * > img, a > * > * > img')).forEach(el => {
    const link = el.closest('a')
    const pEl = link.parentElement
    const lnkUrl = attr(link, 'href')
     
    if (isIgnLink(lnkUrl)) {
      return
    }
     
    const rArrLen = () => {
      return [
        isBlank(link),
        ysGifAd(el),
        imgSrcYsAd(attr(el, 'src')),
        hasAdSign(link),
        hasAdSign(pEl),
        hasAdSign(el),
        siblingHasAd(link),
        siblingHasAd(el),
        isNearTop(el),
        biggerRatio(el),
      ].filter(v => !!v).length
    }
    
    if (
      (
        rArrLen() >= 2
        && !isSmallSize(el)
        && !likeLogo(el)
      ) || (
        isCorner(el)
        && ysGifAd(el)
      )
    ) {
      trySetMkRecursive(el, 'i01', 'i02')
    }
     
  })
}

function wchDom() {
  TMK.watchDom('body', TMK.throttle(() => {
    tryAddCusSty()
    tryAddGmSty()
  }, 500))
}

function regMainEvt() {
  ['mousemove', 'scroll'].forEach(evt => {
    document.addEventListener(evt, insMainAdFn)
  })
}

function insMainAdFn() {
  const pnow = performance.now()
  let now = Date.now()
  if (now - G.tmpTime > 800 || pnow < 6000) {
    G.tmpTime = now
    if (!isIgnHost()) {
      
      // 链接下的图片
      blockYsImgInLink()
      blockBodyCdYsAd()
      blockYsSlt()
      blockCommentsHasAd()
      // 确认iframe广告
      blockIfrAd()
      blockScriptInDiv()
      // 视频广告
      blockYsVideoAd()
      
    }
  }
}

function initTimer() {
  insMainAdFn()
  setTimeout(initTimer, performance.now() < 6000 ? 350 : 8000)
}

async function initFunc() {
  if (TMK.isMobile()) return
  
  setTimeout(() => {
    if (!isIgnHost()) {
      regMainEvt()
    }
  }, 5e3)
  
  initTimer()
  
  await TMK.loadEl('body')
  tryAppendWp5()
  vm.$mount('#wp5rh')
  GM_registerMenuCommand('打开设置面板', vm.tgCfgDialog)
  GM_registerMenuCommand('清空当前网站添加的CSS', vm.resetCss)
  GM_registerMenuCommand('清空当前网站添加的JS', vm.resetJs)
  wchDom()
}

initFunc()
