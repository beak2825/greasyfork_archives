// ==UserScript==
// @name         【哔哩哔哩】一些任务
// @namespace    https://github.com/AkagiYui/UserScript
// @version      0.0.9
// @author       AkagiYui
// @description  可以一键执行一系列操作。
// @license      MIT
// @icon         https://static.hdslb.com/images/favicon.ico
// @homepage     https://github.com/AkagiYui
// @supportURL   https://github.com/AkagiYui/UserScript/issues
// @match        https://space.bilibili.com/*/favlist*
// @match        https://www.bilibili.com/list/ml*
// @match        https://www.bilibili.com/list/watchlater*
// @require      https://cdn.jsdelivr.net/npm/preact@10.26.9/dist/preact.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/542938/%E3%80%90%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E3%80%91%E4%B8%80%E4%BA%9B%E4%BB%BB%E5%8A%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/542938/%E3%80%90%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E3%80%91%E4%B8%80%E4%BA%9B%E4%BB%BB%E5%8A%A1.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const t=document.createElement("style");t.textContent=e,document.head.append(t)})(' .floating-button{position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:50%;border:none;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px #00000026,0 2px 6px #0000001a;transition:all .3s cubic-bezier(.4,0,.2,1);z-index:9999;font-family:inherit;outline:none}.floating-button:hover{transform:translateY(-2px);box-shadow:0 6px 16px #0003,0 3px 8px #00000026;background:linear-gradient(135deg,#5a6fd8,#6a4190)}.floating-button:active{transform:translateY(0);box-shadow:0 2px 8px #0003,0 1px 4px #0000001a}.floating-button:focus-visible{outline:2px solid #667eea;outline-offset:2px}.floating-button svg{width:24px;height:24px;transition:transform .2s ease}.floating-button:hover svg{transform:scale(1.1)}.floating-button *{box-sizing:border-box}@media (max-width: 768px){.floating-button{bottom:16px;right:16px;width:48px;height:48px}.floating-button svg{width:20px;height:20px}}.modal-backdrop{position:fixed;top:0;left:0;right:0;bottom:0;background-color:#0009;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);z-index:10000;display:flex;align-items:center;justify-content:center;animation:modal-fade-in .3s cubic-bezier(.4,0,.2,1)}.modal-backdrop--closing{animation:modal-fade-out .3s cubic-bezier(.4,0,.2,1)}.modal-content{position:relative;width:100%;height:100%;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:0;box-shadow:0 20px 40px #0000004d;display:flex;flex-direction:column;animation:modal-slide-up .3s cubic-bezier(.4,0,.2,1);overflow:hidden}.modal-content--closing{animation:modal-slide-down .3s cubic-bezier(.4,0,.2,1)}.modal-header{position:absolute;top:20px;left:80px;right:20px;z-index:10001;display:flex;justify-content:space-between;align-items:center}.modal-header-info{display:flex;align-items:center;gap:12px;flex-shrink:1;min-width:0}.modal-title{font-size:1.4rem;font-weight:600;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.5);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.modal-repo-link{font-size:.9rem;color:#87ceeb;text-decoration:none;transition:all .2s ease;text-shadow:0 1px 2px rgba(0,0,0,.5);white-space:nowrap;flex-shrink:0}.modal-repo-link:hover{color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.5),0 0 8px rgba(135,206,235,.6);text-decoration:underline}.modal-close-button{width:48px;height:48px;border-radius:50%;border:none;background:#fff3;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s ease;outline:none;padding:0;box-sizing:border-box}.modal-close-button:hover{background:#ffffff4d;transform:translateY(2px)}.modal-close-button:active{transform:translateY(0);background:#fff6}.modal-close-button:focus-visible{outline:2px solid rgba(255,255,255,.8);outline-offset:2px}.modal-close-button svg{width:24px;height:24px;transition:transform .2s ease;display:block;flex-shrink:0}.modal-body{flex:1;padding:80px 40px 40px;overflow-y:auto;color:#fff}@keyframes modal-fade-in{0%{opacity:0}to{opacity:1}}@keyframes modal-fade-out{0%{opacity:1}to{opacity:0}}@keyframes modal-slide-up{0%{transform:translateY(100%)}to{transform:translateY(0)}}@keyframes modal-slide-down{0%{transform:translateY(0)}to{transform:translateY(100%)}}.modal-backdrop *,.modal-content *,.modal-header *,.modal-body *{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif}@media (max-width: 768px){.modal-header{top:16px;left:20px;right:16px}.modal-header-info{gap:8px}.modal-title{font-size:1.2rem}.modal-repo-link{font-size:.85rem}.modal-close-button{width:40px;height:40px}.modal-close-button svg{width:20px;height:20px}.modal-body{padding:60px 20px 20px}}@media (max-width: 480px){.modal-header-info{gap:6px}.modal-title{font-size:.9rem}.modal-repo-link{font-size:.8rem}}.script-card{background:#0006;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-radius:12px;border:1px solid rgba(255,255,255,.3);margin-bottom:16px;transition:all .3s ease;overflow:hidden}.script-card:hover{background:#00000080;border-color:#fff6;transform:translateY(-2px)}.script-card.running{border-color:#4caf50;box-shadow:0 0 20px #4caf504d}.script-header{padding:20px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;-webkit-user-select:none;user-select:none}.script-info{flex:1;min-width:0}.script-name{font-size:1.2rem;font-weight:600;margin:0 0 8px;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.5)}.script-description{font-size:.9rem;margin:0 0 12px;color:#fffffff2;line-height:1.4;text-shadow:0 1px 2px rgba(0,0,0,.3)}.script-category{display:inline-block;padding:4px 12px;border-radius:16px;font-size:.8rem;font-weight:500;text-transform:uppercase;letter-spacing:.5px}.script-category.tool{background:#2196f333;color:#2196f3;border:1px solid rgba(33,150,243,.3)}.script-category.operation{background:#ff980033;color:#ff9800;border:1px solid rgba(255,152,0,.3)}.script-controls{display:flex;align-items:center;gap:12px;margin-left:20px}.progress-container{display:flex;align-items:center;gap:8px;min-width:120px}.progress-bar{width:80px;height:6px;background:#fff3;border-radius:3px;overflow:hidden}.progress-fill{height:100%;background:linear-gradient(90deg,#4caf50,#8bc34a);border-radius:3px;transition:width .3s ease}.progress-text{font-size:.8rem;color:#fffc;font-weight:500;min-width:32px}.expand-button{width:32px;height:32px;border:none;background:#ffffff1a;border-radius:50%;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s ease}.expand-button:hover{background:#fff3}.expand-button.expanded{transform:rotate(180deg)}.script-body{padding:0 20px 20px;border-top:1px solid rgba(255,255,255,.2);animation:slideDown .3s ease;background:#0003}@keyframes slideDown{0%{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}.script-parameters{margin-top:10px;padding-top:16px}.parameter-group{margin-bottom:20px}.parameter-label{display:block;font-size:.9rem;font-weight:500;margin-bottom:8px;color:#fffffff2;text-shadow:0 1px 2px rgba(0,0,0,.3)}.parameter-label .required{color:#f44336;margin-left:4px}.script-input,.script-select,.script-textarea{width:100%;padding:12px;border:1px solid rgba(255,255,255,.3);border-radius:8px;background:#0000004d;color:#fff;font-size:.9rem;transition:all .2s ease;text-shadow:0 1px 2px rgba(0,0,0,.3)}.script-select{background:#00000080;color:#fff;border:1px solid rgba(255,255,255,.4)}.script-select option{background:#2a2a2a;color:#fff;padding:8px 12px;border:none;font-size:.9rem}.script-select option:hover,.script-select option:focus{background:#3a3a3a;color:#fff}.script-select option:checked,.script-select option:selected{background:#4a4a4a;color:#fff;font-weight:500}.script-input:focus,.script-select:focus,.script-textarea:focus{outline:none;border-color:#2196f3;background:#ffffff26}.script-input::placeholder,.script-textarea::placeholder{color:#ffffff80}.script-input:disabled,.script-select:disabled,.script-textarea:disabled{opacity:.6;cursor:not-allowed}.script-checkbox{display:flex;align-items:center;cursor:pointer;position:relative}.script-checkbox input[type=checkbox]{opacity:0;position:absolute;width:0;height:0}.checkmark{width:20px;height:20px;border:2px solid rgba(255,255,255,.3);border-radius:4px;background:#ffffff1a;position:relative;transition:all .2s ease}.script-checkbox input[type=checkbox]:checked+.checkmark{background:#2196f3;border-color:#2196f3}.script-checkbox input[type=checkbox]:checked+.checkmark:after{content:"";position:absolute;left:6px;top:2px;width:6px;height:10px;border:solid white;border-width:0 2px 2px 0;transform:rotate(45deg)}.parameter-description{font-size:.8rem;color:#fff9;margin:8px 0 0;line-height:1.4}.favorite-selector{position:relative}.favorite-input-wrapper{position:relative;display:flex;align-items:center}.favorite-input{width:100%;padding-right:36px}.favorite-clear-button{position:absolute;right:8px;top:50%;transform:translateY(-50%);width:24px;height:24px;border:none;background:#ffffff1a;color:#fff9;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s ease;z-index:1}.favorite-clear-button:hover{background:#fff3;color:#ffffffe6;transform:translateY(-50%) scale(1.1)}.favorite-clear-button:active{transform:translateY(-50%) scale(.95);background:#ffffff4d}.favorite-clear-button svg{width:14px;height:14px;display:block}.input-wrapper{position:relative;display:flex;align-items:center}.input-wrapper .script-input{width:100%;padding-right:36px}.textarea-wrapper{position:relative}.textarea-wrapper .script-textarea{width:100%;padding-right:36px}.script-card .clear-button{position:absolute;right:8px;top:50%;transform:translateY(-50%);width:24px;height:24px;border:none;background:#ffffff26;color:#fffc;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s ease;z-index:2;box-sizing:border-box}.script-card .clear-button:hover{background:#ffffff40;color:#fff;transform:translateY(-50%) scale(1.1)}.script-card .clear-button:active{transform:translateY(-50%) scale(.95);background:#ffffff59}.script-card .clear-button svg{width:16px;height:16px;display:block;flex-shrink:0;pointer-events:none}.script-card .clear-button svg path{stroke:currentColor}.script-card .clear-button:before{content:"\xD7";font-size:16px;font-weight:700;line-height:1;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:none}.script-card .clear-button:not(:has(svg)){font-size:16px;font-weight:700;line-height:1}.script-card .clear-button:not(:has(svg)):before{display:block}.script-card .clear-button-textarea{top:12px;transform:none}.script-card .clear-button-textarea:hover{transform:scale(1.1)}.script-card .clear-button-textarea:active{transform:scale(.95)}.script-card .clear-button-textarea svg{width:16px;height:16px;display:block;flex-shrink:0;pointer-events:none}.favorite-loading,.favorite-error{margin-top:8px;padding:8px 12px;border-radius:6px;font-size:.8rem;line-height:1.4}.favorite-loading{background:#2196f333;color:#2196f3;border:1px solid rgba(33,150,243,.3)}.favorite-error{background:#f4433633;color:#f44336;border:1px solid rgba(244,67,54,.3);display:flex;align-items:center;justify-content:space-between;gap:8px}.retry-button{padding:4px 8px;border:none;border-radius:4px;background:#f443364d;color:#f44336;font-size:.7rem;cursor:pointer;transition:all .2s ease;flex-shrink:0}.retry-button:hover{background:#f4433666;transform:translateY(-1px)}.retry-button:disabled{opacity:.6;cursor:not-allowed;transform:none}.script-actions{margin-top:24px;display:flex;justify-content:flex-end}.execute-button,.stop-button{padding:12px 24px;border:none;border-radius:8px;font-size:.9rem;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:8px;transition:all .2s ease}.execute-button{background:linear-gradient(135deg,#4caf50,#45a049);color:#fff}.execute-button:hover{background:linear-gradient(135deg,#45a049,#3d8b40);transform:translateY(-1px)}.stop-button{background:linear-gradient(135deg,#f44336,#d32f2f);color:#fff}.stop-button:hover{background:linear-gradient(135deg,#d32f2f,#b71c1c);transform:translateY(-1px)}@media (max-width: 768px){.script-header{padding:16px;flex-direction:column;align-items:flex-start;gap:12px}.script-controls{margin-left:0;width:100%;justify-content:space-between}.script-body{padding:0 16px 16px}.progress-container{min-width:auto;flex:1}.progress-bar{flex:1;min-width:60px}}.log-panel{height:100%;width:100%;display:flex;flex-direction:column;background:#00000080;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-radius:12px;border:1px solid rgba(255,255,255,.3);overflow:hidden;box-sizing:border-box}.log-header{padding:20px;border-bottom:1px solid rgba(255,255,255,.2);display:flex;justify-content:space-between;align-items:center;background:#0000004d}.log-header h3{font-size:1.2rem;font-weight:600;margin:0;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.5)}.log-controls{display:flex;align-items:center;gap:12px}.log-count{font-size:.9rem;color:#ffffffb3;padding:4px 8px;background:#ffffff1a;border-radius:12px}.log-clear-button{padding:8px 12px;border:none;border-radius:6px;background:#f4433633;color:#f44336;font-size:.8rem;cursor:pointer;display:flex;align-items:center;gap:6px;transition:all .2s ease;border:1px solid rgba(244,67,54,.3)}.log-clear-button:hover{background:#f443364d;transform:translateY(-1px)}.log-container{flex:1;overflow-y:auto;padding:0}.log-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#fff9;text-align:center;padding:40px 20px}.empty-icon{font-size:3rem;margin-bottom:16px;opacity:.7}.log-empty p{font-size:1.1rem;font-weight:500;margin:0 0 8px;color:#fffc}.log-empty span{font-size:.9rem;color:#ffffff80}.log-list{padding:12px 0}.log-entry{padding:12px 20px;border-left:3px solid transparent;transition:all .2s ease;animation:slideIn .3s ease}@keyframes slideIn{0%{opacity:0;transform:translate(-10px)}to{opacity:1;transform:translate(0)}}.log-entry:hover{background:#ffffff0d}.log-entry.info{border-left-color:#2196f3}.log-entry.warn{border-left-color:#ff9800}.log-entry.error{border-left-color:#f44336}.log-entry.success{border-left-color:#4caf50}.log-entry.debug{border-left-color:#9c27b0}.log-meta{display:flex;align-items:center;gap:8px;margin-bottom:4px;font-size:.8rem}.log-icon{font-size:1rem;line-height:1}.log-time{color:#fff9;font-family:Courier New,monospace;font-weight:500}.log-script{color:#ffffff80;background:#ffffff1a;padding:2px 6px;border-radius:4px;font-size:.7rem;font-weight:500}.log-message{color:#fffffff2;font-size:.9rem;line-height:1.4;word-break:break-word;margin-left:24px;text-shadow:0 1px 2px rgba(0,0,0,.3);white-space:pre-line}.log-entry.error .log-message{color:#ffcdd2}.log-entry.warn .log-message{color:#ffe0b2}.log-entry.success .log-message{color:#c8e6c9}.log-entry.debug .log-message{color:#e1bee7}.log-footer{padding:16px 20px;border-top:1px solid rgba(255,255,255,.1);background:#ffffff0d}.log-filters{display:flex;justify-content:center;flex-wrap:wrap}.filter-buttons{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.filter-button{display:flex;align-items:center;gap:4px;padding:6px 10px;border:2px solid transparent;border-radius:4px;background:#ffffff1a;color:#fff9;font-size:.8rem;cursor:pointer;transition:all .2s ease;-webkit-user-select:none;user-select:none}.filter-button:hover{background:#ffffff26;color:#fffc}.filter-button.active{color:#fff;background:#ffffff1a}.filter-button.info.active{border-color:#2196f3;background:#2196f333}.filter-button.success.active{border-color:#4caf50;background:#4caf5033}.filter-button.warn.active{border-color:#ff9800;background:#ff980033}.filter-button.error.active{border-color:#f44336;background:#f4433633}.filter-button.debug.active{border-color:#9c27b0;background:#9c27b033}.filter-icon{font-size:.9rem}.log-container::-webkit-scrollbar{width:6px}.log-container::-webkit-scrollbar-track{background:#ffffff1a}.log-container::-webkit-scrollbar-thumb{background:#ffffff4d;border-radius:3px}.log-container::-webkit-scrollbar-thumb:hover{background:#ffffff80}@media (max-width: 768px){.log-header{padding:16px;flex-direction:column;align-items:flex-start;gap:12px}.log-controls{width:100%;justify-content:space-between}.log-entry{padding:10px 16px}.log-message{margin-left:20px;font-size:.85rem}.log-filters{flex-direction:column;align-items:flex-start;gap:8px}.filter-buttons{gap:6px}.filter-button{font-size:.75rem;padding:4px 8px}.log-footer{padding:12px 16px}}.resize-handle{width:8px;height:100%;cursor:col-resize;position:relative;display:flex;align-items:center;justify-content:center;background:transparent;transition:all .2s ease;-webkit-user-select:none;user-select:none;flex-shrink:0}.resize-handle:hover{background:#ffffff1a}.resize-handle--dragging{background:#fff3}.resize-handle-line{position:absolute;left:50%;top:0;bottom:0;width:1px;background:#fff3;transform:translate(-50%);transition:all .2s ease}.resize-handle:hover .resize-handle-line{background:#fff6;width:2px}.resize-handle--dragging .resize-handle-line{background:#fff9;width:2px}.resize-handle-grip{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:4px;height:24px;display:flex;flex-direction:column;justify-content:space-between;align-items:center;opacity:0;transition:opacity .2s ease}.resize-handle:hover .resize-handle-grip,.resize-handle--dragging .resize-handle-grip{opacity:1}.resize-handle-dot{width:2px;height:2px;background:#fff9;border-radius:50%;flex-shrink:0}.resize-handle:hover .resize-handle-dot{background:#fffc}.resize-handle--dragging .resize-handle-dot{background:#fff}body.resizing,body.resizing *{cursor:col-resize!important;-webkit-user-select:none!important;user-select:none!important}@media (max-width: 1024px){.resize-handle{display:none}}@media (prefers-contrast: high){.resize-handle-line{background:#fffc}.resize-handle:hover .resize-handle-line{background:#fff}.resize-handle-dot{background:#ffffffe6}}@media (prefers-reduced-motion: reduce){.resize-handle,.resize-handle-line,.resize-handle-grip{transition:none}}.script-manager{width:100%;height:100%;display:flex;flex-direction:column;color:#fff;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif}.script-manager-header{padding:20px 24px 24px;text-align:center;background:#ffffff0d;border-bottom:1px solid rgba(255,255,255,.1);margin-top:0}.script-manager-header h1{font-size:1.8rem;font-weight:700;margin:0 0 8px;color:#fff;text-shadow:0 2px 4px rgba(0,0,0,.8),0 1px 2px rgba(0,0,0,.6),0 0 8px rgba(102,126,234,.3);line-height:1.2}.script-manager-header p{font-size:1rem;margin:0 0 20px;color:#ffffffe6;text-shadow:0 1px 2px rgba(0,0,0,.5)}.script-manager-header p a{color:#87ceeb;text-decoration:none;transition:all .2s ease;text-shadow:0 1px 2px rgba(0,0,0,.5)}.script-manager-header p a:hover{color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.5),0 0 8px rgba(135,206,235,.6);text-decoration:underline}.status-bar{display:flex;justify-content:center;gap:24px;flex-wrap:wrap}.status-item{display:flex;align-items:center;gap:8px;padding:8px 16px;background:#ffffff1a;border-radius:20px;border:1px solid rgba(255,255,255,.2)}.status-label{font-size:.9rem;color:#ffffffb3}.status-value{font-size:.9rem;font-weight:600;color:#fff;background:#fff3;padding:2px 8px;border-radius:12px;min-width:24px;text-align:center}.status-value.running{background:linear-gradient(135deg,#4caf50,#45a049);color:#fff;animation:pulse 2s infinite}@keyframes pulse{0%,to{opacity:1}50%{opacity:.7}}.script-manager-content{flex:1;display:flex;gap:24px;padding:24px;min-height:0}.scripts-panel{flex-shrink:0;overflow-y:auto;padding-right:12px;box-sizing:border-box}.scripts-section{margin-bottom:32px}.scripts-section:last-child{margin-bottom:0}.scripts-section h2{font-size:1.3rem;font-weight:600;margin:0 0 20px;color:#fff;display:flex;align-items:center;gap:8px;padding-bottom:12px;border-bottom:2px solid rgba(255,255,255,.1)}.scripts-list{display:flex;flex-direction:column;gap:16px}.logs-panel{flex-shrink:0;display:flex;flex-direction:column;box-sizing:border-box}.scripts-panel::-webkit-scrollbar{width:8px}.scripts-panel::-webkit-scrollbar-track{background:#ffffff1a;border-radius:4px}.scripts-panel::-webkit-scrollbar-thumb{background:#ffffff4d;border-radius:4px}.scripts-panel::-webkit-scrollbar-thumb:hover{background:#ffffff80}@media (max-width: 1200px){.scripts-panel{width:400px!important;min-width:350px}.logs-panel{width:auto!important;flex:1;min-width:450px}}@media (max-width: 1024px){.script-manager-content{flex-direction:column;gap:20px}.scripts-panel{width:100%!important;min-width:auto;max-width:none;padding-right:0}.logs-panel{width:100%!important;min-width:auto;height:400px;min-height:300px}}@media (max-width: 768px){.script-manager-content{padding:16px;gap:16px}.script-manager-header{padding:20px 16px}.script-manager-header h1{font-size:1.6rem}.status-bar{gap:16px}.status-item{padding:6px 12px}.scripts-section h2{font-size:1.2rem}.logs-panel{height:350px;min-height:250px}}@media (max-width: 480px){.script-manager-header h1{font-size:1.4rem}.script-manager-header p{font-size:.9rem}.status-bar{flex-direction:column;align-items:center;gap:12px}.status-item{width:100%;max-width:200px;justify-content:space-between}.logs-panel{height:300px;min-height:200px}}.script-manager.loading{opacity:.7;pointer-events:none}.script-manager.loading:after{content:"";position:absolute;top:50%;left:50%;width:40px;height:40px;margin:-20px 0 0 -20px;border:3px solid rgba(255,255,255,.3);border-top:3px solid white;border-radius:50%;animation:spin 1s linear infinite}@keyframes spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.scripts-list:empty:after{content:"\u6682\u65E0\u811A\u672C";display:block;text-align:center;color:#ffffff80;font-style:italic;padding:40px 20px;background:#ffffff0d;border-radius:8px;border:1px dashed rgba(255,255,255,.2)}.task-panel{width:100%;height:100%;display:flex;flex-direction:column;overflow:hidden}.task-panel-header{text-align:center;margin-bottom:40px}.task-panel-header h1{font-size:2.5rem;font-weight:700;margin:0 0 16px;color:#fff;text-shadow:0 2px 4px rgba(0,0,0,.3)}.task-panel-header p{font-size:1.1rem;margin:0;color:#fffc;font-weight:400}.task-panel-content{flex:1;display:flex;flex-direction:column;gap:40px}.counter-section{background:#ffffff1a;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-radius:16px;padding:32px;text-align:center;border:1px solid rgba(255,255,255,.2)}.counter-section h2{font-size:1.5rem;font-weight:600;margin:0 0 24px;color:#fff}.counter-display{margin-bottom:24px}.counter-value{font-size:4rem;font-weight:700;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,.3);display:inline-block;min-width:120px}.counter-controls{display:flex;gap:16px;justify-content:center;align-items:center}.counter-button{width:48px;height:48px;border-radius:50%;border:none;font-size:1.2rem;font-weight:600;cursor:pointer;transition:all .2s ease;display:flex;align-items:center;justify-content:center;outline:none}.counter-button--decrease{background:#ff6b6be6;color:#fff}.counter-button--decrease:hover{background:#ff6b6b;transform:scale(1.05)}.counter-button--reset{background:#fff3;color:#fff;width:auto;padding:0 20px;border-radius:24px;font-size:.9rem}.counter-button--reset:hover{background:#ffffff4d;transform:scale(1.05)}.counter-button--increase{background:#6bff6be6;color:#fff}.counter-button--increase:hover{background:#6bff6b;transform:scale(1.05)}.counter-button:active{transform:scale(.95)}.counter-button:focus-visible{outline:2px solid rgba(255,255,255,.8);outline-offset:2px}.placeholder-section{background:#ffffff1a;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-radius:16px;padding:32px;border:1px solid rgba(255,255,255,.2)}.placeholder-section h2{font-size:1.5rem;font-weight:600;margin:0 0 24px;color:#fff;text-align:center}.feature-list{display:flex;flex-direction:column;gap:20px}.feature-item{display:flex;align-items:center;gap:16px;padding:16px;background:#ffffff0d;border-radius:12px;border:1px solid rgba(255,255,255,.1);transition:all .2s ease}.feature-item:hover{background:#ffffff1a;transform:translateY(-2px)}.feature-icon{font-size:2rem;width:48px;height:48px;display:flex;align-items:center;justify-content:center;background:#ffffff1a;border-radius:12px;flex-shrink:0}.feature-text h3{font-size:1.1rem;font-weight:600;margin:0 0 4px;color:#fff}.feature-text p{font-size:.9rem;margin:0;color:#ffffffb3}@media (max-width: 768px){.task-panel-header h1{font-size:2rem}.task-panel-content{gap:24px}.counter-section,.placeholder-section{padding:24px}.counter-value{font-size:3rem}.counter-controls{gap:12px}.counter-button{width:40px;height:40px;font-size:1rem}.feature-list{gap:16px}.feature-item{padding:12px}.feature-icon{font-size:1.5rem;width:40px;height:40px}} ');

(function (preact) {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var f$1 = 0;
  function u$1(e2, t2, n, o2, i2, u2) {
    t2 || (t2 = {});
    var a2, c2, p2 = t2;
    if ("ref" in p2) for (c2 in p2 = {}, t2) "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
    var l2 = { type: e2, props: p2, key: n, ref: a2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f$1, __i: -1, __u: 0, __source: i2, __self: u2 };
    if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2]);
    return preact.options.vnode && preact.options.vnode(l2), l2;
  }
  var t, r, u, i, o = 0, f = [], c = preact.options, e = c.__b, a = c.__r, v = c.diffed, l = c.__c, m = c.unmount, s = c.__;
  function p(n, t2) {
    c.__h && c.__h(r, n, o || t2), o = 0;
    var u2 = r.__H || (r.__H = { __: [], __h: [] });
    return n >= u2.__.length && u2.__.push({}), u2.__[n];
  }
  function d(n) {
    return o = 1, h(D, n);
  }
  function h(n, u2, i2) {
    var o2 = p(t++, 2);
    if (o2.t = n, !o2.__c && (o2.__ = [D(void 0, u2), function(n2) {
      var t2 = o2.__N ? o2.__N[0] : o2.__[0], r2 = o2.t(t2, n2);
      t2 !== r2 && (o2.__N = [r2, o2.__[1]], o2.__c.setState({}));
    }], o2.__c = r, !r.__f)) {
      var f2 = function(n2, t2, r2) {
        if (!o2.__c.__H) return true;
        var u3 = o2.__c.__H.__.filter(function(n3) {
          return !!n3.__c;
        });
        if (u3.every(function(n3) {
          return !n3.__N;
        })) return !c2 || c2.call(this, n2, t2, r2);
        var i3 = o2.__c.props !== n2;
        return u3.forEach(function(n3) {
          if (n3.__N) {
            var t3 = n3.__[0];
            n3.__ = n3.__N, n3.__N = void 0, t3 !== n3.__[0] && (i3 = true);
          }
        }), c2 && c2.call(this, n2, t2, r2) || i3;
      };
      r.__f = true;
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
  function y(n, u2) {
    var i2 = p(t++, 3);
    !c.__s && C(i2.__H, u2) && (i2.__ = n, i2.u = u2, r.__H.__h.push(i2));
  }
  function A(n) {
    return o = 5, T(function() {
      return { current: n };
    }, []);
  }
  function T(n, r2) {
    var u2 = p(t++, 7);
    return C(u2.__H, r2) && (u2.__ = n(), u2.__H = r2, u2.__h = n), u2.__;
  }
  function j() {
    for (var n; n = f.shift(); ) if (n.__P && n.__H) try {
      n.__H.__h.forEach(z), n.__H.__h.forEach(B), n.__H.__h = [];
    } catch (t2) {
      n.__H.__h = [], c.__e(t2, n.__v);
    }
  }
  c.__b = function(n) {
    r = null, e && e(n);
  }, c.__ = function(n, t2) {
    n && t2.__k && t2.__k.__m && (n.__m = t2.__k.__m), s && s(n, t2);
  }, c.__r = function(n) {
    a && a(n), t = 0;
    var i2 = (r = n.__c).__H;
    i2 && (u === r ? (i2.__h = [], r.__h = [], i2.__.forEach(function(n2) {
      n2.__N && (n2.__ = n2.__N), n2.u = n2.__N = void 0;
    })) : (i2.__h.forEach(z), i2.__h.forEach(B), i2.__h = [], t = 0)), u = r;
  }, c.diffed = function(n) {
    v && v(n);
    var t2 = n.__c;
    t2 && t2.__H && (t2.__H.__h.length && (1 !== f.push(t2) && i === c.requestAnimationFrame || ((i = c.requestAnimationFrame) || w)(j)), t2.__H.__.forEach(function(n2) {
      n2.u && (n2.__H = n2.u), n2.u = void 0;
    })), u = r = null;
  }, c.__c = function(n, t2) {
    t2.some(function(n2) {
      try {
        n2.__h.forEach(z), n2.__h = n2.__h.filter(function(n3) {
          return !n3.__ || B(n3);
        });
      } catch (r2) {
        t2.some(function(n3) {
          n3.__h && (n3.__h = []);
        }), t2 = [], c.__e(r2, n2.__v);
      }
    }), l && l(n, t2);
  }, c.unmount = function(n) {
    m && m(n);
    var t2, r2 = n.__c;
    r2 && r2.__H && (r2.__H.__.forEach(function(n2) {
      try {
        z(n2);
      } catch (n3) {
        t2 = n3;
      }
    }), r2.__H = void 0, t2 && c.__e(t2, r2.__v));
  };
  var k = "function" == typeof requestAnimationFrame;
  function w(n) {
    var t2, r2 = function() {
      clearTimeout(u2), k && cancelAnimationFrame(t2), setTimeout(n);
    }, u2 = setTimeout(r2, 35);
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
  function FloatingButton({ onClick }) {
    return /* @__PURE__ */ u$1(
      "button",
      {
        class: "floating-button",
        onClick,
        title: "打开任务面板",
        "aria-label": "打开任务面板",
        children: /* @__PURE__ */ u$1(
          "svg",
          {
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            children: [
              /* @__PURE__ */ u$1(
                "path",
                {
                  d: "M12 2L2 7L12 12L22 7L12 2Z",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round"
                }
              ),
              /* @__PURE__ */ u$1(
                "path",
                {
                  d: "M2 17L12 22L22 17",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round"
                }
              ),
              /* @__PURE__ */ u$1(
                "path",
                {
                  d: "M2 12L12 17L22 12",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round"
                }
              )
            ]
          }
        )
      }
    );
  }
  function Modal({ isOpen, onClose, children }) {
    const [isClosing, setIsClosing] = d(false);
    y(() => {
      if (isOpen) {
        const originalOverflow = document.body.style.overflow;
        const originalPaddingRight = document.body.style.paddingRight;
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = "hidden";
        if (scrollBarWidth > 0) {
          document.body.style.paddingRight = `${scrollBarWidth}px`;
        }
        return () => {
          document.body.style.overflow = originalOverflow;
          document.body.style.paddingRight = originalPaddingRight;
        };
      }
    }, [isOpen]);
    const handleClose = () => {
      setIsClosing(true);
      setTimeout(() => {
        setIsClosing(false);
        onClose();
      }, 300);
    };
    const handleBackdropClick = (e2) => {
      if (e2.target === e2.currentTarget) {
        handleClose();
      }
    };
    if (!isOpen && !isClosing) {
      return null;
    }
    return /* @__PURE__ */ u$1(
      "div",
      {
        class: `modal-backdrop ${isClosing ? "modal-backdrop--closing" : ""}`,
        onClick: handleBackdropClick,
        children: /* @__PURE__ */ u$1("div", { class: `modal-content ${isClosing ? "modal-content--closing" : ""}`, children: [
          /* @__PURE__ */ u$1("div", { class: "modal-header", children: [
            /* @__PURE__ */ u$1("div", { class: "modal-header-info", children: [
              /* @__PURE__ */ u$1("span", { class: "modal-title", children: "【哔哩哔哩】一些任务" }),
              /* @__PURE__ */ u$1(
                "a",
                {
                  href: "https://github.com/AkagiYui",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  class: "modal-repo-link",
                  title: "访问作者仓库",
                  children: "AkagiYui"
                }
              )
            ] }),
            /* @__PURE__ */ u$1(
              "button",
              {
                class: "modal-close-button",
                onClick: handleClose,
                title: "关闭面板",
                "aria-label": "关闭面板",
                children: /* @__PURE__ */ u$1(
                  "svg",
                  {
                    width: "24",
                    height: "24",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg",
                    children: /* @__PURE__ */ u$1(
                      "path",
                      {
                        d: "M19 9L12 16L5 9",
                        stroke: "currentColor",
                        "stroke-width": "2",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round"
                      }
                    )
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ u$1("div", { class: "modal-body", children })
        ] })
      }
    );
  }
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  function ScriptCard({
    script,
    onExecute,
    onStop,
    isRunning,
    progress = 0,
    favoriteList,
    favoriteListLoading = false,
    favoriteListError,
    onRetryFavoriteList
  }) {
    const [parameters, setParameters] = d({});
    const [isExpanded, setIsExpanded] = d(false);
    const [focusedFavoriteInputs, setFocusedFavoriteInputs] = d(/* @__PURE__ */ new Set());
    y(() => {
      const storageKey = `bili_tasks_params_${script.id}`;
      const savedParams = _GM_getValue(storageKey, "{}");
      try {
        const parsedParams = JSON.parse(savedParams);
        const initialParams = {};
        script.parameters.forEach((param) => {
          initialParams[param.key] = parsedParams[param.key] !== void 0 ? parsedParams[param.key] : param.defaultValue;
        });
        setParameters(initialParams);
      } catch (error) {
        console.warn("Failed to load saved parameters:", error);
        const initialParams = {};
        script.parameters.forEach((param) => {
          initialParams[param.key] = param.defaultValue;
        });
        setParameters(initialParams);
      }
    }, [script.id, script.parameters]);
    y(() => {
      if (Object.keys(parameters).length > 0) {
        const storageKey = `bili_tasks_params_${script.id}`;
        _GM_setValue(storageKey, JSON.stringify(parameters));
      }
    }, [parameters, script.id]);
    const handleParameterChange = (key, value) => {
      setParameters((prev) => ({
        ...prev,
        [key]: value
      }));
    };
    const handleExecute = () => {
      const missingParams = script.parameters.filter((param) => param.required && !parameters[param.key]).map((param) => param.label);
      if (missingParams.length > 0) {
        alert(`请填写必填参数: ${missingParams.join(", ")}`);
        return;
      }
      onExecute(script.id, parameters);
    };
    const handleStop = () => {
      onStop(script.id);
    };
    const isFavoriteIdParameter = (param) => {
      return param.type === "number" && (param.label.includes("收藏夹ID") || param.key.toLowerCase().includes("favorite"));
    };
    const getFavoriteOptions = () => {
      if (!(favoriteList == null ? void 0 : favoriteList.list)) return [];
      return favoriteList.list.map((fav) => ({
        value: `${fav.title}(${fav.id})`,
        // value设置为显示格式
        id: fav.id,
        // 保留原始ID用于提取
        title: fav.title
      })).sort((a2, b) => a2.value.localeCompare(b.value));
    };
    const getFavoriteTitleById = (id) => {
      if (!(favoriteList == null ? void 0 : favoriteList.list)) return null;
      const favorite = favoriteList.list.find((fav) => fav.id === id);
      return favorite ? favorite.title : null;
    };
    const formatDisplayValue = (value) => {
      if (!value) return "";
      const title = getFavoriteTitleById(value);
      return title ? `${title}(${value})` : value.toString();
    };
    const extractIdFromFormattedValue = (formattedValue) => {
      const directNumber = parseInt(formattedValue);
      if (!isNaN(directNumber) && directNumber.toString() === formattedValue) {
        return directNumber;
      }
      const match = formattedValue.match(/\((\d+)\)$/);
      if (match) {
        return parseInt(match[1]);
      }
      return null;
    };
    const handleFavoriteInputFocus = (paramKey) => {
      setFocusedFavoriteInputs((prev) => new Set(prev).add(paramKey));
    };
    const handleFavoriteInputBlur = (paramKey) => {
      setFocusedFavoriteInputs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(paramKey);
        return newSet;
      });
    };
    const getFavoriteInputDisplayValue = (paramKey, value) => {
      const isFocused = focusedFavoriteInputs.has(paramKey);
      if (isFocused || value === void 0 || value === null) {
        return value !== void 0 && value !== null ? value.toString() : "";
      }
      return formatDisplayValue(value);
    };
    const renderClearButton = (paramKey, hasValue, className = "") => {
      if (!hasValue || isRunning) return null;
      return /* @__PURE__ */ u$1(
        "button",
        {
          type: "button",
          class: `clear-button ${className}`,
          onClick: () => handleParameterChange(paramKey, ""),
          title: "清空内容",
          "aria-label": "清空内容",
          children: /* @__PURE__ */ u$1("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ u$1(
            "path",
            {
              d: "M12 4L4 12M4 4L12 12",
              stroke: "currentColor",
              "stroke-width": "1.5",
              "stroke-linecap": "round",
              "stroke-linejoin": "round"
            }
          ) })
        }
      );
    };
    const renderParameterInput = (param) => {
      var _a;
      const value = parameters[param.key];
      switch (param.type) {
        case "text":
          return /* @__PURE__ */ u$1("div", { class: "input-wrapper", children: [
            /* @__PURE__ */ u$1(
              "input",
              {
                type: "text",
                value: value !== void 0 && value !== null ? value.toString() : "",
                onChange: (e2) => handleParameterChange(param.key, e2.target.value),
                placeholder: param.placeholder,
                disabled: isRunning,
                class: "script-input"
              }
            ),
            renderClearButton(param.key, value !== void 0 && value !== null && value !== "" && value.toString().trim() !== "")
          ] });
        case "number":
          if (isFavoriteIdParameter(param)) {
            const favoriteOptions = getFavoriteOptions();
            const displayValue = getFavoriteInputDisplayValue(param.key, value);
            return /* @__PURE__ */ u$1("div", { class: "favorite-selector", children: [
              /* @__PURE__ */ u$1("div", { class: "favorite-input-wrapper", children: [
                /* @__PURE__ */ u$1(
                  "input",
                  {
                    type: "text",
                    value: displayValue,
                    onChange: (e2) => {
                      const inputValue = e2.target.value;
                      const extractedId = extractIdFromFormattedValue(inputValue);
                      if (extractedId !== null) {
                        handleParameterChange(param.key, extractedId);
                      }
                    },
                    onFocus: () => handleFavoriteInputFocus(param.key),
                    onBlur: () => handleFavoriteInputBlur(param.key),
                    placeholder: param.placeholder || "输入收藏夹ID或从下拉列表选择",
                    disabled: isRunning,
                    class: "script-input favorite-input",
                    list: `favorites-${script.id}-${param.key}`
                  }
                ),
                renderClearButton(param.key, value !== void 0 && value !== null && value !== "", "clear-button-favorite")
              ] }),
              /* @__PURE__ */ u$1("datalist", { id: `favorites-${script.id}-${param.key}`, children: favoriteOptions.map((option) => /* @__PURE__ */ u$1("option", { value: option.value }, option.id)) }),
              favoriteListLoading && /* @__PURE__ */ u$1("div", { class: "favorite-loading", children: /* @__PURE__ */ u$1("span", { children: "正在加载收藏夹列表..." }) }),
              favoriteListError && /* @__PURE__ */ u$1("div", { class: "favorite-error", children: [
                /* @__PURE__ */ u$1("span", { children: [
                  "加载失败: ",
                  favoriteListError
                ] }),
                onRetryFavoriteList && /* @__PURE__ */ u$1(
                  "button",
                  {
                    type: "button",
                    class: "retry-button",
                    onClick: onRetryFavoriteList,
                    disabled: isRunning,
                    children: "重试"
                  }
                )
              ] })
            ] });
          }
          return /* @__PURE__ */ u$1("div", { class: "input-wrapper", children: [
            /* @__PURE__ */ u$1(
              "input",
              {
                type: "number",
                value: value !== void 0 && value !== null ? value.toString() : "",
                onChange: (e2) => handleParameterChange(param.key, Number(e2.target.value)),
                placeholder: param.placeholder,
                disabled: isRunning,
                class: "script-input"
              }
            ),
            renderClearButton(param.key, value !== void 0 && value !== null && value !== "")
          ] });
        case "boolean":
          return /* @__PURE__ */ u$1("label", { class: "script-checkbox", children: [
            /* @__PURE__ */ u$1(
              "input",
              {
                type: "checkbox",
                checked: value === true,
                onChange: (e2) => handleParameterChange(param.key, e2.target.checked),
                disabled: isRunning
              }
            ),
            /* @__PURE__ */ u$1("span", { class: "checkmark" })
          ] });
        case "select":
          return /* @__PURE__ */ u$1(
            "select",
            {
              value: value || "",
              onChange: (e2) => handleParameterChange(param.key, e2.target.value),
              disabled: isRunning,
              class: "script-select",
              children: [
                /* @__PURE__ */ u$1("option", { value: "", children: "请选择..." }),
                (_a = param.options) == null ? void 0 : _a.map((option) => /* @__PURE__ */ u$1("option", { value: option.value, children: option.label }, option.value))
              ]
            }
          );
        case "textarea":
          return /* @__PURE__ */ u$1("div", { class: "textarea-wrapper", children: [
            /* @__PURE__ */ u$1(
              "textarea",
              {
                value: value !== void 0 && value !== null ? value.toString() : "",
                onChange: (e2) => handleParameterChange(param.key, e2.target.value),
                placeholder: param.placeholder,
                disabled: isRunning,
                class: "script-textarea",
                rows: 4
              }
            ),
            renderClearButton(param.key, value !== void 0 && value !== null && value !== "" && value.toString().trim() !== "", "clear-button-textarea")
          ] });
        default:
          return null;
      }
    };
    return /* @__PURE__ */ u$1("div", { class: `script-card ${script.category} ${isRunning ? "running" : ""}`, children: [
      /* @__PURE__ */ u$1("div", { class: "script-header", onClick: () => setIsExpanded(!isExpanded), children: [
        /* @__PURE__ */ u$1("div", { class: "script-info", children: [
          /* @__PURE__ */ u$1("h3", { class: "script-name", children: script.name }),
          /* @__PURE__ */ u$1("p", { class: "script-description", children: script.description }),
          /* @__PURE__ */ u$1("span", { class: `script-category ${script.category}`, children: script.category === "tool" ? "工具" : "操作" })
        ] }),
        /* @__PURE__ */ u$1("div", { class: "script-controls", children: [
          isRunning && /* @__PURE__ */ u$1("div", { class: "progress-container", children: [
            /* @__PURE__ */ u$1("div", { class: "progress-bar", children: /* @__PURE__ */ u$1(
              "div",
              {
                class: "progress-fill",
                style: { width: `${progress}%` }
              }
            ) }),
            /* @__PURE__ */ u$1("span", { class: "progress-text", children: [
              Math.round(progress),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ u$1(
            "button",
            {
              class: `expand-button ${isExpanded ? "expanded" : ""}`,
              type: "button",
              children: /* @__PURE__ */ u$1("svg", { width: "16", height: "16", viewBox: "0 0 16 16", children: /* @__PURE__ */ u$1("path", { d: "M4 6l4 4 4-4", stroke: "currentColor", "stroke-width": "2", fill: "none" }) })
            }
          )
        ] })
      ] }),
      isExpanded && /* @__PURE__ */ u$1("div", { class: "script-body", children: [
        script.parameters.length > 0 && /* @__PURE__ */ u$1("div", { class: "script-parameters", children: script.parameters.map((param) => /* @__PURE__ */ u$1("div", { class: "parameter-group", children: [
          /* @__PURE__ */ u$1("label", { class: "parameter-label", children: [
            param.label,
            param.required && /* @__PURE__ */ u$1("span", { class: "required", children: "*" })
          ] }),
          renderParameterInput(param),
          param.description && /* @__PURE__ */ u$1("p", { class: "parameter-description", children: param.description })
        ] }, param.key)) }),
        /* @__PURE__ */ u$1("div", { class: "script-actions", children: isRunning ? /* @__PURE__ */ u$1(
          "button",
          {
            class: "stop-button",
            onClick: handleStop,
            type: "button",
            children: [
              /* @__PURE__ */ u$1("svg", { width: "16", height: "16", viewBox: "0 0 16 16", children: /* @__PURE__ */ u$1("rect", { x: "4", y: "4", width: "8", height: "8", fill: "currentColor" }) }),
              "停止执行"
            ]
          }
        ) : /* @__PURE__ */ u$1(
          "button",
          {
            class: "execute-button",
            onClick: handleExecute,
            type: "button",
            children: [
              /* @__PURE__ */ u$1("svg", { width: "16", height: "16", viewBox: "0 0 16 16", children: /* @__PURE__ */ u$1("path", { d: "M5 3l8 5-8 5V3z", fill: "currentColor" }) }),
              "开始执行"
            ]
          }
        ) })
      ] })
    ] });
  }
  function LogPanel({ logs, onClear }) {
    const logContainerRef = A(null);
    const [logLevelFilters, setLogLevelFilters] = d(() => {
      const saved = _GM_getValue("logLevelFilters", null);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
        }
      }
      return {
        info: true,
        success: true,
        warn: true,
        error: true,
        debug: false
      };
    });
    const filteredLogs = logs.filter((log) => logLevelFilters[log.level]);
    const toggleLogLevel = (level) => {
      const newFilters = {
        ...logLevelFilters,
        [level]: !logLevelFilters[level]
      };
      setLogLevelFilters(newFilters);
      _GM_setValue("logLevelFilters", JSON.stringify(newFilters));
    };
    y(() => {
      if (logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
      }
    }, [filteredLogs]);
    const formatTime = (date) => {
      return date.toLocaleTimeString("zh-CN", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
    };
    const getLogIcon = (level) => {
      switch (level) {
        case "info":
          return "ℹ️";
        case "warn":
          return "⚠️";
        case "error":
          return "❌";
        case "success":
          return "✅";
        case "debug":
          return "🔍";
        default:
          return "ℹ️";
      }
    };
    return /* @__PURE__ */ u$1("div", { class: "log-panel", children: [
      /* @__PURE__ */ u$1("div", { class: "log-header", children: [
        /* @__PURE__ */ u$1("h3", { children: "执行日志" }),
        /* @__PURE__ */ u$1("div", { class: "log-controls", children: [
          /* @__PURE__ */ u$1("span", { class: "log-count", children: [
            filteredLogs.length,
            "/",
            logs.length,
            " 条日志"
          ] }),
          /* @__PURE__ */ u$1(
            "button",
            {
              class: "log-clear-button",
              onClick: onClear,
              title: "清空日志",
              children: [
                /* @__PURE__ */ u$1("svg", { width: "16", height: "16", viewBox: "0 0 16 16", children: /* @__PURE__ */ u$1(
                  "path",
                  {
                    d: "M2 3h12M5.5 3V2a1 1 0 011-1h3a1 1 0 011 1v1M7 7v6M9 7v6M4 3v10a1 1 0 001 1h6a1 1 0 001-1V3",
                    stroke: "currentColor",
                    "stroke-width": "1.5",
                    fill: "none"
                  }
                ) }),
                "清空"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ u$1("div", { class: "log-container", ref: logContainerRef, children: filteredLogs.length === 0 ? /* @__PURE__ */ u$1("div", { class: "log-empty", children: [
        /* @__PURE__ */ u$1("div", { class: "empty-icon", children: "📝" }),
        /* @__PURE__ */ u$1("p", { children: logs.length === 0 ? "暂无日志" : "无匹配的日志" }),
        /* @__PURE__ */ u$1("span", { children: logs.length === 0 ? "执行脚本后，日志将在这里显示" : "调整过滤条件以显示更多日志" })
      ] }) : /* @__PURE__ */ u$1("div", { class: "log-list", children: filteredLogs.map((log) => /* @__PURE__ */ u$1("div", { class: `log-entry ${log.level}`, children: [
        /* @__PURE__ */ u$1("div", { class: "log-meta", children: [
          /* @__PURE__ */ u$1("span", { class: "log-icon", children: getLogIcon(log.level) }),
          /* @__PURE__ */ u$1("span", { class: "log-time", children: formatTime(log.timestamp) }),
          log.scriptId && /* @__PURE__ */ u$1("span", { class: "log-script", children: [
            "[",
            log.scriptId,
            "]"
          ] })
        ] }),
        /* @__PURE__ */ u$1("div", { class: "log-message", children: log.message })
      ] }, log.id)) }) }),
      /* @__PURE__ */ u$1("div", { class: "log-footer", children: /* @__PURE__ */ u$1("div", { class: "log-filters", children: /* @__PURE__ */ u$1("div", { class: "filter-buttons", children: [
        /* @__PURE__ */ u$1(
          "button",
          {
            class: `filter-button debug ${logLevelFilters.debug ? "active" : ""}`,
            onClick: () => toggleLogLevel("debug"),
            title: "切换调试日志显示",
            children: [
              /* @__PURE__ */ u$1("span", { class: "filter-icon", children: "🔍" }),
              /* @__PURE__ */ u$1("span", { children: "调试" })
            ]
          }
        ),
        /* @__PURE__ */ u$1(
          "button",
          {
            class: `filter-button info ${logLevelFilters.info ? "active" : ""}`,
            onClick: () => toggleLogLevel("info"),
            title: "切换信息日志显示",
            children: [
              /* @__PURE__ */ u$1("span", { class: "filter-icon", children: "ℹ️" }),
              /* @__PURE__ */ u$1("span", { children: "信息" })
            ]
          }
        ),
        /* @__PURE__ */ u$1(
          "button",
          {
            class: `filter-button success ${logLevelFilters.success ? "active" : ""}`,
            onClick: () => toggleLogLevel("success"),
            title: "切换成功日志显示",
            children: [
              /* @__PURE__ */ u$1("span", { class: "filter-icon", children: "✅" }),
              /* @__PURE__ */ u$1("span", { children: "成功" })
            ]
          }
        ),
        /* @__PURE__ */ u$1(
          "button",
          {
            class: `filter-button warn ${logLevelFilters.warn ? "active" : ""}`,
            onClick: () => toggleLogLevel("warn"),
            title: "切换警告日志显示",
            children: [
              /* @__PURE__ */ u$1("span", { class: "filter-icon", children: "⚠️" }),
              /* @__PURE__ */ u$1("span", { children: "警告" })
            ]
          }
        ),
        /* @__PURE__ */ u$1(
          "button",
          {
            class: `filter-button error ${logLevelFilters.error ? "active" : ""}`,
            onClick: () => toggleLogLevel("error"),
            title: "切换错误日志显示",
            children: [
              /* @__PURE__ */ u$1("span", { class: "filter-icon", children: "❌" }),
              /* @__PURE__ */ u$1("span", { children: "错误" })
            ]
          }
        )
      ] }) }) })
    ] });
  }
  function ResizeHandle({ onMouseDown, isDragging }) {
    const handleRef = A(null);
    y(() => {
      const handleElement = handleRef.current;
      if (!handleElement) return;
      const handleMouseDown = (e2) => {
        e2.preventDefault();
        onMouseDown(e2);
      };
      handleElement.addEventListener("mousedown", handleMouseDown);
      return () => {
        handleElement.removeEventListener("mousedown", handleMouseDown);
      };
    }, [onMouseDown]);
    return /* @__PURE__ */ u$1(
      "div",
      {
        ref: handleRef,
        class: `resize-handle ${isDragging ? "resize-handle--dragging" : ""}`,
        title: "拖拽调整面板宽度",
        children: [
          /* @__PURE__ */ u$1("div", { class: "resize-handle-line" }),
          /* @__PURE__ */ u$1("div", { class: "resize-handle-grip", children: [
            /* @__PURE__ */ u$1("div", { class: "resize-handle-dot" }),
            /* @__PURE__ */ u$1("div", { class: "resize-handle-dot" }),
            /* @__PURE__ */ u$1("div", { class: "resize-handle-dot" }),
            /* @__PURE__ */ u$1("div", { class: "resize-handle-dot" }),
            /* @__PURE__ */ u$1("div", { class: "resize-handle-dot" }),
            /* @__PURE__ */ u$1("div", { class: "resize-handle-dot" })
          ] })
        ]
      }
    );
  }
  const ALL_SCRIPT_CONFIGS = [
    // 工具脚本
    {
      id: "bv2av",
      name: "BV/AV号转换",
      description: "将B站的BV号转换为AV号，或反之",
      category: "tool",
      isRunning: false,
      parameters: [
        {
          key: "videoId",
          label: "视频ID",
          type: "text",
          defaultValue: "",
          required: true,
          placeholder: "输入BV号或AV号，如：BV1L9Uoa9EUx 或 av111298867365120",
          description: "支持BV号和AV号格式"
        }
      ]
    },
    {
      id: "show_resource_info",
      name: "获取视频信息",
      description: "获取B站视频的详细信息",
      category: "tool",
      isRunning: false,
      parameters: [
        {
          key: "videoIds",
          label: "视频ID列表",
          type: "textarea",
          defaultValue: "",
          required: true,
          placeholder: "每行一个视频ID，支持BV号或AV号",
          description: "批量获取多个视频的信息"
        }
      ]
    },
    // 操作脚本
    {
      id: "move_favorite_to_toview",
      name: "移动收藏夹视频到稍后再看",
      description: "从收藏夹中按指定规则选择视频添加到稍后再看",
      category: "operation",
      isRunning: false,
      parameters: [
        {
          key: "favoriteId",
          label: "收藏夹ID",
          type: "number",
          defaultValue: "",
          required: true,
          description: "要操作的收藏夹ID"
        },
        {
          key: "sortOrder",
          label: "排序规则",
          type: "select",
          defaultValue: "original",
          required: false,
          description: "选择视频的排序方式，影响添加到稍后再看的顺序，不影响视频在收藏夹中的顺序",
          options: [
            { value: "original", label: "收藏夹原始顺序" },
            { value: "shortest", label: "按时长从短到长排序" },
            { value: "longest", label: "按时长从长到短排序" },
            { value: "play_asc", label: "按播放数从少到多排序" },
            { value: "play_desc", label: "按播放数从多到少排序" }
          ]
        },
        {
          key: "shuffleVideos",
          label: "启用有偏向随机选择",
          type: "boolean",
          defaultValue: false,
          required: false,
          description: "在排序基础上增加随机性，排序靠前的视频有更高被选中概率，兼顾排序偏好和观看多样性"
        },
        {
          key: "upTo",
          label: "稍后再看目标数量",
          type: "number",
          defaultValue: 100,
          required: true,
          description: "稍后再看补全到多少个资源(上限1000)"
        },
        {
          key: "durationThreshold",
          label: "时长阈值(秒)",
          type: "number",
          defaultValue: 1800,
          required: false,
          description: "超过这个时长的视频不添加，0表示不限制"
        },
        {
          key: "ignoreFrontPage",
          label: "忽略前几页",
          type: "number",
          defaultValue: 6,
          required: false,
          description: "忽略收藏夹前几页的内容"
        },
        {
          key: "ignoreTitleKeywords",
          label: "忽略标题关键词",
          type: "text",
          defaultValue: "asmr,助眠,音声,触发音",
          required: false,
          description: "忽略标题中包含这些关键词的视频，用逗号分隔"
        }
      ]
    },
    {
      id: "add_toview_to_favorite",
      name: "稍后再看添加到收藏夹",
      description: "把稍后再看的视频添加到指定收藏夹",
      category: "operation",
      isRunning: false,
      parameters: [
        {
          key: "favoriteId",
          label: "目标收藏夹ID",
          type: "number",
          defaultValue: "",
          required: true,
          description: "要添加到的收藏夹ID"
        },
        {
          key: "maxCount",
          label: "最大添加数量",
          type: "number",
          defaultValue: 0,
          required: false,
          description: "最多添加多少个视频，0表示全部添加"
        },
        {
          key: "disableSpaceCheck",
          label: "关闭收藏夹剩余空间检查",
          type: "boolean",
          defaultValue: false,
          required: false,
          description: "启用后将跳过收藏夹容量检查，适用于添加重复视频的场景（重复视频不占用额外空间）"
        }
      ]
    },
    {
      id: "move_favorite_to_another",
      name: "移动收藏夹视频",
      description: "将一个收藏夹的视频移动到另一个收藏夹",
      category: "operation",
      isRunning: false,
      parameters: [
        {
          key: "fromFavorite",
          label: "源收藏夹ID",
          type: "number",
          defaultValue: "",
          required: true,
          description: "被移动的收藏夹ID"
        },
        {
          key: "toFavorite",
          label: "目标收藏夹ID",
          type: "number",
          defaultValue: "",
          required: true,
          description: "移动到的收藏夹ID"
        },
        {
          key: "upTo",
          label: "目标收藏夹上限",
          type: "number",
          defaultValue: 1e3,
          required: true,
          description: "目标收藏夹的视频数上限"
        },
        {
          key: "onlyWithKeywords",
          label: "仅移动包含关键词的视频",
          type: "text",
          defaultValue: "",
          required: false,
          placeholder: "用逗号分隔多个关键词",
          description: "只移动标题中包含这些关键词的视频，空表示不过滤"
        }
      ]
    },
    {
      id: "delete_timeout_lottery",
      name: "删除过期抽奖动态",
      description: "删除已过期的抽奖动态（仅限官方抽奖工具）",
      category: "operation",
      isRunning: false,
      parameters: [
        {
          key: "detectOnly",
          label: "仅检测不删除",
          type: "boolean",
          defaultValue: false,
          required: false,
          description: "开启后只检测过期动态，不执行删除操作"
        },
        {
          key: "notDeleteWinning",
          label: "不删除中奖动态",
          type: "boolean",
          defaultValue: true,
          required: false,
          description: "不删除已中奖的抽奖动态"
        },
        {
          key: "userId",
          label: "用户ID",
          type: "number",
          defaultValue: "",
          required: false,
          description: "指定用户ID，不填则为当前登录用户。 填其他人可以扫描其他人的动态，但无法删除。"
        }
      ]
    },
    {
      id: "clear_toview",
      name: "清空稍后再看",
      description: "由于新版「稍后再看」移除了清空按钮，特出该脚本以删除所有「稍后再看」的视频。",
      category: "operation",
      isRunning: false,
      parameters: [
        {
          key: "confirm",
          label: "确认清空",
          type: "boolean",
          defaultValue: false,
          required: true,
          description: "确认要清空稍后再看列表（此操作不可恢复）"
        }
      ]
    }
  ];
  const SCRIPT_CONFIGS = ALL_SCRIPT_CONFIGS.filter((script) => !script.disabled);
  function containsAnyKeyword(text, keywords, caseSensitive = false) {
    if (keywords.length === 0) return false;
    const searchText = caseSensitive ? text : text.toLowerCase();
    return keywords.some((keyword) => {
      const searchKeyword = caseSensitive ? keyword : keyword.toLowerCase();
      return searchText.includes(searchKeyword);
    });
  }
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
  class ScriptExecutor {
    constructor(scriptId, onLog, onProgress) {
      __publicField(this, "execution");
      __publicField(this, "onLog");
      __publicField(this, "onProgress");
      __publicField(this, "shouldStop", false);
      // 进度管理相关属性
      __publicField(this, "currentStep", 0);
      __publicField(this, "totalSteps", 0);
      __publicField(this, "autoProgressEnabled", false);
      this.execution = {
        id: generateId(),
        scriptId,
        status: "running",
        startTime: /* @__PURE__ */ new Date(),
        progress: 0,
        logs: []
      };
      this.onLog = onLog;
      this.onProgress = onProgress;
    }
    /**
     * 记录日志
     */
    log(level, message) {
      const logEntry = {
        id: generateId(),
        timestamp: /* @__PURE__ */ new Date(),
        level,
        message,
        scriptId: this.execution.scriptId
      };
      this.execution.logs.push(logEntry);
      this.onLog(logEntry);
    }
    /**
     * 设置总步骤数，启用基于步骤的进度管理
     */
    setTotalSteps(total) {
      this.totalSteps = total;
      this.currentStep = 0;
      this.autoProgressEnabled = true;
    }
    /**
     * 更新进度
     * @param progressOrCurrentStep 进度百分比(0-100) 或当前步骤数
     * @param totalSteps 总步骤数（可选，如果提供则使用基于步骤的进度计算）
     */
    updateProgress(progressOrCurrentStep, totalSteps) {
      let progress;
      if (progressOrCurrentStep === void 0) {
        if (this.autoProgressEnabled && this.totalSteps > 0) {
          this.currentStep = Math.min(this.currentStep + 1, this.totalSteps);
          progress = Math.floor(this.currentStep / this.totalSteps * 100);
        } else {
          progress = Math.min(this.execution.progress + 5, 95);
        }
      } else if (totalSteps !== void 0) {
        this.currentStep = progressOrCurrentStep;
        this.totalSteps = totalSteps;
        this.autoProgressEnabled = true;
        progress = Math.floor(this.currentStep / this.totalSteps * 100);
      } else {
        progress = progressOrCurrentStep;
        if (progress >= 0 && progress <= 100) {
          this.autoProgressEnabled = false;
        }
      }
      this.execution.progress = Math.max(0, Math.min(100, progress));
      this.onProgress(this.execution.progress);
    }
    /**
     * 检查是否应该停止执行
     */
    checkShouldStop() {
      if (this.shouldStop) {
        throw new Error("Script execution was stopped by user");
      }
    }
    /**
     * 停止脚本执行
     */
    stop() {
      this.shouldStop = true;
      this.log("warn", "用户请求停止脚本执行");
    }
    /**
     * 运行脚本的完整流程
     */
    async run(parameters) {
      try {
        this.log("debug", "开始执行脚本");
        this.updateProgress(0);
        const result = await this.execute(parameters);
        this.execution.status = "completed";
        this.execution.endTime = /* @__PURE__ */ new Date();
        this.execution.result = result;
        if (this.execution.progress < 100) {
          this.updateProgress(100);
        }
        this.log("debug", "脚本执行完成");
      } catch (error) {
        this.execution.status = this.shouldStop ? "stopped" : "failed";
        this.execution.endTime = /* @__PURE__ */ new Date();
        this.execution.error = error instanceof Error ? error.message : String(error);
        if (this.shouldStop) {
          this.log("warn", "脚本执行已停止");
        } else {
          this.log("error", `脚本执行失败: ${this.execution.error}`);
        }
      }
      return this.execution;
    }
    /**
     * 获取执行状态
     */
    getExecution() {
      return { ...this.execution };
    }
  }
  class TokenBucket {
    constructor(capacity, rate) {
      __publicField(this, "capacity");
      __publicField(this, "tokens");
      __publicField(this, "rate");
      __publicField(this, "lastRefillTime");
      this.capacity = capacity;
      this.tokens = capacity;
      this.rate = rate;
      this.lastRefillTime = Date.now();
    }
    /**
     * 填充令牌
     */
    refill() {
      const now = Date.now();
      const timePassed = (now - this.lastRefillTime) / 1e3;
      const newTokens = timePassed * this.rate;
      this.tokens = Math.min(this.capacity, this.tokens + newTokens);
      this.lastRefillTime = now;
    }
    /**
     * 消费令牌
     * @param tokens 需要消费的令牌数量
     * @returns 是否成功消费
     */
    consume(tokens = 1) {
      this.refill();
      if (this.tokens >= tokens) {
        this.tokens -= tokens;
        return true;
      }
      return false;
    }
    /**
     * 等待直到可以消费指定数量的令牌
     * @param tokens 需要消费的令牌数量
     * @returns Promise，在可以消费时resolve
     */
    async waitForTokens(tokens = 1) {
      return new Promise((resolve) => {
        const checkTokens = () => {
          if (this.consume(tokens)) {
            resolve();
          } else {
            setTimeout(checkTokens, 100);
          }
        };
        checkTokens();
      });
    }
    /**
     * 获取当前令牌数量
     */
    getTokens() {
      this.refill();
      return this.tokens;
    }
  }
  class BiliApiClient {
    constructor(capacity = 10, rate = 0.7) {
      __publicField(this, "tokenBucket");
      __publicField(this, "baseHeaders");
      this.tokenBucket = new TokenBucket(capacity, rate);
      this.baseHeaders = {
        "Referer": "https://www.bilibili.com",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8"
      };
    }
    /**
     * 发送GET请求
     */
    async get(url, params) {
      await this.tokenBucket.waitForTokens();
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== void 0 && value !== null) {
            searchParams.append(key, String(value));
          }
        });
      }
      const fullUrl = searchParams.toString() ? `${url}?${searchParams}` : url;
      return new Promise((resolve, reject) => {
        _GM_xmlhttpRequest({
          method: "GET",
          url: fullUrl,
          headers: this.baseHeaders,
          onload: (response) => {
            try {
              const data2 = JSON.parse(response.responseText);
              resolve(data2);
            } catch (error) {
              reject(new Error(`Failed to parse response: ${error}`));
            }
          },
          onerror: (error) => {
            reject(new Error(`Request failed: ${error}`));
          },
          ontimeout: () => {
            reject(new Error("Request timeout"));
          },
          timeout: 1e4
        });
      });
    }
    /**
     * 发送POST请求
     */
    async post(url, data2, params) {
      await this.tokenBucket.waitForTokens();
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== void 0 && value !== null) {
            searchParams.append(key, String(value));
          }
        });
      }
      const fullUrl = searchParams.toString() ? `${url}?${searchParams}` : url;
      const formData = new URLSearchParams();
      if (data2) {
        Object.entries(data2).forEach(([key, value]) => {
          if (value !== void 0 && value !== null) {
            formData.append(key, String(value));
          }
        });
      }
      return new Promise((resolve, reject) => {
        _GM_xmlhttpRequest({
          method: "POST",
          url: fullUrl,
          headers: {
            ...this.baseHeaders,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: formData.toString(),
          onload: (response) => {
            try {
              const responseData = JSON.parse(response.responseText);
              resolve(responseData);
            } catch (error) {
              reject(new Error(`Failed to parse response: ${error}`));
            }
          },
          onerror: (error) => {
            reject(new Error(`Request failed: ${error}`));
          },
          ontimeout: () => {
            reject(new Error("Request timeout"));
          },
          timeout: 1e4
        });
      });
    }
    /**
     * 获取当前令牌数量（用于调试）
     */
    getTokenCount() {
      return this.tokenBucket.getTokens();
    }
  }
  const biliApiClient = new BiliApiClient();
  function getCsrfToken() {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "bili_jct") {
        return value;
      }
    }
    throw new Error("CSRF token not found. Please make sure you are logged in.");
  }
  function getUserId() {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "DedeUserID") {
        return value;
      }
    }
    throw new Error("User ID not found. Please make sure you are logged in.");
  }
  async function getToViewList() {
    const response = await biliApiClient.get("https://api.bilibili.com/x/v2/history/toview");
    if (response.code !== 0) {
      throw new Error(`Failed to get toview list: ${response.message}`);
    }
    return response.data;
  }
  async function getFavoriteInfo(favoriteId) {
    const response = await biliApiClient.get(
      "https://api.bilibili.com/x/v3/fav/folder/info",
      { media_id: favoriteId }
    );
    if (response.code !== 0) {
      throw new Error(`Failed to get favorite info: ${response.message}`);
    }
    return response.data;
  }
  async function getFavoriteResourceList(favoriteId, pageIndex = 1, pageSize = 20) {
    const response = await biliApiClient.get(
      "https://api.bilibili.com/x/v3/fav/resource/list",
      {
        media_id: favoriteId,
        pn: pageIndex,
        ps: pageSize,
        keyword: "",
        order: "mtime",
        type: 0,
        tid: 0,
        platform: "web"
      }
    );
    if (response.code !== 0) {
      throw new Error(`Failed to get favorite resource list: ${response.message}`);
    }
    return response.data;
  }
  async function addToToView(videoId) {
    const response = await biliApiClient.post(
      "https://api.bilibili.com/x/v2/history/toview/add",
      { aid: videoId, csrf: getCsrfToken() }
    );
    if (response.code !== 0) {
      throw new Error(`Failed to add to toview: ${response.message}`);
    }
  }
  async function clearToViewList() {
    const response = await biliApiClient.post(
      "https://api.bilibili.com/x/v2/history/toview/clear",
      { csrf: getCsrfToken() }
    );
    if (response.code !== 0) {
      throw new Error(`Failed to clear toview list: ${response.message}`);
    }
  }
  async function deleteFromFavorite(favoriteId, resourceIds) {
    const resources = resourceIds.map((r2) => `${r2.id}:${r2.type}`).join(",");
    const response = await biliApiClient.post(
      "https://api.bilibili.com/x/v3/fav/resource/batch-del",
      {
        media_id: favoriteId,
        resources,
        csrf: getCsrfToken()
      }
    );
    if (response.code !== 0) {
      throw new Error(`Failed to delete from favorite: ${response.message}`);
    }
  }
  async function addOrDeleteToFavorite(resourceId, resourceType, addFavoriteIds = [], delFavoriteIds = []) {
    const response = await biliApiClient.post(
      "https://api.bilibili.com/x/v3/fav/resource/deal",
      {
        rid: resourceId,
        type: resourceType,
        add_media_ids: addFavoriteIds.join(","),
        del_media_ids: delFavoriteIds.join(","),
        csrf: getCsrfToken()
      }
    );
    if (response.code !== 0) {
      throw new Error(`Failed to add or delete to favorite: ${response.message}`);
    }
  }
  async function moveToFavorite(fromFavoriteId, toFavoriteId, resourceIds) {
    const resources = resourceIds.map((r2) => `${r2.id}:${r2.type}`).join(",");
    const response = await biliApiClient.post(
      "https://api.bilibili.com/x/v3/fav/resource/move",
      {
        src_media_id: fromFavoriteId.toString(),
        tar_media_id: toFavoriteId.toString(),
        resources,
        csrf: getCsrfToken()
      }
    );
    if (response.code !== 0) {
      throw new Error(`Failed to move to favorite: ${response.message}`);
    }
  }
  async function getDynamicList(uid, offset = "") {
    const response = await biliApiClient.get(
      "https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space",
      {
        offset,
        host_mid: uid || getUserId(),
        timezone_offset: -480
      }
    );
    if (response.code !== 0) {
      throw new Error(`Failed to get dynamic list: ${response.message}`);
    }
    return response.data;
  }
  async function deleteDynamic(dynamicId) {
    const response = await biliApiClient.post(
      "https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/rm_dynamic",
      { dynamic_id: dynamicId },
      void 0
    );
    if (response.code !== 0) {
      throw new Error(`Failed to delete dynamic: ${response.message}`);
    }
  }
  async function getLotteryInfo(dynamicId) {
    const response = await biliApiClient.get(
      "https://api.vc.bilibili.com/lottery_svr/v1/lottery_svr/lottery_notice",
      {
        business_id: dynamicId,
        business_type: "1",
        csrf: getCsrfToken(),
        web_location: "333.1330"
      }
    );
    if (response.code !== 0) {
      throw new Error(`Failed to get lottery info: ${response.message}`);
    }
    return response.data;
  }
  async function getVideoInfo(videoId) {
    videoId = videoId.trim();
    const url = `https://api.bilibili.com/x/web-interface/view`;
    const response = await biliApiClient.get(url, {
      bvid: videoId.toLocaleUpperCase().startsWith("BV") ? videoId : void 0,
      aid: videoId.toLocaleUpperCase().startsWith("AV") ? parseInt(videoId.slice(2)) : void 0
    });
    if (response.code !== 0) {
      throw new Error(`Failed to get video info: ${response.message}`);
    }
    return response.data;
  }
  async function getFavoriteList(uid) {
    const response = await biliApiClient.get(
      "https://api.bilibili.com/x/v3/fav/folder/created/list-all",
      { up_mid: getUserId() }
    );
    if (response.code !== 0) {
      throw new Error(`Failed to get favorite list: ${response.message}`);
    }
    return response.data;
  }
  const XOR_CODE = 23442827791579n;
  const MASK_CODE = 2251799813685247n;
  const MAX_AID = 1n << 51n;
  const BASE = 58n;
  const data = "FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf";
  function av2bv(aid) {
    const bytes = ["B", "V", "1", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
    let bvIndex = bytes.length - 1;
    let tmp = (MAX_AID | BigInt(aid)) ^ XOR_CODE;
    while (tmp > 0) {
      bytes[bvIndex] = data[Number(tmp % BigInt(BASE))];
      tmp = tmp / BASE;
      bvIndex -= 1;
    }
    [bytes[3], bytes[9]] = [bytes[9], bytes[3]];
    [bytes[4], bytes[7]] = [bytes[7], bytes[4]];
    return bytes.join("");
  }
  function bv2av(bvid) {
    const bvidArr = Array.from(bvid);
    [bvidArr[3], bvidArr[9]] = [bvidArr[9], bvidArr[3]];
    [bvidArr[4], bvidArr[7]] = [bvidArr[7], bvidArr[4]];
    bvidArr.splice(0, 3);
    const tmp = bvidArr.reduce((pre, bvidChar) => pre * BASE + BigInt(data.indexOf(bvidChar)), 0n);
    return Number(tmp & MASK_CODE ^ XOR_CODE);
  }
  function isValidAid(aid) {
    return typeof aid === "number" && Number.isInteger(aid) && aid > 0 && BigInt(aid) < MAX_AID;
  }
  class BvAvConverterExecutor extends ScriptExecutor {
    async execute(parameters) {
      const { videoId } = parameters;
      if (!videoId) {
        throw new Error("请输入视频ID");
      }
      this.log("info", `开始转换视频ID: ${videoId}`);
      this.log("debug", `输入参数: ${JSON.stringify(parameters)}`);
      this.updateProgress(10);
      try {
        let result;
        if (videoId.startsWith("BV")) {
          this.log("debug", `检测到BV号格式，准备转换为AV号`);
          const aid = bv2av(videoId);
          this.log("debug", `转换结果: BV号 ${videoId} → AV号 ${aid}`);
          this.updateProgress(50);
          result = {
            input: videoId,
            output: `av${aid}`,
            type: "BV → AV"
          };
          this.log("success", `转换成功: ${videoId} → av${aid}`);
        } else if (videoId.startsWith("av")) {
          const aid = parseInt(videoId.slice(2));
          if (!isValidAid(aid)) {
            throw new Error("无效的AV号格式");
          }
          const bvid = av2bv(aid);
          result = {
            input: videoId,
            output: bvid,
            type: "AV → BV"
          };
          this.log("success", `转换成功: ${videoId} → ${bvid}`);
        } else {
          const aid = parseInt(videoId);
          if (isValidAid(aid)) {
            const bvid = av2bv(aid);
            result = {
              input: `av${aid}`,
              output: bvid,
              type: "AV → BV"
            };
            this.log("success", `转换成功: av${aid} → ${bvid}`);
          } else {
            throw new Error("无法识别的视频ID格式，请输入BV号或AV号");
          }
        }
        this.updateProgress(100);
        return result;
      } catch (error) {
        this.log("error", `转换失败: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
      }
    }
  }
  class VideoInfoExecutor extends ScriptExecutor {
    async execute(parameters) {
      const { videoIds } = parameters;
      if (!videoIds) {
        throw new Error("请输入视频ID列表");
      }
      const idList = videoIds.split("\n").filter((id) => id.trim()).map((id) => id.trim());
      if (idList.length === 0) {
        throw new Error("请输入至少一个视频ID");
      }
      this.log("info", `开始获取 ${idList.length} 个视频的信息`);
      this.setTotalSteps(idList.length);
      const results = [];
      const total = idList.length;
      for (let i2 = 0; i2 < total; i2++) {
        this.checkShouldStop();
        const videoId = idList[i2];
        this.log("info", `正在处理: ${videoId} (${i2 + 1}/${total})`);
        try {
          const info = await getVideoInfo(videoId);
          results.push({
            id: videoId,
            title: info.title,
            duration: info.duration || 0,
            bvid: info.bvid,
            aid: info.aid,
            type: info.type
          });
          this.log("success", `获取成功: ${videoId} - ${info.title}`);
        } catch (error) {
          this.log("error", `获取失败: ${videoId} - ${error instanceof Error ? error.message : String(error)}`);
          results.push({
            id: videoId,
            error: error instanceof Error ? error.message : String(error)
          });
        }
        this.updateProgress(i2 + 1, total);
      }
      const successCount = results.filter((r2) => !r2.error).length;
      const failCount = results.filter((r2) => r2.error).length;
      this.log("success", `视频信息获取任务完成！成功获取 ${successCount} 个视频信息，失败 ${failCount} 个`);
      if (successCount > 0) {
        this.log("info", `成功获取的视频：${results.filter((r2) => !r2.error).map((r2) => r2.title).join(", ")}`);
      }
      return { results, total: results.length, successCount, failCount };
    }
  }
  class MoveFavoriteToToviewExecutor extends ScriptExecutor {
    /**
     * 计算基于位置的线性递减权重
     * @param totalCount 视频总数
     * @param position 视频在排序后列表中的位置（从0开始）
     * @returns 权重值
     */
    calculatePositionWeight(totalCount, position) {
      return Math.max(1, totalCount - position);
    }
    /**
     * 使用轮盘赌算法进行加权随机选择
     * @param videos 已排序的视频列表
     * @param targetCount 目标选择数量
     * @returns 加权随机选择后的视频列表
     */
    performWeightedRandomSelection(videos, targetCount) {
      if (videos.length === 0 || targetCount <= 0) {
        return [];
      }
      const totalCount = videos.length;
      const actualTargetCount = Math.min(targetCount, totalCount);
      const selected = [];
      const availableVideos = [...videos];
      this.log("debug", `开始有偏向随机选择，目标数量: ${actualTargetCount}`);
      const weights = availableVideos.map((_, index) => this.calculatePositionWeight(totalCount, index));
      const maxWeight = Math.max(...weights);
      const minWeight = Math.min(...weights);
      const avgWeight = weights.reduce((sum, w2) => sum + w2, 0) / weights.length;
      this.log("debug", `权重分布: 最高${maxWeight}, 最低${minWeight}, 平均${avgWeight.toFixed(1)}`);
      for (let i2 = 0; i2 < actualTargetCount && availableVideos.length > 0; i2++) {
        const currentWeights = availableVideos.map(
          (_, index) => this.calculatePositionWeight(availableVideos.length, index)
        );
        const selectedIndex = this.rouletteWheelSelection(currentWeights);
        selected.push(availableVideos[selectedIndex]);
        availableVideos.splice(selectedIndex, 1);
      }
      this.logSelectionDistribution(videos, selected, totalCount);
      return selected;
    }
    /**
     * 轮盘赌选择算法
     * @param weights 权重数组
     * @returns 选中的索引
     */
    rouletteWheelSelection(weights) {
      const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
      const randomValue = Math.random() * totalWeight;
      let cumulativeWeight = 0;
      for (let i2 = 0; i2 < weights.length; i2++) {
        cumulativeWeight += weights[i2];
        if (randomValue <= cumulativeWeight) {
          return i2;
        }
      }
      return weights.length - 1;
    }
    /**
     * 记录选择结果的分布统计
     * @param originalVideos 原始排序后的视频列表
     * @param selectedVideos 选择后的视频列表
     * @param totalCount 原始视频总数
     */
    logSelectionDistribution(originalVideos, selectedVideos, totalCount) {
      const positions = selectedVideos.map(
        (selected) => originalVideos.findIndex((original) => original.id === selected.id)
      );
      const topTier = Math.ceil(totalCount * 0.2);
      const middleTier = Math.ceil(totalCount * 0.8);
      const topTierCount = positions.filter((pos) => pos < topTier).length;
      const middleTierCount = positions.filter((pos) => pos >= topTier && pos < middleTier).length;
      const bottomTierCount = positions.filter((pos) => pos >= middleTier).length;
      this.log("debug", `有偏向随机选择完成，实际选择分布:`);
      this.log("debug", `前20%区间选中: ${topTierCount}个 (${(topTierCount / selectedVideos.length * 100).toFixed(1)}%)`);
      this.log("debug", `中间60%区间选中: ${middleTierCount}个 (${(middleTierCount / selectedVideos.length * 100).toFixed(1)}%)`);
      this.log("debug", `后20%区间选中: ${bottomTierCount}个 (${(bottomTierCount / selectedVideos.length * 100).toFixed(1)}%)`);
      const topSelectedPositions = positions.slice(0, Math.min(5, positions.length)).sort((a2, b) => a2 - b);
      this.log("debug", `前5个选中视频的原始排序位置: [${topSelectedPositions.map((p2) => p2 + 1).join(", ")}]`);
    }
    async execute(parameters) {
      var _a, _b, _c, _d;
      const { favoriteId, sortOrder, shuffleVideos, upTo, durationThreshold, ignoreFrontPage, ignoreTitleKeywords } = parameters;
      if (!favoriteId) {
        throw new Error("请输入收藏夹ID");
      }
      this.log("info", `开始从收藏夹 ${favoriteId} 移动视频到稍后再看`);
      this.updateProgress(10);
      const ignoreTitleKeywordList = ignoreTitleKeywords ? ignoreTitleKeywords.split(",").map((k2) => k2.trim()) : [];
      const maxCount = upTo || 1e3;
      let needCount = maxCount;
      const maxDuration = durationThreshold || 0;
      const ignorePageCount = ignoreFrontPage ?? 0;
      let originVideoInfos = [];
      let willMoveVideoInfos = [];
      try {
        this.log("info", `正在获取稍后再看当前数量...`);
        this.checkShouldStop();
        const toviewList = await getToViewList();
        const currentCount = toviewList.count;
        needCount = maxCount - currentCount;
        let log2 = `稍后再看当前视频数量: ${currentCount}/1000`;
        log2 += `
还需要添加: ${needCount}`;
        if (needCount <= 0) {
          log2 += `
稍后再看已达到目标数量，无需添加更多视频`;
          this.log("info", log2);
          return { added: 0, currentCount, needCount };
        }
        this.log("info", log2);
        this.updateProgress(40);
      } catch (error) {
        this.log("error", `获取稍后再看数量失败: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
      }
      try {
        this.log("info", `正在获取源收藏夹所有视频...`);
        let pageIndex = 1;
        const pageSize = 20;
        while (true) {
          this.checkShouldStop();
          if (pageIndex <= ignorePageCount) {
            this.log("debug", `忽略第 ${pageIndex} 页视频...`);
            pageIndex++;
            continue;
          }
          const pageInfo = await getFavoriteResourceList(favoriteId, pageIndex, pageSize);
          originVideoInfos.push(...pageInfo.medias);
          const pageProgress = Math.min(70, (pageIndex - 1) * 5);
          this.updateProgress(20 + pageProgress);
          this.log("debug", `已获取 ${originVideoInfos.length} 个视频`);
          if (!pageInfo.has_more) break;
          pageIndex++;
        }
      } catch (error) {
        this.log("error", `获取源收藏夹视频失败: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
      }
      const sortOrderValue = sortOrder || "original";
      const shuffleEnabled = shuffleVideos === true;
      this.log("debug", `正在按 ${sortOrderValue} 规则排序视频`);
      switch (sortOrderValue) {
        case "shortest":
          originVideoInfos = originVideoInfos.sort((a2, b) => a2.duration - b.duration);
          let log2 = `已按时长从短到长排序`;
          if (originVideoInfos.length > 0) {
            log2 += `最短视频: ${originVideoInfos[0].title} (${originVideoInfos[0].duration}秒)`;
            log2 += `
最长视频: ${originVideoInfos[originVideoInfos.length - 1].title} (${originVideoInfos[originVideoInfos.length - 1].duration}秒)`;
          }
          this.log("debug", log2);
          break;
        case "longest":
          originVideoInfos = originVideoInfos.sort((a2, b) => b.duration - a2.duration);
          log2 = `已按时长从长到短排序`;
          if (originVideoInfos.length > 0) {
            log2 += `
最长视频: ${originVideoInfos[0].title} (${originVideoInfos[0].duration}秒)`;
            log2 += `
最短视频: ${originVideoInfos[originVideoInfos.length - 1].title} (${originVideoInfos[originVideoInfos.length - 1].duration}秒)`;
          }
          this.log("debug", log2);
          break;
        case "play_asc":
          originVideoInfos = originVideoInfos.sort((a2, b) => {
            var _a2, _b2;
            return (((_a2 = a2.cnt_info) == null ? void 0 : _a2.play) || 0) - (((_b2 = b.cnt_info) == null ? void 0 : _b2.play) || 0);
          });
          log2 = `已按播放数从少到多排序`;
          if (originVideoInfos.length > 0) {
            log2 += `
播放数最少视频: ${originVideoInfos[0].title} (${((_a = originVideoInfos[0].cnt_info) == null ? void 0 : _a.play) || 0}次播放)`;
            log2 += `
播放数最多视频: ${originVideoInfos[originVideoInfos.length - 1].title} (${((_b = originVideoInfos[originVideoInfos.length - 1].cnt_info) == null ? void 0 : _b.play) || 0}次播放)`;
          }
          this.log("debug", log2);
          break;
        case "play_desc":
          originVideoInfos = originVideoInfos.sort((a2, b) => {
            var _a2, _b2;
            return (((_a2 = b.cnt_info) == null ? void 0 : _a2.play) || 0) - (((_b2 = a2.cnt_info) == null ? void 0 : _b2.play) || 0);
          });
          log2 = `已按播放数从多到少排序`;
          if (originVideoInfos.length > 0) {
            log2 += `
播放数最多视频: ${originVideoInfos[0].title} (${((_c = originVideoInfos[0].cnt_info) == null ? void 0 : _c.play) || 0}次播放)`;
            log2 += `
播放数最少视频: ${originVideoInfos[originVideoInfos.length - 1].title} (${((_d = originVideoInfos[originVideoInfos.length - 1].cnt_info) == null ? void 0 : _d.play) || 0}次播放)`;
          }
          this.log("debug", log2);
          break;
        case "original":
        default:
          originVideoInfos = originVideoInfos.reverse();
          break;
      }
      const filteredVideoInfos = [];
      for (const video of originVideoInfos) {
        if (ignoreTitleKeywordList.length > 0 && containsAnyKeyword(video.title, ignoreTitleKeywordList)) {
          continue;
        }
        if (maxDuration > 0 && video.duration > maxDuration) {
          continue;
        }
        filteredVideoInfos.push(video);
      }
      this.log("debug", `视频过滤完成，共 ${filteredVideoInfos.length} 个视频符合条件`);
      if (shuffleEnabled && filteredVideoInfos.length > 0) {
        this.log("info", "已启用有偏向随机选择，将基于排序结果进行加权随机选择");
        willMoveVideoInfos = this.performWeightedRandomSelection(filteredVideoInfos, needCount);
      } else {
        willMoveVideoInfos = filteredVideoInfos.slice(0, needCount);
      }
      let log = `排序、过滤和选择完成，共 ${willMoveVideoInfos.length} 个视频将被添加`;
      log += `
排序规则: ${sortOrderValue}`;
      log += `
有偏向随机选择: ${shuffleEnabled ? "已启用" : "未启用"}`;
      if (shuffleEnabled) {
        log += `
选择方式: 基于排序位置的加权随机选择`;
      } else {
        log += `
选择方式: 按排序顺序依次选择`;
      }
      log += `
将要移动的视频列表: ${willMoveVideoInfos.map((v2) => v2.title).join(", ")}`;
      this.log("debug", log);
      this.updateProgress(30);
      this.log("info", `正在添加视频到稍后再看...`);
      for (let i2 = 0; i2 < willMoveVideoInfos.length; i2++) {
        this.checkShouldStop();
        const video = willMoveVideoInfos[i2];
        this.log("debug", `正在添加: ${video.title} (${i2 + 1}/${willMoveVideoInfos.length})`);
        try {
          await addToToView(video.id);
          this.log("success", `添加成功: ${video.title}`);
        } catch (error) {
          this.log("error", `添加失败: ${video.title} - ${error instanceof Error ? error.message : String(error)}`);
        }
        this.updateProgress(30 + Math.floor((i2 + 1) / willMoveVideoInfos.length * 60));
      }
      this.log("success", `共添加 ${willMoveVideoInfos.length} 个视频到稍后再看`);
      this.log("info", `正在从收藏夹中删除已移动的视频...`);
      try {
        await deleteFromFavorite(
          favoriteId,
          willMoveVideoInfos.map((v2) => ({ id: v2.id, type: v2.type }))
        );
        this.log("success", `删除成功`);
        this.updateProgress(100);
      } catch (error) {
        this.log("error", `删除失败: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
      }
      this.log("success", `共删除 ${willMoveVideoInfos.length} 个视频从收藏夹`);
    }
  }
  class AddToviewToFavoriteExecutor extends ScriptExecutor {
    async execute(parameters) {
      const { favoriteId, maxCount, disableSpaceCheck } = parameters;
      if (!favoriteId) {
        throw new Error("请输入收藏夹ID");
      }
      this.log("info", `开始将稍后再看的视频添加到收藏夹 ${favoriteId}`);
      this.updateProgress(5);
      try {
        const toviewList = await getToViewList();
        if (!toviewList.list || toviewList.list.length === 0) {
          this.log("info", "稍后再看列表为空");
          return { added: 0, total: 0 };
        }
        const maxAdd = maxCount || toviewList.list.length;
        const videosToAdd = toviewList.list.slice(0, maxAdd).reverse();
        this.log("info", `准备添加 ${videosToAdd.length} 个视频到收藏夹`);
        this.updateProgress(10);
        if (disableSpaceCheck) {
          this.log("info", "已关闭空间检查，将跳过容量验证");
        } else {
          this.log("debug", "正在检查收藏夹容量...");
          const favoriteInfo = await getFavoriteInfo(favoriteId);
          const currentCount = favoriteInfo.media_count;
          const toAddCount = videosToAdd.length;
          const remainingSpace = 1e3 - currentCount;
          let log = `收藏夹当前视频数量: ${currentCount}/1000`;
          log += `
待添加视频数量: ${toAddCount}`;
          log += `
剩余空间: ${remainingSpace}`;
          this.log("debug", log);
          if (currentCount + toAddCount > 1e3) {
            this.log("error", `收藏夹空间不足，无法添加所有视频。当前: ${currentCount}，待添加: ${toAddCount}，剩余空间: ${remainingSpace}`);
            throw new Error("收藏夹空间不足，无法添加所有视频");
          }
        }
        this.updateProgress(20);
        let addedCount = 0;
        const total = videosToAdd.length;
        this.log("debug", `开始逐个添加 ${total} 个视频到收藏夹`);
        this.setTotalSteps(total);
        for (let i2 = 0; i2 < total; i2++) {
          this.checkShouldStop();
          const video = videosToAdd[i2];
          let log = `正在添加: ${video.title} (${i2 + 1}/${total})`;
          this.log("debug", log);
          try {
            await addOrDeleteToFavorite(video.aid, 2, [favoriteId], []);
            addedCount++;
            log += `
添加成功: ${video.title}`;
            this.log("success", log);
          } catch (error) {
            log += `
添加失败: ${error instanceof Error ? error.message : String(error)}`;
            this.log("error", log);
            throw error;
          }
          this.updateProgress(20 + Math.floor((i2 + 1) / total * 70));
        }
        this.log("success", `操作完成，成功添加 ${addedCount}/${total} 个视频到收藏夹`);
        if (addedCount > 0) {
          this.log("info", `成功添加的视频：${videosToAdd.slice(0, addedCount).map((v2) => v2.title).join(", ")}`);
        }
        return {
          added: addedCount,
          total,
          videos: videosToAdd.slice(0, addedCount).map((v2) => ({ id: v2.id, title: v2.title }))
        };
      } catch (error) {
        this.log("error", `操作失败: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
      }
    }
  }
  class MoveFavoriteExecutor extends ScriptExecutor {
    async execute(parameters) {
      const { fromFavorite, toFavorite, upTo, onlyWithKeywords } = parameters;
      if (!fromFavorite || !toFavorite) {
        throw new Error("请输入源收藏夹ID和目标收藏夹ID");
      }
      this.log("info", `开始从收藏夹 ${fromFavorite} 移动视频到收藏夹 ${toFavorite}`);
      this.updateProgress(10);
      const keywords = onlyWithKeywords ? onlyWithKeywords.split(",").map((k2) => k2.trim()) : [];
      const maxCount = upTo || 1e3;
      const originVideoInfos = [];
      const willMoveVideoInfos = [];
      try {
        this.log("info", `正在获取源收藏夹所有视频...`);
        let pageIndex = 1;
        const pageSize = 20;
        while (true) {
          this.checkShouldStop();
          const pageInfo = await getFavoriteResourceList(fromFavorite, pageIndex, pageSize);
          originVideoInfos.push(...pageInfo.medias);
          const pageProgress = Math.min(30, (pageIndex - 1) * 3);
          this.updateProgress(20 + pageProgress);
          this.log("debug", `已获取 ${originVideoInfos.length} 个视频`);
          if (!pageInfo.has_more) break;
          pageIndex++;
        }
      } catch (error) {
        this.log("error", `获取源收藏夹视频失败: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
      }
      this.log("debug", `正在过滤视频...`);
      for (const video of originVideoInfos) {
        if (keywords.length > 0 && !containsAnyKeyword(video.title, keywords)) {
          continue;
        }
        willMoveVideoInfos.push(video);
        if (willMoveVideoInfos.length >= maxCount) break;
      }
      let log = `过滤完成，共 ${willMoveVideoInfos.length} 个视频符合条件`;
      log += `
将要移动的视频列表: ${willMoveVideoInfos.map((v2) => v2.title).join(", ")}`;
      this.log("debug", log);
      this.updateProgress(30);
      try {
        this.log("info", `正在获取目标收藏夹信息...`);
        this.checkShouldStop();
        const targetFavoriteInfo = await getFavoriteInfo(toFavorite);
        const currentCount = targetFavoriteInfo.media_count;
        const remainingSpace = 1e3 - currentCount;
        log = `目标收藏夹当前视频数量: ${currentCount}/1000`;
        log += `
剩余空间: ${remainingSpace}`;
        this.log("info", log);
        if (willMoveVideoInfos.length > remainingSpace) {
          this.log("error", `目标收藏夹空间不足，无法移动所有视频。当前: ${currentCount}，待添加: ${willMoveVideoInfos.length}，剩余空间: ${remainingSpace}`);
          throw new Error("目标收藏夹空间不足，无法移动所有视频");
        }
      } catch (error) {
        this.log("error", `获取目标收藏夹信息失败: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
      }
      this.updateProgress(40);
      this.log("info", `正在移动视频...`);
      try {
        this.checkShouldStop();
        await moveToFavorite(
          fromFavorite,
          toFavorite,
          willMoveVideoInfos.map((v2) => ({ id: v2.id, type: v2.type }))
        );
      } catch (error) {
        this.log("error", `视频移动失败: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
      }
      this.log("success", `操作完成，共移动 ${willMoveVideoInfos.length} 个视频`);
      return { moved: willMoveVideoInfos.length, maxCount };
    }
  }
  class DeleteTimeoutLotteryExecutor extends ScriptExecutor {
    async execute(parameters) {
      var _a, _b;
      const { detectOnly, notDeleteWinning, userId } = parameters;
      this.log("info", `开始${detectOnly ? "检测" : "删除"}过期抽奖动态`);
      let log = `执行参数: ${JSON.stringify(parameters)}。`;
      log += `
仅检测模式: ${detectOnly ? "是" : "否"}。`;
      log += `
保护中奖动态: ${notDeleteWinning ? "是" : "否"}。`;
      log += `
目标用户: ${userId || "当前登录用户"}。`;
      log += "\n========== 开始执行过期抽奖动态处理 ==========";
      this.log("debug", log);
      this.updateProgress(10);
      try {
        let deletedCount = 0;
        let detectedCount = 0;
        let listOffset = "";
        while (true) {
          this.checkShouldStop();
          this.log("info", "正在获取动态列表...");
          this.log("debug", `请求参数: userId=${userId || "当前用户"}, offset=${listOffset || "初始页面"}`);
          const dynamicData = await getDynamicList(userId, listOffset);
          const hasMore = dynamicData.has_more;
          listOffset = dynamicData.offset;
          for (let i2 = 0; i2 < dynamicData.items.length; i2++) {
            const item = dynamicData.items[i2];
            this.checkShouldStop();
            this.log("debug", `---------- 处理动态 ${i2 + 1}/${dynamicData.items.length} ----------`);
            const pageProgress = Math.floor(i2 / dynamicData.items.length * 15);
            this.updateProgress(10 + pageProgress);
            const dynamicId = item.id_str;
            const publisherInfo = item.modules.module_author;
            const publisherId = publisherInfo.mid;
            const publishTimestamp = publisherInfo.pub_ts;
            const dynamicText = (_a = item.modules.module_dynamic.desc) == null ? void 0 : _a.text.replace("\n", "");
            const dynamicType = item.type;
            log = `动态ID: ${item.id_str}`;
            log += `
发布时间：${new Date(publishTimestamp * 1e3).toLocaleString("zh-CN")}`;
            log += `
动态类型: ${dynamicType}`;
            log += `
动态内容: ${dynamicText}`;
            if (dynamicType !== "DYNAMIC_TYPE_FORWARD") {
              log += `
非转发动态，跳过`;
              this.log("info", log);
              continue;
            }
            const originDynamic = item.orig;
            const originDynamicId = originDynamic.id_str;
            const originDynamicPublisherInfo = originDynamic.modules.module_author;
            const originDynamicPublisherId = originDynamicPublisherInfo.mid;
            const originDynamicPublisherName = originDynamicPublisherInfo.name;
            const originDynamicPublishTimestamp = originDynamicPublisherInfo.pub_ts;
            const originDynamicType = originDynamic.type;
            log += `
被转发动态ID: ${originDynamicId}`;
            log += `
被转发动态发布者: ${originDynamicPublisherName}(${originDynamicPublisherId})`;
            log += `
被转发动态发布时间: ${new Date(originDynamicPublishTimestamp * 1e3).toLocaleString("zh-CN")}`;
            log += `
被转发动态类型: ${originDynamicType}`;
            if (["DYNAMIC_TYPE_DRAW", "DYNAMIC_TYPE_WORD"].indexOf(originDynamicType) === -1) {
              log += `
被转发动态非文本动态类型，跳过`;
              this.log("info", log);
              continue;
            }
            const hasLotteryNode = originDynamic.modules.module_dynamic.desc.rich_text_nodes.some(
              (node) => node.type === "RICH_TEXT_NODE_TYPE_LOTTERY"
            );
            if (!hasLotteryNode) {
              log += `
被转发动态非抽奖动态，跳过`;
              this.log("info", log);
              continue;
            }
            const originDynamicText = (_b = originDynamic.modules.module_dynamic.desc) == null ? void 0 : _b.text.replace("\n", "");
            log += `
被转发动态内容: ${originDynamicText}`;
            this.log("info", log);
            this.log("debug", "正在获取抽奖信息...");
            const lotteryInfo = await getLotteryInfo(originDynamicId);
            this.log("debug", `抽奖信息: ${JSON.stringify(lotteryInfo)}`);
            const lotteryStatus = lotteryInfo.status;
            const lotteryTimestamp = lotteryInfo.lottery_time;
            const lotteryParticipated = lotteryInfo.participated;
            const lotteryFollowed = lotteryInfo.followed;
            const lotteryReposted = lotteryInfo.reposted;
            log = `抽奖状态: ${lotteryStatus}`;
            log += `
开奖时间: ${new Date(lotteryTimestamp * 1e3).toLocaleString("zh-CN")}`;
            log += `
是否参与: ${lotteryParticipated}`;
            log += `
是否关注了发布者: ${lotteryFollowed}`;
            log += `
是否转发了本动态: ${lotteryReposted}`;
            const lotteryResult = lotteryInfo.lottery_result;
            if (!lotteryResult) {
              log += `
未找到开奖结果，跳过`;
              this.log("info", log);
              continue;
            }
            const win = Object.values(lotteryResult).some((userList) => {
              if (!Array.isArray(userList)) return false;
              return userList.some((user) => user.uid === publisherId);
            });
            log += `
是否中奖: ${win}`;
            detectedCount++;
            if (detectOnly) {
              log += `
仅检测模式，跳过删除`;
              this.log("info", log);
              continue;
            }
            if (win && notDeleteWinning) {
              log += `
不删除中奖动态，跳过`;
              this.log("info", log);
              continue;
            }
            this.log("debug", "正在删除动态...");
            await deleteDynamic(dynamicId);
            deletedCount++;
            this.log("debug", "动态删除成功");
          }
          this.log("debug", "========== 当前页面处理完成 ==========");
          if (!hasMore) {
            this.log("debug", "已到达最后一页，结束处理");
            break;
          }
          const detectionProgress = Math.min(75, detectedCount * 3);
          this.updateProgress(10 + detectionProgress);
          this.log("debug", `当前进度: 已检测到 ${detectedCount} 个过期抽奖动态，已删除 ${deletedCount} 个`);
        }
        const message = detectOnly ? `检测完成，发现 ${detectedCount} 个过期抽奖动态` : `删除完成，共删除 ${deletedCount}/${detectedCount} 个过期抽奖动态`;
        this.log("success", message);
        return { detected: detectedCount, deleted: deletedCount, detectOnly };
      } catch (error) {
        this.log("error", `操作失败: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
      }
    }
  }
  class ClearToviewExecutor extends ScriptExecutor {
    async execute(parameters) {
      const { confirm } = parameters;
      if (!confirm) {
        throw new Error("请确认要清空稍后再看列表");
      }
      this.log("info", "开始清空稍后再看列表");
      this.updateProgress(20);
      try {
        const toviewList = await getToViewList();
        const totalCount = toviewList.count;
        if (totalCount === 0) {
          this.log("info", "稍后再看列表已为空");
          return { cleared: 0, total: 0 };
        }
        this.log("info", `准备清空 ${totalCount} 个视频`);
        this.updateProgress(50);
        await clearToViewList();
        this.updateProgress(100);
        this.log("success", `成功清空稍后再看列表，共清除 ${totalCount} 个视频`);
        return { cleared: totalCount, total: totalCount };
      } catch (error) {
        this.log("error", `清空失败: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
      }
    }
  }
  function createScriptExecutor(scriptId, onLog, onProgress) {
    switch (scriptId) {
      case "bv2av":
        return new BvAvConverterExecutor(scriptId, onLog, onProgress);
      case "show_resource_info":
        return new VideoInfoExecutor(scriptId, onLog, onProgress);
      case "move_favorite_to_toview":
        return new MoveFavoriteToToviewExecutor(scriptId, onLog, onProgress);
      case "add_toview_to_favorite":
        return new AddToviewToFavoriteExecutor(scriptId, onLog, onProgress);
      case "move_favorite_to_another":
        return new MoveFavoriteExecutor(scriptId, onLog, onProgress);
      case "delete_timeout_lottery":
        return new DeleteTimeoutLotteryExecutor(scriptId, onLog, onProgress);
      case "clear_toview":
        return new ClearToviewExecutor(scriptId, onLog, onProgress);
      default:
        throw new Error(`Unknown script type: ${scriptId}`);
    }
  }
  class ScriptExecutionManager {
    constructor(onLog, onProgress) {
      __publicField(this, "executors", /* @__PURE__ */ new Map());
      __publicField(this, "onLog");
      __publicField(this, "onProgress");
      this.onLog = onLog;
      this.onProgress = onProgress;
    }
    /**
     * 执行脚本
     */
    async executeScript(scriptId, parameters) {
      const existingExecutor = Array.from(this.executors.values()).find((executor2) => executor2.getExecution().scriptId === scriptId && executor2.getExecution().status === "running");
      if (existingExecutor) {
        throw new Error("该脚本已在运行中，请等待完成或停止后再试");
      }
      const executor = createScriptExecutor(
        scriptId,
        this.onLog,
        (progress) => this.onProgress(scriptId, progress)
      );
      const executionId = executor.getExecution().id;
      this.executors.set(executionId, executor);
      try {
        const result = await executor.run(parameters);
        return result;
      } finally {
        setTimeout(() => {
          this.executors.delete(executionId);
        }, 5e3);
      }
    }
    /**
     * 停止脚本执行
     */
    stopScript(scriptId) {
      const executor = Array.from(this.executors.values()).find((executor2) => executor2.getExecution().scriptId === scriptId && executor2.getExecution().status === "running");
      if (executor) {
        executor.stop();
        return true;
      }
      return false;
    }
    /**
     * 获取正在运行的脚本列表
     */
    getRunningScripts() {
      return Array.from(this.executors.values()).filter((executor) => executor.getExecution().status === "running").map((executor) => executor.getExecution().scriptId);
    }
    /**
     * 清理所有执行器
     */
    cleanup() {
      this.executors.clear();
    }
  }
  function calculateNewWidths(currentX, state, config) {
    const deltaX = currentX - state.startX;
    let newLeftWidth = state.startLeftWidth + deltaX;
    let newRightWidth = state.startRightWidth - deltaX;
    if (newLeftWidth < config.minLeftWidth) {
      newLeftWidth = config.minLeftWidth;
      newRightWidth = config.containerWidth - newLeftWidth;
    }
    if (newRightWidth < config.minRightWidth) {
      newRightWidth = config.minRightWidth;
      newLeftWidth = config.containerWidth - newRightWidth;
    }
    const totalWidth = newLeftWidth + newRightWidth;
    if (totalWidth > config.containerWidth) {
      const ratio = config.containerWidth / totalWidth;
      newLeftWidth *= ratio;
      newRightWidth *= ratio;
    }
    return { leftWidth: newLeftWidth, rightWidth: newRightWidth };
  }
  function calculateRatio(leftWidth, rightWidth) {
    const totalWidth = leftWidth + rightWidth;
    return totalWidth > 0 ? leftWidth / totalWidth : 0.4;
  }
  function calculateWidthsFromRatio(ratio, containerWidth, config) {
    let leftWidth = containerWidth * ratio;
    let rightWidth = containerWidth * (1 - ratio);
    if (leftWidth < config.minLeftWidth) {
      leftWidth = config.minLeftWidth;
      rightWidth = containerWidth - leftWidth;
    }
    if (rightWidth < config.minRightWidth) {
      rightWidth = config.minRightWidth;
      leftWidth = containerWidth - rightWidth;
    }
    return { leftWidth, rightWidth };
  }
  function isMobileOrSmallScreen() {
    return window.innerWidth <= 1024;
  }
  function getContainerWidth(containerElement) {
    if (!containerElement) return 1200;
    return containerElement.clientWidth;
  }
  function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => func(...args), delay);
    };
  }
  function ScriptManager() {
    const containerRef = A(null);
    const [appState, setAppState] = d(() => ({
      scripts: SCRIPT_CONFIGS.map((config) => ({ ...config })),
      executions: [],
      logs: [],
      selectedScript: null,
      isModalOpen: true,
      favoriteList: null,
      favoriteListLoading: false,
      favoriteListError: null
    }));
    const [panelRatio, setPanelRatio] = d(0.6);
    const [resizeState, setResizeState] = d({
      isDragging: false,
      startX: 0,
      startLeftWidth: 0,
      startRightWidth: 0
    });
    const [panelWidths, setPanelWidths] = d({ leftWidth: 450, rightWidth: 600 });
    const [executionManager] = d(() => new ScriptExecutionManager(
      (log) => {
        setAppState((prev) => ({
          ...prev,
          logs: [...prev.logs, log]
        }));
      },
      (scriptId, progress) => {
        setAppState((prev) => ({
          ...prev,
          scripts: prev.scripts.map(
            (script) => script.id === scriptId ? { ...script, progress } : script
          )
        }));
      }
    ));
    y(() => {
      const savedLogs = _GM_getValue("bili_tasks_logs", "[]");
      try {
        const logs = JSON.parse(savedLogs).map((log) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        }));
        setAppState((prev) => ({ ...prev, logs }));
      } catch (error) {
        console.warn("Failed to load saved logs:", error);
      }
      const savedRatio = _GM_getValue("bili_tasks_panel_ratio", "0.6");
      try {
        const ratio = parseFloat(savedRatio);
        if (ratio >= 0.2 && ratio <= 0.8) {
          setPanelRatio(ratio);
        }
      } catch (error) {
        console.warn("Failed to load saved panel ratio:", error);
      }
      loadFavoriteList();
    }, []);
    const loadFavoriteList = async () => {
      setAppState((prev) => ({
        ...prev,
        favoriteListLoading: true,
        favoriteListError: null
      }));
      try {
        const favoriteList = await getFavoriteList();
        setAppState((prev) => ({
          ...prev,
          favoriteList,
          favoriteListLoading: false
        }));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "获取收藏夹列表失败";
        setAppState((prev) => ({
          ...prev,
          favoriteListLoading: false,
          favoriteListError: errorMessage
        }));
        console.error("Failed to load favorite list:", error);
      }
    };
    y(() => {
      const logsToSave = appState.logs.slice(-100);
      _GM_setValue("bili_tasks_logs", JSON.stringify(logsToSave));
    }, [appState.logs]);
    y(() => {
      _GM_setValue("bili_tasks_panel_ratio", panelRatio.toString());
    }, [panelRatio]);
    y(() => {
      const updatePanelWidths = () => {
        if (isMobileOrSmallScreen()) {
          setPanelWidths({ leftWidth: 450, rightWidth: 600 });
          return;
        }
        const containerWidth = getContainerWidth(containerRef.current);
        const config = {
          minLeftWidth: 300,
          minRightWidth: 400,
          containerWidth: containerWidth - 48 - 24 - 8
          // 减去左右padding(48px)、gap(24px)和分隔条宽度(8px)
        };
        const { leftWidth, rightWidth } = calculateWidthsFromRatio(panelRatio, config.containerWidth, config);
        setPanelWidths({ leftWidth, rightWidth });
      };
      updatePanelWidths();
      const debouncedResize = debounce(updatePanelWidths, 100);
      window.addEventListener("resize", debouncedResize);
      return () => {
        window.removeEventListener("resize", debouncedResize);
      };
    }, [panelRatio]);
    const handleExecuteScript = async (scriptId, parameters) => {
      setAppState((prev) => ({
        ...prev,
        scripts: prev.scripts.map(
          (script) => script.id === scriptId ? { ...script, isRunning: true, lastRun: /* @__PURE__ */ new Date() } : script
        )
      }));
      try {
        await executionManager.executeScript(scriptId, parameters);
      } catch (error) {
        const errorLog = {
          id: generateId(),
          timestamp: /* @__PURE__ */ new Date(),
          level: "error",
          message: `脚本执行失败: ${error instanceof Error ? error.message : String(error)}`,
          scriptId
        };
        setAppState((prev) => ({
          ...prev,
          logs: [...prev.logs, errorLog]
        }));
      } finally {
        setAppState((prev) => ({
          ...prev,
          scripts: prev.scripts.map(
            (script) => script.id === scriptId ? { ...script, isRunning: false } : script
          )
        }));
      }
    };
    const handleStopScript = (scriptId) => {
      const success = executionManager.stopScript(scriptId);
      if (success) {
        const stopLog = {
          id: generateId(),
          timestamp: /* @__PURE__ */ new Date(),
          level: "warn",
          message: "用户请求停止脚本执行",
          scriptId
        };
        setAppState((prev) => ({
          ...prev,
          logs: [...prev.logs, stopLog],
          scripts: prev.scripts.map(
            (script) => script.id === scriptId ? { ...script, isRunning: false } : script
          )
        }));
      }
    };
    const handleClearLogs = () => {
      setAppState((prev) => ({ ...prev, logs: [] }));
      _GM_setValue("bili_tasks_logs", "[]");
    };
    const handleResizeStart = (e2) => {
      if (isMobileOrSmallScreen()) return;
      const containerWidth = getContainerWidth(containerRef.current);
      const config = {
        minLeftWidth: 300,
        minRightWidth: 400,
        containerWidth: containerWidth - 48 - 24 - 8
        // 减去左右padding(48px)、gap(24px)和分隔条宽度(8px)
      };
      const { leftWidth, rightWidth } = calculateWidthsFromRatio(panelRatio, config.containerWidth, config);
      setResizeState({
        isDragging: true,
        startX: e2.clientX,
        startLeftWidth: leftWidth,
        startRightWidth: rightWidth
      });
      document.body.classList.add("resizing");
    };
    const handleResizeMove = (e2) => {
      if (!resizeState.isDragging || isMobileOrSmallScreen()) return;
      const containerWidth = getContainerWidth(containerRef.current);
      const config = {
        minLeftWidth: 300,
        minRightWidth: 400,
        containerWidth: containerWidth - 48 - 24 - 8
        // 减去左右padding(48px)、gap(24px)和分隔条宽度(8px)
      };
      const { leftWidth, rightWidth } = calculateNewWidths(e2.clientX, resizeState, config);
      const newRatio = calculateRatio(leftWidth, rightWidth);
      setPanelRatio(newRatio);
      setPanelWidths({ leftWidth, rightWidth });
    };
    const handleResizeEnd = () => {
      if (!resizeState.isDragging) return;
      setResizeState((prev) => ({ ...prev, isDragging: false }));
      document.body.classList.remove("resizing");
    };
    y(() => {
      if (resizeState.isDragging) {
        document.addEventListener("mousemove", handleResizeMove);
        document.addEventListener("mouseup", handleResizeEnd);
        return () => {
          document.removeEventListener("mousemove", handleResizeMove);
          document.removeEventListener("mouseup", handleResizeEnd);
        };
      }
    }, [resizeState.isDragging, resizeState]);
    const getScriptProgress = (scriptId) => {
      const script = appState.scripts.find((s2) => s2.id === scriptId);
      return (script == null ? void 0 : script.progress) || 0;
    };
    const toolScripts = appState.scripts.filter((script) => script.category === "tool");
    const operationScripts = appState.scripts.filter((script) => script.category === "operation");
    return /* @__PURE__ */ u$1("div", { class: "script-manager", ref: containerRef, children: /* @__PURE__ */ u$1("div", { class: "script-manager-content", children: [
      /* @__PURE__ */ u$1(
        "div",
        {
          class: "scripts-panel",
          style: { width: isMobileOrSmallScreen() ? "auto" : `${panelWidths.leftWidth}px` },
          children: [
            /* @__PURE__ */ u$1("div", { class: "scripts-section", children: [
              /* @__PURE__ */ u$1("h2", { children: "🔧 工具脚本 (日志输出目标信息)" }),
              /* @__PURE__ */ u$1("div", { class: "scripts-list", children: toolScripts.map((script) => /* @__PURE__ */ u$1(
                ScriptCard,
                {
                  script,
                  onExecute: handleExecuteScript,
                  onStop: handleStopScript,
                  isRunning: script.isRunning,
                  progress: getScriptProgress(script.id),
                  favoriteList: appState.favoriteList,
                  favoriteListLoading: appState.favoriteListLoading,
                  favoriteListError: appState.favoriteListError,
                  onRetryFavoriteList: loadFavoriteList
                },
                script.id
              )) })
            ] }),
            /* @__PURE__ */ u$1("div", { class: "scripts-section", children: [
              /* @__PURE__ */ u$1("h2", { children: "⚙️ 操作脚本 (不需要输出信息，正确执行完毕后即达成目标)" }),
              /* @__PURE__ */ u$1("div", { class: "scripts-list", children: operationScripts.map((script) => /* @__PURE__ */ u$1(
                ScriptCard,
                {
                  script,
                  onExecute: handleExecuteScript,
                  onStop: handleStopScript,
                  isRunning: script.isRunning,
                  progress: getScriptProgress(script.id),
                  favoriteList: appState.favoriteList,
                  favoriteListLoading: appState.favoriteListLoading,
                  favoriteListError: appState.favoriteListError,
                  onRetryFavoriteList: loadFavoriteList
                },
                script.id
              )) })
            ] })
          ]
        }
      ),
      !isMobileOrSmallScreen() && /* @__PURE__ */ u$1(
        ResizeHandle,
        {
          onMouseDown: handleResizeStart,
          isDragging: resizeState.isDragging
        }
      ),
      /* @__PURE__ */ u$1(
        "div",
        {
          class: "logs-panel",
          style: { width: isMobileOrSmallScreen() ? "auto" : `${panelWidths.rightWidth}px` },
          children: /* @__PURE__ */ u$1(
            LogPanel,
            {
              logs: appState.logs,
              onClear: handleClearLogs
            }
          )
        }
      )
    ] }) });
  }
  function TaskPanel(_props = {}) {
    return /* @__PURE__ */ u$1("div", { class: "task-panel", children: /* @__PURE__ */ u$1(ScriptManager, {}) });
  }
  function App() {
    const [isModalOpen, setIsModalOpen] = d(false);
    const handleOpenModal = () => {
      setIsModalOpen(true);
    };
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };
    return /* @__PURE__ */ u$1(preact.Fragment, { children: [
      !isModalOpen && /* @__PURE__ */ u$1(FloatingButton, { onClick: handleOpenModal }),
      /* @__PURE__ */ u$1(Modal, { isOpen: isModalOpen, onClose: handleCloseModal, children: /* @__PURE__ */ u$1(TaskPanel, {}) })
    ] });
  }
  preact.render(
    /* @__PURE__ */ u$1(App, {}),
    (() => {
      const app = document.createElement("div");
      app.id = "bili-tasks-app";
      document.body.append(app);
      return app;
    })()
  );

})(preact);