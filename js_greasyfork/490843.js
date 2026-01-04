// ==UserScript==
// @name                hbl_tools
// @namespace           https://feng.hbl.com/
// @version             0.4.7
// @description         hbl_tools useful
// @author              feng
// @copyright           feng
// @license             MIT
// @match               *://*.aplum.com/mis/*
// @match               *://fxg.jinritemai.com/ffa/g/create*
// @match               *://live.douyin.com/*
// @run-at              document-idle
// @supportURL          https://baidu.com
// @homepage            https://baidu.com
// @require             https://cdn.bootcdn.net/ajax/libs/exceljs/4.3.0/exceljs.min.js
// @require             https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.js
// @grant               GM_download
// @grant               GM_setClipboard
// @icon                data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAttJREFUaEPtWVtSAjEQTKC0vISUn3IK8WTAycBT6KeFl7C0JFZGg9mQTPcsiyUqn5qdpLvnlYl3J/7zJ35+9/cA3E/OF965uSgXwjqMx8vp4/O6j5JiK4Qb5/0s2oo2rp9eby22aAXury5mfrtd1YwH55bTzcvCsnGHiOLD680LfS564cPl2UqYavwsIDQyRFgDITyAyXlQGf50J0YF//Y218gQVyJVoAAgxphDW9eE0eiWiS0KQNz8ASlgPSFYP6gCcS8t6FJGMmFQ4ilmJDYb0QogFVjGEkhNUdZ9oq3BAFgyB8poFjJoAKULxU1qf0NuVCaExHauiIUMCkBr09KtmI077Ge+3ocM2oVam9aCW5NfI6K0xZBBAUCbWlTIiagdsFSBAQFdSGM/+fteio1V2fu7Mh52TaBSaa2upAKwGEOZJQeDmLUEtArAYmhIABbiOgDih4mpXZ8u7aFeGfv0ShYV5N6RXHI0Wuc9kgBAbQKqjBb2c1dSM1Z+caoUl3QmD9lD7IONtMKGVGCI9ZC9RkbZuVq6XqIS3Pq/Yr/jxjUVnFv6726T++JsfXfaAEJY7zVke0gPkJhhO8ZBk900sVDcDwbxoYF2SBCj+IyZ6CONKiMTKQNgStArjlB2I8/ULWRXFzO33cropMwAh+Tsmgqm2oIKWUtmSyuBcnZnD8R+UVs08n53Mye9fjaRa8XC3p2hkllYl2Ta91xNeB9gLhnspsglmctT5Y6Bs3U5kc5nNpZNUZvMEmFSIC1usce4WL5hDiJ3SQsRvQAcbazyWWOQezWrNXagrxXqNM0wEkcp9ziDLVAZLZtKdlOGxRZbMAvtYgA8cKQnIlrRgR5LeACnPF5HzR7NumEh6pWSqeEU+MlPTNJyk1MChmRkC41xetWBsi/KjaD7Qg2UBoJ1H2n7GcbyNVJ55cuPx+k4cLK+ESd7ElvZi2UfIswArICPvf4fwLEZRvbfAT8jlbXobXLcAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/490843/hbl_tools.user.js
// @updateURL https://update.greasyfork.org/scripts/490843/hbl_tools.meta.js
// ==/UserScript==

let dbName = 'productsDB';
let storeName = 'productsSelectedStore';
let productEditorStoreName = 'productEditorStoreName';
let productsCachedStoreName = 'productsCachedStore';
let db;
let dbVersion = 3;

let searchActivityForm = {
    pageIndex: 1,
    pageSize: 20,
    id: '',
    room_name: '',
    user_id: '1569406692',
    activity_id: '',
    location: '',
    date_range: '',
    is_show: '',
    deleted: '0',
    live_room_type: 'all',
    position: '',
    live_type: 'total',
    live_status: 'all',
    is_dou_yin_stock: '',
};

(async function () {
    console.log('hbl_tools start');
    let pathname = location.pathname;
    console.log(pathname);
    if (pathname.endsWith('/mis/modal/borrow')) {
        processBorrowTip();
        return;
    }
    if (location.href.includes('aplum.com/')) {
        let enable = await checkEnable();
        console.log('checkEnable:' + enable);
        if (!enable) {
            return;
        }
    }

    if (pathname.endsWith('/activity-new/view-douyin-live')) {
        processViewDouyinLive();
    } else if (pathname.endsWith('/product-editor/index')) {
        processProductEditorIndex();
    } else if (pathname.endsWith('/mis/product/view')) {
        //商品详情页
        tryClickPriceEle(document.getElementById('in_price_mask'));
        tryClickPriceEle(document.getElementById('seller_user_masked'));
        tryClickPriceEle(document.getElementById('pangu_guide_price_mask'));
        tryClickPriceEle(document.getElementById('cur_price_mask'));
        tryClickPriceEle(document.getElementById('dy_lowest_sale_price_mask'));
        let url = window.location.href;
        if (url.includes('?tab=') && !url.includes('?tab=base_info')) {
            // let vue2App = document.getElementById('vue2-app').__vue__;
            // vue2App.$message({
            //     type: 'success',
            //     message: '获取不到价格信息，请切换到基本信息标签页,才支持导入抖店',
            // });
            return;
        }
        let parentEle = document.getElementsByClassName('col-md-7')[0];
        let pidEle = parentEle?.firstChild;
        if (pidEle == null) {
            return;
        }
        let pid = pidEle.textContent;
        let priceEle = document.getElementsByClassName('text-danger')[0];
        let price = priceEle?.textContent?.match(/(\d+)/)[1];
        let series = document.getElementsByClassName('col-md-7')[1]?.firstChild?.lastChild?.lastChild?.textContent;
        let imageEles = document.getElementsByClassName('img-responsive');
        let activites = await getActivities();
        if (activites?.length <= 0) {
            addExportDouDianButton(null, parentEle, pid, series, price, imageEles);
        } else {
            let count = Math.min(3, activites.length);
            for (let i = activites.length - 1; i >= activites.length - count; i--) {
                addExportDouDianButton(activites[i], parentEle, pid, series, price, imageEles);
            }
        }
    } else if (pathname.endsWith('/toonsale/view')) {
        //批次页
        let elements = document.getElementsByClassName('hand-style');
        if (elements.length > 0) {
            for (let i = 0; i < elements.length; i++) {
                tryClickPriceEle(elements[i]);
            }
        }
    } else if (pathname.endsWith('/live/index')) {
        //直播管理页,自动搜索活动页
        let vue2App = document.getElementById('vue2-app').__vue__;
        vue2App.searchForm.user_id = 1569406692;
        vue2App.handleSearch();
    } else if (pathname.endsWith('/live/create')) {
        //创建活动页
        let ele = document.getElementById('tliveroom-anchor_list');
        ele.value = '1569406692';
        ele.dispatchEvent(new Event('change'));

        ele = document.getElementById('tliveroom-effective_anchor_list');
        ele.value = '1569406692';
        ele.dispatchEvent(new Event('change'));

        ele = document.getElementById('tliveroom-assistant_list');
        ele.value = '2218';
        ele.dispatchEvent(new Event('change'));

        ele = document.getElementById('tliveroom-room_name');
        const daysLater = new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000);
        const year = daysLater.getFullYear();
        const month = (daysLater.getMonth() + 1).toString().padStart(2, '0');
        const day = daysLater.getDate().toString().padStart(2, '0');
        ele.value = `${year}${month}${day}抖C7号`;
        ele.dispatchEvent(new Event('input'));

        ele = document.getElementById('tliveroom-live_type');
        ele.value = 'dytalent';
        ele.dispatchEvent(new Event('change'));

        ele = document.getElementById('tliveroom-is_dou_yin_stock');
        ele.value = '0';
        ele.dispatchEvent(new Event('change'));

        // ele = document.getElementById('tliveroom-offshelf_time');
        // ele.value = '24';
        // ele.dispatchEvent(new Event('input'));

        ele = document.getElementById('tliveroom-location');
        ele.value = '内场_环普6';
        ele.dispatchEvent(new Event('change'));

        ele = document.getElementById('liveroomposition');
        ele.value = '北京';
        ele.dispatchEvent(new Event('change'));

        setTimeout(() => {
            //刚刷出来时设置失败，需要等一会再设置
            ele = document.getElementById('tliveroom-douyin_account');
            ele.value = '7号 红布林包多多';
            ele.dispatchEvent(new Event('change'));
        }, 1000);
        setTimeout(() => {
            //刚刷出来时设置失败，需要等一会再设置，多来一重保险
            ele = document.getElementById('tliveroom-douyin_account');
            ele.value = '7号 红布林包多多';
            ele.dispatchEvent(new Event('change'));
        }, 3000);

        ele = document.getElementById('tliveroom-starttime');
        ele.value = `${year}-${month}-${day} 18:00:00`;
        ele.dispatchEvent(new Event('input'));

        ele = document.getElementById('tliveroom-endtime');
        const daysLater2 = new Date(daysLater.getTime() + 24 * 60 * 60 * 1000);
        const year2 = daysLater2.getFullYear();
        const month2 = (daysLater2.getMonth() + 1).toString().padStart(2, '0');
        const day2 = daysLater2.getDate().toString().padStart(2, '0');
        ele.value = `${year2}-${month2}-${day2} 3:00:00`;
        ele.dispatchEvent(new Event('input'));

        Toast('自动填写成功，时间默认填的2天后，请检查并修改直播间名称中的时间、开始时间、结束时间', 100000);
    } else if (pathname.endsWith('/dou-yin-sync-product/index')) {
        //活动页的抖音同步页
        setInterval(() => {
            let shopNameEle = document.querySelector('div.el-form-item.is-required > div > div > div > input');
            if (shopNameEle != null && shopNameEle.value.length <= 0) {
                shopNameEle.value = '红布林包';
                shopNameEle.dispatchEvent(new Event('input'));
            }
            let shopNameConfigEle = document.querySelector('#vue2-app > div.el-row > div > div > div.el-dialog__body > form > div:nth-child(4) > div > div.el-input.el-input--suffix > input');
            if (shopNameConfigEle != null && shopNameConfigEle.value.length <= 0) {
                shopNameConfigEle.value = '[1]/[2]/[6]/[7]';
                shopNameConfigEle.dispatchEvent(new Event('input'));
            }
        }, 1000);
    } else if (pathname.endsWith('/ffa/g/create')) {
        //抖音创建商品页;
        let params = getURLParams();
        if (params == null || params.pid == null) {
            console.log('no valid hbl params');
            return;
        }
        //eslint-disable-next-line no-constant-condition
        while (true) {
            console.log('waiting for elements completed');
            await sleep(1000);
            let finished = true;
            let nameEle = document.getElementsByClassName('ecom-g-input-wrapper ecom-g-input-group')[0]?.lastChild?.firstChild;
            if (nameEle != null) {
                if (params.activityName != null && params.activityId != null) {
                    setReactInputValue(nameEle, `红布林/${params.pid}/${params.activityName}/z/${params.activityId}`);
                } else {
                    let values = nameEle.value.split('/');
                    if (values.length >= 2) {
                        values[1] = `${params.pid}`;
                        setReactInputValue(nameEle, values.join('/'));
                    }
                }
                nameEle.dispatchEvent(new Event('input'));
            } else {
                finished = false;
            }
            let pidEle = document.querySelector('[dropdownclassname="auto-dropdown-id-产品编号"]');
            if (pidEle != null && params.pid != null) {
                setReactInputValue(pidEle, params.pid);
            }
            let seriesEle = document.getElementsByClassName('ecom-g-select ecom-g-select-single ecom-g-select-show-arrow ecom-g-select-show-search')[2]?.firstChild?.firstChild?.firstChild;
            if (seriesEle != null && params.series != null) {
                setReactInputValue(seriesEle, params.series);
            }
            let priceEle = document.querySelector('[aria-valuenow="8899"]');
            if (priceEle != null && params.price != null) {
                setReactInputValue(priceEle, params.price);
            } else {
                finished = false;
            }
            let pidEle2 = document.querySelector('[placeholder="请输入erp编码"]');
            if (pidEle2 != null && params.pid != null) {
                setReactInputValue(pidEle2, params.pid);
            } else {
                finished = false;
            }
            if (finished) {
                Toast(`已自动填写标题、编号(${params.pid})、价格(${params.price})，请检查是否正确，并手动上传图片(已自动下载到默认目录)`, 40000);
                break;
            }
        }

        //eslint-disable-next-line no-constant-condition
        while (true) {
            console.log('waiting for save completed');
            await sleep(1000);
            if (document.body.textContent.includes('提交成功')) {
                // await sleep(2000);//创建成功后需要等待2s左右才能搜索到最新的商品和链接，否则可能是旧的
                let douDianProducts = await getDouDianProducts(params.pid);
                if (douDianProducts != null && douDianProducts.length > 0) {
                    let product = douDianProducts[0];
                    if (Date.now() - new Date(product.create_time).getTime() > 60000) {
                        console.log('获取到的不是最新的，尝试重新获取');
                        continue;
                    }
                    // eslint-disable-next-line no-undef
                    GM_setClipboard(product.product_url_for_copy);
                    Toast(`链接已自动复制,粘贴即可(${product.product_url_for_copy})`, 30000);
                    break;
                }
            }
        }
    } else if (location.href.includes('//live.douyin.com/')) {
        let page = document.getElementsByTagName('body')[0];
        console.log('page', page);
        let autoDianZhanBtn = document.createElement('p');
        autoDianZhanBtn.className = 'autoDianZhanBtn';
        autoDianZhanBtn.innerHTML = '开始<br/>点赞';
        page.append(autoDianZhanBtn);
        let total = document.createElement('div');
        total.className = 'total';
        total.innerHTML = '<p class="text">点赞数：</p><p class="autoDianZhanBtn-all">0</p>';
        page.append(total);

        let num = document.getElementsByClassName('autoDianZhanBtn-all')[0];
        console.log('num', num);
        num.innerHTML = 0;
        let isStarted = false;

        const a = document.createEvent('MouseEvents');
        a.clientX = 100;
        a.clientY = 100;
        a.initEvent('click', true, true);
        let clickEle = null;
        // 设置点赞间隔，最好是0.6秒一次，不然会提示手速太快,目前一小时总共可以3000次？
        // 标签切到后台5分钟后setInterval方法的频率变为一分钟一次，这是浏览器的底层节能策略导致的
        let interval = 1000;
        autoDianZhanBtn.addEventListener('click', () => {
            isStarted = !isStarted;
            if (!isStarted) {
                window.dzanTimer && workerTimer.clearInterval(window.dzanTimer);
                autoDianZhanBtn.innerHTML = '开始<br/>点赞';
                return;
            }
            console.log('执行点赞脚本');
            autoDianZhanBtn.innerHTML = '停止<br/>点赞';
            let count = 0;
            window.dzanTimer && workerTimer.clearInterval(window.dzanTimer);
            window.dzanTimer = workerTimer.setInterval(async () => {
                if (clickEle == null) {
                    clickEle = document.querySelector('.LO5TGkc0');
                    if (clickEle == null) {
                        console.log('waiting for clickEle');
                        return;
                    }
                }
                if (document.body.textContent.includes('手速太快了')) {
                    console.log('提示手速太快了，暂停一会');
                    await sleep(100000);
                    return;
                }
                if (document.body.textContent.includes('直播已结束')) {
                    console.log('提示直播已结束，暂停一段时间');
                    await sleep(3600000);
                    return;
                }
                clickEle?.dispatchEvent(a);
                await sleep(100);
                clickEle?.dispatchEvent(a);
                console.log(new Date().toLocaleString() + ' 点赞+' + ++count);
                num.innerHTML = count;
                // setTimeout(() => {
                //     //双击
                //     clickEle?.dispatchEvent(a);
                //     console.log(new Date().toLocaleString() + ' 点赞+' + ++count);
                //     num.innerHTML = count;
                // }, 100);
                if (count >= 3000) {
                    interval = 1200;
                    await sleep(300);
                }
            }, interval);
        });
        // }
    }
})();

//设置react组件的input值，需要使用input事件触发
let inputEvent = new Event('input', { bubbles: true });
//  React15
inputEvent.simulated = true;
function setReactInputValue(element, value) {
    let lastValue = element.value;
    element.value = value;
    // //  React16 内部定义了descriptor拦截value，此处重置状态
    let tracker = element._valueTracker;
    if (tracker) {
        tracker.setValue(lastValue);
    }
    element.dispatchEvent(inputEvent);
}

async function getDouDianProducts(pid) {
    return new Promise((resolve) => {
        try {
            // eslint-disable-next-line no-undef
            fetch(`https://fxg.jinritemai.com/product/tproduct/list?page=0&pageSize=20&id_name_code=${pid}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log('getDouDianProducts success:' + data.msg);
                    console.log(data);
                    if (data.code === 0) {
                        resolve(data.data);
                    } else {
                        resolve(null);
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    resolve(null);
                });
        } catch (error) {
            console.log(error);
            resolve(null);
        }
    });
}

async function getActivities() {
    const end = new Date();
    const start = new Date();
    end.setTime(end.getTime() + 3600 * 1000 * 24 * 10);
    let year = start.getFullYear();
    let month = (start.getMonth() + 1).toString().padStart(2, '0');
    let day = start.getDate().toString().padStart(2, '0');
    let startRange = `${year}-${month}-${day}`;

    year = end.getFullYear();
    month = (end.getMonth() + 1).toString().padStart(2, '0');
    day = end.getDate().toString().padStart(2, '0');
    let endRange = `${year}-${month}-${day}`;
    searchActivityForm.date_range = [startRange, endRange];

    return new Promise((resolve) => {
        try {
            // eslint-disable-next-line no-undef
            $.get('/mis/apis/live-api/live-room-list', searchActivityForm, function (res) {
                console.log(res.msg);
                if (res.code === 0) {
                    resolve(res.data.list);
                } else {
                    resolve(null);
                }
            });
        } catch (error) {
            console.log(error);
            resolve(null);
        }
    });
}

async function getUsers() {
    const header = {
        'X-LC-Id': 'EiSPYl7TpdZ92RjdbXJp4eYJ-gzGzoHsz',
        'X-LC-Key': 'Dmsqh0CsYavSfJiWb4yjaryO',
        'Content-Type': 'application/json',
    };

    let url = 'https://eispyl7t.lc-cn-n1-shared.com/1.1/classes/HBL_User?where={"enable":true}';
    return new Promise((resolve) => {
        try {
            fetch(url, {
                headers: header,
            })
                .then((response) => response.json())
                .then((res) => {
                    console.log(res);
                    resolve(res.results);
                })
                .catch((err) => {
                    console.log('err', err);
                    resolve(null);
                });
        } catch (error) {
            console.log(error);
            resolve(null);
        }
    });
}

function addExportDouDianButton(activity, parentEle, pid, series, price, imageEles) {
    let btn = document.createElement('button');
    btn.textContent = '导入抖店' + (activity ? '-' + activity.room_name : '');
    btn.className = 'btn btn-sm btn-primary';
    btn.style.background = 'green';
    btn.style.marginLeft = '10px';
    // btn.style.marginTop = '10px';
    // btn.style.height = '30px';
    // parentEle.style.display = 'flex';
    // parentEle.style.flexWrap = 'wrap';
    // parentEle.style.alignItems = 'center';
    parentEle.insertBefore(btn, parentEle.lastChild);
    btn.addEventListener('click', () => {
        let vue2App = document.getElementById('vue2-app').__vue__;
        if (imageEles != null && imageEles.length > 0) {
            vue2App.$message({
                type: 'success',
                message: '开始自动下载商品图到默认下载目录',
            });
            Array.from(imageEles).forEach((imageEle, index) => {
                let imageName = pid + '_' + index + '.png';
                vue2App.$message({
                    type: 'success',
                    message: `开始自动下载商品图到默认下载目录:${imageName},(${index}/${imageEles.length})`,
                });
                // eslint-disable-next-line no-undef
                GM_download({
                    url: imageEle.src,
                    name: imageName, //不填则自动获取文件名
                    saveAs: false, //布尔值，是否显示"保存为"对话框
                    conflictAction: 'overwrite', //文件冲突时的策略
                    onerror: function (error) {
                        //如果下载最终出现错误，则要执行的回调
                        console.log(error);
                    },
                });
            });
        }
        let paramsStr = `pid=${pid}&price=${price}&series=${series}`;
        if (activity != null) {
            paramsStr += `&activityName=${activity.room_name}&activityId=${activity.id}`;
        }
        let url = `https://fxg.jinritemai.com/ffa/g/create?copyid=3675855111361527939&cid=26178&entrance=copy&${paramsStr}`;
        window.open(url);
    });
}

async function processViewDouyinLive() {
    let vue2App = document.getElementById('vue2-app').__vue__;
    //处理底部按钮，并设置为自适应换行
    let group = document.getElementsByClassName('view-shop-footer')[0];
    group.style.justifyContent = 'flex-start';
    group.style.display = 'flex';
    group.style.flexWrap = 'wrap';

    let btn = document.createElement('button');
    btn.textContent = '批量复制ID';
    btn.className = 'el-button el-button--primary el-button--mini';
    btn.style.background = 'green';
    group.appendChild(btn);
    btn.addEventListener('click', () => {
        if (!vue2App.checkSelectProduct()) {
            return;
        }
        let selectedProducts = vue2App.selectedProducts;
        let selectedPids = selectedProducts.map((t) => t.p_id);
        let copyStr = selectedPids.join('\n');
        // eslint-disable-next-line no-undef
        GM_setClipboard(copyStr);
        vue2App.$message({
            type: 'success',
            message: '复制成功，粘贴即可，' + copyStr,
        });
    });

    let deleteBtn = btn.cloneNode(true);
    deleteBtn.textContent = '批量删除(支持删借出)';
    group.appendChild(deleteBtn);
    deleteBtn.addEventListener('click', () => {
        if (!vue2App.checkSelectProduct()) {
            return;
        }
        vue2App
            .$confirm('确认要删除商品吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
            .then(() => {
                let selectedProducts = vue2App.selectedProducts;
                let waitTime = 0;
                for (let i = 0; i < selectedProducts.length; i++) {
                    if (selectedProducts[i].enable_delete === 0) {
                        tryDeleteBorrowedProduct(vue2App, selectedProducts[i].p_id);
                        waitTime = 2000;
                    }
                }

                //延迟调用活动页删除
                setTimeout(() => {
                    vue2App
                        .ajax('post', '/mis/activity/batch-delete-product', {
                            ids: vue2App.selectedProducts.map((t) => t.id),
                        })
                        .then((res) => {
                            if (res.success) {
                                vue2App.$message({
                                    type: 'success',
                                    message: '删除成功',
                                });
                                vue2App.updateCardData();
                            } else {
                                vue2App.$message({
                                    type: 'error',
                                    message: res.message,
                                });
                            }
                        });
                }, waitTime);
            });
    });

    let clearCacheBtn;
    let tipStr = '(包括缓存)';
    let exportButton1 = btn.cloneNode(true);
    exportButton1.textContent = '批量导出' + tipStr + '(附1张图)';
    group.appendChild(exportButton1);
    exportButton1.addEventListener('click', async () => {
        await exportProducts2Excel(vue2App, 1);
        if (clearCacheBtn != null) clearCacheBtn.style.display = 'none';
    });
    // let exportButton = btn.cloneNode(true);
    // exportButton.textContent = '批量导出' + tipStr + '(附3张图)';
    // group.appendChild(exportButton);
    // exportButton.addEventListener('click', async () => {
    //     await exportProducts2Excel(vue2App, 3);
    //     if (clearCacheBtn != null) clearCacheBtn.style.display = 'none';
    // });
    // exportButton = btn.cloneNode(true);
    // exportButton.textContent = '批量导出' + tipStr + '(附所有图)';
    // group.appendChild(exportButton);
    // exportButton.addEventListener('click', async () => {
    //     await exportProducts2Excel(vue2App, 7);
    //     if (clearCacheBtn != null) clearCacheBtn.style.display = 'none';
    // });
    //活动页indexDB相关操作，处理缓存逻辑
    db = await openDB(dbName, dbVersion);
    console.log('openDB success:' + dbName);
    await deleteOldCachedProducts(productsCachedStoreName, 1000 * 60 * 60 * 24 * 30);

    clearCacheBtn = btn.cloneNode(true);
    clearCacheBtn.style.color = 'red';
    clearCacheBtn.style.background = 'yellow';

    var products = await cursorGetData(db, storeName);
    if (products?.length > 0) {
        console.log('当前缓存区:' + products.map((t) => t.p_id).join(','));
        clearCacheBtn.textContent = `清空缓存(总数:${products?.length})`;
        clearCacheBtn.style.display = 'inline-block';
    } else {
        clearCacheBtn.style.display = 'none';
    }
    group.insertBefore(clearCacheBtn, exportButton1);
    clearCacheBtn.addEventListener('click', async () => {
        vue2App
            .$confirm('确认要清空缓存吗?（一般不用手动清空，导出Excel后会自动清空）', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
            .then(async () => {
                await deleteDBStore(db, storeName);
                clearCacheBtn.style.display = 'none';
                vue2App.$message({
                    type: 'success',
                    message: '清空缓存成功',
                });
            });
    });

    let tempBtn = btn.cloneNode(true);
    tempBtn.textContent = '存入缓存';
    group.insertBefore(tempBtn, exportButton1);
    tempBtn.addEventListener('click', async () => {
        await deleteOldCachedProducts(storeName, 1000 * 60 * 60 * 24);
        if (!vue2App.checkSelectProduct()) {
            return;
        }
        await updateDBWithDatas(db, storeName, vue2App.selectedProducts);
        //获取缓存数据
        var products = await cursorGetData(db, storeName);
        if (products?.length > 0) {
            clearCacheBtn.textContent = `清空缓存(总数:${products?.length})`;
            clearCacheBtn.style.display = 'inline-block';
            console.log('存入缓存成功，当前缓存区:' + products.map((t) => t.p_id).join(','));
            vue2App.$message({
                type: 'success',
                message: `存入缓存成功,缓存总数:${products?.length},本次数量:${vue2App.selectedProducts?.length},本次详情:${vue2App.selectedProducts.map((t) => t.p_id).join(',')}`,
            });
        }
    });

    let lastProductsCount = 0;
    let needRequestPrice = false;
    let faSheBtnProcessed = false;
    let cachedProductsMap = {};
    let failCount = 0;
    //获取缓存数据
    var cacheProducts = await cursorGetData(db, productsCachedStoreName);
    for (let index = 0; index < cacheProducts?.length; index++) {
        let t = cacheProducts[index];
        cachedProductsMap[t.p_id] = t;
    }
    //定时执行，补充商品信息，因为可能通过搜索来刷新数据
    // eslint-disable-next-line no-constant-condition
    while (true) {
        if (document.visibilityState == 'hidden') {
            //当前页面不可见时不执行检查逻辑
            console.log('waiting for visibilityState is visible');
            await sleep(5000);
            continue;
        }
        if (vue2App == null || vue2App.cardData == null || vue2App.cardData.length <= 0) {
            console.log('waiting for cardData');
            lastProductsCount = 0;
            needRequestPrice = false;
            await sleep(1000);
            continue;
        }

        //发射按钮处理，发射按钮点击后也自动处理增加导入按钮(刷出来的晚，所以放在循环里),只处理一次
        if (!faSheBtnProcessed && group.childElementCount > 3) {
            Array.from(group.children).forEach((t) => {
                if (t.textContent == '发射') {
                    setInterval(() => {
                        processFaSheProducts(vue2App);
                    }, 2000);
                    t.style.background = 'green';
                    t.textContent = '发射或导入';
                    t.addEventListener('click', () => {
                        //自动搜索需要的活动页
                        vue2App.transmitForm.anchor_name = 1569406692;
                        vue2App.searchLaunchList();
                    });
                    faSheBtnProcessed = true;
                }
            });
        }

        //获取所有商品Elements
        let elements = document.getElementsByClassName('view-shop-content')[0].getElementsByClassName('el-checkbox');
        if (!needRequestPrice && (elements.length != vue2App.cardData.length || (elements.length == lastProductsCount && elements[0].childElementCount >= 3))) {
            console.log('没有需要获取价格的商品，并且数量没有变化,并且第一个商品是处理过的，不需要刷新，elements.length：' + elements.length);
            await sleep(5000);
            continue;
        }

        //获取没有进货价的商品列表，缓存中已有的则赋值过来并重算利润
        let noJinHuoPriceDatas = {};
        for (let i = 0; i < vue2App.cardData.length; i++) {
            let data = vue2App.cardData[i];
            if (data.jinHuoPrice == undefined || data.jinHuoPrice === 0) {
                if (data.p_id in cachedProductsMap) {
                    data.jinHuoPrice = cachedProductsMap[data.p_id].jinHuoPrice;
                }
                if (data.jinHuoPrice == undefined || data.jinHuoPrice === 0) {
                    noJinHuoPriceDatas[data.p_id] = data;
                    needRequestPrice = true;
                } else {
                    //更新一下利润，因为dy_sale_price可能有调整
                    data.liRun = parseInt(data.dy_sale_price) - data.jinHuoPrice;
                    processCachedProduct(cachedProductsMap[data.p_id], data);
                }
            }
        }

        lastProductsCount = elements.length;

        //处理每个Card的显示效果,只处理一遍，获取到新价格后直接刷新价格信息即可
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];
            if (element.childElementCount >= 3) {
                continue;
            }

            let data = vue2App.cardData[i];
            //取消平台自采的鼠标提示，影响勾选ID
            let tipEle = element.nextElementSibling.getElementsByClassName('el-tooltip')[0];
            let newTipEle = tipEle.cloneNode(true);
            tipEle.parentElement.insertBefore(newTipEle, tipEle);
            tipEle.remove();

            //借出状态
            let node = element.lastElementChild.cloneNode(false);
            node.innerHTML = '&ensp;&ensp;' + data.lend_status;
            element.appendChild(node);

            if (data.enable_delete == 0) {
                //没有删除按钮的添加删除按钮
                let btn = document.createElement('button');
                btn.textContent = '取消借出并删除';
                btn.className = 'el-button el-button--primary el-button--mini';
                btn.style.background = 'green';
                btn.style.color = 'white';
                element.parentElement.getElementsByClassName('el-row')[0].appendChild(btn);

                btn.addEventListener('click', () => {
                    vue2App
                        .$confirm('确认要删除商品吗?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                        })
                        .then(() => {
                            tryDeleteBorrowedProduct(vue2App, data.p_id);
                            //延迟调用活动页删除
                            setTimeout(() => {
                                vue2App
                                    .ajax('get', '/mis/activity/delete-product', {
                                        ids: [data.id],
                                    })
                                    .then((res) => {
                                        if (res.success) {
                                            vue2App.$message({
                                                type: 'success',
                                                message: '删除成功',
                                            });
                                            vue2App.updateCardData();
                                        } else {
                                            vue2App.$message({
                                                type: 'error',
                                                message: res.message,
                                            });
                                        }
                                    });
                            }, 2000);
                        });
                });
            }

            //补充额外价格等信息
            let tipParentEle = element.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling;
            let tipEles = tipParentEle.getElementsByClassName('el-tooltip');
            if (tipEles.length >= 9) {
                continue;
            }
            let douyinPriceEle = tipEles[0];
            let shiChangPriceEle = tipEles[1];
            let xiaChiEle = tipEles[3];
            douyinPriceEle.style.color = 'red';
            douyinPriceEle.textContent = douyinPriceEle.textContent.replace('.00', '');

            let jinHuoPriceEle = tipParentEle.lastChild.cloneNode(true);
            jinHuoPriceEle.style.color = 'darkred';
            tipParentEle.insertBefore(jinHuoPriceEle, shiChangPriceEle);
            if (data.jinHuoPrice != undefined && data.jinHuoPrice > 0) {
                jinHuoPriceEle.textContent = '进货价:' + data.jinHuoPrice;
            } else {
                jinHuoPriceEle.textContent = '进货价:正在获取...';
                if (noJinHuoPriceDatas[data.p_id] != null) {
                    //把价格对应的Ele存到数据上，方便价格获取到之后直接刷价格
                    noJinHuoPriceDatas[data.p_id].jinHuoPriceEle = jinHuoPriceEle;
                }
            }

            let liRunEle = tipParentEle.lastChild.cloneNode(true);
            liRunEle.style.color = 'red';
            tipParentEle.insertBefore(liRunEle, shiChangPriceEle);
            if (data.liRun != undefined) {
                liRunEle.textContent = '利润:' + data.liRun;
            } else {
                liRunEle.textContent = '利润:正在获取...';
                if (noJinHuoPriceDatas[data.p_id] != null) {
                    noJinHuoPriceDatas[data.p_id].liRunEle = liRunEle;
                }
            }

            let ppd_outer_lowest_price = tipParentEle.lastChild.cloneNode(true);
            ppd_outer_lowest_price.textContent = '最低销售价:' + data.ppd_outer_lowest_price;
            tipParentEle.insertBefore(ppd_outer_lowest_price, shiChangPriceEle);
            let wms_sp_shelf_code = tipParentEle.lastChild.cloneNode(true);
            wms_sp_shelf_code.innerHTML = '库位:' + data.wms_w_name + '<br>&ensp;&ensp;&ensp;&ensp;&ensp;' + data.wms_sp_shelf_code;
            wms_sp_shelf_code.style.color = 'green';
            tipParentEle.insertBefore(wms_sp_shelf_code, xiaChiEle);

            let p_onsale_time = tipParentEle.lastChild.cloneNode(true);
            p_onsale_time.innerHTML = '首次在售时间:<br>' + data.p_onsale_time;
            p_onsale_time.style.color = 'green';
            tipParentEle.insertBefore(p_onsale_time, xiaChiEle);
        }

        if (!needRequestPrice) {
            console.log('都有价格，不需要获取价格，等待一会再刷新检测是否有新的商品需要处理（可能搜索了）');
            await sleep(3000);
            continue;
        }

        //没有价格信息的去请求，下次循环会刷上
        {
            vue2App.$message({
                type: 'warning',
                message: '有商品需要请求价格详情，稍等片刻显示,数量:' + Object.keys(noJinHuoPriceDatas).length,
                duration: 10,
            });
            let msg = await getJinHuoPrices(noJinHuoPriceDatas);

            if (msg.includes('频繁')) {
                failCount += 1;
                let tipMsg = `提示请求频繁，${failCount * 10}分钟之后再请求价格信息:${msg}`;
                console.log(tipMsg);
                vue2App.$message({
                    type: 'error',
                    message: tipMsg,
                });
                await sleep(600000 * failCount);
            } else {
                let tipMsg = '请求价格详情，结果:' + msg;
                console.log(tipMsg);
                vue2App.$message({
                    type: 'success',
                    message: tipMsg,
                });
                needRequestPrice = false;
                //获取到价格后缓存下来，并直接进行下次循环
                for (let p_id in noJinHuoPriceDatas) {
                    let data = noJinHuoPriceDatas[p_id];
                    try {
                        if (data?.jinHuoPrice > 0) {
                            data.jinHuoPriceEle.textContent = '进货价:' + data.jinHuoPrice;
                            data.jinHuoPriceEle = null;
                            data.liRunEle.textContent = '利润:' + data.liRun;
                            data.liRunEle = null;
                            if (p_id in cachedProductsMap) {
                                processCachedProduct(cachedProductsMap[data.p_id], data);
                            } else {
                                updateDB(db, productsCachedStoreName, data);
                                cachedProductsMap[data.p_id] = data;
                            }
                        } else {
                            //有时候商品会再次变为编辑中，商品页刷不到编辑中和售出的，无法获取对应价格
                            needRequestPrice = true;
                            console.log(p_id + '没有获取到进货价：' + data?.jinHuoPrice);
                        }
                    } catch (error) {
                        needRequestPrice = true;
                        console.log(error);
                    }
                }
                if (needRequestPrice) {
                    failCount += 1;
                    tipMsg = `请求失败，还有价格没获取成功，${failCount * failCount}分钟之后再请求价格信息:${msg}`;
                    console.log(tipMsg);
                    vue2App.$message({
                        type: 'error',
                        message: tipMsg,
                    });
                    await sleep(60000 * failCount * failCount);
                } else {
                    failCount = 0;
                }
            }
        }
    }
}

/**
 * 处理商品刷新页
 */
async function processProductEditorIndex() {
    let vue2App = document.getElementById('vue2-app').__vue__;
    vue2App.searchForm.freemask_button = 1;
    try {
        setInterval(async () => {
            if (document.visibilityState == 'hidden') {
                //当前页面不可见时不执行检查逻辑
                console.log('waiting for visibilityState is visible');
                return;
            }
            processAllProducts(vue2App);
            vue2App.searchForm.freemask_button = 1; //设置不加密参数，每次搜索完会默认置为加密，这里再改回来
        }, 2000);
    } catch (error) {
        console.log(error);
    }

    let templateBtn = document.getElementsByClassName('el-button el-tooltip el-button--primary el-button--medium')[0];
    let group = templateBtn?.parentElement;
    if (group != null) {
        templateBtn = templateBtn.cloneNode(true);
        templateBtn.textContent = '批量复制ID';
        templateBtn.style.background = 'green';
        group.appendChild(templateBtn);
        templateBtn.addEventListener('click', () => {
            if (!checkProductEditorSelectProduct(vue2App)) {
                return;
            }
            // eslint-disable-next-line no-undef
            GM_setClipboard(vue2App.multipleSelection.replaceAll(',', '\n'));
            ToastProductEditorMsg(vue2App, '复制成功，粘贴即可:' + vue2App.multipleSelection, 'success', 3000);
        });

        db = await openDB(dbName, dbVersion);
        console.log('openDB success:' + dbName);
        await deleteOldCachedProducts(productEditorStoreName, 1000 * 60 * 60 * 24 * 30);
        var products = await cursorGetData(db, productEditorStoreName);
        let clearCacheBtn = templateBtn.cloneNode(true);
        clearCacheBtn.style.color = 'red';
        clearCacheBtn.style.background = 'yellow';
        if (products?.length > 0) {
            console.log('当前缓存区:' + products.map((t) => t.productId).join(','));
            clearCacheBtn.textContent = `清空缓存(总数:${products?.length})`;
            clearCacheBtn.style.display = 'inline-block';
        } else {
            clearCacheBtn.style.display = 'none';
        }
        group.appendChild(clearCacheBtn);
        clearCacheBtn.addEventListener('click', async () => {
            vue2App
                .$confirm('确认要清空缓存吗?（一般不用手动清空，导出Excel后会自动清空）', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                .then(async () => {
                    await deleteDBStore(db, productEditorStoreName);
                    clearCacheBtn.style.display = 'none';
                    ToastProductEditorMsg(vue2App, '清空缓存成功', 'success', 2000);
                });
        });

        let tempBtn = templateBtn.cloneNode(true);
        tempBtn.textContent = '存入缓存';
        group.appendChild(tempBtn);
        tempBtn.addEventListener('click', async () => {
            await deleteOldCachedProducts(productEditorStoreName, 1000 * 60 * 60 * 24);
            if (!checkProductEditorSelectProduct(vue2App)) {
                return;
            }
            await updateDBWithDatas(db, productEditorStoreName, vue2App.multipleSelectionData);
            //获取缓存数据
            var products = await cursorGetData(db, productEditorStoreName);
            if (products?.length > 0) {
                clearCacheBtn.textContent = `清空缓存(总数:${products?.length})`;
                clearCacheBtn.style.display = 'inline-block';
                console.log('存入缓存成功，当前缓存区:' + products.map((t) => t.productId).join(','));
                ToastProductEditorMsg(vue2App, `存入缓存成功,缓存总数:${products?.length},本次数量:${vue2App.multipleSelectionData?.length},本次详情:${vue2App.multipleSelection}`, 'success', 3000);
            }
        });

        let tipStr = '(包括缓存)';
        let exportButton1 = templateBtn.cloneNode(true);
        exportButton1.textContent = '批量导出' + tipStr + '(附1张图)';
        group.appendChild(exportButton1);
        exportButton1.addEventListener('click', async () => {
            await exportProducts2Excel(vue2App, 1, true);
            clearCacheBtn.style.display = 'none';
        });
    }
}

function checkProductEditorSelectProduct(vue2App) {
    if (vue2App.multipleSelection === '') {
        ToastProductEditorMsg(vue2App, '请先选择商品', 'warning');
        return false;
    }
    return true;
}

function ToastProductEditorMsg(vue2App, message, type, duration = 5000) {
    vue2App.$message({
        message: message,
        type: type,
        duration: duration,
    });
}

const formData = new FormData();
formData.append('group_id', 0);
formData.append('is_new', 1);
async function processFaSheProducts(vue2App) {
    try {
        let flagEles = document.getElementsByClassName('el-form demo-form-inline el-form--inline');
        if (flagEles == null || flagEles.length == 0) {
            return;
        }
        if (!(flagEles[0].childElementCount > 3 && flagEles[0].children[2].textContent.includes('直播间名称'))) {
            return; //商品详情页的结构也差不多，会触发下面的逻辑，所以这里再过滤一下
        }
        let ele = document.getElementsByClassName('el-table modal-form-table el-table--fit el-table--enable-row-hover el-table--enable-row-transition');
        if (ele == null || ele.length == 0) {
            return;
        }
        let rowEles = ele[0].getElementsByClassName('el-table__row');
        if (rowEles == null || rowEles.length == 0) {
            return;
        }

        let excelRaw = await exportProducts2ExcelRaw(vue2App);
        if (excelRaw == undefined) {
            return;
        }
        formData.set('file', excelRaw, 'exports.xlsx');
        Array.from(rowEles).forEach((rowEle) => {
            let btnParent = rowEle.firstChild.firstChild;
            if (btnParent.childElementCount >= 2) {
                return;
            }
            btnParent.style.display = 'inline';
            let btn = btnParent.firstChild;
            let aid = btnParent.parentElement.nextElementSibling.nextElementSibling.textContent;
            try {
                if (aid != '80650') {
                    //隐藏掉较早的活动页(除了80650这个特殊的占货页)
                    let startTimeStr = btnParent.parentElement.parentElement.children[8].textContent;
                    if (new Date(startTimeStr).getFullYear() < 2024) {
                        btnParent.parentElement.parentElement.style.display = 'none';
                    }
                }
            } catch (error) {
                console.log(error);
            }
            btn.style.outline = 'auto';
            let importBtn = btn.cloneNode(true);
            importBtn.textContent = '导入';
            importBtn.style.background = 'green';
            btnParent.appendChild(importBtn);
            importBtn.addEventListener('click', () => {
                formData.set('id', aid);
                // eslint-disable-next-line no-undef
                $.ajax({
                    type: 'post',
                    url: '/mis/activity/new-import-excel',
                    // contentType: "multipart/form-data",
                    cache: false, //上传文件无需缓存
                    processData: false, //用于对data参数进行序列化处理 这里必须false
                    contentType: false, //必须
                    data: formData,
                    success(result) {
                        if (result.code === 0) {
                            vue2App.$message({
                                type: 'success',
                                message: '导入成功! 2秒后自动打开目标活动页:' + aid,
                            });
                            setTimeout(() => {
                                window.open('https://mis.aplum.com/mis/activity-new/view-douyin-live?id=' + aid);
                            }, 2000);
                        } else {
                            vue2App.$message({
                                type: 'error',
                                message: result.msg,
                            });
                        }
                    },
                    error(xhr) {
                        vue2App.$message({
                            type: 'error',
                            message: xhr.statusText,
                        });
                    },
                });
            });
        });
    } catch (error) {
        console.log(error);
    }
}

async function exportProducts2ExcelRaw(vue2App) {
    try {
        let selectedProducts = vue2App.selectedProducts;
        if (selectedProducts == null || selectedProducts.length <= 0) {
            return;
        }
        // eslint-disable-next-line no-undef
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('sheet1');
        worksheet.columns = [{ header: 'id', key: 'id' }];

        for (let index = 0; index < selectedProducts.length; index++) {
            worksheet.addRow([selectedProducts[index].p_id]);
        }
        const buffer = await workbook.xlsx.writeBuffer();
        return new Blob([buffer], {
            type: 'application/octet-stream',
        });
    } catch (error) {
        console.log(error);
    }
}

async function addProductsToWorksheet(workbook, worksheet, vue2App, isProductEditor, products, imageStartIndex, imageCount) {
    try {
        let cachedProductsMap = {};
        if (imageCount > 0) {
            //获取缓存数据
            var cachedProducts;
            if (!isProductEditor) {
                //活动页里的商品有缓存，商品刷新页无缓存
                cachedProducts = await cursorGetData(db, productsCachedStoreName);
                for (let index = 0; index < cachedProducts?.length; index++) {
                    let t = cachedProducts[index];
                    if ('photo_base64s' in t) {
                        cachedProductsMap[t.p_id] = t;
                    }
                }
            }
        }

        for (let index = 0; index < products.length; index++) {
            let t = products[index];
            let pUrl = 'https://mis.aplum.com/mis/product/view?id=' + t.p_id ?? t.productId;
            worksheet.addRow([
                {
                    text: t.p_id ?? t.productId,
                    hyperlink: pUrl,
                    tooltip: pUrl,
                },
                ' ', //主图
                t.warehouseInfo ?? t.wms_sp_shelf_code ?? '', //暂时不要地点名，只要编号t.wms_w_name + ' '
                // t.brand_name ? t.brand_name + '-' + t.p_name : t.brandName + '-' + t.productName,
                Math.floor(t.dy_sale_price ?? '未获取'),
                t.jinHuoPrice ?? '未获取',
                t.liRun ?? '未获取',
                // t.lend_status ?? t.statusText,
                // t.p_onsale_time ?? t.onSaleTime?.replaceAll('<br>', ' '),
            ]);

            if (imageCount <= 0) {
                continue;
            }
            let photoUrls = t.p_photo_urls ?? [t.photoUrl];
            if (photoUrls.length < imageCount) {
                imageCount = photoUrls.length;
            }

            if (photoUrls.length >= 7) {
                // 第七张图片是带全套主图，需要交换一下位置
                let tempUrl = photoUrls[1];
                photoUrls[1] = photoUrls[6];
                photoUrls[6] = tempUrl;
            }

            let photo_base64s = t.photo_base64s;
            if (photo_base64s == null && t.p_id in cachedProductsMap) {
                photo_base64s = cachedProductsMap[t.p_id].photo_base64s;
            }
            if (photo_base64s == null) {
                photo_base64s = [];
            }
            for (let index2 = 0; index2 < imageCount; index2++) {
                let row = index + 1;
                let column = index2 + imageStartIndex;
                let base64Data;
                if (photo_base64s.length > index2) {
                    base64Data = photo_base64s[index2];
                }
                if (base64Data == undefined) {
                    vue2App.$message({
                        type: 'success',
                        message: '正在下载:第(' + (index + 1) + '/' + products.length + ')个商品的(' + (index2 + 1) + '/' + imageCount + ')张图片',
                    });
                    let url = photoUrls[index2] + '?imageMogr2/thumbnail/200'; //缩放一下，否则太大了
                    base64Data = await imageToBase64(url);
                    if (!base64Data.includes('失败')) {
                        photo_base64s[index2] = base64Data;
                    } else {
                        console.log('图片下载失败:' + url);
                    }
                }
                if (base64Data != null && typeof base64Data === 'string' && base64Data.includes(',')) {
                    let imageId = workbook.addImage({
                        base64: base64Data,
                        extension: 'png',
                    });
                    worksheet.addImage(imageId, {
                        tl: { col: column, row: row },
                        br: { col: column + 1, row: row + 1 },
                        // ext: { width: 100, height: 100},
                        editAs: 'undefined',
                    });
                }
            }
            if (photo_base64s.length > 0) {
                t.photo_base64s = photo_base64s;
            }
        }
        if (!isProductEditor) {
            await updateDBWithDatas(db, productsCachedStoreName, products);
        }
    } catch (error) {
        console.log(error);
    }
}

//导出商品信息到Excel，可以控制导出图片数量，数量越多导出越慢
async function exportProducts2Excel(vue2App, imageCount, isProductEditor = false) {
    let allProducts = [];
    let cacheStoreName = isProductEditor ? productEditorStoreName : storeName;
    var products = await cursorGetData(db, cacheStoreName);
    let allPids = [];
    for (let index = 0; index < products?.length; index++) {
        let t = products[index];
        if (allPids.includes(t.p_id)) {
            continue;
        }
        allPids.push(t.p_id ?? t.productId);
        allProducts.push(t);
    }

    let selections = vue2App.selectedProducts ?? vue2App.multipleSelectionData;
    for (let index = 0; index < selections?.length; index++) {
        let t = selections[index];
        if (allPids.includes(t.p_id ?? t.productId)) {
            continue;
        }
        allPids.push(t.p_id ?? t.productId);
        allProducts.push(t);
    }

    if (allProducts.length <= 0) {
        vue2App.$message({
            type: 'warn',
            message: '缓存中没有商品，请至少选择1个商品，才能导出',
        });
        return;
    }

    let excelFileName = getExcelFileName(isProductEditor);
    vue2App.$message({
        type: 'success',
        message: '开始导出Excel文件:' + excelFileName + ',' + allPids.join(','),
    });

    // eslint-disable-next-line no-undef
    const workbook = new ExcelJS.Workbook();
    // 创建一个冻结了第一行和第一列的工作表
    const worksheet = workbook.addWorksheet('sheet1', { views: [{ state: 'frozen', xSplit: 1, ySplit: 1 }] });
    worksheet.properties.defaultRowHeight = 100;
    worksheet.pageSetup.horizontalCentered = true;
    worksheet.pageSetup.verticalCentered = true;

    let columnStyle = {
        alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
        border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
    };
    let redCorlorStyle = {
        alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFDE9D9' } },
        border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
    };
    let greenCorlorStyle = {
        alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEBF1DE' } },
        border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
    };
    let imageCorlorStyle = {
        alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
        border: { top: { style: 'thin' }, left: { style: 'thick', color: { argb: 'FF00FF00' } }, bottom: { style: 'thin' }, right: { style: 'thick', color: { argb: 'FF00FF00' } } },
    };
    let columns = [
        { header: 'id', key: 'id', width: 9, style: columnStyle },
        // { header: 'brand-name', key: 'brand-name', width: 15, style: columnStyle },
        { header: '库位', key: 'wms_sp_shelf_code', width: 13, style: columnStyle },
        { header: '抖价', key: 'dy_sale_price', width: 8, style: redCorlorStyle }, //p_discount_price 折扣价目前无权限获取
        { header: '进价', key: 'jinHuoPrice', width: 8, style: columnStyle },
        { header: '利润', key: 'liRun', width: 6, style: greenCorlorStyle },
        // { header: '最低价', key: 'ppd_outer_lowest_price', width: 8, style: columnStyle },
        // { header: isProductEditor ? '状态' : '借出状态', key: isProductEditor ? 'statusText' : 'lend_status', width: 6, style: columnStyle },
        // { header: '首次在售时间', key: 'p_onsale_time', width: 12, style: columnStyle },
    ];
    let imageStartIndex = columns.length;

    if (imageCount == 1) {
        //只有一个图的时候，图放到第二列
        columns.splice(1, 0, { header: '图1', key: 'image1', width: 16, style: imageCorlorStyle });
        imageStartIndex = 1;
    } else {
        //多图的时候，图放在最后几列
        for (let i = 1; i <= imageCount; i++) {
            if (i == 2) {
                columns.push({ header: '图' + i + '(全套图)', key: 'image' + i, width: 20, style: greenCorlorStyle });
            } else {
                columns.push({ header: '图' + i, key: 'image' + i, width: 20, style: greenCorlorStyle });
            }
        }
    }
    worksheet.columns = columns;

    await addProductsToWorksheet(workbook, worksheet, vue2App, isProductEditor, allProducts, imageStartIndex, imageCount);
    // worksheet.getRow(1).height=10
    const buffer = await workbook.xlsx.writeBuffer();

    let blob = new Blob([buffer], {
        type: 'application/octet-stream',
    });

    window.saveAs(blob, excelFileName);
    vue2App.$message({
        type: 'success',
        message: '导出Excel文件成功,自动清空缓存:' + excelFileName,
    });
    deleteDBStore(db, cacheStoreName);
}

// 图片转base64
function imageToBase64(url) {
    return new Promise((resolve) => {
        const image = new Image();
        // 先设置图片跨域属性
        image.crossOrigin = 'Anonymous';
        // 再给image赋值src属性，先后顺序不能颠倒
        image.src = url;
        image.onload = function () {
            const canvas = document.createElement('CANVAS');
            // 设置canvas宽高等于图片实际宽高
            canvas.width = image.width;
            canvas.height = image.height;
            canvas.getContext('2d').drawImage(image, 0, 0);
            // toDataUrl可以接收2个参数，参数一：图片类型，参数二： 图片质量0-1（不传默认为0.92）
            const dataURL = canvas.toDataURL('image/png');
            resolve(dataURL);
        };
        image.onerror = () => {
            resolve('相片处理失败');
        };
    });
}

function Toast(msg, duration) {
    try {
        duration = isNaN(duration) ? 5000 : duration;
        var m = document.createElement('div');
        m.innerHTML = msg;
        m.style.cssText =
            'word-wrap:break-word;max-width:80%;min-width: 150px;padding:0 14px;min-height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 9999999999;background: rgba(0, 0, 0,.7);font-size: 16px;';
        document.body.appendChild(m);
        setTimeout(function () {
            var d = 0.5;
            m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
            m.style.opacity = '0';
            setTimeout(function () {
                document.body.removeChild(m);
            }, d * 1000);
        }, duration);
    } catch (error) {
        console.log(error);
    }
}

function processAllProducts(vue2App) {
    try {
        let rows = document.getElementsByClassName('el-table__body-wrapper')[0].getElementsByClassName('el-table_1_column_6 is-left');
        if (rows.length <= 0) {
            return;
        }
        for (let i = 0; i < rows.length; i++) {
            let priceEles = rows[i].getElementsByClassName('text-danger');
            //通过父节点来判断，因为有个别商品第二个初始价那里class是空，只能查到一个text-danger
            priceEles = priceEles[0].parentElement.getElementsByTagName('span');
            if (priceEles.length == 2) {
                if (priceEles[0].textContent.includes('****')) {
                    tryClickPriceEle(priceEles[0]);
                } else {
                    let parentEle = priceEles[0].parentElement;
                    let jinHuoPrice = parseInt(parentEle.textContent.match(/进货价：(\d+)/)[1]);
                    //去掉两行无用信息，否则加了两行信息导致排版错位
                    parentEle.innerHTML = parentEle.innerHTML.replace(/<br>智能定价当前到手价.*<br>/, '<br>');
                    parentEle.innerHTML = parentEle.innerHTML.replace(/<br>进货价[^<]*/, '');

                    // let prefix = '<br>';
                    // if (parentEle.previousElementSibling.textContent.includes('已确认-智能定价')) {
                    //     prefix = '';
                    // }
                    priceEles[0].innerHTML = priceEles[0].innerHTML.replace('.00', '&nbsp&nbsp&nbsp&nbsp'); //.replace('抖音', prefix + '抖音');

                    let douyinPrice = parseInt(priceEles[0].textContent.match(/(\d+)/)[1]);
                    vue2App.tableData[i].dy_sale_price = douyinPrice;
                    if (douyinPrice >= 0 && jinHuoPrice >= 0) {
                        priceEles[1].style.color = 'black';
                        let liRun = douyinPrice - jinHuoPrice;
                        let liRunEle = priceEles[0].cloneNode(true);
                        liRunEle.style.color = 'red';
                        liRunEle.innerHTML = `利润：${liRun}<br><br>`;
                        parentEle.insertBefore(liRunEle, priceEles[1]);
                        vue2App.tableData[i].liRun = liRun;

                        let jinHuoEle = priceEles[0].cloneNode(true);
                        jinHuoEle.style.color = 'darkred';
                        jinHuoEle.innerHTML = `进货价：${jinHuoPrice}<br>`;
                        parentEle.insertBefore(jinHuoEle, liRunEle);
                        vue2App.tableData[i].jinHuoPrice = jinHuoPrice;
                    }
                }
            }
            let sellerEle = rows[i].parentElement.getElementsByClassName('el-button el-button--text')[1];
            tryClickPriceEle(sellerEle);
        }
    } catch (error) {
        console.log(error);
    }
}

function getExcelFileName(isProductEditor) {
    try {
        if (isProductEditor) {
            return 'Products_' + getCurrentTimeFormatted() + '.xlsx';
        }
        let id = document.URL.match(/\bid=(\d+)/)[1];
        let activityName = document.getElementsByClassName('el-descriptions-row')[2].lastChild.textContent;
        return id + '_' + activityName + '_' + getCurrentTimeFormatted() + '.xlsx';
    } catch (error) {
        console.log(error);
        return getCurrentTimeFormatted() + '.xlsx';
    }
}

function getCurrentTimeFormatted() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

async function processBorrowTip() {
    try {
        let times = 0;
        while (times <= 10) {
            console.log('waiting for borrow tip visible');
            await sleep(1000);
            //关闭按钮在iframe的父窗口上
            var sNum = window.parent.$('#global-modal-div').find('span').text();
            if (sNum > 0) {
                //检测到借出提示，就把倒计时设置到结束
                window.parent.$('#global-modal-div').find('span').text(0);
                return;
            }
            // let tipTextEle = window.parent.document.getElementById('global-modal-div')?.getElementsByTagName('span')[0];
            // if (tipTextEle != null) {
            //     tipTextEle.textContent = 1;
            //     return;
            // }
            times++;
        }
    } catch (error) {
        // console.log(error)
    }
}

async function checkEnable() {
    try {
        let name = getCookie('http_login_name');
        if (name === null || name.length <= 0) {
            return false;
        }
        let users = await getUsers();
        if (users == null) {
            return name.includes('tangtianyu') || name.includes('zhangruqi') || name.includes('lijiale');
        }
        for (let i = 0; i < users.length; i++) {
            if (name.includes(users[i].username)) {
                return users[i].enable;
            }
        }
        return false;
    } catch (error) {
        console.log(error);
    }
    return true;
}

let searchForm = {
    pageIndex: 1,
    pageSize: 20,
    brand_id: '',
    series_id: '',
    guide_product_id: '',
    creator: '',
    user_id: '',
    category_id: '',
    id: '',
    name: '',
    features: '',
    storage: '',
    customer_type: '',
    // hasNoRemark: 0,
    is_out_product: '',
    hasShelf: '',
    seller_confirm: '',
    is_live_single: '',
    borrowed: '',
    has_feature: '',
    dispatch_type: '',
    treatment: '',
    cooperate_type: '',
    adjust_type: '',
    status: [],
    condition_level: '',
    provider: '',
    photo_status_by_auditor: '',
    current_discount_rate_from: '',
    current_discount_rate_to: '',
    price_from: '',
    price_to: '',
    discount_price_from: '',
    discount_price_to: '',
    discount_rate_from: '',
    discount_rate_to: '',
    discount_sale_from: '',
    discount_sale_to: '',
    purchase_price_from: '',
    purchase_price_to: '',
    discount_capacity_from: '',
    discount_capacity_to: '',
    c_s_from: '',
    c_s_to: '',
    create_time_from: '',
    create_time_to: '',
    onsale_time_from: '',
    onsale_time_to: '',
    sold_time_from: '',
    sold_time_to: '',
    settle_time_from: '',
    settle_time_to: '',
    rephoto_time_from: '',
    rephoto_time_to: '',
    photo_taker: '',
    sortCreateTime: 'noSort',
    onSaleTime: 'noSort',
    sortFirst: '',
    area_ids: [],
    productModel: '',
    freemask_button: 1,
};
function getJinHuoPrices(noJinHuoPriceDatas) {
    if (noJinHuoPriceDatas == null) {
        return 'noJinHuoPriceDatas is null';
    }
    let keys = Object.keys(noJinHuoPriceDatas);
    if (keys.length <= 0) {
        return 'noJinHuoPriceDatas count is 0';
    }
    searchForm.id = keys.join(',');
    console.log('getJinHuoPrices:' + searchForm.id);
    searchForm.pageSize = keys.length;
    return new Promise((resolve) => {
        try {
            // eslint-disable-next-line no-undef
            $.get('https://mis.aplum.com/mis/apis/product-editor-api/index', searchForm, (res) => {
                if (res.code === 0) {
                    let tableData = res.data.list;
                    if (tableData == null || tableData.length <= 0) {
                        console.log('fail');
                    } else {
                        tableData.forEach((data) => {
                            try {
                                let noJinHuoPriceData = noJinHuoPriceDatas[data.productId];
                                if (noJinHuoPriceData != null) {
                                    noJinHuoPriceData.jinHuoPrice = parseInt(data.productPrice.match(/进货价：(\d+)/)[1]);
                                    noJinHuoPriceData.liRun = parseInt(noJinHuoPriceData.dy_sale_price) - noJinHuoPriceData.jinHuoPrice;
                                }
                            } catch (error) {
                                console.log(error);
                            }
                        });
                    }
                }
                resolve(res.msg);
            });
        } catch (error) {
            resolve(error);
        }
    });
}

function tryDeleteBorrowedProduct(vue2App, pid) {
    try {
        // eslint-disable-next-line no-undef
        $.ajax({
            url:
                '/mis/borrow-ticket/detail-list?TBorrowTicketProductSearch%5Bborrow_ticket_id%5D=&TBorrowTicketProductSearch%5Bop_id%5D=&TBorrowTicketProductSearch%5Bcategory%5D=&TBorrowTicketProductSearch%5Bexpress_type%5D=&TBorrowTicketProductSearch%5Bproduct_id%5D=' +
                pid +
                '&TBorrowTicketProductSearch%5Bcreate_time_start%5D=&TBorrowTicketProductSearch%5Bcreate_time_end%5D=&TBorrowTicketProductSearch%5Bremark%5D=&TBorrowTicketProductSearch%5Bproduct_status%5D=&TBorrowTicketProductSearch%5Bticket_status%5D=&TBorrowTicketProductSearch%5Bblogger_nickname%5D=&TBorrowTicketProductSearch%5Bmulti_status%5D=',
            type: 'get',
            // data: {"TBorrowTicketProductSearch[product_id]": 13043549},
            success(result) {
                var parser = new DOMParser();
                var doc = parser.parseFromString(result, 'text/html');
                let borrowid = doc.getElementsByClassName('table table-striped table-bordered')[0].querySelector('tbody > tr').getAttribute('data-key');
                if (borrowid === null) {
                    console.log('tryDeleteBorrowedProduct can not find borrowid,pid =' + pid);
                    return;
                } else {
                    console.log('tryDeleteBorrowedProduct borrowid =' + borrowid);
                }
                // eslint-disable-next-line no-undef
                $.ajax({
                    url: '/mis/borrow-ticket/delete-product-new',
                    type: 'post',
                    data: { id: borrowid },

                    success(result) {
                        console.log(result.msg);
                        if (result.code != 0) {
                            vue2App.$message({
                                type: 'success',
                                message: result.msg,
                            });
                        }
                    },
                    error(xhr) {
                        console.log(xhr.statusText);
                        vue2App.$message({
                            type: 'error',
                            message: xhr.statusText,
                        });
                    },
                });
            },
            error(xhr) {
                console.log(xhr);
                vue2App.$message({
                    type: 'error',
                    message: xhr.statusText,
                });
            },
        });
    } catch (error) {
        console.log(error);
    }
}

function tryClickPriceEle(ele) {
    try {
        if (ele == null) {
            return;
        }
        if (!ele.textContent.includes('****')) {
            return;
        }
        ele.click();
    } catch (error) {
        console.log(error);
    }
}

function getCookie(name) {
    let cookies = document.cookie.split('; ');

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        let [cookieName, value] = cookie.split('=');

        if (cookieName === name) {
            return value;
        }
    }

    return null; //如果没有找到指定的 cookie，返回 null
}

// 监听元素, 找到后执行回调
// eslint-disable-next-line no-unused-vars
function waitForElement(classNameOrId, callback, interval = 1000) {
    var lastInvocation = 0;
    function checkForElement() {
        var now = Date.now();
        if (now - lastInvocation > interval) {
            var element = document.querySelector(classNameOrId);
            if (element) {
                console.log(`🟢找到 "${classNameOrId}" 的元素`);
                callback(element);
            } else {
                console.log(`🔴未找到 "${classNameOrId}" 的元素`);
                lastInvocation = now;
                requestAnimationFrame(checkForElement);
            }
        } else {
            requestAnimationFrame(checkForElement);
        }
    }
    checkForElement();
}

//异步等待元素的Visibility变为指定值
// eslint-disable-next-line no-unused-vars
async function waitForElementVisibility(element, timeoutInSeconds, visibility) {
    if (element === null) {
        return true;
    }
    for (let index = 0; index < timeoutInSeconds; index++) {
        await new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });
        console.log('waitForSelectorVisibility index:' + index);
        if (element.checkVisibility() === visibility) {
            return true;
        }
    }
    return false;
}

//异步等待元素出现
// eslint-disable-next-line no-unused-vars
async function waitForSelector(selector, timeoutInSeconds) {
    for (let index = 0; index < timeoutInSeconds; index++) {
        await new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });
        console.log('waitForSelector index:' + index);
        if (document.querySelector(selector) !== null) {
            return true;
        }
    }
    return false;
}

//数据库indexedDB相关操作封装
async function deleteOldCachedProducts(storeName, cacheMilliSeconds) {
    try {
        var products = await cursorGetData(db, storeName);
        let deletePids = [];
        let expireTimeStamp = new Date().getTime() - cacheMilliSeconds;
        for (let index = 0; index < products?.length; index++) {
            let t = products[index];
            if ('cacheTimeStamp' in t && expireTimeStamp > t['cacheTimeStamp']) {
                deletePids.push(t.p_id);
            }
        }
        deletePids.forEach((pid) => {
            deleteDB(db, storeName, pid);
        });
    } catch (error) {
        console.log(error);
    }
}

function processCachedProduct(cachedProduct, product) {
    if (cachedProduct.liRun != product.liRun) {
        cachedProduct.dy_sale_price = product.dy_sale_price;
        cachedProduct.liRun = product.liRun;
        cachedProduct.jinHuoPrice = product.jinHuoPrice;
        //还用该对象去更新，因为里面可能存储的有图片base64，不能直接用data
        updateDB(db, productsCachedStoreName, cachedProduct);
    }
}

/**
 * 封装的方法以及用法
 * 打开数据库
 */
function openDB(dbName, version = 1) {
    return new Promise((resolve, reject) => {
        let indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
        if (!indexedDB) {
            console.log('你的浏览器不支持IndexedDB');
            resolve(null);
        }
        let db;
        const request = indexedDB.open(dbName, version);
        request.onsuccess = function (event) {
            db = event.target.result; // 数据库对象
            resolve(db);
        };

        request.onerror = function (event) {
            reject(event);
        };

        request.onblocked = function () {
            alert('脚本更新了，请先关闭掉所有之前打开的旧页面，然后才能正常使用最新功能');
        };

        request.onupgradeneeded = function (event) {
            // 数据库创建或升级的时候会触发
            console.log('onupgradeneeded');
            db = event.target.result; // 数据库对象

            //升级时删掉旧表
            const objectStoreNames = db.objectStoreNames;
            Array.from(objectStoreNames).forEach((storeName) => {
                db.deleteObjectStore(storeName);
            });

            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: 'p_id' }); // 创建表
            }
            if (!db.objectStoreNames.contains(productsCachedStoreName)) {
                db.createObjectStore(productsCachedStoreName, { keyPath: 'p_id' }); // 创建表
            }
            if (!db.objectStoreNames.contains(productEditorStoreName)) {
                db.createObjectStore(productEditorStoreName, { keyPath: 'productId' }); // 创建表
            }
        };
    });
}

/**
 * 新增数据
 */
// eslint-disable-next-line no-unused-vars
function addData(db, storeName, data) {
    return new Promise((resolve, reject) => {
        let request = db
            .transaction([storeName], 'readwrite') // 事务对象 指定表格名称和操作模式（"只读"或"读写"）
            .objectStore(storeName) // 仓库对象
            .add(data);

        request.onsuccess = function (event) {
            resolve(event);
        };

        request.onerror = function (event) {
            // throw new Error(event.target.error)
            reject(event);
        };
    });
}

/**
 * 通过主键读取数据
 */
// eslint-disable-next-line no-unused-vars
function getDataByKey(db, storeName, key) {
    return new Promise((resolve, reject) => {
        let transaction = db.transaction([storeName]); // 事务
        let objectStore = transaction.objectStore(storeName); // 仓库对象
        let request = objectStore.get(key);

        request.onerror = function (event) {
            reject(event);
        };

        // eslint-disable-next-line no-unused-vars
        request.onsuccess = function (event) {
            resolve(request.result);
        };
    });
}

/**
 * 通过游标读取数据
 */
function cursorGetData(db, storeName) {
    return new Promise((resolve, reject) => {
        let list = [];
        let store = db
            .transaction(storeName, 'readwrite') // 事务
            .objectStore(storeName); // 仓库对象
        let request = store.openCursor(); // 指针对象
        request.onsuccess = function (e) {
            let cursor = e.target.result;
            if (cursor) {
                // 必须要检查
                list.push(cursor.value);
                cursor.continue(); // 遍历了存储对象中的所有内容
            } else {
                resolve(list);
            }
        };
        request.onerror = function (e) {
            reject(e);
        };
    });
}

/**
 * 通过索引读取数据
 */
// eslint-disable-next-line no-unused-vars
function getDataByIndex(db, storeName, indexName, indexValue) {
    return new Promise((resolve, reject) => {
        let store = db.transaction(storeName, 'readwrite').objectStore(storeName);
        let request = store.index(indexName).get(indexValue);
        request.onerror = function (e) {
            reject(e);
        };
        request.onsuccess = function (e) {
            resolve(e.target.result);
        };
    });
}

/**
 * 通过索引和游标查询记录
 */
// eslint-disable-next-line no-unused-vars
function cursorGetDataByIndex(db, storeName, indexName, indexValue) {
    return new Promise((resolve, reject) => {
        let list = [];
        let store = db.transaction(storeName, 'readwrite').objectStore(storeName); // 仓库对象
        let request = store
            .index(indexName) // 索引对象
            .openCursor(IDBKeyRange.only(indexValue)); // 指针对象
        request.onsuccess = function (e) {
            let cursor = e.target.result;
            if (cursor) {
                list.push(cursor.value);
                cursor.continue(); // 遍历了存储对象中的所有内容
            } else {
                resolve(list);
            }
        };
        request.onerror = function (ev) {
            reject(ev);
        };
    });
}

/**
 * 更新数据，有则更新，没有则添加
 */
// eslint-disable-next-line no-unused-vars
function updateDB(db, storeName, data) {
    return new Promise((resolve) => {
        data.cacheTimeStamp = new Date().getTime();
        let request = db
            .transaction([storeName], 'readwrite') // 事务对象
            .objectStore(storeName) // 仓库对象
            .put(data);

        request.onsuccess = function (ev) {
            resolve(ev);
        };

        request.onerror = function (ev) {
            resolve(ev);
        };
    });
}

/**
 * 批量更新数据，有则更新，没有则添加
 */
// eslint-disable-next-line no-unused-vars
function updateDBWithDatas(db, storeName, datas) {
    if (datas == null || datas.length == 0) {
        return;
    }
    return new Promise((resolve) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        let nowTime = new Date().getTime();
        datas.forEach((data) => {
            data.cacheTimeStamp = nowTime;
            store.put(data);
        });

        transaction.oncomplete = function (ev) {
            resolve(ev);
        };

        transaction.onabort = function (ev) {
            resolve(ev);
        };
    });
}

/**
 * 删除数据
 */
// eslint-disable-next-line no-unused-vars
function deleteDB(db, storeName, id) {
    return new Promise((resolve) => {
        let request = db.transaction([storeName], 'readwrite').objectStore(storeName).delete(id);

        request.onsuccess = function (ev) {
            resolve(ev);
        };

        request.onerror = function (ev) {
            resolve(ev);
        };
    });
}

// 清空表数据
// 数据库,表名
function deleteDBStore(db, storeName) {
    // 表名事务权限控制
    let transaction = db.transaction(storeName, 'readwrite');
    // 进行操作
    let objectStore = transaction.objectStore(storeName);
    // 清除数据
    let clearResult = objectStore.clear();
    // 清除成功的回调函数
    clearResult.onsuccess = function (e) {
        console.log('表名[' + storeName + ']数据清除成功,状态为：' + e.isTrusted);
    };
}

/**
 * 删除数据库
 */
// eslint-disable-next-line no-unused-vars
function deleteDBAll(dbName) {
    console.log(dbName);
    return new Promise((resolve) => {
        let deleteRequest = window.indexedDB.deleteDatabase(dbName);
        deleteRequest.onerror = function (event) {
            console.log('删除失败' + event);
            resolve(false);
        };
        deleteRequest.onsuccess = function (event) {
            console.log('删除成功' + event);
        };
    });
}

/**
 * 关闭数据库
 */
// eslint-disable-next-line no-unused-vars
function closeDB(db) {
    db.close();
    console.log('数据库已关闭');
}

/**
 * 实现sleep函数（js自身没有sleep函数）
 */
function sleep(time) {
    // return new Promise((resolve) => setTimeout(resolve, time));
    //不使用setTimeout，因为浏览器页面进入后台后setTimeout的延迟时间不对，浏览器节能导致 https://blog.csdn.net/L435204/article/details/137959410
    return new Promise((resolve) => {
        let funtemp = function (time) {
            setTimeout(function () {
                self.postMessage(0);
            }, time);
        };
        let worker = new Worker(window.URL.createObjectURL(new Blob(['(' + funtemp.toString() + ')(' + time + ')'])));
        worker.onmessage = function () {
            worker.terminate();
            resolve();
        };
    });
}

//web worker实现setInterval
//https://www.jianshu.com/p/99535d3b7fd7
// Build a worker from an anonymous function body
const blobURL = URL.createObjectURL(
    new Blob(
        [
            '(',

            function () {
                const intervalIds = {};
                let intervalId = null;

                // 监听message 开始执行定时器或者销毁
                self.onmessage = function onMsgFunc(e) {
                    switch (e.data.command) {
                        case 'interval:start': // 开启定时器
                            intervalId = setInterval(function () {
                                postMessage({
                                    message: 'interval:tick',
                                    id: e.data.id,
                                });
                            }, e.data.interval);

                            postMessage({
                                message: 'interval:started',
                                id: e.data.id,
                            });

                            intervalIds[e.data.id] = intervalId;
                            break;
                        case 'interval:clear': // 销毁
                            clearInterval(intervalIds[e.data.id]);

                            postMessage({
                                message: 'interval:cleared',
                                id: e.data.id,
                            });

                            delete intervalIds[e.data.id];
                            break;
                    }
                };
            }.toString(),

            ')()',
        ],
        { type: 'application/javascript' }
    )
);

const worker = new Worker(blobURL);

URL.revokeObjectURL(blobURL);

const workerTimer = {
    id: 0,
    callbacks: {},
    setInterval: function (cb, interval, context) {
        this.id++;
        const id = this.id;
        this.callbacks[id] = { fn: cb, context: context };
        worker.postMessage({
            command: 'interval:start',
            interval: interval,
            id: id,
        });
        return id;
    },
    setTimeout: function (cb, timeout, context) {
        this.id++;
        const id = this.id;
        this.callbacks[id] = { fn: cb, context: context };
        worker.postMessage({ command: 'timeout:start', timeout: timeout, id: id });
        return id;
    },

    // 监听worker 里面的定时器发送的message 然后执行回调函数
    onMessage: function (e) {
        switch (e.data.message) {
            case 'interval:tick':
            case 'timeout:tick': {
                const callbackItem = this.callbacks[e.data.id];
                if (callbackItem && callbackItem.fn) callbackItem.fn.apply(callbackItem.context);
                break;
            }

            case 'interval:cleared':
            case 'timeout:cleared':
                delete this.callbacks[e.data.id];
                break;
        }
    },

    // 往worker里面发送销毁指令
    clearInterval: function (id) {
        worker.postMessage({ command: 'interval:clear', id: id });
    },
    clearTimeout: function (id) {
        worker.postMessage({ command: 'timeout:clear', id: id });
    },
};

worker.onmessage = workerTimer.onMessage.bind(workerTimer);

function getURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    for (const [key, value] of urlParams) {
        params[key] = value;
    }

    return params;
}

//抖音直播自动点赞按钮添加样式
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {
        return;
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle(
    `.autoDianZhanBtn {
        content: '';
        font-size: 14px;
        position: fixed;
        top: 70px;right: 30px;
        z-index: 500;
        cursor: pointer;
        background: #3eaf7c;
        border-radius: 50%;
        color: #ff0;
        display: block;
        width: 46px;height: 46px;
        line-height: 16px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all ease 0.3s;

    }
    .autoDianZhanBtn:hover {
        background-color: #4abf8a;
        transform: rotate(360deg)
    }


    .total {
        font-size: 14px;
        position: fixed;
        top: 79px;
        right: 85px;
        z-index: 500;
        background: #3eaf7c;
        color: #ff0;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all ease 0.3s;
        padding: 5px 8px;
        border-radius: 20px;

    }
    .total p {
        color:#ff0;
    }

    `
);
