/*********************************
**Skit v0.02.3-β1****************
**Copyright (c) 2020 soso(51113)**
*********************************/

const isArray=n=>Object.prototype.toString.call(n)==="[object Array]";
const AFil=(n,t)=>!n||!t||!isArray(n)?undefined:n.filter(n=>n!==t);
const Ftime=(n,t)=>{const i=performance.now();t();const r=performance.now(),u=r-i,f=u.toPrecision(4);console.log(`${n}：${f}`)}
