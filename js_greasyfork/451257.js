// ==UserScript==
// @name        老司机(琉璃神社)
// @namespace   https://github.com/RANSAA
// @version     0.0.8
// @description 琉璃神社、灵梦御所链接识别!!!  Aria2，qBittorrent服务的地址需要根据实际情况在代码中修改。灵梦御所中的秒传链接可以与【huaxue】的【百度网盘秒传链接提取(最新可维护版本)】脚本配合使用。警告⚠️⚠️：在琉璃神社中AdGuard会屏蔽掉该效果，需要禁用AdGuard。
// @author      sayaDev
// @license     MIT License


// @include     *://www.liuli.*
// @include     *://www.hacg.*
// @match       *://blog.reimu.net/*
// @match       *://www.kkgal.com/*
// @match       *://pan.baidu.com/s/*
// @match       *://pan.baidu.com/disk/main*
// @match       *://pan.baidu.com/share/init?surl=*
// @icon        data:image/vnd.microsoft.icon;base64,AAABAAEAMDAAAAEAIACoJQAAFgAAACgAAAAwAAAAYAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//////v7+///////+/v7///////7+/v/+/v7///////7+/v////////////7+/v////////3+//7+/v/9/f7/+v77//v78v/45sH/9tGP//bAZP/7tEP/+qst//SnIf/0piH/+Kst//mzQP/5v1z/9s+H//jju//7+e//+/78//3++v/7/vz//f7+//7+/v////////////7+/v////////////7+/v////////////7+/v////////////7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//389f/34LL/+L5Z//iiEv/7mwL//JwA//ybAf/8mwH//psA//6aAP/+mgD//psA//2bAf/9mwD//psB//yZA//4ng//97lN//bcpv/6+/L//f79//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v///////////////////////////////////////////////////////v7+//7+/v/6+vX/9NOS//inJf/9mgH//5oA//6aAf//mgD//5oA//+aAP//mgD//5oB//+aAP//mgD//5oA//+aAP//mgD//5oA//+ZAf//mQH//5oA//ybAf/3pRv/9c6G//v48P/7/v7//P3+//z+/v///////////////////////////////////////////////////////v7+///////+/v7///////7+/v/+/v7//v/+//7+/v/+/v7//f38//jesf/4qSX/+psC//6bAP/+mQH//poA//6aAf//mQH//5oB//+aAf//mQH//5oB//+aAf//mQH//5oB//+aAf//mQH//5oB//+aAf/+mgH//poA//2aAP/7mwD//JsB//WkHP/3153//Pz6//3+/f/9//7//v/+//7+/v////////////7+/v////////////7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//f7+//v9/v/69uz/9r1d//ycAv/+mwD//psA//6bAP/9mwL//psA//6ZAf/+mQH//pkB//6ZAf/+mQH//pkB//6ZAf/+mQH//pkB//6ZAf/+mQH//pkB//6ZAf/9mwD//JwA//6bAf/+mwD//psA//6bAP/7nAP/9bZK//vz4v/8/f3//f7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v////////////////////////////7//v/9/v3//f79//r7+P/205T/+MVx//vFcP/6xXH/+sVx//rFcf/5xm//+LFD//6aAf//mgH//5oB//+aAf//mgH//5oB//+aAf//mgH//5oB//+aAf//mgH//5oB//+aAf/8mgP/9rxY//rFcf/6xXH/+sVx//rFcf/6xXH/+sVx//TMiv/07Nf//P39//3+/v/+//7//////////////////////////////////v7+///////+/v7///////3+/v/7/f3/9+a///Xu2f/8/v7///////7+/v////////////7+/v/9/v3//Prt//qcCv//mQH//5oB//+aAf//mQH//5oB//+aAf//mQH//5oB//+aAf//mQH//5oB//+aAf/7rTb//f36//3+/v////////////7+/v////////////z++//01pv/9d6p//v8/v/9/v7///////7+/v////////////7+/v/+/v7//v7+//7+/v/+/v7//v79//7+/f/458D/958R//nq0f/9/v7//v7+//7+/v/+/v7//v7+//7+/v/8/v7//Pz3//udC//+mQH//pkB//6ZAf/+mQH//pkB//6ZAf/+mQH//pkB//6ZAf/+mQH//pkB//6ZAf/7sD7//P77//7+/f/+/v7//v7+//7+/v/+/v7//v7+//3+/f/41Jn/+J4J//jdqv/8/f7//v7+//7+/v/+/v7//v7+//7+/v/////////////////+//7//P78//nv1P/3ohb//JsB//nr0P/9/v/////////////////////////////9/v7//fv4//ucDP//mgH//5oB//+aAf//mgH//5oB//+aAf//mgH//5oB//+aAf//mgH//5oB//+aAf/7sD3//P38///+/f////////////////////////////7//v/41Zn/+5sB//ieDP/35r///P79//7+/v///////////////////////v7+///////+/v7/+vjt//aqLP/9mwD/+5oB//nr0P/9/v////////7+/v////////////7+/v/9/v7//fv4//ucDP//mQH//5oB//+aAf//mQH//5oB//+aAf//mQH//5oB//+aAf//mQH//5oB//+aAf/7sD3//P38//7+/f////////////7+/v////////////7+/v/41Zn//JwA//2bAf/4pBv/+fPh//7+/f/8/v7//v/+//7+/v/+/v7//v7+//7+/v/9/f3/98Bo//ybAf/+mQH//pkB//jr0P/9/v7//v7+//7+/v/+/v7//v7+//7+/v/9/v7//fv4//ucDP/+mQH//pkB//6ZAf/+mQH//pkB//6ZAf/+mQH//pkB//6ZAf/+mQH//pkB//6ZAf/7sD3//P38//7+/f/+/v7//v7+//7+/v/+/v7//v7+//7+/v/41Zn//psA//6ZAf/+nAH/9bdJ//z8+f/8/f7//v7+//7+/v///////v/+//7+/f/64rv//JsD//2aAf//mgH//pkB//nr0P/9/v/////////////////////////////9/v7//fv4//ucDP//mgH//5oB//+aAf//mgH//5oB//+aAf//mgH//5oB//+aAf//mgH//5oB//+aAf/7sD3//P38///+/f////////////////////////////7//v/41Zn//psA//+aAf/+mgH//JsC//fXnP/7/v7//v/+/////////////v7+//v7+P/2qy///5oB//6aAf/+mQH//pkB//nr0P/9/v////////7+/v////////////7+/v/9/v7//fv4//ucDP//mQH//5oB//+aAf//mQH//5oB//+aAf//mQH//5oB//+aAf//mQH//5oB//+aAf/7sD3//P38//7+/f////////////7+/v////////////7+/v/41Zn//psA//6ZAf//mgH//5oB//WkG//7+PD//v7+//7+/v/+/v7//v7+//fZo//7nAH//pkB//6ZAf/+mQH//pkB//jr0P/9/v7//v7+//7+/v/+/v7//v7+//7+/v/9/v7//fv4//ucDP/+mQH//pkB//6ZAf/+mQH//pkB//6ZAf/+mQH//pkB//6ZAf/+mQH//pkB//6ZAf/7sD3//P38//7+/f/+/v7//v7+//7+/v/+/v7//v7+//7+/v/41Zn//psA//6ZAf/+mQH//pkB//ybAf/1zYb//v79//7+/v///////f36//etNP/7mwD//5oB//+aAf//mgH//pkB//nr0P/9/v/////////////////////////////9/v7//fv4//ucDP//mgH//5oB//+aAf//mgH//5oB//+aAf//mgH//5oB//+aAf//mgH//5oB//+aAf/7sD3//P38///+/f////////////////////////////7//v/41Zn//psA//+aAf//mgH//5oB//ybAP/3pRv//Pry//3+/P/9/v3/+ebF//2aA//+mwD//5oB//6aAf/+mQH//pkB//nr0P/9/v////////7+/v////////////7+/v/9/v7//fv4//ucDP//mQH//5oB//+aAf//mQH//5oB//+aAf//mQH//5oB//+aAf//mQH//5oB//+aAf/7sD3//P38//7+/f////////////7+/v////////////7+/v/41Zn//psA//6ZAf//mgH//5oB//2aAf/8mwH/9tym//7++//9/P7/98Vp//6aAP/+mQH//pkB//6ZAf/+mQH//pkB//jr0P/9/v7//v7+//7+/v/+/v7//v7+//7+/v/9/v7//fv4//ucDP/+mQH//pkB//6ZAf/+mQH//pkB//6ZAf/+mQH//pkB//6ZAf/+mQH//pkB//6ZAf/7sD3//P38//7+/f/+/v7//v7+//7+/v/+/v7//v7+//7+/v/41Zn//psA//6ZAf/+mQH//pkB//6ZAf/+mgD/97lN//v+/P/7/fn/9qcj//+aAf//mgH//5oB//+aAf//mgH//pkB//nr0P/9/v/////////////////////////////9/v7//fv4//ucDP//mgH//5oB//+aAf//mgH//5oB//+aAf//mgH//5oB//+aAf//mgH//5oB//+aAf/7sD3//P38///+/f////////////////////////////7//v/41Zn//psA//+aAf//mgH//5oB//+aAf//mQH/+J4P//v57//48Nn/+5sD//+aAf/+mgH//5oB//6ZAf/+mgH//pkB//jr0P/9/v////////7+/v////////////7+/v/9/v7//fv4//ucDP/+mQH//5oB//6ZAf/+mQH//5oB//6ZAf/+mQH//5oB//6ZAf/+mQH//5oB//6ZAf/7sD3//P38//7+/f////////////7+/v////////////7+/v/41Zn//psA//6ZAf//mgH//5oB//6ZAf//mgH//JkD//jiu//32qb//ZsB//6ZAf/+mQH//pkB//6ZAf/+mQH//pkB//jr0P/9/v7//v7+//7+/v/+/v7//v7+//7+/v/9/v3//Pz1//qdDP/9mwD//ZsA//2bAP/9mwD//ZsA//2bAP/9mwD//ZsA//2bAP/9mwD//ZsA//2bAP/6sD7/+f39//z+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/41Zn//psA//6ZAf/+mQH//pkB//6ZAf/+mgD//psB//fQiP/4yXz//psA//+aAf//mgH//5oB//+aAf//mgH//pkB//nr0P/9/v/////////////////////////////8/v7/+/77//ft1//67db/+u3W//rt1v/67db/+u3W//rt1v/67db/+u3W//rt1v/67db/+u3W//rt1v/68d7//f7+//7+//////////////////////////////7//v/41Zn//psA//+aAf//mgH//5oB//+aAf//mgD//ZsA//nAXP/3vl3//ZsA//+aAf/+mgH//5oB//6ZAf/+mgH//pkB//jr0P/9/v////////7+/v////////////7+/v/+/v7//v7+//7+/v/+/v7///7///7+/v/+/v7///7///7+/v/+/v7///7///7+/v/+/v7///7///7+/v/+/v7//v7+//7+/v////////////7+/v////////////7+/v/41Zn//psA//6ZAf//mgH//5oB//6ZAf//mgD//ZsB//mzQP/6t0n//ZsB//6ZAf/+mQH//pkB//6ZAf/+mQH//pkB//jr0P/9/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/41Zn//psA//6ZAf/+mQH//pkB//6ZAf/+mgD//psA//irLf/5s0D//ZsB//+aAf//mgH//5oB//+aAf//mgH//pkB//nr0P/9/v////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7//v/41Zn//psA//+aAf//mgH//5oB//+aAf//mgD//poA//SmIf/6tED//ZsB//+aAf/+mgH//5oB//6ZAf/+mgH//pkB//jr0P/9/v////////7+/v////////////7+/v/+/v7///////7+/v/+/v7///////7+/v/+/v7///////7+/v/+/v7///////7+/v/+/v7///////7+/v////////////7+/v////////////7+/v////////////7+/v/41Zn//psA//6ZAf//mgH//5oB//6ZAf//mgD//poA//SnIf/7uUr//ZsB//6ZAf/+mQH//pkB//6ZAf/+mQH//pkB//jr0P/9/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/41Zn//psA//6ZAf/+mQH//pkB//6ZAf/+mQH//psA//mrLf/3v17//ZsA//+aAf//mgH//5oB//+aAf//mgH//pkB//nr0P/9/v/////////////////////////////+/v///v7+//7+///+/////v////7////+/////v////7////+/////v////7////+/////v////7////+//7//v/+//7+//////////////////////////////7//v/41Zn//psA//+aAf//mgH//5oB//+aAf//mgD//JsB//u0Q//3zH///ZsA//+aAP/+mgH//5oB//6ZAf/+mgH//pkB//jr0P/9/v////////7+/v////////////7+/v/+/v3/+v79//z57f/8+u3//Prt//z67f/8+u3//Prt//z67f/8+u3//Prt//z67f/8+u3//Prt//z67f/8+/D//P79//3+/v////////////7+/v////////////7+/v/41Zn//psA//6ZAf//mgH//5oB//6ZAf//mgD//JsB//bAZP/33qn/+5oC//6aAP/+mQH//pkB//6ZAf/+mQH//pkB//jr0P/9/v7//v7+//7+/v/+/v7//v7+//7+/v/8/v7//Pv2//ScEf/4mgb/+JoG//iaBv/4mgb/+JoG//iaBv/4mgb/+JoG//iaBv/4mgb/+JoG//iaBv/1r0P//P79//3+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/41Zn//psA//6ZAf/+mQH//pkB//6ZAf/+mgD//JwA//bRj//68d7/+5oF//+ZAf//mgH//5oB//+aAf//mgH//pkB//nr0P/9/v/////////////////////////////9/v7//fv4//ucDP//mgH//5oB//+aAf//mgH//5oB//+aAf//mgH//5oB//+aAf//mgH//5oB//+aAf/7sD3//P38///+/f////////////////////////////7//v/41Zn//psA//+aAf//mgH//5oB//+aAf/+mgD/+5sC//jmwf/9/vv/+Kor//6aAP/+mgH//5oB//6ZAf/+mgH//pkB//jr0P/9/v////////7+/v////////////7+/v/9/v7//fv4//ucDP/+mQH//5oB//6ZAf/+mQH//5oB//6ZAf/+mQH//5oB//6ZAf/+mQH//5oB//6ZAf/7sD3//P38//7+/f////////////7+/v////////////7+/v/41Zn//psA//6ZAf//mgH//5oB//6ZAf/+mgH/+KET//v78//9/P7/9cl2//6aAP/+mQH//pkB//6ZAf/+mQH//pkB//jr0P/9/v7//v7+//7+/v/+/v7//v7+//7+/v/9/v7//fv4//ucDP/+mQH//poB//6ZAf/+mQH//poB//6ZAf/+mQH//poB//6ZAf/+mQH//poB//6ZAf/7sD3//P38//7+/f/+/v7//v7+//7+/v/+/v7//v7+//7+/v/41Zn//psA//6ZAf/+mQH//pkB//6ZAf/+mgD/+L1a//r+/P/8/v3/+evO//uaBP//mgD//5oB//+aAf//mgH//pkB//nr0P/9/v/////////////////////////////9/v7//fv4//ucDP//mgH//5oB//+aAf//mgH//5oB//+aAf//mgH//5oB//+aAf//mgH//5oB//+aAf/7sD3//P38///+/f////////////////////////////7//v/41Zn//psA//+aAf//mgH//5oB//6ZAf/9mQH/9+Cw//v+/f/+/v7//f78//eyPv/9mgD//5oB//6ZAf/+mgH//pkB//nr0P/9/v////////7+/v////////////7+/v/9/v7//fv4//ucDP/+mQH//5oB//6ZAf/+mQH//5oB//6ZAf/+mQH//5oB//6ZAf/+mQH//5oB//6ZAf/7sD3//P38//7+/f////////////7+/v////////////7+/v/41Zn//psA//6ZAf//mQH//5oB//6bAP/3qCX//Pz1//3+/v/+/v7//v7+//ffsf/8mgL//pkB//6ZAf/+mQH//pkB//jr0P/9/v7//v7+//7+/v/+/v7//v7+//7+/v/9/v7//fv4//ucDP/+mQH//pkB//6ZAf/+mQH//pkB//6ZAf/+mQH//pkB//6ZAf/+mQH//pkB//6ZAf/7sD3//P38//7+/f/+/v7//v7+//7+/v/+/v7//v7+//7+/v/41Zn//psA//6ZAf/+mQH//pkB//ybAv/105L/+/7+//79/v///////v7+//z7+//2sT3//5oB//+aAf//mgH//pkB//nr0P/9/v/////////////////////////////9/v7//fv4//ucDP//mgH//5oB//+aAf//mgH//5oB//+aAf//mgH//5oB//+aAf//mgH//5oB//+aAf/7sD3//P38///+/f////////////////////////////7//v/41Zn//psA//+aAf//mgH//5oB//ipJf/6+vX//v7+/////////////v7+//7+/v/56cj/+50I//2aAP/+mgH//pkB//nr0P/9/v////////7+/v////////////7+/v/9/v7//fv4//ucDP/+mQH//5oB//6ZAf/+mQH//5oB//6ZAf/+mQH//5oB//6ZAf/+mQH//5oB//6ZAf/7sD3//P38//7+/f////////////7+/v////////////7+/v/41Zn//psA//6ZAf/+mgD/+5sC//jesP/+/v7//v7+//7+/v/+/v7//v7+//7+/v/9/v3/9sl6//ucAf/+mQH//pkB//jr0P/9/v7//v7+//7+/v/+/v7//v7+//7+/v/9/v7//fv4//ucDP/+mQH//pkB//6ZAf/+mQH//pkB//6ZAf/+mQH//pkB//6ZAf/+mQH//pkB//6ZAf/7sD3//P38//7+/f/+/v7//v7+//7+/v/+/v7//v7+//7+/v/41Zn//psA//6ZAf/6mgL/9L1d//39/P/+/v7//v7+//7+/v/////////////////+/v7/+/v0//WyPP/6mgP//JoB//nr0P/9/v/////////////////////////////9/v7//fv4//ucDP//mgH//5oB//+aAf//mgH//5oB//+aAf//mgH//5oB//+aAf//mgH//5oB//+aAf/7sD3//P38///+/f////////////////////////////7//v/41Zn//ZsA//6aAf/3qSj/+Pfr//7+/v///////////////////////v7+///////9/v7/+/7+//r04f/3pSP//JoB//nr0P/9/v////////7+/v////////////7+/v/9/v7//fv4//ucDP/+mQH//5oB//6ZAf/+mQH//5oB//6ZAf/+mQH//5oB//6ZAf/+mQH//5oB//6ZAf/7sD3//P38//7+/f////////////7+/v////////////7+/v/41Zn//psA//iiFP/57dL/+/78//7+/v////////////7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/f/67tT/9qUc//jrz//9/v7//f7+//3+/v/9/v7//f7+//3+/v/9/f7//Pv3//udC//+mQH//pkB//6ZAf/+mQH//pkB//6ZAf/+mQH//pkB//6ZAf/+mQH//pkB//6ZAf/7sD7//f39//3+/v/9/v7//f7+//3+/v/9/v7//f7+//39/v/31Zj/954S//nmv//+/v3//v79//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7///////7+/v/9/vz/+O3T//Xu2v/7/vv//P79//z+/f/8/v3//P79//z+/f/6/vv/+/Ti//ubCP/+mgH//poB//6aAf/+mgH//poB//6aAf/+mgH//poB//6aAf/+mgH//poB//6aAf/6qS3/+vv0//3+/P/8/v3//P79//z+/f/8/v3//P79//v++//z05r/9ubC//z9/f/+/v7///////7+/v/+/v7///////7+/v///////v7+///////+/v7///////7+/v/+/v7//P79//v78//xxnP/97E6//qvOf/7rzn/+685//uvOf/7rzn/+qQf//6aAP/+mQH//5oB//6ZAf/+mQH//5oB//6ZAf/+mQH//5oB//6ZAf/+mQH//5oB//6ZAf/+mQH/+agr//uvOf/7rzn/+685//uvOf/6rzr/+LA6//PAZf/38Nv//f79//3+/v/+//7///////7+/v////////////7+/v///////////////////////////////////////v7+//v+/v/7+/T/9sl6//udCP//mQH//5kB//+ZAf//mQH//5kB//+ZAf//mQH//5kB//+ZAf//mQH//5kB//+ZAf//mQH//5kB//+ZAf//mQH//5kB//+ZAf//mQH//5oB//+ZAf//mQH//5oB//+ZAf/8mwT/98Bn//v47f/9/vz///79///////////////////////////////////////+/v7//v7+//7+/v/+/v7///////7+/v/+/v7//v7+//3+/v/+/v7//f79//npyP/2sT3//JoC//2aAP/+mgD//poB//6aAf/+mgH//poB//6aAf/+mgH//poB//6aAf/+mgH//poB//6aAf/+mgH//poB//6aAf/+mgH//5oB//6bAP/7mwD//JwB//asL//647v//f39//7+/v/+/v7////+//7+/v/+/v7///////7+/v/+/v7///////7+/v///////v7+///////+/v7///////7+/v/+/v7///////7+/v///////v7+//7+/v/8+/v/99+x//eyPv/7mgT//poA//6aAP/+mQH//poA//6aAP/+mQH//5kB//6aAf/+mgH//5kB//6ZAf/+mgD//5oA//6ZAf//mgD//poA//2aA//3rTT/99mi//v79//9/v3//v7+//7+/v////////////7+/v////////////7+/v////////////7+/v////////////////////////////////////////////////////////////7+///+/v7//v7+//3+/P/568//9sh4//ipLP/7mgT/+5oC//2bAP/9mwD//ZsB//2aAf/9mgH//JsB//6bAP/+mwD//JsB//ubA//4pyT/98Zr//nmxf/9/fr//v7///7+///+//7////////////////////////////////////////////////////////////+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/8/vz//v7+//3++//68d//996p//fMf//4vmL/+7ZO//qzQP/6s0D/+rdJ//e+XP/4yn3/99qm//jw2f/7/fn//f3+//3+/P/+/v7///////7+/v/+/v7///////7+/v/+/v7///////7+/v/+/v7///////7+/v/+/v7///////7+/v8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=

// @require     https://greasyfork.org/scripts/417761-ilog/code/iLog.js?version=876248
// @require     https://greasyfork.org/scripts/417760-checkjquery/code/checkJQuery.js?version=876220
// @require 	https://update.greasyfork.org/scripts/494214/1432041/TKBaseSDK.js

// @grant       unsafeWindow
// @grant       GM_openInTab
// @grant       GM_xmlhttpRequest

// @connect 	self 		//添加需要跨域不弹出用户选择页面的标注
// @connect 	localhost
// @connect 	127.0.0.1
// @connect 	*

// @compatible        chrome
// @compatible        edge
// @compatible        firefox
// @compatible        opera 
// @compatible        safari 

// @downloadURL https://update.greasyfork.org/scripts/451257/%E8%80%81%E5%8F%B8%E6%9C%BA%28%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/451257/%E8%80%81%E5%8F%B8%E6%9C%BA%28%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE%29.meta.js
// ==/UserScript==
/**
 * 在ocrosoft的【老司机传说(新)】的基础上修改的
 * https://sleazyfork.org/zh-CN/scripts/407614-%E8%80%81%E5%8F%B8%E6%9C%BA%E4%BC%A0%E8%AF%B4-%E6%96%B0
 * 
 * 可增加功能(未实现)：增加右上角开车功能，下面的这个脚本中有，后面有时间可以合并下面脚本的部分功能
 * https://sleazyfork.org/zh-CN/scripts/23316-%E7%90%89%E7%A5%9E%E8%BD%AC
 * 
 * 
 * 注意：与hoothin的【琉神转|琉神轉】互斥非必要情况下不需要使用琉神转
 * 
 * 
 * 
 * 【huaxue】的【百度网盘秒传链接提取(最新可维护版本)】：
 *  https://greasyfork.org/zh-CN/scripts/427628-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%A7%92%E4%BC%A0%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96-%E6%9C%80%E6%96%B0%E5%8F%AF%E7%BB%B4%E6%8A%A4%E7%89%88%E6%9C%AC
 * 
 * 
 **/




iLog.prefix = '老司机(琉璃神社)';
iLog.setLogLevel(iLog.LogLevel.Warning);




/**
 * 配置SayaDev用户的参数信息
 **/ 
const SAYADEV_LIULI_CONFIG = {
	// Aria2 PRC服务请求地址 -> 可按照实际情况修改
	aria2URL: "http://localhost:6800/jsonrpc",
	// qBittorrent 服务器请求地址配置 -> 可按照实际情况修改
	qBittorrentURL: "http://localhost:2081/api/v2/torrents/add",
	qBittorrentUserName: "admin",
	qBittorrentPassword: "123456",
}



//组装Aria2 JSON-RPC数据
function loadRPCData(url)
{
	var json = {
		jsonrpc:'2.0',
		method:'aria2.addUri',
		id:url,
		params:[
		 [url],
		]
	}
	return JSON.stringify(json)
}

//发送链接到Aria2
function sendLinkToAria2(url)
{
	let data = loadRPCData(url);
	let hostname = window.location.hostname;

	console.log(`hostname: ${hostname}`);
	console.log(`data: ${data}`);


	//GM_xmlhttpRequest方式请求
    GM_xmlhttpRequest({
	    method: 'POST',
	    url: SAYADEV_LIULI_CONFIG.aria2URL,
	    headers: {
	        'Content-Type': 'application/json; charset=utf-8',
	        "Access-Control-Allow-Origin": hostname,
	    },
	    data: data,
	    onload: function(response) {
	    	console.log(response);
	    	console.log(`readyState:${response.readyState}`);
	    	console.log(`status:${response.status}`);
	    	console.log(`statusText:${response.statusText}`);
	    	console.log(`responseHeaders:\n${response.responseHeaders}`);
	    	console.log(`responseText:${response.responseText}`);
	    	
	        if (response.status === 200) {
	            console.log(`Send Aria2 Link Success: ${url}`);
	            TKBaseSDK.showToast("Aria2 RPC任务添加成功!",1);
	        } else {
	        	console.log(`Send Aria2 Link Error: ${url}	statusText: ${response.statusText}`);
	            TKBaseSDK.showToast("Aria2 RPC任务添加失败!",0);
	        }
	    },
	    onerror: function(response) {
            // 请求发生错误时执行
            console.error("Request failed:", response);
            //let msg = `Aria2 RPC任务添加失败!\nAria2服务未开启或端口不匹配\nAria2服务地址：${response.finalUrl}`;
            let msg = `Aria2 RPC任务添加失败!\nAria2服务未开启或端口不匹配\nAria2服务地址：${SAYADEV_LIULI_CONFIG.aria2URL}`;
            console.log(msg);
            TKBaseSDK.showToastWtihTime(msg,0,3000);
        }
	});

}


// 发送链接到qBittorrent的函数
function sendLinkToqBittorrent(url) 
{
    let authString = SAYADEV_LIULI_CONFIG.qBittorrentUserName + ":" + SAYADEV_LIULI_CONFIG.qBittorrentPassword;
    let authBase64 = "Basic " + btoa(authString);

    let data = "urls=" + url;
    let dataBase64 = "urls=" + encodeURIComponent(url);

    let hostname = window.location.hostname;


    console.log(`hostname: ${hostname}`);
    console.log(`authString: ${authString}`);
    console.log(`authBase64: ${authBase64}`);
    console.log(`data: ${data}`);
    console.log(`dataBase64 :${dataBase64}`);


	/**
	 * 注意：直接使用XMLHttpRequest发送qBittorrent存在跨域问题，且自己无法解决；
	 * 所有就换成了油猴中的GM_xmlhttpRequest进行网络请求，就可解决跨域问题！
	 **/
    GM_xmlhttpRequest({
        method: 'POST',
        url: SAYADEV_LIULI_CONFIG.qBittorrentURL,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            "Access-Control-Allow-Origin": hostname,
            "Authorization": authBase64,
        },
        data: dataBase64,
        onload: function(response) {
        	console.log(response);
        	console.log(`readyState:${response.readyState}`);
        	console.log(`status:${response.status}`);
        	console.log(`statusText:${response.statusText}`);
        	console.log(`responseHeaders:\n${response.responseHeaders}`);
        	console.log(`responseText:${response.responseText}`);
        	
            if (response.status === 200) {
                console.log(`Send qBittorrent Link Success: ${url}`);
                TKBaseSDK.showToast("qBittorrent 任务添加成功!",1);
            } else {
            	console.log(`Send qBittorrent Link Error: ${url}	statusText: ${response.statusText}`);
                TKBaseSDK.showToast("qBittorrent 任务添加失败!",0);
            }
        },
	    onerror: function(response) {
            // 请求发生错误时执行
            console.error("Request failed:", response);
            //let msg = `qBittorrent 任务添加失败!\nqBittorrent服务未开启或端口不匹配\nqBittorrent服务地址：${response.finalUrl}`;
            let msg = `qBittorrent 任务添加失败!\nqBittorrent服务未开启或端口不匹配\nqBittorrent服务地址：${SAYADEV_LIULI_CONFIG.qBittorrentURL}`;
            console.log(msg);
            TKBaseSDK.showToastWtihTime(msg,0,3000)
        }
    });
}



//copy灵梦御所百度秒传地址
var reimu_result_all_links = "";
function copyReimuDuPanLinks()
{
	console.log(`灵梦御所百度秒传链接reimu_result_all_links:\n${reimu_result_all_links}`);
	if (reimu_result_all_links.length < 2) {
		TKBaseSDK.showToast("秒传链接拷贝失败，刷新页面重试！",0);
	}else{
		var textWithNewline = reimu_result_all_links;

		// 创建一个临时的 textarea 元素
		var textarea = document.createElement("textarea");
		textarea.value = textWithNewline;
		// 将 textarea 设为不可见
		textarea.style.position = "fixed";
		textarea.style.opacity = 0;
		// 将 textarea加入到文档中
		document.body.appendChild(textarea);
		// 选中文本并尝试执行复制操作
		textarea.select();
		document.execCommand("copy");
		// 移除临时创建的textarea元素
		document.body.removeChild(textarea);


		console.log('复制成功');
		TKBaseSDK.showToast("秒传链接拷贝成功！",1);
	}
}





// ---------------------Toast-------------------------------
//初始化
TKBaseSDK.initToast();
// ---------------------Toast-------------------------------






//--------------------------------芮淼一线修改主要函数结束----------------------------------------






// Cookie
let COOKIES = {
    set: function(name, value, days) {
        if (days == null) {
            alert('days 不允许为空。');
            return;
        }
        let exp = new Date();
        exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
        var str = JSON.stringify(value);
        document.cookie = name + "=" + str + ";expires=" + exp.toGMTString() + ';path=\/';
    },
    get: function(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            //return unescape(arr[2]);
            return JSON.parse(arr[2]);
        }
        else {
            return null;
        }
    },
    del: function(name) {
        let exp = new Date();
        exp.setTime(exp.getTime() - 1000);
        document.cookie = name + "=;expires=" + exp.toGMTString() + ';path=\/';
    },
}

// 窗口大小发生改变的调用方法
let resize_functions = {};
// 按下按键时的调用方法
let keydown_functions = {};
// 上一次按键事件
let last_keydown_event = null;
// 查找字符串所在的元素
// root为jQ对象，返回值为jQ对象数组
function FindElementByText(root, text) {
    let result = [];
    let found_in_children = false;
    $.each(root.children(), function(i, child) {
        let _this = $(child);
        if (_this.text().indexOf(text) != -1) {
            let e = FindElementByText(_this, text);
            if (e.length > 0) {
                found_in_children = true;
                result = result.concat(e);
            }
        }
    });
    if (!found_in_children && root.length > 0) {
        result.push(root);
    }
    return result;
}
// 分析提取码
function FindCodes(content, keys) {
    let codes = [];
    $.each(keys, function(i, key) {
        let split = content.split(key);
        if (split.length < 2) {
            iLog.w('找不到对应的提取码：' + key);
            codes.push('');
            return;
        }
        let content_to_match = split[1];
        let match = content_to_match.match(/[^a-zA-Z0-9]([a-zA-Z0-9]{4})([^a-zA-Z0-9]|$)/);
        if (match) {
            codes.push(match[1]);
        } else {
            iLog.w('找不到对应的提取码：' + key);
        }
    });
    let match = [];
    return codes;
}
// 是否可输入元素，输入为裸元素
function IsInputElement(element) {
    let e = element;
    let tag_name = e.tagName.toLowerCase();
    if (tag_name == 'input') {
        if (e.type.toLowerCase() == 'text' ||
            e.type.toLowerCase() == 'password') {
            return true;
        }
    } else if (tag_name == 'textarea') {
        return true;
    }
    return false;
}
// 隐藏所有图片
function HideAllImages(root) {
    if (root == null) {
        root = $(document);
    }
    let images = root.find('img');
    $.each(images, function(i, img) {
        img = $(img);
        if (img.attr('display') != 'none') {
            img.addClass('od_safe_mode_hidden').hide();
        }
    });

}
// 显示所有被上面函数隐藏的图片
function ShowAllHiddenImages(root) {
    if (root == null) {
        root = $(document);
    }
    let images = root.find('.od_safe_mode_hidden');
    images.removeClass('od_safe_mode_hidden').show();
}

let sites = [{
    name: '琉璃神社',
    pattern: /https:\/\/www\.(liuli|hacg)\.[a-z]+\/wp\//,
    process: function() {
        // 是否主页
        function IsMainPage() {
            return location.href.match(/https:\/\/www\.(liuli|hacg)\.[a-z]+\/wp\/?$/) ||
                location.href.match(/https:\/\/www\.(liuli|hacg)\.[a-z]+\/wp\/page\/\d+/);
        }
        // 是否文章页
        function IsArticlePage() {
            return location.href.match(/https:\/\/www\.(liuli|hacg)\.[a-z]+\/wp\/\d+\.html/);
        }
        // 处理磁力链（仅正文）
        function ProcessMagnetInContent() {
            // 提取 HASH
            function GetHashFromMagnet(magnet) {
                return magnet.toLowerCase().replace('magnet:?xt=urn:btih:', '').toUpperCase();
            }
            // 增加一个跳转下载链接的气泡
            function AddBubble(hash_match) {
                // 元素
                let comment_bubble_wrapper = $('#wpd-bubble-wrapper');
                let link_bubble_wrapper = comment_bubble_wrapper.clone();
                link_bubble_wrapper.find('#wpd-bubble-all-comments-count').text(hash_match.length).addClass('od_link_count');
                let link_bubble = link_bubble_wrapper.find('#wpd-bubble-count');
                let svg = $('<svg height="512pt" viewBox="0 -61 512 512" width="512pt" xmlns="http://www.w3.org/2000/svg"><path d="m377 0h-121l-30 37.5 30 37.5h121c33.085938 0 60 26.914062 60 60s-26.914062 60-60 60h-121l-30 37.5 30 37.5h121c74.4375 0 135-60.5625 135-135s-60.5625-135-135-135zm0 0" fill="#18e0ff"></path><path d="m256 120-30 37.5 30 37.5c33.085938 0 60 26.914062 60 60s-26.914062 60-60 60l-30 37.5 30 37.5c74.4375 0 135-60.5625 135-135s-60.5625-135-135-135zm0 0" fill="#13bdf7"></path><path d="m135 195h121v-75h-121c-74.4375 0-135 60.5625-135 135s60.5625 135 135 135h121v-75h-121c-33.085938 0-60-26.914062-60-60s26.914062-60 60-60zm0 0" fill="#18e0ff"></path><path d="m256 75v-75c-74.4375 0-135 60.5625-135 135s60.5625 135 135 135v-75c-33.085938 0-60-26.914062-60-60s26.914062-60 60-60zm0 0" fill="#13bdf7"></path></svg>');
                link_bubble.children('svg').remove();
                link_bubble.append(svg);


                // //评论-网站原有的节点 -> 将该节点向左移动
                // comment_bubble_wrapper.css({
                // 	'left': '46px',
                // 	'bottom': '46px',
                // 	'position':'fixed',
                // 	'z-index':'999999'
                // });

                //链接
                link_bubble_wrapper.css({
                    'left': comment_bubble_wrapper.css('left'),
                    'bottom': parseInt(comment_bubble_wrapper.css('bottom')) + 100 + 'px',
                    'position':'fixed',
                    'z-index':'999999'
                });

 
                resize_functions.liuli_resize_bubble_position = function() {
                    link_bubble_wrapper.css('left', comment_bubble_wrapper.css('left'));
                };
                // 链接
                let bubble_message = link_bubble_wrapper.find('#wpd-bubble-add-message').addClass('od_link_message');
                bubble_message.empty().css({'display': 'block', 'text-align': 'left', 'width': 'max-content', 'height': 'auto', 'max-height': '360px', 'overflow-y': 'auto'});

                $.each(hash_match, function(index, hash) {
                    if (index > 0) {
                        bubble_message.append('<br>');
                    }
                    let link_jump = $('<a id="od_bubble_jump_' + (index + 1) + '" style="color:#fff;">定位到链接</a>');
                    let link_copy = $('<a id="od_bubble_copy_' + (index + 1) + '" style="color:#fff;">复制链接</a>');
                    let link_aria2 = $('<a id="od_bubble_rpc_' + (index + 1) + '" style="color:#fff;">发送到Aria2</a>');
                    let link_qBittorrent = $('<a id="od_bubble_qBittorrent_' + (index + 1) + '" style="color:#fff;">发送到qBittorrent</a>');
                    let hash_only = GetHashFromMagnet(hash);
                    let link_download = $('<a id="od_bubble_link_' + (index + 1) + '" href="magnet:?xt=urn:btih:' + hash_only + '" style="color:#fff; margin-left: 10px;">' + hash_only + '</a>');
                    link_jump.click(function(e) {
                        let selector = '#od_link_' + hash_only;
                        // 目标在 toggle 里面
                        if ($('.toggle-box').find(selector).length > 0) {
                            let parent = $(selector).parent();
                            while (parent.length > 0) {
                                if (parent.hasClass('toggle-box')) {
                                    if (parent.css('display') == 'none') {
                                        parent.prev().click();
                                    }
                                    break;
                                }
                                parent = parent.parent();
                            }
                        }
                        $('body, html').animate({scrollTop: $(selector).offset().top}, 500);
                        e.stopPropagation();
                    });
                    link_copy.click( function(e){
                        //获取指定href属性
                        let link_id = ('od_bubble_link_' + (index + 1));
                        //document.getElementById(link_id).attributes["href"].value;
                        let magnet = document.getElementById(link_id);

                        //将magnet复制到剪切板
                        TKBaseSDK.copyToClipBoard(magnet);
                        TKBaseSDK.showToast("复制成功",1);

                        e.stopPropagation();
                    });
                    //发送到Aria2 RPC服务器
                    link_aria2.click(function(e) {
                        //获取指定href属性
                        let link_id = ('od_bubble_link_' + (index + 1));
                        let url = document.getElementById(link_id).attributes["href"].value;
                        console.log("RPC URL:",url);
                        sendLinkToAria2(url);
                        e.stopPropagation();
                    });
                    //发送到qBittorrent RPC服务器
                    link_qBittorrent.click(function(e) {
                        //获取指定href属性
                        let link_id = ('od_bubble_link_' + (index + 1));
                        let url = document.getElementById(link_id).attributes["href"].value;
                        console.log("RPC URL:",url);
                        sendLinkToqBittorrent(url);
                        e.stopPropagation();
                    });

                    link_download.click(function(e) {
                        e.stopPropagation();
                    });
             
                    let span = $('<span></span>');
                    let space = '<span style="color:#fff;">&emsp;&emsp;</span>';
                    span.append(link_jump).append(space).append(link_copy).append(space).append(link_aria2).append(space).append(link_qBittorrent).append(space).append(link_download);

                    bubble_message.append(span).click(function(e) {
                        e.stopPropagation();
                    });
                });
                // 事件
                link_bubble_wrapper.find('#wpd-bubble-count').click(function(event) {
                    let wrapper = $(this).parent();
                    wrapper.addClass('wpd-bubble-hover');
                });
                link_bubble_wrapper.find('#wpd-bubble').find('svg').css('-webkit-transform', 'rotate(45deg)');
                // 关闭只点 SVG，点弹出的链接就不会关闭了
                link_bubble_wrapper.find('#wpd-bubble').find('svg').click(function(event) {
                    let wrapper = $(this).parent().parent();
                    wrapper.removeClass('wpd-bubble-hover');
                    event.stopPropagation();
                });
                comment_bubble_wrapper.after(link_bubble_wrapper);
                // 找到了链接，主动打开一下
                if (hash_match.length > 0) {
                    link_bubble_wrapper.find('#wpd-bubble-count').click();
                }
            }
            // 过滤无效的HASH
            function FilterHash(content, hash_match_raw) {
                let hash_match = [];
                let hash_set = {};

                function IsFound(content, regex) {
                    let match = content.match(regex);
                    if (match && match.length > 0) {
                        return true;
                    }
                    return false;
                }
                $.each(hash_match_raw, function(index, hash) {
                    // 包含前缀，不检查
                    if (IsFound(content, 'magnet:\\?xt=urn:btih:' + hash)) {
                        if (hash_match.indexOf('magnet:?xt=urn:btih:' + hash) == -1) {
                            hash_match.push('magnet:?xt=urn:btih:' + hash);
                        }
                        return;
                    }
                    let regexs = [
                        '\/' + hash, // 前面跟了一个斜杠，可能是目录名
                        hash + '\/', // 后面跟了一个斜杠，可能是目录名
                        hash + '\.', // 后面一个点，可能是文件名
                    ];
                    let is_valid = true;
                    $.each(regexs, function(index_, regex) {
                        if (IsFound(content, regex)) {
                            is_valid = false;
                            return false;
                        }
                    });
                    if (is_valid && hash_match.indexOf(hash) == -1) {
                        hash_match.push(hash);
                    }
                });

                return hash_match;
            }

            let e_content = $('.entry-content');
            let content = e_content.text();
            let hash_match_raw = content.match(/([a-zA-Z0-9]{40})|([a-zA-Z0-9]{32})/g);
            iLog.d(hash_match_raw);
            if (!hash_match_raw) {
                iLog.i('找不到任何磁力链接。');
                return;
            }
            let hash_match = FilterHash(content, hash_match_raw);
            iLog.d(hash_match);
            if (!hash_match) {
                iLog.i('找不到有效的磁力链接。');
                return;
            }

            // HASH 替换成老司机链接
            $.each(hash_match, function(index, hash) {
                let replace_text = '';
                let hash_only = GetHashFromMagnet(hash);
                replace_text = '<br><a id="od_link_' + hash_only + '" href="magnet:?xt=urn:btih:' + hash + '">老司机链接</a>(' + hash_only + ')<br>';
                // 不能修改整个 content，会导致 toggle 展不开
                let elements = FindElementByText(e_content, hash);
                $.each(elements, function(i, element) {
                    element.get(0).innerHTML = element.get(0).innerHTML.replace(hash, replace_text);
                });
            });

            AddBubble(hash_match);
            // initToast()
        }
        // 处理百度链接（仅评论区，新版链接）
        function ProcessBaiduNetdiskInComment() {
            // 从链接取出提取链接
            function GetKeyFromBaiduNetdiskLink(link) {
                if (link.indexOf('/s/') != -1) return link.replace('/s/', '');
                if (link.indexOf('s/') != -1) return link.replace('s/', '');
                return link;
            }
            // 过滤无效的提取链接
            function FilterCommentsKey(e_comments_raw) {
                let e_comments = [];

                $.each(e_comments_raw, function(i, comments) {
                    let e = comments.e;
                    let text = e.text();
                    let match = comments.key_match;
                    let keys = [];
                    $.each(match, function(i, key) {
                        // 前后有数字或字母
                        if (text.match('[0-9a-zA-Z]' + key) ||
                            text.match(key + '[0-9a-zA-Z]')) {
                            return;
                        }
                        // /s/***
                        if (text.match('\/s\/' + key)) {
                            keys.push('/s/' + key);
                            return;
                        }
                        // s/***
                        if (text.match('s\/' + key)) {
                            keys.push('s\/' + key);
                            return;
                        }
                        if (key.length == 22) {
                            key = '1' + key;
                        }
                        // 其他的不管
                        keys.push(key);
                    });
                    let codes = FindCodes(text, keys);
                    e_comments.push({
                        e: e,
                        keys: keys,
                        codes: codes,
                    });
                });

                return e_comments;
            }
            // 追加到气泡
            function AppendToBubble(e_comments) {
                let e_link_count = $('.od_link_count');
                let e_link_message = $('.od_link_message');
                let link_count_now = parseInt(e_link_count.text());
                $.each(e_comments, function(i, comment) {
                    let e = comment.e;
                    let keys = comment.keys;
                    let codes = comment.codes;

                    for (let key_id = 0; key_id < keys.length; ++key_id) {
                        if (link_count_now > 0) {
                            e_link_message.append('<br>');
                        }
                        let key = keys[key_id];
                        let span = $('<span></span>');
                        let link_jump = $('<a id="od_bubble_jump_' + (link_count_now + 1) + '" style="color:#fff;">定位到评论</a>');
                        let key_only = GetKeyFromBaiduNetdiskLink(key);
                        let code_text = (codes.length == 0 ? '(无提取码)' : '(' + codes[key_id] + ')');
                        let code_in_href = (codes.length == 0 ? '' : '#tq=' + codes[key_id]);
                        let link_download = $('<a id="od_bubble_link_' + (link_count_now + 1) + '" target="_blank" href="https://pan.baidu.com/s/' + key_only + code_in_href + '" style="color:#fff; margin-left: 10px;">' + key_only + code_text + '</a>');
                        link_jump.click(function() {
                            $('body, html').animate({scrollTop: e.offset().top}, 500);
                        });
                        span.append(link_jump).append(link_download);
                        e_link_message.append(span);
                        link_count_now += 1;
                    }
                    e_link_count.text(link_count_now);
                });
            }

            let comment_count = parseInt($('#wpd-threads').find('.wpd-thread-info ').find('.wpdtc').text());
            if (comment_count == 0) {
                return;
            }
            let itv = setInterval(function() {
                let e_comment_text = $('.wpd_comment_level-1');
                let e_comments_raw = [];
                if (e_comment_text.length == 0) return;
                clearInterval(itv);
                $.each(e_comment_text, function(i, e_comment) {
                    let e_content = $(e_comment).find('.wpd-comment-text:first');
                    // 貌似 22 长度的是 surl= 版本的，前面加个 1 就能用 /s/
                    let key_match = e_content.text().match(/[a-zA-Z0-9-_]{22,23}/g);
                    if (key_match && key_match.length > 0) {
                        e_comments_raw.push({e: e_content, key_match: key_match});
                    }
                });
                iLog.d(e_comments_raw);
                let e_comments = FilterCommentsKey(e_comments_raw);
                iLog.d(e_comments);

                $.each(e_comments, function(i, comment) {
                    let e_comment = comment.e;
                    let keys = comment.keys;
                    let codes = comment.codes;

                    for (let key_id = 0; key_id < keys.length; ++key_id) {
                        let e = e_comment.get(0);
                        let key = keys[key_id];
                        let code = codes[i];
                        let code_in_href = (code == null ? '' : '#tq=' + code);
                        let key_only = GetKeyFromBaiduNetdiskLink(key);
                        let replace_html = '<a target="_blank" style="padding-left: 5px;" href="https://pan.baidu.com/s/' + key_only + code_in_href + '">前往百度网盘</a>'
                        e.innerHTML = e.innerHTML.replace(key, key + replace_html);
                    }
                });

                AppendToBubble(e_comments);
            }, 100);
        }
        // 快捷键
        function AddQuickKeyboardActions() {
            keydown_functions.liuli_keydown = function(event, last_event) {
                let double_click = (last_event && last_event.keyCode == event.keyCode && (event.timeStamp - last_event.timeStamp) < 300);
                let handled = false;
                if ((event.keyCode >= 49 && event.keyCode <= 57) ||
                    event.keyCode >= 97 && event.keyCode <= 105) {
                    let num = 9;
                    if (event.keyCode <= 57) {
                        num -= (57 - event.keyCode);
                    } else {
                        num -= (105 - event.keyCode);
                    }
                    if (event.ctrlKey) {
                        $('#od_bubble_jump_' + num).click();
                        handled = true;
                    } else if (event.altKey) {
                        let link = $('#od_bubble_link_' + num);
                        if (link.length > 0) {
                            let href = link.attr('href');
                            window.open(href);
                            handled = true;
                        }
                    }
                }
                switch(event.keyCode) {
                    case 17: // ctrl
                        if (double_click) {
                            $('#od_bubble_jump_1').click();
                            handled = true;
                        }
                        break;
                    case 37: // left
                        if (IsInputElement(event.target)) {
                            break;
                        }
                        if (IsMainPage()) { // 上一页
                            let a = $('li.active_page').prev().children('a');
                            if (a.length > 0) {
                                location.href = a.attr('href');
                                handled = true;
                            }
                        } else if (IsArticlePage()) { // 上一篇
                            let a = $('.nav-previous').children('a');
                            if (a.length > 0) {
                                location.href = a.attr('href');
                                handled = true;
                            }
                        }
                        break;
                    case 38: // up
                        if (event.ctrlKey) { // 顶部
                            $('body, html').animate({scrollTop: 0}, 500);
                            handled = true;
                        }
                        break;
                    case 39: // right
                        if (IsInputElement(event.target)) {
                            break;
                        }
                        if (IsMainPage()) { // 下一页
                            let a = $('li.active_page').next().children('a');
                            if (a.length > 0) {
                                location.href = a.attr('href');
                                handled = true;
                            }
                        } else if (IsArticlePage()) { // 下一篇
                            let a = $('.nav-next').children('a');
                            if (a.length > 0) {
                                location.href = a.attr('href');
                                handled = true;
                            }
                        }
                        break;
                    case 40: // down
                        if (event.ctrlKey) { // 底部
                            $('body, html').animate({scrollTop: $('footer:last').offset().top}, 500);
                            handled = true;
                        }
                        break;
                }
                if (handled) {
                    event.preventDefault();
                }
            };
        }

        if (IsArticlePage()) {
            ProcessMagnetInContent();
            ProcessBaiduNetdiskInComment();
        }

        AddQuickKeyboardActions();
    },
}, {
    name: '灵梦御所',
    pattern: /https:\/\/blog.reimu.net/,
    process: function() {
        function IsMainPage() {
            return location.href.match(/https:\/\/blog\.reimu\.net\/?$/) ||
                location.href.match(/https:\/\/blog\.reimu\.net\/page\//);
        }
        function IsArticlePage() {
            return location.href.match(/https:\/\/blog\.reimu\.net\/archives\/\d+/);
        }
        function AddJumpToClass(element) {
            if ($('.od_jump_to').length == 0) {
                element.addClass('od_jump_to');
            }
        }
        // 展开隐藏内容
        function ExpandHideContent() {

            function ResetBtnPosition() {
                let btn = $('#od_link_btn');
                let margin_right = parseInt($('#main').children('article').css('margin-right'));
                let left = $('#main').offset().left + parseInt($('#main').css('width')) - margin_right;
                if (margin_right == 0) {
                    left -= parseInt($('#main').children('article').children('header').css('padding-right'));
                }
                let top = parseInt($('#main').css('padding-top'));
                if ($('.secondary-toggle').css('display') == 'block') {
                    top += parseInt($('.sidebar').css('height'));
                }
                btn.css({
                    'right': '44px',
                    'top': '72px',
                });

                let btnCopy = $('#od_all_links_copy_btn');
                btnCopy.css({
                    'right': '44px',
                    'top': '142px',
                });
            }

            let btn = $('<button id="od_link_btn" style="position: fixed; top: 0px; right: 0px; display: none;">看见这个说明有问题</button>');
            btn.click(function() {
                let e_hide_content = $('.entry-content').find('pre');
                if (e_hide_content.length > 0) {
                    e_hide_content.css('display', 'block');
                    $('body, html').animate({scrollTop: $(e_hide_content).offset().top}, 500);
                } else if ($('.od_jump_to').length > 0) {
                    $('body, html').animate({scrollTop: $('.od_jump_to:first').offset().top - 70}, 500);
                }

                //新增显示拷贝秒传链接按钮
                if (reimu_result_all_links.length > 5) {
                	$('#od_all_links_copy_btn').show();
                }

            });
            $('body').append(btn);


            //百度秒传链接拷贝按钮-TK
            let btnCopy = $('<button id="od_all_links_copy_btn" style="position: fixed; top: 0px; right: 0px; display: none;">&nbsp;  拷贝网盘秒传链接  &nbsp; </button>');
            btnCopy.click(function() {
                console.log("btnCopy click。。。。。")
                copyReimuDuPanLinks();
            });
            $('body').append(btnCopy);


            ResetBtnPosition();
            resize_functions.reimu_resize_btn_position = ResetBtnPosition;
        }
        // 磁力链接
        function ProcessMagnetInContent() {
            let e_content = $('.entry-content');
            let content = e_content.text();
            let match = content.match(/magnet:\?xt=urn:btih:([a-zA-Z0-9]{40}|[a-zA-Z0-9]{32})/g);
            if (!match || match.length == 0) {
                iLog.w('找不到磁力链接，可能已经是链接状态。');
                return 0;
            }

            $.each(match, function(i, magnet) {
                let replace_html = '<a href="' + magnet + '">' + magnet + '</a>';
                let replace_node = FindElementByText(e_content, magnet);
                if (replace_node.length > 0) {
                    replace_node = replace_node[0];
                    replace_node.get(0).innerHTML = replace_node.get(0).innerHTML.replace(magnet, replace_html);
                    AddJumpToClass(replace_node);
                }
            });

            return match.length;
        }
        // 秒传链接
        function ProcessFastLinkInContent() {
            let e_content = $('.entry-content');
            let content = e_content.text();
            let link_match = content.match(/([0-9A-F]{32}#[0-9A-F]{32}#\d+#.*\n)|(bdpan:\/\/[0-9a-zA-Z+=]+)/g);
            iLog.d(link_match);
            if (!link_match) {
                iLog.i('没有秒传链接');
                return 0;
            }

            let link_all = '';
            let first_replace_element = null;
            $.each(link_match, function(i, link) {
                link = link.trim();
                let e = FindElementByText(e_content, link);
                if (e.length == 0) {
                    iLog.w('找不到所在元素。');
                    return;
                }
                e = e[0];
                if (first_replace_element == null) {
                    first_replace_element = e;
                }
                let encoded = encodeURIComponent(link + '\n');
                let replace_html = '<a target="_blank" style="color: #55c3dc;" href="https://pan.baidu.com/disk/main#/index?category=all&mc=' + encoded + '">前往百度网盘</a>' + link + '<br>';
                e.get(0).innerHTML = e.get(0).innerHTML.replace(link, replace_html);
                link_all += encoded;
                AddJumpToClass(e);

            });
             // console.log(`百度秒传链接link_all:\n${link_all}`);
             // console.log(`百度秒传链接llink_match:\n${link_match}`);

            //灵梦御所-所有百度秒传链接
            let res_link_all = link_match.join('');
            console.log(`百度秒传链接res_link_all:\n${res_link_all}`);
            reimu_result_all_links = res_link_all;


            // 超过两个秒传链接，添加一个批量转存的链接
            if (link_match.length < 2) {
                return link_match.length;
            }
            let href = 'https://pan.baidu.com/disk/main#/index?category=all&mc=' + link_all;
            if (href.length > 8182) {
                iLog.e('秒传链接过多，无法批量添加。');
                return link_match.length;
            }
            let save_all_link = $('<a target="_blank" style="color: #55c3dc;" href=' + href + '>批量添加' + link_match.length + '个秒传链接</a>');
            if (e_content.find('pre').length > 0) {
                e_content.find('pre:first').prepend('<br><br>').prepend(save_all_link);
            } else if (first_replace_element != null) {
                $(first_replace_element).before(save_all_link);
                $(first_replace_element).before('<br>');
            }

            return link_match.length;
        }
        // 百度链接附加提取码
        function ProcessBaiduNetDiskCode() {
            // 御所都是完整的百度网盘链接，不需要找
            let e_content = $('.entry-content');
            let e_links = e_content.find('a');

            let found_valid_element = false;
            $.each(e_links, function(i, e_link) {
                let _this = $(e_link);
                let link_href = _this.attr('href');
                if (!link_href) {
                    return;
                }
                let match = link_href.match(/https:\/\/pan\.baidu\.com\/s\/[a-zA-Z0-9-_]{23}/);
                if (match) {
                    let temp_span = $('<span style="display: none;">' + match[0] + '</span>');
                    _this.after(temp_span);
                    let codes = FindCodes(e_content.text(), match);
                    if (codes.length > 0) {
                        _this.attr('href', link_href + '#tq=' + codes[0]);
                    } else {
                        iLog.w('找不到对应的提取码：' + link_href);
                    }
                    temp_span.remove();
                    found_valid_element = true;
                    AddJumpToClass(_this);
                }
            });
            if (!found_valid_element) {
                iLog.i('找不到百度网盘链接。');
                return 0;
            }

            return 1;
        }
        // 快捷键
        function AddQuickKeyboardActions() {
            keydown_functions.reimu_keydown = function(event, last_event) {
                let double_click = (last_event && last_event.keyCode == event.keyCode && (event.timeStamp - last_event.timeStamp) < 300);
                switch(event.keyCode) {
                    case 17: // ctrl
                        if (double_click ) { // 双击前往隐藏内容
                            $('#od_link_btn').click();
                        }
                        break;
                    case 37: // left
                        if (IsInputElement(event.target)) {
                            break;
                        }
                        if (IsMainPage()) { // 上一页
                            $('span.current').prev().click();
                        } else if (IsArticlePage()) { // 上一篇
                            $('.nav-previous').children('a').click();
                        }
                        break;
                    case 38: // up
                        if (event.ctrlKey) { // 顶部
                            $('body, html').animate({scrollTop: 0}, 500);
                        }
                        break;
                    case 39: // right
                        if (IsInputElement(event.target)) {
                            break;
                        }
                        if (IsMainPage()) { // 下一页
                            $('span.current').next().click();
                        } else if (IsArticlePage()) { // 下一篇
                            $('.nav-next').children('a').click();
                        }
                        break;
                    case 40: // down
                        if (event.ctrlKey) { // 底部
                            $('body, html').animate({scrollTop: $('footer:last').offset().top}, 500);
                        } else if (double_click) {
                            $('#od_link_btn').click();
                        }
                        break;
                }
            }
        }

        ExpandHideContent();
        AddQuickKeyboardActions();


        let current_href = '';
        let processed = false;
        // 御所是不刷新的
        setInterval(function() {
            let processed = $('.entry-content').hasClass('od_processed');
            if (!processed) {
                $('.entry-content').addClass('od_processed');
                let link_count = 0;
                link_count += ProcessBaiduNetDiskCode();
                link_count += ProcessMagnetInContent();
                link_count += ProcessFastLinkInContent();
                iLog.i(link_count);
                if ($('.entry-content').find('pre').length > 0) {
                    $('#od_link_btn').text('显示并前往隐藏内容').show();
                    //显示百度秒传拷贝按钮
                    // $('#od_all_links_copy_btn').show();
                } else if (link_count > 0) {
                    $('#od_link_btn').text('前往下载内容').show();
                    //显示百度秒传拷贝按钮
                    // $('#od_all_links_copy_btn').show();
                } else {
                    $('#od_link_btn').hide();
                    //隐藏百度秒传拷贝按钮
                    // $('#od_all_links_copy_btn').hide();
                }
            }
        }, 300);
    },
}, {
    name: '忧郁的loli',
    pattern: /https:\/\/www\.kkgal\.com\/.*\.html/,
    process: function() {
        // 中国线路保存30天（无法保证线路有效）
        function ProcessChineseLink() {
            let id_keys = COOKIES.get('kkgal_id_keys');
            if (id_keys == null) {
                id_keys = {};
            }

            let onedrive_panel = FindElementByText($('.panel-primary'), 'Onedrive');
            if (onedrive_panel.length == 0) {
                iLog.e('没有找到OneDrive下载链接。');
                return;
            }
            onedrive_panel = onedrive_panel[0].parent();
            let span = FindElementByText(onedrive_panel, '资源编号');
            if (span.length == 0) {
                iLog.e('无法解析资源编号。');
                return;
            }
            let id = span[0].children('span:first').text();
            if (onedrive_panel.find('input[value="购买"]').length > 0) {
                iLog.i('中国线路需要购买，正在查询30天内是否购买过。');
            } else {
                // 保存
                let btns = onedrive_panel.find('button');
                $.each(btns, function(i, btn) {
                    btn = $(btn);
                    let link = btn.attr('onclick');
                    if (link.indexOf('odcn.') != -1) {
                        let match = link.match(id + '_(.*)_');
                        if (match) {
                            id_keys[id] = match[1];
                            iLog.i('已保存中国线路：' + id + '-' + match[1]);
                            COOKIES.set('kkgal_id_keys', id_keys, 30);
                            return;
                        }
                    }
                });
                return;
            }
            // 查找并替换链接
            if (id_keys[id] == null) {
                iLog.i('找不到购买记录，需要购买后查看中国线路。');
                return;
            }
            let btn_internaltional = onedrive_panel.find('button:first');
            if (btn_internaltional.length == 0) {
                iLog.e('找不到国际线路。');
                return;
            }
            let link = btn_internaltional.attr('onclick').replace('window.open(\'', '').replace('\')', '');
            if (link.indexOf('od.') == -1) {
                iLog.e('链接格式不正确，需要更新。');
                return;
            }
            link = link.replace('od.', 'odcn.');
            link = link.replace(':8080/', ':8080/' + id + '_' + id_keys[id] + '_');
            iLog.d(link);
            let body = onedrive_panel.find('.panel-body');
            body.prepend('<a class="hint--right" data-hint="下载前请务必看一下新人必读和解压必读"><button type="button" class="btn btn-danger" onclick="window.open(\'' + link + '\')"><font color="#ffffff">链接</font></button></a>');
            body.prepend('<b><span style="font-size: 10pt;">中国线路(本地保存)：</span></b>');
        }
        // 快捷键
        function AddQuickKeyboardActions() {
            keydown_functions.kkgal_keydown = function(event, last_event) {
                let double_click = (last_event && last_event.keyCode == event.keyCode && (event.timeStamp - last_event.timeStamp) < 300);
                let handled = false;
                switch(event.keyCode) {
                    case 17: // ctrl
                        if (double_click ) { // 双击前往下载位置
                            $('body, html').animate({scrollTop: $('.panel-primary:first').offset().top}, 500);
                        }
                        break;
                    case 38: // up
                        if (event.ctrlKey) { // 顶部
                            $('body, html').animate({scrollTop: 0}, 500);
                        }
                        break;
                    case 40: // down
                        if (event.ctrlKey) { // 底部
                            $('body, html').animate({scrollTop: $('footer:last').offset().top}, 500);
                        } else if (double_click) {
                            $('#od_link_btn').click();
                        }
                        break;
                }
            };
        }

        ProcessChineseLink();
        AddQuickKeyboardActions();
    },
}, {
    name: '百度网盘-主页-秒传',
    pattern: /https:\/\/pan\.baidu\.com\/disk\/main.*&mc=/,
    process: function() {
        // 加载秒传链接
        function LoadFastLink() {
            let detect_count = 0;
            let itv = setInterval(function() {
                let href = location.href;
                let match = href.match(/&mc=([^&#]+)/);
                if (!match) {
                    clearInterval(itv);
                    iLog.e('找不到秒传链接！');
                    return;
                }
                let fast_link = decodeURIComponent(match[1]);
                let btn = $('#bdlink_btn');
                if (btn.length == 0) {
                    if (++detect_count >= 50) {
                        iLog.e('未安装秒传插件，即将退出。');
                        iLog.i('需要安装：https://greasyfork.org/zh-CN/scripts/424574');
                        let go = confirm('未安装秒传插件，点击确定前往安装。');
                        if (go) {
                            GM_openInTab('https://greasyfork.org/zh-CN/scripts/424574', false);
                        }
                        clearInterval(itv);
                        return;
                    }
                    if (detect_count % 10 == 0) {
                        iLog.w('未安装秒传插件，剩余尝试次数：' + (50 - detect_count));
                    }
                    return;
                }
                clearInterval(itv);
                itv = setInterval(function() {
                    iLog.i('点击秒传按钮。');
                    btn.children('span').click();
                    setTimeout(function() {
                        if ($('.swal2-textarea').length > 0) {
                            clearInterval(itv);
                        }
                        iLog.i('填写秒传链接。');
                        $('.swal2-textarea').val(fast_link);
                    }, 100);
                }, 200);
            }, 100);
        }

        LoadFastLink();
    },
}, {
    name: '百度网盘-分享',
    pattern: /https:\/\/pan\.baidu\.com\/s\/.*#tq=|https:\/\/pan\.baidu\.com\/share\/init\?surl=.*#tq=/,
    process: function() {
        let code_match = location.href.match(/#tq=([^&]+)/);
        if (!code_match) {
            iLog.e('找不到提取码。');
            return;
        }
        let code = code_match[1];
        let input = [];
        let dt = FindElementByText($('.verify-input'), '请输入提取码');
        if (dt.length == 0) {
            iLog.w('找不到输入框，尝试其他方式。');
        } else {
            input = dt[0].next().find('input');
            if (input.length == 0) {
                iLog.w('找不到输入框，尝试其他方式。');
                input = $('input[tabindex="1"]');
            }
        }
        if (input.length == 0) {
            iLog.e('找不到输入框，请手动填写。');
            return;
        }
        input.val(code);
        let btn = $('#submitBtn');
        btn.click();
    },
}, {
    name: '通用',
    pattern: /.*/,
    process: function() {
        function TryHideImages() {
            let safe_mode_cookie = COOKIES.get('all_safe_mode');
            if (safe_mode_cookie != null && safe_mode_cookie.enable) {
                HideAllImages();
            }
        }

        if (location.href.match(/https:\/\/pan.baidu.com\//)) {
            return;
        }

        TryHideImages();
        setInterval(TryHideImages, 100);

        keydown_functions.general_keydown = function(event, last_event) {
            if (event.ctrlKey && event.shiftKey && event.keyCode == 83) {
                let safe_mode_cookie = COOKIES.get('all_safe_mode');
                if (safe_mode_cookie && safe_mode_cookie.enable) {
                    COOKIES.del('all_safe_mode');
                    ShowAllHiddenImages();
                    iLog.i('安全模式关闭');
                } else {
                    COOKIES.set('all_safe_mode', {enable: true}, 365);
                    HideAllImages();
                    iLog.i('安全模式开启');
                }
                event.preventDefault();
            }
        };
    }
}];

checkJQuery().then(function(success) {
    if (!success) {
        return;
    }

    let url = location.href;
    $.each(sites, function(index, site) {
        if (!url.match(site.pattern)) {
            return;
        }
        iLog.i(site.name);
        site.process();
    });

    $(window).resize(function() {
        $.each(resize_functions, function(name, func) {
            func();
        });
    });

    $(window).keydown(function(event) {
        $.each(keydown_functions, function(name, func) {
            func(event, last_keydown_event);
        });
        last_keydown_event = event;
    });
});