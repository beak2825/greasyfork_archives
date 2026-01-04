// ==UserScript==
// @name         自动化polygon领水
// @version      0.3
// @description  polygon测试网领水
// @author       Juicpt
// @match        https://faucet.polygon.technology/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=polygon.technology
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @require https://cdn.jsdelivr.net/npm/rxjs@7.5.7/dist/bundles/rxjs.umd.min.js
// @require https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js

// @namespace https://faucet.polygon.technology/
// @downloadURL https://update.greasyfork.org/scripts/455194/%E8%87%AA%E5%8A%A8%E5%8C%96polygon%E9%A2%86%E6%B0%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/455194/%E8%87%AA%E5%8A%A8%E5%8C%96polygon%E9%A2%86%E6%B0%B4.meta.js
// ==/UserScript==
const { from, tap, map,delay,concatMap,retry,of,defer } = rxjs;
let addresses = GM_getValue('addresses') || [];
let importAmountMenuId = null;
const getFaucet = (address)=>{
    const input = document.querySelector('input');
    const button = document.querySelector('button');
    return defer(
        ()=>of(address).pipe(
            concatMap(value=>{
                input.value = value;
                console.log('开始提交',value)
                input.dispatchEvent(new Event('input'));
                return of('');
            }),

            delay(1000),

            concatMap(()=>{
                button.click();
                return of('');
            }),
            // 此处查找Confirm按钮
            concatMap(()=>{
                return defer(()=>{
                    const node = document.evaluate("//button[contains(text(),'Confirm')]", document, null, XPathResult.ANY_TYPE, null).iterateNext();
                    return of(node)
                }).pipe(
                    tap(value=>{
                        if(!value){
                            throw new Error('未发现Confirm按钮')
                        }
                        value.click();
                    }),
                    retry({count:10,delay:1000})
                )
            }),
            // 查找交易情况弹窗
            concatMap(()=>{
                return defer(()=>{
                    const node = document.evaluate("//div[@class='modal-body']//div[contains(text(),'Transfer')or contains(text(),'transfer')]", document, null, XPathResult.ANY_TYPE, null).iterateNext();
                    return of(node)
                }).pipe(
                    tap(value=>{
                        if(!value){
                            throw new Error('未发现交易情况弹窗')
                        }
                        const textContent = document.querySelector('.modal-body .message').textContent;
                        console.log(textContent);
                        if(textContent&&textContent.indexOf('Oops') === -1){
                            console.log('移除',address)
                            const result = addresses.filter(value=>{return value!==address});
                            addresses = result;
                            setAddresses(result);
                        }
                        document.querySelector('.close-icon').click();
                    }),
                    retry({count:10,delay:1000})
                )
            }),
        )
    );
}

const setAddresses=(params)=>{
    GM_setValue('addresses',params);
    addresses = params;
    importAmountMenuId && GM_unregisterMenuCommand(importAmountMenuId);
    importAmountMenuId = GM_registerMenuCommand(`已导入${addresses?.length || 0}个`);
}
GM_registerMenuCommand('开始领水',()=>{
    from(addresses).pipe(
        concatMap(address=>getFaucet(address))
    ).subscribe(value=>{
        console.log('结束')
    })
});

GM_registerMenuCommand('导入',()=>{
    const body= document.querySelector('body');
    body.onfocus = async ()=>{
        const clipText = await navigator.clipboard.readText();
        const list = clipText.split('\n');
        if(list.length===0){
            return;
        }

        for(const address of list){
            const tmp = address.trim();
            if(ethers.utils.isAddress(tmp)){
                addresses.push(tmp);
            }
        }
        setAddresses(addresses);

        document.querySelector('body').onfocus = null;
    }
    body.focus();
});

GM_registerMenuCommand('导出',()=>{
    console.log(addresses)
    GM_setClipboard(JSON.stringify(addresses))
})

GM_registerMenuCommand('清空',()=>{
    setAddresses([]);
})
setAddresses(addresses);