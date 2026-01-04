// ==UserScript==
// @name           Lobine Huddle
// @description    Hatena Bookmark Sidebar via Lobine
// @namespace      syon.github
// @include        /^https?://.*$/
// @exclude        https://lobine.app/*
// @require        https://code.jquery.com/jquery-3.5.1.min.js
// @require        https://cdn.jsdelivr.net/npm/vue@2.6.11
// @require        https://cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js
// @version        0.0.4
// @downloadURL https://update.greasyfork.org/scripts/404867/Lobine%20Huddle.user.js
// @updateURL https://update.greasyfork.org/scripts/404867/Lobine%20Huddle.meta.js
// ==/UserScript==

window.jq = $.noConflict(true)

const appTemplate = `
<div v-if="isIframe" id="huddle-target" :class="rootClasses">
  <a href="#" class="huddle-switch" @click.prevent="handleSwitch">
    <div>{{ count }}</div>
  </a>
  <iframe
    v-if="isIframe"
    :src="iframeUrl"
    id="huddle-iframe"
  >
  </iframe>
</div>
`

const appStyle = `
html {
  transition: 0.2s;
  padding-right: 0;
  transition-property: padding-right;
}

html.huddling {
  padding-right: 350px;
  transition-property: padding-right;
}

#huddle-target {
  position: fixed;
  top: 0;
  right: 0;
  width: 350px;
  height: 100vh;
  z-index: 1000000001;
  transition: 0.2s;
  transform: translate3d(350px, 0, 0);
}

#huddle-target.active {
  transform: translate3d(0, 0, 0);
}

#huddle-target #huddle-iframe {
  width: 350px;
  height: 100vh;
  border: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

#huddle-target .MODE-ZERO {
  height: auto;
}

#huddle-target .huddle-switch {
  position: absolute;
  left: -36px;
  top: 33%;
  font-size: 10px;
  color: #FF4081;
  cursor: pointer;
}
`

jq(document).ready(function () {
  try {
    jq(document.lastChild).append(appTemplate)
  } catch (e) {
    jq(document.body).append(appTemplate)
  }

  jq('head').append(`<style type="text/css">${appStyle}</style>`)

  const $axios = axios.create({
    baseURL: 'https://hatena.vercel.app/api/',
    timeout: 30000,
  })

  const app = new Vue({
    el: '#huddle-target',
    data: {
      count: '',
      iframeUrl: '',
      isActive: false,
    },
    computed: {
      isIframe() {
        return this.count > 0
      },
      rootClasses() {
        return [this.mode, this.isActive ? 'active' : '']
      },
      mode() {
        let mode = ''
        if (this.count === 0) {
          mode = 'MODE-ZERO'
        }
        return mode
      },
    },
    async mounted() {
      this.count = await this.getCount()
      if (this.count > 0) {
        const url = document.location.href
        this.iframeUrl = `https://rd.lobine.app/huddle?url=${url}`
      }
    },
    methods: {
      async getCount() {
        const url = document.location.href
        const res = await $axios.get(`bookmark/getEntryCount?url=${url}`)
        return res.data
      },
      handleSwitch() {
        this.isActive = !this.isActive
        jq('html').toggleClass('huddling')
      },
    },
  })
})
