// ==UserScript==
// @name         语雀文档样式修改
// @namespace    https://greasyfork.org/
// @version      2.6
// @description  语雀文档样式修改试运行
// @author       AIJake
// @include      /^https://.*(yuque).*/
// @icon         https://www.google.com/s2/favicons?domain=yuque.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442000/%E8%AF%AD%E9%9B%80%E6%96%87%E6%A1%A3%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/442000/%E8%AF%AD%E9%9B%80%E6%96%87%E6%A1%A3%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

window.onload = ()=>{
    if(window.h5) {
        document.body.classList.add('yuqueh5');
    }
    const style = document.createElement('style');
    style.innerHTML = `
.ne-typography-traditional,
.ne-typography-classic {
  font-family: Roboto, RobotoNum, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Segoe UI";
  color: #262626;
  letter-spacing: initial;
}
.ne-typography-traditional.ne-viewer .ne-viewer-body .ne-spacing-all,
.ne-typography-classic.ne-viewer .ne-viewer-body .ne-spacing-all {
  margin-top: 0;
  margin-bottom: 7.74px;
}
.ne-typography-traditional.ne-viewer .ne-viewer-body ne-uli + .ne-spacing-all,
.ne-typography-classic.ne-viewer .ne-viewer-body ne-uli + .ne-spacing-all,
.ne-typography-traditional.ne-viewer .ne-viewer-body ne-oli + .ne-spacing-all,
.ne-typography-classic.ne-viewer .ne-viewer-body ne-oli + .ne-spacing-all,
.ne-typography-traditional.ne-viewer .ne-viewer-body ne-tli + .ne-spacing-all,
.ne-typography-classic.ne-viewer .ne-viewer-body ne-tli + .ne-spacing-all {
  margin-top: 7.74px;
}
.ne-typography-traditional ne-p,
.ne-typography-classic ne-p,
.ne-typography-traditional ne-hole.ne-spacing-all,
.ne-typography-classic ne-hole.ne-spacing-all,
.ne-typography-traditional ne-hole,
.ne-typography-classic ne-hole,
.ne-typography-traditional ne-container-hole.ne-spacing-all,
.ne-typography-classic ne-container-hole.ne-spacing-all,
.ne-typography-traditional ne-container-hole,
.ne-typography-classic ne-container-hole {
  margin-bottom: 7.74px;
}
.ne-typography-traditional ne-uli,
.ne-typography-classic ne-uli,
.ne-typography-traditional ne-oli,
.ne-typography-classic ne-oli,
.ne-typography-traditional ne-tli,
.ne-typography-classic ne-tli {
  margin-bottom: 3.87px;
}
.ne-typography-traditional ne-uli:last-child,
.ne-typography-classic ne-uli:last-child,
.ne-typography-traditional ne-oli:last-child,
.ne-typography-classic ne-oli:last-child,
.ne-typography-traditional ne-tli:last-child,
.ne-typography-classic ne-tli:last-child {
  margin-bottom: 0;
}
.ne-typography-traditional ne-uli + ne-p,
.ne-typography-classic ne-uli + ne-p,
.ne-typography-traditional ne-oli + ne-p,
.ne-typography-classic ne-oli + ne-p,
.ne-typography-traditional ne-tli + ne-p,
.ne-typography-classic ne-tli + ne-p,
.ne-typography-traditional ne-uli + ne-hole,
.ne-typography-classic ne-uli + ne-hole,
.ne-typography-traditional ne-oli + ne-hole,
.ne-typography-classic ne-oli + ne-hole,
.ne-typography-traditional ne-tli + ne-hole,
.ne-typography-classic ne-tli + ne-hole,
.ne-typography-traditional ne-uli + ne-table-hole,
.ne-typography-classic ne-uli + ne-table-hole,
.ne-typography-traditional ne-oli + ne-table-hole,
.ne-typography-classic ne-oli + ne-table-hole,
.ne-typography-traditional ne-tli + ne-table-hole,
.ne-typography-classic ne-tli + ne-table-hole,
.ne-typography-traditional ne-uli + ne-container-hole,
.ne-typography-classic ne-uli + ne-container-hole,
.ne-typography-traditional ne-oli + ne-container-hole,
.ne-typography-classic ne-oli + ne-container-hole,
.ne-typography-traditional ne-tli + ne-container-hole,
.ne-typography-classic ne-tli + ne-container-hole,
.ne-typography-traditional ne-uli + ne-hole.ne-spacing-all,
.ne-typography-classic ne-uli + ne-hole.ne-spacing-all,
.ne-typography-traditional ne-oli + ne-hole.ne-spacing-all,
.ne-typography-classic ne-oli + ne-hole.ne-spacing-all,
.ne-typography-traditional ne-tli + ne-hole.ne-spacing-all,
.ne-typography-classic ne-tli + ne-hole.ne-spacing-all,
.ne-typography-traditional ne-uli + ne-table-hole.ne-spacing-all,
.ne-typography-classic ne-uli + ne-table-hole.ne-spacing-all,
.ne-typography-traditional ne-oli + ne-table-hole.ne-spacing-all,
.ne-typography-classic ne-oli + ne-table-hole.ne-spacing-all,
.ne-typography-traditional ne-tli + ne-table-hole.ne-spacing-all,
.ne-typography-classic ne-tli + ne-table-hole.ne-spacing-all,
.ne-typography-traditional ne-uli + ne-container-hole.ne-spacing-all,
.ne-typography-classic ne-uli + ne-container-hole.ne-spacing-all,
.ne-typography-traditional ne-oli + ne-container-hole.ne-spacing-all,
.ne-typography-classic ne-oli + ne-container-hole.ne-spacing-all,
.ne-typography-traditional ne-tli + ne-container-hole.ne-spacing-all,
.ne-typography-classic ne-tli + ne-container-hole.ne-spacing-all {
  margin-top: 7.74px;
}
.ne-typography-traditional ne-table-hole,
.ne-typography-classic ne-table-hole {
  margin-top: 0;
}
.ne-typography-traditional ne-table-hole ne-table-wrap.ne-ui-table-left-shadow::before,
.ne-typography-classic ne-table-hole ne-table-wrap.ne-ui-table-left-shadow::before,
.ne-typography-traditional ne-table-hole ne-table-wrap.ne-ui-table-right-shadow::after,
.ne-typography-classic ne-table-hole ne-table-wrap.ne-ui-table-right-shadow::after,
.ne-typography-traditional ne-table-hole ne-table-wrap.h5-ne-ui-table-left-shadow::before,
.ne-typography-classic ne-table-hole ne-table-wrap.h5-ne-ui-table-left-shadow::before,
.ne-typography-traditional ne-table-hole ne-table-wrap.h5-ne-ui-table-right-shadow:after,
.ne-typography-classic ne-table-hole ne-table-wrap.h5-ne-ui-table-right-shadow:after {
  top: -14px;
  bottom: 15px;
}
.ne-typography-traditional ne-table-hole ne-table-wrap.ne-table-focus.ne-ui-table-left-shadow::before,
.ne-typography-classic ne-table-hole ne-table-wrap.ne-table-focus.ne-ui-table-left-shadow::before,
.ne-typography-traditional ne-table-hole ne-table-wrap.ne-table-focus.ne-ui-table-right-shadow::after,
.ne-typography-classic ne-table-hole ne-table-wrap.ne-table-focus.ne-ui-table-right-shadow::after,
.ne-typography-traditional ne-table-hole ne-table-wrap.ne-table-focus.h5-ne-ui-table-left-shadow::before,
.ne-typography-classic ne-table-hole ne-table-wrap.ne-table-focus.h5-ne-ui-table-left-shadow::before,
.ne-typography-traditional ne-table-hole ne-table-wrap.ne-table-focus.h5-ne-ui-table-right-shadow:after,
.ne-typography-classic ne-table-hole ne-table-wrap.ne-table-focus.h5-ne-ui-table-right-shadow:after {
  top: 0;
}
.ne-typography-traditional ne-table-hole ne-table-inner-wrap,
.ne-typography-classic ne-table-hole ne-table-inner-wrap {
  padding-top: 0;
}
.ne-typography-traditional.ne-viewer ne-table-wrap.ne-ui-table-right-shadow::after,
.ne-typography-classic.ne-viewer ne-table-wrap.ne-ui-table-right-shadow::after,
.ne-typography-traditional.ne-viewer ne-table-wrap.ne-ui-table-left-shadow::before,
.ne-typography-classic.ne-viewer ne-table-wrap.ne-ui-table-left-shadow::before {
  top: 0;
}
.ne-typography-traditional.ne-viewer ne-table-wrap.h5-ne-ui-table-left-shadow::before,
.ne-typography-classic.ne-viewer ne-table-wrap.h5-ne-ui-table-left-shadow::before,
.ne-typography-traditional.ne-viewer ne-table-wrap.h5-ne-ui-table-right-shadow:after,
.ne-typography-classic.ne-viewer ne-table-wrap.h5-ne-ui-table-right-shadow:after {
  top: -14px;
}
.ne-typography-traditional ne-quote,
.ne-typography-classic ne-quote {
  position: relative;
  border-left: none;
}
.ne-typography-traditional ne-quote::before,
.ne-typography-classic ne-quote::before {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  left: 0px;
  bottom: 0;
  width: 2px;
  border-radius: 2px;
  background-color: #D7DBD9;
}
.ne-typography-traditional ne-quote ne-text,
.ne-typography-classic ne-quote ne-text {
  color: #585A5A;
}
.ne-typography-traditional.ne-viewer ne-card[data-card-name="hr"],
.ne-typography-classic.ne-viewer ne-card[data-card-name="hr"] {
  padding: 12px 0;
}
.ne-typography-traditional.ne-viewer ne-card[data-card-name="hr"] .ne-hr,
.ne-typography-classic.ne-viewer ne-card[data-card-name="hr"] .ne-hr {
  height: 1px;
  background: #E7E9E8;
}
.ne-typography-traditional.ne-engine ne-card[data-card-name="hr"] ne-card-root .ne-card-container,
.ne-typography-classic.ne-engine ne-card[data-card-name="hr"] ne-card-root .ne-card-container {
  padding: 12px 0;
}
.ne-typography-traditional.ne-engine ne-card[data-card-name="hr"] ne-card-root .ne-card-container .ne-hr-line,
.ne-typography-classic.ne-engine ne-card[data-card-name="hr"] ne-card-root .ne-card-container .ne-hr-line {
  height: 1px;
  background: #E7E9E8;
}
.ne-typography-traditional.ne-engine ne-h1,
.ne-typography-classic.ne-engine ne-h1,
.ne-typography-traditional.ne-viewer ne-h1,
.ne-typography-classic.ne-viewer ne-h1 {
  font-size: 28px;
  line-height: 38px;
  margin: 38px 0 19px 0;
}
.ne-typography-traditional.ne-engine ne-h1:first-child,
.ne-typography-classic.ne-engine ne-h1:first-child,
.ne-typography-traditional.ne-viewer ne-h1:first-child,
.ne-typography-classic.ne-viewer ne-h1:first-child {
  margin-top: 0;
}
.ne-typography-traditional.ne-engine ne-h1 ne-heading-ext,
.ne-typography-classic.ne-engine ne-h1 ne-heading-ext,
.ne-typography-traditional.ne-viewer ne-h1 ne-heading-ext,
.ne-typography-classic.ne-viewer ne-h1 ne-heading-ext {
  height: 38px;
}
.ne-typography-traditional.ne-engine ne-h1 ne-text,
.ne-typography-classic.ne-engine ne-h1 ne-text,
.ne-typography-traditional.ne-viewer ne-h1 ne-text,
.ne-typography-classic.ne-viewer ne-h1 ne-text,
.ne-typography-traditional.ne-engine ne-h1 ne-card[data-card-type="inline"],
.ne-typography-classic.ne-engine ne-h1 ne-card[data-card-type="inline"],
.ne-typography-traditional.ne-viewer ne-h1 ne-card[data-card-type="inline"],
.ne-typography-classic.ne-viewer ne-h1 ne-card[data-card-type="inline"],
.ne-typography-traditional.ne-engine ne-h1 ne-code ne-text,
.ne-typography-classic.ne-engine ne-h1 ne-code ne-text,
.ne-typography-traditional.ne-viewer ne-h1 ne-code ne-text,
.ne-typography-classic.ne-viewer ne-h1 ne-code ne-text {
  font-size: 28px;
}
.ne-typography-traditional.ne-engine ne-h2,
.ne-typography-classic.ne-engine ne-h2,
.ne-typography-traditional.ne-viewer ne-h2,
.ne-typography-classic.ne-viewer ne-h2 {
  font-size: 24px;
  line-height: 34px;
  margin: 34px 0 17px 0;
}
.ne-typography-traditional.ne-engine ne-h2:first-child,
.ne-typography-classic.ne-engine ne-h2:first-child,
.ne-typography-traditional.ne-viewer ne-h2:first-child,
.ne-typography-classic.ne-viewer ne-h2:first-child {
  margin-top: 0;
}
.ne-typography-traditional.ne-engine ne-h2 ne-heading-ext,
.ne-typography-classic.ne-engine ne-h2 ne-heading-ext,
.ne-typography-traditional.ne-viewer ne-h2 ne-heading-ext,
.ne-typography-classic.ne-viewer ne-h2 ne-heading-ext {
  height: 32px;
}
.ne-typography-traditional.ne-engine ne-h2 ne-text,
.ne-typography-classic.ne-engine ne-h2 ne-text,
.ne-typography-traditional.ne-viewer ne-h2 ne-text,
.ne-typography-classic.ne-viewer ne-h2 ne-text,
.ne-typography-traditional.ne-engine ne-h2 ne-card[data-card-type="inline"],
.ne-typography-classic.ne-engine ne-h2 ne-card[data-card-type="inline"],
.ne-typography-traditional.ne-viewer ne-h2 ne-card[data-card-type="inline"],
.ne-typography-classic.ne-viewer ne-h2 ne-card[data-card-type="inline"],
.ne-typography-traditional.ne-engine ne-h2 ne-code ne-text,
.ne-typography-classic.ne-engine ne-h2 ne-code ne-text,
.ne-typography-traditional.ne-viewer ne-h2 ne-code ne-text,
.ne-typography-classic.ne-viewer ne-h2 ne-code ne-text {
  font-size: 24px;
}
.ne-typography-traditional.ne-engine ne-h3,
.ne-typography-classic.ne-engine ne-h3,
.ne-typography-traditional.ne-viewer ne-h3,
.ne-typography-classic.ne-viewer ne-h3 {
  font-size: 20px;
  line-height: 30px;
  margin: 30px 0 15px 0;
}
.ne-typography-traditional.ne-engine ne-h3:first-child,
.ne-typography-classic.ne-engine ne-h3:first-child,
.ne-typography-traditional.ne-viewer ne-h3:first-child,
.ne-typography-classic.ne-viewer ne-h3:first-child {
  margin-top: 0;
}
.ne-typography-traditional.ne-engine ne-h3 ne-heading-ext,
.ne-typography-classic.ne-engine ne-h3 ne-heading-ext,
.ne-typography-traditional.ne-viewer ne-h3 ne-heading-ext,
.ne-typography-classic.ne-viewer ne-h3 ne-heading-ext {
  height: 28px;
}
.ne-typography-traditional.ne-engine ne-h3 ne-text,
.ne-typography-classic.ne-engine ne-h3 ne-text,
.ne-typography-traditional.ne-viewer ne-h3 ne-text,
.ne-typography-classic.ne-viewer ne-h3 ne-text,
.ne-typography-traditional.ne-engine ne-h3 ne-card[data-card-type="inline"],
.ne-typography-classic.ne-engine ne-h3 ne-card[data-card-type="inline"],
.ne-typography-traditional.ne-viewer ne-h3 ne-card[data-card-type="inline"],
.ne-typography-classic.ne-viewer ne-h3 ne-card[data-card-type="inline"],
.ne-typography-traditional.ne-engine ne-h3 ne-code ne-text,
.ne-typography-classic.ne-engine ne-h3 ne-code ne-text,
.ne-typography-traditional.ne-viewer ne-h3 ne-code ne-text,
.ne-typography-classic.ne-viewer ne-h3 ne-code ne-text {
  font-size: 20px;
}
.ne-typography-traditional.ne-engine ne-h4,
.ne-typography-classic.ne-engine ne-h4,
.ne-typography-traditional.ne-viewer ne-h4,
.ne-typography-classic.ne-viewer ne-h4 {
  font-size: 16px;
  line-height: 26px;
  margin: 26px 0 13px 0;
}
.ne-typography-traditional.ne-engine ne-h4:first-child,
.ne-typography-classic.ne-engine ne-h4:first-child,
.ne-typography-traditional.ne-viewer ne-h4:first-child,
.ne-typography-classic.ne-viewer ne-h4:first-child {
  margin-top: 0;
}
.ne-typography-traditional.ne-engine ne-h4 ne-heading-ext,
.ne-typography-classic.ne-engine ne-h4 ne-heading-ext,
.ne-typography-traditional.ne-viewer ne-h4 ne-heading-ext,
.ne-typography-classic.ne-viewer ne-h4 ne-heading-ext {
  height: 24px;
}
.ne-typography-traditional.ne-engine ne-h4 ne-text,
.ne-typography-classic.ne-engine ne-h4 ne-text,
.ne-typography-traditional.ne-viewer ne-h4 ne-text,
.ne-typography-classic.ne-viewer ne-h4 ne-text,
.ne-typography-traditional.ne-engine ne-h4 ne-card[data-card-type="inline"],
.ne-typography-classic.ne-engine ne-h4 ne-card[data-card-type="inline"],
.ne-typography-traditional.ne-viewer ne-h4 ne-card[data-card-type="inline"],
.ne-typography-classic.ne-viewer ne-h4 ne-card[data-card-type="inline"],
.ne-typography-traditional.ne-engine ne-h4 ne-code ne-text,
.ne-typography-classic.ne-engine ne-h4 ne-code ne-text,
.ne-typography-traditional.ne-viewer ne-h4 ne-code ne-text,
.ne-typography-classic.ne-viewer ne-h4 ne-code ne-text {
  font-size: 16px;
}
.ne-typography-traditional.ne-engine ne-h5,
.ne-typography-classic.ne-engine ne-h5,
.ne-typography-traditional.ne-viewer ne-h5,
.ne-typography-classic.ne-viewer ne-h5 {
  line-height: 24px;
  margin: 24px 0 12px 0;
}
.ne-typography-traditional.ne-engine ne-h5:first-child,
.ne-typography-classic.ne-engine ne-h5:first-child,
.ne-typography-traditional.ne-viewer ne-h5:first-child,
.ne-typography-classic.ne-viewer ne-h5:first-child {
  margin-top: 0;
}
.ne-typography-traditional.ne-engine ne-h5 ne-heading-ext,
.ne-typography-classic.ne-engine ne-h5 ne-heading-ext,
.ne-typography-traditional.ne-viewer ne-h5 ne-heading-ext,
.ne-typography-classic.ne-viewer ne-h5 ne-heading-ext {
  height: 24px;
}
.ne-typography-traditional.ne-engine ne-h6,
.ne-typography-classic.ne-engine ne-h6,
.ne-typography-traditional.ne-viewer ne-h6,
.ne-typography-classic.ne-viewer ne-h6 {
  font-weight: bold;
  line-height: 24px;
  margin: 24px 0 12px 0;
}
.ne-typography-traditional.ne-engine ne-h6:first-child,
.ne-typography-classic.ne-engine ne-h6:first-child,
.ne-typography-traditional.ne-viewer ne-h6:first-child,
.ne-typography-classic.ne-viewer ne-h6:first-child {
  margin-top: 0;
}
.ne-typography-traditional.ne-engine ne-h6 ne-heading-ext,
.ne-typography-classic.ne-engine ne-h6 ne-heading-ext,
.ne-typography-traditional.ne-viewer ne-h6 ne-heading-ext,
.ne-typography-classic.ne-viewer ne-h6 ne-heading-ext {
  height: 24px;
}
.ne-typography-traditional.ne-engine ne-h1:first-child,
.ne-typography-classic.ne-engine ne-h1:first-child,
.ne-typography-traditional.ne-viewer ne-h1:first-child,
.ne-typography-classic.ne-viewer ne-h1:first-child,
.ne-typography-traditional.ne-engine ne-h2:first-child,
.ne-typography-classic.ne-engine ne-h2:first-child,
.ne-typography-traditional.ne-viewer ne-h2:first-child,
.ne-typography-classic.ne-viewer ne-h2:first-child,
.ne-typography-traditional.ne-engine ne-h3:first-child,
.ne-typography-classic.ne-engine ne-h3:first-child,
.ne-typography-traditional.ne-viewer ne-h3:first-child,
.ne-typography-classic.ne-viewer ne-h3:first-child,
.ne-typography-traditional.ne-engine ne-h4:first-child,
.ne-typography-classic.ne-engine ne-h4:first-child,
.ne-typography-traditional.ne-viewer ne-h4:first-child,
.ne-typography-classic.ne-viewer ne-h4:first-child,
.ne-typography-traditional.ne-engine ne-h5:first-child,
.ne-typography-classic.ne-engine ne-h5:first-child,
.ne-typography-traditional.ne-viewer ne-h5:first-child,
.ne-typography-classic.ne-viewer ne-h5:first-child {
  margin-top: 0;
}
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-engine ne-h1,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-engine ne-h1,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-engine ne-h1,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-engine ne-h1,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-viewer ne-h1,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-viewer ne-h1,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-viewer ne-h1,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-viewer ne-h1 {
  font-size: 26px;
  line-height: 36px;
  margin: 36px 0 18px 0;
}
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-engine ne-h1 ne-heading-ext,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-engine ne-h1 ne-heading-ext,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-engine ne-h1 ne-heading-ext,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-engine ne-h1 ne-heading-ext,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-viewer ne-h1 ne-heading-ext,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-viewer ne-h1 ne-heading-ext,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-viewer ne-h1 ne-heading-ext,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-viewer ne-h1 ne-heading-ext {
  height: 36px;
}
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-engine ne-h1 ne-text,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-engine ne-h1 ne-text,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-engine ne-h1 ne-text,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-engine ne-h1 ne-text,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-viewer ne-h1 ne-text,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-viewer ne-h1 ne-text,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-viewer ne-h1 ne-text,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-viewer ne-h1 ne-text,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-engine ne-h1 ne-card[data-card-type="inline"],
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-engine ne-h1 ne-card[data-card-type="inline"],
.ne-doc-major-editor-mobile .ne-typography-classic.ne-engine ne-h1 ne-card[data-card-type="inline"],
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-engine ne-h1 ne-card[data-card-type="inline"],
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-viewer ne-h1 ne-card[data-card-type="inline"],
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-viewer ne-h1 ne-card[data-card-type="inline"],
.ne-doc-major-editor-mobile .ne-typography-classic.ne-viewer ne-h1 ne-card[data-card-type="inline"],
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-viewer ne-h1 ne-card[data-card-type="inline"],
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-engine ne-h1 ne-code ne-text,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-engine ne-h1 ne-code ne-text,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-engine ne-h1 ne-code ne-text,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-engine ne-h1 ne-code ne-text,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-viewer ne-h1 ne-code ne-text,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-viewer ne-h1 ne-code ne-text,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-viewer ne-h1 ne-code ne-text,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-viewer ne-h1 ne-code ne-text {
  font-size: 26px;
}
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-engine ne-h2,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-engine ne-h2,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-engine ne-h2,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-engine ne-h2,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-viewer ne-h2,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-viewer ne-h2,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-viewer ne-h2,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-viewer ne-h2 {
  font-size: 22px;
  line-height: 30px;
  margin: 30px 0 15px 0;
}
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-engine ne-h2 ne-heading-ext,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-engine ne-h2 ne-heading-ext,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-engine ne-h2 ne-heading-ext,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-engine ne-h2 ne-heading-ext,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-viewer ne-h2 ne-heading-ext,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-viewer ne-h2 ne-heading-ext,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-viewer ne-h2 ne-heading-ext,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-viewer ne-h2 ne-heading-ext {
  height: 30px;
}
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-engine ne-h2 ne-text,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-engine ne-h2 ne-text,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-engine ne-h2 ne-text,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-engine ne-h2 ne-text,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-viewer ne-h2 ne-text,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-viewer ne-h2 ne-text,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-viewer ne-h2 ne-text,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-viewer ne-h2 ne-text,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-engine ne-h2 ne-card[data-card-type="inline"],
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-engine ne-h2 ne-card[data-card-type="inline"],
.ne-doc-major-editor-mobile .ne-typography-classic.ne-engine ne-h2 ne-card[data-card-type="inline"],
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-engine ne-h2 ne-card[data-card-type="inline"],
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-viewer ne-h2 ne-card[data-card-type="inline"],
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-viewer ne-h2 ne-card[data-card-type="inline"],
.ne-doc-major-editor-mobile .ne-typography-classic.ne-viewer ne-h2 ne-card[data-card-type="inline"],
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-viewer ne-h2 ne-card[data-card-type="inline"],
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-engine ne-h2 ne-code ne-text,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-engine ne-h2 ne-code ne-text,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-engine ne-h2 ne-code ne-text,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-engine ne-h2 ne-code ne-text,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-viewer ne-h2 ne-code ne-text,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-viewer ne-h2 ne-code ne-text,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-viewer ne-h2 ne-code ne-text,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-viewer ne-h2 ne-code ne-text {
  font-size: 22px;
}
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-engine ne-h3,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-engine ne-h3,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-engine ne-h3,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-engine ne-h3,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-viewer ne-h3,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-viewer ne-h3,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-viewer ne-h3,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-viewer ne-h3 {
  font-size: 18px;
  line-height: 28px;
  margin: 28px 0 14px 0;
}
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-engine ne-h3:first-child,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-engine ne-h3:first-child,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-engine ne-h3:first-child,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-engine ne-h3:first-child,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-viewer ne-h3:first-child,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-viewer ne-h3:first-child,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-viewer ne-h3:first-child,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-viewer ne-h3:first-child {
  margin-top: 0;
}
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-engine ne-h3 ne-heading-ext,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-engine ne-h3 ne-heading-ext,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-engine ne-h3 ne-heading-ext,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-engine ne-h3 ne-heading-ext,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-viewer ne-h3 ne-heading-ext,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-viewer ne-h3 ne-heading-ext,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-viewer ne-h3 ne-heading-ext,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-viewer ne-h3 ne-heading-ext {
  height: 28px;
}
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-engine ne-h3 ne-text,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-engine ne-h3 ne-text,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-engine ne-h3 ne-text,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-engine ne-h3 ne-text,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-viewer ne-h3 ne-text,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-viewer ne-h3 ne-text,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-viewer ne-h3 ne-text,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-viewer ne-h3 ne-text,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-engine ne-h3 ne-card[data-card-type="inline"],
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-engine ne-h3 ne-card[data-card-type="inline"],
.ne-doc-major-editor-mobile .ne-typography-classic.ne-engine ne-h3 ne-card[data-card-type="inline"],
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-engine ne-h3 ne-card[data-card-type="inline"],
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-viewer ne-h3 ne-card[data-card-type="inline"],
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-viewer ne-h3 ne-card[data-card-type="inline"],
.ne-doc-major-editor-mobile .ne-typography-classic.ne-viewer ne-h3 ne-card[data-card-type="inline"],
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-viewer ne-h3 ne-card[data-card-type="inline"],
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-engine ne-h3 ne-code ne-text,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-engine ne-h3 ne-code ne-text,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-engine ne-h3 ne-code ne-text,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-engine ne-h3 ne-code ne-text,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-viewer ne-h3 ne-code ne-text,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-viewer ne-h3 ne-code ne-text,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-viewer ne-h3 ne-code ne-text,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-viewer ne-h3 ne-code ne-text {
  font-size: 18px;
}
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-engine ne-h4,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-engine ne-h4,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-engine ne-h4,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-engine ne-h4,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-viewer ne-h4,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-viewer ne-h4,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-viewer ne-h4,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-viewer ne-h4 {
  font-size: 16px;
  line-height: 26px;
  margin: 26px 0 13px 0;
}
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-engine ne-h4 ne-heading-ext,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-engine ne-h4 ne-heading-ext,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-engine ne-h4 ne-heading-ext,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-engine ne-h4 ne-heading-ext,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-viewer ne-h4 ne-heading-ext,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-viewer ne-h4 ne-heading-ext,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-viewer ne-h4 ne-heading-ext,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-viewer ne-h4 ne-heading-ext {
  height: 26px;
}
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-engine ne-h4 ne-text,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-engine ne-h4 ne-text,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-engine ne-h4 ne-text,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-engine ne-h4 ne-text,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-viewer ne-h4 ne-text,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-viewer ne-h4 ne-text,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-viewer ne-h4 ne-text,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-viewer ne-h4 ne-text,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-engine ne-h4 ne-card[data-card-type="inline"],
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-engine ne-h4 ne-card[data-card-type="inline"],
.ne-doc-major-editor-mobile .ne-typography-classic.ne-engine ne-h4 ne-card[data-card-type="inline"],
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-engine ne-h4 ne-card[data-card-type="inline"],
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-viewer ne-h4 ne-card[data-card-type="inline"],
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-viewer ne-h4 ne-card[data-card-type="inline"],
.ne-doc-major-editor-mobile .ne-typography-classic.ne-viewer ne-h4 ne-card[data-card-type="inline"],
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-viewer ne-h4 ne-card[data-card-type="inline"],
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-engine ne-h4 ne-code ne-text,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-engine ne-h4 ne-code ne-text,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-engine ne-h4 ne-code ne-text,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-engine ne-h4 ne-code ne-text,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-viewer ne-h4 ne-code ne-text,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-viewer ne-h4 ne-code ne-text,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-viewer ne-h4 ne-code ne-text,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-viewer ne-h4 ne-code ne-text {
  font-size: 16px;
}
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-engine ne-h5,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-engine ne-h5,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-engine ne-h5,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-engine ne-h5,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-viewer ne-h5,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-viewer ne-h5,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-viewer ne-h5,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-viewer ne-h5 {
  line-height: 24px;
  margin: 24px 0 12px 0;
}
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-engine ne-h5 ne-heading-ext,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-engine ne-h5 ne-heading-ext,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-engine ne-h5 ne-heading-ext,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-engine ne-h5 ne-heading-ext,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-viewer ne-h5 ne-heading-ext,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-viewer ne-h5 ne-heading-ext,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-viewer ne-h5 ne-heading-ext,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-viewer ne-h5 ne-heading-ext {
  height: 24px;
}
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-engine ne-h6,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-engine ne-h6,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-engine ne-h6,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-engine ne-h6,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-viewer ne-h6,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-viewer ne-h6,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-viewer ne-h6,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-viewer ne-h6 {
  font-weight: bold;
  line-height: 24px;
  margin: 24px 0 12px 0;
}
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-engine ne-h6 ne-heading-ext,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-engine ne-h6 ne-heading-ext,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-engine ne-h6 ne-heading-ext,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-engine ne-h6 ne-heading-ext,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-viewer ne-h6 ne-heading-ext,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-viewer ne-h6 ne-heading-ext,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-viewer ne-h6 ne-heading-ext,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-viewer ne-h6 ne-heading-ext {
  height: 24px;
}
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-engine ne-h1:first-child,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-engine ne-h1:first-child,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-engine ne-h1:first-child,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-engine ne-h1:first-child,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-viewer ne-h1:first-child,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-viewer ne-h1:first-child,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-viewer ne-h1:first-child,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-viewer ne-h1:first-child,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-engine ne-h2:first-child,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-engine ne-h2:first-child,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-engine ne-h2:first-child,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-engine ne-h2:first-child,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-viewer ne-h2:first-child,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-viewer ne-h2:first-child,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-viewer ne-h2:first-child,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-viewer ne-h2:first-child,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-engine ne-h3:first-child,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-engine ne-h3:first-child,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-engine ne-h3:first-child,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-engine ne-h3:first-child,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-viewer ne-h3:first-child,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-viewer ne-h3:first-child,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-viewer ne-h3:first-child,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-viewer ne-h3:first-child,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-engine ne-h4:first-child,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-engine ne-h4:first-child,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-engine ne-h4:first-child,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-engine ne-h4:first-child,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-viewer ne-h4:first-child,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-viewer ne-h4:first-child,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-viewer ne-h4:first-child,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-viewer ne-h4:first-child,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-engine ne-h5:first-child,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-engine ne-h5:first-child,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-engine ne-h5:first-child,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-engine ne-h5:first-child,
.ne-doc-major-editor-mobile .ne-typography-traditional.ne-viewer ne-h5:first-child,
.ne-doc-major-viewer-mobile .ne-typography-traditional.ne-viewer ne-h5:first-child,
.ne-doc-major-editor-mobile .ne-typography-classic.ne-viewer ne-h5:first-child,
.ne-doc-major-viewer-mobile .ne-typography-classic.ne-viewer ne-h5:first-child {
  margin-top: 0;
}
.ne-viewer ne-h6 ne-text,
.ne-engine ne-h6 ne-text {
  font-weight: bold;
}
h1#article-title {
  font-size: 36px;
  line-height: 50px;
}
.yuqueh5 h1#article-title {
  font-size: 32px;
  line-height: 42px;
}
.yuqueh5 .m-doc-article {
  padding-top: 28px;
}
.yuqueh5 article#content > :nth-child(2) {
  padding-top: 16px;
  padding-bottom: 26px;
}
.yuqueh5 article#content > :nth-child(2) span,
.yuqueh5 article#content > :nth-child(2) a {
  color: #8A8F8D;
}
.yuqueh5 .doc-contributors,
.yuqueh5 .doc-contributors span a {
  color: #8A8F8D;
}
.ne-doc-major-viewer-mobile .ne-viewer-body > ne-p:first-child,
.ne-doc-major-viewer-mobile .ne-viewer-body > ne-uli:first-child,
.ne-doc-major-viewer-mobile .ne-viewer-body > ne-oli:first-child,
.ne-doc-major-viewer-mobile .ne-viewer-body > ne-tli:first-child {
  margin-top: 7.74px;
}
.ne-typography-classic.fz12.ne-viewer .ne-viewer-body .ne-spacing-all,
.ne-typography-traditional.fz12.ne-viewer .ne-viewer-body .ne-spacing-all {
  margin-top: 0;
  margin-bottom: 6.192px;
}
.ne-typography-classic.fz12.ne-viewer .ne-viewer-body ne-uli + .ne-spacing-all,
.ne-typography-traditional.fz12.ne-viewer .ne-viewer-body ne-uli + .ne-spacing-all,
.ne-typography-classic.fz12.ne-viewer .ne-viewer-body ne-oli + .ne-spacing-all,
.ne-typography-traditional.fz12.ne-viewer .ne-viewer-body ne-oli + .ne-spacing-all,
.ne-typography-classic.fz12.ne-viewer .ne-viewer-body ne-tli + .ne-spacing-all,
.ne-typography-traditional.fz12.ne-viewer .ne-viewer-body ne-tli + .ne-spacing-all {
  margin-top: 6.192px;
}
.ne-typography-classic.fz12 ne-p,
.ne-typography-traditional.fz12 ne-p,
.ne-typography-classic.fz12 ne-hole.ne-spacing-all,
.ne-typography-traditional.fz12 ne-hole.ne-spacing-all,
.ne-typography-classic.fz12 ne-hole,
.ne-typography-traditional.fz12 ne-hole,
.ne-typography-classic.fz12 ne-container-hole.ne-spacing-all,
.ne-typography-traditional.fz12 ne-container-hole.ne-spacing-all,
.ne-typography-classic.fz12 ne-container-hole,
.ne-typography-traditional.fz12 ne-container-hole {
  margin-bottom: 6.192px;
}
.ne-typography-classic.fz12 ne-uli,
.ne-typography-traditional.fz12 ne-uli,
.ne-typography-classic.fz12 ne-oli,
.ne-typography-traditional.fz12 ne-oli,
.ne-typography-classic.fz12 ne-tli,
.ne-typography-traditional.fz12 ne-tli {
  margin-bottom: 3.096px;
}
.ne-typography-classic.fz12 ne-uli:last-child,
.ne-typography-traditional.fz12 ne-uli:last-child,
.ne-typography-classic.fz12 ne-oli:last-child,
.ne-typography-traditional.fz12 ne-oli:last-child,
.ne-typography-classic.fz12 ne-tli:last-child,
.ne-typography-traditional.fz12 ne-tli:last-child {
  margin-bottom: 0;
}
.ne-typography-classic.fz12 ne-uli + ne-p,
.ne-typography-traditional.fz12 ne-uli + ne-p,
.ne-typography-classic.fz12 ne-oli + ne-p,
.ne-typography-traditional.fz12 ne-oli + ne-p,
.ne-typography-classic.fz12 ne-tli + ne-p,
.ne-typography-traditional.fz12 ne-tli + ne-p,
.ne-typography-classic.fz12 ne-uli + ne-hole,
.ne-typography-traditional.fz12 ne-uli + ne-hole,
.ne-typography-classic.fz12 ne-oli + ne-hole,
.ne-typography-traditional.fz12 ne-oli + ne-hole,
.ne-typography-classic.fz12 ne-tli + ne-hole,
.ne-typography-traditional.fz12 ne-tli + ne-hole,
.ne-typography-classic.fz12 ne-uli + ne-table-hole,
.ne-typography-traditional.fz12 ne-uli + ne-table-hole,
.ne-typography-classic.fz12 ne-oli + ne-table-hole,
.ne-typography-traditional.fz12 ne-oli + ne-table-hole,
.ne-typography-classic.fz12 ne-tli + ne-table-hole,
.ne-typography-traditional.fz12 ne-tli + ne-table-hole,
.ne-typography-classic.fz12 ne-uli + ne-container-hole,
.ne-typography-traditional.fz12 ne-uli + ne-container-hole,
.ne-typography-classic.fz12 ne-oli + ne-container-hole,
.ne-typography-traditional.fz12 ne-oli + ne-container-hole,
.ne-typography-classic.fz12 ne-tli + ne-container-hole,
.ne-typography-traditional.fz12 ne-tli + ne-container-hole,
.ne-typography-classic.fz12 ne-uli + .ne-spacing-all,
.ne-typography-traditional.fz12 ne-uli + .ne-spacing-all,
.ne-typography-classic.fz12 ne-oli + .ne-spacing-all,
.ne-typography-traditional.fz12 ne-oli + .ne-spacing-all,
.ne-typography-classic.fz12 ne-tli + .ne-spacing-all,
.ne-typography-traditional.fz12 ne-tli + .ne-spacing-all {
  margin-top: 6.192px;
}
.ne-doc-major-viewer-mobile .fz12 .ne-viewer-body > ne-p:first-child,
.ne-doc-major-viewer-mobile .fz12 .ne-viewer-body > ne-uli:first-child,
.ne-doc-major-viewer-mobile .fz12 .ne-viewer-body > ne-oli:first-child,
.ne-doc-major-viewer-mobile .fz12 .ne-viewer-body > ne-tli:first-child {
  margin-top: 6.192px;
}
.ne-typography-classic.fz13.ne-viewer .ne-viewer-body .ne-spacing-all,
.ne-typography-traditional.fz13.ne-viewer .ne-viewer-body .ne-spacing-all {
  margin-top: 0;
  margin-bottom: 6.708px;
}
.ne-typography-classic.fz13.ne-viewer .ne-viewer-body ne-uli + .ne-spacing-all,
.ne-typography-traditional.fz13.ne-viewer .ne-viewer-body ne-uli + .ne-spacing-all,
.ne-typography-classic.fz13.ne-viewer .ne-viewer-body ne-oli + .ne-spacing-all,
.ne-typography-traditional.fz13.ne-viewer .ne-viewer-body ne-oli + .ne-spacing-all,
.ne-typography-classic.fz13.ne-viewer .ne-viewer-body ne-tli + .ne-spacing-all,
.ne-typography-traditional.fz13.ne-viewer .ne-viewer-body ne-tli + .ne-spacing-all {
  margin-top: 6.708px;
}
.ne-typography-classic.fz13 ne-p,
.ne-typography-traditional.fz13 ne-p,
.ne-typography-classic.fz13 ne-hole.ne-spacing-all,
.ne-typography-traditional.fz13 ne-hole.ne-spacing-all,
.ne-typography-classic.fz13 ne-hole,
.ne-typography-traditional.fz13 ne-hole,
.ne-typography-classic.fz13 ne-container-hole.ne-spacing-all,
.ne-typography-traditional.fz13 ne-container-hole.ne-spacing-all,
.ne-typography-classic.fz13 ne-container-hole,
.ne-typography-traditional.fz13 ne-container-hole {
  margin-bottom: 6.708px;
}
.ne-typography-classic.fz13 ne-uli,
.ne-typography-traditional.fz13 ne-uli,
.ne-typography-classic.fz13 ne-oli,
.ne-typography-traditional.fz13 ne-oli,
.ne-typography-classic.fz13 ne-tli,
.ne-typography-traditional.fz13 ne-tli {
  margin-bottom: 3.354px;
}
.ne-typography-classic.fz13 ne-uli:last-child,
.ne-typography-traditional.fz13 ne-uli:last-child,
.ne-typography-classic.fz13 ne-oli:last-child,
.ne-typography-traditional.fz13 ne-oli:last-child,
.ne-typography-classic.fz13 ne-tli:last-child,
.ne-typography-traditional.fz13 ne-tli:last-child {
  margin-bottom: 0;
}
.ne-typography-classic.fz13 ne-uli + ne-p,
.ne-typography-traditional.fz13 ne-uli + ne-p,
.ne-typography-classic.fz13 ne-oli + ne-p,
.ne-typography-traditional.fz13 ne-oli + ne-p,
.ne-typography-classic.fz13 ne-tli + ne-p,
.ne-typography-traditional.fz13 ne-tli + ne-p,
.ne-typography-classic.fz13 ne-uli + ne-hole,
.ne-typography-traditional.fz13 ne-uli + ne-hole,
.ne-typography-classic.fz13 ne-oli + ne-hole,
.ne-typography-traditional.fz13 ne-oli + ne-hole,
.ne-typography-classic.fz13 ne-tli + ne-hole,
.ne-typography-traditional.fz13 ne-tli + ne-hole,
.ne-typography-classic.fz13 ne-uli + ne-table-hole,
.ne-typography-traditional.fz13 ne-uli + ne-table-hole,
.ne-typography-classic.fz13 ne-oli + ne-table-hole,
.ne-typography-traditional.fz13 ne-oli + ne-table-hole,
.ne-typography-classic.fz13 ne-tli + ne-table-hole,
.ne-typography-traditional.fz13 ne-tli + ne-table-hole,
.ne-typography-classic.fz13 ne-uli + ne-container-hole,
.ne-typography-traditional.fz13 ne-uli + ne-container-hole,
.ne-typography-classic.fz13 ne-oli + ne-container-hole,
.ne-typography-traditional.fz13 ne-oli + ne-container-hole,
.ne-typography-classic.fz13 ne-tli + ne-container-hole,
.ne-typography-traditional.fz13 ne-tli + ne-container-hole,
.ne-typography-classic.fz13 ne-uli + .ne-spacing-all,
.ne-typography-traditional.fz13 ne-uli + .ne-spacing-all,
.ne-typography-classic.fz13 ne-oli + .ne-spacing-all,
.ne-typography-traditional.fz13 ne-oli + .ne-spacing-all,
.ne-typography-classic.fz13 ne-tli + .ne-spacing-all,
.ne-typography-traditional.fz13 ne-tli + .ne-spacing-all {
  margin-top: 6.708px;
}
.ne-doc-major-viewer-mobile .fz13 .ne-viewer-body > ne-p:first-child,
.ne-doc-major-viewer-mobile .fz13 .ne-viewer-body > ne-uli:first-child,
.ne-doc-major-viewer-mobile .fz13 .ne-viewer-body > ne-oli:first-child,
.ne-doc-major-viewer-mobile .fz13 .ne-viewer-body > ne-tli:first-child {
  margin-top: 6.708px;
}
.ne-typography-classic.fz14.ne-viewer .ne-viewer-body .ne-spacing-all,
.ne-typography-traditional.fz14.ne-viewer .ne-viewer-body .ne-spacing-all {
  margin-top: 0;
  margin-bottom: 7.224px;
}
.ne-typography-classic.fz14.ne-viewer .ne-viewer-body ne-uli + .ne-spacing-all,
.ne-typography-traditional.fz14.ne-viewer .ne-viewer-body ne-uli + .ne-spacing-all,
.ne-typography-classic.fz14.ne-viewer .ne-viewer-body ne-oli + .ne-spacing-all,
.ne-typography-traditional.fz14.ne-viewer .ne-viewer-body ne-oli + .ne-spacing-all,
.ne-typography-classic.fz14.ne-viewer .ne-viewer-body ne-tli + .ne-spacing-all,
.ne-typography-traditional.fz14.ne-viewer .ne-viewer-body ne-tli + .ne-spacing-all {
  margin-top: 7.224px;
}
.ne-typography-classic.fz14 ne-p,
.ne-typography-traditional.fz14 ne-p,
.ne-typography-classic.fz14 ne-hole.ne-spacing-all,
.ne-typography-traditional.fz14 ne-hole.ne-spacing-all,
.ne-typography-classic.fz14 ne-hole,
.ne-typography-traditional.fz14 ne-hole,
.ne-typography-classic.fz14 ne-container-hole.ne-spacing-all,
.ne-typography-traditional.fz14 ne-container-hole.ne-spacing-all,
.ne-typography-classic.fz14 ne-container-hole,
.ne-typography-traditional.fz14 ne-container-hole {
  margin-bottom: 7.224px;
}
.ne-typography-classic.fz14 ne-uli,
.ne-typography-traditional.fz14 ne-uli,
.ne-typography-classic.fz14 ne-oli,
.ne-typography-traditional.fz14 ne-oli,
.ne-typography-classic.fz14 ne-tli,
.ne-typography-traditional.fz14 ne-tli {
  margin-bottom: 3.612px;
}
.ne-typography-classic.fz14 ne-uli:last-child,
.ne-typography-traditional.fz14 ne-uli:last-child,
.ne-typography-classic.fz14 ne-oli:last-child,
.ne-typography-traditional.fz14 ne-oli:last-child,
.ne-typography-classic.fz14 ne-tli:last-child,
.ne-typography-traditional.fz14 ne-tli:last-child {
  margin-bottom: 0;
}
.ne-typography-classic.fz14 ne-uli + ne-p,
.ne-typography-traditional.fz14 ne-uli + ne-p,
.ne-typography-classic.fz14 ne-oli + ne-p,
.ne-typography-traditional.fz14 ne-oli + ne-p,
.ne-typography-classic.fz14 ne-tli + ne-p,
.ne-typography-traditional.fz14 ne-tli + ne-p,
.ne-typography-classic.fz14 ne-uli + ne-hole,
.ne-typography-traditional.fz14 ne-uli + ne-hole,
.ne-typography-classic.fz14 ne-oli + ne-hole,
.ne-typography-traditional.fz14 ne-oli + ne-hole,
.ne-typography-classic.fz14 ne-tli + ne-hole,
.ne-typography-traditional.fz14 ne-tli + ne-hole,
.ne-typography-classic.fz14 ne-uli + ne-table-hole,
.ne-typography-traditional.fz14 ne-uli + ne-table-hole,
.ne-typography-classic.fz14 ne-oli + ne-table-hole,
.ne-typography-traditional.fz14 ne-oli + ne-table-hole,
.ne-typography-classic.fz14 ne-tli + ne-table-hole,
.ne-typography-traditional.fz14 ne-tli + ne-table-hole,
.ne-typography-classic.fz14 ne-uli + ne-container-hole,
.ne-typography-traditional.fz14 ne-uli + ne-container-hole,
.ne-typography-classic.fz14 ne-oli + ne-container-hole,
.ne-typography-traditional.fz14 ne-oli + ne-container-hole,
.ne-typography-classic.fz14 ne-tli + ne-container-hole,
.ne-typography-traditional.fz14 ne-tli + ne-container-hole,
.ne-typography-classic.fz14 ne-uli + .ne-spacing-all,
.ne-typography-traditional.fz14 ne-uli + .ne-spacing-all,
.ne-typography-classic.fz14 ne-oli + .ne-spacing-all,
.ne-typography-traditional.fz14 ne-oli + .ne-spacing-all,
.ne-typography-classic.fz14 ne-tli + .ne-spacing-all,
.ne-typography-traditional.fz14 ne-tli + .ne-spacing-all {
  margin-top: 7.224px;
}
.ne-doc-major-viewer-mobile .fz14 .ne-viewer-body > ne-p:first-child,
.ne-doc-major-viewer-mobile .fz14 .ne-viewer-body > ne-uli:first-child,
.ne-doc-major-viewer-mobile .fz14 .ne-viewer-body > ne-oli:first-child,
.ne-doc-major-viewer-mobile .fz14 .ne-viewer-body > ne-tli:first-child {
  margin-top: 7.224px;
}
.ne-typography-classic.fz15.ne-viewer .ne-viewer-body .ne-spacing-all,
.ne-typography-traditional.fz15.ne-viewer .ne-viewer-body .ne-spacing-all {
  margin-top: 0;
  margin-bottom: 7.74px;
}
.ne-typography-classic.fz15.ne-viewer .ne-viewer-body ne-uli + .ne-spacing-all,
.ne-typography-traditional.fz15.ne-viewer .ne-viewer-body ne-uli + .ne-spacing-all,
.ne-typography-classic.fz15.ne-viewer .ne-viewer-body ne-oli + .ne-spacing-all,
.ne-typography-traditional.fz15.ne-viewer .ne-viewer-body ne-oli + .ne-spacing-all,
.ne-typography-classic.fz15.ne-viewer .ne-viewer-body ne-tli + .ne-spacing-all,
.ne-typography-traditional.fz15.ne-viewer .ne-viewer-body ne-tli + .ne-spacing-all {
  margin-top: 7.74px;
}
.ne-typography-classic.fz15 ne-p,
.ne-typography-traditional.fz15 ne-p,
.ne-typography-classic.fz15 ne-hole.ne-spacing-all,
.ne-typography-traditional.fz15 ne-hole.ne-spacing-all,
.ne-typography-classic.fz15 ne-hole,
.ne-typography-traditional.fz15 ne-hole,
.ne-typography-classic.fz15 ne-container-hole.ne-spacing-all,
.ne-typography-traditional.fz15 ne-container-hole.ne-spacing-all,
.ne-typography-classic.fz15 ne-container-hole,
.ne-typography-traditional.fz15 ne-container-hole {
  margin-bottom: 7.74px;
}
.ne-typography-classic.fz15 ne-uli,
.ne-typography-traditional.fz15 ne-uli,
.ne-typography-classic.fz15 ne-oli,
.ne-typography-traditional.fz15 ne-oli,
.ne-typography-classic.fz15 ne-tli,
.ne-typography-traditional.fz15 ne-tli {
  margin-bottom: 3.87px;
}
.ne-typography-classic.fz15 ne-uli:last-child,
.ne-typography-traditional.fz15 ne-uli:last-child,
.ne-typography-classic.fz15 ne-oli:last-child,
.ne-typography-traditional.fz15 ne-oli:last-child,
.ne-typography-classic.fz15 ne-tli:last-child,
.ne-typography-traditional.fz15 ne-tli:last-child {
  margin-bottom: 0;
}
.ne-typography-classic.fz15 ne-uli + ne-p,
.ne-typography-traditional.fz15 ne-uli + ne-p,
.ne-typography-classic.fz15 ne-oli + ne-p,
.ne-typography-traditional.fz15 ne-oli + ne-p,
.ne-typography-classic.fz15 ne-tli + ne-p,
.ne-typography-traditional.fz15 ne-tli + ne-p,
.ne-typography-classic.fz15 ne-uli + ne-hole,
.ne-typography-traditional.fz15 ne-uli + ne-hole,
.ne-typography-classic.fz15 ne-oli + ne-hole,
.ne-typography-traditional.fz15 ne-oli + ne-hole,
.ne-typography-classic.fz15 ne-tli + ne-hole,
.ne-typography-traditional.fz15 ne-tli + ne-hole,
.ne-typography-classic.fz15 ne-uli + ne-table-hole,
.ne-typography-traditional.fz15 ne-uli + ne-table-hole,
.ne-typography-classic.fz15 ne-oli + ne-table-hole,
.ne-typography-traditional.fz15 ne-oli + ne-table-hole,
.ne-typography-classic.fz15 ne-tli + ne-table-hole,
.ne-typography-traditional.fz15 ne-tli + ne-table-hole,
.ne-typography-classic.fz15 ne-uli + ne-container-hole,
.ne-typography-traditional.fz15 ne-uli + ne-container-hole,
.ne-typography-classic.fz15 ne-oli + ne-container-hole,
.ne-typography-traditional.fz15 ne-oli + ne-container-hole,
.ne-typography-classic.fz15 ne-tli + ne-container-hole,
.ne-typography-traditional.fz15 ne-tli + ne-container-hole,
.ne-typography-classic.fz15 ne-uli + .ne-spacing-all,
.ne-typography-traditional.fz15 ne-uli + .ne-spacing-all,
.ne-typography-classic.fz15 ne-oli + .ne-spacing-all,
.ne-typography-traditional.fz15 ne-oli + .ne-spacing-all,
.ne-typography-classic.fz15 ne-tli + .ne-spacing-all,
.ne-typography-traditional.fz15 ne-tli + .ne-spacing-all {
  margin-top: 7.74px;
}
.ne-doc-major-viewer-mobile .fz15 .ne-viewer-body > ne-p:first-child,
.ne-doc-major-viewer-mobile .fz15 .ne-viewer-body > ne-uli:first-child,
.ne-doc-major-viewer-mobile .fz15 .ne-viewer-body > ne-oli:first-child,
.ne-doc-major-viewer-mobile .fz15 .ne-viewer-body > ne-tli:first-child {
  margin-top: 7.74px;
}
.ne-typography-classic.fz16.ne-viewer .ne-viewer-body .ne-spacing-all,
.ne-typography-traditional.fz16.ne-viewer .ne-viewer-body .ne-spacing-all {
  margin-top: 0;
  margin-bottom: 8.256px;
}
.ne-typography-classic.fz16.ne-viewer .ne-viewer-body ne-uli + .ne-spacing-all,
.ne-typography-traditional.fz16.ne-viewer .ne-viewer-body ne-uli + .ne-spacing-all,
.ne-typography-classic.fz16.ne-viewer .ne-viewer-body ne-oli + .ne-spacing-all,
.ne-typography-traditional.fz16.ne-viewer .ne-viewer-body ne-oli + .ne-spacing-all,
.ne-typography-classic.fz16.ne-viewer .ne-viewer-body ne-tli + .ne-spacing-all,
.ne-typography-traditional.fz16.ne-viewer .ne-viewer-body ne-tli + .ne-spacing-all {
  margin-top: 8.256px;
}
.ne-typography-classic.fz16 ne-p,
.ne-typography-traditional.fz16 ne-p,
.ne-typography-classic.fz16 ne-hole.ne-spacing-all,
.ne-typography-traditional.fz16 ne-hole.ne-spacing-all,
.ne-typography-classic.fz16 ne-hole,
.ne-typography-traditional.fz16 ne-hole,
.ne-typography-classic.fz16 ne-container-hole.ne-spacing-all,
.ne-typography-traditional.fz16 ne-container-hole.ne-spacing-all,
.ne-typography-classic.fz16 ne-container-hole,
.ne-typography-traditional.fz16 ne-container-hole {
  margin-bottom: 8.256px;
}
.ne-typography-classic.fz16 ne-uli,
.ne-typography-traditional.fz16 ne-uli,
.ne-typography-classic.fz16 ne-oli,
.ne-typography-traditional.fz16 ne-oli,
.ne-typography-classic.fz16 ne-tli,
.ne-typography-traditional.fz16 ne-tli {
  margin-bottom: 4.128px;
}
.ne-typography-classic.fz16 ne-uli:last-child,
.ne-typography-traditional.fz16 ne-uli:last-child,
.ne-typography-classic.fz16 ne-oli:last-child,
.ne-typography-traditional.fz16 ne-oli:last-child,
.ne-typography-classic.fz16 ne-tli:last-child,
.ne-typography-traditional.fz16 ne-tli:last-child {
  margin-bottom: 0;
}
.ne-typography-classic.fz16 ne-uli + ne-p,
.ne-typography-traditional.fz16 ne-uli + ne-p,
.ne-typography-classic.fz16 ne-oli + ne-p,
.ne-typography-traditional.fz16 ne-oli + ne-p,
.ne-typography-classic.fz16 ne-tli + ne-p,
.ne-typography-traditional.fz16 ne-tli + ne-p,
.ne-typography-classic.fz16 ne-uli + ne-hole,
.ne-typography-traditional.fz16 ne-uli + ne-hole,
.ne-typography-classic.fz16 ne-oli + ne-hole,
.ne-typography-traditional.fz16 ne-oli + ne-hole,
.ne-typography-classic.fz16 ne-tli + ne-hole,
.ne-typography-traditional.fz16 ne-tli + ne-hole,
.ne-typography-classic.fz16 ne-uli + ne-table-hole,
.ne-typography-traditional.fz16 ne-uli + ne-table-hole,
.ne-typography-classic.fz16 ne-oli + ne-table-hole,
.ne-typography-traditional.fz16 ne-oli + ne-table-hole,
.ne-typography-classic.fz16 ne-tli + ne-table-hole,
.ne-typography-traditional.fz16 ne-tli + ne-table-hole,
.ne-typography-classic.fz16 ne-uli + ne-container-hole,
.ne-typography-traditional.fz16 ne-uli + ne-container-hole,
.ne-typography-classic.fz16 ne-oli + ne-container-hole,
.ne-typography-traditional.fz16 ne-oli + ne-container-hole,
.ne-typography-classic.fz16 ne-tli + ne-container-hole,
.ne-typography-traditional.fz16 ne-tli + ne-container-hole,
.ne-typography-classic.fz16 ne-uli + .ne-spacing-all,
.ne-typography-traditional.fz16 ne-uli + .ne-spacing-all,
.ne-typography-classic.fz16 ne-oli + .ne-spacing-all,
.ne-typography-traditional.fz16 ne-oli + .ne-spacing-all,
.ne-typography-classic.fz16 ne-tli + .ne-spacing-all,
.ne-typography-traditional.fz16 ne-tli + .ne-spacing-all {
  margin-top: 8.256px;
}
.ne-doc-major-viewer-mobile .fz16 .ne-viewer-body > ne-p:first-child,
.ne-doc-major-viewer-mobile .fz16 .ne-viewer-body > ne-uli:first-child,
.ne-doc-major-viewer-mobile .fz16 .ne-viewer-body > ne-oli:first-child,
.ne-doc-major-viewer-mobile .fz16 .ne-viewer-body > ne-tli:first-child {
  margin-top: 8.256px;
}
.ne-typography-classic.fz19.ne-viewer .ne-viewer-body .ne-spacing-all,
.ne-typography-traditional.fz19.ne-viewer .ne-viewer-body .ne-spacing-all {
  margin-top: 0;
  margin-bottom: 9.804px;
}
.ne-typography-classic.fz19.ne-viewer .ne-viewer-body ne-uli + .ne-spacing-all,
.ne-typography-traditional.fz19.ne-viewer .ne-viewer-body ne-uli + .ne-spacing-all,
.ne-typography-classic.fz19.ne-viewer .ne-viewer-body ne-oli + .ne-spacing-all,
.ne-typography-traditional.fz19.ne-viewer .ne-viewer-body ne-oli + .ne-spacing-all,
.ne-typography-classic.fz19.ne-viewer .ne-viewer-body ne-tli + .ne-spacing-all,
.ne-typography-traditional.fz19.ne-viewer .ne-viewer-body ne-tli + .ne-spacing-all {
  margin-top: 9.804px;
}
.ne-typography-classic.fz19 ne-p,
.ne-typography-traditional.fz19 ne-p,
.ne-typography-classic.fz19 ne-hole.ne-spacing-all,
.ne-typography-traditional.fz19 ne-hole.ne-spacing-all,
.ne-typography-classic.fz19 ne-hole,
.ne-typography-traditional.fz19 ne-hole,
.ne-typography-classic.fz19 ne-container-hole.ne-spacing-all,
.ne-typography-traditional.fz19 ne-container-hole.ne-spacing-all,
.ne-typography-classic.fz19 ne-container-hole,
.ne-typography-traditional.fz19 ne-container-hole {
  margin-bottom: 9.804px;
}
.ne-typography-classic.fz19 ne-uli,
.ne-typography-traditional.fz19 ne-uli,
.ne-typography-classic.fz19 ne-oli,
.ne-typography-traditional.fz19 ne-oli,
.ne-typography-classic.fz19 ne-tli,
.ne-typography-traditional.fz19 ne-tli {
  margin-bottom: 4.902px;
}
.ne-typography-classic.fz19 ne-uli:last-child,
.ne-typography-traditional.fz19 ne-uli:last-child,
.ne-typography-classic.fz19 ne-oli:last-child,
.ne-typography-traditional.fz19 ne-oli:last-child,
.ne-typography-classic.fz19 ne-tli:last-child,
.ne-typography-traditional.fz19 ne-tli:last-child {
  margin-bottom: 0;
}
.ne-typography-classic.fz19 ne-uli + ne-p,
.ne-typography-traditional.fz19 ne-uli + ne-p,
.ne-typography-classic.fz19 ne-oli + ne-p,
.ne-typography-traditional.fz19 ne-oli + ne-p,
.ne-typography-classic.fz19 ne-tli + ne-p,
.ne-typography-traditional.fz19 ne-tli + ne-p,
.ne-typography-classic.fz19 ne-uli + ne-hole,
.ne-typography-traditional.fz19 ne-uli + ne-hole,
.ne-typography-classic.fz19 ne-oli + ne-hole,
.ne-typography-traditional.fz19 ne-oli + ne-hole,
.ne-typography-classic.fz19 ne-tli + ne-hole,
.ne-typography-traditional.fz19 ne-tli + ne-hole,
.ne-typography-classic.fz19 ne-uli + ne-table-hole,
.ne-typography-traditional.fz19 ne-uli + ne-table-hole,
.ne-typography-classic.fz19 ne-oli + ne-table-hole,
.ne-typography-traditional.fz19 ne-oli + ne-table-hole,
.ne-typography-classic.fz19 ne-tli + ne-table-hole,
.ne-typography-traditional.fz19 ne-tli + ne-table-hole,
.ne-typography-classic.fz19 ne-uli + ne-container-hole,
.ne-typography-traditional.fz19 ne-uli + ne-container-hole,
.ne-typography-classic.fz19 ne-oli + ne-container-hole,
.ne-typography-traditional.fz19 ne-oli + ne-container-hole,
.ne-typography-classic.fz19 ne-tli + ne-container-hole,
.ne-typography-traditional.fz19 ne-tli + ne-container-hole,
.ne-typography-classic.fz19 ne-uli + .ne-spacing-all,
.ne-typography-traditional.fz19 ne-uli + .ne-spacing-all,
.ne-typography-classic.fz19 ne-oli + .ne-spacing-all,
.ne-typography-traditional.fz19 ne-oli + .ne-spacing-all,
.ne-typography-classic.fz19 ne-tli + .ne-spacing-all,
.ne-typography-traditional.fz19 ne-tli + .ne-spacing-all {
  margin-top: 9.804px;
}
.ne-doc-major-viewer-mobile .fz19 .ne-viewer-body > ne-p:first-child,
.ne-doc-major-viewer-mobile .fz19 .ne-viewer-body > ne-uli:first-child,
.ne-doc-major-viewer-mobile .fz19 .ne-viewer-body > ne-oli:first-child,
.ne-doc-major-viewer-mobile .fz19 .ne-viewer-body > ne-tli:first-child {
  margin-top: 9.804px;
}
.ne-typography-classic.fz22.ne-viewer .ne-viewer-body .ne-spacing-all,
.ne-typography-traditional.fz22.ne-viewer .ne-viewer-body .ne-spacing-all {
  margin-top: 0;
  margin-bottom: 11.352px;
}
.ne-typography-classic.fz22.ne-viewer .ne-viewer-body ne-uli + .ne-spacing-all,
.ne-typography-traditional.fz22.ne-viewer .ne-viewer-body ne-uli + .ne-spacing-all,
.ne-typography-classic.fz22.ne-viewer .ne-viewer-body ne-oli + .ne-spacing-all,
.ne-typography-traditional.fz22.ne-viewer .ne-viewer-body ne-oli + .ne-spacing-all,
.ne-typography-classic.fz22.ne-viewer .ne-viewer-body ne-tli + .ne-spacing-all,
.ne-typography-traditional.fz22.ne-viewer .ne-viewer-body ne-tli + .ne-spacing-all {
  margin-top: 11.352px;
}
.ne-typography-classic.fz22 ne-p,
.ne-typography-traditional.fz22 ne-p,
.ne-typography-classic.fz22 ne-hole.ne-spacing-all,
.ne-typography-traditional.fz22 ne-hole.ne-spacing-all,
.ne-typography-classic.fz22 ne-hole,
.ne-typography-traditional.fz22 ne-hole,
.ne-typography-classic.fz22 ne-container-hole.ne-spacing-all,
.ne-typography-traditional.fz22 ne-container-hole.ne-spacing-all,
.ne-typography-classic.fz22 ne-container-hole,
.ne-typography-traditional.fz22 ne-container-hole {
  margin-bottom: 11.352px;
}
.ne-typography-classic.fz22 ne-uli,
.ne-typography-traditional.fz22 ne-uli,
.ne-typography-classic.fz22 ne-oli,
.ne-typography-traditional.fz22 ne-oli,
.ne-typography-classic.fz22 ne-tli,
.ne-typography-traditional.fz22 ne-tli {
  margin-bottom: 5.676px;
}
.ne-typography-classic.fz22 ne-uli:last-child,
.ne-typography-traditional.fz22 ne-uli:last-child,
.ne-typography-classic.fz22 ne-oli:last-child,
.ne-typography-traditional.fz22 ne-oli:last-child,
.ne-typography-classic.fz22 ne-tli:last-child,
.ne-typography-traditional.fz22 ne-tli:last-child {
  margin-bottom: 0;
}
.ne-typography-classic.fz22 ne-uli + ne-p,
.ne-typography-traditional.fz22 ne-uli + ne-p,
.ne-typography-classic.fz22 ne-oli + ne-p,
.ne-typography-traditional.fz22 ne-oli + ne-p,
.ne-typography-classic.fz22 ne-tli + ne-p,
.ne-typography-traditional.fz22 ne-tli + ne-p,
.ne-typography-classic.fz22 ne-uli + ne-hole,
.ne-typography-traditional.fz22 ne-uli + ne-hole,
.ne-typography-classic.fz22 ne-oli + ne-hole,
.ne-typography-traditional.fz22 ne-oli + ne-hole,
.ne-typography-classic.fz22 ne-tli + ne-hole,
.ne-typography-traditional.fz22 ne-tli + ne-hole,
.ne-typography-classic.fz22 ne-uli + ne-table-hole,
.ne-typography-traditional.fz22 ne-uli + ne-table-hole,
.ne-typography-classic.fz22 ne-oli + ne-table-hole,
.ne-typography-traditional.fz22 ne-oli + ne-table-hole,
.ne-typography-classic.fz22 ne-tli + ne-table-hole,
.ne-typography-traditional.fz22 ne-tli + ne-table-hole,
.ne-typography-classic.fz22 ne-uli + ne-container-hole,
.ne-typography-traditional.fz22 ne-uli + ne-container-hole,
.ne-typography-classic.fz22 ne-oli + ne-container-hole,
.ne-typography-traditional.fz22 ne-oli + ne-container-hole,
.ne-typography-classic.fz22 ne-tli + ne-container-hole,
.ne-typography-traditional.fz22 ne-tli + ne-container-hole,
.ne-typography-classic.fz22 ne-uli + .ne-spacing-all,
.ne-typography-traditional.fz22 ne-uli + .ne-spacing-all,
.ne-typography-classic.fz22 ne-oli + .ne-spacing-all,
.ne-typography-traditional.fz22 ne-oli + .ne-spacing-all,
.ne-typography-classic.fz22 ne-tli + .ne-spacing-all,
.ne-typography-traditional.fz22 ne-tli + .ne-spacing-all {
  margin-top: 11.352px;
}
.ne-doc-major-viewer-mobile .fz22 .ne-viewer-body > ne-p:first-child,
.ne-doc-major-viewer-mobile .fz22 .ne-viewer-body > ne-uli:first-child,
.ne-doc-major-viewer-mobile .fz22 .ne-viewer-body > ne-oli:first-child,
.ne-doc-major-viewer-mobile .fz22 .ne-viewer-body > ne-tli:first-child {
  margin-top: 11.352px;
}
.ne-typography-classic.fz24.ne-viewer .ne-viewer-body .ne-spacing-all,
.ne-typography-traditional.fz24.ne-viewer .ne-viewer-body .ne-spacing-all {
  margin-top: 0;
  margin-bottom: 12.384px;
}
.ne-typography-classic.fz24.ne-viewer .ne-viewer-body ne-uli + .ne-spacing-all,
.ne-typography-traditional.fz24.ne-viewer .ne-viewer-body ne-uli + .ne-spacing-all,
.ne-typography-classic.fz24.ne-viewer .ne-viewer-body ne-oli + .ne-spacing-all,
.ne-typography-traditional.fz24.ne-viewer .ne-viewer-body ne-oli + .ne-spacing-all,
.ne-typography-classic.fz24.ne-viewer .ne-viewer-body ne-tli + .ne-spacing-all,
.ne-typography-traditional.fz24.ne-viewer .ne-viewer-body ne-tli + .ne-spacing-all {
  margin-top: 12.384px;
}
.ne-typography-classic.fz24 ne-p,
.ne-typography-traditional.fz24 ne-p,
.ne-typography-classic.fz24 ne-hole.ne-spacing-all,
.ne-typography-traditional.fz24 ne-hole.ne-spacing-all,
.ne-typography-classic.fz24 ne-hole,
.ne-typography-traditional.fz24 ne-hole,
.ne-typography-classic.fz24 ne-container-hole.ne-spacing-all,
.ne-typography-traditional.fz24 ne-container-hole.ne-spacing-all,
.ne-typography-classic.fz24 ne-container-hole,
.ne-typography-traditional.fz24 ne-container-hole {
  margin-bottom: 12.384px;
}
.ne-typography-classic.fz24 ne-uli,
.ne-typography-traditional.fz24 ne-uli,
.ne-typography-classic.fz24 ne-oli,
.ne-typography-traditional.fz24 ne-oli,
.ne-typography-classic.fz24 ne-tli,
.ne-typography-traditional.fz24 ne-tli {
  margin-bottom: 6.192px;
}
.ne-typography-classic.fz24 ne-uli:last-child,
.ne-typography-traditional.fz24 ne-uli:last-child,
.ne-typography-classic.fz24 ne-oli:last-child,
.ne-typography-traditional.fz24 ne-oli:last-child,
.ne-typography-classic.fz24 ne-tli:last-child,
.ne-typography-traditional.fz24 ne-tli:last-child {
  margin-bottom: 0;
}
.ne-typography-classic.fz24 ne-uli + ne-p,
.ne-typography-traditional.fz24 ne-uli + ne-p,
.ne-typography-classic.fz24 ne-oli + ne-p,
.ne-typography-traditional.fz24 ne-oli + ne-p,
.ne-typography-classic.fz24 ne-tli + ne-p,
.ne-typography-traditional.fz24 ne-tli + ne-p,
.ne-typography-classic.fz24 ne-uli + ne-hole,
.ne-typography-traditional.fz24 ne-uli + ne-hole,
.ne-typography-classic.fz24 ne-oli + ne-hole,
.ne-typography-traditional.fz24 ne-oli + ne-hole,
.ne-typography-classic.fz24 ne-tli + ne-hole,
.ne-typography-traditional.fz24 ne-tli + ne-hole,
.ne-typography-classic.fz24 ne-uli + ne-table-hole,
.ne-typography-traditional.fz24 ne-uli + ne-table-hole,
.ne-typography-classic.fz24 ne-oli + ne-table-hole,
.ne-typography-traditional.fz24 ne-oli + ne-table-hole,
.ne-typography-classic.fz24 ne-tli + ne-table-hole,
.ne-typography-traditional.fz24 ne-tli + ne-table-hole,
.ne-typography-classic.fz24 ne-uli + ne-container-hole,
.ne-typography-traditional.fz24 ne-uli + ne-container-hole,
.ne-typography-classic.fz24 ne-oli + ne-container-hole,
.ne-typography-traditional.fz24 ne-oli + ne-container-hole,
.ne-typography-classic.fz24 ne-tli + ne-container-hole,
.ne-typography-traditional.fz24 ne-tli + ne-container-hole,
.ne-typography-classic.fz24 ne-uli + .ne-spacing-all,
.ne-typography-traditional.fz24 ne-uli + .ne-spacing-all,
.ne-typography-classic.fz24 ne-oli + .ne-spacing-all,
.ne-typography-traditional.fz24 ne-oli + .ne-spacing-all,
.ne-typography-classic.fz24 ne-tli + .ne-spacing-all,
.ne-typography-traditional.fz24 ne-tli + .ne-spacing-all {
  margin-top: 12.384px;
}
.ne-doc-major-viewer-mobile .fz24 .ne-viewer-body > ne-p:first-child,
.ne-doc-major-viewer-mobile .fz24 .ne-viewer-body > ne-uli:first-child,
.ne-doc-major-viewer-mobile .fz24 .ne-viewer-body > ne-oli:first-child,
.ne-doc-major-viewer-mobile .fz24 .ne-viewer-body > ne-tli:first-child {
  margin-top: 12.384px;
}
ne-hole.ne-spacing-all,
ne-container-hole.ne-spacing-all,
ne-card.ne-spacing-all {
  margin-top: 0;
}

    `;
    document.body.appendChild(style);
}