// ==UserScript==
// @name         Mangadex Thumbnail Preview
// @namespace    https://github.com/kvnxiao
// @version      0.1.2
// @description  Thumbnail preview addon for Mangadex
// @author       Kevin Xiao
// @match        https://mangadex.org/follows
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js
// @downloadURL https://update.greasyfork.org/scripts/371003/Mangadex%20Thumbnail%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/371003/Mangadex%20Thumbnail%20Preview.meta.js
// ==/UserScript==

"use strict";

// convert html nodelist to js array
function toArray(obj) {
  const array = [];
  for (let i of obj) {
    array.push(i)
  }
  return array;
}

// create div for vue to bind to
const body = document.getElementsByTagName("body")[0];
const div = document.createElement("div");
const vueId = "vue-addon";
div.id = vueId;
body.appendChild(div);

// retrieve manga anchor links
const p = document.getElementsByClassName("chapter-container")[0];
const rows = p.getElementsByClassName(
  "col col-md-3 row no-gutters flex-nowrap align-items-start p-2 font-weight-bold border-bottom"
);
const links = toArray(p.getElementsByTagName("a")).filter(it =>
  it.getAttribute("href").startsWith("/title/")
);

// instantiate an eventbus to communicate from webpage to vue instances
Vue.prototype.$eventbus = new Vue();

const HOVER_EVENT = "hover"
const LEAVE_EVENT = "leave"

const HoverThumb = {
  template: `
    <div v-if="url !== ''" id="vue-thumb" :style="styleObj">
      <img :src="url"></img>
    </div>
  `,
  data() {
    return {
      url: "",
      styleObj: {
        position: "absolute",
        boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
        top: "0",
        left: "0",
        pointerEvents: "none"
      }
    };
  },
  created() {
    this.$eventbus.$on(HOVER_EVENT, event => {
      this.url = "https://mangadex.org/images/manga/" + event.url + ".thumb.jpg";
      this.styleObj.top = (document.documentElement.scrollTop + event.bound.top - 50) + "px"
      if (event.bound.left < 140) {
        this.styleObj.left = "240px"
      } else {
        this.styleObj.left = (event.bound.left - 130) + "px"
      }
    });
    this.$eventbus.$on(LEAVE_EVENT, _url => {
      this.url = "";
    });
  }
};

const app = new Vue({
  components: {
    "hover-thumb": HoverThumb
  },
  render: h => h(HoverThumb)
}).$mount("#" + vueId);

links.map(it => {
  it.addEventListener("mouseover", function (event) {
    Vue.prototype.$eventbus.$emit(HOVER_EVENT, {
      url: event.target.getAttribute("href").split("/")[2],
      bound: event.target.getBoundingClientRect()
    });
  });
  it.addEventListener("mouseleave", function (event) {
    Vue.prototype.$eventbus.$emit(LEAVE_EVENT, event.target.getAttribute("href").split("/")[2]);
  })
});
