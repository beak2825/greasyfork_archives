// ==UserScript==
// @name         视频学习脚本
// @namespace    http://tampermonkey.net/
// @version      6.9.1
// @description  支持:
// @author
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.close
// @antifeature  payment
// @noframes
// @icon         https://www.zhihuishu.com/favicon.ico
// @connect      www.gaozhiwang.top
// @connect      localhost
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477072/%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/477072/%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
(function () {
  let basehost = 'http://www.gaozhiwang.top';
  let bserUrl = 'http://www.gaozhiwang.top:7001';
  const panelcss = `
        .myTool{
            background: #fff;
            width: 234px;
            font-size: 14px;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: fixed;
            z-index: 999;
            top: 70px;
            left: 44px;
            box-sizing: border-box;
            padding: 15px 9px;
            border-radius: 5px;
            box-shadow: 0 0 9px rgba(0,0,0,.5);
        }
        .controls{
            position: absolute;
            right: 12px;
            font-size: 27px;
            top: 9px;
            cursor: pointer;
            transition: all 0.4s;
        }
        .controls:hover{
            color: #1f74c;
            transform: rotate(360deg);
        }
        
        .myTool-content{
            transition: all 0.4s;
            overflow: hidden;
        }
        .mytoolkeyipt{
            width: 130px;
            height: 22px !important;
            outline: none;
            padding: 0px 3px;
            border: 1px solid #757575FF;
            border-radius: 3px;
            font-size: 13px;
            padding: 0px 3px;
            margin-right: 5px;
            margin-top: 2px;
        }
        .addkey-btn{
            color: #fff;
            background: #1f74ca;
        }
        .removkey-btn{
            color: #000;
            display: none;
            background: #eee;
        }
        .handleKeyBtn{
            width: 54px;
            height: 24px;
            margin-top: 2px;
            border: none;
            font-size: 12px;
            border-radius: 2px;
            cursor: pointer;
        }
        
        .handleSpeedUp{
            background: orange;
            font-size: 12px;
            color: #fff;
            padding: 4px 15px;
            border-radius: 5px;
            margin: 0 auto;
            max-width: 80px;
            margin-top: 10px;
            cursor: pointer;
            text-align: center;
        }
        .ctxTipWrap{
            min-width: 200px;
            min-height: 50px;
            text-align: center;
            line-height: 50px;
            background: #fff;
            position: fixed;
            z-index: 999;
            left: 50%;
            top: 50%;
            border-radius: 9px;
            box-shadow: 0 0 5px rgba(0,0,0,.6);
            display:none;
        }
        .cxtsection{
          width: 100%;
          box-sizing: border-box;
          padding: 0 5px;
          margin-bottom: 2px;
        }
        .cxtsection .ctx-title{
          text-align: left;
          margin-top: 12px;
          font-size: 12px;
          color: #4e5969;
          border-left: 2px solid #1f74ca;
          border-radius: 2px;
          padding-left: 3px;
          line-height: 16px;
        }
        .ctxsection2{
          display: flex;
          justify-content: space-between;
        }
        .ctxsection2 .speed-select{
          width: 50%;
          height: 22px !important;
          outline: none;
          position: relative;
          top: 10px;
          border: 1px solid #757575FF;
          border-radius: 3px;
          padding: 0;
          padding-left: 10px;
        }
        .ctxsection3{
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .feedbackBtn{
            font-size: 13px;
            position: relative;
            top: 5px;
            cursor: pointer;
            color: #000;
        }
        a{
            text-decoration: none;
        }
    `;
  class GMTool {
    constructor() {}
    getValue(key) {
      let result = GM_getValue(key, null);
      return result;
    }
    setValue(key, value) {
      GM_setValue(key, value);
    }
    openInTab(url) {
      GM_openInTab(url, {
        active: true
      });
    }
  }
  const MyTool = new GMTool();
  let ElementObj = {};
  let Internetcourse = {
    zhihuishu: {
      id: 1,
      mainClass: 'zhihuishu',
      name: '\u667a\u6167\u6811',
      host: ['zhihuishu.com']
    },
    uxueyuan: {
      id: 2,
      mainClass: 'uxueyuan',
      name: 'U\u5b66\u9662',
      host: ['ua.ulearning.cn']
    },
    ningmengwencai: {
      id: 3,
      mainClass: 'ningmengwencai',
      name: '\u67e0\u6aac\u6587\u624d',
      host: ['www.wencaischool.net', 'study.wencaischool.net', 'learning.wencaischool.net']
    },
    xuexitong: {
      id: 4,
      mainClass: 'xuexitong',
      name: '\u5b66\u4e60\u901a',
      host: []
    },
    henanxinxueyuan: {
      id: 5,
      mainClass: 'henanxinxueyuan',
      name: '\u6cb3\u5357\u65b0\u95fb\u51fa\u7248\u5b66\u6821',
      host: ['218.29.91.122:81']
    },
    fujianshifan: {
      id: 6,
      mainClass: 'fujianshifan',
      name: '\u798f\u5efa\u5e08\u8303\u7ee7\u7eed\u6559\u80b2',
      host: ['neo.fjnu.cn']
    },
    gxcic: {
      id: 7,
      mainClass: 'gxcic',
      name: '\u5e7f\u897f\u4f4f\u623f\u57ce\u4e61\u5efa\u8bbe\u884c\u4e1a\u4e13\u4e1a\u4eba\u5458\u7ee7\u7eed\u6559\u80b2\u5e73\u53f0',
      host: ['jxjy.gxcic.net:9092']
    },
    luohexueyuan: {
      id: 8,
      mainClass: 'luohexueyuan',
      name: '\u6f2f\u6cb3\u5b66\u9662',
      host: ['lhycjy.cloudwis.tech']
    },
    mengxiangzaixian: {
      id: 9,
      mainClass: 'mengxiangzaixian',
      name: '\u68a6\u60f3\u5728\u7ebf',
      host: ['www.mxdxedu.com']
    },
    fjsf2: {
      id: 6,
      mainClass: 'fjsf2',
      name: 'fjnu',
      host: ['nto.fjnu.cn']
    },
    liangyijiaoyu: {
      id: 11,
      mainClass: 'liangyijiaoyu',
      name: '\u826f\u533b\u6559\u80b2',
      host: ['www.sclyedu.com']
    },
    zjzx: {
      id: 12,
      mainClass: 'zjzx',
      name: '\u5b89\u5fbd\u4e13\u4e1a\u6280\u672f\u4eba\u5458\u7ee7\u7eed\u6559\u80b2\u5728\u7ebf',
      host: ['www.zjzx.ah.cn']
    },
    zxpxmr: {
      id: 13,
      mainClass: 'zxpxmr',
      name: '\u5168\u56fd\u6587\u5316\u548c\u65c5\u6e38\u5e02\u573a\u5728\u7ebf\u57f9\u8bad\u7cfb\u7edf',
      host: ['zxpx.mr.mct.gov.cn']
    },
    ggfw: {
      id: 14,
      mainClass: 'ggfw',
      name: '\u5e7f\u4e1c\u8fdc\u7a0b\u804c\u4e1a\u57f9\u8bad\u5e73\u53f0',
      host: ['ggfw.hrss.gd.gov.cn']
    },
    liangshizaixian: {
      id: 15,
      mainClass: 'liangshizaixian',
      name: '\u826f\u5e08\u5728\u7ebf',
      host: []
    },
    gzjxjy: {
      id: 16,
      mainClass: 'gzjxjy',
      name: '\u8d35\u5dde\u7701\u4e13\u4e1a\u6280\u672f\u4eba\u5458\u7ee7\u7eed\u6559\u80b2\u5e73\u53f0',
      host: ['gzjxjy.gzsrs.cn', 'www.gzjxjy.gzsrs.cn'],
      runtype: -1
    },
    mingshiclass: {
      id: 17,
      mainClass: 'mingshiclass',
      name: '\u540d\u5e08\u8bfe\u5802',
      host: ['saas.mingshiclass.com']
    },
    qiangshi: {
      id: 18,
      mainClass: 'qiangshi',
      name: '\u5f3a\u5e08',
      host: ['zjdx-kfkc.webtrn.cn/', 'zjdx-kfkc.webtrn.cn']
    },
    lanzhgoulgjs: {
      id: 19,
      mainClass: 'lanzhgoulgjs',
      name: '\u5170\u5dde\u7406\u5de5\u5927\u5b66\u6559\u5e08',
      host: ['gs.chinamde.cn', 'gansu.chinamde.cn', 'jilin.chinamde.cn']
    },
    beijingjiaoshi: {
      id: 20,
      mainClass: 'beijingjiaoshi',
      name: '\u5317\u4eac\u6559\u5e08\u5b66\u4e60\u7f51',
      host: []
    },
    qingyangzgzjzj: {
      id: 21,
      mainClass: 'qingyangzgzjzj',
      name: '\u7518\u8083\u5e86\u9633\u7ee7\u7eed\u6559\u80b2',
      host: ['wws.zgzjzj.com', 'gsmtdzj.zgzjzj.com', 'qingyang.zgzjzj.com/', 'lzksj.zgzjzj.com', 'pl.zgzjzj.com', 'www.zgzjzj.com', 'bys.zgzjzj.com', 'www.zgzjzj.com']
    },
    lanzhouwenli: {
      id: 22,
      mainClass: 'lanzhouwenli',
      name: '\u5170\u5dde\u6587\u7406\u5b66\u9662\u7ee7\u7eed\u6559\u80b2',
      host: ['jxjypt.luas.edu.cn']
    },
    xuexituqiang: {
      id: 23,
      mainClass: 'xuexituqiang',
      name: '\u5b66\u4e60\u56fe\u5f3a',
      host: ['user.hzboolan.cn']
    },
    guojiazhihuijiaoyu: {
      id: 24,
      mainClass: 'guojiazhihuijiaoyu',
      name: '\u56fd\u5bb6\u667a\u6167\u6559\u80b2\u516c\u5171\u670d\u52a1\u5e73\u53f0',
      host: ['teacher.vocational.smartedu.cn']
    },
    lanzhouchengren: {
      id: 25,
      mainClass: 'lanzhouchengren',
      name: '\u5170\u5dde\u5927\u5b66\u6210\u4eba\u6559\u80b2',
      host: ['lzjtujxjyxylms.sccchina.net', 'zgkydxlms.sccchina.net', 'courseresource.zhihuishu.com', 'lzulms.chinaedu.net', 'cjlzulms.sccchina.net', 'cjlzu.sccchina.net']
    },
    tsbtchinamde: {
      id: 26,
      mainClass: 'tsbtchinamde',
      name: '\u5929\u6c34\u535a\u901a\u804c\u4e1a\u6280\u672f\u57f9\u8bad\u5b66\u6821',
      host: ['tsbt.chinamde.cn', 'btzjc.tsbtgs.cn', 'www.tsbtgs.cn']
    },
    henangongshe: {
      id: 27,
      mainClass: 'henangongshe',
      name: '\u6cb3\u5357\u7701\u4e13\u4e1a\u6280\u672f\u4eba\u5458\u5b66\u4e60\u516c\u793e',
      host: [],
      remark: '\u548c\u5317\u4eac\u6559\u5e08\u4e00\u6837\u7684'
    },
    zjzjsrc: {
      id: 28,
      mainClass: 'zjzjsrc',
      name: '\u6d59\u6c5f\u7701\u4f4f\u623f\u548c\u57ce\u4e61\u5efa\u8bbe\u884c\u4e1a\u4e13\u4e1a\u6280\u672f\u4eba\u5458\u7ee7\u7eed\u6559\u80b2\u7cfb\u7edf',
      host: ['zj.zjjsrc.cn']
    },
    lzrejxjy: {
      id: 29,
      mainClass: 'lzrejxjy',
      name: '\u5170\u5dde\u8d44\u6e90\u73af\u5883\u804c\u4e1a\u6280\u672f\u5927\u5b66',
      host: ['lzrejxjy.webtrn.cn', 'zjyxldpx-kfkc.webtrn.cn', 'ttedu-kfkc.webtrn.cn', 'hnssydw-kfkc.webtrn.cn']
    },
    xuzhouyikedaxue: {
      id: 30,
      mainClass: 'xuzhouyikedaxue',
      name: '\u5f90\u5dde\u533b\u79d1\u5927\u5b66',
      host: ['cjyxljy.xzhmu.edu.cn', 'ycjy.lut.edu.cn', 'cj1047-kfkc.webtrn.cn']
    },
    xibeisfzyjy: {
      id: 31,
      mainClass: 'xibeisfzyjy',
      name: '\u897f\u5317\u5e08\u8303\u5927\u5b66\u4e13\u4e1a\u6280\u672f\u4eba\u5458\u7ee7\u7eed\u6559\u80b2\u57fa\u5730',
      host: ['sdzj.nweduline.com', 'xbsd.lt-edu.net', 'preview.dccloud.com.cn']
    },
    zgrtvu: {
      id: 32,
      mainClass: 'zgrtvu',
      name: '\u81ea\u8d21\u5f00\u53d1\u5927\u5b66',
      host: ['zgrtvu.peixunyun.cn', 'ua.peixunyun.cn']
    },
    henandikuang: {
      id: 33,
      mainClass: 'henandikuang',
      name: '\u90d1\u5dde\u5e02\u4e13\u4e1a\u6280\u672f\u4eba\u5458\u7ee7\u7eed\u6559\u80b2\u4e13',
      host: ['dkgc.zyk.ghlearning.com', 'zzszyk.user.hnhhlearning.com']
    },
    tazhuanjipx: {
      id: 34,
      mainClass: 'tazhuanjipx',
      name: '\u6cf0\u5b89\u5e02\u4e13\u4e1a\u6280\u672f\u4eba\u5458\u7eed\u6559\u80b2\u57f9\u8bad\u5e73\u53f0',
      host: ["ta.zhuanjipx.com", "sdta-zyk.yxlearning.com", "sdta-gxk.yxlearning.com"]
    },
    henanzhuanjipeixun: {
      id: 35,
      mainClass: 'henanzhuanjipeixun',
      name: '\u6cb3\u5357\u4e13\u6280\u57f9\u8bad',
      host: ['www.jxjyedu.org.cn']
    },
    zhejiangtjj: {
      id: 32,
      mainClass: 'zhejiangtjj',
      name: '\u6d59\u6c5f\u7edf\u8ba1\u6559\u80b2\u57f9\u8bad\u5728\u7ebf\u5b66\u4e60\u4e2d\u5fc3',
      host: ['edu.tjj.zj.gov.cn']
    },
    guizhouzxjxjy: {
      id: 37,
      mainClass: 'guizhouzxjxjy',
      name: '\u8d35\u5dde\u7ee7\u7eed\u6559\u80b2\u7f51',
      host: ['guizhou.zxjxjy.com']
    },
    jiangxizhipeizaixian: {
      id: 38,
      mainClass: 'jiangxizhipeizaixian',
      name: ' \u6c5f\u897f\u804c\u4e1a\u57f9\u8bad',
      host: ['jiangxi.zhipeizaixian.com']
    },
    anhuijixujyzx: {
      id: 39,
      mainClass: 'anhuijixujyzx',
      name: ' \u5b89\u5fbd\u7ee7\u7eed\u6559\u80b2\u5728\u7ebf',
      host: ['main.ahjxjy.cn']
    },
    lanzhoudxgs: {
      id: 40,
      mainClass: 'lanzhoudxgs',
      name: ' \u5170\u5dde\u5927\u5b66\u6559\u80b2\u57f9\u8bad',
      host: ['gsjzlzu.sccchina.net']
    },
    jidianshejijiaoyu: {
      id: 41,
      mainClass: 'jidianshejijiaoyu',
      name: '\u7ee7\u7eed\u6559\u80b2\u5b66\u4e60\u5e73\u53f0',
      host: ['sdjj.ct-edu.com.cn', 'scjylearning.o-learn.cn', 'gzmtulearning.o-learn.cn']
    },
    henanzhujianjy: {
      id: 42,
      mainClass: 'henanzhujianjy',
      name: '\u6cb3\u5357\u7701\u4f4f\u5efa\u4e13\u4e1a\u6280\u672f\u4eba\u5458\u7ee7\u7eed\u6559\u80b2',
      host: ['zjpx.icitpower.com:8080']
    },
    sipingnengcun: {
      id: 43,
      mainClass: 'sipingnengcun',
      name: '\u56db\u5e73\u519c\u6751\u6210\u4eba\u9ad8\u7b49\u4e13\u79d1\u5b66\u6821',
      host: ['www.jxuxue.com']
    },
    ycjyluteducn: {
      id: 44,
      mainClass: 'ycjyluteducn',
      name: '\u5170\u5dde\u7406\u5de5\u5927\u5b66\u73b0\u4ee3\u8fdc\u7a0b\u6559\u80b2\u5b66\u4e60\u5e73\u53f0',
      host: ['ycjy.lut.edu.cn', 'gdou.scnu.edu.cn', 'bjtudx-kfkc.webtrn.cn']
    },
    gdrcjxjyw: {
      id: 45,
      mainClass: 'gdrcjxjyw',
      name: '\u5e7f\u4e1c\u4eba\u624d\u7ee7\u7eed\u6559\u80b2\u7f51',
      host: ['gdjyw.ahsjxjy.com', 'www.rcjxjy.com']
    },
    shandongqlteacher: {
      id: 46,
      mainClass: 'shandongqlteacher',
      name: '\u5c71\u4e1c\u7701\u6559\u5e08\u6559\u80b2\u7f51',
      host: ['player.qlteacher.com']
    },
    shixuetong: {
      id: 47,
      mainClass: 'shixuetong',
      name: '\u5e08\u5b66\u901a',
      host: ['pr202341083.stu.teacher.com.cn', 'cr202353008.stu.teacher.com.cn', 'cn202321002.stu.teacher.com.cn', 'pn202333116.stu.teacher.com.cn', 'cn202343141.stu.teacher.com.cn', 'cr202343116.stu.teacher.com.cn', 'cn202343132.stu.teacher.com.cn', 'cn202337049.stu.teacher.com.cn', 'tn202346009.stu.teacher.com.cn', 'tn202343108.stu.teacher.com.cn', "qr202310001.stu.teacher.com.cn"]
    },
    shandongenhualvyou: {
      id: 48,
      mainClass: 'shandongenhualvyou',
      name: '\u5c71\u4e1c\u7701\u6587\u5316\u548c\u65c5\u6e38\u5385\u7ee7\u7eed\u6559\u80b2\u516c\u5171\u670d\u52a1\u5e73\u53f0',
      host: ['123.232.43.194:8088']
    },
    gansugongwuyuan: {
      id: 49,
      mainClass: 'gansugongwuyuan',
      name: '\u7518\u8083\u7701\u516c\u52a1\u5458\u7f51\u7edc\u57f9\u8bad\u7f51',
      host: ['gsgwypx.com.cn', 'www.gsgwypx.com.cn:83', 'www.gsgwypx.com.cn:86', 'www.gsgwypx.com.cn:89', 'www.gsgwypx.com.cn:90', 'www.gsgwypx.com.cn:92', 'www.gsgwypx.com.cn:91']
    },
    wlmqcol: {
      id: 50,
      mainClass: 'wlmqcol',
      name: '\u4e4c\u9c81\u6728\u9f50\u5efa\u8bbe\u804c\u4e1a\u57f9\u8bad\u4e2d\u5fc3',
      host: ['www.wlmqcol.com']
    },
    shandongzhuanyejisu: {
      id: 51,
      mainClass: 'shandongzhuanyejisu',
      name: '\u5c71\u4e1c\u7701\u4e13\u4e1a\u6280\u672f\u4eba\u5458\u7ee7\u7eed\u6559\u80b2\u516c\u9700\u8bfe\u5e73\u53f0',
      host: ['zjshpx-kfkc.webtrn.cn']
    },
    chongqingzhuanye: {
      id: 52,
      mainClass: 'chongqingzhuanye',
      name: '\u91cd\u5e86\u4e13\u4e1a\u6280\u672f\u4eba\u5458\u7ee7\u7eed\u6559\u80b2',
      host: ['mooc1.cqrspx.cn', 'cqrl.21tb.com']
    },
    jiaoyuganbuwang: {
      id: 53,
      mainClass: 'jiaoyuganbuwang',
      name: '\u4e2d\u56fd\u6559\u80b2\u5e72\u90e8\u7f51\u7edc\u5b66\u9662',
      host: ['study.enaea.edu.cn']
    },
    zhijiaoyun: {
      id: 54,
      mainClass: 'shandongzhuanyejisu',
      name: '\u804c\u6559\u4e91',
      host: ['course.icve.com.cn']
    },
    zaixianxuexi: {
      id: 55,
      mainClass: 'zaixianxuexi',
      name: '\u5728\u7ebf\u5b66\u4e60',
      host: ['rsjapp.mianyang.cn']
    },
    anquanshengchanzx: {
      id: 56,
      mainClass: 'anquanshengchanzx',
      name: '\u5317\u4eac\u5e02\u5e94\u7528\u804c\u4e1a\u6280\u80fd\u57f9\u8bad',
      host: ['www.zaixian100f.com']
    },
    guojiakaifangdaxue: {
      id: 57,
      mainClass: 'guojiakaifangdaxue',
      name: '\u56fd\u5bb6\u5f00\u653e\u5927\u5b66',
      host: ['lms.ouchn.cn', 'xczxzdbf.moodle.qwbx.ouchn.cn']
    },
    jjjxjy: {
      id: 58,
      mainClass: 'jjjxjy',
      name: '\u4e5d\u6c5f\u5b66\u9662\u7ee7\u7eed\u6559\u80b2\u5b66\u9662\u6210\u6559\u5e73\u53f0',
      host: ['jjxy.web2.superchutou.com']
    },
    jxkjxy: {
      id: 59,
      mainClass: 'jxkjxy',
      name: '\u6c5f\u897f\u79d1\u6280\u5b66\u9662',
      host: ['cws.edu-edu.com']
    },
    xiangongyedx: {
      id: 60,
      mainClass: 'xiangongyedx',
      name: '\u897f\u5b89\u5de5\u4e1a\u5927\u5b66',
      host: ['nwu.168wangxiao.com', 'xatu.168wangxiao.com', 'md.168wangxiao.com']
    },
    hebeiganbu: {
      id: 62,
      mainClass: 'hebeiganbu',
      name: '\u6cb3\u5317\u5e72\u90e8\u7f51\u7edc\u5b66\u9662',
      host: ['hebgb.gwypx.com.cn', 'www.hebgb.gov.cn']
    },
    gdedujsxx: {
      id: 63,
      mainClass: 'gdedujsxx',
      name: '\u5e7f\u4e1c\u7701\u6559\u5e08\u7ee7\u7eed\u6559\u80b2\u4fe1\u606f\u7ba1\u7406\u5e73\u53f0',
      host: ['jsglpt.gdedu.gov.cn', 'jsxx.gdedu.gov.cn']
    },
    wsjkrczyjn: {
      id: 57,
      mainClass: 'wsjkrczyjn',
      name: '\u536b\u751f\u5065\u5eb7\u4eba\u624d\u804c\u4e1a\u6280\u80fd\u57f9\u517b\u5b66\u4e60\u5e73\u53f0',
      host: ['learn.wjrc.shjy.ouchn.edu.cn']
    },
    zhuzhouteacher: {
      id: 64,
      mainClass: 'zhuzhouteacher',
      name: '\u682a\u6d32\u6559\u5e08\u6559\u80b2\u7f51\u7edc\u5b66\u9662',
      host: ['www.zhuzhouteacher.com']
    },
    zhuanyejishuryjxjy: {
      id: 65,
      mainClass: 'zhuanyejishuryjxjy',
      name: '\u4e13\u4e1a\u6280\u672f\u4eba\u5458\u7ee7\u7eed\u6559\u80b2\u7f51',
      host: ['gp.chinahrt.com']
    },
    yinghuaxuetang: {
      id: 65,
      mainClass: 'yinghuaxuetang',
      name: '\u82f1\u534e\u5b66\u5802',
      host: ['mooc.ycust.com', 'mooc.wuhues.com']
    },
    yidiantong: {
      id: 66,
      mainClass: 'yidiantong',
      name: '\u4e00\u70b9\u901a',
      host: ['www.yidiankai.net']
    },
    shanghaikaifangdx: {
      id: 67,
      mainClass: 'shanghaikaifangdx',
      name: '\u4e0a\u6d77\u5f00\u653e\u5927\u5b66',
      host: ['l.shou.org.cn']
    },
    gzgbjy: {
      id: 68,
      mainClass: 'gzgbjy',
      name: '\u5e7f\u5dde\u5e02\u5e72\u90e8\u57f9\u8bad\u7f51\u7edc\u5b66\u9662',
      host: ['gzgbjy.gzswdx.gov.cn']
    },
    jixujiaoyuzaixian: {
      id: 69,
      mainClass: 'jixujiaoyuzaixian',
      name: '\u7ee7\u7eed\u6559\u80b2\u5728\u7ebf',
      host: ['ce.jllpa.cn']
    },
    guizhoujianshezyjs: {
      id: 70,
      mainClass: 'guizhoujianshezyjs',
      name: '\u8d35\u5dde\u7701\u5efa\u8bbe\u884c\u4e1a\u804c\u4e1a\u6280\u80fd\u7ba1\u7406\u4e2d\u5fc3\u4e13\u4e1a\u6280\u672f\u4eba\u5458\u7ee7\u7eed\u6559\u80b2\u57fa\u5730',
      host: ['ware.cdeledu.com']
    },
    zaixian100f: {
      id: 71,
      mainClass: 'anquanshengchanzx',
      name: '\u5728\u7ebf\u58f9\u4f70\u5206',
      host: ['www.zaixian100f.com']
    },
    gzteacher: {
      id: 72,
      mainClass: 'gzteacher',
      name: '\u5e7f\u5dde\u5e02\u4e2d\u5c0f\u5b66\u6559\u5e08\u7ee7\u7eed\u6559\u80b2\u7f51',
      host: ['study.gzteacher.com']
    },
    moocxinyingzao: {
      id: 73,
      mainClass: 'moocxinyingzao',
      name: '\u65b0\u8425\u9020',
      host: ['mooc.xinyingzao.cn']
    },
    zhejiangzjelib: {
      id: 74,
      mainClass: 'zhejiangzjelib',
      name: '\u6d59\u6c5f\u6587\u5316\u5e72\u90e8\u7f51\u7edc\u5b66\u9662',
      host: ['train.wht.zjelib.cn']
    },
    jlnkylllnet: {
      id: 77,
      mainClass: 'jlnkylllnet',
      name: '\u5409\u6797\u7701\u519c\u79d1\u9662\u4e13\u4e1a\u6280\u672f\u4eba\u5458',
      host: ['jlnky.lllnet.cn']
    },
    dongbeishifandaxue: {
      id: 76,
      mainClass: 'dongbeishifandaxue',
      name: '\u4e1c\u5317\u5e08\u8303\u5927\u5b66\u4e2d\u5c0f\u5b66\u6559\u5e08\u7f51\u7edc\u57f9\u8bad\u5e73\u53f0',
      host: ['cn202341126.stu.t-px.cn']
    },
    quanguomeotan: {
      id: 78,
      mainClass: 'quanguomeotan',
      name: '\u5168\u56fd\u7164\u70ad\u884c\u4e1a\u73b0\u4ee3\u8fdc\u7a0b\u6559\u80b2\u57f9\u8bad\u7f51',
      host: ['www.coaledu.net']
    },
    qzjystudy: {
      id: 79,
      mainClass: 'qzjystudy',
      name: '\u6d4e\u5b81\u5e02\u9ad8\u7ea7\u804c\u4e1a\u5b66\u6821（\u7701\u7ea7\u7ee7\u7eed\u6559\u80b2\u57fa\u5730）',
      host: ['jnrcpx.qzjystudy.com']
    },
    jsjxjypt: {
      id: 80,
      mainClass: 'CTXCommon',
      name: '\u57fa\u7840\u6559\u80b2\u8fdb\u4fee\u7f51',
      host: ['www.jsjxjypt.com'],
      option: {
        'nodeListClass': '.videoRight ul li',
        'activeClass': 'li1'
      }
    },
    GlivePro: {
      id: 81,
      mainClass: 'GlivePro',
      name: '\u57fa\u7840\u6559\u80b2\u8fdb\u4fee\u7f51',
      host: ['glivepro.gaodun.com'],
      option: {
        'nodeListClass': '.animated .syllabus-tree-node-title',
        'activeClass': 'is-active'
      }
    }
  };
  let speedArr = [1, 3, 5, 10, 16];
  let toolOption = {
    accelerator: 1,
    CtxMain: null,
    SchoolType: -1
  };
  class Main {
    constructor() {
      this.studentType = 1;
      this.speedStatus = 0;
      this.isAdaptive = 1;
      this.listenVidoeStatusTimer = null;
      this.init();
    }
    init() {
      setTimeout(() => {
        let _schoolInfoColletion = localStorage.getItem('schoolInfoColletion');
        if (_schoolInfoColletion) {
        } else {
          this.colletionSchoolData();
        }
      }, 2500);
    }
    updateSpeedElement(num) {
      if (this.speedStatus == 0) return;
      ElementObj.$video.playbackRate = num;
    }
    handleClickSpeedUp(callback) {
      return __awaiter(this, void 0, void 0, function* () {
        let key = localStorage.getItem('mytoolkey');
        if (key) {
          this.speedStatus = 1;
          let result = yield fetchData({
            method: 'GET',
            url: bserUrl + `/speedup?toolkey=${key}&canuse=${toolOption.SchoolType}`
          });
          if (result.code == 200) {
            this.speedStatus = 1;
            this.isAdaptive = 1;
            toolOption.CtxMain.play();
          } else {
            this.isAdaptive = 0;
            showTip(`🔉🔉🔉${result.message}`, 5000, true);
            return;
          }
          this.randomListen();
        } else if (!key) {
          void 0;
          window.open(basehost);
        } else {
          void 0;
        }
      });
    }
    handleAddKey(callback) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!ElementObj.$ipt.value) {
          window.open(basehost);
          return;
        }
        let result = yield fetchData({
          method: 'GET',
          url: bserUrl + '/vertifykey?toolkey=' + ElementObj.$ipt.value
        });
        if (result.data.count > 0) {
          localStorage.setItem('mytoolkey', ElementObj.$ipt.value);
          localStorage.setItem('_localSpeed', toolOption.accelerator.toString());
          callback(ElementObj.$ipt.value);
        } else {
          void 0;
        }
      });
    }
    handleRemoveKey() {
      localStorage.removeItem('mytoolkey');
      localStorage.removeItem('_localSpeed');
      ElementObj.$title3.innerText = '\u7ed1\u5b9akey：';
      ElementObj.$mytoolkey.style.display = 'none';
      ElementObj.$ctxsection2.style.display = 'none';
      ElementObj.$nokey.style.display = 'block';
      ElementObj.$ipt.style.display = 'block';
      ElementObj.$addKey.style.display = 'block';
      ElementObj.$removeKey.style.display = 'none';
      ElementObj.$handleSpeedUp.style.background = 'orange';
      ElementObj.$handleSpeedUp.innerText = '\u70b9\u51fb\u52a0\u901f';
      this.updateSpeedElement(1);
    }
    stopSpeedUp() {
      this.speedStatus = 0;
      toolOption.CtxMain.updateSpeedElement(1);
      ElementObj.$handleSpeedUp.style.background = 'orange';
      ElementObj.$handleSpeedUp.innerText = '\u70b9\u51fb\u52a0\u901f';
      showTip(`🔉\u505c\u6b62\u52a0\u901f\u6210\u529f`);
    }
    handleChangeCtxSpeed(e) {
      let key = localStorage.getItem('mytoolkey');
      if (key) {
        if (this.isAdaptive == 0) {
          void 0;
          return;
        }
        let whiteList = speedArr;
        let s = Number(e);
        if (e && whiteList.includes(s)) {
          toolOption.accelerator = s;
          localStorage.setItem('_localSpeed', s.toString());
          if (ElementObj.$video) {
            ElementObj.$video.playbackRate = s;
          }
        }
      } else if (!key) {
        void 0;
        window.open(basehost);
      } else {
        void 0;
      }
    }
    colletionSchoolData() {
      return __awaiter(this, void 0, void 0, function* () {
        let result = yield fetchData({
          method: 'GET',
          url: bserUrl + '/colletionschool?schoolType=' + toolOption.SchoolType
        });
        if (result.code == 200) {
          localStorage.setItem('schoolInfoColletion', `${new Date()}`);
        }
      });
    }
    randomListen() {
      setTimeout(() => {
        let key = localStorage.getItem('mytoolkey');
        if (ElementObj.$video) {
          if (!ElementObj.$video.paused && !key) {
            ElementObj.$video.pause();
          }
        }
      }, 5000);
    }
    listenVidoeStatus($video, callback) {
      if (!$video) return;
      let count = 0;
      this.listenVidoeStatusTimer = setInterval(() => {
        if ($video.readyState < 4) {
          void 0;
          count += 1;
          if (count >= 20) {
            location.reload();
          }
        }
        let status = $video.paused;
        if (status) {
          count += 1;
          void 0;
          if (typeof callback == 'function') {
            if (count >= 20) {
              location.reload();
            } else {
              callback();
            }
          } else {
            void 0;
          }
        }
      }, 5000);
    }
    changeHtml($wrap) {
      return __awaiter(this, void 0, void 0, function* () {
        let _style = `
                width: 100%;
                height: 100%;
                background: #eae9e9;
                position: absolute;
                z-index: 999;
                overflow: scroll;
                top: 0;
                padding-left: 10px;
            `;
        let dom = document.createElement('div');
        dom.setAttribute('class', 'ctxstatsbox');
        dom.setAttribute('style', _style);
        $wrap.appendChild(dom);
        yield sleep(300);
        ElementObj.$ctxstatsbox = document.querySelector('.ctxstatsbox');
        this.addInfo('🔉\u521d\u59cb\u5316\u5df2\u5b8c\u6210，\u6b63\u5728\u64ad\u653e');
      });
    }
    addInfo(str, type) {
      let $ctxstatsbox_lis = document.querySelectorAll('.ctxstatsbox_li');
      if ($ctxstatsbox_lis.length >= 15) {
        ElementObj.$ctxstatsbox.innerHTML = '';
      }
      let li = `<li class="ctxstatsbox_li" style="color: ${type == 0 ? '#f01414' : '#000'};line-height: 30px;font-size: 16px;list-style: none;">${str}</li>`;
      ElementObj.$ctxstatsbox.innerHTML += li;
    }
    listenPageHide() {
      let timer3;
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          void 0;
          let count = 0;
          timer3 = setInterval(() => {
            count += 1;
            if (count >= 5) {
              this.addInfo('⚠️⚠️⚠️\u8bf7\u52ff\u957f\u65f6\u95f4\u9690\u85cf\u8be5\u5b66\u4e60\u9875\u9762', 0);
            }
          }, 5000);
        } else {
          clearInterval(timer3);
          void 0;
        }
      });
    }
  }
  class zhihuishu extends Main {
    constructor() {
      super();
      this.AllVideo = [];
      this.currentIndex = 0;
      this.taskLength = 0;
      this.studyVideoType = 2; 
      this._init();
    }
    _init() {
      this.AllVideo = document.querySelectorAll(".video, .lessonItem, .file-item");
      this.taskLength = this.AllVideo.length;
      this.getCurrentIndex();
    }
    getStudyVideoType() {
      let $newListTest = document.querySelector('.newListTest');
      let $video = document.querySelector('#demandBox');
      if ($newListTest) {
        this.studyVideoType = 1;
      } else {
        if ($video) {
          this.studyVideoType = 3;
        } else {
          this.studyVideoType = 2;
          toolOption.accelerator = 1.5;
        }
      }
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        this.getStudyVideoType();
        let currentDomClass = 'current_play';
        if (this.studyVideoType == 1) {
          currentDomClass = 'current_play';
        } else if (this.studyVideoType == 2) {
          currentDomClass = 'lessonItemActive';
        } else if (this.studyVideoType == 3) {
          currentDomClass = 'active';
        }
        for (let i = 0; i < this.AllVideo.length; i++) {
          let $item = this.AllVideo[i];
          if ($item.classList.contains(currentDomClass) == true) {
            this.currentIndex = i;
          }
        }
        if (this.studyVideoType == 3) {
          this.handleClickSpeedUp();
        }
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        yield sleep(1000);
        ElementObj.$video = $el('video');
        ElementObj.$video.play();
        this.updateSpeedElement();
        ElementObj.$handleSpeedUp.style.background = '#f01414';
        ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          ElementObj.$handleSpeedUp.style.background = 'orange';
          ElementObj.$handleSpeedUp.innerText = '\u70b9\u51fb\u52a0\u901f';
          yield sleep(200);
          this.currentIndex += 1;
          if (this.studyVideoType == 2) {
            setTimeout(() => {
              this.handleClickSpeedUp();
            }, 5000);
          } else {
            let $nextvideo = this.AllVideo[this.currentIndex];
            yield sleep(500);
            $nextvideo.click();
            yield sleep(3500);
            this.handleClickSpeedUp();
          }
        }), false);
        ElementObj.$video.addEventListener('pause', () => {
          setTimeout(() => {
            new Answer();
          }, 1500);
        });
      });
    }
    updateSpeedElement() {
      var speedElement;
      if (this.studyVideoType == 3) {
        speedElement = document.querySelector('div.speedTab15[rate="1.5"]');
        var $speedBox = $el('.speedBox');
        $speedBox.style.backgroundImage = 'url(https://mytools-1316767856.cos.ap-shanghai.myqcloud.com/speed1.5.png)';
        $speedBox.style.backgroundSize = '100% 100%';
      } else {
        speedElement = document.querySelector('div.speedTab.speedTab15[rate="1.5"]');
      }
      if (speedElement) {
        speedElement.setAttribute('rate', toolOption.accelerator.toString());
        speedElement.textContent = `X ${toolOption.accelerator}`;
        var _a;
        (_a = $el(`.speedList [rate="${toolOption.accelerator === 1 ? "1.0" : toolOption.accelerator}"]`)) == null ? void 0 : _a.click();
      }
      ElementObj.$handleSpeedUp.style.background = '#f01414';
      ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
    }
  }
  zhihuishu.ctxid = 1;
  class Answer {
    constructor() {
      this.EleObj = {};
      this.init();
    }
    init() {
      this.EleObj.$numbers = document.querySelectorAll('.number');
      this.EleObj.$close = document.querySelectorAll('.el-dialog__header>button')[4];
      if (this.EleObj.$numbers.length) {
        this.eachTopic();
      }
    }
    eachTopic() {
      return __awaiter(this, void 0, void 0, function* () {
        var $topicItems = document.querySelectorAll('.topic-item');
        $topicItems[1].click();
        sleep(1100);
        if (this.EleObj.$numbers.length > 1) {
          this.EleObj.$numbers[1].click();
          setTimeout(() => {
            var $topicItems2 = document.querySelectorAll('.topic-item');
            $topicItems2[1].click();
            this.EleObj.$close.click();
            ElementObj.$video.play();
          }, 1000);
        } else {
          this.EleObj.$close.click();
          ElementObj.$video.play();
        }
      });
    }
  }
  class CTXCommon extends Main {
    constructor(options) {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this.nodeListClass = options.nodeListClass;
      this.activeClass = options.activeClass;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          void 0;
          try {
            ElementObj.$allTask = document.querySelectorAll(this.nodeListClass);
            if (ElementObj.$allTask.length) {
              ElementObj.$handleSpeedUp.style.display = 'none';
              clearInterval(interval);
              this.getCurrentIndex();
            }
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        for (var i = 0; i <= ElementObj.$allTask.length - 1; i++) {
          let isDone = ElementObj.$allTask[i];
          if (isDone.classList.contains(this.activeClass)) {
            this.currentIndex = i;
            break;
          }
        }
        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        showTip('✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4000);
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let count = 0;
        let Timer = setInterval(() => {
          count += 1;
          ElementObj.$video = document.querySelectorAll('video')[0];
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(1);
            return;
          }
          if (count >= 7) {
            clearInterval(Timer);
            resolve(2);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        let studyType = yield this.getVideoDom();
        if (studyType == 1) {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
          setTimeout(() => {
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 3000);
          this.listenVidoeStatus(ElementObj.$video, () => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          });
          this.listenRebort();
          ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
            showTip('✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a', 4500);
            this.playNext();
            void 0;
          }));
          ElementObj.$video.addEventListener('pause', () => {
            setTimeout(() => {
              ElementObj.$video.volume = 0;
              ElementObj.$video.play();
            }, 1500);
          });
        }
        if (studyType == 2) {
          showTip('✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a', 3000);
          yield sleep(3000);
          this.playNext();
        }
      });
    }
    listenRebort() {
      this.listenRebortTime = setInterval(() => {
        var _b;
        let $topicModal = document.querySelector('.ant-modal-root');
        if (!!$topicModal) {
          (_b = $topicModal.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild($topicModal);
        }
      }, 10 * 1000);
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        if (this.currentIndex >= ElementObj.$allTask.length - 1) {
          void 0;
          return;
        }
        yield sleep(2500);
        this.currentIndex += 1;
        let $nextBtn = ElementObj.$allTask[this.currentIndex];
        $nextBtn === null || $nextBtn === void 0 ? void 0 : $nextBtn.click();
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 6000);
      });
    }
  }
  CTXCommon.ctxid = 60;
  class uxueyuan extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = 0;
      this._init();
    }
    _init() {
      this.getCurrentIndex();
    }
    getCurrentIndex() {
      ElementObj.$allTask = document.querySelectorAll('.page-name');
      let currentDomClass = 'active';
      ElementObj.$allTask.forEach((item, index) => {
        if (item.classList.contains(currentDomClass)) {
          this.currentIndex = index;
        }
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let count = 0;
        let Timer = setInterval(() => {
          ElementObj.$video = document.querySelector('video');
          count += 1;
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(1);
          }
          if (count > 5) {
            clearInterval(Timer);
            resolve(2);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        let studyType = yield this.getVideoDom();
        if (studyType == 1) {
          ElementObj.$video.play();
          ElementObj.$video.volume = 0;
          setTimeout(() => {
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 3500);
          ElementObj.$handleSpeedUp.style.background = '#f01414';
          ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
          ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
            if (this.currentIndex >= ElementObj.$allTask.length) {
              void 0;
            }
            yield sleep(500);
            this.currentIndex += 1;
            ElementObj.$allTask[this.currentIndex].click();
            yield sleep(2500);
            this.handleClickSpeedUp();
          }), false);
        }
        if (studyType == 2) {
          showTip('⚠️⚠️⚠️\u672a\u68c0\u6d4b\u5230\u89c6\u9891，3\u79d2\u540e\u5207\u6362\u4e0b\u4e00\u8282', 3000);
          yield sleep(3000);
          this.currentIndex += 1;
          ElementObj.$allTask[this.currentIndex].click();
          yield sleep(2500);
          this.play();
        }
      });
    }
    updateSpeedElement() {
      let speedbutton = document.querySelector('.mejs__button.mejs__speed-button>button');
      if (speedbutton) {
        speedbutton.innerHTML = `${toolOption.accelerator}.00x`;
      }
      ElementObj.$video.playbackRate = toolOption.accelerator;
    }
  }
  class fujianshifan extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = 0;
      this.currentMidiaType = 'video';
      this._init();
    }
    _init() {
      let $allchapters = document.querySelectorAll('.section');
      new Promise(resolve => {
        $allchapters.forEach((item, index) => {
          item.childNodes[0].click();
          sleep(20);
          if (index == $allchapters.length - 1) {
            resolve(true);
          }
        });
      }).then(res => {
        setTimeout(() => {
          ElementObj.$allStudyTask = document.querySelectorAll('.section li');
          this.getCurrentIndex();
        }, 2000);
      });
    }
    getCurrentIndex() {
      let $activeVideo = document.querySelector('.active');
      let currentId = $activeVideo.id;
      ElementObj.$allStudyTask.forEach((item, index) => {
        if (item.id == currentId) {
          this.currentIndex = index;
        }
      });
    }
    play() {
      ElementObj.$allStudyTask[this.currentIndex].click();
      setTimeout(() => {
        ElementObj.$video = document.querySelector('video');
        if (ElementObj.$video) {
          this.currentMidiaType = 'video';
          this.handlePlayVideo();
        } else {
          this.currentMidiaType = 'doc';
          this.handlePlayDoc();
        }
      }, 2000);
    }
    nextPlay() {
      sleep(1000);
      this.currentIndex += 1;
      this.handleClickSpeedUp();
    }
    handlePlayVideo() {
      this.updateSpeedElement(toolOption.accelerator);
      ElementObj.$video.play();
      ElementObj.$handleSpeedUp.style.background = '#f01414';
      ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
      ElementObj.$video.addEventListener('ended', () => {
        this.nextPlay();
      }, false);
    }
    handlePlayDoc() {
      var _b;
      ElementObj.$handleSpeedUp.style.background = '#f01414';
      ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
      let totalDoc = (_b = document.querySelector('#lg-counter-all')) === null || _b === void 0 ? void 0 : _b.innerHTML;
      let $nextBtn = document.querySelector('.lg-actions>.lg-next');
      let downCount = Number(totalDoc);
      let interval = setInterval(() => {
        if (downCount <= 0 || !$nextBtn) {
          clearInterval(interval);
          this.nextPlay();
          return;
        }
        $nextBtn.click();
        downCount -= 1;
      }, 1000);
    }
  }
  class henanxinxueyuan extends Main {
    constructor() {
      super();
      this.currentIndex = 0;
      this.taskLength = 0;
      this._init();
    }
    _init() {
      ElementObj.$allTask = document.querySelectorAll('.collapseCont');
      this.taskLength = ElementObj.$allTask.length;
      this.getCurrentIndex();
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        ElementObj.$allTask[this.currentIndex].click();
        yield sleep(2000);
        ElementObj.$video.volume = 0;
        ElementObj.$video = document.querySelector('video');
        this.updateSpeedElement(toolOption.accelerator);
        ElementObj.$video.play();
        ElementObj.$handleSpeedUp.style.background = '#f01414';
        ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
        ElementObj.$video.addEventListener('ended', () => {
          this.currentIndex += 1;
          setTimeout(() => {
            this.handleClickSpeedUp();
          }, 1500);
        }, false);
      });
    }
  }
  henanxinxueyuan.ctxname = '\u6cb3\u5357\u65b0\u95fb\u5b66\u9662';
  class ningmengwencai extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = 0;
      this._init();
    }
    _init() {
      ElementObj.$allTask = document.querySelectorAll('.childSection');
      this.taskLength = ElementObj.$allTask.length;
      this.getCurrentIndex();
    }
    getCurrentIndex() {
      ElementObj.$allTask.forEach((item, index) => {
        let hasClass = item.className.includes('active');
        if (hasClass) {
          this.currentIndex = index;
        }
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        ElementObj.$allTask[this.currentIndex].click();
        yield sleep(2000);
        ElementObj.$video = document.querySelector('video');
        this.updateSpeedElement(toolOption.accelerator);
        let $tip1Btn = document.querySelector('.layui-layer-btn0');
        if ($tip1Btn) {
          $tip1Btn.click();
        }
        ElementObj.$video.play();
        ElementObj.$handleSpeedUp.style.background = '#f01414';
        ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
        ElementObj.$video.addEventListener('ended', () => {
          this.currentIndex += 1;
          if (this.currentIndex > ElementObj.$allTask.length) {
            return;
          }
          let $saveBtn = document.querySelector("#saveBtn");
          $saveBtn.click();
          setTimeout(() => {
            this.handleClickSpeedUp();
          }, 2500);
        }, false);
      });
    }
  }
  class luohexueyuan extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = 0;
      this._init();
    }
    _init() {
      ElementObj.$allTask = document.querySelectorAll('li.catalog-box');
      let T = setInterval(() => {
        ElementObj.$allTask = document.querySelectorAll('li.catalog-box');
        if (ElementObj.$allTask.length) {
          clearInterval(T);
          showTip('✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u81ea\u52a8\u64ad\u653e');
          this.getCurrentIndex();
        }
      }, 1000);
    }
    getCurrentIndex() {
      ElementObj.$allTask.forEach((item, index) => {
        let hasClass = item.lastElementChild.firstElementChild.className.includes('activeCss');
        if (hasClass) {
          this.currentIndex = index;
        }
      });
      setTimeout(() => {
        this.handleClickSpeedUp();
      }, 5000);
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(true);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        yield this.getVideoDom();
        ElementObj.$video.volume = 0;
        ElementObj.$video.play();
        this.updateSpeedElement(toolOption.accelerator);
        ElementObj.$handleSpeedUp.style.background = '#f01414';
        ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
        ElementObj.$video.addEventListener('ended', () => {
          ElementObj.$handleSpeedUp.style.background = 'orange';
          ElementObj.$handleSpeedUp.innerText = '\u70b9\u51fb\u52a0\u901f';
          this.currentIndex += 1;
          ElementObj.$allTask[this.currentIndex].lastElementChild.click();
          setTimeout(() => {
            this.handleClickSpeedUp();
          }, 5000);
        }, false);
      });
    }
  }
  class gxcic extends Main {
    constructor() {
      super();
      this.parentIndex = 0;
      this.currentIndex = 0;
      this.currentTaskEle = null;
      this.taskLength = 0;
      this._init();
    }
    _init() {
      let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
        ElementObj.$allTaskParentNodes = document === null || document === void 0 ? void 0 : document.querySelectorAll('.ant-collapse-item');
        ElementObj.$allTask = document === null || document === void 0 ? void 0 : document.querySelectorAll('.course-detail-content-section-info-text');
        if (ElementObj.$allTask.length && ElementObj.$allTaskParentNodes.length) {
          clearInterval(interval);
          this.getCurrentIndex();
        }
      }), 1000);
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        ElementObj.$allTaskParentNodes.forEach((item, index) => {
          let hasClass = item.className.includes('ant-collapse-item-active');
          if (hasClass) {
            this.parentIndex = index;
          }
        });
        ElementObj.$allTask.forEach((item, index) => {
          let hasClass = item.className.includes('course-detail-current');
          if (hasClass) {
            this.currentIndex = index;
            this.currentTaskEle = item;
          }
        });
        if (!!this.currentTaskEle) {
          showTip('\u521d\u59cb\u5316\u5b8c\u6210，\u53ef\u70b9\u51fb\u52a0\u901f');
        }
      });
    }

    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(true);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        yield this.getVideoDom();
        ElementObj.$video.play();
        this.updateSpeedElement(toolOption.accelerator);
        ElementObj.$handleSpeedUp.style.background = '#f01414';
        ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          let nextTask = this.currentTaskEle.parentElement.parentElement.nextSibling;
          if (nextTask) {
            this.currentIndex += 1;
            this.currentTaskEle = nextTask;
            this.currentTaskEle.click();
          } else {
            this.parentIndex += 1;
            this.currentIndex += 1;
            var _$parentEle = ElementObj.$allTaskParentNodes[this.parentIndex].lastChild.firstChild.firstChild;
            _$parentEle.click();
            yield sleep(1500);
            ElementObj.$allTask = document === null || document === void 0 ? void 0 : document.querySelectorAll('.course-detail-content-section-info-text');
            this.currentTaskEle = ElementObj.$allTask[this.currentIndex];
            this.currentTaskEle.click();
          }
          yield sleep(5000);
          this.handleClickSpeedUp();
        }), false);
        ElementObj.$video.addEventListener('pause', () => {
          setTimeout(() => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.setAttribute('muted', 'muted');
            ElementObj.$video.play();
          }, 1500);
        });
      });
    }
  }
  class liangyijiaoyu extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = 0;
      this._init();
    }
    _init() {}
    getCurrentIndex() {}
    play() {
      return __awaiter(this, void 0, void 0, function* () {});
    }
  }
  class mengxiangzaixian extends Main {
    constructor() {
      super();
      this.currentIndex = -1;
      this.taskLength = 0;
      this._init();
    }
    _init() {
      this.getCurrentIndex();
    }
    getCurrentIndex() {
      ElementObj.$allTask = document.querySelectorAll('.el-card__body button i');
      ElementObj.$allTask.forEach((item, index) => {
        let status = item.parentElement.querySelector('.el-progress').getAttribute('aria-valuenow');
        if (parseInt(status) <= 99 && this.currentIndex == -1) {
          this.currentIndex = index;
        }
      });
      if (this.currentIndex == -1) {
        void 0;
        return;
      }
      ElementObj.$allTask[this.currentIndex].click();
      setTimeout(() => {
        this.handleClickSpeedUp();
      }, 3000);
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        yield sleep(2000);
        ElementObj.$video = document.querySelector('video');
        this.updateSpeedElement(toolOption.accelerator);
        ElementObj.$video.volume = 0;
        ElementObj.$video.play();
        ElementObj.$handleSpeedUp.style.background = '#f01414';
        ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
        ElementObj.$video.addEventListener('ended', () => {
          this.currentIndex += 1;
          ElementObj.$allTask[this.currentIndex].click();
          setTimeout(() => {
            this.handleClickSpeedUp();
          }, 4500);
        }, false);
      });
    }
  }
  class fjsf2 extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.parentIndex = 0;
      this.currentIndex = 0;
      this.currentMidiaType = 'video';
      this._init();
    }
    _init() {
      ElementObj.$allTaskParentNodes = document === null || document === void 0 ? void 0 : document.querySelectorAll('.section');
      let $allchapters = document.querySelectorAll('.section');
      this.getCurrentIndex();
    }
    getCurrentIndex() {
      ElementObj.$allTaskParentNodes.forEach((item, index) => {
        let $lis = item.querySelectorAll('li');
        $lis === null || $lis === void 0 ? void 0 : $lis.forEach(($ele, key) => {
          if ($ele.className.includes('active')) {
            this.parentIndex = index;
            this.currentIndex = key;
            ElementObj.$allTask = $lis;
          }
        });
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        ElementObj.$allTask[this.currentIndex].click();
        yield sleep(2000);
        let $clseDocBtn = document.querySelector('.lg-close');
        if (!$clseDocBtn) {
          this.currentMidiaType = 'video';
          this.handlePlayVideo();
        } else {
          this.currentMidiaType = 'doc';
          this.handlePlayDoc();
        }
      });
    }
    nextPlay() {
      return __awaiter(this, void 0, void 0, function* () {
        yield sleep(1000);
        if (this.currentIndex >= ElementObj.$allTask.length - 1) {
          this.parentIndex += 1;
          this.currentIndex = 0;
          if (this.parentIndex >= ElementObj.$allTaskParentNodes.length) {
            void 0;
            return;
          }
          let $lis = ElementObj.$allTaskParentNodes[this.parentIndex].querySelectorAll('li');
          if ($lis.length) {
            ElementObj.$allTask = $lis;
          } else {
            ElementObj.$allTaskParentNodes[this.parentIndex].childNodes[0].click();
            yield sleep(300);
            ElementObj.$allTask = ElementObj.$allTaskParentNodes[this.parentIndex].querySelectorAll('li');
          }
        } else {
          this.currentIndex += 1;
        }
        this.handleClickSpeedUp();
      });
    }
    handlePlayVideo() {
      ElementObj.$video = document.querySelector('video');
      this.updateSpeedElement(toolOption.accelerator);
      ElementObj.$video.play();
      ElementObj.$handleSpeedUp.style.background = '#f01414';
      ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
      ElementObj.$video.addEventListener('ended', () => {
        this.nextPlay();
      }, false);
    }
    handlePlayDoc() {
      return __awaiter(this, void 0, void 0, function* () {
        ElementObj.$handleSpeedUp.style.background = '#f01414';
        ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
        yield sleep(1500);
        let $lgToggle = document.querySelector('.lg-toggle-thumb');
        let downCount = 1;
        let currentPlayIndex = 0;
        if ($lgToggle) {
          $lgToggle.click();
          let totalDoc = document.querySelectorAll('.lg-thumb-item');
          downCount = totalDoc.length;
        }
        yield sleep(2000);
        let $cleseBtn = document.querySelector('.lg-close');
        $cleseBtn.click();
        this.nextPlay();
      });
    }
  }
  class xuexitong extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = 0;
      this.currentMidiaType = 'video';
      this._init();
    }
    _init() {
      ElementObj.$allTaskParentNodes = document === null || document === void 0 ? void 0 : document.querySelectorAll('.section');
      let $allchapters = document.querySelectorAll('.section');
      this.getCurrentIndex();
    }
    getCurrentIndex() {
      ElementObj.$allTaskParentNodes.forEach((item, index) => {
        let $lis = item.querySelectorAll('li');
        $lis === null || $lis === void 0 ? void 0 : $lis.forEach(($ele, key) => {
          if ($ele.className.includes('active')) {}
        });
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {});
    }
  }
  class zjzx extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = 0;
      this._init();
    }
    _init() {
      ElementObj.$allTask = document.querySelectorAll('.nLi');
      this.getCurrentIndex();
    }
    getCurrentIndex() {
      ElementObj.$allTask.forEach((item, index) => {
        let $li = item.querySelector('li');
        if ($li.classList.contains('active')) {
          this.currentIndex = index;
        }
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        ElementObj.$video = document.querySelector('video');
        ElementObj.$video.playbackRate = toolOption.accelerator;
        ElementObj.$handleSpeedUp.style.background = '#f01414';
        ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
        ElementObj.$video.addEventListener('ended', () => {
          setTimeout(() => {
            this.handleClickSpeedUp();
          }, 5000);
        });
      });
    }
  }
  class zxpxmr extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = 0;
      this._init();
    }
    _init() {
      window.alert = function () {
        return false;
      };
      let interval = setInterval(() => {
        ElementObj.$allTask = document.querySelectorAll('.kecheng_play_mian_list_item');
        if (ElementObj.$allTask.length) {
          showTip('🔉\u521d\u59cb\u5316\u5b8c\u6210，\u53ef\u70b9\u51fb\u52a0\u901f', 3000);
          clearInterval(interval);
          this.getCurrentIndex();
        }
      }, 1000);
    }
    getCurrentIndex() {
      let activeClass = 'kecheng_play_mian_list_item_progress_playing';
      ElementObj.$allTask.forEach((item, index) => {
        if (item.classList.contains(activeClass)) {
          this.currentIndex = index;
        }
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        ElementObj.$video = document.querySelector('video');
        ElementObj.$video.playbackRate = toolOption.accelerator;
        ElementObj.$video.play();
        ElementObj.$handleSpeedUp.style.background = '#f01414';
        ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
        this.simulationClick();
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          clearInterval(this.timer);
          if (this.currentIndex >= ElementObj.$allTask.length - 1) {
            void 0;
            return;
          }
          this.currentIndex += 1;
          let $nextTaskBtn = document.querySelector("#btn-sure");
          yield sleep(2000);
          $nextTaskBtn === null || $nextTaskBtn === void 0 ? void 0 : $nextTaskBtn.click();
          setTimeout(() => {
            this.handleClickSpeedUp();
          }, 5000);
        }));
        ElementObj.$video.addEventListener('pause', () => {
          void 0;
          setTimeout(() => {
            ElementObj.$video.play();
          }, 1000);
        });
      });
    }
    simulationClick() {
      var e = new KeyboardEvent('keydown', {
        'keyCode': 8,
        'which': 8
      });
      this.timer = setInterval(() => {
        try {
          document.dispatchEvent(e);
        } catch (e) {}
      }, 1000 * 3);
    }
  }
  class ggfw extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = 0;
      this._init();
    }
    _init() {
      ElementObj.$parentNodes = document.querySelectorAll('.learnList');
      if (ElementObj.$parentNodes.length) {
        this.selectOneClass();
      }
      new Promise(resolve => {
        let interval = setInterval(() => {
          ElementObj.$allTask = document.querySelectorAll('.courseItem');
          if (ElementObj.$allTask.length) {
            clearInterval(interval);
            this.getCurrentIndex();
            resolve(true);
          }
        }, 1000);
      }).then(res => {
        ElementObj.$handleSpeedUp.style.display = 'none';
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          ElementObj.$video = document.querySelector('video');
          ElementObj.$video.setAttribute('muted', 'muted');
          ElementObj.$video.setAttribute('autoplay', 'autoplay');
          let $volumeicon = document.querySelector('.volume-icon');
          $volumeicon.click();
          yield sleep(500);
          $volumeicon.click();
          if (!!ElementObj.$video) {
            clearInterval(interval);
            showTip('🔉\u521d\u59cb\u5316\u5b8c\u6210，\u5373\u5c06\u81ea\u52a8\u64ad\u653e', 3000);
            yield sleep(300);
            let $playBtn = document.querySelector('.prism-big-play-btn');
            void 0;
            $playBtn.click();
            yield this.handleClickSpeedUp();
          }
        }), 1000);
      });
    }
    getCurrentIndex() {
      let activeClass = 'active';
      ElementObj.$allTask.forEach((item, index) => {
        if (item.classList.contains(activeClass)) {
          this.currentIndex = index;
        }
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        yield sleep(3000);
        localStorage.setItem('ctx-status', '');
        ElementObj.$video.play();
        setTimeout(() => {
          ElementObj.$video.playbackRate = toolOption.accelerator;
          ElementObj.$handleSpeedUp.style.background = '#f01414';
          ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
        }, 1500);
        this.listenVidoeStatus(ElementObj.$video, () => {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
        });
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          clearInterval(this.timer);
          ElementObj.$allTask = document.querySelectorAll('.courseItem');
          yield sleep(300);
          if (this.currentIndex >= ElementObj.$allTask.length - 1) {
            localStorage.setItem('ctx-status', 'done');
            let $saveBtn = document.querySelector('.sc-box');
            $saveBtn.click();
            yield sleep(1500);
            let $backBtn = document.querySelectorAll('.menu-box ul li')[3];
            $backBtn.click();
            yield sleep(2000);
            window.location.reload();
            return;
          }
          this.currentIndex += 1;
          this.handleClickSpeedUp();
          yield sleep(2500);
          ElementObj.$allTask[this.currentIndex].click();
        }));
        ElementObj.$video.addEventListener('pause', () => {
          void 0;
          setTimeout(() => {
            ElementObj.$video.play();
          }, 1000);
        });
      });
    }
    selectOneClass() {
      let T = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
        clearInterval(T);
        let $label1 = document.querySelector('#tab-second');
        $label1.click();
        yield sleep(2500);
        ElementObj.$parentNodes = document.querySelectorAll('.course_item');
        yield sleep(200);
        ElementObj.$parentNodes[0].click();
      }), 3000);
    }
  }
  class mingshiclass extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = 0;
      this.parentIndex = -1;
      this._init();
    }
    _init() {
      let isParent = document.querySelector('.title-box .setMealName');
      if (!!isParent) {
        this.selectOneClass();
      } else {
        this.initPlayPage();
      }
    }
    initPlayPage() {
      new Promise(resolve => {
        let interval = setInterval(() => {
          ElementObj.$allTask = document.querySelectorAll('.course-list .course-item');
          if (ElementObj.$allTask.length) {
            clearInterval(interval);
            this.getCurrentIndex();
            resolve(true);
          }
        }, 1000);
      }).then(res => {
        return new Promise(resolve => __awaiter(this, void 0, void 0, function* () {
          ElementObj.$video = document.querySelector('video');
          yield sleep(3000);
          if (!!ElementObj.$video) {
            showTip('🔉\u521d\u59cb\u5316\u5b8c\u6210，\u64ad\u653e\u5f00\u59cb', 3000);
            resolve(true);
          }
        }));
      }).then(res => {
        this.handleClickSpeedUp();
      });
    }
    getCurrentIndex() {
      let activeClass = 'play-status';
      ElementObj.$allTask.forEach((item, index) => {
        let $dom1 = item.querySelector('.course-name');
        if ($dom1.classList.contains(activeClass)) {
          this.currentIndex = index;
        }
      });
      void 0;
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        ElementObj.$video = document.querySelector('video');
        ElementObj.$video.setAttribute('muted', 'muted');
        ElementObj.$video.setAttribute('autoplay', 'autoplay');
        ElementObj.$video.volume = 0;
        yield sleep(3500);
        let $play_btn = document.querySelector('.play_btn');
        $play_btn.click();
        ElementObj.$handleSpeedUp.style.background = '#f01414';
        ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          void 0;
          if (this.currentIndex >= ElementObj.$allTask.length - 1) {
            let $back = document.querySelector('.back-img');
            sleep(200);
            $back.click();
            setTimeout(() => {
              location.reload();
            }, 3000);
            return;
          }
          this.currentIndex += 1;
          let $nextTaskBtn = ElementObj.$allTask[this.currentIndex];
          yield sleep(5000);
          $nextTaskBtn === null || $nextTaskBtn === void 0 ? void 0 : $nextTaskBtn.click();
          setTimeout(() => {
            this.handleClickSpeedUp();
          }, 2000);
        }));
        ElementObj.$video.addEventListener('pause', () => {
          void 0;
          setTimeout(() => {
            ElementObj.$video.play();
          }, 3000);
        });
      });
    }
    selectOneClass() {
      let T = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
        clearInterval(T);
        ElementObj.$parentNodes = document.querySelectorAll('.content-box>.course-list>div');
        yield sleep(200);
        ElementObj.$parentNodes.forEach((item, index) => {
          let $course = item.querySelector('.course_item_brief');
          let $lastChild = $course.lastChild;
          let _innertext = $lastChild.innerText;
          if (_innertext == '\u672a\u5b8c\u6210' && this.parentIndex == -1) {
            this.parentIndex = index;
            return true;
          }
        });
        yield sleep(200);
        void 0;
        ElementObj.$parentNodes[this.parentIndex].click();
        setTimeout(() => {
          this.initPlayPage();
        }, 2500);
      }), 1000);
    }
  }
  mingshiclass.ctxid = 17;
  class qiangshi extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      try {
        let _win1 = document.querySelectorAll('iframe')[2].contentWindow;
        let _win2 = _win1.document.querySelectorAll('iframe')[0].contentWindow;
        this._document = _win2.document;
      } catch (e) {}
      let interval = setInterval(() => {
        try {
          let _win1 = document.querySelector('.contentIframe').contentWindow;
          ElementObj.$allTask = _win1.document.querySelectorAll('.s_point');
          if (ElementObj.$allTask.length) {
            clearInterval(interval);
            this.getCurrentIndex();
          }
        } catch (e) {}
      }, 1000);
    }
    getCurrentIndex() {
      let activeClass = 'done_icon_show';
      ElementObj.$allTask.forEach((item, index) => {
        let $item = item.querySelector('.item_done_icon');
        if (!$item.classList.contains(activeClass) && this.currentIndex == -1) {
          this.currentIndex = index;
        }
      });
      void 0;
      if (this.currentIndex == -1) {
        void 0;
        return;
      }
      showTip('⚠️⚠️⚠️\u521d\u59cb\u5316\u5b8c\u6210，\u5373\u5c06\u5f00\u59cb\u64ad\u653e', 3000);
      setTimeout(() => {
        this.handleClickSpeedUp();
      }, 4500);
      ElementObj.$handleSpeedUp.style.display = 'none';
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          try {
            let _document = document.querySelectorAll('iframe')[2].contentDocument.querySelectorAll('iframe')[0].contentDocument;
            ElementObj.$video = _document === null || _document === void 0 ? void 0 : _document.querySelector('video');
            if (!!ElementObj.$video) {
              clearInterval(Timer);
              resolve(true);
            }
          } catch (e) {}
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        ElementObj.$allTask[this.currentIndex].click();
        yield sleep(3500);
        yield this.getVideoDom();
        void 0;
        ElementObj.$video.volume = 0;
        let $playBtn = this._document.querySelector('#player_pause');
        $playBtn.click();
        ElementObj.$video.play();
        setTimeout(() => {
          ElementObj.$video.playbackRate = localStorage.getItem('_localSpeed') || toolOption.accelerator;
        }, 3000);
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          if (this.currentIndex >= ElementObj.$allTask.length - 1) {
            void 0;
            return;
          }
          this.currentIndex += 1;
          showTip('⚠️⚠️⚠️\u6b63\u5728\u5207\u6362\u8bfe\u7a0b', 3500);
          setTimeout(() => {
            this.handleClickSpeedUp();
          }, 4000);
        }));
        ElementObj.$video.addEventListener('pause', () => {
          void 0;
          setTimeout(() => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
            ElementObj.$video.playbackRate = localStorage.getItem('_localSpeed') || toolOption.accelerator;
          }, 1500);
        });
      });
    }
  }
  qiangshi.ctxid = 18;
  class lanzhgoulgjs extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
        let $nodes1 = document.querySelectorAll('.chapterlist .drop p'); 
        let $nodes2 = document.querySelectorAll('.chapterlist .videoList p'); 
        if ($nodes1.length || $nodes2.length) {
          clearInterval(interval);
          ElementObj.$allTask = $nodes1.length ? $nodes1 : $nodes2;
          this.getCurrentIndex();
        }
      }), 1000);
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        let arr = [];
        ElementObj.$allTask.forEach((item, index) => {
          let $class_percent = item.querySelector('.class_percent');
          if (!!$class_percent) {
            let status = $class_percent.innerText;
            arr.push(parseInt(status));
          } else {
            arr.push(0);
          }
        });
        arr.reverse();
        for (var i = 0; i <= arr.length - 1; i++) {
          if (arr[i] < 98) {
            void 0;
            this.currentIndex = arr.length - i - 1;
            break;
          }
        }
        void 0;
        if (this.currentIndex == 0) {
          ElementObj.$allTask[1].querySelector('a').click();
          yield sleep(4000);
          ElementObj.$allTask = document.querySelectorAll('.chapterlist .drop p');
          yield sleep(200);
          let status = ElementObj.$allTask[0].querySelector('.class_percent').innerText;
          if (parseInt(status) < 98) {
            this.currentIndex = 0;
          } else {
            void 0;
            return;
          }
        }
        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        ElementObj.$handleSpeedUp.style.display = 'none';
        showTip('🔉🔉🔉\u521d\u59cb\u5316\u5b8c\u6210，5s\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        void 0;
        this.handleClickSpeedUp();
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          ElementObj.$video = document.querySelector('video');
          let videosrc = ElementObj.$video.src;
          let $iframe = document.querySelector('iframe');
          void 0;
          void 0;
          if (!!videosrc) {
            clearInterval(Timer);
            resolve(1);
          }
          if ($iframe) {
            clearInterval(Timer);
            resolve(2);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        let $nextP = ElementObj.$allTask[this.currentIndex];
        let $nextBtn = $nextP.querySelector('a');
        yield sleep(300);
        $nextBtn.click();
        yield sleep(3000);
        let result = yield this.getVideoDom();
        if (result == 1) {
          clearInterval(this.listenVidoeStatusTimer);
          ElementObj.$video.setAttribute('muted', 'muted');
          ElementObj.$video.volume = 0;
          yield sleep(200);
          ElementObj.$video.play();
          ElementObj.$video.playbackRate = toolOption.accelerator;
          ElementObj.$handleSpeedUp.style.background = '#f01414';
          ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
          this.listenVidoeStatus(ElementObj.$video, () => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          });
          let $wrap = document.querySelector('.ckplayer-ckplayer');
          this.changeHtml($wrap);
          this.reloadPage();
          this.listenPageHide();
          this.listenAbnormal(1);
          ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
            location.reload();
          }));
        }
        if (result == 2) {
          let $thirdplayer = document.querySelector("#thirdplayer");
          this.changeHtml($thirdplayer);
          this.reloadPage();
          this.listenPageHide();
          this.listenAbnormal(0);
        }
      });
    }
    reloadPage() {
      return __awaiter(this, void 0, void 0, function* () {
      });
    }
    listenAbnormal(type) {
      showTip('🔉\u8bfe\u4ef6\u6b63\u5728\u5b66\u4e60，\u8bf7\u52a1\u70b9\u51fb\u6216\u957f\u65f6\u95f4\u9690\u85cf');
      let count = 0;
      setInterval(() => {
        count += 1;
        if (type == 0) {
          this.addInfo(`\u5df2\u76d1\u6d4b${count}\u6b21，\u5f53\u524d\u72b6\u6001\u6b63\u5728\u5b66\u4e60`);
        } else {
          let time = (ElementObj.$video.currentTime / 60).toFixed(2);
          this.addInfo(`\u5df2\u76d1\u6d4b${count}\u6b21，\u5f53\u524d\u72b6\u6001\u6b63\u5728\u5b66\u4e60，\u5df2\u64ad\u653e${time}\u5206\u949f`);
        }
        let $layuilayerbtn0 = document.querySelector('.layui-layer-btn0');
        if (!!$layuilayerbtn0) {
          location.reload();
          return;
        }
      }, 5000);
    }
    changeHtml($wrap) {
      return __awaiter(this, void 0, void 0, function* () {
        let _style = `
                width: 796px;
                height: 545px;
                background: #eae9e9;
                position: absolute;
                z-index: 10;
                overflow: scroll;
                top: 0;
                padding-left: 10px;
            `;
        let dom = document.createElement('div');
        dom.setAttribute('class', 'ctxstatsbox');
        dom.setAttribute('style', _style);
        $wrap.appendChild(dom);
        yield sleep(300);
        ElementObj.$ctxstatsbox = document.querySelector('.ctxstatsbox');
        this.addInfo('🔉\u521d\u59cb\u5316\u5df2\u5b8c\u6210，\u6b63\u5728\u64ad\u653e');
        this.addInfo('⚠️⚠️⚠️\u8bfe\u7a0b\u91c7\u7528\u5012\u7740\u64ad\u653e，\u8bf7\u52ff\u624b\u52a8\u66f4\u6362\u8bfe\u7a0b', 0);
      });
    }
    addInfo(str, type) {
      let $ctxstatsbox_lis = document.querySelectorAll('.ctxstatsbox_li');
      if ($ctxstatsbox_lis.length >= 15) {
        ElementObj.$ctxstatsbox.innerHTML = '';
      }
      let li = `<li class="ctxstatsbox_li" style="color: ${type == 0 ? '#f01414' : '#000'};line-height: 30px;font-size: 16px;">${str}</li>`;
      ElementObj.$ctxstatsbox.innerHTML += li;
    }
    listenPageHide() {
      let timer3;
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          void 0;
          let count = 0;
          timer3 = setInterval(() => {
            count += 1;
            if (count >= 5) {
              this.addInfo('⚠️⚠️⚠️\u8bf7\u52ff\u957f\u65f6\u95f4\u9690\u85cf\u8be5\u5b66\u4e60\u9875\u9762', 0);
            }
          }, 5000);
        } else {
          clearInterval(timer3);
          void 0;
        }
      });
    }
  }
  class beijingjiaoshi extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.topIndex = 0;
      this.parentIndex = -1;
      this.currentIndex = -1;
      this.videoplaying = -1;
      this.timer = null;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let $item_btn = document.querySelector('.item_btn');
        ElementObj.$topNode = document.querySelectorAll('.el-collapse-item');
        if (!!$item_btn) {
          yield sleep(2000);
          $item_btn.click();
          setTimeout(() => {
            window.close();
          }, 1500);
        } else if (ElementObj.$topNode.length) {
          let index = yield this.getDoing();
          void 0;
          ElementObj.statusEles[index].click();
          yield sleep(3000);
          this.getParentIndex();
        } else {
          let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            ElementObj.$allTask = document.querySelectorAll('.course-info .video-title');
            if (ElementObj.$allTask.length) {
              clearInterval(interval);
              this.getCurrentIndex();
            }
          }), 1000);
        }
      });
    }
    getParentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        void 0;
        ElementObj.$topNode = document.querySelectorAll('.el-collapse-item');
        yield sleep(200);
        let len = ElementObj.$topNode.length;
        let _interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          if (this.topIndex >= len - 1) {
            clearInterval(_interval);
          }
          yield sleep(2000);
          let $item = ElementObj.$topNode[this.topIndex];
          if (this.topIndex != 0) {
            $item.querySelector('.item-title-col').click();
          }
          yield sleep(300);
          ElementObj.$parentNodes = $item.querySelectorAll('.el-table__row');
          yield sleep(300);
          ElementObj.$parentNodes.forEach((item, index) => __awaiter(this, void 0, void 0, function* () {
            let $course_num = item.querySelector('.course_num');
            let _status = $course_num.innerText;
            if (_status != '\u8bfe\u7a0b：100%' && this.parentIndex == -1) {
              clearInterval(_interval);
              this.parentIndex = index;
              let $toStudyBtn = item.querySelector('.to-study');
              yield sleep(200);
              $toStudyBtn.click();
              setTimeout(() => {
                window.close();
              }, 1500);
            }
          }));
          this.topIndex += 1;
        }), 3000);
      });
    }
    getDoing() {
      return new Promise(resolve => {
        let isFirst = false;
        ElementObj.statusEles = document.querySelectorAll('.li-item .el-progress-bar__inner');
        ElementObj.statusEles.forEach((item, index) => {
          let status = item.style.width;
          void 0;
          if (parseInt(status) <= 98 && isFirst == false) {
            isFirst = true;
            resolve(index);
          }
        });
        if (!isFirst) {
          resolve(0);
        }
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        let activeClass = 'on';
        ElementObj.$allTask.forEach((item, index) => {
          let $fourEle = item.querySelector('.four');
          let _status = $fourEle.innerText;
          if (_status != '100%' && this.currentIndex == -1) {
            this.currentIndex = index;
          }
        });
        ElementObj.$handleSpeedUp.style.display = 'none';
        showTip('🔉\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        let $nextBtn = ElementObj.$allTask[this.currentIndex];
        yield sleep(200);
        $nextBtn.click();
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4500);
        void 0;
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(true);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.timer);
        yield this.getVideoDom();
        ElementObj.$video.setAttribute('muted', 'muted');
        ElementObj.$video.volume = 0;
        let $startBtn = document.querySelector('.xgplayer-start');
        yield sleep(200);
        $startBtn.click();
        ElementObj.$video.playbackRate = toolOption.accelerator;
        this.punchCard();
        ElementObj.$handleSpeedUp.style.background = '#f01414';
        ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
        this.listenVidoeStatus();
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          if (this.currentIndex >= ElementObj.$allTask.length - 1) {
            setTimeout(() => {
              window.close();
            }, 1500);
            location.replace('https://www.ttcdw.cn/p/uc/project');
            return;
          }
          this.currentIndex += 1;
          let $nextBtn = ElementObj.$allTask[this.currentIndex];
          yield sleep(300);
          $nextBtn.click();
          setTimeout(() => {
            this.handleClickSpeedUp();
          }, 4500);
        }));
        ElementObj.$video.addEventListener('pause', () => {
          void 0;
        });
        ElementObj.$video.addEventListener('playing', () => {
          void 0;
        });
        ElementObj.$video.addEventListener('waiting', () => {
          void 0;
        });
      });
    }
    listenVidoeStatus() {
      this.timer = setInterval(() => {
        ElementObj.$video = document.querySelector('video');
        if (!!ElementObj.$video) {
          let status = ElementObj.$video.paused;
          void 0;
          void 0;
          if (status) {
            ElementObj.$video.setAttribute('muted', 'muted');
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          } else {}
        }
      }, 3000);
    }
    punchCard() {
      setInterval(() => {
        let $elem = document.querySelector('#comfirmClock');
        if (!!$elem) {
          $elem.click();
        }
      }, 5000);
    }
  }
  class qingyangzgzjzj extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.parentIndex = -1;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      let interval = setInterval(() => {
        ElementObj.$parentNodes = document.querySelectorAll('.swiper-slide');
        if (ElementObj.$parentNodes.length) {
          clearInterval(interval);
          this.getParentIndex();
        }
      }, 1000);
    }
    getParentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        showTip('\u6b63\u5728\u521d\u59cb\u5316', 1500);
        ElementObj.$parentNodes.forEach((item, index) => {
          let $progresstext = item.querySelector('.progresstext');
          let status = $progresstext.innerText;
          if (parseInt(status) < 97 && this.parentIndex == -1) {
            this.parentIndex = index;
            void 0;
            void 0;
            ElementObj.$parentNodes[this.parentIndex].querySelector('.left-img').click();
          }
        });
        if (this.parentIndex == -1) {
          void 0;
          return;
        }
        this.getCurrentIndex();
      });
    }
    _getParentIndex() {
      let result = 0;
      for (var i = 0; i <= ElementObj.$parentNodes.length - 1; i++) {
        let $progresstext = ElementObj.$parentNodes[i].querySelector('.progresstext');
        let status = $progresstext.innerText;
        if (parseInt(status) < 95) {
          result = i;
          break;
        }
      }
      return result;
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        ElementObj.$allTask = document.querySelectorAll(".class-catlog ul li ul li");
        yield sleep(2000);
        void 0;
        ElementObj.$allTask[0].click();
        ElementObj.$handleSpeedUp.style.display = 'none';
        showTip('🔉\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u81ea\u52a8\u5f00\u59cb\u64ad\u653e', 3000);
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 3000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.timer);
        yield this.getVideoDom();
        ElementObj.$video = document.querySelector('video');
        ElementObj.$video.volume = 0;
        ElementObj.$video.currentTime = 0;
        ElementObj.$video.playbackRate = toolOption.accelerator;
        ElementObj.$video.play();
        ElementObj.$handleSpeedUp.style.background = '#f01414';
        ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
        this.listenVidoeStatus();
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          this.playNext();
        }));
        ElementObj.$video.addEventListener('pause', () => {
          void 0;
        });
        ElementObj.$video.addEventListener('playing', () => {
          void 0;
        });
        ElementObj.$video.addEventListener('waiting', () => {
          void 0;
        });
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(true);
          }
        }, 1000);
      });
    }
    listenVidoeStatus() {
      this.timer = setInterval(() => {
        ElementObj.$video = document.querySelector('video');
        if (!!ElementObj.$video) {
          let status = ElementObj.$video.paused;
          void 0;
          if (status) {
            ElementObj.$video.setAttribute('muted', 'muted');
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          } else {}
        }
      }, 3000);
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        ElementObj.$allTask = document.querySelectorAll(".class-catlog ul li ul li");
        yield sleep(1500);
        if (this.currentIndex >= ElementObj.$allTask.length - 1) {
          if (this.parentIndex >= ElementObj.$parentNodes.length - 1) {
            void 0;
            return;
          }
          this.parentIndex = this._getParentIndex();
          yield sleep(200);
          ElementObj.$parentNodes[this.parentIndex].querySelector('.left-img').click();
          this.currentIndex = 0;
          showTip('🔉\u6b63\u5728\u5207\u6362\u89c6\u9891,5\u79d2\u540e\u5f00\u59cb\u64ad\u653e');
          setTimeout(() => {
            this.handleClickSpeedUp();
          }, 5000);
          return;
        }
        this.currentIndex += 1;
        let $nextTaskBtn = document.querySelector('.nextdontcheatorshit');
        yield sleep(200);
        $nextTaskBtn === null || $nextTaskBtn === void 0 ? void 0 : $nextTaskBtn.click();
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 5000);
      });
    }
  }
  class lanzhouwenli extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.parentIndex = -1;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      let interval = setInterval(() => {
        ElementObj.$allTask = document.querySelectorAll('.video');
        if (ElementObj.$allTask.length) {
          clearInterval(interval);
          this.getCurrentIndex();
        }
      }, 1000);
    }
    getParentIndex() {
      return __awaiter(this, void 0, void 0, function* () {});
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        ElementObj.$allTask.forEach((item, index) => {
          let $progress = item.querySelector('.el-progress__text');
          let status = $progress.innerText;
          if (parseInt(status) < 96 && this.currentIndex == -1) {
            this.currentIndex = index;
          }
        });
        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        showTip('🔉🔉🔉\u521d\u59cb\u5316\u5b8c\u6210，\u5373\u5c06\u5f00\u59cb\u64ad\u653e', 3000);
        yield sleep(2000);
        ElementObj.$allTask[this.currentIndex].click();
        yield sleep(2500);
        this.handleClickSpeedUp();
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        yield this.getVideoDom();
        let $volume = document.querySelector('.volume-icon');
        $volume.classList.add('mute');
        ElementObj.$video.volume = 0;
        yield sleep(200);
        ElementObj.$video.playbackRate = toolOption.accelerator;
        ElementObj.$video.play();
        ElementObj.$handleSpeedUp.style.background = '#f01414';
        ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          yield sleep(1500);
          if (this.currentIndex >= ElementObj.$allTask.length - 1) {
            this.parentIndex += 1;
            yield sleep(200);
            ElementObj.$parentNodes[this.parentIndex].querySelector('.left-img').click();
            if (this.parentIndex >= ElementObj.$parentNodes.length - 1) {
              void 0;
              return;
            }
          }
          let $backBtn = document.querySelector('.videoleft img');
          yield sleep(200);
          $backBtn.click();
          showTip('\u6b63\u5728\u5207\u6362\u8bfe\u7a0b', 3000);
          setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            this.currentIndex += 1;
            let $nextTaskBtn = ElementObj.$allTask[this.currentIndex];
            yield sleep(2000);
            $nextTaskBtn === null || $nextTaskBtn === void 0 ? void 0 : $nextTaskBtn.click();
            setTimeout(() => {
              this.handleClickSpeedUp();
            }, 5000);
          }), 5500);
        }));
        ElementObj.$video.addEventListener('pause', () => {
          void 0;
          setTimeout(() => {
            ElementObj.$video.play();
          }, 4000);
        });
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(true);
          }
        }, 1000);
      });
    }
  }
  class xuexituqiang extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.parentIndex = -1;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      let interval = setInterval(() => {
        ElementObj.$allTask = document.querySelectorAll('.lesson');
        if (ElementObj.$allTask.length) {
          clearInterval(interval);
          this.getCurrentIndex();
        }
      }, 1000);
    }
    getParentIndex() {
      return __awaiter(this, void 0, void 0, function* () {});
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        let activeClass = 'lesson-in';
        ElementObj.$allTask.forEach((item, index) => {
          if (item.classList.contains(activeClass)) {
            this.currentIndex = index;
          }
        });
        showTip('🔉🔉🔉\u521d\u59cb\u5316\u5b8c\u6210，\u53ef\u70b9\u51fb\u64ad\u653e', 3000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        yield this.getVideoDom();
        yield sleep(200);
        ElementObj.$video.playbackRate = toolOption.accelerator;
        ElementObj.$video.play();
        ElementObj.$handleSpeedUp.style.background = '#f01414';
        ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          yield sleep(1500);
          if (this.currentIndex >= ElementObj.$allTask.length - 1) {
            void 0;
            return;
          }
          this.currentIndex += 1;
          yield sleep(2000);
          let $comfimbutton = document.querySelector('.el-message-box__btns button');
          $comfimbutton === null || $comfimbutton === void 0 ? void 0 : $comfimbutton.click();
          setTimeout(() => {
            this.handleClickSpeedUp();
          }, 5000);
        }));
        ElementObj.$video.addEventListener('pause', () => {
          void 0;
          setTimeout(() => {
            ElementObj.$video.play();
          }, 3000);
        });
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(true);
          }
        }, 1000);
      });
    }
  }
  class guojiazhihuijiaoyu extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
        let $allTask1 = document.querySelectorAll('.video-title .four');
        if ($allTask1.length) {
          clearInterval(interval);
          ElementObj.$allTask = $allTask1;
          this.getCurrentIndex();
        }
      }), 1000);
    }
    getCurrentIndex() {
      ElementObj.$allTask.forEach((item, index) => {
        if (item.innerText != '100%' && this.currentIndex == -1) {
          this.currentIndex = index;
        }
      });
      if (this.currentIndex == -1) {
        this.currentIndex = 0;
      }
      showTip('🔉🔉🔉\u521d\u59cb\u5316\u5b8c\u6210，\u53ef\u70b9\u51fb\u52a0\u901f', 3000);
      void 0;
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(true);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        let $nextBtn = ElementObj.$allTask[this.currentIndex];
        yield sleep(300);
        $nextBtn.click();
        yield sleep(3000);
        let $playBtn = document.querySelector('.xgplayer-icon-play');
        $playBtn.click();
        yield this.getVideoDom();
        ElementObj.$video.play();
        ElementObj.$video.playbackRate = toolOption.accelerator;
        this.listenVidoeStatus();
        let $btn0 = document.querySelector('.layui-layer-btn0');
        if (!!$btn0) {
          $btn0.click();
        }
        ElementObj.$handleSpeedUp.style.background = '#f01414';
        ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
        this.listenTopic();
        ElementObj.$video.addEventListener('pause', () => {
          setTimeout(() => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          }, 1500);
        });
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          let $close = document.querySelector('.layui-layer-btn0');
          yield sleep(3000);
          if (!!$close) {
            $close.click();
          }
          this.currentIndex += 1;
          setTimeout(() => {
            this.handleClickSpeedUp();
          }, 5000);
        }));
      });
    }
    listenTopic() {
      let inter = setInterval(() => {
        try {
          let $submit = document.querySelector('#submit');
          if (!!$submit) {
            this.answerTopic();
          }
        } catch (e) {}
      }, 1000 * 5);
    }
    answerTopic() {
      return __awaiter(this, void 0, void 0, function* () {
        let $choice = document.querySelectorAll('.choice li')[0];
        yield sleep(200);
        $choice.click();
        let $submit = document.querySelector('#submit');
        yield sleep(1000);
        $submit.click();
        yield sleep(2000);
        $submit = document.querySelector('#submit');
        yield sleep(200);
        $submit.click();
        yield sleep(4500);
        let $close = document.querySelector('.layui-layer-btn0');
        yield sleep(200);
        $close.click();
      });
    }
    listenVidoeStatus() {
      let count = 0;
      this.timer = setInterval(() => {
        ElementObj.$video = document.querySelector('video');
        if (!!ElementObj.$video) {
          let status = ElementObj.$video.paused;
          void 0;
          if (status) {
            ElementObj.$video.setAttribute('muted', 'muted');
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          } else {}
        }
      }, 1000 * 10);
    }
  }
  class lanzhouchengren extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.parentIndex = -1;
      this.currentIndex = -1;
      this.videoplaying = 3;
      this.loadedCount = 0;
      this.type = 1;
      this._init();
    }
    _init() {
      let interval = setInterval(() => {
        if (location.pathname == '/courseVideo/index') {
          ElementObj.$allTask = document.querySelectorAll('.ant-tree-node-content-wrapper-normal .chapter-tree-level2');
          if (ElementObj.$allTask.length) {
            clearInterval(interval);
            this.getCurrentIndex();
          }
        } else {
          ElementObj.$allTask = document.querySelectorAll('.activity li');
          if (ElementObj.$allTask.length) {
            clearInterval(interval);
            this.getCurrentIndex();
          }
        }
      }, 1000);
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        void 0;
        if (location.pathname == '/courseVideo/index') {
          for (var i = 0; i <= ElementObj.$allTask.length - 1; i++) {
            let $li = ElementObj.$allTask[i];
            let $right = $li.querySelector('.right');
            void 0;
            if (!$right) {
              this.currentIndex = i;
              break;
            } else {
              let $status = $right.querySelector('.percent-text');
              if ($status.innerText != '\u5df2\u5b8c\u6210') {
                this.currentIndex = i;
                break;
              }
            }
          }
          if (this.currentIndex == -1) {
            void 0;
            return;
          }
          ElementObj.$allTask[i].click();
        } else {
          let activeClass = 'cur';
          ElementObj.$allTask.forEach((item, index) => {
            if (item.classList.contains(activeClass)) {
              this.currentIndex = index;
            }
          });
          if (this.currentIndex == -1) {
            this.currentIndex = 0;
          }
          void 0;
        }
        ElementObj.$handleSpeedUp.style.display = 'none';
        showTip('🔉\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        yield sleep(3000);
        this.handleClickSpeedUp();
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        let studyType = yield this.getVideoDom();
        void 0;
        yield sleep(200);
        if (studyType == 1) {
          setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            this.currentIndex += 1;
            let $li = ElementObj.$allTask[this.currentIndex];
            let $nextTaskBtn = $li === null || $li === void 0 ? void 0 : $li.querySelector('h3');
            yield sleep(2000);
            $nextTaskBtn === null || $nextTaskBtn === void 0 ? void 0 : $nextTaskBtn.click();
          }), 3000);
        }
        if (studyType == 2) {
          ElementObj.$video.volume = 0;
          ElementObj.$video.playbackRate = toolOption.accelerator;
          ElementObj.$video.play();
          ElementObj.$handleSpeedUp.style.background = '#f01414';
          ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
          if (location.pathname == '/venus/study/activity/video/study.do') {
            this.listenVidoeStatus(ElementObj.$video, () => {
              let $li = ElementObj.$allTask[this.currentIndex];
              let $nextTaskBtn = $li === null || $li === void 0 ? void 0 : $li.querySelector('h3');
              $nextTaskBtn === null || $nextTaskBtn === void 0 ? void 0 : $nextTaskBtn.click();
            });
            this.reloadPage();
          }
          ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
            this.playNext();
          }));
          ElementObj.$video.addEventListener('pause', () => {
            void 0;
            this.videoplaying = 1;
            setTimeout(() => {
              ElementObj.$video.volume = 0;
              ElementObj.$video.play();
            }, 1000);
          });
          ElementObj.$video.addEventListener('playing', () => {
            this.videoplaying = 2;
            void 0;
          });
        }
      });
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        this.videoplaying = 3;
        yield sleep(1500);
        if (this.currentIndex >= ElementObj.$allTask.length - 1) {
          void 0;
          return;
        }
        this.currentIndex += 1;
        let $li = ElementObj.$allTask[this.currentIndex];
        let $nextTaskBtn;
        if (location.pathname == '/courseVideo/index') {
          $nextTaskBtn = $li;
          $nextTaskBtn === null || $nextTaskBtn === void 0 ? void 0 : $nextTaskBtn.click();
          setTimeout(() => {
            this.handleClickSpeedUp();
          }, 3000);
        } else {
          $nextTaskBtn = $li === null || $li === void 0 ? void 0 : $li.querySelector('h3');
          yield sleep(2000);
          $nextTaskBtn === null || $nextTaskBtn === void 0 ? void 0 : $nextTaskBtn.click();
        }
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          ElementObj.$video = document.querySelector('video');
          ElementObj.$myFrame = document.querySelector('#myFrame');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            this.type = 2;
            resolve(2);
          }
          if (!!ElementObj.$myFrame) {
            clearInterval(Timer);
            this.type = 1;
            resolve(1);
          }
        }, 1000);
      });
    }
    reloadPage() {
      return __awaiter(this, void 0, void 0, function* () {
        let count = 10 * 60;
        let watch = 0;
        let studyInterval = setInterval(() => {
          watch += 1;
          if (watch % 15 == 0) {
            void 0;
            void 0;
          }
          if (watch % 5 == 0) {
            void 0;
          }
          if (count <= 0) {
            clearInterval(studyInterval);
            location.reload();
          }
          count -= 1;
        }, 1000);
      });
    }
  }
  class tsbtchinamde extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.studyType = 1;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
        let $allTask1 = document.querySelectorAll('.chapterlist .item p');
        let $allTask2 = document.querySelectorAll('.chapterlist .chapter-li .drop p');
        void 0;
        if ($allTask1.length || $allTask2.length) {
          clearInterval(interval);
          ElementObj.$allTask = $allTask2.length ? $allTask2 : $allTask1;
          this.getCurrentIndex();
          ElementObj.$handleSpeedUp.style.display = 'none';
        }
      }), 1000);
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        let arr = [];
        ElementObj.$allTask.forEach((item, index) => {
          let $class_percent = item.querySelector('.class_percent');
          if (!!$class_percent) {
            let status = $class_percent.innerText;
            arr.push(parseInt(status));
          } else {
            arr.push(0);
          }
        });
        arr.reverse();
        for (var i = 0; i <= arr.length - 1; i++) {
          if (arr[i] < 98) {
            void 0;
            this.currentIndex = arr.length - i - 1;
            break;
          }
        }
        void 0;
        if (this.currentIndex == 0) {
          ElementObj.$allTask[1].querySelector('a').click();
          yield sleep(4000);
          ElementObj.$allTask = document.querySelectorAll('.chapterlist .drop p');
          yield sleep(200);
          let status = ElementObj.$allTask[0].querySelector('.class_percent').innerText;
          if (parseInt(status) < 98) {
            this.currentIndex = 0;
          } else {
            void 0;
            return;
          }
        }
        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        ElementObj.$handleSpeedUp.style.display = 'none';
        showTip('🔉🔉🔉\u521d\u59cb\u5316\u5b8c\u6210，5s\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        void 0;
        this.handleClickSpeedUp();
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          ElementObj.$video = document.querySelector('video');
          let videosrc = ElementObj.$video.src;
          if (!!videosrc) {
            clearInterval(Timer);
            resolve(1);
          } else {
            clearInterval(Timer);
            resolve(2);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.timer);
        let $nextP = ElementObj.$allTask[this.currentIndex];
        let $nextBtn = $nextP.querySelector('a');
        yield sleep(300);
        $nextBtn.click();
        this.studyType = yield this.getVideoDom();
        if (this.studyType == 1) {
          ElementObj.$video.volume = 0;
          ElementObj.$video.setAttribute('muted', 'muted');
          yield sleep(200);
          ElementObj.$video.play();
          ElementObj.$video.playbackRate = toolOption.accelerator;
          ElementObj.$handleSpeedUp.style.background = '#f01414';
          ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
          this.listenVidoeStatus(ElementObj.$video, () => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          });
        }
        let $wrap = this.studyType == 1 ? $el('#player') : $el('#thirdplayer');
        this.changeHtml($wrap);
        this.reloadPage();
        this.listenPageHide();
        this.studyType == 1 ? this.listenAbnormal(1) : this.listenAbnormal(0);
        setTimeout(() => {
          this.addInfo('⚠️⚠️⚠️\u8bfe\u7a0b\u91c7\u7528\u5012\u7740\u64ad\u653e，\u8bf7\u52ff\u624b\u52a8\u66f4\u6362\u8bfe\u7a0b', 0);
        }, 1000);
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          location.reload();
        }));
      });
    }
    reloadPage() {
      return __awaiter(this, void 0, void 0, function* () {
        let count = 6 * 60;
        let studyInterval = setInterval(() => {
          if (count <= 0) {
            clearInterval(studyInterval);
            location.reload();
          }
          count -= 1;
        }, 1000);
      });
    }
    listenAbnormal(type) {
      showTip('🔉\u8bfe\u4ef6\u6b63\u5728\u5b66\u4e60，\u8bf7\u52a1\u70b9\u51fb\u6216\u957f\u65f6\u95f4\u9690\u85cf');
      let count = 0;
      setInterval(() => {
        count += 1;
        void 0;
        if (type == 0) {
          this.addInfo(`\u5df2\u76d1\u6d4b${count}\u6b21，\u5f53\u524d\u72b6\u6001\u6b63\u5728\u5b66\u4e60`);
        }
        if (type == 1) {
          let time = (ElementObj.$video.currentTime / 60).toFixed(2);
          this.addInfo(`\u5df2\u76d1\u6d4b${count}\u6b21，\u5f53\u524d\u72b6\u6001\u6b63\u5728\u5b66\u4e60，\u5df2\u64ad\u653e${time}\u5206\u949f`);
        }
        let $layuilayerbtn0 = document.querySelector('.layui-layer-btn0');
        if (!!$layuilayerbtn0) {
          location.reload();
          return;
        }
      }, 5000);
    }
  }
  tsbtchinamde.ctxid = 26;
  class zjzjsrc extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          void 0;
          if (location.pathname == '/member/project_toMyCourseList.page') {
            clearInterval(interval);
            let $page1 = document.querySelector('td .btn-xs');
            $page1.click();
            yield sleep(2000);
            let index = this.getParentIndex();
            let $parentTask = document.querySelectorAll('.panel-body')[0].querySelectorAll('tbody tr');
            let $item = $parentTask[index];
            let $openBtn = $item.querySelector(".btn-xs[name='btn1']");
            $openBtn === null || $openBtn === void 0 ? void 0 : $openBtn.click();
            void 0;
            yield sleep(2000);
            ElementObj.$allTask = document.querySelectorAll(".btn-xs[name='btn1']");
            this.step2();
          }

          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(interval);
            ElementObj.$handleSpeedUp.style.display = 'none';
            this.handleClickSpeedUp();
          }
        }), 1000);
      });
    }
    getParentIndex() {
      var _b, _c;
      let result = -1;
      let $parentTask = document.querySelectorAll('.panel-body')[0].querySelectorAll('tbody tr');
      for (var i = 0; i <= $parentTask.length - 1; i++) {
        let $status = $parentTask[i].querySelectorAll('td')[6].innerText;
        if ($status == '\u672a\u5f00\u59cb\u5b66\u4e60') {
          result = i;
          break;
        }
      }
      if (result == -1) {
        let $nextBtn = (_b = document.querySelector('#option1')) === null || _b === void 0 ? void 0 : _b.querySelector("a[title='Go to next page']");
        if (!((_c = $nextBtn.parentElement) === null || _c === void 0 ? void 0 : _c.classList.contains('active'))) {
          result = this.getParentIndex();
        } else {
          return result;
        }
      }
      return result;
    }
    getCurrentIndex() {
      showTip('\u6b63\u5728\u521d\u59cb\u5316');
      ElementObj.$handleSpeedUp.style.display = 'none';
      let $progressNodes = document.querySelectorAll('.progress-bar');
      let result = -1;
      for (var i = 0; i <= $progressNodes.length - 1; i++) {
        let _ele = $progressNodes[i];
        let status = _ele.style.width;
        void 0;
        if (parseInt(status) != 100) {
          result = i;
          break;
        }
      }
      return result;
    }
    step2() {
      var _b;
      return __awaiter(this, void 0, void 0, function* () {
        let index = 0;
        let $items = (_b = document.querySelector('#myModal .panel-body')) === null || _b === void 0 ? void 0 : _b.querySelectorAll('tbody tr');
        let timer = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          let $openBtn = $items[index].querySelector(".btn-xs[name='btn2']");
          $openBtn === null || $openBtn === void 0 ? void 0 : $openBtn.click();
          yield sleep(500);
          let result = this.getCurrentIndex();
          void 0;
          if (result != -1) {
            clearInterval(timer);
            let $progressNodes = document.querySelectorAll('#myModal1 tbody tr')[result];
            let $a = $progressNodes.querySelector('a');
            GM_openInTab($a.href, {
              active: true
            });
            setTimeout(() => {
              window.close();
            }, 1000 * 15);
          }
          index++;
        }), 2000);
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(true);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.timer);
        yield this.getVideoDom();
        ElementObj.$video.volume = 0;
        ElementObj.$video.setAttribute('muted', 'muted');
        yield sleep(200);
        ElementObj.$video.play();
        ElementObj.$video.playbackRate = toolOption.accelerator;
        this.changeHtml($el('#example_video_1'));
        this.listenPlayTime();
        this.listenPageHide();
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          this.videoplaying = -1;
          GM_openInTab('https://zj.zjjsrc.cn/member/project_toMyCourseList.page', {
            active: true
          });
          setTimeout(() => {
            window.close();
          }, 1000 * 15);
        }));
        ElementObj.$video.addEventListener('pause', () => {
          let timer;
          clearInterval(timer);
          timer = setTimeout(() => {
            let $playBtn = document.querySelector('.vjs-play-control');
            $playBtn.click();
          }, 100);
        });
      });
    }
    listenPlayTime() {
      let count = 0;
      this.timer = setInterval(() => __awaiter(this, void 0, void 0, function* () {
        var _b, _c;
        count += 1;
        let currentTime = (_b = ElementObj.$video) === null || _b === void 0 ? void 0 : _b.currentTime;
        let time = (currentTime / 60).toFixed(2);
        let durtion = (_c = ElementObj.$video) === null || _c === void 0 ? void 0 : _c.duration;
        this.addInfo(`\u5df2\u76d1\u6d4b${count}\u6b21，\u5f53\u524d\u72b6\u6001\u6b63\u5728\u5b66\u4e60，\u5df2\u64ad\u653e${time}\u5206\u949f，\u89c6\u9891\u603b\u65f6\u957f\u4e3a${durtion / 60}\u5206\u949f`);
      }), 5000);
    }
  }
  zjzjsrc.ctxid = 26;
  class gzjxjy extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      let interval = setInterval(() => {
        ElementObj.$allTask = document.querySelectorAll('.el-step');
        if (ElementObj.$allTask.length) {
          clearInterval(interval);
          this.getCurrentIndex();
        }
      }, 1000);
    }
    getCurrentIndex() {
      let _currentIndex = -1;
      let activeClass = 'active';
      ElementObj.$allTask.forEach((item, index) => {
        if (!item.querySelector('.status-tip') && this.currentIndex == -1) {
          this.currentIndex = index;
        }
        if (item.classList.contains(activeClass)) {
          _currentIndex = index;
        }
      });
      void 0;
      if (_currentIndex != this.currentIndex) {
        ElementObj.$allTask[this.currentIndex].querySelector('.step-title').click();
      }
      showTip('✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，\u5373\u5c06\u5f00\u59cb\u81ea\u52a8\u64ad\u653e');
      ElementObj.$handleSpeedUp.style.display = 'none';
      this.handleClickSpeedUp();
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        yield this.getVideoDom();
        ElementObj.$video.volume = 0;
        ElementObj.$video.play();
        setTimeout(() => {
          ElementObj.$video.playbackRate = toolOption.accelerator;
          ElementObj.$handleSpeedUp.style.background = '#f01414';
          ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
        }, 3000);
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          clearInterval(this.timer);
          if (this.currentIndex >= ElementObj.$allTask.length - 1) {
            void 0;
            return;
          }
          this.currentIndex += 1;
          yield sleep(500);
          ElementObj.$allTask[this.currentIndex].querySelector('.step-title').click();
          showTip('✅✅✅5\u79d2\u540e\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a', 4500);
          setTimeout(() => {
            location.reload();
          }, 5000);
        }));
        ElementObj.$video.addEventListener('pause', () => __awaiter(this, void 0, void 0, function* () {
          yield sleep(1000);
          let $close = document.querySelector('.dialog-footer button');
          if ($close) {
            $close.click();
          } else {
            setTimeout(() => {
              ElementObj.$video.play();
            }, 1000);
          }
        }));
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(true);
          }
        }, 1000);
      });
    }
  }
  class gzjxjy_Answer {
    constructor() {
      this.currentIndex = 0;
      this.$allTask = document.querySelectorAll('.question-title');
      this.currentTask = {
        type: 1,
        topicName: '',
        option: []
      };
      this.timer = 0;
      this._init();
    }
    _init() {
      let t = setInterval(() => {
        this.timer += 1;
        if (this.timer > 60 * 32) {
          this.submit();
          clearInterval(t);
        }
      }, 1000);
      let interval = setInterval(() => {
        this.$allTask = document.querySelectorAll('.question-title');
        if (this.$allTask.length) {
          clearInterval(interval);
          showTip('🔉\u521d\u59cb\u5316\u5b8c\u6210，\u53ef\u70b9\u51fb\u52a0\u901f', 3000);
          this.play();
        }
      }, 1000);
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        yield sleep(2000);
        let $currentTaskEle = this.$allTask[this.currentIndex];
        let _$showtext = $currentTaskEle.querySelector('.show-text');
        this.currentTask.topicName = _$showtext.innerText;
        ElementObj.$ctxTopicName = document.querySelector('.cxtsection3 .ctxtopic-name');
        ElementObj.$ctxTopicName.innerText = this.currentTask.topicName;
        this.currentTask.option = [];
        let _optionNodeList = $currentTaskEle.querySelectorAll('.el-radio__label');
        if (!!_optionNodeList.length) {
          this.currentTask.type = 1;
        } else {
          this.currentTask.type = 2;
          _optionNodeList = $currentTaskEle.querySelectorAll('.el-checkbox__label');
        }
        _optionNodeList.forEach((item, index) => {
          this.currentTask.option.push(item.innerText);
        });
        let result = yield this.searchDate(this.currentTask);
        void 0;
        let count = 0;
        let T = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          if (count >= _optionNodeList.length) {
            clearInterval(T);
            yield sleep(2000);
            if (this.currentIndex >= this.$allTask.length - 1) {
              return;
            }
            this.currentIndex += 1;
            this.play();
          }
          if (result.indexOf(`${count}`) != -1) {
            let $item = _optionNodeList[count];
            $item.click();
          }
          count += 1;
        }), 500);
      });
    }
    searchDate(obj) {
      return __awaiter(this, void 0, void 0, function* () {
        let res = yield fetchData({
          url: bserUrl + `/searchtopic?topicname=${obj.topicName}`,
          method: 'GET'
        });
        let result = ['0'];
        if (res.result.topickey) {
          result = res.result.topickey.split(',');
        } else {
          if (obj.type == 2) {
            result = ['0', '1', '2'];
          }
          let str = `
                <div class="cxtsection cxtsection4">
                      <div class="tag">\u672a\u641c\u7d22\u5230</div>
                      <div class="ctxtopic-name">${obj.topicName}</div>
                    </div>
                `;
          ElementObj.$myTool.innerHTML += str;
        }
        return result;
      });
    }
    saveTopic() {
      new Promise(resolve => __awaiter(this, void 0, void 0, function* () {
        let res = yield fetchData({
          method: 'GET',
          url: bserUrl + `/savetopic?topic=${JSON.stringify(this.currentTask)}`
        });
        resolve(res);
      }));
    }
    submit() {
      let $submit = document.querySelector('.btn-submit');
      $submit.click();
    }
  }
  class lzrejxjy extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          void 0;
          try {
            let $trans2 = document.querySelectorAll('.my-center2RM .pull-left a.trans')[1];
            void 0;
            if (!!$trans2) {
              clearInterval(interval);
              GM_setValue("homeUrl", location.href);
              $trans2 === null || $trans2 === void 0 ? void 0 : $trans2.click();
              showTip('🔉\u6b63\u5728\u521d\u59cb\u5316');
              yield sleep(2000);
              ElementObj.$parentNodes = document.querySelectorAll('.class2Li');
              this.findParentIndex();
              return;
            }
            let $menus = document.querySelectorAll('.learn-menu-cell');
            if ($menus.length) {
              clearInterval(interval);
              this.getCurrentIndex();
            }
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      var _b;
      return __awaiter(this, void 0, void 0, function* () {
        let $menu2 = document.querySelectorAll('.learn-menu-cell')[1];
        if (!$menu2.classList.contains('learn-menu-cur')) {
          let $menu2_a = $menu2.querySelector('a');
          $menu2_a.click();
        }
        yield sleep(3000);
        let $contentIframe = document.querySelector('.contentIframe');
        ElementObj._document = $contentIframe.contentWindow.document;
        ElementObj.$allTask = ElementObj._document.querySelectorAll('.s_point');
        showTip('\u6b63\u5728\u521d\u59cb\u5316');
        ElementObj.$handleSpeedUp.style.display = 'none';
        let activeClass = 'done_icon_show';
        for (var i = 0; i <= ElementObj.$allTask.length - 1; i++) {
          let $item = ElementObj.$allTask[i].querySelector('.item_done_icon');
          if (!$item.classList.contains(activeClass)) {
            this.currentIndex = i;
            break;
          }
        }
        if (this.currentIndex == -1) {
          let homeUrl = GM_getValue("homeUrl", null);
          void 0;
          GM_openInTab(homeUrl, {
            active: true
          });
          setTimeout(() => {
            window.close();
          }, 1500);
          return;
        }
        (_b = ElementObj.$allTask[this.currentIndex]) === null || _b === void 0 ? void 0 : _b.click();
        showTip('\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e');
        this.handleClickSpeedUp();
      });
    }
    findParentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        ElementObj.$handleSpeedUp.style.display = 'none';
        let $a;
        ElementObj.$parentNodes.forEach((item, index) => {
          let $class2Li = item.querySelector('.color-theme');
          let status = $class2Li.innerText;
          if (parseInt(status) <= 98 && this.currentIndex == -1) {
            this.currentIndex = index;
            $a = item.querySelector('a.btn-theme');
          }
        });
        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        $a.click();
        setTimeout(() => {
          window.close();
        }, 1500);
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          let _document = ElementObj._document.querySelector('#mainFrame').contentWindow.document;
          ElementObj.$video = _document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(true);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        yield this.getVideoDom();
        ElementObj.$video.volume = 0;
        ElementObj.$video.setAttribute('muted', 'muted');
        yield sleep(200);
        ElementObj.$video.play();
        ElementObj.$video.playbackRate = toolOption.accelerator;
        this.listenRebort();
        this.listenVidoeStatus(ElementObj.$video, () => {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
        });
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          if (this.currentIndex >= ElementObj.$allTask.length - 1) {
            let homeUrl = GM_getValue("homeUrl", null);
            void 0;
            GM_openInTab(homeUrl, {
              active: true
            });
            setTimeout(() => {
              window.close();
            }, 1500);
            return;
          }
          this.currentIndex += 1;
          ElementObj.$allTask[this.currentIndex].click();
          showTip('🔉\u6b63\u5728\u5207\u6362\u8bfe\u7a0b');
          setTimeout(() => {
            this.handleClickSpeedUp();
          }, 5000);
        }));
        ElementObj.$video.addEventListener('pause', () => {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
        });
      });
    }
    updateSpeedElement(num) {
      localStorage.setItem('_localSpeed', num.toString());
      ElementObj.$video.playbackRate = num;
    }
    listenRebort() {
      this.listenRebortTime = setInterval(() => {
        void 0;
        let $btn = document.querySelector('.layui-layer-btn0');
        if (!!$btn) {
          setTimeout(() => {
            $btn.click();
            ElementObj.$video.play();
          }, 3000);
        }
      }, 10 * 1000);
    }
  }
  lzrejxjy.ctxid = 26;
  class xuzhouyikedaxue extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this.parentIndex = -1;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          void 0;
          try {
            let $menu = document.querySelector('#courseware_main_menu');
            let $menu_a = $menu.querySelector('a');
            if (!!$menu_a) {
              clearInterval(interval);
              $menu_a.click();
              this.findParentIndex();
            }
          } catch (e) {}
        }), 1000);
      });
    }
    findParentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        showTip('🔉\u6b63\u5728\u521d\u59cb\u5316', 2500);
        yield sleep(4500);
        ElementObj.$handleSpeedUp.style.display = 'none';
        let $contentIframe = document.querySelector('.contentIframe');
        let _document = $contentIframe.contentWindow.document;
        ElementObj.$parentNodes = _document.querySelectorAll('.vcon li');
        ElementObj.$parentNodes.forEach((item, index) => {
          let $span = item.querySelector('span');
          if (($span.classList.contains('undo') || $span.classList.contains('doing')) && this.parentIndex == -1) {
            this.parentIndex = index;
          }
        });
        void 0;
        if (this.parentIndex == -1) {
          void 0;
          return;
        }
        ElementObj.$parentNodes[this.parentIndex].querySelector('a').click();
        this.getCurrentIndex();
      });
    }
    getCurrentIndex() {
      var _b;
      return __awaiter(this, void 0, void 0, function* () {
        showTip('\u6b63\u5728\u521d\u59cb\u5316', 2500);
        yield sleep(4500);
        let $contentIframe = document.querySelector('.contentIframe');
        ElementObj._document = $contentIframe.contentWindow.document;
        ElementObj.$allTask = ElementObj._document.querySelectorAll('.menub');
        this.currentIndex = 0;
        (_b = ElementObj.$allTask[this.currentIndex]) === null || _b === void 0 ? void 0 : _b.click();
        showTip('\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e');
        this.handleClickSpeedUp();
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          let $contentIframe = document.querySelector('.contentIframe');
          ElementObj._document = $contentIframe.contentWindow.document;
          let _document = ElementObj._document.querySelector('#mainFrame').contentDocument;
          ElementObj.$video = _document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(1);
            return;
          }
          let $doc = _document.querySelector('#content_frame');
          if (!!$doc) {
            clearInterval(Timer);
            resolve(2);
          } else {
            clearInterval(Timer);
            resolve(2);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        clearInterval(this.timer2);
        let studytype = yield this.getVideoDom();
        void 0;
        this.listenRebort();
        if (studytype == 1) {
          ElementObj.$video.volume = 0;
          yield sleep(200);
          ElementObj.$video.play();
          setTimeout(() => {
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 3000);
          this.listenVidoeStatus(ElementObj.$video, () => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
            setTimeout(() => {
              ElementObj.$video.playbackRate = toolOption.accelerator;
            }, 3000);
          });
          ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
            yield sleep(3000);
            this.playNext();
          }));
        }
        if (studytype == 2) {
          this.timer2 = setTimeout(() => {
            this.playNext();
          }, 7000);
        }
      });
    }
    listenRebort() {
      this.listenRebortTime = setInterval(() => {
        let $btn = document.querySelector('.layui-layer-btn a');
        if (!!$btn) {
          $btn.click();
          ElementObj.$video.play();
          setTimeout(() => {
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 3000);
        }
      }, 10 * 1000);
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        showTip('✅✅✅\u64ad\u653e\u5b8c\u6210，\u6b63\u5728\u5207\u6362\u8bfe\u7a0b', 3500);
        if (this.currentIndex >= ElementObj.$allTask.length - 1) {
          this.parentIndex += 1;
          ElementObj.$parentNodes[this.parentIndex].querySelector('a').click();
          setTimeout(() => {
            this.getCurrentIndex();
          }, 4500);
          return;
        }
        this.currentIndex += 1;
        ElementObj.$allTask[this.currentIndex].click();
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4000);
      });
    }
  }
  xuzhouyikedaxue.ctxid = 26;
  class xibeisfzyjy extends Main {
    constructor() {
      super();
      this.studyType = 2;
      this.taskLength = 0;
      this.parentIndex = -1;
      this.currentIndex = -1;
      this.swiperIndex = -1;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          void 0;
          try {
            let $allTask1 = document.querySelectorAll('.el-tree-node'); 
            let $allTask2 = document.querySelectorAll('.m-chapterList .section'); 
            if ($allTask1.length || $allTask2.length) {
              this.studyType = $allTask1.length ? 2 : 1;
              ElementObj.$allTask = $allTask1.length ? $allTask1 : $allTask2;
              clearInterval(interval);
              this.getCurrentIndex();
            }
            ElementObj.$parentNodes = document.querySelectorAll('.project-courseBottom');
            if (ElementObj.$parentNodes.length) {
              clearInterval(interval);
              this.getParentIndex();
            }
            let _host = location.host;
            if (_host == 'preview.dccloud.com.cn') {
              clearInterval(interval);
              yield sleep(1500);
              window.close();
            }
          } catch (e) {}
        }), 1000);
      });
    }
    getParentIndex() {
      for (var i = 0; i <= ElementObj.$parentNodes.length - 1; i++) {
        let status = ElementObj.$parentNodes[i].querySelector('span');
        if (status != '\u5df2\u5b66\u4e60') {
          this.parentIndex = i;
          break;
        }
      }
      if (this.parentIndex == -1) {
        void 0;
      }
      ElementObj.$parentNodes[i].querySelector('.project-courseButton').click();
    }
    getSwiperIndex() {
      var _b;
      return __awaiter(this, void 0, void 0, function* () {
        ElementObj.$video = document.querySelector('video');
        yield sleep(200);
        if (!ElementObj.$video) {
          ElementObj.$docs = document.querySelectorAll('.abcd');
          if (ElementObj.$docs.length) {
            this.playDoc();
          }
          return;
        }
        ElementObj.$swiperItem = document.querySelectorAll('.public-articleSlideList');
        if (!ElementObj.$swiperItem.length) {
          this.handleClickSpeedUp();
          return;
        }
        for (var i = 0; i <= ElementObj.$swiperItem.length - 1; i++) {
          let status = ElementObj.$swiperItem[i].querySelector('.video-status').innerText;
          if (status != '\u5df2\u5b66\u4e60') {
            this.swiperIndex = i;
            break;
          }
        }
        void 0;
        if (this.swiperIndex == -1) {
          this.playNext();
        } else if (this.swiperIndex == 0) {
          this.handleClickSpeedUp();
        } else {
          ElementObj.$swiperItem[this.swiperIndex].querySelector('.el-icon-video-play').click();
          showTip('⚠️⚠️⚠️\u6b63\u5728\u521d\u59cb\u5316', 3500);
          let $btn = (_b = document.querySelector('.el-message-box__btns')) === null || _b === void 0 ? void 0 : _b.lastChild;
          yield sleep(2000);
          $btn.click();
          setTimeout(() => {
            this.handleClickSpeedUp();
          }, 5000);
        }
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        ElementObj.$handleSpeedUp.style.display = 'none';
        showTip('\u6b63\u5728\u521d\u59cb\u5316', 2500);
        yield sleep(3500);
        let activeClass = this.studyType == 1 ? 'section-cur' : 'study';
        ElementObj.$allTask.forEach((item, index) => {
          if (this.studyType == 1) {
            let $item = item;
            if ($item.classList.contains(activeClass)) {
              this.currentIndex = index;
            }
          }
          if (this.studyType == 2) {
            let $item = item.querySelector('i');
            let status = $item.title;
            if (status != '\u5df2\u5b66\u4e60' && this.currentIndex == -1) {
              this.currentIndex = index;
            }
          }
        });
        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        if (this.studyType == 2 && this.currentIndex != -1) {
          this.playNext(this.currentIndex - 1);
        }
        showTip('⚠️⚠️⚠️\u521d\u59cb\u5316，\u8bf7\u7a0d\u540e', 3000);
        if (this.studyType == 1) {
          this.handleClickSpeedUp();
        }
        if (this.studyType == 2) {
          this.getSwiperIndex();
        }
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(true);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.timer);
        yield this.getVideoDom();
        ElementObj.$video.volume = 0;
        ElementObj.$video.setAttribute('muted', 'muted');
        yield sleep(200);
        ElementObj.$video.play();
        setTimeout(() => {
          ElementObj.$video.playbackRate = toolOption.accelerator;
        }, 3000);
        if (this.studyType == 2) {
          let index = yield this.getDocIndex();
          setTimeout(() => {
            this.eachPlayDoc(index);
          }, 3000);
          this.changeHtml($el('#video'));
          this.listenPageHide();
          this.listenPlayTime();
          this.reloadPage();
        }
        this.listenVidoeStatus(ElementObj.$video, () => {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
          setTimeout(() => {
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 3000);
        });
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          var _b;
          showTip('🔉\u6b63\u5728\u5207\u6362\u8bfe\u7a0b', 2500);
          if (this.studyType == 2) {
            if (this.swiperIndex >= ElementObj.$swiperItem.length - 1) {
              location.reload();
            } else {
              this.swiperIndex += 1;
              ElementObj.$swiperItem[this.swiperIndex].querySelector('.el-icon-video-play').click();
              showTip('⚠️⚠️⚠️\u6b63\u5728\u5207\u6362\u89c6\u9891', 5000);
              let $btn = (_b = document.querySelector('.el-message-box__btns')) === null || _b === void 0 ? void 0 : _b.lastChild;
              yield sleep(2000);
              $btn.click();
              setTimeout(() => {
                this.handleClickSpeedUp();
              }, 5000);
            }
          }
          if (this.studyType == 1) {
            if (this.currentIndex >= ElementObj.$allTask.length - 1) {
              void 0;
              return;
            }
            this.currentIndex += 1;
            let $nextBtn;
            $nextBtn = ElementObj.$allTask[this.currentIndex].querySelector('a');
            $nextBtn === null || $nextBtn === void 0 ? void 0 : $nextBtn.click();
          }
        }));
      });
    }
    getDocIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        ElementObj.$docs = document.querySelectorAll('.abcd .file-box');
        yield sleep(200);
        void 0;
        let index = -1;
        for (var i = 0; i <= ElementObj.$docs.length - 1; i++) {
          let status = ElementObj.$docs[i].querySelector('.fs12').innerText;
          if (status != '( \u5df2\u5b8c\u6210 )') {
            index = i;
            break;
          }
        }
        return index;
      });
    }
    playDoc(type) {
      return __awaiter(this, void 0, void 0, function* () {
        let index = yield this.getDocIndex();
        void 0;
        if (index == -1) {
          this.playNext();
          return;
        }
        this.eachPlayDoc(index, () => {
          setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            this.playNext();
          }), 2000);
        });
      });
    }
    eachPlayDoc(index = 0, callback) {
      void 0;
      if (index == -1) return;
      let T = setInterval(() => {
        void 0;
        if (index >= ElementObj.$docs.length - 1) {
          clearInterval(T);
          void 0;
          if (typeof callback == 'function') {
            callback();
          }
        }
        ElementObj.$docs[index].querySelector('button').click();
        index += 1;
      }, 2000);
    }
    playNext(nextIndex) {
      var _b;
      return __awaiter(this, void 0, void 0, function* () {
        if (nextIndex != undefined) {
          this.currentIndex = nextIndex;
        }
        if (this.currentIndex >= ElementObj.$allTask.length - 1) {
          void 0;
          return;
        }
        this.currentIndex += 1;
        let $nextBtn = ElementObj.$allTask[this.currentIndex].querySelectorAll('span')[1];
        $nextBtn === null || $nextBtn === void 0 ? void 0 : $nextBtn.click();
        yield sleep(2000);
        let $btn = (_b = document.querySelector('.el-message-box__btns')) === null || _b === void 0 ? void 0 : _b.lastChild;
        if (!!$btn) {
          $btn.click();
        }
        showTip('⚠️⚠️⚠️\u6b63\u5728\u5207\u6362\u4e0b\u4e00\u8282', 4000);
        setTimeout(() => {
          this.getSwiperIndex();
        }, 4500);
      });
    }
    listenPlayTime() {
      showTip('🔉\u8bfe\u4ef6\u6b63\u5728\u5b66\u4e60，\u8bf7\u52a1\u70b9\u51fb\u6216\u957f\u65f6\u95f4\u9690\u85cf');
      let count = 0;
      this.timer = setInterval(() => {
        count += 1;
        let time = (ElementObj.$video.currentTime / 60).toFixed(2);
        this.addInfo(`\u5df2\u76d1\u6d4b${count}\u6b21，\u5f53\u524d\u72b6\u6001\u6b63\u5728\u5b66\u4e60，\u5df2\u64ad\u653e${time}\u5206\u949f`);
      }, 5000);
    }
    reloadPage() {
      return __awaiter(this, void 0, void 0, function* () {
        let count = 6 * 60;
        let studyInterval = setInterval(() => {
          if (count <= 0) {
            clearInterval(studyInterval);
            location.reload();
          }
          count -= 1;
        }, 1000);
      });
    }
  }
  xibeisfzyjy.ctxid = 26;
  class henangongshe extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.parentIndex = -1;
      this.currentIndex = -1;
      this.videoplaying = -1;
      this.timer = null;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          let $menuNodes = document.querySelectorAll('#bxkBtudyDiv a');
          if ($menuNodes.length) {
            clearInterval(interval);
            this.getParentIndex($menuNodes);
          }
          ElementObj.$allTask = document.querySelectorAll('.course-info .video-title');
          if (ElementObj.$allTask.length) {
            clearInterval(interval);
            this.getCurrentIndex();
          }
          ElementObj.$handleSpeedUp.style.display = 'none';
        }), 1000);
      });
    }
    getParentIndex($menuNodes) {
      return __awaiter(this, void 0, void 0, function* () {
        $menuNodes[0].click();
        showTip('⚠️⚠️⚠️\u6b63\u5728\u521d\u59cb\u5316', 3000);
        yield sleep(3000);
        ElementObj.$parentNodes = document.querySelectorAll('tbody tr');
        for (var i = 0; i <= ElementObj.$parentNodes.length - 1; i++) {
          let status = ElementObj.$parentNodes[i].querySelector('span').innerText;
          if (parseInt(status) <= 98) {
            this.parentIndex = i;
            break;
          }
        }
        if (this.parentIndex == -1) {
          $menuNodes[1].click();
          yield sleep(3000);
          ElementObj.$parentNodes = document.querySelectorAll('tbody tr');
          for (var i = 0; i <= ElementObj.$parentNodes.length - 1; i++) {
            let status = ElementObj.$parentNodes[i].querySelector('span').innerText;
            if (parseInt(status) <= 98) {
              this.parentIndex = i;
              break;
            }
          }
        }
        if (this.parentIndex == -1) {
          void 0;
          return;
        }
        let homeUrl = GM_setValue("homeUrl", location.href);
        void 0;
        ElementObj.$parentNodes[this.parentIndex].querySelector('button').click();
        setTimeout(() => {
          window.close();
        }, 5500);
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        showTip('⚠️⚠️⚠️\u6b63\u5728\u521d\u59cb\u5316', 3500);
        ElementObj.$allTask.forEach((item, index) => {
          let $fourEle = item.querySelector('.four');
          let _status = $fourEle.innerText;
          if (_status != '100%' && this.currentIndex == -1) {
            this.currentIndex = index;
          }
        });
        ElementObj.$handleSpeedUp.style.display = 'none';
        showTip('🔉\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        let $nextBtn = ElementObj.$allTask[this.currentIndex];
        yield sleep(200);
        $nextBtn.click();
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4500);
        void 0;
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(true);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        yield this.getVideoDom();
        ElementObj.$video.setAttribute('muted', 'muted');
        ElementObj.$video.volume = 0;
        let $startBtn = document.querySelector('.xgplayer-start');
        yield sleep(200);
        $startBtn.click();
        ElementObj.$video.playbackRate = toolOption.accelerator;
        ElementObj.$handleSpeedUp.style.background = '#f01414';
        ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
        this.punchCard();
        this.listenVidoeStatus(ElementObj.$video, () => {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
        });
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          if (this.currentIndex >= ElementObj.$allTask.length - 1) {
            setTimeout(() => {
              window.close();
            }, 1500);
            let homeUrl = GM_getValue("homeUrl", null);
            void 0;
            GM_openInTab(homeUrl, {
              active: true
            });
            return;
          }
          this.currentIndex += 1;
          let $nextBtn = ElementObj.$allTask[this.currentIndex];
          yield sleep(300);
          $nextBtn.click();
          setTimeout(() => {
            this.handleClickSpeedUp();
          }, 4500);
        }));
      });
    }
    punchCard() {
      setInterval(() => {
        let $elem = document.querySelector('#comfirmClock');
        if (!!$elem) {
          $elem.click();
        }
      }, 5000);
    }
    updateSpeedElement(num) {
      localStorage.setItem('_localSpeed', num.toString());
      ElementObj.$video.playbackRate = num;
    }
  }
  class zgrtvu extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.parentIndex = -1;
      this.currentIndex = -1;
      this.videoplaying = -1;
      this.timer = null;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          let $button = document.querySelector('.head_right button');
          if (!!$button) {
            clearInterval(interval);
            $button.click();
          }
          ElementObj.$allTask = document.querySelectorAll('.page-name');
          if (ElementObj.$allTask.length) {
            clearInterval(interval);
            this.getCurrentIndex();
          }
          ElementObj.$handleSpeedUp.style.display = 'none';
        }), 1000);
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        showTip('⚠️⚠️⚠️\u6b63\u5728\u521d\u59cb\u5316', 3500);
        ElementObj.$allTask.forEach((item, index) => {
          let activeClass = 'complete';
          if (!item.classList.contains(activeClass) && this.currentIndex == -1) {
            this.currentIndex = index;
          }
        });
        ElementObj.$handleSpeedUp.style.display = 'none';
        showTip('🔉\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        let $nextBtn = ElementObj.$allTask[this.currentIndex];
        yield sleep(200);
        $nextBtn.click();
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4500);
        void 0;
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(true);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        yield this.getVideoDom();
        ElementObj.$video.setAttribute('muted', 'muted');
        ElementObj.$video.volume = 0;
        let $startBtn = document.querySelector('.mejs__overlay-button');
        yield sleep(200);
        $startBtn.click();
        ElementObj.$video.playbackRate = toolOption.accelerator;
        ElementObj.$handleSpeedUp.style.background = '#f01414';
        ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
        this.punchCard();
        this.listenVidoeStatus(ElementObj.$video, () => {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
        });
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          if (this.currentIndex >= ElementObj.$allTask.length - 1) {
            setTimeout(() => {
              window.close();
            }, 1500);
            let $backBtn = document.querySelector('.back-btn');
            yield sleep(200);
            $backBtn.click();
            return;
          }
          this.currentIndex += 1;
          let $nextBtn = ElementObj.$allTask[this.currentIndex];
          yield sleep(300);
          $nextBtn.click();
          setTimeout(() => {
            this.handleClickSpeedUp();
          }, 4500);
        }));
      });
    }
    punchCard() {
      setInterval(() => {
        void 0;
        let $elem = document.querySelector('.btn-submit');
        if (!!$elem) {
          $elem.click();
        }
      }, 5000);
    }
  }
  class henandikuang extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.parentIndex = -1;
      this.currentIndex = -1;
      this.videoplaying = -1;
      this.timer = null;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          ElementObj.$parentNodes = document.querySelectorAll('.state-l');
          if (ElementObj.$parentNodes.length) {
            clearInterval(interval);
            ElementObj.$parentNodes[0].querySelector('.btn span').click();
            return;
          }
          ElementObj.$parentNodes = document.querySelectorAll('.course-card-item');
          if (ElementObj.$parentNodes.length) {
            clearInterval(interval);
            this.getParentIndex();
          }
          ElementObj.$allTask = document.querySelectorAll('.pt5 li');
          if (ElementObj.$allTask.length) {
            clearInterval(interval);
            this.getCurrentIndex();
          }
          ElementObj.$handleSpeedUp.style.display = 'none';
        }), 1000);
      });
    }
    getParentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        let index = -1;
        for (var i = 0; i < ElementObj.$parentNodes.length - 1; i++) {
          let status = ElementObj.$parentNodes[i].querySelector('.progress-bar').style.width;
          if (parseInt(status) < 98) {
            index = i;
            break;
          }
        }
        if (index == -1) {
          void 0;
          return;
        }
        ElementObj.$parentNodes[i].querySelector('a').click();
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        showTip('⚠️⚠️⚠️\u6b63\u5728\u521d\u59cb\u5316', 1500);
        ElementObj.$allTask.forEach((item, index) => {
          let $pagress = item.querySelector('.badge');
          let status = $pagress.innerText;
          if (parseInt(status) != 100 && this.currentIndex == -1) {
            this.currentIndex = index;
          }
        });
        showTip('⚠️⚠\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        let $nextBtn = ElementObj.$allTask[this.currentIndex];
        yield sleep(200);
        $nextBtn.click();
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4500);
        void 0;
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          ElementObj.$video = document.querySelectorAll('video')[1];
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(true);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        yield this.getVideoDom();
        ElementObj.$video.volume = 0;
        ElementObj.$video.play();
        ElementObj.$video.playbackRate = toolOption.accelerator;
        ElementObj.$handleSpeedUp.style.background = '#f01414';
        ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          if (this.currentIndex >= ElementObj.$allTask.length - 1) {
            let $backBtn = document.querySelector('a.back');
            yield sleep(200);
            $backBtn.click();
            return;
          }
          this.currentIndex += 1;
          let $nextBtn = ElementObj.$allTask[this.currentIndex];
          yield sleep(300);
          $nextBtn.click();
          setTimeout(() => {
            this.handleClickSpeedUp();
          }, 4500);
        }));
      });
    }
  }
  class tazhuanjipx extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.parentIndex = -1;
      this.currentIndex = -1;
      this.videoplaying = -1;
      this.timer = null;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        this.handleClickSpeedUp();
      });
    }
    getParentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        this.handleClickSpeedUp();
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        showTip('⚠️⚠️⚠️\u6b63\u5728\u521d\u59cb\u5316', 1500);
        ElementObj.$allTask.forEach((item, index) => {
          let $pagress = item.querySelector('.badge');
          let status = $pagress.innerText;
          if (parseInt(status) != 100 && this.currentIndex == -1) {
            this.currentIndex = index;
          }
        });
        showTip('⚠️⚠\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        let $nextBtn = ElementObj.$allTask[this.currentIndex];
        yield sleep(200);
        $nextBtn.click();
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4500);
        void 0;
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          ElementObj.$video = document.querySelectorAll('video')[1] || document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(true);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.timer);
        clearInterval(this.listenVidoeStatusTimer);
        yield this.getVideoDom();
        ElementObj.$video.volume = 0;
        ElementObj.$video.play();
        ElementObj.$video.playbackRate = toolOption.accelerator;
        ElementObj.$handleSpeedUp.style.background = '#f01414';
        ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
        this.listenTopic();
        this.listenVidoeStatus(ElementObj.$video, () => {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
        });
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          if (this.currentIndex >= ElementObj.$allTask.length - 1) {
            void 0;
            return;
          }
          setTimeout(() => {
            this.handleClickSpeedUp();
          }, 4500);
        }));
      });
    }
    listenTopic() {
      this.timer = setInterval(() => __awaiter(this, void 0, void 0, function* () {
        var _b;
        let topicList = document.querySelectorAll('.ccQuestionList li');
        if (topicList.length) {
          clearInterval(this.timer);
          let result = MyTool.getValue('isRight');
          if (!result) {
            let $item = topicList[0];
            $item.click();
          } else {
            let $item = topicList[1];
            $item.click();
          }
          yield sleep(3000);
          let $rightBtn = document.querySelector('#rightBtn');
          if (!!$rightBtn) {
            MyTool.setValue('isRight', true);
            $rightBtn.click();
          } else {
            MyTool.setValue('isRight', false);
            (_b = $el('#wrongBtn')) === null || _b === void 0 ? void 0 : _b.click();
          }
        }
      }), 1000 * 10);
    }
  }
  class henanzhuanjipeixun extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.parentIndex = -1;
      this.currentIndex = -1;
      this.videoplaying = -1;
      this.timer = null;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          var _b;
          try {
            ElementObj.$allTask = document.querySelectorAll('tbody tr');
            if (ElementObj.$allTask.length) {
              clearInterval(interval);
              this.getCurrentIndex();
            }
            let $iframe = (_b = document.querySelector('#playerFrame')) === null || _b === void 0 ? void 0 : _b.contentDocument;
            ElementObj.$video = $iframe.querySelector('video');
            if (!!ElementObj.$video) {
              clearInterval(interval);
              this.handleClickSpeedUp();
            }
            ElementObj.$handleSpeedUp.style.display = 'none';
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        showTip('⚠️⚠️⚠️\u6b63\u5728\u521d\u59cb\u5316', 1500);
        ElementObj.$allTask.forEach((item, index) => {
          if (index > 1) {
            let $pagress = item.querySelectorAll('td')[2];
            let status = $pagress.innerText;
            if (parseInt(status) != 100 && this.currentIndex == -1) {
              this.currentIndex = index;
            }
          }
        });
        void 0;
        let homeUrl = location.href;
        GM_setValue("homeUrl", homeUrl);
        showTip('⚠️⚠\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        let $nextBtn = ElementObj.$allTask[this.currentIndex].querySelectorAll('td')[3].querySelector('a');
        yield sleep(200);
        $nextBtn.click();
        yield sleep(1500);
        let $textbtn = document.querySelector('input.textbtn');
        $textbtn.click();
        setTimeout(() => {
          window.close();
        }, 4500);
        void 0;
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          var _b;
          let $iframe = (_b = document.querySelector('#playerFrame')) === null || _b === void 0 ? void 0 : _b.contentDocument;
          ElementObj.$video = $iframe.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(true);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        yield this.getVideoDom();
        ElementObj.$video.setAttribute('muted', 'muted');
        ElementObj.$video.volume = 0;
        ElementObj.$video.play();
        ElementObj.$video.playbackRate = toolOption.accelerator;
        ElementObj.$handleSpeedUp.style.background = '#f01414';
        ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
        this.listenVidoeStatus(ElementObj.$video, () => {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
        });
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          setTimeout(() => {
            window.close();
          }, 2500);
          let homeUrl = GM_getValue("homeUrl", null);
          void 0;
          GM_openInTab(homeUrl, {
            active: true
          });
          return;
        }));
      });
    }
  }
  class zhejiangtjj extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.parentIndex = -1;
      this.currentIndex = -1;
      this.videoplaying = -1;
      this.timer = null;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          try {
            let $allTask = document.querySelectorAll('.course_2'); 
            let $allTask2 = document.querySelectorAll('tbody tr.el-table__row');
            if ($allTask.length || $allTask2.length) {
              clearInterval(interval);
              ElementObj.$parentNodes = $allTask.length ? $allTask : $allTask2;
              let type = $allTask.length ? 1 : 2;
              this.getParentIndex(type);
            }
            ElementObj.$allTask = document.querySelectorAll('.page-name');
            if (ElementObj.$allTask.length) {
              clearInterval(interval);
              this.getCurrentIndex();
            }
            ElementObj.$handleSpeedUp.style.display = 'none';
          } catch (e) {}
        }), 1000);
      });
    }
    getParentIndex(type) {
      return __awaiter(this, void 0, void 0, function* () {
        showTip('⚠️⚠️⚠️\u6b63\u5728\u521d\u59cb\u5316', 1500);
        let startindex = type == 1 ? 0 : -1;
        ElementObj.$parentNodes.forEach((item, index) => {
          if (index > startindex) {
            let $pagress = item.querySelector('.el-progress__text');
            let status = $pagress.innerText;
            if (parseInt(status) != 100 && this.currentIndex == -1) {
              this.currentIndex = index;
            }
          }
        });
        void 0;
        if (this.currentIndex == -1 && type == 2) {
          let homeUrl = 'https://edu.tjj.zj.gov.cn/#/personal?componentId=ClassList&type=classlist';
          GM_openInTab(homeUrl, {
            active: true
          });
          setTimeout(() => {
            window.close();
          }, 3500);
          return;
        }
        showTip('⚠️⚠\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        let $nextBtn = ElementObj.$parentNodes[this.currentIndex].querySelector('button');
        yield sleep(200);
        $nextBtn.click();
        setTimeout(() => {
          location.reload();
        }, 3000);
        void 0;
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        showTip('⚠️⚠️⚠️\u6b63\u5728\u521d\u59cb\u5316', 3500);
        ElementObj.$allTask.forEach((item, index) => {
          let activeClass = 'complete';
          if (!item.classList.contains(activeClass) && this.currentIndex == -1) {
            this.currentIndex = index;
          }
        });
        ElementObj.$handleSpeedUp.style.display = 'none';
        showTip('🔉\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        let $nextBtn = ElementObj.$allTask[this.currentIndex];
        yield sleep(200);
        $nextBtn.click();
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4500);
        void 0;
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          var _b;
          let $iframe = (_b = document.querySelector('#playerFrame')) === null || _b === void 0 ? void 0 : _b.contentDocument;
          ElementObj.$video = $iframe.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(true);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        yield this.getVideoDom();
        ElementObj.$video.setAttribute('muted', 'muted');
        ElementObj.$video.volume = 0;
        let $startBtn = document.querySelector('.mejs__overlay-button');
        yield sleep(200);
        $startBtn.click();
        ElementObj.$video.playbackRate = toolOption.accelerator;
        ElementObj.$handleSpeedUp.style.background = '#f01414';
        ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
        this.punchCard();
        this.listenVidoeStatus(ElementObj.$video, () => {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
        });
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          if (this.currentIndex >= ElementObj.$allTask.length - 1) {
            setTimeout(() => {
              window.close();
            }, 3500);
            let $backBtn = document.querySelector('.back-btn');
            yield sleep(200);
            $backBtn.click();
            return;
          }
          this.currentIndex += 1;
          let $nextBtn = ElementObj.$allTask[this.currentIndex];
          yield sleep(300);
          $nextBtn.click();
          setTimeout(() => {
            this.handleClickSpeedUp();
          }, 4500);
        }));
      });
    }
    punchCard() {
      setInterval(() => {
        let $elem = document.querySelector('.btn-submit');
        if (!!$elem) {
          $elem.click();
        }
      }, 5000);
    }
  }
  class guizhouzxjxjy extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.parentIndex = -1;
      this.currentIndex = -1;
      this.videoplaying = -1;
      this.timer = null;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          try {
            ElementObj.$allTask = document.querySelectorAll('.lcml_djj_list li');
            if (ElementObj.$allTask.length) {
              clearInterval(interval);
              this.getCurrentIndex();
            }
            ElementObj.$handleSpeedUp.style.display = 'none';
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        showTip('⚠️⚠️⚠️\u6b63\u5728\u521d\u59cb\u5316', 1500);
        let activeClass = 'on';
        ElementObj.$allTask.forEach((item, index) => {
          if (item.classList.contains(activeClass) && this.currentIndex == -1) {
            this.currentIndex = index;
          }
        });
        void 0;
        showTip('⚠️⚠\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        ElementObj.$allTask[this.currentIndex].click();
        showTip('⚠️⚠\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4500);
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          let $startBtn = document.querySelector('.xgplayer-start');
          if (!!$startBtn) {
            $startBtn.click();
          }
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(true);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        yield this.getVideoDom();
        ElementObj.$video.setAttribute('muted', 'muted');
        ElementObj.$video.volume = 0;
        ElementObj.$video.play();
        ElementObj.$video.playbackRate = toolOption.accelerator;
        ElementObj.$handleSpeedUp.style.background = '#f01414';
        ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
        this.listenVidoeStatus(ElementObj.$video, () => {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
        });
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          if (this.currentIndex >= ElementObj.$allTask.length - 1) {
            void 0;
            return;
          }
          this.currentIndex += 1;
          let $nextBtn = ElementObj.$allTask[this.currentIndex];
          yield sleep(300);
          $nextBtn.click();
          setTimeout(() => {
            this.handleClickSpeedUp();
          }, 4500);
        }));
      });
    }
  }
  class jiangxizhipeizaixian extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.parentIndex = -1;
      this.currentIndex = -1;
      this.timer = null;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          try {
            ElementObj.$allTask = document.querySelectorAll('.units_wrap_box___1ncip');
            if (ElementObj.$allTask.length) {
              clearInterval(interval);
              this.getCurrentIndex();
            }
            ElementObj.$handleSpeedUp.style.display = 'none';
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        showTip('⚠️⚠️⚠️\u6b63\u5728\u521d\u59cb\u5316', 1500);
        ElementObj.$allTask.forEach((item, index) => {
          let $pregree = item.querySelector('.progress_get_on___3TDga');
          let $not_start = item.querySelector('.not_start___3dAwS');
          if ((!!$pregree || !!$not_start) && this.currentIndex == -1) {
            this.currentIndex = index;
          }
        });
        if (this.currentIndex == -1) {
          this.currentIndex = 0;
        }
        void 0;
        showTip('⚠️⚠\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        ElementObj.$allTask[this.currentIndex].click();
        showTip('⚠️⚠\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4500);
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(true);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        yield this.getVideoDom();
        ElementObj.$video.setAttribute('muted', 'muted');
        ElementObj.$video.volume = 0;
        ElementObj.$video.play();
        setTimeout(() => {
          ElementObj.$video.playbackRate = toolOption.accelerator;
        }, 3500);
        ElementObj.$handleSpeedUp.style.background = '#f01414';
        ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
        this.listenVidoeStatus(ElementObj.$video, () => {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
        });
        this.listenRebort();
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          if (this.currentIndex >= ElementObj.$allTask.length - 1) {
            void 0;
            return;
          }
          this.currentIndex += 1;
          let $nextBtn = ElementObj.$allTask[this.currentIndex];
          yield sleep(300);
          $nextBtn.click();
          setTimeout(() => {
            this.handleClickSpeedUp();
          }, 4500);
        }));
        ElementObj.$video.addEventListener('pause', () => {
          setTimeout(() => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          }, 1500);
        });
      });
    }
    listenRebort() {
      this.listenRebortTime = setInterval(() => {}, 10 * 1000);
    }
  }
  class anhuijixujyzx extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.parentIndex = -1;
      this.currentIndex = -1;
      this.timer = null;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          var _b;
          try {
            ElementObj.$btn_dropdown = document.querySelector('.btn_dropdown');
            (_b = ElementObj.$btn_dropdown) === null || _b === void 0 ? void 0 : _b.click();
            let $nextBtn = document.querySelector('.btn.btn-green');
            if (!!$nextBtn) {
              clearInterval(interval);
              yield sleep(300);
              $nextBtn.click();
            }
            ElementObj.$allTask = document.querySelectorAll('.list-order ul li a:not(.toggle_lesson)');
            if (ElementObj.$allTask.length) {
              clearInterval(interval);
              this.getCurrentIndex();
            }
            ElementObj.$handleSpeedUp.style.display = 'none';
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      var _b;
      return __awaiter(this, void 0, void 0, function* () {
        showTip('⚠️⚠️⚠️\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 1500);
        yield sleep(1500);
        let $sectionlist = $el('#sectionlist');
        if ($sectionlist.style.display != 'none') {
          (_b = ElementObj.$btn_dropdown) === null || _b === void 0 ? void 0 : _b.click();
        }
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4500);
      });
    }
    getIndex() {
      let index = 0;
      for (var i = 0; i <= ElementObj.$allTask.length - 1; i++) {
        let $parentElement = ElementObj.$allTask[i].parentElement;
        if ($parentElement.classList.contains('current')) {
          index = i;
          break;
        }
      }
      return index;
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          ElementObj.$video = document.querySelectorAll('video');
          if (ElementObj.$video.length > 1) {
            ElementObj.$video = document.querySelectorAll('video')[1];
          } else {
            ElementObj.$video = document.querySelectorAll('video')[0];
          }
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(1);
          } else {
            clearInterval(Timer);
            resolve(2);
          }
        }, 3000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.timer);
        let studyType = yield this.getVideoDom();
        if (studyType == 1) {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
          setTimeout(() => {
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 3500);
          ElementObj.$handleSpeedUp.style.background = '#f01414';
          ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
          this.listenPlayTime();
          this.listenVidoeStatus(ElementObj.$video, () => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          });
          ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {}));
          ElementObj.$video.addEventListener('pause', () => {
            setTimeout(() => {
              ElementObj.$video.volume = 0;
              ElementObj.$video.play();
            }, 1500);
          });
        }
        if (studyType == 2) {
          showTip('🔉\u68c0\u6d4b\u5230\u6ca1\u6709\u89c6\u9891，3\u79d2\u540e\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a', 3000);
          yield sleep(3000);
          let index = this.getIndex();
          void 0;
          let $preNext = document.querySelector('.preNext.next');
          if (!!$preNext) {
            $preNext.click();
            return;
          }
          let $nextBtn = ElementObj.$allTask[index + 1];
          yield sleep(200);
          $nextBtn.click();
        }
      });
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {});
    }
    listenPlayTime() {
      showTip('🔉\u8bfe\u4ef6\u6b63\u5728\u5b66\u4e60，\u8bf7\u52a1\u70b9\u51fb\u6216\u957f\u65f6\u95f4\u9690\u85cf');
      let count = 0;
      this.timer = setInterval(() => {
        count += 1;
        let $nextBtn = document.querySelector('.btn.btn-green');
        if (!!$nextBtn) {
          clearInterval(this.timer);
          showTip('🔉\u68c0\u6d4b\u5230\u89c6\u9891\u5df2\u5b66\u5b8c，3\u79d2\u540e\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a');
          setTimeout(() => {
            $nextBtn.click();
          }, 3000);
        }
      }, 3000);
    }
  }
  class lanzhoudxgs extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.parentIndex = -1;
      this.currentIndex = -1;
      this.timer = null;
      this.listenVidoeStatusTimer = null;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          var _b;
          try {
            ElementObj.$btn_dropdown = document.querySelector('#catalogA');
            (_b = ElementObj.$btn_dropdown) === null || _b === void 0 ? void 0 : _b.click();
            ElementObj.$allTask = document.querySelectorAll('li.activity-node');
            if (ElementObj.$allTask.length) {
              clearInterval(interval);
              this.getCurrentIndex();
            }
            ElementObj.$handleSpeedUp.style.display = 'none';
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      var _b;
      return __awaiter(this, void 0, void 0, function* () {
        showTip('⚠️⚠️⚠️\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 1500);
        yield sleep(1500);
        let $sectionlist = $el('#toolsContentDiv');
        if ($sectionlist.style.display != 'none') {
          (_b = ElementObj.$btn_dropdown) === null || _b === void 0 ? void 0 : _b.click();
        }
        let arr = [];
        ElementObj.$allTask.forEach((item, index) => {
          let $i = item.querySelector('.cedu-file-video');
          if (!!$i) {
            arr.push(item);
          }
        });
        ElementObj.$allTask = arr;
        this.currentIndex = 0;
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4500);
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          let $playBtn = document.querySelector('.vjs-big-play-button');
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video && !!$playBtn) {
            clearInterval(Timer);
            resolve(true);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        yield this.getVideoDom();
        ElementObj.$video.setAttribute('muted', 'muted');
        ElementObj.$video.volume = 0;
        let $playBtn = document.querySelector('.vjs-big-play-button');
        yield sleep(200);
        void 0;
        $playBtn === null || $playBtn === void 0 ? void 0 : $playBtn.click();
        yield sleep(2500);
        ElementObj.$video.pause();
        setTimeout(() => {
          ElementObj.$video.currentTime -= 30;
          ElementObj.$video.play();
        }, 2500);
        setTimeout(() => {
          ElementObj.$video.playbackRate = toolOption.accelerator;
        }, 3500);
        this.changeHtml($el('#video_div'));
        this.listenPlayTime();
        this.listenPageHide();
        this.listenVidoeStatus(ElementObj.$video, () => {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
        });
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          this.playNext();
        }));
        ElementObj.$video.addEventListener('pause', () => {
          setTimeout(() => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          }, 1500);
        });
      });
    }
    listenPlayTime() {
      showTip('🔉\u8bfe\u4ef6\u6b63\u5728\u5b66\u4e60，\u8bf7\u52a1\u70b9\u51fb\u6216\u957f\u65f6\u95f4\u9690\u85cf');
      let count = 0;
      this.timer = setInterval(() => {
        count += 1;
        let time = (ElementObj.$video.currentTime / 60).toFixed(2);
        this.addInfo(`\u5df2\u76d1\u6d4b${count}\u6b21，\u5f53\u524d\u72b6\u6001\u6b63\u5728\u5b66\u4e60，\u5df2\u64ad\u653e${time}\u5206\u949f`);
        if (ElementObj.$video.currentTime >= ElementObj.$video.duration - 4) {
          this.playNext();
        }
      }, 5000);
    }
    listenVidoeStatus($video, callback) {
      if (!$video) return;
      let count = 0;
      this.timer2 = setInterval(() => {
        if ($video.readyState < 4) {
          void 0;
          this.addInfo(`\u68c0\u6d4b\u5230${count}\u6b21，\u89c6\u9891\u6b63\u5728\u52a0\u8f7d`, 0);
          count += 1;
          if (count >= 20) {
            location.reload();
          }
        }
        let status = $video.paused;
        if (status) {
          count += 1;
          void 0;
          if (typeof callback == 'function') {
            if (count >= 20) {
              location.reload();
            } else {
              callback();
            }
          } else {
            void 0;
          }
        }
      }, 3000);
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        showTip('⚠️⚠️⚠️\u68c0\u6d4b\u5230\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a\u89c6\u9891', 4500);
        yield sleep(5000);
        this.currentIndex += 1;
        let $nextBtn = ElementObj.$allTask[this.currentIndex];
        yield sleep(300);
        let $i = $nextBtn.querySelector('.cedu-file-video');
        if (!!$i) {
          $nextBtn.click();
        } else {
          void 0;
        }
      });
    }
  }
  class jidianshejijiaoyu extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.parentIndex = -1;
      this.currentIndex = -1;
      this.swiperIndex = -1;
      this.timer = null;
      this.listenVidoeStatusTimer = null;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          try {
            let $btn0 = document.querySelector('.layui-layer-btn0');
            if (!!$btn0) {
              clearInterval(interval);
              this.playNext();
              return;
            }
            ElementObj.$allTask = document.querySelectorAll('.course_chapter_item');
            if (ElementObj.$allTask.length) {
              clearInterval(interval);
              this.getCurrentIndex();
            }
            ElementObj.$handleSpeedUp.style.display = 'none';
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        showTip('⚠️⚠️⚠️\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 1500);
        yield sleep(1500);
        ElementObj.$allTask.forEach((item, index) => {
          let $i = item.querySelector('i.fa-circle');
          if (!$i && this.currentIndex == -1) {
            this.currentIndex = index;
          }
        });
        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        ElementObj.$allTask[this.currentIndex].querySelector('.section_title').click();
        showTip('⚠️⚠️⚠️\u6b63\u5728\u521d\u59cb\u5316', 3500);
        setTimeout(() => {
          this.getSwiperIndex();
        }, 4500);
      });
    }
    getSwiperIndex() {
      ElementObj.$swiperItem = document.querySelectorAll('#menu_tarr_content .courseware_menu_item');
      this.swiperIndex = -1;
      for (var i = 0; i <= ElementObj.$swiperItem.length - 1; i++) {
        let $item = ElementObj.$swiperItem[i];
        let $i = $item.querySelector('.icon-note-video-learning');
        if (!!$i) {
          this.swiperIndex = i;
          $item.click();
          setTimeout(() => {
            this.handleClickSpeedUp();
          }, 3500);
          break;
        }
      }
      if (this.swiperIndex == -1) {
        location.reload();
      }
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          let $playBtn = document.querySelector('.vjs-big-play-button');
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video && !!$playBtn) {
            clearInterval(Timer);
            resolve(true);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        yield this.getVideoDom();
        ElementObj.$video.setAttribute('muted', 'muted');
        ElementObj.$video.volume = 0;
        yield sleep(2500);
        ElementObj.$video.play();
        this.changeHtml($el('.video-play'));
        this.listenPlayTime();
        this.listenPageHide();
        this.listenVidoeStatus(ElementObj.$video, () => {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
        });
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          this.playNext();
        }));
        ElementObj.$video.addEventListener('pause', () => {
          setTimeout(() => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          }, 1500);
        });
      });
    }
    listenPlayTime() {
      showTip('🔉\u8bfe\u4ef6\u6b63\u5728\u5b66\u4e60，\u8bf7\u52a1\u70b9\u51fb\u6216\u957f\u65f6\u95f4\u9690\u85cf');
      let count = 0;
      this.timer = setInterval(() => {
        count += 1;
        let time = (ElementObj.$video.currentTime / 60).toFixed(2);
        this.addInfo(`\u5df2\u76d1\u6d4b${count}\u6b21，\u5f53\u524d\u72b6\u6001\u6b63\u5728\u5b66\u4e60，\u5df2\u64ad\u653e${time}\u5206\u949f`);
        let $complete = document.querySelector('.complete');
        if (!!$complete) {
          this.addInfo(`✅✅✅，\u5f53\u524d\u89c6\u9891\u64ad\u653e\u5b8c\u6210，5\u79d2\u540e\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a\u89c6\u9891`);
          if (this.swiperIndex >= ElementObj.$swiperItem.length - 1) {
            location.reload();
          } else {
            this.swiperIndex += 1;
            $el('#right_tarr').click();
            setTimeout(() => {
              this.handleClickSpeedUp();
            }, 3500);
          }
        }
        if (ElementObj.$video.currentTime >= ElementObj.$video.duration - 4) {
          this.playNext();
        }
      }, 5000);
    }
    listenVidoeStatus($video, callback) {
      if (!$video) return;
      let count = 0;
      this.timer2 = setInterval(() => {
        if ($video.readyState < 4) {
          void 0;
          this.addInfo(`\u68c0\u6d4b\u5230${count}\u6b21，\u89c6\u9891\u6b63\u5728\u52a0\u8f7d`, 0);
          count += 1;
          if (count >= 20) {
            location.reload();
          }
        }
        let status = $video.paused;
        if (status) {
          count += 1;
          void 0;
          if (typeof callback == 'function') {
            if (count >= 20) {
              location.reload();
            } else {
              callback();
            }
          } else {
            void 0;
          }
        }
      }, 3000);
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        showTip('⚠️⚠️⚠️\u68c0\u6d4b\u5230\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a\u89c6\u9891', 4500);
        yield sleep(5000);
        let $btn0 = document.querySelector('.layui-layer-btn0');
        if (!!$btn0) {
          $btn0.click();
          yield sleep(2000);
          location.reload();
        }
      });
    }
  }
  class sipingnengcun extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.parentIndex = -1;
      this.currentIndex = -1;
      this.timer = null;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          try {
            ElementObj.$allTask = document.querySelectorAll('.videolist_item');
            if (ElementObj.$allTask.length) {
              clearInterval(interval);
              this.getCurrentIndex();
            }
            ElementObj.$handleSpeedUp.style.display = 'none';
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        let activeClass = 'is-success';
        ElementObj.$allTask.forEach((item, index) => {
          let $pregress = item.querySelector('.el-progress');
          if (!$pregress.classList.contains(activeClass) && this.currentIndex == -1) {
            this.currentIndex = index;
          }
        });
        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        ElementObj.$allTask[this.currentIndex].click();
        showTip('⚠️⚠️⚠️\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3500);
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4500);
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(true);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        yield this.getVideoDom();
        ElementObj.$video.volume = 0;
        ElementObj.$video.play();
        setTimeout(() => {
          ElementObj.$video.playbackRate = toolOption.accelerator;
        }, 3500);
        this.listenVidoeStatus(ElementObj.$video, () => {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
        });
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          showTip('⚠️⚠️⚠️\u68c0\u6d4b\u5230\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a\u89c6\u9891', 4500);
          if (this.currentIndex >= ElementObj.$allTask.length - 1) {
            void 0;
            return;
          }
          this.currentIndex += 1;
          setTimeout(() => {
            this.handleClickSpeedUp();
          }, 4500);
        }));
        ElementObj.$video.addEventListener('pause', () => {
          setTimeout(() => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
            setTimeout(() => {
              ElementObj.$video.playbackRate = toolOption.accelerator;
            }, 3500);
          }, 1500);
        });
      });
    }
  }
  class ycjyluteducn extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this.parentIndex = -1;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        void 0;
        window.alert = function () {
          void 0;
        };
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          void 0;
          try {
            if (location.pathname == "/learnspace/learn/learn/blue/content_video.action") {
              clearInterval(interval);
              window.close();
              return;
            }
            let $menu = document.querySelector('#courseware_main_menu');
            let $menu_a = $menu.querySelector('a');
            if (!!$menu_a) {
              clearInterval(interval);
              $menu_a.click();
              this.findParentIndex();
            }
          } catch (e) {}
        }), 1000);
      });
    }
    findParentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        showTip('🔉\u6b63\u5728\u521d\u59cb\u5316', 2500);
        yield sleep(4500);
        ElementObj.$handleSpeedUp.style.display = 'none';
        let $contentIframe = document.querySelector('.contentIframe');
        let _document = $contentIframe.contentWindow.document;
        ElementObj.$parentNodes = _document.querySelectorAll('.vcon li');
        ElementObj.$parentNodes.forEach((item, index) => {
          let $span = item.querySelector('span');
          if (($span.classList.contains('undo') || $span.classList.contains('doing')) && this.parentIndex == -1) {
            this.parentIndex = index;
          }
        });
        void 0;
        if (this.parentIndex == -1) {
          void 0;
          return;
        }
        ElementObj.$parentNodes[this.parentIndex].querySelector('a').click();
        this.getCurrentIndex();
      });
    }
    getCurrentIndex() {
      var _b;
      return __awaiter(this, void 0, void 0, function* () {
        showTip('\u6b63\u5728\u521d\u59cb\u5316', 2500);
        yield sleep(4500);
        let $contentIframe = document.querySelector('.contentIframe');
        ElementObj._document = $contentIframe.contentWindow.document;
        ElementObj.$allTask = ElementObj._document.querySelectorAll('.menub');
        this.currentIndex = 0;
        (_b = ElementObj.$allTask[this.currentIndex]) === null || _b === void 0 ? void 0 : _b.click();
        showTip('\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e');
        this.handleClickSpeedUp();
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          let _document = ElementObj._document.querySelector('#mainFrame').contentDocument;
          ElementObj.$video = _document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(1);
            return;
          }
          let $doc = _document.querySelector('#content_frame');
          if (!!$doc) {
            clearInterval(Timer);
            resolve(2);
          } else {
            clearInterval(Timer);
            resolve(2);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        clearInterval(this.timer2);
        let studytype = yield this.getVideoDom();
        this.listenRebort();
        if (studytype == 1) {
          ElementObj.$video.volume = 0;
          yield sleep(200);
          ElementObj.$video.play();
          setTimeout(() => {
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 3000);
          this.listenVidoeStatus(ElementObj.$video, () => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
            setTimeout(() => {
              ElementObj.$video.playbackRate = toolOption.accelerator;
            }, 3000);
          });
          ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
            yield sleep(3000);
            this.playNext();
          }));
        }
        if (studytype == 2) {
          this.timer2 = setTimeout(() => {
            this.playNext();
          }, 7000);
        }
      });
    }
    listenRebort() {
      this.listenRebortTime = setInterval(() => {
        var pageWindow = unsafeWindow;
        unsafeWindow.alert = function () {
          void 0;
        };
        let $btn = document.querySelector('.layui-layer-btn a');
        if (!!$btn) {
          $btn.click();
          ElementObj.$video.play();
          setTimeout(() => {
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 3000);
        }
      }, 10 * 1000);
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        showTip('✅✅✅\u64ad\u653e\u5b8c\u6210，\u6b63\u5728\u5207\u6362\u8bfe\u7a0b', 3500);
        if (this.currentIndex >= ElementObj.$allTask.length - 1) {
          this.parentIndex += 1;
          ElementObj.$parentNodes[this.parentIndex].querySelector('a').click();
          setTimeout(() => {
            this.getCurrentIndex();
          }, 4500);
          return;
        }
        this.currentIndex += 1;
        ElementObj.$allTask[this.currentIndex].click();
        yield sleep(5000);
        this.handleClickSpeedUp();
      });
    }
  }
  ycjyluteducn.ctxid = 26;
  class gdrcjxjyw extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.parentIndex = -1;
      this.currentIndex = -1;
      this.timer = null;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          try {
            ElementObj.$parentNodes = document.querySelectorAll('.m-list .item');
            if (ElementObj.$parentNodes.length) {
              clearInterval(interval);
              this.getParentIndex();
              return;
            }
            ElementObj.$video = document.querySelector('video');
            if (!!ElementObj.$video && location.host == 'www.rcjxjy.com') {
              clearInterval(interval);
              this.handleClickSpeedUp();
              return;
            }
            let $table = document.querySelectorAll('.player-table')[2];
            ElementObj.$allTask = $table.querySelectorAll('td');
            if (ElementObj.$allTask.length) {
              clearInterval(interval);
              this.getCurrentIndex();
            }
            ElementObj.$handleSpeedUp.style.display = 'none';
          } catch (e) {}
        }), 1000);
      });
    }
    getParentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        showTip('✅✅✅\u6b63\u5728\u521d\u59cb\u5316，\u8bf7\u52ff\u70b9\u51fb', 3000);
        let count = 0;
        let timer = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          ElementObj.$parentNodes[count].querySelector('.btn-continue-study').click();
          yield sleep(500);
          ElementObj.$allTask = document.querySelectorAll('.video-item .f-cb');
          for (var i = 0; i <= ElementObj.$allTask.length - 1; i++) {
            let $status = ElementObj.$allTask[i].querySelector('.videoName').innerText;
            if ($status != '\u64ad\u653e\u5b8c\u6210') {
              clearInterval(timer);
              showTip('✅✅✅\u521d\u59cb\u5316\u5b8c\u6210');
              let $nextBtn = ElementObj.$allTask[i].querySelector('a.u-btn');
              $nextBtn.click();
              break;
            }
          }
          count += 1;
        }), 3000);
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        let _currentIndex = -1;
        ElementObj.$allTask.forEach((item, index) => {
          let $pagress = item.querySelector('.playLine');
          let status = $pagress.innerText;
          if (parseInt(status) != 100 && this.currentIndex == -1) {
            this.currentIndex = index;
          }
          if (item.classList.contains('couBg')) {
            _currentIndex = index;
          }
        });
        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        if (this.currentIndex != _currentIndex) {
          let $nextBtn = ElementObj.$allTask[this.currentIndex].querySelector('a');
          $nextBtn.click();
        }
        showTip('⚠️⚠️⚠️\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3500);
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4500);
      });
    }
    getVideoDom() {
      ElementObj.$handleSpeedUp.style.display = 'none';
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(true);
            return;
          }
          let $iframe = document.querySelector('#c_frame').contentDocument;
          ElementObj.$video = $iframe.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(true);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        yield this.getVideoDom();
        ElementObj.$video.volume = 0;
        ElementObj.$video.play();
        setTimeout(() => {
          ElementObj.$video.playbackRate = toolOption.accelerator;
        }, 3500);
        this.listenVidoeStatus(ElementObj.$video, () => {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
        });
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          showTip('⚠️⚠️⚠️\u68c0\u6d4b\u5230\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a\u89c6\u9891', 4500);
          yield sleep(3000);
          if (location.host == 'www.rcjxjy.com') {
            let $backBtn = document.querySelector('a.u-btn.normal');
            $backBtn.click();
          } else {
            location.reload();
          }
        }));
        ElementObj.$video.addEventListener('pause', () => {
          setTimeout(() => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 1500);
        });
      });
    }
  }
  class shandongqlteacher extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.parentIndex = -1;
      this.currentIndex = -1;
      this.timer = null;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          try {
            ElementObj.$allTask = document.querySelectorAll('app-course-catalogue.ng-star-inserted .ant-list-items li');
            if (ElementObj.$allTask.length) {
              clearInterval(interval);
              this.getCurrentIndex();
            }
            ElementObj.$handleSpeedUp.style.display = 'none';
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        ElementObj.$allTask.forEach((item, index) => {
          let $icon = item.querySelector('div.align-items-center');
          if (!$icon && this.currentIndex == -1) {
            this.currentIndex = index;
          }
        });
        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        showTip('⚠️⚠️⚠️\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3500);
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4500);
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(true);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.timer);
        yield this.getVideoDom();
        ElementObj.$video.volume = 0;
        ElementObj.$video.play();
        setTimeout(() => {
          ElementObj.$video.playbackRate = toolOption.accelerator;
        }, 3500);
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          showTip('⚠️⚠️⚠️\u68c0\u6d4b\u5230\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a\u89c6\u9891', 4500);
          yield sleep(3000);
          this.currentIndex += 1;
          let $nextBtn = ElementObj.$allTask[this.currentIndex];
          $nextBtn.click();
          setTimeout(() => {
            this.handleClickSpeedUp();
          }, 4500);
        }));
        ElementObj.$video.addEventListener('pause', () => {
          setTimeout(() => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 1500);
        });
      });
    }
    listenPlayTime() {
      showTip('⚠️⚠️⚠️\u8bfe\u4ef6\u6b63\u5728\u5b66\u4e60，\u8bf7\u52a1\u70b9\u51fb\u6216\u957f\u65f6\u95f4\u9690\u85cf');
      let count = 0;
      this.timer = setInterval(() => {
        count += 1;
        let time = (ElementObj.$video.currentTime / 60).toFixed(2);
        let countdown = $el('.count-down').innerText;
        this.addInfo(`\u5df2\u76d1\u6d4b${count}\u6b21，\u5f53\u524d\u72b6\u6001\u6b63\u5728\u5b66\u4e60，\u5df2\u64ad\u653e${time}\u5206\u949f， ${countdown}`);
      }, 5000);
    }
  }
  class shixuetong extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.parentIndex = -1;
      this.currentIndex = -1;
      this.timer = null;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          try {
            ElementObj.$allTask = document.querySelectorAll('.Nvideo-item li');
            if (ElementObj.$allTask.length) {
              clearInterval(interval);
              $el('.Nvideo-playbox').style.position = 'relative';
              this.getCurrentIndex();
            }
            ElementObj.$handleSpeedUp.style.display = 'none';
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        this.currentIndex = 0;
        showTip('⚠️⚠️⚠️\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3500);
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4500);
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let count = 0;
        let Timer = setInterval(() => {
          count += 1;
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(1);
          }
          if (count > 10) {
            clearInterval(Timer);
            resolve(2);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.timer);
        clearInterval(this.timer2);
        let studyType = yield this.getVideoDom();
        if (studyType == 1) {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
          setTimeout(() => {
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 3500);
          this.changeHtml($el('.video'));
          this.listenPageHide();
          this.listenPlayTime();
          this.listenRebort();
          this.listenVidoeStatus(ElementObj.$video, () => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          });
          ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
            showTip('⚠️⚠️⚠️\u68c0\u6d4b\u5230\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a\u89c6\u9891', 4500);
            this.playNext();
          }));
          ElementObj.$video.addEventListener('pause', () => {
            setTimeout(() => {
              ElementObj.$video.volume = 0;
              ElementObj.$video.play();
              ElementObj.$video.playbackRate = toolOption.accelerator;
            }, 1500);
          });
        }
        if (studyType == 2) {
          showTip('⚠️⚠️⚠️\u68c0\u6d4b\u5230\u5f53\u524d\u4e0d\u662f\u89c6\u9891，5\u79d2\u540e\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a\u89c6\u9891', 4500);
          this.playNext();
        }
      });
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        yield sleep(3000);
        this.currentIndex += 1;
        let $nextBtn = ElementObj.$allTask[this.currentIndex];
        $nextBtn.click();
        setTimeout(() => {
          let $confirm = document.querySelector('.layui-layer-btn- a');
          $confirm === null || $confirm === void 0 ? void 0 : $confirm.click();
          this.handleClickSpeedUp();
        }, 4500);
      });
    }
    listenPlayTime() {
      showTip('⚠️⚠️⚠️\u8bfe\u4ef6\u6b63\u5728\u5b66\u4e60，\u8bf7\u52a1\u70b9\u51fb\u6216\u957f\u65f6\u95f4\u9690\u85cf');
      let count = 0;
      this.timer = setInterval(() => __awaiter(this, void 0, void 0, function* () {
        count += 1;
        let time = (ElementObj.$video.currentTime / 60).toFixed(2);
        this.addInfo(`\u5df2\u76d1\u6d4b${count}\u6b21，\u5f53\u524d\u72b6\u6001\u6b63\u5728\u5b66\u4e60，\u5df2\u64ad\u653e${time}\u5206\u949f`);
        if (count % 30 == 0) {
          let $endTime = $el('#courseStudyBestMinutesNumber').innerText;
          let refreshBtn = document.querySelector('.studyCourseTimeRefresh');
          refreshBtn === null || refreshBtn === void 0 ? void 0 : refreshBtn.click();
          yield sleep(2000);
          let currentStudyTime = $el('#courseStudyMinutesNumber').innerText;
          let str = `✅✅✅\u672c\u8bfe\u7a0b\u6700\u957f\u53ef\u7d2f\u8ba1\u65f6\u95f4：${$endTime}\u5206\u949f，\u60a8\u5df2\u6210\u529f\u5b66\u4e60${currentStudyTime}\u5206\u949f`;
          this.addInfo(str, 0);
        }
      }), 5000);
    }
    listenRebort() {
      this.timer2 = setInterval(() => {
        let $codespan = document.querySelector('#codespan');
        if ($codespan) {
          clearInterval(this.timer2);
          let $code = document.querySelector("#code");
          let str = $codespan.innerText;
          $code.value = str;
          let $submit = document.querySelector('.layui-layer-btn0');
          $submit.click();
          this.listenRebort();
        }
      }, 1000 * 8);
    }
  }
  class shandongenhualvyou extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.parentIndex = -1;
      this.currentIndex = -1;
      this.timer = null;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let $toolbarnav = document.querySelector('#dashboard-toolbar-nav li');
        $toolbarnav === null || $toolbarnav === void 0 ? void 0 : $toolbarnav.click();
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          try {
            ElementObj.$allTask = document.querySelectorAll('li.task-item');
            if (ElementObj.$allTask.length) {
              clearInterval(interval);
              this.getCurrentIndex();
            }
            ElementObj.$handleSpeedUp.style.display = 'none';
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        ElementObj.$allTask.forEach((item, index) => {
          let $icon = item.querySelector('.es-icon-iccheckcircleblack24px');
          if (!$icon && this.currentIndex == -1) {
            this.currentIndex = index;
          }
        });
        if (this.currentIndex == -1) {
          this.currentIndex = 0;
        }
        showTip('⚠️⚠️⚠️\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3500);
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4500);
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          let $iframe = document.querySelector('#task-content-iframe');
          let _documet = $iframe.contentDocument;
          ElementObj.$video = $iframe.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(true);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.timer);
        yield this.getVideoDom();
        ElementObj.$video.volume = 0;
        ElementObj.$video.play();
        setTimeout(() => {
          ElementObj.$video.playbackRate = toolOption.accelerator;
        }, 3500);
        if (!ElementObj.$ctxstatsbox) {
          this.changeHtml($el('.video'));
        }
        this.listenPageHide();
        this.listenPlayTime();
        this.listenVidoeStatus(ElementObj.$video, () => {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
        });
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          showTip('⚠️⚠️⚠️\u68c0\u6d4b\u5230\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a\u89c6\u9891', 4500);
          yield sleep(3000);
          this.currentIndex += 1;
          let $nextBtn = ElementObj.$allTask[this.currentIndex];
          $nextBtn.click();
          setTimeout(() => {
            this.handleClickSpeedUp();
          }, 4500);
        }));
        ElementObj.$video.addEventListener('pause', () => {
          setTimeout(() => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 1500);
        });
      });
    }
    listenPlayTime() {
      showTip('⚠️⚠️⚠️\u8bfe\u4ef6\u6b63\u5728\u5b66\u4e60，\u8bf7\u52a1\u70b9\u51fb\u6216\u957f\u65f6\u95f4\u9690\u85cf');
      let count = 0;
      this.timer = setInterval(() => __awaiter(this, void 0, void 0, function* () {
        count += 1;
        let time = (ElementObj.$video.currentTime / 60).toFixed(2);
        let durrentTime = (ElementObj.$video.duration / 60).toFixed(2);
        this.addInfo(`\u5df2\u76d1\u6d4b${count}\u6b21，\u5f53\u524d\u72b6\u6001\u6b63\u5728\u5b66\u4e60，\u5df2\u64ad\u653e${time}\u5206\u949f，\u89c6\u9891\u603b\u65f6\u957f\u4e3a${durrentTime}`);
      }), 5000);
    }
  }
  class gansugongwuyuan extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.parentIndex = -1;
      this.currentIndex = -1;
      this.timer = null;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          try {
            let $menus = $el('.min_le_1 a');
            if (!!$menus) {
              clearInterval(interval);
              let mytoolkey = localStorage.getItem('mytoolkey');
              MyTool.setValue('mytoolkey', mytoolkey);
              $menus.click();
              yield sleep(2000);
              $el('.xuxi_1').click();
              yield sleep(2000);
              this.getParentIndex();
              return;
            }
            ElementObj.$video = document.querySelector('video');
            if (!!ElementObj.$video) {
              clearInterval(interval);
              let mytoolkey = MyTool.getValue('mytoolkey');
              this.deleteDom();
              this.handleClickSpeedUp2(mytoolkey);
            }
            ElementObj.$handleSpeedUp.style.display = 'none';
          } catch (e) {}
        }), 1000);
      });
    }
    getParentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        $el('a.my').click();
        yield sleep(2000);
        let pageNum = Number($el('#pagenumtext').value);
        var pageNumArr = [];
        for (var i = pageNum; i > 0; i--) {
          pageNumArr.push(i);
        }
        let isFind = false;
        for (let i of pageNumArr) {
          if (isFind) break;
          yield sleep(1500);
          ElementObj.$allTask = document.querySelectorAll('.main_r_dd2');
          void 0;
          for (var k = 0; k <= ElementObj.$allTask.length - 1; k++) {
            let $hqjd_btn = ElementObj.$allTask[k].querySelector('.hqjd_btn');
            if (!!$hqjd_btn) {
              $hqjd_btn.click();
              yield sleep(2500);
            }
            void 0;
            let $jinduSpan = ElementObj.$allTask[k].querySelector('.jindu div');
            void 0;
            let status = parseInt($jinduSpan.style.width);
            if (status < 100) {
              isFind = true;
              MyTool.setValue('pageNum', i);
              MyTool.setValue('homeUrl', location.href);
              let $nextBtn = ElementObj.$allTask[k].querySelector('#playVideo');
              $nextBtn === null || $nextBtn === void 0 ? void 0 : $nextBtn.click();
              setTimeout(() => {
                window.close();
              }, 1000 * 10);
              break;
            }
            pageNum -= 1;
            let $prePage = $el('.syy');
            $prePage === null || $prePage === void 0 ? void 0 : $prePage.click();
          }
        }
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {});
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(true);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        clearInterval(this.timer);
        yield this.getVideoDom();
        ElementObj.$video.volume = 0;
        ElementObj.$video.play();
        setTimeout(() => {
          ElementObj.$video.playbackRate = MyTool.getValue('accelerator');
        }, 3500);
        this.listenRebort();
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          let homeurl = MyTool.getValue('homeUrl');
          void 0;
          MyTool.openInTab(homeurl);
          setTimeout(() => {
            window.close();
          }, 10000);
          return;
        }));
        ElementObj.$video.addEventListener('pause', () => {
          setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            let $confirmBtn = document.querySelector('#dvMsgBtns input');
            $confirmBtn === null || $confirmBtn === void 0 ? void 0 : $confirmBtn.click();
            yield sleep(2000);
            ElementObj.$video.play();
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }), 2500);
        });
      });
    }
    listenRebort() {
      this.listenRebortTime = setInterval(() => {
        void 0;
        let $btn = document.querySelector('#dvMsgBtns input');
        if (!!$btn) {
          this.deleteDom();
          setTimeout(() => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          }, 1500);
        }
      }, 3000);
    }
    deleteDom() {
      let parent = document.querySelector('body');
      let child = document.getElementById('dvMsgBox');
      let child2 = document.getElementById('ShowBolightBox');
      let newElement = document.createElement('div');
      newElement.innerHTML = '<div></div>';
      parent.replaceChild(newElement, child);
      parent.replaceChild(newElement, child2);
    }
    handleClickSpeedUp2(key, callback) {
      return __awaiter(this, void 0, void 0, function* () {
        if (key) {
          this.speedStatus = 1;
          let result = yield fetchData({
            method: 'GET',
            url: bserUrl + `/speedup?toolkey=${key}&canuse=${toolOption.SchoolType}`
          });
          if (result.code == 200) {
            this.speedStatus = 1;
            toolOption.CtxMain.play();
          } else {
            showTip(`🔉🔉🔉${result.message}`, 5000, true);
            return;
          }
          this.randomListen();
        } else if (!key) {
          void 0;
          window.open(basehost);
        } else {
          void 0;
        }
      });
    }
    handleChangeCtxSpeed(e) {
      let whiteList = speedArr;
      let s = Number(e);
      if (e && whiteList.includes(s)) {
        toolOption.accelerator = s;
        MyTool.setValue('accelerator', s.toString());
        if (ElementObj.$video) {
          ElementObj.$video.playbackRate = s;
        }
      }
    }
  }
  class wlmqcol extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.parentIndex = -1;
      this.currentIndex = -1;
      this.timer = null;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          try {
            let $menu = document.querySelector('#tab-second');
            if (!!$menu) {
              clearInterval(interval);
              $menu.click();
              this.getCurrentIndex();
              return;
            }
            let $video = document.querySelector('video');
            if (!!$video) {
              clearInterval(interval);
              this.handleClickSpeedUp();
            }
            ElementObj.$handleSpeedUp.style.display = 'none';
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        yield sleep(1000);
        ElementObj.$allTask = document.querySelectorAll('.task-list');
        for (var i = 0; i <= ElementObj.$allTask.length - 1; i++) {
          let $done = ElementObj.$allTask[i].querySelector('.icon-yiwancheng');
          if (!$done) {
            this.currentIndex = i;
            break;
          }
        }
        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        let $nextBtn = document.querySelectorAll('.task-list')[this.currentIndex].querySelector('span');
        $nextBtn === null || $nextBtn === void 0 ? void 0 : $nextBtn.click();
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 3000);
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(true);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.timer);
        yield this.getVideoDom();
        ElementObj.$video.volume = 0;
        ElementObj.$video.play();
        setTimeout(() => {
          ElementObj.$video.playbackRate = toolOption.accelerator;
        }, 3500);
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          this.playNext();
        }));
        ElementObj.$video.addEventListener('pause', () => {
          setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }), 2500);
        });
      });
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        let $backBtn = document.querySelectorAll('.el-breadcrumb__inner.is-link')[1];
        $backBtn === null || $backBtn === void 0 ? void 0 : $backBtn.click();
        setTimeout(() => {
          location.reload();
        }, 3500);
      });
    }
  }
  class shandongzhuanyejisu extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          void 0;
          try {
            let $menus = document.querySelectorAll('.learn-menu-cell');
            if ($menus.length) {
              clearInterval(interval);
              this.getCurrentIndex();
            }
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      var _b;
      return __awaiter(this, void 0, void 0, function* () {
        showTip('\u6b63\u5728\u521d\u59cb\u5316');
        let $contentIframe = document.querySelector('.contentIframe');
        ElementObj._document = $contentIframe.contentWindow.document;
        if (location.pathname == '/learnspace/learn/learn/templateeight/index.action') {
          ElementObj.$allTask = ElementObj._document.querySelectorAll('.s_sectionwrap .s_point');
        } else {
          ElementObj.$allTask = ElementObj._document.querySelectorAll('.s_pointwrap .s_point');
        }
        ElementObj.$handleSpeedUp.style.display = 'none';
        let activeClass = 'done_icon_show';
        for (var i = 0; i <= ElementObj.$allTask.length - 1; i++) {
          let $item = ElementObj.$allTask[i].querySelector('.item_done_icon');
          if (!$item.classList.contains(activeClass)) {
            this.currentIndex = i;
            break;
          }
        }
        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        (_b = ElementObj.$allTask[this.currentIndex]) === null || _b === void 0 ? void 0 : _b.click();
        showTip('\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e');
        this.handleClickSpeedUp();
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let count = 0;
        let Timer = setInterval(() => {
          let _document = ElementObj._document.querySelector('#mainFrame').contentWindow.document;
          ElementObj.$video = _document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(1);
          }
          if (count >= 10) {
            clearInterval(Timer);
            resolve(2);
          }
          count++;
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        let studytype = yield this.getVideoDom();
        if (studytype == 1) {
          ElementObj.$video.volume = 0;
          yield sleep(200);
          ElementObj.$video.play();
          setTimeout(() => {
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 3000);
          this.listenRebort();
          this.listenVidoeStatus(ElementObj.$video, () => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          });
          ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
            this.playNext();
          }));
          ElementObj.$video.addEventListener('pause', () => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          });
        }
        if (studytype == 2) {
          showTip('✅✅✅\u68c0\u6d4b\u5230\u8be5\u7ae0\u8282\u4e0d\u662f\u89c6\u9891，\u5373\u5c06\u5207\u6362\u4e0b\u4e00\u8282', 2000);
          yield sleep(2000);
          this.playNext();
        }
      });
    }
    updateSpeedElement(num) {
      localStorage.setItem('_localSpeed', num.toString());
      ElementObj.$video.playbackRate = num;
    }
    listenRebort() {
      this.listenRebortTime = setInterval(() => {
        void 0;
        let $btn = document.querySelector('.layui-layer-btn0');
        if (!!$btn) {
          setTimeout(() => {
            $btn.click();
            ElementObj.$video.play();
          }, 3000);
        }
      }, 10 * 1000);
    }
    playNext() {
      if (this.currentIndex >= ElementObj.$allTask.length - 1) {
        void 0;
        return;
      }
      this.currentIndex += 1;
      ElementObj.$allTask[this.currentIndex].click();
      showTip('🔉\u6b63\u5728\u5207\u6362\u8bfe\u7a0b');
      setTimeout(() => {
        this.handleClickSpeedUp();
      }, 5000);
    }
  }
  shandongzhuanyejisu.ctxid = 26;
  class chongqingzhuanye extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          var _b, _c;
          void 0;
          try {
            ElementObj.$parentNodes = document.querySelectorAll('.course__list--content .course__item');
            if (ElementObj.$parentNodes.length) {
              clearInterval(interval);
              this.getParentIndex();
              return;
            }
            let $nextPage = document.querySelector('.btn-next');
            if ($nextPage && location.pathname == '/nms-frontend/index.html') {
              clearInterval(interval);
              this.getParentIndex2();
              return;
            }
            ElementObj.$allTask = document.querySelectorAll('ul li ul li .posCatalog_select');
            if (ElementObj.$allTask.length) {
              clearInterval(interval);
              this.getCurrentIndex();
            }
            let $iframe_aliplayer = document.querySelector('#iframe_aliplayer');
            if (!!$iframe_aliplayer) {
              clearInterval(interval);
              ElementObj.$video = (_b = $iframe_aliplayer === null || $iframe_aliplayer === void 0 ? void 0 : $iframe_aliplayer.contentDocument) === null || _b === void 0 ? void 0 : _b.querySelector('video');
              this.handleClickSpeedUp2();
              return;
            }
            let $iframe_aliplayer2 = document.querySelector('#aliPlayerFrame');
            if (!!$iframe_aliplayer2) {
              ElementObj.$allTask = (_c = $iframe_aliplayer2.contentDocument) === null || _c === void 0 ? void 0 : _c.querySelectorAll('.section .section-item');
              void 0;
              if (ElementObj.$allTask.length) {
                clearInterval(interval);
                this.getCurrentIndex2();
                return;
              }
            }
            let $menu = document.querySelectorAll('.complete-status .btn-item')[2];
            if (!!$menu) {
              clearInterval(interval);
              $menu.click();
              yield sleep(1500);
              let $items = document.querySelectorAll('#pane-MUST .text-item');
              if ($items.length === 0) {
                void 0;
                return;
              }
              MyTool.setValue('homeUrl', location.href);
              let $first_item = $items[0];
              $first_item.click();
              setTimeout(() => {
                window.close();
              }, 1000 * 10);
            }
          } catch (e) {}
        }), 1000);
      });
    }
    getParentIndex() {
      ElementObj.$parentNodes.forEach(item => {
        void 0;
        let $status = item.querySelector('span.num');
        if ($status) {
          if (parseInt($status.innerText) <= 95) {
            item.querySelector('.enter-btn').click();
            setTimeout(() => {
              location.reload();
            }, 3000);
          }
        }
      });
    }
    getParentIndex2() {
      return __awaiter(this, void 0, void 0, function* () {
        let $btn = document.querySelectorAll('.btn-box .btn-item')[2];
        $btn.click();
        yield sleep(3500);
        let $item = document.querySelectorAll('#pane-MUST .text-item')[0];
        $item.click();
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        showTip('✅✅✅\u6b63\u5728\u521d\u59cb\u5316');
        ElementObj.$handleSpeedUp.style.display = 'none';
        for (var i = 0; i <= ElementObj.$allTask.length - 1; i++) {
          let $item = ElementObj.$allTask[i].querySelector('.icon_Completed');
          if (!$item) {
            this.currentIndex = i;
            break;
          }
        }
        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        let $nextBtn = ElementObj.$allTask[this.currentIndex].querySelector('.posCatalog_name');
        $nextBtn.click();
        showTip('\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e');
        this.handleClickSpeedUp();
      });
    }
    getCurrentIndex2() {
      return __awaiter(this, void 0, void 0, function* () {
        showTip('✅✅✅\u6b63\u5728\u521d\u59cb\u5316');
        ElementObj.$handleSpeedUp.style.display = 'none';
        for (var i = 0; i <= ElementObj.$allTask.length - 1; i++) {
          let $item = ElementObj.$allTask[i].classList.contains('finish');
          if (!$item) {
            this.currentIndex = i;
            break;
          }
        }
        ElementObj.$allTask[i].click();
        showTip('✅✅✅\u5b8c\u6210\u521d\u59cb\u5316，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e');
        setTimeout(() => {
          this.handleClickSpeedUp2(() => {}, 3);
        }, 4500);
      });
    }
    getVideoDom(option) {
      return new Promise(resolve => {
        if (option) {
          let count = 0;
          let Timer = setInterval(() => {
            let $iframe = document.querySelector('#aliPlayerFrame');
            let _document = $iframe.contentDocument;
            ElementObj.$video = _document.querySelector('video');
            count += 1;
            if (!!ElementObj.$video) {
              clearInterval(Timer);
              resolve(true);
            }
            if (count > 10) {
              clearInterval(Timer);
              resolve(false);
            }
          }, 1000);
        } else {
          let count = 0;
          let Timer = setInterval(() => {
            var _b, _c;
            let $iframe = document.querySelector('#iframe');
            let _document = (_c = (_b = $iframe.contentDocument) === null || _b === void 0 ? void 0 : _b.querySelector('iframe')) === null || _c === void 0 ? void 0 : _c.contentDocument;
            ElementObj.$video = _document.querySelector('video');
            count += 1;
            if (!!ElementObj.$video) {
              clearInterval(Timer);
              resolve(true);
            }
            if (count > 10) {
              clearInterval(Timer);
              resolve(false);
            }
          }, 1000);
        }
      });
    }
    play() {
      var _b;
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        clearInterval(this.timer);
        let studyType = yield this.getVideoDom();
        if (studyType) {
          ElementObj.$video.volume = 0;
          yield sleep(200);
          ElementObj.$video.play();
          setTimeout(() => {
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 3000);
          let $wrap = (_b = $el('#iframe').contentDocument.querySelector('iframe')) === null || _b === void 0 ? void 0 : _b.contentDocument.querySelector('#reader');
          this.changeHtml($wrap);
          this.listenPageHide();
          this.listenPlayTime();
          this.listenVidoeStatus(ElementObj.$video, () => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          });
          ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
            this.playNext();
          }));
          ElementObj.$video.addEventListener('pause', () => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          });
        }
        if (!studyType) {
          showTip('⚠️⚠️⚠️\u672a\u68c0\u6d4b\u5230\u89c6\u9891，5\u79d2\u540e\u5207\u6362\u4e0b\u4e00\u8282', 4500);
          setTimeout(() => {
            this.playNext();
          }, 3000);
        }
      });
    }
    play2() {
      return __awaiter(this, void 0, void 0, function* () {
        if (!ElementObj.$video) {
          location.reload();
          return;
        }
        ElementObj.$video.volume = 0;
        ElementObj.$video.play();
        setTimeout(() => {
          ElementObj.$video.playbackRate = toolOption.accelerator;
        }, 3000);
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          let homeUrl = MyTool.getValue('homeUrl');
          yield sleep(2500);
          MyTool.openInTab(homeUrl);
          setTimeout(() => {
            window.close();
          }, 1000 * 5);
        }));
      });
    }
    play3() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        clearInterval(this.timer);
        let studyType = yield this.getVideoDom('#aliPlayerFrame');
        ElementObj.$video.volume = 0;
        yield sleep(200);
        ElementObj.$video.play();
        setTimeout(() => {
          ElementObj.$video.playbackRate = toolOption.accelerator;
        }, 3000);
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          if (this.currentIndex >= ElementObj.$allTask.length - 1) {
            let homeUrl = MyTool.getValue('homeUrl');
            yield sleep(2500);
            MyTool.openInTab(homeUrl);
            setTimeout(() => {
              window.close();
            }, 1000 * 15);
            return;
          }
          this.currentIndex += 1;
          ElementObj.$allTask[this.currentIndex].click();
          showTip('⚠️⚠️⚠️\u6b63\u5728\u5207\u6362\u8bfe\u7a0b', 4500);
          setTimeout(() => {
            this.handleClickSpeedUp2(() => {}, 3);
          }, 4500);
        }));
        ElementObj.$video.addEventListener('pause', () => {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
        });
      });
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        yield sleep(3000);
        if (this.currentIndex >= ElementObj.$allTask.length - 1) {
          void 0;
          return;
        }
        this.currentIndex += 1;
        ElementObj.$allTask[this.currentIndex].querySelector('.posCatalog_name').click();
        showTip('⚠️⚠️⚠️\u6b63\u5728\u5207\u6362\u8bfe\u7a0b', 4500);
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 5000);
      });
    }
    listenPlayTime() {
      showTip('🔉\u8bfe\u4ef6\u6b63\u5728\u5b66\u4e60，\u8bf7\u52a1\u70b9\u51fb\u6216\u957f\u65f6\u95f4\u9690\u85cf');
      let count = 0;
      this.timer = setInterval(() => {
        var _b;
        count += 1;
        let time = (ElementObj.$video.currentTime / 60).toFixed(2);
        let videoDuration = (ElementObj.$video.duration / 60).toFixed(2);
        this.addInfo(`\u5df2\u76d1\u6d4b${count}\u6b21，\u5f53\u524d\u72b6\u6001\u6b63\u5728\u5b66\u4e60，\u5df2\u64ad\u653e${time}\u5206\u949f，\u89c6\u9891\u603b\u65f6\u957f\u4e3a${videoDuration}\u5206\u949f`);
        let $iframe = document.querySelector('#iframe');
        let $statusDom = (_b = $iframe.contentDocument) === null || _b === void 0 ? void 0 : _b.querySelector('.ans-job-icon');
        let status = $statusDom === null || $statusDom === void 0 ? void 0 : $statusDom.getAttribute('aria-label');
        if (status == '\u4efb\u52a1\u70b9\u5df2\u5b8c\u6210') {
          clearInterval(this.timer);
          this.addInfo(`✅✅✅\u76d1\u6d4b\u5230\u5f53\u524d\u4efb\u52a1\u5df2\u5b8c\u6210，5\u79d2\u540e\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u8282`, 1);
          setTimeout(() => {
            this.playNext();
          }, 3000);
        }
      }, 3000);
    }
    addInfo(str, type) {
      var _b, _c;
      ElementObj.$ctxstatsbox = (_b = $el('#iframe').contentDocument.querySelector('iframe')) === null || _b === void 0 ? void 0 : _b.contentDocument.querySelector('.ctxstatsbox');
      let $ctxstatsbox_lis = (_c = $el('#iframe').contentDocument.querySelector('iframe')) === null || _c === void 0 ? void 0 : _c.contentDocument.querySelectorAll('.ctxstatsbox_li');
      if ($ctxstatsbox_lis.length >= 15) {
        ElementObj.$ctxstatsbox.innerHTML = '';
      }
      let li = `<li class="ctxstatsbox_li" style="color: ${type == 0 ? '#f01414' : '#000'};line-height: 30px;font-size: 16px;list-style: none;">${str}</li>`;
      ElementObj.$ctxstatsbox.innerHTML += li;
    }
    handleClickSpeedUp2(callback, type) {
      return __awaiter(this, void 0, void 0, function* () {
        let key = localStorage.getItem('mytoolkey');
        if (key) {
          this.speedStatus = 1;
          let result = yield fetchData({
            method: 'GET',
            url: bserUrl + `/speedup?toolkey=${key}&canuse=${toolOption.SchoolType}`
          });
          if (result.code == 200) {
            this.speedStatus = 1;
            if (type == 3) {
              this.play3();
            } else {
              this.play2();
            }
          } else {
            showTip(`🔉🔉🔉${result.message}`, 5000, true);
            return;
          }
          this.randomListen();
        } else if (!key) {
          void 0;
          window.open(basehost);
        } else {
          void 0;
        }
      });
    }
  }
  chongqingzhuanye.ctxid = 26;
  class jiaoyuganbuwang extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          void 0;
          try {
            let $memnu = document.querySelectorAll('.customcur-tabs-wrapper li')[1];
            if (!!$memnu) {
              clearInterval(interval);
              $memnu.click();
              this.getParentIndex();
              return;
            }
            ElementObj.$video = document.querySelector('video');
            if (!!ElementObj.$video) {
              clearInterval(interval);
              this.getCurrentIndex();
              return;
            }
          } catch (e) {}
        }), 1000);
      });
    }
    getParentIndex() {
      var _b;
      return __awaiter(this, void 0, void 0, function* () {
        showTip('✅✅✅\u6b63\u5728\u521d\u59cb\u5316', 3000);
        ElementObj.$handleSpeedUp.style.display = 'none';
        yield sleep(3000);
        GM_setValue("homeUrl", location.href);
        showTip('\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e');
        yield sleep(3000);
        let $nextBtn = document.querySelectorAll('tr')[2].lastChild;
        (_b = $nextBtn.querySelector('a')) === null || _b === void 0 ? void 0 : _b.click();
        this.handleClickSpeedUp();
        setTimeout(() => {
          window.close();
        }, 5000);
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        ElementObj.$allTask = document.querySelectorAll('.cvtb-MCK-course-content');
        yield sleep(100);
        for (var i = 0; i <= ElementObj.$allTask.length - 1; i++) {
          let $statusDom = ElementObj.$allTask[i].querySelector('.cvtb-MCK-CsCt-studyProgress');
          let status = parseInt($statusDom.innerText);
          if (status != 100) {
            this.currentIndex = i;
            break;
          }
        }
        ElementObj.$allTask[this.currentIndex].click();
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 3000);
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let count = 0;
        let Timer = setInterval(() => {
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(true);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        ElementObj.$handleSpeedUp.style.display = 'none';
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        clearInterval(this.timer);
        let studyType = yield this.getVideoDom();
        ElementObj.$video.volume = 0;
        yield sleep(200);
        ElementObj.$video.play();
        setTimeout(() => {
          ElementObj.$video.playbackRate = toolOption.accelerator;
        }, 3000);
        this.listenRebort();
        this.listenVidoeStatus(ElementObj.$video, () => {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
        });
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          this.playNext();
        }));
        ElementObj.$video.addEventListener('pause', () => {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
        });
      });
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        yield sleep(2000);
        if (this.currentIndex >= ElementObj.$allTask.length - 1) {
          let homeUrl = GM_getValue("homeUrl", null);
          GM_openInTab(homeUrl, {
            active: true
          });
          setTimeout(() => {
            window.close();
          }, 3000);
          return;
        }
        this.currentIndex += 1;
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 5000);
      });
    }
    listenPlayTime() {
      showTip('🔉\u8bfe\u4ef6\u6b63\u5728\u5b66\u4e60，\u8bf7\u52a1\u70b9\u51fb\u6216\u957f\u65f6\u95f4\u9690\u85cf');
      let count = 0;
      this.timer = setInterval(() => {
        count += 1;
        let $statusDom = ElementObj.$allTask[this.currentIndex].querySelector('.cvtb-MCK-CsCt-studyProgress');
        let status = parseInt($statusDom.innerText);
        let videoDuration = (ElementObj.$video.duration / 60).toFixed(2);
        this.addInfo(`\u5df2\u76d1\u6d4b${count}\u6b21，\u5f53\u524d\u72b6\u6001\u6b63\u5728\u5b66\u4e60，\u5f53\u524d\u64ad\u653e\u8fdb\u5ea6\u4e3a${status}%，\u89c6\u9891\u603b\u65f6\u957f\u4e3a${videoDuration}\u5206\u949f`);
        if (status == 100) {
          clearInterval(this.timer);
          this.addInfo(`✅✅✅\u76d1\u6d4b\u5230\u5f53\u524d\u4efb\u52a1\u5df2\u5b8c\u6210，5\u79d2\u540e\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u8282`, 1);
          setTimeout(() => {
            this.playNext();
          }, 3000);
        }
      }, 3000);
    }
    listenRebort() {
      this.listenRebortTime = setInterval(() => {
        void 0;
        let $btn = document.querySelector('.dialog-button-container button');
        if (!!$btn) {
          $btn.click();
        }
      }, 10 * 1000);
    }
  }
  jiaoyuganbuwang.ctxid = 26;
  class zaixianxuexi extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          void 0;
          try {
            let $jAlertButton2 = document.querySelector('#jAlertButton2');
            if (!!$jAlertButton2) {
              clearInterval(interval);
              $jAlertButton2.click();
              yield sleep(2000);
              ElementObj.$handleSpeedUp.style.display = 'none';
              this.handleClickSpeedUp();
              return;
            }
            ElementObj.$allTask = document.querySelectorAll('.videoList li');
            if (ElementObj.$allTask.length) {
              clearInterval(interval);
              this.getCurrentIndex();
            }
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      var _b;
      return __awaiter(this, void 0, void 0, function* () {
        showTip('\u6b63\u5728\u521d\u59cb\u5316');
        ElementObj.$handleSpeedUp.style.display = 'none';
        for (var i = 0; i <= ElementObj.$allTask.length - 1; i++) {
          let $item = ElementObj.$allTask[i].querySelector('.overTitle');
          if ($item.innerText != '【\u5df2\u5b8c\u6210】') {
            this.currentIndex = i;
            break;
          }
        }
        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        (_b = ElementObj.$allTask[this.currentIndex]) === null || _b === void 0 ? void 0 : _b.click();
        showTip('\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e');
        this.handleClickSpeedUp();
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(true);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        yield this.getVideoDom();
        ElementObj.$video.volume = 0;
        yield sleep(200);
        ElementObj.$video.play();
        setTimeout(() => {
          ElementObj.$video.playbackRate = toolOption.accelerator;
        }, 3000);
        this.listenVidoeStatus(ElementObj.$video, () => {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
        });
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          this.getCurrentIndex();
        }));
        ElementObj.$video.addEventListener('pause', () => {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
        });
      });
    }
    listenRebort() {
      this.listenRebortTime = setInterval(() => {}, 10 * 1000);
    }
  }
  zaixianxuexi.ctxid = 26;
  class anquanshengchanzx extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          void 0;
          try {
            let $allTask1 = document.querySelectorAll('.chapter_j>span');
            let $allTask2 = document.querySelectorAll('.first-box');
            ElementObj.$allTask = $allTask1.length ? $allTask1 : $allTask2;
            if (ElementObj.$allTask.length) {
              clearInterval(interval);
              this.getCurrentIndex();
            }
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      var _b;
      return __awaiter(this, void 0, void 0, function* () {
        showTip('\u6b63\u5728\u521d\u59cb\u5316');
        ElementObj.$handleSpeedUp.style.display = 'none';
        for (var i = 0; i <= ElementObj.$allTask.length - 1; i++) {
          let $item = ElementObj.$allTask[i].querySelector('li');
          if (!!$item) {
            if ($item.classList.contains('currse')) {
              this.currentIndex = i;
              break;
            }
          }
          let isDone = ElementObj.$allTask[i];
          if (isDone.classList.contains('text-color')) {
            this.currentIndex = i;
            break;
          }
        }
        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        if (location.pathname == '/course/lesson') {
          ElementObj.$allTask[this.currentIndex].click();
        } else {
          (_b = ElementObj.$allTask[this.currentIndex].querySelector('li')) === null || _b === void 0 ? void 0 : _b.click();
        }
        showTip('\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e');
        this.handleClickSpeedUp();
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let Timer = setInterval(() => {
          ElementObj.$video = document.querySelector('video.vjs-tech');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(true);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        yield this.getVideoDom();
        ElementObj.$video.volume = 0;
        yield sleep(200);
        ElementObj.$video.play();
        setTimeout(() => {
          ElementObj.$video.playbackRate = toolOption.accelerator;
        }, 3000);
        this.listenVidoeStatus(ElementObj.$video, () => {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
        });
        ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
          showTip('\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a', 4500);
          this.playNext();
        }));
        ElementObj.$video.addEventListener('pause', () => {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
        });
      });
    }
    listenRebort() {
      this.listenRebortTime = setInterval(() => {}, 10 * 1000);
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        if (this.currentIndex >= ElementObj.$allTask.length - 1) {
          void 0;
          return;
        }
        yield sleep(2500);
        this.currentIndex += 1;
        let $nextBtn = ElementObj.$allTask[this.currentIndex].querySelector('li');
        if (location.pathname == '/course/lesson') {
          $nextBtn = document.querySelector('.el-button.next');
        }
        $nextBtn === null || $nextBtn === void 0 ? void 0 : $nextBtn.click();
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4000);
      });
    }
  }
  anquanshengchanzx.ctxid = 26;
  class guojiakaifangdaxue extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          void 0;
          try {
            ElementObj.$allTask = document.querySelectorAll("li[id]");
            if (location.host == 'xczxzdbf.moodle.qwbx.ouchn.cn' && ElementObj.$allTask.length) {
              clearInterval(interval);
              ElementObj.$handleSpeedUp.style.display = 'none';
              this.getCurrentIndex();
              return;
            }
            let $nextBtn = document.querySelector('button.next-btn');
            if ($nextBtn) {
              ElementObj.$handleSpeedUp.style.display = 'none';
              clearInterval(interval);
              showTip('♥♥♥\u521d\u59cb\u5316\u5b8c\u6210');
              this.handleClickSpeedUp();
            }
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        for (var i = 0; i <= ElementObj.$allTask.length - 1; i++) {
          let $item = ElementObj.$allTask[i];
          if ($item.classList.contains('current')) {
            this.currentIndex = i;
            break;
          }
        }
        showTip('♥♥♥\u521d\u59cb\u5316\u5b8c\u6210');
        this.handleClickSpeedUp();
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let count = 0;
        let Timer = setInterval(() => {
          var _b;
          count += 1;
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(1);
            return;
          }
          let _document = document.querySelector('#previewContentInIframe');
          ElementObj.$video = (_b = _document === null || _document === void 0 ? void 0 : _document.contentDocument) === null || _b === void 0 ? void 0 : _b.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(1);
            return;
          }
          if (count >= 7) {
            clearInterval(Timer);
            resolve(2);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        let studyType = yield this.getVideoDom();
        if (studyType == 1) {
          ElementObj.$video.volume = 0;
          yield sleep(200);
          let $playBtn = document.querySelector('.mvp-toggle-play');
          if (!!$playBtn) {
            $playBtn.click();
          } else {
            ElementObj.$video.play();
          }
          setTimeout(() => {
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 3000);
          ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
            showTip('\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a', 4500);
            yield sleep(4500);
            this.playNext();
            void 0;
          }));
          ElementObj.$video.addEventListener('pause', () => {
            setTimeout(() => {
              let $playBtn = document.querySelector('.mvp-toggle-play');
              ElementObj.$video.volume = 0;
              $playBtn === null || $playBtn === void 0 ? void 0 : $playBtn.click();
              ElementObj.$video.play();
            }, 1500);
          });
        }
        if (studyType == 2) {
          showTip('✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a', 3000);
          yield sleep(3000);
          this.playNext();
        }
      });
    }
    listenRebort() {
      this.listenRebortTime = setInterval(() => {}, 10 * 1000);
    }
    playNext() {
      this.currentIndex += 1;
      let $nextBtn = document.querySelector('button.next-btn');
      if (location.host == 'xczxzdbf.moodle.qwbx.ouchn.cn') {
        $nextBtn = ElementObj.$allTask[this.currentIndex].querySelector('.aalink');
        if (this.currentIndex >= ElementObj.$allTask.length - 1) {
          void 0;
          return;
        }
        $nextBtn === null || $nextBtn === void 0 ? void 0 : $nextBtn.click();
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 5000);
      } else {
        $nextBtn = document.querySelector('button.next-btn');
        if ($nextBtn) {
          $nextBtn.click();
          setTimeout(() => {
            this.handleClickSpeedUp();
          }, 5000);
        }
      }
    }
  }
  guojiakaifangdaxue.ctxid = 26;
  class jjjxjy extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        window.addEventListener('urlchange', info => {
          void 0;
          setTimeout(() => {
            ElementObj.$allTask = document.querySelectorAll('.ant-list-items div a');
            if (ElementObj.$allTask.length) {
              ElementObj.$handleSpeedUp.style.display = 'none';
              clearInterval(interval);
              this.getCurrentIndex();
            }
            let $item = document.querySelector('.ant-row.catalog_child_line');
            if (!!$item) {
              clearInterval(interval);
              $item === null || $item === void 0 ? void 0 : $item.click();
            }
            if (location.href == 'https://jjxy.web2.superchutou.com/#/') {
              ElementObj.$handleSpeedUp.style.display = 'none';
              clearInterval(interval);
              this.getParentIndex();
            }
          }, 5000);
        });
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          void 0;
          try {
            ElementObj.$allTask = document.querySelectorAll('.ant-list-items div a');
            if (ElementObj.$allTask.length) {
              ElementObj.$handleSpeedUp.style.display = 'none';
              clearInterval(interval);
              this.getCurrentIndex();
            }
            let $item = document.querySelector('.ant-row.catalog_child_line');
            if (!!$item) {
              clearInterval(interval);
              $item === null || $item === void 0 ? void 0 : $item.click();
            }
            if (location.href == 'https://jjxy.web2.superchutou.com/#/') {
              ElementObj.$handleSpeedUp.style.display = 'none';
              clearInterval(interval);
              this.getParentIndex();
            }
          } catch (e) {}
        }), 1000);
      });
    }
    getParentIndex() {
      let $parents = $el('.ant-table-tbody').querySelectorAll('.ant-table-tbody tr');
      for (var i = 0; i <= $parents.length - 1; i++) {
        let $item = $parents[i].querySelector('.ant-progress-bg');
        if (parseInt($item.style.width) < 99) {
          $parents[i].querySelector('.anticon-play-circle').click();
          break;
        }
      }
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        for (var i = 0; i <= ElementObj.$allTask.length - 1; i++) {
          let isDone = ElementObj.$allTask[i].querySelector('i.anticon-check-circle');
          if (!isDone) {
            this.currentIndex = i;
            break;
          }
        }
        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        ElementObj.$allTask[this.currentIndex].click();
        showTip('✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4000);
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let count = 0;
        let Timer = setInterval(() => {
          count += 1;
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(1);
            return;
          }
          if (count >= 7) {
            clearInterval(Timer);
            resolve(2);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.timer2);
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        let studyType = yield this.getVideoDom();
        if (studyType == 1) {
          ElementObj.$video.volume = 0;
          yield sleep(200);
          let $playBtn = document.querySelector('.mvp-toggle-play');
          if (!!$playBtn) {
            $playBtn.click();
          } else {
            ElementObj.$video.play();
          }
          setTimeout(() => {
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 3000);
          this.listenRebort();
          ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
            showTip('\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a', 4500);
            this.playNext();
            void 0;
          }));
          ElementObj.$video.addEventListener('pause', () => {
            setTimeout(() => {
              ElementObj.$video.volume = 0;
              ElementObj.$video.play();
            }, 1500);
          });
        }
        if (studyType == 2) {
          showTip('✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a', 3000);
          yield sleep(3000);
          this.playNext();
        }
      });
    }
    listenRebort() {
      this.listenRebortTime = setInterval(() => {
        let $btn = document.querySelector('.ant-modal-body button');
        let $btn2 = document.querySelector('.ant-btn.ant-btn-primary');
        $btn === null || $btn === void 0 ? void 0 : $btn.click();
        $btn2 === null || $btn2 === void 0 ? void 0 : $btn2.click();
      }, 1 * 1000);
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        if (this.currentIndex >= ElementObj.$allTask.length - 1) {
          void 0;
          return;
        }
        yield sleep(4500);
        this.currentIndex += 1;
        let $nextBtn = ElementObj.$allTask[this.currentIndex];
        if ($nextBtn) {
          $nextBtn.click();
          setTimeout(() => {
            this.handleClickSpeedUp();
          }, 4000);
        }
      });
    }
  }
  jjjxjy.ctxid = 26;
  class jxkjxy extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          void 0;
          try {
            ElementObj.$allTask = document.querySelectorAll('.ivu-tree-children li span span');
            if (ElementObj.$allTask.length) {
              ElementObj.$handleSpeedUp.style.display = 'none';
              clearInterval(interval);
              this.getCurrentIndex();
            }
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        for (var i = 0; i <= ElementObj.$allTask.length - 1; i++) {
          let isDone = ElementObj.$allTask[i];
          if ((isDone === null || isDone === void 0 ? void 0 : isDone.style.color) == 'rgb(92, 119, 251)') {
            this.currentIndex = i;
            break;
          }
        }
        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        showTip('✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4000);
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let count = 0;
        let Timer = setInterval(() => {
          count += 1;
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(1);
            return;
          }
          if (count >= 7) {
            clearInterval(Timer);
            resolve(2);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        let studyType = yield this.getVideoDom();
        if (studyType == 1) {
          ElementObj.$video.volume = 0;
          yield sleep(200);
          ElementObj.$video.play();
          setTimeout(() => {
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 3000);
          ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
            showTip('\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a', 4500);
            this.playNext();
            void 0;
          }));
          ElementObj.$video.addEventListener('pause', () => {
            setTimeout(() => {
              ElementObj.$video.volume = 0;
              ElementObj.$video.play();
            }, 1500);
          });
        }
        if (studyType == 2) {
          showTip('✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a', 3000);
          yield sleep(3000);
          this.playNext();
        }
      });
    }
    listenRebort() {
      this.listenRebortTime = setInterval(() => {}, 10 * 1000);
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        if (this.currentIndex >= ElementObj.$allTask.length - 1) {
          void 0;
          return;
        }
        yield sleep(4500);
        this.currentIndex += 1;
        let $nextBtn = ElementObj.$allTask[this.currentIndex];
        if ($nextBtn) {
          $nextBtn.click();
          setTimeout(() => {
            this.handleClickSpeedUp();
          }, 4000);
        }
      });
    }
  }
  jxkjxy.ctxid = 26;
  class xiangongyedx extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          void 0;
          try {
            let $allTask = document.querySelectorAll('.el-tree-node__children .el-tree-node');
            let $allTask2 = document.querySelectorAll(".ant-tree-child-tree>li[role='treeitem']");
            ElementObj.$allTask = $allTask.length ? $allTask : $allTask2;
            if (ElementObj.$allTask.length) {
              ElementObj.$handleSpeedUp.style.display = 'none';
              clearInterval(interval);
              this.getCurrentIndex();
            }
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      var _b;
      return __awaiter(this, void 0, void 0, function* () {
        for (var i = 0; i <= ElementObj.$allTask.length - 1; i++) {
          let isDone = ElementObj.$allTask[i];
          let status = (_b = isDone === null || isDone === void 0 ? void 0 : isDone.querySelector('.svg-icon use')) === null || _b === void 0 ? void 0 : _b.getAttribute('xlink:href');
          if (status == '#icon-VideoUncomplete') {
            let $title = (isDone === null || isDone === void 0 ? void 0 : isDone.querySelector('.node-title')).innerText;
            if ($title != '\u7ae0\u8282\u6d4b\u8bc4') {
              this.currentIndex = i;
              break;
            }
          }
          if (isDone === null || isDone === void 0 ? void 0 : isDone.classList.contains('ant-tree-treenode-selected')) {
            this.currentIndex = i;
            break;
          }
        }
        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        ElementObj.$allTask[i].click();
        showTip('✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4000);
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let count = 0;
        let Timer = setInterval(() => {
          count += 1;
          let $startBtn = document.querySelector('.vjs-button-icon');
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video && $startBtn) {
            clearInterval(Timer);
            resolve(1);
            return;
          }
          if (count >= 7) {
            clearInterval(Timer);
            resolve(2);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        let studyType = yield this.getVideoDom();
        if (studyType == 1) {
          ElementObj.$video.volume = 0;
          yield sleep(200);
          let $startBtn = document.querySelector('.vjs-button-icon');
          $startBtn.click();
          setTimeout(() => {
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 3000);
          this.listenVidoeStatus(ElementObj.$video, () => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          });
          this.listenRebort();
          ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
            showTip('✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a', 4500);
            this.playNext();
            void 0;
          }));
          ElementObj.$video.addEventListener('pause', () => {
            setTimeout(() => {
              ElementObj.$video.volume = 0;
              ElementObj.$video.play();
            }, 1500);
          });
        }
        if (studyType == 2) {
          showTip('✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a', 3000);
          yield sleep(3000);
          this.playNext();
        }
      });
    }
    listenRebort() {
      this.listenRebortTime = setInterval(() => {
        var _b;
        let $btn = document.querySelector('.ant-modal-confirm-btns button');
        if (!!$btn) {
          clearInterval(this.listenRebortTime);
          $btn.click();
          this.playNext();
          return;
        }
        let isDone = ElementObj.$allTask[this.currentIndex];
        let status = (_b = isDone === null || isDone === void 0 ? void 0 : isDone.querySelector('.svg-icon use')) === null || _b === void 0 ? void 0 : _b.getAttribute('xlink:href');
        if (status == '#icon-VideoComplete') {
          clearInterval(this.listenRebortTime);
          this.playNext();
        }
      }, 10 * 1000);
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        if (this.currentIndex >= ElementObj.$allTask.length - 1) {
          void 0;
          return;
        }
        yield sleep(4500);
        this.currentIndex += 1;
        let $nextBtn = ElementObj.$allTask[this.currentIndex];
        if (!!ElementObj.$allTask[this.currentIndex].querySelector('.ant-tree-node-content-wrapper')) {
          $nextBtn = ElementObj.$allTask[this.currentIndex].querySelector('.ant-tree-node-content-wrapper');
        }
        if ($nextBtn) {
          $nextBtn.click();
          setTimeout(() => {
            this.handleClickSpeedUp();
          }, 4000);
        }
      });
    }
  }
  xiangongyedx.ctxid = 60;
  class hebeiganbu extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          void 0;
          try {
            if (location.pathname == '/student/class_detail_course.do') {
              let $btn = document.querySelector('.hoz_course_row input');
              if (!!$btn) {
                clearInterval(interval);
                setTimeout(() => {
                  window.close();
                }, 15 * 1000);
                MyTool.setValue('homeUrl', location.href);
                $btn.click();
              }
            }
            if (location.pathname == '/portal/study_play.do') {
              ElementObj.$video = document.querySelector('video');
              if (ElementObj.$video) {
                clearInterval(interval);
                this.handleClickSpeedUp();
              }
            }
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {});
    }
    getVideoDom() {
      return new Promise(resolve => {
        let count = 0;
        let Timer = setInterval(() => {
          count += 1;
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(1);
            return;
          }
          if (count >= 7) {
            clearInterval(Timer);
            resolve(2);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        let studyType = yield this.getVideoDom();
        if (studyType == 1) {
          setTimeout(() => {
            ElementObj.$video = document.querySelector('video');
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
            setTimeout(() => {
              ElementObj.$video.playbackRate = toolOption.accelerator;
            }, 3000);
            ElementObj.$handleSpeedUp.style.background = '#f01414';
            ElementObj.$handleSpeedUp.innerText = '\u52a0\u901f\u6210\u529f';
            ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
              void 0;
              this.playNext();
            }));
            ElementObj.$video.addEventListener('pause', () => {
              setTimeout(() => {
                ElementObj.$video.volume = 0;
                ElementObj.$video.play();
              }, 1500);
            });
            void 0;
          }, 4500);
          let $btn = document.querySelector('.user_choise');
          $btn === null || $btn === void 0 ? void 0 : $btn.click();
        }
        if (studyType == 2) {
          showTip('✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a', 3000);
          yield sleep(3000);
          this.playNext();
        }
      });
    }
    listenRebort() {
      this.listenRebortTime = setInterval(() => {}, 10 * 1000);
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        yield sleep(2500);
        location.href = MyTool.getValue('homeUrl');
      });
    }
  }
  hebeiganbu.ctxid = 26;
  class gdedujsxx extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        void 0;
        this.handleClickSpeedUp();
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {});
    }
    getVideoDom() {
      return new Promise(resolve => {
        let count = 0;
        let Timer = setInterval(() => {
          count += 1;
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(1);
            return;
          }
          if (count >= 7) {
            clearInterval(Timer);
            resolve(2);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        let studyType = yield this.getVideoDom();
        ElementObj.$handleSpeedUp.style.display = 'none';
        if (studyType == 1) {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
          setTimeout(() => {
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 3000);
          this.listenVidoeStatus(ElementObj.$video, () => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          });
          this.listenRebort();
          ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
            showTip('✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a', 4500);
            this.playNext();
            void 0;
          }));
          ElementObj.$video.addEventListener('pause', () => {
            setTimeout(() => {
              ElementObj.$video.volume = 0;
              ElementObj.$video.play();
            }, 1500);
          });
        }
        if (studyType == 2) {
          showTip('✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a', 3000);
          yield sleep(3000);
          this.playNext();
        }
      });
    }
    listenRebort() {
      this.listenRebortTime = setInterval(() => __awaiter(this, void 0, void 0, function* () {
        let $labels = document.querySelectorAll('.m-question-lst label');
        if ($labels.length) {
          clearInterval(this.listenRebortTime);
          $labels[0].click();
          let $sumit = document.querySelector('.btn.u-main-btn');
          $sumit.click();
          yield sleep(3000);
          $labels = document.querySelectorAll('.m-question-lst label');
          if ($labels.length) {
            $labels[1].click();
            let $sumit = document.querySelector('.btn.u-main-btn');
            $sumit.click();
          }
          yield sleep(3000);
          this.listenRebort();
        }
      }), 10 * 1000);
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        yield sleep(4500);
        this.currentIndex += 1;
        let $nextBtn = document.querySelector('a.btn.next.crt');
        if ($nextBtn) {
          $nextBtn.click();
          setTimeout(() => {
            this.handleClickSpeedUp();
          }, 4000);
        }
      });
    }
  }
  gdedujsxx.ctxid = 60;
  class wsjkrczyjn extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          void 0;
          try {
            ElementObj.$allTask = document.querySelectorAll('.setionItem');
            if (ElementObj.$allTask.length) {
              ElementObj.$handleSpeedUp.style.display = 'none';
              clearInterval(interval);
              this.getCurrentIndex();
            }
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        for (var i = 0; i <= ElementObj.$allTask.length - 1; i++) {
          let isDone = ElementObj.$allTask[i];
          if (isDone.classList.contains('active')) {
            this.currentIndex = i;
            break;
          }
        }
        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        showTip('✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4000);
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let count = 0;
        let Timer = setInterval(() => {
          count += 1;
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(1);
            return;
          }
          if (count >= 7) {
            clearInterval(Timer);
            resolve(2);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        let studyType = yield this.getVideoDom();
        if (studyType == 1) {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
          setTimeout(() => {
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 3000);
          this.listenVidoeStatus(ElementObj.$video, () => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          });
          ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
            showTip('✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a', 4500);
            this.playNext();
            void 0;
          }));
          ElementObj.$video.addEventListener('pause', () => {
            setTimeout(() => {
              ElementObj.$video.volume = 0;
              ElementObj.$video.play();
            }, 1500);
          });
        }
        if (studyType == 2) {
          showTip('✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a', 3000);
          yield sleep(3000);
          this.playNext();
        }
      });
    }
    listenRebort() {
      this.listenRebortTime = setInterval(() => {}, 10 * 1000);
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        if (this.currentIndex >= ElementObj.$allTask.length - 1) {
          void 0;
          return;
        }
        yield sleep(2500);
        this.currentIndex += 1;
        ElementObj.$allTask[this.currentIndex].click();
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4000);
      });
    }
  }
  wsjkrczyjn.ctxid = 60;
  class zhuzhouteacher extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          void 0;
          try {
            let $btn = document.querySelectorAll('.antd-pro-pages-my-center-my-center-menuItem')[2];
            if (!!$btn) {
              ElementObj.$handleSpeedUp.style.display = 'none';
              clearInterval(interval);
              $btn.click();
              yield sleep(1000);
              this.getCurrentIndex();
              return;
            }
            ElementObj.$video = document.querySelector('video');
            if (!!ElementObj.$video) {
              clearInterval(interval);
              ElementObj.$handleSpeedUp.style.display = 'none';
              this.handleClickSpeedUp();
            }
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        yield sleep(2500);
        ElementObj.$allTask = document.querySelectorAll('.antd-pro-pages-my-center-course-learning-courseWrap>.ant-row');
        for (var i = 0; i <= ElementObj.$allTask.length - 1; i++) {
          let isDone = ElementObj.$allTask[i];
          let status = isDone.querySelector('.ant-progress-text').innerHTML;
          if (parseInt(status) < 99) {
            this.currentIndex = i;
            break;
          }
        }
        if (this.currentIndex != -1) {
          ElementObj.$allTask[this.currentIndex].querySelector('.ant-btn.ant-btn-primary').click();
          setTimeout(() => {
          }, 1000 * 15);
          return;
        } else {
          let $nextPage = document.querySelector('.ant-pagination-next');
          if ($nextPage.classList.contains('ant-pagination-disabled')) {
            void 0;
            return;
          }
          $nextPage.click();
          this.getCurrentIndex();
        }
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let count = 0;
        let Timer = setInterval(() => {
          count += 1;
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(1);
            return;
          }
          if (count >= 7) {
            clearInterval(Timer);
            resolve(2);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        let studyType = yield this.getVideoDom();
        if (studyType == 1) {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
          setTimeout(() => {
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 3000);
          this.listenVidoeStatus(ElementObj.$video, () => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          });
          ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
            showTip('✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a', 4500);
            this.playNext();
            void 0;
          }));
          ElementObj.$video.addEventListener('pause', () => {
            setTimeout(() => {
              ElementObj.$video.volume = 0;
              ElementObj.$video.play();
            }, 1500);
          });
        }
        if (studyType == 2) {
          showTip('✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a', 3000);
          yield sleep(3000);
          this.playNext();
        }
      });
    }
    listenRebort() {
      this.listenRebortTime = setInterval(() => {}, 10 * 1000);
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        MyTool.openInTab('http://www.zhuzhouteacher.com/teacheredu/main/mycenter/course-learning');
        setTimeout(() => {
          window.close();
        }, 5000);
      });
    }
  }
  zhuzhouteacher.ctxid = 60;
  class zhuanyejishuryjxjy extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          void 0;
          try {
            ElementObj.$allTask = document.querySelectorAll('.catalog-list p');
            if (ElementObj.$allTask.length) {
              ElementObj.$handleSpeedUp.style.display = 'none';
              clearInterval(interval);
              this.getCurrentIndex();
            }
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        for (var i = 0; i <= ElementObj.$allTask.length - 1; i++) {
          let isDone = ElementObj.$allTask[i];
          if (isDone.classList.contains('active')) {
            this.currentIndex = i;
            break;
          }
        }
        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        showTip('✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4000);
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let count = 0;
        let Timer = setInterval(() => {
          count += 1;
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(1);
            return;
          }
          if (count >= 7) {
            clearInterval(Timer);
            resolve(2);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        let studyType = yield this.getVideoDom();
        if (studyType == 1) {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
          setTimeout(() => {
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 3000);
          this.listenVidoeStatus(ElementObj.$video, () => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          });
          ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
            showTip('✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a', 4500);
            this.playNext();
            void 0;
          }));
          ElementObj.$video.addEventListener('pause', () => {
            setTimeout(() => {
              ElementObj.$video.volume = 0;
              ElementObj.$video.play();
            }, 1500);
          });
        }
        if (studyType == 2) {
          showTip('✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a', 3000);
          yield sleep(3000);
          this.playNext();
        }
      });
    }
    listenRebort() {
      this.listenRebortTime = setInterval(() => {}, 10 * 1000);
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        if (this.currentIndex >= ElementObj.$allTask.length - 1) {
          void 0;
          return;
        }
        yield sleep(2500);
        this.currentIndex += 1;
        ElementObj.$allTask[this.currentIndex].querySelector('a').click();
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4000);
      });
    }
  }
  zhuanyejishuryjxjy.ctxid = 60;
  class yinghuaxuetang extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          void 0;
          try {
            ElementObj.$allTask = document.querySelectorAll(".detmain .list .item a ");
            if (ElementObj.$allTask.length) {
              ElementObj.$handleSpeedUp.style.display = 'none';
              clearInterval(interval);
              this.getCurrentIndex();
            }
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        for (var i = 0; i <= ElementObj.$allTask.length - 1; i++) {
          let isDone = ElementObj.$allTask[i];
          if (isDone.classList.contains('on')) {
            this.currentIndex = i;
            break;
          }
        }
        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        showTip('✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4000);
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let count = 0;
        let Timer = setInterval(() => {
          count += 1;
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(1);
            return;
          }
          if (count >= 7) {
            clearInterval(Timer);
            resolve(2);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        let studyType = yield this.getVideoDom();
        if (studyType == 1) {
          let btn = document.querySelector('.promptchmqylqsxtfb');
          let btn2 = document.querySelector('.mutechtkfjgkqelf');
          if (btn) {
            btn.click();
          }
          if (btn2) {
            btn2.click();
          }
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
          setTimeout(() => {
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 3000);
          this.listenVidoeStatus(ElementObj.$video, () => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          });
          ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
            showTip('✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a', 4500);
            this.playNext();
            void 0;
          }));
          ElementObj.$video.addEventListener('pause', () => {
            setTimeout(() => {
              ElementObj.$video.volume = 0;
              ElementObj.$video.play();
            }, 1500);
          });
        }
        if (studyType == 2) {
          showTip('✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a', 3000);
          yield sleep(3000);
          this.playNext();
        }
      });
    }
    listenRebort() {
      this.listenRebortTime = setInterval(() => {}, 10 * 1000);
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        if (this.currentIndex >= ElementObj.$allTask.length - 1) {
          void 0;
          return;
        }
        yield sleep(2500);
        this.currentIndex += 1;
        ElementObj.$allTask[this.currentIndex].click();
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4000);
      });
    }
  }
  yinghuaxuetang.ctxid = 60;
  class yidiantong extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          void 0;
          try {
            ElementObj.$allTask = document.querySelectorAll('.keshi');
            if (ElementObj.$allTask.length) {
              ElementObj.$handleSpeedUp.style.display = 'none';
              clearInterval(interval);
              this.getCurrentIndex();
            }
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        for (var i = 0; i <= ElementObj.$allTask.length - 1; i++) {
          let isDone = ElementObj.$allTask[i];
          if (isDone.classList.contains('active')) {
            this.currentIndex = i;
            break;
          }
        }
        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        showTip('✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4000);
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let count = 0;
        let Timer = setInterval(() => {
          count += 1;
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(1);
            return;
          }
          if (count >= 7) {
            clearInterval(Timer);
            resolve(2);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        let studyType = yield this.getVideoDom();
        if (studyType == 1) {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
          setTimeout(() => {
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 3000);
          this.listenVidoeStatus(ElementObj.$video, () => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          });
          ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
            showTip('✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a', 4500);
            this.playNext();
            void 0;
          }));
          ElementObj.$video.addEventListener('pause', () => {
            setTimeout(() => {
              ElementObj.$video.volume = 0;
              ElementObj.$video.play();
            }, 1500);
          });
        }
        if (studyType == 2) {
          showTip('✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a', 3000);
          yield sleep(3000);
          this.playNext();
        }
      });
    }
    listenRebort() {
      this.listenRebortTime = setInterval(() => {}, 10 * 1000);
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        if (this.currentIndex >= ElementObj.$allTask.length - 1) {
          void 0;
          return;
        }
        yield sleep(2500);
        this.currentIndex += 1;
        ElementObj.$allTask[this.currentIndex].querySelector('a').click();
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4000);
      });
    }
  }
  yidiantong.ctxid = 60;
  class shanghaikaifangdx extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          void 0;
          try {
            ElementObj.$allTask = document.querySelectorAll('.cell_info1 a');
            if (ElementObj.$allTask.length) {
              ElementObj.$handleSpeedUp.style.display = 'none';
              clearInterval(interval);
              this.getCurrentIndex();
            }
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        for (var i = 0; i <= ElementObj.$allTask.length - 1; i++) {
          let isDone = ElementObj.$allTask[i];
          if (isDone.classList.contains('active')) {
            this.currentIndex = i;
            break;
          }
        }
        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        showTip('✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4000);
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let count = 0;
        let Timer = setInterval(() => {
          count += 1;
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(1);
            return;
          }
          if (count >= 7) {
            clearInterval(Timer);
            resolve(2);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        let studyType = yield this.getVideoDom();
        if (studyType == 1) {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
          setTimeout(() => {
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 3000);
          this.listenVidoeStatus(ElementObj.$video, () => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          });
          ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
            showTip('✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a', 4500);
            this.playNext();
            void 0;
          }));
          ElementObj.$video.addEventListener('pause', () => {
            setTimeout(() => {
              ElementObj.$video.volume = 0;
              ElementObj.$video.play();
            }, 1500);
          });
        }
        if (studyType == 2) {
          showTip('✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a', 3000);
          yield sleep(3000);
          this.playNext();
        }
      });
    }
    listenRebort() {
      this.listenRebortTime = setInterval(() => {}, 10 * 1000);
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        if (this.currentIndex >= ElementObj.$allTask.length - 1) {
          void 0;
          return;
        }
        yield sleep(2500);
        this.currentIndex += 1;
        ElementObj.$allTask[this.currentIndex].click();
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4000);
      });
    }
  }
  shanghaikaifangdx.ctxid = 60;
  class gzgbjy extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          void 0;
          try {
            ElementObj.$allTask = document.querySelectorAll('.tab-content-desc');
            if (ElementObj.$allTask.length) {
              ElementObj.$handleSpeedUp.style.display = 'none';
              clearInterval(interval);
              this.getCurrentIndex();
            }
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        for (var i = 0; i <= ElementObj.$allTask.length - 1; i++) {
          let isDone = ElementObj.$allTask[i];
          if (isDone.classList.contains('desc-item-sel')) {
            this.currentIndex = i;
            break;
          }
        }
        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        showTip('✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4000);
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let count = 0;
        let Timer = setInterval(() => {
          count += 1;
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(1);
            return;
          }
          if (count >= 7) {
            clearInterval(Timer);
            resolve(2);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        let studyType = yield this.getVideoDom();
        if (studyType == 1) {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
          setTimeout(() => {
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 3000);
          this.listenVidoeStatus(ElementObj.$video, () => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          });
          ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
            showTip('✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a', 4500);
            this.playNext();
            void 0;
          }));
          ElementObj.$video.addEventListener('pause', () => {
            setTimeout(() => {
              ElementObj.$video.volume = 0;
              ElementObj.$video.play();
            }, 1500);
          });
        }
        if (studyType == 2) {
          showTip('✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a', 3000);
          yield sleep(3000);
          this.playNext();
        }
      });
    }
    listenRebort() {
      this.listenRebortTime = setInterval(() => {}, 10 * 1000);
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        if (this.currentIndex >= ElementObj.$allTask.length - 1) {
          void 0;
          return;
        }
        yield sleep(2500);
        this.currentIndex += 1;
        ElementObj.$allTask[this.currentIndex].click();
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4000);
      });
    }
  }
  gzgbjy.ctxid = 60;
  class guizhoujianshezyjs extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          void 0;
          try {
            ElementObj.$allTask = document.querySelectorAll('.catalog div>a');
            if (ElementObj.$allTask.length) {
              ElementObj.$handleSpeedUp.style.display = 'none';
              clearInterval(interval);
              this.getCurrentIndex();
            }
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        for (var i = 0; i <= ElementObj.$allTask.length - 1; i++) {
          let isDone = ElementObj.$allTask[i];
          if (isDone.classList.contains('cur')) {
            this.currentIndex = i;
            break;
          }
        }
        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        showTip('✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4000);
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let count = 0;
        let Timer = setInterval(() => {
          count += 1;
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(1);
            return;
          }
          if (count >= 7) {
            clearInterval(Timer);
            resolve(2);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        let studyType = yield this.getVideoDom();
        if (studyType == 1) {
          ElementObj.$video.volume = 0;
          let $vplay = document.querySelector('.vplay');
          if (!$vplay.classList.contains('vmPause')) {
            $vplay.click();
          }
          ElementObj.$video.play();
          setTimeout(() => {
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 3000);
          this.listenVidoeStatus(ElementObj.$video, () => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          });
          ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
            showTip('✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a', 4500);
            this.playNext();
            void 0;
          }));
          ElementObj.$video.addEventListener('pause', () => {
            setTimeout(() => {
              ElementObj.$video.volume = 0;
              ElementObj.$video.play();
            }, 1500);
          });
        }
        if (studyType == 2) {
          showTip('✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a', 3000);
          yield sleep(3000);
          this.playNext();
        }
      });
    }
    listenRebort() {
      this.listenRebortTime = setInterval(() => {}, 10 * 1000);
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        if (this.currentIndex >= ElementObj.$allTask.length - 1) {
          void 0;
          return;
        }
        yield sleep(2500);
        this.currentIndex += 1;
        ElementObj.$allTask[this.currentIndex].click();
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4000);
      });
    }
  }
  guizhoujianshezyjs.ctxid = 60;
  class jixujiaoyuzaixian extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          void 0;
          try {
            ElementObj.$allTask = document.querySelectorAll('.video-list-item-span');
            if (ElementObj.$allTask.length) {
              ElementObj.$handleSpeedUp.style.display = 'none';
              clearInterval(interval);
              this.getCurrentIndex();
            }
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        for (var i = 0; i <= ElementObj.$allTask.length - 1; i++) {
          let isDone = ElementObj.$allTask[i];
          if (isDone.innerText.indexOf('\u5df2\u5b66\u5b8c') == -1) {
            this.currentIndex = i;
            break;
          }
        }
        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        showTip('✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        ElementObj.$allTask[this.currentIndex].click();
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4000);
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let count = 0;
        let Timer = setInterval(() => {
          count += 1;
          ElementObj.$video = document.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(1);
            return;
          }
          if (count >= 7) {
            clearInterval(Timer);
            resolve(2);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        let studyType = yield this.getVideoDom();
        if (studyType == 1) {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
          setTimeout(() => {
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 3000);
          this.listenVidoeStatus(ElementObj.$video, () => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          });
          this.listenRebort();
          ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
            showTip('✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a', 4500);
            this.playNext();
            void 0;
          }));
          ElementObj.$video.addEventListener('pause', () => {
            setTimeout(() => {
              ElementObj.$video.volume = 0;
              ElementObj.$video.play();
            }, 1500);
          });
        }
        if (studyType == 2) {
          showTip('✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a', 3000);
          yield sleep(3000);
          this.playNext();
        }
      });
    }
    listenRebort() {
      this.listenRebortTime = setInterval(() => {
        let $btn = document.querySelector('.el-message-box__btns .el-button--primary');
        $btn === null || $btn === void 0 ? void 0 : $btn.click();
      }, 10 * 1000);
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        if (this.currentIndex >= ElementObj.$allTask.length - 1) {
          void 0;
          return;
        }
        yield sleep(2500);
        this.currentIndex += 1;
        ElementObj.$allTask[this.currentIndex].click();
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4000);
      });
    }
  }
  jixujiaoyuzaixian.ctxid = 60;
  class gzteacher extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          void 0;
          try {
            ElementObj.$allTask = document.querySelectorAll('.collapseactivityName2');
            if (ElementObj.$allTask.length) {
              ElementObj.$handleSpeedUp.style.display = 'none';
              clearInterval(interval);
              this.getCurrentIndex();
            }
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        for (var i = 0; i <= ElementObj.$allTask.length - 1; i++) {
          let isDone = ElementObj.$allTask[i];
          if (isDone.classList.contains('isActive')) {
            this.currentIndex = i;
            break;
          }
        }
        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        showTip('✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4000);
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let count = 0;
        let Timer = setInterval(() => {
          count += 1;
          ElementObj.$video = document.querySelectorAll('video')[0];
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(1);
            return;
          }
          if (count >= 7) {
            clearInterval(Timer);
            resolve(2);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        let studyType = yield this.getVideoDom();
        if (studyType == 1) {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
          setTimeout(() => {
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 3000);
          this.listenVidoeStatus(ElementObj.$video, () => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          });
          this.listenRebort();
          ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
            showTip('✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a', 4500);
            this.playNext();
            void 0;
          }));
          ElementObj.$video.addEventListener('pause', () => {
            setTimeout(() => {
              ElementObj.$video.volume = 0;
              ElementObj.$video.play();
            }, 1500);
          });
        }
        if (studyType == 2) {
          showTip('✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a', 3000);
          yield sleep(3000);
          this.playNext();
        }
      });
    }
    listenRebort() {
      this.listenRebortTime = setInterval(() => {
        var _b;
        let $topicModal = document.querySelector('.ant-modal-root');
        if (!!$topicModal) {
          (_b = $topicModal.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild($topicModal);
        }
      }, 10 * 1000);
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        if (this.currentIndex >= ElementObj.$allTask.length - 1) {
          void 0;
          return;
        }
        yield sleep(2500);
        this.currentIndex += 1;
        let $closeBtn = document.querySelectorAll('.ant-modal-body button')[2];
        $closeBtn === null || $closeBtn === void 0 ? void 0 : $closeBtn.click();
        let $nextBtn = document.querySelectorAll('.studycontentBottom button')[2];
        $nextBtn === null || $nextBtn === void 0 ? void 0 : $nextBtn.click();
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4000);
      });
    }
  }
  gzteacher.ctxid = 60;
  class moocxinyingzao extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          void 0;
          try {
            ElementObj.$allTask = document.querySelectorAll('#pane-category .resource-list-item');
            if (ElementObj.$allTask.length) {
              ElementObj.$handleSpeedUp.style.display = 'none';
              clearInterval(interval);
              this.getCurrentIndex();
            }
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        for (var i = 0; i <= ElementObj.$allTask.length - 1; i++) {
          let isDone = ElementObj.$allTask[i];
          let status = isDone.querySelector('.resource-action span').innerText;
          if (!['\u5df2\u5b8c\u6210', '\u6b63\u5728\u5b66'].includes(status)) {
            this.currentIndex = i;
            break;
          }
        }

        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        ElementObj.$allTask[this.currentIndex].click();
        showTip('✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4000);
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let count = 0;
        let Timer = setInterval(() => {
          count += 1;
          let $iframe = document.querySelector('iframe');
          if (!!$iframe) {
            clearInterval(Timer);
            resolve(2);
            return;
          }
          ElementObj.$video = document.querySelectorAll('video')[0];
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(1);
            return;
          }
          if (count >= 7) {
            clearInterval(Timer);
            resolve(2);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        let studyType = yield this.getVideoDom();
        if (studyType == 1) {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
          setTimeout(() => {
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 3000);
          this.listenVidoeStatus(ElementObj.$video, () => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          });
          this.listenRebort();
          ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
            showTip('✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a', 4500);
            this.playNext();
            void 0;
          }));
          ElementObj.$video.addEventListener('pause', () => {
            setTimeout(() => {
              ElementObj.$video.volume = 0;
              ElementObj.$video.play();
            }, 1500);
          });
        }
        if (studyType == 2) {
          showTip('✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a', 3000);
          yield sleep(3000);
          this.playNext();
        }
      });
    }
    listenRebort() {
      this.listenRebortTime = setInterval(() => {
        var _b;
        let $topicModal = document.querySelector('.ant-modal-root');
        if (!!$topicModal) {
          (_b = $topicModal.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild($topicModal);
        }
      }, 10 * 1000);
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        this.getCurrentIndex();
      });
    }
  }
  moocxinyingzao.ctxid = 60;
  class zhejiangzjelib extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {});
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        ElementObj.$allTask = document.querySelector('#iframepage').contentDocument.querySelectorAll('.ncells');
        for (var i = 0; i <= ElementObj.$allTask.length - 1; i++) {
          let isDone = ElementObj.$allTask[i];
          let status = isDone.querySelector('.roundpointStudent.blue');
          if (!status) {
            this.currentIndex = i;
            break;
          }
        }

        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        ElementObj.$allTask[this.currentIndex].querySelector('a').click();
        showTip('✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        setTimeout(() => {
          this.spanKeyCount();
        }, 4000);
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let count = 0;
        let Timer = setInterval(() => {
          count += 1;
          ElementObj.$video = document.querySelector('#iframepage').contentDocument.querySelector('#iframe').contentDocument.querySelector('iframe').contentDocument.querySelector('video');
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(1);
            return;
          }
          if (count >= 7) {
            clearInterval(Timer);
            resolve(2);
          }
        }, 1000);
      });
    }
    handleClickSpeedUp(callback) {
      return __awaiter(this, void 0, void 0, function* () {
        this.getCurrentIndex();
      });
    }
    spanKeyCount() {
      return __awaiter(this, void 0, void 0, function* () {
        let key = localStorage.getItem('mytoolkey');
        if (key) {
          let result = yield fetchData({
            method: 'GET',
            url: bserUrl + `/speedup?toolkey=${key}&canuse=${toolOption.SchoolType}`
          });
          if (result.code == 200) {
            this.play();
          } else {
            showTip(`🔉🔉🔉${result.message}`, 5000, true);
            return;
          }
        } else if (!key) {
          void 0;
          window.open(basehost);
        } else {
          void 0;
        }
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        let studyType = yield this.getVideoDom();
        if (studyType == 1) {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
          setTimeout(() => {
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 3000);
          this.listenVidoeStatus(ElementObj.$video, () => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          });
          this.listenRebort();
          ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
            showTip('✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a', 4500);
            this.playNext();
            void 0;
          }));
          ElementObj.$video.addEventListener('pause', () => {
            setTimeout(() => {
              ElementObj.$video.volume = 0;
              ElementObj.$video.play();
            }, 1500);
          });
        }
        if (studyType == 2) {
          showTip('✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a', 3000);
          yield sleep(3000);
          this.playNext();
        }
      });
    }
    listenRebort() {
      this.listenRebortTime = setInterval(() => {}, 10 * 1000);
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        if (this.currentIndex >= ElementObj.$allTask.length - 1) {
          void 0;
          return;
        }
        yield sleep(2500);
        this.currentIndex += 1;
        let $nextBtn = ElementObj.$allTask[this.currentIndex].querySelector('a');
        $nextBtn === null || $nextBtn === void 0 ? void 0 : $nextBtn.click();
        setTimeout(() => {
          this.spanKeyCount();
        }, 4000);
      });
    }
  }
  zhejiangzjelib.ctxid = 60;
  class dongbeishifandaxue extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          void 0;
          try {
            ElementObj.$allTask = document.querySelectorAll('.course-list-con .ovd');
            if (ElementObj.$allTask.length) {
              ElementObj.$handleSpeedUp.style.display = 'none';
              clearInterval(interval);
              this.getCurrentIndex();
            }
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        for (var i = 0; i <= ElementObj.$allTask.length - 1; i++) {
          let isDone = ElementObj.$allTask[i];
          if (isDone.classList.contains('cur')) {
            this.currentIndex = i;
            break;
          }
        }
        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        showTip('✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4000);
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let count = 0;
        let Timer = setInterval(() => {
          count += 1;
          ElementObj.$video = document.querySelectorAll('video')[0];
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(1);
            return;
          }
          if (count >= 7) {
            clearInterval(Timer);
            resolve(2);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        let studyType = yield this.getVideoDom();
        if (studyType == 1) {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
          setTimeout(() => {
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 3000);
          this.listenVidoeStatus(ElementObj.$video, () => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          });
          this.listenRebort();
          ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
            showTip('✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a', 4500);
            this.playNext();
            void 0;
          }));
          ElementObj.$video.addEventListener('pause', () => {
            setTimeout(() => {
              ElementObj.$video.volume = 0;
              ElementObj.$video.play();
            }, 1500);
          });
        }
        if (studyType == 2) {
          showTip('✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a', 3000);
          yield sleep(3000);
          this.playNext();
        }
      });
    }
    listenRebort() {
      this.listenRebortTime = setInterval(() => {
        var _b;
        let $topicModal = document.querySelector('.ant-modal-root');
        if (!!$topicModal) {
          (_b = $topicModal.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild($topicModal);
        }
      }, 10 * 1000);
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        if (this.currentIndex >= ElementObj.$allTask.length - 1) {
          void 0;
          return;
        }
        yield sleep(2500);
        this.currentIndex += 1;
        let $nextBtn = ElementObj.$allTask[this.currentIndex].querySelector('a');
        $nextBtn === null || $nextBtn === void 0 ? void 0 : $nextBtn.click();
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 6000);
      });
    }
  }
  dongbeishifandaxue.ctxid = 60;
  class quanguomeotan extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          void 0;
          try {
            ElementObj.$allTask = document.querySelectorAll('.row1 a.subset-class');
            if (ElementObj.$allTask.length) {
              ElementObj.$handleSpeedUp.style.display = 'none';
              clearInterval(interval);
              this.getCurrentIndex();
            }
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        for (var i = 0; i <= ElementObj.$allTask.length - 1; i++) {
          let isDone = ElementObj.$allTask[i];
          if (isDone.classList.contains('on')) {
            this.currentIndex = i;
            break;
          }
        }
        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        showTip('✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4000);
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let count = 0;
        let Timer = setInterval(() => {
          count += 1;
          ElementObj.$video = document.querySelectorAll('video')[0];
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(1);
            return;
          }
          if (count >= 7) {
            clearInterval(Timer);
            resolve(2);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        let studyType = yield this.getVideoDom();
        if (studyType == 1) {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
          setTimeout(() => {
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 3000);
          this.listenVidoeStatus(ElementObj.$video, () => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          });
          this.listenRebort();
          ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
            showTip('✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a', 4500);
            this.playNext();
            void 0;
          }));
          ElementObj.$video.addEventListener('pause', () => {
            setTimeout(() => {
              ElementObj.$video.volume = 0;
              ElementObj.$video.play();
            }, 1500);
          });
        }
        if (studyType == 2) {
          showTip('✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a', 3000);
          yield sleep(3000);
          this.playNext();
        }
      });
    }
    listenRebort() {
      this.listenRebortTime = setInterval(() => {
        var _b;
        let $topicModal = document.querySelector('.ant-modal-root');
        if (!!$topicModal) {
          (_b = $topicModal.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild($topicModal);
        }
      }, 10 * 1000);
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        if (this.currentIndex >= ElementObj.$allTask.length - 1) {
          void 0;
          return;
        }
        yield sleep(2500);
        this.currentIndex += 1;
        let $nextBtn = ElementObj.$allTask[this.currentIndex];
        $nextBtn === null || $nextBtn === void 0 ? void 0 : $nextBtn.click();
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 6000);
      });
    }
  }
  quanguomeotan.ctxid = 60;
  class qzjystudy extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          void 0;
          try {
            ElementObj.$allTask = document.querySelectorAll('.videoList .item');
            if (ElementObj.$allTask.length) {
              ElementObj.$handleSpeedUp.style.display = 'none';
              clearInterval(interval);
              this.getCurrentIndex();
            }
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        for (var i = 0; i <= ElementObj.$allTask.length - 1; i++) {
          let isDone = ElementObj.$allTask[i];
          let status = isDone.querySelectorAll('span')[1].innerText;
          if (parseInt(status) < 99) {
            this.currentIndex = i;
            break;
          }
        }

        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        ElementObj.$allTask[this.currentIndex].click();
        showTip('✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4000);
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let count = 0;
        let Timer = setInterval(() => {
          count += 1;
          ElementObj.$video = document.querySelectorAll('video')[0];
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(1);
            return;
          }
          if (count >= 7) {
            clearInterval(Timer);
            resolve(2);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        let studyType = yield this.getVideoDom();
        if (studyType == 1) {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
          setTimeout(() => {
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 3000);
          this.listenVidoeStatus(ElementObj.$video, () => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          });
          this.listenRebort();
          ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
            showTip('✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a', 4500);
            this.playNext();
            void 0;
          }));
          ElementObj.$video.addEventListener('pause', () => {
            setTimeout(() => {
              ElementObj.$video.volume = 0;
              ElementObj.$video.play();
            }, 1500);
          });
        }
        if (studyType == 2) {
          showTip('✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a', 3000);
          yield sleep(3000);
          this.playNext();
        }
      });
    }
    listenRebort() {
      this.listenRebortTime = setInterval(() => {
        var _b;
        let $topicModal = document.querySelector('.ant-modal-root');
        if (!!$topicModal) {
          (_b = $topicModal.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild($topicModal);
        }
      }, 10 * 1000);
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        if (this.currentIndex >= ElementObj.$allTask.length - 1) {
          void 0;
          return;
        }
        yield sleep(2500);
        this.currentIndex += 1;
        let $nextBtn = ElementObj.$allTask[this.currentIndex];
        $nextBtn === null || $nextBtn === void 0 ? void 0 : $nextBtn.click();
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 6000);
      });
    }
  }
  qzjystudy.ctxid = 60;
  class GlivePro extends Main {
    constructor() {
      super();
      this.taskLength = 0;
      this.currentIndex = -1;
      this._init();
    }
    _init() {
      return __awaiter(this, void 0, void 0, function* () {
        let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
          void 0;
          try {
            ElementObj.$allTask = document.querySelectorAll('.animated .syllabus-tree-node-title');
            if (ElementObj.$allTask.length) {
              ElementObj.$handleSpeedUp.style.display = 'none';
              clearInterval(interval);
              this.getCurrentIndex();
            }
          } catch (e) {}
        }), 1000);
      });
    }
    getCurrentIndex() {
      return __awaiter(this, void 0, void 0, function* () {
        for (var i = 0; i <= ElementObj.$allTask.length - 1; i++) {
          let isDone = ElementObj.$allTask[i];
          if (isDone.classList.contains('is-active')) {
            this.currentIndex = i;
            break;
          }
        }
        if (this.currentIndex == -1) {
          void 0;
          return;
        }
        showTip('✅✅✅\u521d\u59cb\u5316\u5b8c\u6210，5\u79d2\u540e\u5f00\u59cb\u64ad\u653e', 3000);
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 4000);
      });
    }
    getVideoDom() {
      return new Promise(resolve => {
        let count = 0;
        let Timer = setInterval(() => {
          count += 1;
          ElementObj.$video = document.querySelectorAll('video')[0];
          if (!!ElementObj.$video) {
            clearInterval(Timer);
            resolve(1);
            return;
          }
          if (count >= 7) {
            clearInterval(Timer);
            resolve(2);
          }
        }, 1000);
      });
    }
    play() {
      return __awaiter(this, void 0, void 0, function* () {
        clearInterval(this.listenVidoeStatusTimer);
        clearInterval(this.listenRebortTime);
        let studyType = yield this.getVideoDom();
        if (studyType == 1) {
          ElementObj.$video.volume = 0;
          ElementObj.$video.play();
          setTimeout(() => {
            ElementObj.$video.playbackRate = toolOption.accelerator;
          }, 3000);
          this.listenVidoeStatus(ElementObj.$video, () => {
            ElementObj.$video.volume = 0;
            ElementObj.$video.play();
          });
          this.listenRebort();
          ElementObj.$video.addEventListener('pause', () => {
            setTimeout(() => {
              ElementObj.$video.volume = 0;
              ElementObj.$video.play();
            }, 1500);
          });
        }
        if (studyType == 2) {
          showTip('✅✅✅\u8be5\u7ae0\u8282\u4e3a\u6587\u6863，\u5373\u5c06\u81ea\u52a8\u5207\u6362\u4e0b\u4e00\u4e2a', 3000);
          yield sleep(3000);
          this.playNext();
        }
      });
    }
    listenRebort() {
      this.listenRebortTime = setInterval(() => {
        let dur = parseInt(ElementObj.$video.duration);
        let cur = parseInt(ElementObj.$video.currentTime);
        if (cur >= dur) {
          showTip('✅✅✅\u5f53\u524d\u89c6\u9891\u5df2\u64ad\u653e\u5b8c，5\u79d2\u540e\u64ad\u653e\u4e0b\u4e00\u4e2a', 4500);
          this.playNext();
        }
      }, 3 * 1000);
    }
    playNext() {
      return __awaiter(this, void 0, void 0, function* () {
        if (this.currentIndex >= ElementObj.$allTask.length - 1) {
          void 0;
          return;
        }
        yield sleep(2500);
        this.currentIndex += 1;
        let $nextBtn = ElementObj.$allTask[this.currentIndex];
        $nextBtn === null || $nextBtn === void 0 ? void 0 : $nextBtn.click();
        setTimeout(() => {
          this.handleClickSpeedUp();
        }, 6000);
      });
    }
  }
  GlivePro.ctxid = 60;
  class Addpanel {
    constructor() {
      this.$panelWrap = document.createElement('div');
      this.$panelStyle = document.createElement('style');
      this._init();
    }
    _init() {
      var _b, _c, _d, _e, _f, _g;
      this.$panelWrap.innerHTML = this.getCTXHTML();
      this.$panelStyle.innerHTML = panelcss;
      (_b = document.querySelector('head')) === null || _b === void 0 ? void 0 : _b.appendChild(this.$panelStyle);
      if (toolOption.SchoolType == 3) {
        (_c = document.querySelector('#bigContainer')) === null || _c === void 0 ? void 0 : _c.appendChild(this.$panelWrap);
      } else if (toolOption.SchoolType == 7) {
        (_d = document.querySelector('.layout-content')) === null || _d === void 0 ? void 0 : _d.appendChild(this.$panelWrap);
      } else if (toolOption.SchoolType == 11) {
        (_e = document.querySelector('.task-dashboard-page')) === null || _e === void 0 ? void 0 : _e.appendChild(this.$panelWrap);
      } else if (toolOption.SchoolType == 18) {
        (_f = document.querySelector('.screen_wide_1')) === null || _f === void 0 ? void 0 : _f.appendChild(this.$panelWrap);
      } else {
        (_g = document.querySelector('body')) === null || _g === void 0 ? void 0 : _g.appendChild(this.$panelWrap);
      }
      ElementObj.$title3 = document.querySelector('.title3');
      ElementObj.$mytoolkey = document.querySelector('.mytoolkey');
      ElementObj.$nokey = document.querySelector('.nokey');
      ElementObj.$addKey = document.getElementById('addKey');
      ElementObj.$removeKey = document.getElementById('removeKey');
      ElementObj.$ipt = document.querySelector('.mytoolkeyipt');
      ElementObj.$handleSpeedUp = document.querySelector('.handleSpeedUp');
      ElementObj.$playButton = document.querySelector('#playButton');
      ElementObj.$ctxTipWrap = document.querySelector('#ctxTipWrap');
      ElementObj.$ctxsection2 = document.querySelector('.ctxsection2');
      ElementObj.$ctxcontrols = document.querySelector('.ctxcontrols');
      let storageKey = localStorage.getItem('mytoolkey');
      if (storageKey) {
        this.handleSetHtml(storageKey);
      }
      this.optimizePannel();
      this.setSpeedOption();
      this.addEvent();
      this.getSlogan();
    }
    optimizePannel() {
      if (toolOption.SchoolType == 2) {
        $el('.myTool').style.left = 'unset';
        $el('.myTool').style.right = '44px';
        $el('.ipt-wrap').style.marginTop = '3px';
        ElementObj.$ipt.style.padding = '11px 3px';
      }
      if (toolOption.SchoolType == 9) {
        $el('.handleKeyBtn').style.lineHeight = '16px';
      }
      if (toolOption.SchoolType == 16) {
        $el('.cxtsection3').style.display = 'block';
        ElementObj.$myTool = document.querySelector('.myTool');
      }
      if ([14, 24, 63].indexOf(toolOption.SchoolType) != -1) {
        toolOption.accelerator = 1;
        speedArr = [1];
      }
      if ([40, 52, 54, 67, 80].indexOf(toolOption.SchoolType) != -1) {
        speedArr = [1, 2];
      }
      if ([7, 12, 22, 53].indexOf(toolOption.SchoolType) != -1) {
        speedArr = [1, 2, 3];
        toolOption.accelerator = 3;
      }
      if ([38, 45, 46, 52, 57, 58, 61, 64, 67].indexOf(toolOption.SchoolType) != -1) {
        $el('.myTool').style.left = 'unset';
        $el('.myTool').style.right = '44px';
      }
      if (toolOption.SchoolType == 17) {
        toolOption.accelerator = 1;
        speedArr = [1, 10];
      }
      if (toolOption.SchoolType == 18) {
        $el('.btn1').style.width = '74%';
        $el('.btn1').style.paddingTop = '0';
        $el('.btn1').style.paddingBottom = '0';
        $el('#slogan').style.position = 'relative';
        $el('#slogan').style.left = '-40px';
        speedArr = [1, 2, 3, 5];
      }
      if (toolOption.SchoolType == 19) {
        toolOption.accelerator = 1;
        speedArr = [1];
        $el('.myTool').style.width = '202px';
      }
      if (toolOption.SchoolType == 23) {
        $el('.myTool').style.top = '176px';
        toolOption.accelerator = 1;
        speedArr = [1];
      }
      if (toolOption.SchoolType == 25) {
        toolOption.accelerator = 2;
        speedArr = [1, 1.25, 1.5, 2];
      }
      if (toolOption.SchoolType == 26) {
        $el('.myTool').style.width = '202px';
      }
      if (toolOption.SchoolType == 16) {
        if (Internetcourse.gzjxjy.runtype == 2) {
          ElementObj.$handleSpeedUp.style.display = 'none';
          ElementObj.$speedSelect = document.querySelector('.ctxsection2');
          ElementObj.$speedSelect.style.display = 'none';
        }
        if (Internetcourse.gzjxjy.runtype == 1) {
          ElementObj.$ctxsection3 = document.querySelector('.cxtsection3');
          ElementObj.$ctxsection3.style.display = 'none';
        }
      }
      if (toolOption.SchoolType == 30) {
        speedArr = [1, 2, 3, 5, 10, 15];
        toolOption.accelerator = 2;
      }
      if (toolOption.SchoolType == 32 || toolOption.SchoolType == 36) {
        $el('.myTool').style.left = 'unset';
        $el('.myTool').style.right = '44px';
        speedArr = [1, 1.1];
      }
      if (toolOption.SchoolType == 37) {
        speedArr = [1, 2, 5];
      }
      if (toolOption.SchoolType == 38) {
        speedArr = [1, 2];
      }
      if (toolOption.SchoolType == 41) {
        speedArr = [1, 2, 3, 5];
      }
      if (toolOption.SchoolType == 44) {
        speedArr = [1, 1.5, 2, 3, 5, 10];
      }
      if (toolOption.SchoolType == 51) {
        $el('.myTool').style.left = '76px';
        speedArr = [1, 2, 10];
        toolOption.accelerator = 2;
      }
      if (toolOption.SchoolType == 52) {
        $el('.myTool').style.left = '76px';
        speedArr = [1, 2, 3, 10];
        toolOption.accelerator = 2;
      }
      if (toolOption.SchoolType == 60) {
        speedArr = [1, 1.5, 1.8, 2];
        toolOption.accelerator = 2;
      }
      if (toolOption.SchoolType == 66) {
        speedArr = [1, 2, 3, 10];
        toolOption.accelerator = 3;
      }
      if (toolOption.SchoolType == 71) {
        speedArr = [1, 2, 3, 10];
        toolOption.accelerator = 3;
      }
    }
    setSpeedOption() {
      ElementObj.$speedSelect = document.querySelector('#ctxspeed');
      let html = ``;
      for (var i = 0; i < speedArr.length; i++) {
        let str = `
                <option value="${speedArr[i] == 1.1 ? 1.0 : speedArr[i]}" class="option">
                  × ${speedArr[i] == 1.1 ? 1.2 : speedArr[i]}.0
                </option>
                `;
        html += str;
      }
      ElementObj.$speedSelect.innerHTML = html;
      var _localSpeed = localStorage.getItem('_localSpeed');
      if (_localSpeed) {
        ElementObj.$speedSelect.value = _localSpeed;
        toolOption.accelerator = Number(_localSpeed);
      }
    }
    handleSetHtml(key) {
      try {
        ElementObj.$ipt.style.display = 'none';
        ElementObj.$title3.innerText = '\u5f53\u524dkey：';
        ElementObj.$mytoolkey.innerText = key;
        ElementObj.$mytoolkey.style.display = 'block';
        ElementObj.$nokey.style.display = 'none';
        ElementObj.$removeKey.style.display = 'block';
        ElementObj.$addKey.style.display = 'none';
        ElementObj.userKey = key;
      } catch (e) {}
    }
    addEvent() {
      ElementObj.$addKey.addEventListener('click', () => {
        toolOption.CtxMain.handleAddKey(key => {
          this.handleSetHtml(key);
        });
      });
      ElementObj.$removeKey.addEventListener('click', () => {
        toolOption.CtxMain.handleRemoveKey();
      });
      ElementObj.$handleSpeedUp.addEventListener('click', () => {
        toolOption.CtxMain.handleClickSpeedUp();
      });
      ElementObj.$ctxsection2.addEventListener('change', e => {
        toolOption.CtxMain.handleChangeCtxSpeed(e.target.value);
      });
      ElementObj.$ctxcontrols.addEventListener('click', () => {
        let $myToolContent = document.querySelector('.myTool-content');
        let isHide = GM_getValue("hideCtx", null);
        if (isHide) {
          $myToolContent.style.height = 'auto';
          ElementObj.$ctxcontrols.innerText = '×';
        } else {
          $myToolContent.style.height = '0px';
          ElementObj.$ctxcontrols.innerText = '🔛';
          $el('.myTool').style.display = 'none';
        }
        GM_setValue("hideCtx", !isHide);
      });
      document.querySelectorAll('.targetHome').forEach(item => {
        item.addEventListener('click', () => {
          void 0;
          location.href = basehost;
        });
      });
    }
    getSlogan() {
      fetchData({
        url: bserUrl + '/getslogan',
        method: "GET"
      }).then(res => {
        ElementObj.$slogan = document.querySelector('#slogan');
        ElementObj.$slogan.innerHTML = res.result.text1;
      });
    }
    getCTXHTML() {
      return `
<div class="myTool">
    <div class="controls ctxcontrols">×</div>
    <div class=''><a style="color: black;" href="${basehost}" target="_blank">📺\u9ad8\u667aAi\u81ea\u52a8\u5b66\u4e60\u7a0b\u5e8f</a></div>
    
    <div class="myTool-content">
        <div class="nokey">
            <div class="btns">
                <div class="btn1"
                     style="text-align: center;color: #1776FDFF;text-decoration: underline;margin: 5px 0;cursor: pointer;">
                    <a href="${basehost}" target="_blank">\u70b9\u51fb\u83b7\u53d6Key</a>
                </div>
                <a href="${basehost}" target="_blank" id="slogan" style="text-decoration: none;">
                
                </a>
            </div>
        </div>
    
        <div class="cxtsection ctxsection1">
          <div class="ctx-title title3">
            \u8f93\u5165Key：
          </div>
          <div class="ipt-wrap" style="display: flex;align-items: center;justify-content: space-between;">
            <input class="mytoolkeyipt" />
            <div style="width: 120px;height: 18px;margin-right: 5px;display: none;" class="mytoolkey"></div>
            <button class="handleKeyBtn addkey-btn" id="addKey">\u7ed1\u5b9a</button>
            <button class="handleKeyBtn removkey-btn" id="removeKey">\u89e3\u7ed1</button>
          </div>
        </div>

        <div class="cxtsection ctxsection2">
          <div class="ctx-title">
            \u8bbe\u7f6e\u500d\u901f：
          </div>
          <select name="" id="ctxspeed" class="speed-select">
            <option value="1" class="option">
              × 1.0
            </option>
            <option value="5" class="option">
              × 5.00
            </option>
            <option value="10" class="option" selected="selected">
              × 10.00
            </option>
            <option value="16" class="option">
              × 16.00
            </option>
          </select>
        </div>
        
        <div class="cxtsection ctxsection3">
          <div class="ctx-title">
            \u610f\u89c1\u53cd\u9988：
          </div>
          <a href="${basehost}"><div class="feedbackBtn">\u53bb\u53cd\u9988</div></a>
        </div>
        
        <div class="scriptTip" style="display: none;border-radius: 4px;margin-top: 9px;font-size: 12px;background: rgba(108,201,255,0.5);box-sizing: border-box;padding: 5px;">
            <div class="title">\u63d0\u793a：</div>
            <p style="margin: 6px 0;">1.\u5174\u8da3\u8bfe\u5168\u7f51\u76ee\u524d\u4ec5\u652f\u6301\u6700\u9ad81.5\u500d\u901f</p>
        </div>
        <div class="cxtsection cxtsection3" style="display: none"> 
          <div class="ctx-title">
            \u5f53\u524d\u4f5c\u7b54\u9898\u76ee：
          </div>
          <div class="ctxtopic-name">\u8d35\u5dde\u7701\u8d35\u9633\u5e02\u6bd3\u79c0\u8def27\u53f7\u8d35\u5dde\u7701\u4eba\u624d\u5927\u5e02\u573a4\u697c</div>
        </div>
        
        <div class="handleSpeedUp">\u70b9\u51fb\u52a0\u901f</div>
    </div>
    
    <div id="ctxTipWrap" class="ctxTipWrap"></div>
</div>
    `;
    }
  }
  function $el(selector, root2 = window.document) {
    const el2 = root2.querySelector(selector);
    return el2 === null ? void 0 : el2;
  }
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  function fetchData(option) {
    return new Promise(resolve => {
      try {
        GM_xmlhttpRequest(Object.assign(Object.assign({}, option), {
          onload: function (xhr) {
            if (xhr.status == 200) {
              resolve(JSON.parse(xhr.response));
            }
          }
        }));
      } catch (e) {
        fetch(option.url, {
          method: option.method
        }).then(res => res.json()).then(res => {
          resolve(res);
        });
      }
    });
  }
  function showTip(text, time = 1500, isAlert) {
    ElementObj.$ctxTipWrap.style.display = 'block';
    ElementObj.$ctxTipWrap.innerText = text;
    let timer = setTimeout(() => {
      ElementObj.$ctxTipWrap.style.display = 'none';
    }, time);
    if (isAlert) {
      void 0;
    }
  }
  function recognitionType() {
    let current_host = location.host;
    if (/www.gaozhiwang.top/.test(current_host)) return;
    if (current_host.indexOf('www.gsgwypx.com.cn') != -1) {
      toolOption.SchoolType = Internetcourse.gansugongwuyuan.id;
      toolOption.CtxMain = gansugongwuyuan;
      return;
    }
    let result = {
      type: 0,
      option: null
    };
    for (let key in Internetcourse) {
      if (Internetcourse[key].host.includes(current_host)) {
        result.type = 2;
        if (Internetcourse[key].mainClass == 'CTXCommon') {
          result.type = 1;
          result.option = Internetcourse[key].option;
        }
        toolOption.CtxMain = eval(Internetcourse[key].mainClass);
        toolOption.SchoolType = Internetcourse[key].id;
      }
      if (/www.ttcdw.cn/.test(current_host)) {
        let _$paramsUn = document.querySelector('#paramsUn');
        if (!!_$paramsUn) {
          toolOption.SchoolType = Internetcourse.beijingjiaoshi.id;
          toolOption.CtxMain = beijingjiaoshi;
        } else {
          toolOption.SchoolType = Internetcourse.beijingjiaoshi.id;
          toolOption.CtxMain = beijingjiaoshi;
        }
      }
      if (/gzjxjy.gzsrs.cn/.test(current_host)) {
        let $survey = document.querySelector('.survey-header-subtitle');
        if (!!$survey) {
          toolOption.CtxMain = gzjxjy_Answer;
          Internetcourse.gzjxjy.runtype = 2;
        } else {
          toolOption.CtxMain = gzjxjy;
          Internetcourse.gzjxjy.runtype = 1;
        }
        toolOption.SchoolType = Internetcourse.gzjxjy.id;
      }
    }
    if (!toolOption.CtxMain) {
      result.type = 0;
      toolOption.CtxMain = zjzjsrc;
      toolOption.SchoolType = Internetcourse.zjzjsrc.id;
    }
    return result;
  }

  function hack() {
    var _a;
    const vue = (_a = $el(".video-study")) == null ? void 0 : _a.__vue__;
    const empty = () => {};
    vue.checkout = empty;
    vue.notTrustScript = empty;
    vue.checkoutNotTrustScript = empty;
    const _videoClick = vue.videoClick;
    vue.videoClick = function (...args) {
      const e = new PointerEvent("click");
      const event = Object.create({
        isTrusted: true
      });
      Object.setPrototypeOf(event, e);
      args[args.length - 1] = event;
      return _videoClick.apply(vue, args);
    };
    vue.videoClick = function (...args) {
      args[args.length - 1] = {
        isTrusted: true
      };
      return _videoClick.apply(vue, args);
    };
  }
  setTimeout(() => {
    let fitResult = recognitionType();
    basehost += `/?ctxid=${(fitResult === null || fitResult === void 0 ? void 0 : fitResult.type) ? toolOption.SchoolType : 2}`;
    if (toolOption.SchoolType == 1) {
      try {
        hack();
      } catch (e) {}
    }
    if ((fitResult === null || fitResult === void 0 ? void 0 : fitResult.type) == 1) {
      toolOption.CtxMain = new CTXCommon(fitResult.option);
    } else {
      toolOption.CtxMain = new toolOption.CtxMain();
    }
    new Addpanel();
  }, 5000); 
})();