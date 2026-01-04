// ==UserScript==
// @name         找家纺小助手
// @namespace    http://tampermonkey.net/
// @version      6666666666666666666666666666666666666666666666666666666666666666666
// @description  赵木杉打钱！
// @author       You
// @match        https://detail.zhaojiafang.com/goods/*
// @icon         https://i.postimg.cc/L5KDY5m1/Snipaste-2024-04-04-00-11-40.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490669/%E6%89%BE%E5%AE%B6%E7%BA%BA%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/490669/%E6%89%BE%E5%AE%B6%E7%BA%BA%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var colorId
    var allPriceIds = []; // 所有的价格id
    const getDataInfo = () => {
       return new Promise((resolve, reject) => {
          var id = window.location.pathname.split('/').pop();
          var xhr = new XMLHttpRequest();
          xhr.open('GET', `https://detail.zhaojiafang.com/_next/data/v-pMUsavlxcPC7Q7hPoRI/goods/${id}.json?id=${id}`, true);
          xhr.responseType = 'json';
          xhr.onload = () => {
             // Check if the request was successful
             if (xhr.status === 200) {
                // Print the pageProps data
                const goodsInfo = xhr.response.pageProps.goodsInfo.spec.data; // 当前sku信息
                colorId = xhr.response.pageProps.goodsInfo.goods_detail.color_id; // 当前商品id
                const allColor = xhr.response.pageProps.goodsInfo.spec.spec[0].spec; // 所有颜色
                const allSize = xhr.response.pageProps.goodsInfo.spec.spec[1].spec; // 所有尺码
                const soldIdObj = []; // 已售罄的sku
                const unsoldIdObj = []; // 未售罄的sku
                /// 循环遍历所有的goodsInfo对象 key1是colorId key2是sizeId
                for (const key1 in goodsInfo) {
                   for (const key2 in goodsInfo[key1]) {
                      allPriceIds.push(goodsInfo[key1][key2].goods_id)
                      if (goodsInfo[key1][key2].goods_storage < 10) {
                         soldIdObj.push({ colorId: key1, sizeId: key2, state: goodsInfo[key1][key2].goods_state })
                      }
                   }
                }
                /// 循环遍历所有的goodsInfo对象 key1是colorId key2是sizeId
                for (const key1 in goodsInfo) {
                   for (const key2 in goodsInfo[key1]) {
                      if (goodsInfo[key1][key2].goods_storage >= 10) {
                         unsoldIdObj.push({ colorId: key1, sizeId: key2, state: goodsInfo[key1][key2].goods_state })
                      }
                   }
                }
                // 根据allColor allSize 对solidObj进行翻译
                const soldObj = soldIdObj.map(item => {
                   if (item.state === 0) return;
                   const color = allColor.find(color => color.sp_value_id === item.colorId).sp_value;
                   const size = allSize.find(size => size.sp_value_id === item.sizeId).sp_value;
                   const colorId = item.colorId;
                   const sizeId = item.sizeId;
                   return { color, size, colorId, sizeId }
                }).filter(item => item)
                console.log('已售罄:', soldObj)
                // 根据allColor allSize 对solidObj进行翻译
                const unsoldObj = unsoldIdObj.map(item => {
                   if (item.state === 0) return;
                   const color = allColor.find(color => color.sp_value_id === item.colorId).sp_value;
                   const size = allSize.find(size => size.sp_value_id === item.sizeId).sp_value;
                   const colorId = item.colorId;
                   const sizeId = item.sizeId;
                   return { color, size, colorId, sizeId }
                }).filter(item => item)
                console.log('未售罄:', unsoldObj)
                // 追加div展示未售罄信息
                const divUnsold = document.createElement('div');
                divUnsold.id = 'unsold';
                divUnsold.style.position = 'fixed';
                divUnsold.style.left = '0';
                divUnsold.style.top = '60%';
                divUnsold.style.transform = 'translateY(-50%)';
                divUnsold.style.zIndex = '9999';
                divUnsold.style.padding = '10px';
                divUnsold.style.backgroundColor = 'rgba(0,0,0,0.5)';
                divUnsold.style.color = '#fff';
                divUnsold.style.fontSize = '14px';
                divUnsold.style.lineHeight = '20px';
                divUnsold.style.overflow = 'auto';
                divUnsold.style.maxHeight = '80vh';
                divUnsold.style.textOverflow = 'ellipsis';
                divUnsold.style.whiteSpace = 'nowrap';
                divUnsold.style.display = 'none';
                // 根据sizeId进行分组 color用，分割 不同的sizeId进行换行展示 \n没有效果 需要新建div实现换行
                const groupBySizeIdUnsold = unsoldObj.reduce((acc, cur) => {
                   if (acc[cur.sizeId]) {
                      acc[cur.sizeId].push(cur)
                   } else {
                      acc[cur.sizeId] = [cur]
                   }
                   return acc
                }, {})
                for (const key in groupBySizeIdUnsold) {
                   const div1 = document.createElement('div');
                   div1.style.color = 'green';
                   div1.style.fontWeight = 'bolder';
                   div1.style.fontSize = '18px';
                   div1.innerText = `尺码：${allSize.find(size => size.sp_value_id === key).sp_value}（${groupBySizeIdUnsold[key].length}）`;
                   divUnsold.appendChild(div1);
                   groupBySizeIdUnsold[key].forEach(item => {
                      const div2 = document.createElement('div');
                      div2.innerText = `${item.color}`;
                      divUnsold.appendChild(div2);
                   })
                }
                // 如果有div了就不追加了
                if (!document.getElementById('unsold')) {
                   document.body.appendChild(divUnsold);
                }
                // 在body中追加div垂直剧中到屏幕左侧展示售罄信息 根据sizeId进行分组
                const div = document.createElement('div');
                div.id = 'soldOut';
                div.style.position = 'fixed';
                div.style.left = '0';
                div.style.top = '60%';
                div.style.transform = 'translateY(-50%)';
                div.style.zIndex = '9999';
                div.style.padding = '10px';
                div.style.backgroundColor = 'rgba(0,0,0,0.5)';
                div.style.color = '#fff';
                div.style.fontSize = '14px';
                div.style.lineHeight = '20px';
                div.style.overflow = 'auto';
                div.style.maxHeight = '80vh';
                div.style.textOverflow = 'ellipsis';
                div.style.whiteSpace = 'nowrap';
                // 根据sizeId进行分组 color用，分割 不同的sizeId进行换行展示 \n没有效果 需要新建div实现换行
                const groupBySizeId = soldObj.reduce((acc, cur) => {
                   if (acc[cur.sizeId]) {
                      acc[cur.sizeId].push(cur)
                   } else {
                      acc[cur.sizeId] = [cur]
                   }
                   return acc
                }, {})
                for (const key in groupBySizeId) {
                   const div1 = document.createElement('div');
                   div1.style.color = 'red';
                   div1.style.fontWeight = 'bolder';
                   div1.style.fontSize = '18px';
                   div1.innerText = `尺码：${allSize.find(size => size.sp_value_id === key).sp_value}（${groupBySizeId[key].length}）`;
                   div.appendChild(div1);
                   groupBySizeId[key].forEach(item => {
                      const div2 = document.createElement('div');
                      div2.innerText = `${item.color}`;
                      div.appendChild(div2);
                   })
                }
                // 如果有div了就不追加了
                if (!document.getElementById('soldOut')){
                   document.body.appendChild(div);
                }
                // 在div旁边加个按钮点击切换 显示或者隐藏
                const btn = document.createElement('button');
                btn.id = 'soldOutBtn';
                btn.innerText = '显示/隐藏';
                btn.style.position = 'absolute';
                // 优化按钮样式
                btn.style.padding = '10px';
                btn.style.backgroundColor = 'rgba(0,0,0,0.5)';
                btn.style.color = '#fff';
                btn.style.fontSize = '14px';
                btn.style.lineHeight = '20px';
                btn.style.cursor = 'pointer';
                btn.style.position = 'fixed';
                btn.style.left = '0';
                btn.style.top = '10%';
                btn.style.transform = 'translateY(-50%)';
                btn.onclick = () => {
                   if (div.style.display === 'none') {
                      div.style.display = 'block';
                      divUnsold.style.display = 'none';
                   } else {
                      div.style.display = 'none';
                      divUnsold.style.display = 'none';
                   }
                }
                if(!document.getElementById('soldOutBtn')){
                   document.body.appendChild(btn);
                }
                // 在div旁边加个按钮点击切换 展示售罄还是未售罄
                const btn2 = document.createElement('button');
                btn2.id = 'unsoldBtn';
                btn2.innerText = '售罄/未售罄';
                btn2.style.position = 'absolute';
                // 优化按钮样式
                btn2.style.padding = '10px';
                btn2.style.backgroundColor = 'rgba(0,0,0,0.5)';
                btn2.style.color = '#fff';
                btn2.style.fontSize = '14px';
                btn2.style.lineHeight = '20px';
                btn2.style.cursor = 'pointer';
                btn2.style.position = 'fixed';
                btn2.style.left = '0';
                btn2.style.top = '15%';
                btn2.style.transform = 'translateY(-50%)';
                btn2.onclick = () => {
                   if (divUnsold.style.display === 'none') {
                      divUnsold.style.display = 'block';
                      soldOut.style.display = 'none';
                   } else {
                      divUnsold.style.display = 'none';
                      soldOut.style.display = 'block';
                   }
                }
                if(!document.getElementById('unsoldBtn')) {
                   document.body.appendChild(btn2);
                }
                resolve()
             } else {
                console.error('Error:', xhr.status);
                reject()
             }
          };
          xhr.onerror = function () {
             console.error('Request failed');
          };
          xhr.send();
       })

    }
    getDataInfo().then(() => {
       console.log('获取数据成功')
    }).catch(() => {
       console.log('获取数据失败')
    })
    // 价格计算
    const priceCompute = () => {
       let skuDoms = document.getElementsByClassName('last:mb-0 mb-16')
       for (let skuDom of skuDoms) {
          skuDom.style.borderBottom = '1px solid black'
       }
       const coupon = document.getElementById('coupon').value;
       getDataInfo().then(() => {
          // 循环中给dom设置价格
          allPriceIds.forEach(id => {
             // 设置dom元素的价格 ${colorId}_goods_list_${id}_goods_price
             const dom = document.getElementById(`${colorId}_goods_list_${id}_goods_price`);
             // 已经计算过的不再计算
             if (dom) {
                if (dom.innerText.includes('券后价：')) return;
                // 成本价格
                const oldPrice = dom.innerText.replace('￥', '');
                // 设置价格：成本价格 + 利润（成本价格*0.2） + 快递费（5）+ 服务费（成本价格*0.05）+ 退运费（1.5）+ 优惠卷（10）
                let newPrice = parseFloat(oldPrice) + parseFloat(oldPrice) * 0.2 + 5 + parseFloat(oldPrice) * 0.05 + 1.5 ; // 未算优惠券价格
                let finalPrice = 0
                console.log('newPrice:', newPrice,document.getElementById('checkbox').checked,document.getElementById('checkbox2').checked)
                if(document.getElementById('checkbox').checked&&document.getElementById('checkbox2').checked){
                   if(newPrice+30>=200) {
                      finalPrice = newPrice + 30;
                   } else if(newPrice+20>=100&&newPrice+20<200) {
                      finalPrice = newPrice + 20;
                   }else if(newPrice+parseFloat(coupon)<100) {
                      finalPrice = newPrice + parseFloat(coupon);
                   }
                }else if(document.getElementById('checkbox').checked) {
                   if(newPrice+20>=100) {
                      finalPrice = newPrice + 20;
                   }else {
                      finalPrice = newPrice + parseFloat(coupon);
                   }
                }else if(document.getElementById('checkbox2').checked) {
                   if(newPrice+30>=200) {
                      finalPrice = newPrice + 30;
                   } else {
                      finalPrice = newPrice + parseFloat(coupon);
                   }
                }else{
                   finalPrice = newPrice + parseFloat(coupon);
                }
                dom.style.textWrap = 'nowrap';
                dom.innerHTML = `
                   <div>原价：${oldPrice}</div>
                   <div>无优惠：${newPrice.toFixed(2)}<span style="font-size:12px"> 利(${(parseFloat(oldPrice) * 0.2 ).toFixed(2)})</span></div>
                   <div>券：${(finalPrice-newPrice).toFixed(2)}</div>
                   <div style="color:red;font-weight:bolder">券后价：${finalPrice.toFixed(2)}</div>
                `

                // dom.innerHTML = '原价:'+oldPrice+'\n'+ '无优惠：' +newPrice + '\n' +'券后价：' +`￥${(finalPrice).toFixed(2)}`; // 保留两位小数

             }
          })
       }).catch(() => { })

    }
    // 追加优惠券金额输入框 id=coupon 默认值10
    const coupon = document.createElement('input');
    coupon.id = 'coupon';
    coupon.type = 'number';
    coupon.value = localStorage.getItem('coupon') || '0';
    coupon.style.position = 'fixed';
    coupon.style.right = '0';
    coupon.style.top = '30%';
    coupon.style.transform = 'translateY(-50%)';
    coupon.style.zIndex = '9999';
    coupon.style.padding = '10px';
    coupon.style.backgroundColor = 'rgba(0,0,0,0.5)';
    coupon.style.color = '#fff';
    coupon.style.fontSize = '14px';
    coupon.style.lineHeight = '20px';
    document.body.appendChild(coupon);

    // 增加满100-10的选择checkbox lable是满100-20
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'checkbox';
    checkbox.style.position = 'fixed';
    checkbox.style.right = '0';
    checkbox.style.top = '15%';
    checkbox.style.transform = 'translateY(-50%)';
    checkbox.style.zIndex = '9999';
    checkbox.style.padding = '10px';
    checkbox.style.backgroundColor = 'rgba(0,0,0,0.5)';
    checkbox.style.color = '#fff';
    checkbox.style.fontSize = '14px';
    checkbox.style.lineHeight = '20px';
    // 根据localstorage设置checkbox的状态
    if (localStorage.getItem('checkbox') === 'true') {
       checkbox.checked = true;
    }
    document.body.appendChild(checkbox);
    const lable = document.createElement('lable');
    lable.innerText = '满100-20';
    lable.style.position = 'fixed';
    lable.style.right = '2%';
    lable.style.top = '15%';
    lable.style.transform = 'translateY(-50%)';
    lable.style.zIndex = '9999';
    lable.style.padding = '10px';
    lable.style.backgroundColor = 'rgba(0,0,0,0.5)';
    lable.style.color = '#fff';
    lable.style.fontSize = '14px';
    lable.style.lineHeight = '20px';
    document.body.appendChild(lable);

    // 增加满200-20的选择checkbox lable是满200-30
    const checkbox2 = document.createElement('input');
    checkbox2.type = 'checkbox';
    checkbox2.id = 'checkbox2';
    checkbox2.style.position = 'fixed';
    checkbox2.style.right = '0';
    checkbox2.style.top = '10%';
    checkbox2.style.transform = 'translateY(-50%)';
    checkbox2.style.zIndex = '9999';
    checkbox2.style.padding = '10px';
    checkbox2.style.backgroundColor = 'rgba(0,0,0,0.5)';
    checkbox2.style.color = '#fff';
    checkbox2.style.fontSize = '14px';
    checkbox2.style.lineHeight = '20px';
    // 根据localstorage设置checkbox的状态
    if (localStorage.getItem('checkbox2') === 'true') {
       checkbox2.checked = true;
    }
    document.body.appendChild(checkbox2);
    const lable2 = document.createElement('lable');
    lable2.innerText = '满200-30';
    lable2.style.position = 'fixed';
    lable2.style.right = '2%';
    lable2.style.top = '10%';
    lable2.style.transform = 'translateY(-50%)';
    lable2.style.zIndex = '9999';
    lable2.style.padding = '10px';
    lable2.style.backgroundColor = 'rgba(0,0,0,0.5)';
    lable2.style.color = '#fff';
    lable2.style.fontSize = '14px';
    lable2.style.lineHeight = '20px';
    document.body.appendChild(lable2);

    // 当coupon checkbox checkbox2更改时触发保存到localstorage
    checkbox.onchange = () => {
       localStorage.setItem('checkbox', checkbox.checked);
       // 刷新页面
       window.location.reload();
    }
    checkbox2.onchange = () => {
       localStorage.setItem('checkbox2', checkbox2.checked);
       window.location.reload();
    }
    coupon.onchange = () => {
       localStorage.setItem('coupon', coupon.value);
       window.location.reload();
    }



    // 追加按钮 一键计算价格
    const btn = document.createElement('button');
    btn.innerText = '一键计算价格';
    btn.style.position = 'fixed';
    btn.style.right = '0';
    btn.style.top = '22%';
    btn.style.transform = 'translateY(-50%)';
    btn.style.zIndex = '9999';
    btn.style.padding = '10px';
    btn.style.backgroundColor = 'rgba(0,0,0,0.5)';
    btn.style.color = '#fff';
    btn.style.fontSize = '14px';
    btn.style.lineHeight = '20px';
    btn.style.cursor = 'pointer';
    btn.onclick = priceCompute;
    document.body.appendChild(btn);
    // Send the request
 })();