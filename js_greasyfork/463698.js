// ==UserScript==
// @name         twidouga_viewer
// @namespace    https://mesak.tw
// @version      0.2
// @description  直接看 twidouga 的影片
// @description:en  quick to view video
// @author       Mesak
// @license      MIT
// @match        https://www.twidouga.net/realtime_t.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twidouga.net
// @require      https://unpkg.com/vue@3.2.47/dist/vue.global.prod.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3BunsafeWindow.Vue%3DVue%3B
// @require      https://unpkg.com/element-plus@2.3.3/dist/index.full.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/mediaelement/4.2.14/mediaelement-and-player.min.js
// @grant        GM_addElement
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/463698/twidouga_viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/463698/twidouga_viewer.meta.js
// ==/UserScript==
(async function(vue) {
    'use strict';
    function proxyTap(t){let n=new Proxy(t,{get(t,e,r){let o=Reflect.get(t,e,r);return"function"!=typeof o?o:(...e)=>(o.call(t,...e),n)}});return n}
    function tap(t,n){return n?(n(t),t):proxyTap(t)}
    Response.prototype.html = async function () {
        return tap(new DOMParser().parseFromString(((text)=>{
            text = text.replaceAll('/a>','</a>').replaceAll('</a','</a>').replaceAll('<<','<').replaceAll('>>','>')
            return (text.substring(0,1) === text.substring(text.length-1) )?
                JSON.parse(text) : text;
        })(await this.text()), 'text/html'),(node) => {
            node.querySelectorAll('link').forEach(e => e.remove());
            node.querySelectorAll('style').forEach(e => e.remove());
            node.querySelectorAll('script').forEach(e => e.remove());
        });
    }
    GM_addElement('link', {
        href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css',
        rel: 'stylesheet'
    });
    GM_addElement('link', {
        href: 'https://cdnjs.cloudflare.com/ajax/libs/mediaelement/4.2.14/mediaelementplayer.min.css',
        rel: 'stylesheet'
    });
    GM_addElement('link', {
        href: 'https://unpkg.com/element-plus@2.3.3/dist/index.css',
        rel: 'stylesheet'
    });
    GM_addElement('style', {
        textContent: `
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.infinite-list {
  height: 720px;
  padding: 0;
  margin: 0;
  margin-top: 120px;
  list-style: none;
}
.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}
`});
    const apiRealTime = (()=>{
        const getUrl = (path) =>{
            return `https://${window.location.host}/${path}`;
        }
        const request = (path, params, method = 'GET') => {
            let url = getUrl(path);
            if (method === 'GET' && params) {
                url += `?${new URLSearchParams(params)}`;
            }
            console.log('url = ',url)
            return fetch(url).then(res => res.html());
        };
        return {
            getList: (page) => {
                return new Promise((resolve, reject)=>{
                    request('list', { page }).then( (resDom)=>{
                        let result = [];
                        for (const itemNode of resDom.querySelectorAll('#container .item')) {
                            const hasIframe = itemNode.querySelector('iframe') === null;
                            const needShow = !itemNode.hasAttribute('id') && hasIframe;
                            if( needShow ){
                                const data = {
                                    id: Date.now(),
                                    link: itemNode.querySelector('.saisei a').getAttribute('href'),
                                    thumb: itemNode.querySelector('a > img').getAttribute('src'),
                                    video: itemNode.querySelector('a:nth-child(1)').getAttribute('href')
                                };
                                data.id = new URL(data.link).pathname.match(/\/(\d+)/i)[1];
                                //console.log(data.id)
                                result.push(data);
                            }
                        }
                        console.log('result',result)
                        resolve(result);
                    }).catch((error) => {
                        reject(error);
                    });
                })
            },
        };
    })();
    document.querySelector('body').innerHTML = `<div id="app">
<div class="common-layout">
     <el-container>
        <el-aside width="400px">
            <h3>{{nowPage}}</h3> <el-button type="primary" @click=onResetPage>重置</el-button>
            <ul v-infinite-scroll="onLoadPage" class="infinite-list" style="overflow: auto">
                <li v-for="item in resourceList" :key="item" class="infinite-list-item">
                   <el-image style="width: 360px;" :src="item.thumb" :fit="fit" @click=onPlayVideo(item.id) />
                </li>
            </ul>
        </el-aside>
        <el-main>
                <el-card class="box-card">
                    <template #header>
                        <div class="card-header">
                            <span>{{active.id}}</span>
                            <a :href=active.link>Twitter</a>
                        </div>
                    </template>
                    <video id="video-player" ref="videoRef" controls></video>
                </el-card>
        </el-main>
    </el-container>
</div>
<div id="wrap"></div>
</div>`;
    const { createApp,ref,computed ,onMounted } = vue;
    const app = createApp({
        setup() {

            const resource = ref(new Map());
            const resourceList = computed({
                get : () => Array.from( resource.value.values() ),
                set : (newData) =>{
                    console.log( newData )
                    let newResource = new Map();
                    Array.from(newData, (value, _key) => {
                        newResource.set(value.id ,value )
                    })
                    resource.value = newResource;
                }
            })
            const active = ref({
                id:'',
                video:'',
                thumb:''
            });
            const page = ref(0);
            const nowPage = computed(()=>page.value);
            const onResetPage = () => {
                page.value = 0;
            }
            const fetchIng = ref(false);
            const onLoadPage = () => {
                if( !fetchIng.value ){
                    page.value++;
                    fetchIng.value = true
                    apiRealTime.getList(nowPage.value).then( (result) => {
                        resourceList.value = result
                        fetchIng.value = false
                    });
                }
            }
            const videoRef = ref(null);
            const player = ref(null);
            const onPlayVideo = (id) => {
                active.value = resource.value.get(id);
                player.value.setSrc({
                    src: active.value.video,
                    type: 'video/mp4',
                });
                player.value.play();
            }
            onMounted(() => {
                resourceList.value = [
                    {
                        id : 0,
                        video : '',
                        link: '',
                        thumb : 'https://fakeimg.pl/600x200/?text=empty'
                    }
                ]
                onLoadPage();
                player.value = new MediaElementPlayer(videoRef.value);
            })
            return {
                nowPage,
                active,
                onLoadPage,
                onPlayVideo,
                onResetPage,
                resourceList,
                videoRef,
            };
        },
    });
    app.use(ElementPlus);
    app.mount('#app');
})(Vue);
