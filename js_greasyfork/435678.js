// ==UserScript==
// @name        爱蒙编辑器(vue,一键打开)
// @namespace   Violentmonkey Scripts
// @include       http://localhost*
// @include       http://127.0.0.1*
// @include       http://0.0.0.0*
// @include       http://192.168.*
// @include       http://10.0.*
// @include       http://10.114.*
// @include       http://10.115.*
// @exclude       http://10.0.0.1/cgi-bin/*
// @include       http://172.16.*
// @grant       none
// @version     0.8.1
// @author      -
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery.hotkeys@0.1.0/jquery.hotkeys.min.js
// @description 2021/11/18 下午3:32:59
// @downloadURL https://update.greasyfork.org/scripts/435678/%E7%88%B1%E8%92%99%E7%BC%96%E8%BE%91%E5%99%A8%28vue%2C%E4%B8%80%E9%94%AE%E6%89%93%E5%BC%80%29.user.js
// @updateURL https://update.greasyfork.org/scripts/435678/%E7%88%B1%E8%92%99%E7%BC%96%E8%BE%91%E5%99%A8%28vue%2C%E4%B8%80%E9%94%AE%E6%89%93%E5%BC%80%29.meta.js
// ==/UserScript==
document.addEventListener('click', event => {
    if (event.ctrlKey) {
        event.preventDefault();
        event.stopPropagation();
        const c = element => {
            if (!element) return false
            if (element?.__vnode?.props.__v_inspector) {
                return element?.__vnode?.props.__v_inspector;
            } else if (element.getAttribute('data-v-inspector')) {
                return element.getAttribute('data-v-inspector')
            } else {
                return c(element.parentNode);
            }
        };
        const cTracer = element => {
            if (!element) return false
            const matchedPath = window.__vue_tracer__.vnodeToPos.get(element?.__vnode?.props)
            if (matchedPath) {
                return matchedPath;
            }  else {
                return cTracer(element.parentNode);
            }
        };
        if (window.useNuxtApp) {
            const app = useNuxtApp();
            const rootDir = app.vueApp._component.__file.replace(/node_modules.*/, '');
            if(window.__vue_tracer__){
                const matched = cTracer(event.srcElement);
                if(matched){
                    const path = rootDir + matched.join(':');
                    highlight(event.srcElement);
                    // fetch(`/__open-in-editor?file=${encodeURI(path)}`).then(() => {});
                    window.open(
                        `cursor://file/${path}`
                    );
                }

                return;
            };
            const src = c(event.srcElement);
            if (rootDir && src) {
                fetch(`/__open-in-editor?file=${rootDir + src}`).then(() => {
                    highlight(event.srcElement);
                });
            }
            return false
        }
        if (window.__vite_plugin_ssr) {
            const rootDir =
                  __VUE_DEVTOOLS_GLOBAL_HOOK__.apps[2].app._instance.subTree.type.__file.replace(
                      /renderer\/.*/,
                      '',
                  );
            const src = c(event.srcElement);
            if (rootDir && src) {
                fetch(`/__open-in-editor?file=${rootDir + src}`.replace('src/src', 'src')).then(() => {
                    highlight(event.srcElement);
                });
            }
            return false
        }
        if (window.__VUE_INSPECTOR__) {
            const rootDir = __VUE_INSPECTOR__._.type.__file.replace(/node_modules.*/, '')
            const src = c(event.srcElement);
            if (rootDir && src) {
                fetch(`/__open-in-editor?file=${rootDir + src}`).then(() => {
                    highlight(event.srcElement);
                });
            }
            return false
        }
    }
});

document.addEventListener('keyup', event => {
    if (event.keyCode === 190 && event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
        if (window.useNuxtApp) {
            const app = useNuxtApp();
            if (event.ctrlKey) {
                console.log(1);
                console.log(event.target);
            } else {
                fetch(
                    `/__open-in-editor?file=${app._route.matched[app._route.matched.length - 1].components.default.__file
                    }`,
                );
            }

            return false;
        }
        if (window.__vite_plugin_ssr) {
            const baseSrc =
                  __VUE_DEVTOOLS_GLOBAL_HOOK__.apps[2].app._instance.subTree.type.__file.replace(
                      /renderer\/.*/,
                      '',
                  );
            let pathname = location.pathname + '/index';
            const list = __vite_plugin_ssr['setPageFiles.ts'].pageFilesAll;
            let fileUrl = '';
            console.log(list)
            console.log(pathname)
            if (pathname === '//index') {
                file = list.find(item => item.pageId === '/src/pages/index/index');
                fileUrl = file.filePath;
            } else {
                file = list.find(item => item.pageId.includes(pathname));
                fileUrl = file.filePath;
            }
            console.log(fileUrl);
            fetch(`/__open-in-editor?file=${baseSrc + fileUrl}`);
            return false;
        }
        if (typeof app !== 'undefined') {
            const appInstance = window?.__VUE_DEVTOOLS_GLOBAL_HOOK__.apps.find(item => !!(item.app || item)?.config?.globalProperties.$route)
            const vue3Url = (appInstance.app || appInstance).config.globalProperties.$route.matched.slice(
                -1,
            )?.[0].components.default.__file
            if (vue3Url) {
                console.log(vue3Url);
                fetch(`/__open-in-editor?file=${vue3Url}`);
            } else if (window.uni) {
                const app = window?.__VUE_DEVTOOLS_GLOBAL_HOOK__.apps?.[0]?.app;
                const baseSrc = app._component.__file.replace('/App.vue', '');
                const fileUrl = baseSrc + app.router.currentRoute.value.fullPath + '.vue';
                fetch(`/__open-in-editor?file=${fileUrl}`);
            } else if (app) {
                const vm = app.__vue__;
                const fileUrl = vm.$route.matched[vm.$route.matched.length - 1].components.default.__file;
                fetch(`/__open-in-editor?file=${fileUrl}`);
            }
        } else if (typeof getApp === 'function' && localStorage.getItem('custom-file-base-url')) {
            const url = localStorage.getItem('custom-file-base-url') + getApp()._route.fullPath + '.vue';
            console.log(url);
            fetch(`/__open-in-editor?file=${url}`);
        }
    }
});

function highlight(clickedElement) {
    const rect = clickedElement.getBoundingClientRect();
    const frame = document.createElement('div');
    frame.style.position = 'absolute';
    frame.style.top = rect.top + window.scrollY + 'px';
    frame.style.left = rect.left + window.scrollX + 'px';
    frame.style.width = rect.width - 4 + 'px';
    frame.style.height = rect.height - 4 + 'px';
    frame.style.border = 'solid 2px gold';
    frame.style.borderRadius = '5px';
    frame.style.zIndex = '99999';
    frame.style.pointerEvents = 'none';
    document.body.appendChild(frame);

    $(frame).fadeIn(300, 'swing').delay(500).fadeOut(500, 'swing');
}
