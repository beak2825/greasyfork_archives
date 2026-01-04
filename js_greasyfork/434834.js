/**
* Author: 稻米鼠
* Version: 2021-11-10 16:00
*/
class MouseUI {
  #style = `
    .mouse-root {
      --Gray_0: #333336;
      --Gray_1: #666669;
      --Gray_2: #99999c;
      --Gray_3: #cccccf;
      --Gray_4: #efeff3;
      --Red: #e06c6c;
      --Light_Red: #ffacac;
      --Blue: #007bda;
      --Light_Blue: #6cc6e6;
      --Space: 6px;
      --Space_2: 12px;
      font-size: 18px;
      font-family: -apple-system, BlinkMacSystemFont, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Segoe UI", "PingFang SC", "Hiragino Sans GB", "WenQuanYi Micro Hei", "Lantinghei SC", "Source Han Sans", "Microsoft YaHei", "Helvetica Neue", "Noto Sans CJK", Helvetica, Arial, sans-serif;
      font-weight: normal;
      line-height: 1.6;
      color: #333336;
      margin: 0;
      padding: 0;
    }
    .mouse-root,
    .mouse-root * {
      box-sizing: border-box;
    }
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
      background-color: rgba(0,0,0,0.05);
    }
    ::-webkit-scrollbar-button {
      display: 'none';
    }
    ::-webkit-scrollbar-thumb {
      background-color: rgba(0,0,0,0.5);
      border-radius: 3px;
    }
    a {
      color: #e06c6c;
      text-decoration: none;
      padding: 0 6px;
      border-radius: 4px;
    }
    a:visited {
      color: #e06c6c;
    }
    a:hover {
      color: #efeff3;
      background-color: #e06c6c;
    }
    a:active {
      color: #efeff3;
      background-color: #ffacac;
    }
    p,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    hr,
    ul,
    ol {
      margin: 6px 0;
    }
    hr {
      border: none;
      background: #cccccf;
      height: 1px;
    }
    .flex-area {
      display: flex;
      flex-wrap: nowrap;
      justify-content: center;
      align-content: center;
      align-items: stretch;
    }
    .flex-ver {
      flex-direction: column;
    }
    .fixed-center {
      left: 50%;
      transform: translate(-50%, 0);
    }
    .full-area {
      width: 100vw;
    }
    .content-area {
      width: 800px;
      max-width: 100%;
    }
    .mini-content-area {
      width: 640px;
      max-width: 100%;
    }
    .card-area {
      width: 360px;
      max-width: 100%;
    }
    button {
      background-color: #efeff3;
      color: #333336;
      font-size: 21.599999999999998px;
      line-height: 1.6;
      border: 1px solid #cccccf;
      border-radius: 4px;
      margin: 6px 0;
      cursor: pointer;
    }
    button:hover {
      background-color: #99999c;
      color: #efeff3;
    }
    textarea {
      display: block;
      padding: 12px;
      margin: 6px 0;
      border: 1px solid #cccccf;
      border-radius: 4px;
      resize: none;
      flex-grow: 1;
      font-family: -apple-system, BlinkMacSystemFont, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Segoe UI", "PingFang SC", "Hiragino Sans GB", "WenQuanYi Micro Hei", "Lantinghei SC", "Source Han Sans", "Microsoft YaHei", "Helvetica Neue", "Noto Sans CJK", Helvetica, Arial, sans-serif;
    }
    .text-center {
      text-align: center;
    }
    .text-small {
      font-size: small;
    }
    .hidden {
      display: none;
    }
    .panel {
      position: fixed;
      z-index: 2147483647;
    }
    .panel .trigger {
      position: absolute;
      width: 36px;
      height: 36px;
      background: rgba(224,108,108,0.3);
      border-radius: 18px;
      cursor: pointer;
      z-index: 10;
    }
    .panel .trigger::before {
      content: " ";
      position: absolute;
      left: 6px;
      top: 6px;
      width: 24px;
      height: 24px;
      border-radius: 12px;
      background: rgba(224,108,108,0.6);
    }
    .card {
      background-color: #efeff3;
      backdrop-filter: blur(12px);
      border: 1px solid #cccccf;
      border-radius: 4px;
      padding: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.1), 0 8px 48px rgba(0,0,0,0.2);
    }
    .card>*:first-child {
      margin-top: 0;
    }
    .button-group {
      display: flex;
      flex-wrap: nowrap;
      justify-content: center;
      align-content: center;
      align-items: stretch;
    }
    .button-group > button {
      flex-grow: 1;
      border-right: none;
      border-radius: 0;
    }
    .button-group > button:first-child {
      border-radius: 4px 0 0 4px;
    }
    .button-group > button:last-child {
      border-radius: 0 4px 4px 0;
      border: 1px solid #cccccf;
    }
    .button-group > button.radio:hover {
      background-color: #efeff3;
      color: #333336;
    }
    .button-group > button.radio.checked {
      background-color: #007bda;
      color: #efeff3;
    }
    .tab-group {
      border-bottom: 1px solid #cccccf;
    }
    .tab-group > .tab {
      padding: 0 12px;
      cursor: pointer;
    }
    .tab-group > .tab.checked {
      border: 1px solid #cccccf;
      border-bottom: none;
      border-radius: 6px 6px 0 0;
      background-color: #fff;
      color: #007bda;
      font-weight: 600;
    }
    ul.no-point,
    ol.no-point {
      padding: 0;
    }
    ul.no-point>li,
    ol.no-point>li {
      list-style: none;
    }
    
  `
  constructor(){

  }
  toString(){
    return this.#style
  }
}