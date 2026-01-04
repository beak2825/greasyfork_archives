// ==UserScript==
// @name         GMV TO 5A
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.1
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_brand/assets/gta/track?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        none
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/464723/GMV%20TO%205A.user.js
// @updateURL https://update.greasyfork.org/scripts/464723/GMV%20TO%205A.meta.js
// ==/UserScript==

(function () {
  "use strict";

  var new_element = document.createElement("link");
  new_element.setAttribute("rel", "stylesheet");
  new_element.setAttribute("href", "https://qmsg.refrain.xyz/message.min.css");
  document.body.appendChild(new_element);

  var buttom = document.createElement("button"); //创建一个按钮
  buttom.textContent = "导出数据"; //按钮内容
  buttom.style.height = "32px"; //高
  buttom.style.lineHeight = "32px"; //行高
  buttom.style.align = "center"; //文本居中
  buttom.style.color = "white"; //按钮文字颜色
  buttom.style.background = "#2a5df0"; //按钮底色
  buttom.style.border = "0px"; //边框属性
  buttom.style.borderRadius = "3px"; //按钮四个角弧度
  buttom.style.marginLeft = "10px";
  buttom.style.fontSize = "12px";
  buttom.style.padding = "0 5px";
  buttom.addEventListener("click", userClick); //监听按钮点击事件

  //message.js
  let loadingMsg = null;

   //获取industry_id
   let industry_id = null;

   //获取report_id
   let report_id = null;

   (function listen() {
     var origin = {
       open: XMLHttpRequest.prototype.open,
       send: XMLHttpRequest.prototype.send,
     };
     XMLHttpRequest.prototype.open = function (a, b) {
       this.addEventListener("load", replaceFn);
       origin.open.apply(this, arguments);
     };
     XMLHttpRequest.prototype.send = function (a, b) {
       origin.send.apply(this, arguments);
     };
     function replaceFn(obj) {
       if (
         this?._url?.slice(0, 42) == "/yuntu_ng/api/v1/get_brand_competitor_list"
       ) {
         industry_id = JSON.parse(obj?.target?.response).data[0].industry_id;
       }
       if (
        this?._url?.slice(0, 45) == "/yuntu_ng/api/v1/AudienceGtaReportQueryListV2"
      ) {
        report_id = JSON.parse(obj?.target?.response).data.reports[0].base_info.report_id;
      }
     }
   })();

  //默认GET请求
  const getRequestOptions = {
    method: "GET",
    redirect: "follow",
  };

  //获取brand信息
  let brand = localStorage.getItem("__Garfish__platform__yuntu_user") || "";
  let brands = JSON.parse(brand);

  // 弹窗组件
  class inlyModelComponent {
    constructor() {
      let _this = this;
      this.loadingMsg = null;

      //展示弹窗
      this.showModel = () => {
        $("#inly_model").css({ display: "block" });
        $(".inly_box").css({ animation:'inly_box .2s forwards' })
        setTimeout(() => {
          $("#inly_model").css({ opacity: 1 });
        }, 0);
      };

      //关闭弹窗
      this.closeModel = function () {
        $("#inly_model").css({ opacity: 0 });
        $(".inly_box").css({animation:'inly_box_close .2s forwards'})
        setTimeout(() => {
          document.getElementById("inly_model").style.display = "none";
        }, 200);
      };

      //原生阻止冒泡
      this.stopPropagation = function (e) {
        e = e || window.event;
        if (e.stopPropagation) {
          e.stopPropagation();
        } else {
          e.cancelBubble = true;
        }
      };

      const htmlModel = `
      <div
      style="
        transition: opacity 0.2s;
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.2);
        z-index: 888;
        display: none;
      "
      id="inly_model"
    >
      <style>
        .inly_buttom{
          flex: 1; 
          display: flex;
          color: #FFF; 
          cursor: pointer; 
          background-color: rgba(43, 93, 241, .9); 
          font-size: 12px;
          height: 24px; 
          margin: 5px;
          border-radius: 3px; 
          align-items: center;
          justify-content: center;
        }
        .tips{
          position: absolute;
          font-size: 12px;
          color: #666;
          right: 5px;
          bottom: 5px;
        }
        .inly_box{
          box-sizing: border-box;
          position: absolute;
          height: 200px;
          width: 350px;
          background-color: #fff;
          border-radius: 10px;
          padding: 10px;
        }
        @keyframes inly_box {
          0%{top:0%;right: 0%;transform:translate(0%, 0%) scale(0);}
          100%{top:50%;right: 50%;transform:translate(50%, -100%) scale(1);}
        }
        
        @keyframes inly_box_close {
          0%{top:50%;right: 50%;transform:translate(50%, -100%) scale(1);}
          100%{top:0%;right: 0%;transform:translate(0%, 0%) scale(0);}
        }
      </style>
      <div
        id="inly_box"
        class="inly_box"
      >
        <div
          style="
          position: absolute;
          top: 0px;
          right: 10px;
          z-index: -1;
          opacity: 1;
          /* transform: rotate(-45deg); */
          "
        >
          <svg
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            width="42px"
            height="42px"
            viewBox="0 0 42 42"
            enable-background="new 0 0 128 128"
            xml:space="preserve"
          >
            <image
              id="image0"
              width="42"
              height="42"
              x="0"
              y="0"
              href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
              AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAT
              10lEQVR42u2de5BeR3mnn1+fMxfdLEszkmxLGsmA7GAT29iGkCUQO4QACbYXbyBgxx7Z5eSPQG2K
              bGHCht2wgWwClSVcik0WyK4kr8AFzlLAmhASiEnsxIBxTGwHc7EljSxb0szoamku33f6t3/0GWlG
              1lw+XWakpZ+qqZlvvtN93u7z9u3tt98DmUwmk8lkMplMJpPJZDKZTCaTyWQymUwmk8lkMplMJpPJ
              ZDKZTCaTyWQymUwmk8lkMplMJpPJZDKZTCaTyWTORLRnfQ8A0TNLUIR0bdeGviP/6+9NeWiKdD7O
              38s39nEq6L91FQoFAR+/HIJQ/7l0nNx71q/BgD2DwgsKpRIu+V/bTljWgd4ePEVdjX3X3ULdDK5f
              QxlEM0ZmVJT65l0b+ijr65cB1wMd06S1zd8BTxznu646j3mTpB0B+oDHg3jGrhXHgWWbtp5whR6t
              NmN4OfAyJuobmKbFV4CnJ/7bgHqA1wPlNLdoGN8LPHOSwgL8FHAtx9eDvwcea730BOC1wIueV/6J
              jAL3As8ClCGJcFFlPmpYMNWNBATptyr7eArwQsNHgHOmyGIYeMrmbuBTwM5KTQZ7e+g6id5AiIgo
              8FsN7zyO3E2hGzlGAerquwr474ZimrKPBqmPk1SA+sn8ouHjk1xyp1tUAAUIgbKK/LbhDdOUYwS0
              VbUChKP/PyVM1wF1ApcAfwB8Bri0IFABu3tXnyIRJpVrsjLK08s9XR6tohP8bqpUM003oRxhholO
              B9cCfwasVkvyZ04lc6kAAK8C3g/Mh6OTyczsMdcKAHAz8Ha3pQ8DWQlmlTNBAUrgd9XgjQAi0H/r
              mrmW6SeGM0EBAJYCfwxcEokgs/OWFXMt008EZ4oCAFxKUoKlAEWYziSRORWcSQoAcB3wblAJeVI4
              G5xpCgDwDvDNYx/6e1fNtTz/X3MmKsB8kqHoZ9PHgl2n10h0RrLr1pWzcp8zUQEAeoAPAavABITf
              PNcizRoFQKFiRhebZMokWkxjzj4es6UAh4BGi2l+Dvgv1JtLA/N/YuYD61w/04H10/d8A72rsU2z
              8hKblsfLstUEJ4LgfmDAyejTCrcAjy/b2Pfh/t4edveuZvnG7bMh8ulmdIrvXhfS8PePQuxdP7ni
              17uABAKR+GuGi1oVZLZ6gP2C/wQ82GK6NuA9/b09vyygYTN424WzJPJpZRfQnOS7C4BPSFwnWFIG
              Otsm+SmD5glWRuI7o3kvJ9CgZ6UHAIpnQueW8+Pwuwx3A63McLpJ9oGn2hWecKxY1BY42IizJPpp
              4QmgHzj/eF8arsB8xuIHo5E9kzuPONisNKzjBMZ/mD0FYG08HEZU3C/79+u98HktJP9pJyW4Ddi7
              5aZVLXnMnIE8RRoWJ53aGhZirpqho9YJM6urANkEsUlpG7hVrgfujFZhYPdZaiRS8scaJTnE7J9r
              eWZVAQpHDA2JPxL8VYvJBbxD8tvGhB44G+0DjXrot78BfIKZOaOcNmZVAcaVdEDSu3V838KpWAi8
              P8LPpHHx7HMi6d68I0kuVUF8UPDnQDVX8sy6ISggCoTxo4j3APtazGItyUi0Es5O/4HSAoHhgMS7
              JO4UbJ0LWWZdAZZs2EbTJgDzC39R6WG22gJeDfw+qieSc9qJnkAdbNqG6km74VAz+sMSvxzEewVf
              Fzwp2CnY1coPyfO6JWZtFTCe7o197Fnfw1AlB/HxaC49ASNRr83juPwoodli0rmna8MWtr95FfPm
              B8o0Mfx+Zf9hm8KfAkujvYBWxjjRLvh4NK9uRY45UQCAJWv72LO1B8NzEu/FrKv9+mdKO/B7qPmE
              xF+fZZ0AAKs/n7zU969fRyOOUBKwOCw43FJGgo7OohwZrp5rVYY5UwC9D3a9zRSdAeytEnfafIZk
              CZspy4APYrZI/uFcleVkWbzhRyeVfvD2NcTKBScwK57T3cAVn91OiEaGBv6m0ubPcIvZXA78V5lz
              dNbNBuaeOd8OXrqxDwNtFhIbBJ9sNQ/Dm4D/QNo7yLTAnCsA1AchU/MdRXwA+Fqr5TD8djS/dDrl
              dN3F7rnlDFt6GpxOxZ5dQ8B4Dh+KYIHpF7wbaHVgXGy4+DSK2Ga7O9pUxZljgOq/vRsZYqTTZkmr
              6c8YBVj9+acRDZTMxY8I3sPs2cqnnTs49TIvGxypwGbfb54ZbutFXAAY22uBGe2Vj1ffEA3RxJlU
              wumma+MzuD4lKPsLgv8GnLZ933QmkWHN8B42v9LVUVxcSNDoZOf6tXNaX3tuTwdohgHDWwzLpy0D
              RONR14871F4lz9H67Pu00L0pefxYisBHBJ87zbfsZ4brbsMLDP+xCCw0po1R9szAbetUs7O3h33r
              e+qu33TC623umElawUFgYOxzWXcHu5xMid2zXprj0FVbCp2E/T0lI9FVp/o+dZfXB+yAmY2fNjc3
              o0cCvD+6bXsZzOD66SeFY5tXqg4x2nYObbF5wl2uJKJNKdocuD7Ch2bS+mu2YZ4Zu3cZDUEMAN8l
              nc6ZcwTsaQQapSnxU4g7ZTYbzjuV94nRFLDbQf+AeclM0hgKm9+weHkh3415ABhk+mGkv76OtiCc
              ru7mRBqd6QTWNaJvsLnOUwflOJZvNvDetnr6V4a0/KoQX8C8hRTEYc5Zunkrg+tXYwujb0j+A8yf
              Mn0YmxkjCQvXw8xNhsUzTWtzeQWXKw2fh5haAUqLj4E/UFbzOFRVnGMzgn5HcAeT+wceV2zjNtKq
              p1VLbj/inhIdiSVUNitTBIH4uuBvTTqleybQtWE7A709BAzS/wRfavP2U5V/k1SDggcQn8P8Rqt5
              OPkoLJzuOpmlsQ7OURnabYalbpI5e1YQ/G/gu0mMpK9hxV3bx6JGHQT+kDQmnjEMHa4bltO4K/j6
              qcr7vI19Y0uihuCPBQ+dxqI8b8ifTdO14B+AD2MqBN0b0mQ7ADTr8GpBPCh4F7B7tgSbjtWff5rQ
              GEndNeySdKfgx6cq/yaRUgHDUxLvUIsBms4GlOZ3/17i6bYAjXFHdALAilobKoNdfk5wh+DxuRZ8
              jCWbdxEr1zYCPyzxTsEpOSGyYsPTNI7E19O3JH5d8FVOo/1hFqkEXwRuQTxyoBF4rgnnbz7ayR+x
              BC6vu0OFJogvS7wpiI8oDQnju6rJrIdi8klJ4CQd+Lo39WFDRFj+vxI3SXxNM/OCmXKrtHtjH8I0
              mxXA9yRuDknJHp5h/jNhQr156ro8KWrj1reDeLukXonvd7VHFpRm5V0TR/gJD6x7Yx8DvT1UEcqC
              H7UF/U4z+s+BVxmuFKwOou/Yuqw/DUr8tdKSZLzCFMB3mpXiyRZ32cZtDPSuAQeQ7w/wFsTPO0Uc
              e6EmX8E0JXZPpYHdG9OEU8lfcQ/wsSDuBl5heAXworpsJ1KKADxaSFQKlJhYFoToRwTf4NQ4hUYn
              /8ofAf8k9G3jATCS2D0UWHHX8yOcHrdODryyi8a6BUcuMPDYYDtXLW+0I1UlVJ2f3nrk+v239SCs
              UIT2scH62AdQttHceaBi7eaT77l3966hXaaq5RtpwsJ2tSsoHBF4fAkN0W5IqhaNk3sy+nt7iDZt
              dRTNytAeVJSB0pKed4+pGLvWNJCr4aHdHOxYQXcwSoEwypbymyR/GVd2c7RyVYvNiEWJWTbFIZrj
              dtnnPDAIDwwCsKt3FaOYS5aO0IhhVEpj8XiqNIBakZHJSlIRWHiKOrzlG5MmD9yylkZbg7IsaESP
              TjnGHDlHPT1jFfbjm85jRec8mlWkEV3FZC85MZxi9HaNvgDaDtEUYDdpzQYwKXJ6DsYUJRzY7yMu
              Z1NxRAF2r1/Duc1h9hcdE3eLdg+z4q+mXhRUrg2dVdpVWjoyQnn3rinT7HzreagsCUUYq59Jg0fv
              fet5NDvbn6dbDpHCBbsP9XHp5yd+N7B+zZGKf3rHXlatXEx3iyeLl5QdDFdHn3llUEwrpmWb5m61
              PGZ6dq1Urst5cLSThe0jLP70zINZB0hdnmwOFh2Qgj6/hDpucGP+jI1NJbDQwL6ODvp7e478HK/d
              FR0dFEVBkPjKgRexrGvPpBkfGDmybimATpv5hs72GFCEFfN72HXbMaHlUrcbJOafd/5iWp2D9veu
              YV4Zx2wkYyFul5sUm3cuqTfwijG3eKV9gMv2DnS0vHbRWPjyRrTag14n8UrSoYt7gb8cC78uYKRh
              OtpFAJq1e0yHAqPJsH25xDqJe2JE0Q5IHr/VOhakVvW4ZVSCX08y7gwJUFtJ16efmiDkztu7KaoF
              BPlGw3UBthsKw26buwW7jh1H647lYltXtwc2D1c+EiYdJoa7P5Zd63tYEGA0QjQvlvhVYKnguTLw
              vtGKauxWUiqVqHsISM0qHi1rUKCKqRpcCNWpoxknU5p+BpnosV7xaIHGLjNQpFZ/JXCh4C8lXRbt
              1QvbdO/+RiT46DSslIhjnywCDYxYujGdUCqblWlvCwRxA/BS4BOCnwHGvGxXCZZGeHzF4qLaNxS7
              JA4SIeIqyhXiQsyv2SwktZYng3QN8JjhyxyNQj5S11UD0Sn7SpI/3wFgC7CdZpPB9T3YMH9hG4cP
              jjLaNkR70sSFwL+WQZ+q7M5oXiNxy7ySPznc5BzSjuFTEtvqh3IReHh/w2VH0GrDRYKHSRszDN6x
              ltCIeJxiLN3QR2EYiWC4OIg7gLvqx7q8Ealq8+9PAT8QOmizCCGbQ4iiRKNVqvRzMC+O+CFLlexO
              IsOkPYd1Iegh221Ah9Ah47KyGoJCLiqriXCZ3Ga5sL7nNyMcFLzYMNg07cHeLvP4gZHU5QErSN7V
              jxk3gAswzyEOoHbCuPKWbaWwvVJwDfBHhl1LVo1+cd+ODqronw7iBptzAgztPRwPBLEums8Gcb2k
              +5v2FyTONayT2Ih5CLiRtL3aWS+r3kw6vXIl5qDEx4BVTq5fO0jHvQbHtdDVwMrhoeaDAO2HFqRq
              gBWYf25E76uv2wqsG2rSJbgZsVBwcZA+VdlvAn7d5smOoJdIdAv6kdqFv9zfuyaNn0db04HxFsYq
              uiyD3kZS4Ec6SmmoYSOWBfE2m646/x9LXCr420KsRiwI4kMWDcN1gnmV/S3BSxGvwP4z4FWIF2A/
              BPyKYIWJz5F2Br9g/JtW8y9So9DrBRcYOgQXCNoxywz/zvDDInlFX2jxnwW7g9Qd7dsFi4A3R7NT
              4mrEJ22vquwHBVsH169J4f8DQuilkn4kaVc0DGxvL6voG+pTvPcF8e0gtgn+rn75xjXA/YJLJDqj
              uQQYLQN/U6WdsZ8FfiDpq8a/CPxb4BeAfwHOj+bcaFYb2g0fBjZJPK6jr7sogM4lizqS9a8whVQC
              3YZno1kWzRttrjVsDulFCU8o9VrNpt0leFmtT58sxLO1dS9gD9f/V9Vw7empNqEjHsUSlEHnCxaC
              vmVguGmTdv/+RGlH9+4g9gjuA3Yafl5iS4CFMXqZ4SrBumjOU5Lv7Uq99wrgDXWvfLXgxtrXoYs0
              9N5YN4prST6OtxheIfF/gMNOD3wN8LTgo4XYHMQwMIS0KNp3kmwO90k8C3ytrpdXBXFDEegmHU1U
              kCh+96XnIngJYn4z+lGSweNmIIR619BwYRCfjeYZxGsFXzL6JuK1Nv+GNH4viWYf8HNKXdVjhitI
              y5x5wKMOxT2yLyO91KBU0uotwEXRbIsE193TPsTW+RcvZGjnEAThtA18W53n1SRF+2yAHYhftYmI
              tTYXAS+U+K6kKpqvSLyxfhlGJ7DS0CGpDxxDGqh3IAaQ+OAj+3n3FYupW+PVhgdqZ8vrgcvqSu0k
              GZ7+XuK7pB5kMEY2AWsMN5Du8WlSFJA31D3JFYaVgnvreD7tJL/HF5MCYFwDPAm+C/QL9fDbJuhz
              ehPKIuCeIB6W6O7qCl8aGWY0psY1D7hW4oWIfaT871nUEZ5sVO41/DCI+6K5xqYLMQreq3pJcb7h
              jnpP6BDwQGeh74xUvgy42PCPhbSjsgNwzkiM+ztCcD3WdBq2C36JNBt9oK6gy4FH67dfLAIOKVm8
              FgPLwNuEeknd2+ckniCKrk0TlzAinQCu506vredZD0rst6EZTHvUa5xCzH4VKA2NQiwHbmqaD4Yk
              S5vE95x6p61V1JNl8IR3CI2/n0SbU0SSCzBDpHJ83bBI8Brg+4X8L0iO6VDKUExhjBakMnlLQC+v
              H/7/qODZkFYSzwgGI5Qlalb4RSQL48P1uL0XGALaJYy50/BtUpCtx0KKr3C5zeu6zp33ocF9w4Bf
              Xfe6X5Jo2lwJfEtiayGVlf3yaL4XYNTwSpJF/TuCIdWuV1SmXTAP+yDJH2/CzFPjfycjBsczCfuY
              v8d/PhbbARECaioIoo/76piB9T0UElU8Oi+uKhGCkxktHPdlUW3AMsROQZywZq7FDzr+amDsyHnT
              DoW0iGRbHzm2xEEpz1hrZfTzyr8KGBH0HyvemBf/mG3K9lj0kPH12Q58wCmQxLZx+XYAXRE/UwRQ
              PDrrlzji7FEECHW9ja04JrxUSqDdt66plzITH5Rllm2YmeHE10z8rPumvr7/+m5YMv+IelgFULF8
              hveb8LBu7cERQr0279rUx+B420NdoO4NMzfc+H0wsGWin18RoVnA8hnks7t3dQpuOb5OHOneNL1l
              7mgePZDmDFcA/woMLav3aqhrrqr3R4uQHmylERRKVvzFjhnf58w54ZCZwO5be6gna0dYdnYHxspk
              MplMJpPJZDKZTCaTyWQymUwmk8lkMplMJpPJZDKZTCaTyWQymUwmk8lkMplMJpPJZDKZTCaTyWQy
              mUwm0wL/D47AvAv51j5MAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIyLTExLTE4VDA5OjAwOjQ5KzAw
              OjAw8rsBoQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMi0xMS0xOFQwOTowMDo0OSswMDowMIPmuR0A
              AAAASUVORK5CYII="
            />
          </svg>
        </div>
        
        <div style="font-size: 14px; color: #000; height: 24px;">
          功能
        </div>
        <div class="tips"><span>（Tips:点击空白处关闭弹窗）</span></div>
        <div style="max-height: calc(100% - 24px);">
          <div style="width: 100%; display: flex;">
            <div id="inly_xkxs" class="inly_buttom" style="flex:3;"><span>活动期新客蓄水</span></div>
            <div id="inly_xkxscl" class="inly_buttom" style="flex:3;"><span>新客蓄水人群策略</span></div>
          </div>
          <div style="width: 100%; display: flex;">
            <div id="inly_xkxz" class="inly_buttom" style="flex:3;"><span>活动期新客新增</span></div>
            <div id="inly_xkxzcl" class="inly_buttom" style="flex:3;"><span>新客新增人群策略</span></div>
          </div>
          <div style="width: 100%; display: flex;">
            <div id="inly_lkxs" class="inly_buttom" style="flex:3;"><span>活动期老客蓄水</span></div>
            <div id="inly_lkxscl" class="inly_buttom" style="flex:3;"><span>老客蓄水人群策略</span></div>
          </div>
          <div style="width: 100%; display: flex;">
            <div id="inly_xs" class="inly_buttom" style="flex:3;"><span>蓄水期触点贡献情况</span></div>
            <div id="inly_xscl" class="inly_buttom" style="flex:3;"><span>蓄水期人群策略</span></div>
          </div>
        </div>
      </div>
    </div>
      `;

      //添加弹窗到body节点
      $("body").append(htmlModel);
      function appendDoc() {
        let like_comment;
        setTimeout(() => {
          like_comment = $("body");
          if (like_comment) {
            like_comment.append(htmlModel); //把按钮加入到 x 的子节点中
            return;
          }
          appendDoc();
        }, 1000);
      }
      appendDoc();

      //点击空白处关闭弹窗
      $("#inly_model").click(function (event) {
        _this.closeModel();
        _this.stopPropagation();
        return false;
      });

      //阻止冒泡
      $("#inly_box").click(function (event) {
        _this.stopPropagation();
        return false;
      });

      //按钮事件
      $("#inly_xkxs").click(function (e) {
        exp_xkxs();
        _this.stopPropagation();
        return false;
      });

      $("#inly_xkxz").click(function (e) {
        exp_xkxz();
        _this.stopPropagation();
        return false;
      });

      $("#inly_lkxs").click(function (e) {
        exp_lkxs();
        _this.stopPropagation();
        return false;
      });

      $("#inly_xkxscl").click(function (e) {
        exp_xkxscl();
        _this.stopPropagation();
        return false;
      });

      $("#inly_xkxzcl").click(function (e) {
        exp_xkxzcl();
        _this.stopPropagation();
        return false;
      });

      $("#inly_lkxscl").click(function (e) {
        exp_lkxscl();
        _this.stopPropagation();
        return false;
      });

      $("#inly_xs").click(function (e) {
        exp_xs();
        _this.stopPropagation();
        return false;
      });

      $("#inly_xscl").click(function (e) {
        exp_xscl();
        _this.stopPropagation();
        return false;
      });
    }
  }

  //初始化弹窗组件
  const inly_Model = new inlyModelComponent();

  let aadvid = getQueryVariable("aadvid"),
    brand_id = brands.brand_id;

  function appendDoc() {
    let like_comment;
    setTimeout(() => {
      like_comment = document.getElementsByClassName(
        "backHeader-hgTQPa"
      )[0];
      if (like_comment) {
        like_comment.append(buttom); //把按钮加入到 x 的子节点中
        return;
      }
      appendDoc();
    }, 1000);
  }
  appendDoc();

  //query参数获取
  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return false;
  }

  //fetch请求封装
  async function fetchFun(url, data = {}, requestOptions = getRequestOptions) {
    const urlData = Object.keys(data)
      .map((v) => `${v}=${data[v]}`)
      .join("&");
    try {
      const response = await fetch(`${url}?${urlData}`, requestOptions);
      const result_1 = await response.text();
      return JSON.parse(result_1);
    } catch (error) {
      return console.log("error", error);
    }
  }

  //活动期转化分析
  async function fetchData_hd(i, data) {
    let requestData = await fetchFun(
      "https://yuntu.oceanengine.com/yuntu_ng/api/v1/AudienceGtaHarvestAnalysis",
      { ...data, card: i }
    );
    let res = requestData.data.ax_analysis.tps;
    return res.map((v) => {
      return {
        ...v,
        trigger_point_name: `A${i}${v.trigger_point_name}`,
      };
    });
  }

  //活动期转化分析人群策略
  async function fetchData_cl(i, data) {
    let requestData = await fetchFun(
      "https://yuntu.oceanengine.com/yuntu_ng/api/v1/AudienceGtaHarvestAnalysis",
      { ...data, card: i }
    );
    let res = requestData.data.ax_analysis.packs;
    return res;
  }

  //蓄水期触点贡献情况
  async function fetchData_xs(i, data) {
    let requestData = await fetchFun(
      "https://yuntu.oceanengine.com/yuntu_ng/api/v1/AudienceGtaImpoundAnalysis",
      { ...data, card: i }
    );
    let res = requestData.data.ax_analysis.tps;
    return res.map((v) => {
      return {
        ...v,
        trigger_point_name: `A${i}${v.trigger_point_name}`,
      };
    });
  }

  //蓄水期人群策略
  async function fetchData_xscl(i, data) {
    let requestData = await fetchFun(
      "https://yuntu.oceanengine.com/yuntu_ng/api/v1/AudienceGtaImpoundAnalysis",
      { ...data, card: i }
    );
    let res = requestData.data.ax_analysis.packs;
    return res;
  }

  async function getData(fun, card, param, fileName, contrast) {
    let data = {
      aadvid,
      industry_id,
      brand_id,
      report_id,
      ...param,
    };
    let requestData = await Promise.all(
      card.map((v) => {
        let res = fun(v, data);
        return res;
      })
    );
    let option = requestData.map((v) => {
      return {
        sheetName: "",
        sheetData: v,
        sheetHeader: Object.keys(contrast),
        sheetFilter: Object.values(contrast),
        columnWidths: [], // 列宽
      };
    });
    toExcel(fileName, option);
  }

  function toExcel(e, data) {
    let option = {};
    option.fileName = e; //文件名
    option.datas = data;
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
    loadingMsg.close();
  }

  function userClick() {
    inly_Model.showModel();
  }

  function exp_xkxs() {
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    let fileName = "活动期新客蓄水";
    let param = {
      gta_type: 1,
      analysis_type: 1,
    };
    let card = [1, 2, 3];
    let contrast = {
      触点: "trigger_point_name",
      ID: "trigger_point_id",
      曝光次数: "show_cnt",
      曝光人数: "show_uv",
      人均曝光次数: "show_avg",
      存量转化人数: "to_a4_cnt",
      存量转化率: "to_a4_rate",
    };
    getData(fetchData_hd, card, param, fileName, contrast);
  }

  function exp_xkxscl() {
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    let fileName = "活动期新客蓄水人群策略";
    let param = {
      gta_type: 1,
      analysis_type: 3,
    };
    let card = [1, 2, 3];
    let contrast = {
      人群包: "pack_name",
      人群包id: "pack_id",
      人群包量级: "cover_num",
      曝光次数: "show_cnt",
      曝光人数: "show_uv",
      人均曝光次数: "show_avg",
      存量转化人数: "to_a4_cnt",
      存量转化率: "to_a4_rate",
    };
    getData(fetchData_cl, card, param, fileName, contrast);
  }

  function exp_xkxz() {
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    let fileName = "活动期新客新增";
    let param = {
      gta_type: 2,
      analysis_type: 1,
    };
    let card = [1, 2, 3];
    let contrast = {
      触点: "trigger_point_name",
      ID: "trigger_point_id",
      曝光次数: "show_cnt",
      曝光人数: "show_uv",
      人均曝光次数: "show_avg",
      新增转化人数: "to_a4_cnt",
      新增转化率: "to_a4_rate",
    };
    getData(fetchData_hd, card, param, fileName, contrast);
  }

  function exp_xkxzcl() {
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    let fileName = "活动期新客新增人群策略";
    let param = {
      gta_type: 2,
      analysis_type: 3,
    };
    let card = [1, 2, 3];
    let contrast = {
      人群包: "pack_name",
      人群包id: "pack_id",
      人群包量级: "cover_num",
      曝光次数: "show_cnt",
      曝光人数: "show_uv",
      人均曝光次数: "show_avg",
      新增转化人数: "to_a4_cnt",
      新增转化率: "to_a4_rate",
    };
    getData(fetchData_cl, card, param, fileName, contrast);
  }

  function exp_lkxs() {
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    let fileName = "活动期老客蓄水";
    let param = {
      gta_type: 4,
      analysis_type: 1,
    };
    let card = [4];
    let contrast = {
      触点: "trigger_point_name",
      ID: "trigger_point_id",
      曝光次数: "show_cnt",
      曝光人数: "show_uv",
      人均曝光次数: "show_avg",
      购买转化人数: "to_a4_cnt",
      购买转化率: "to_a4_rate",
    };
    getData(fetchData_hd, card, param, fileName, contrast);
  }

  function exp_lkxscl() {
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    let fileName = "活动期老客蓄水人群策略";
    let param = {
      gta_type: 4,
      analysis_type: 3,
    };
    let card = [4];
    let contrast = {
      人群包: "pack_name",
      人群包id: "pack_id",
      人群包量级: "cover_num",
      曝光次数: "show_cnt",
      曝光人数: "show_uv",
      人均曝光次数: "show_avg",
      购买转化人数: "to_a4_cnt",
      购买转化率: "to_a4_rate",
    };
    getData(fetchData_cl, card, param, fileName, contrast);
  }

  function exp_xs() {
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    let fileName = "蓄水期触点贡献情况";
    let param = {
      analysis_type: 1,
    };
    let card = [1, 2, 3];
    let contrast = {
      触点: "trigger_point_name",
      ID: "trigger_point_id",
      曝光次数: "show_cnt",
      曝光人数: "show_uv",
      人均曝光次数: "show_avg",
      流转规模: "to_a3_cnt",
      流转率: "to_a3_rate",
    };
    getData(fetchData_xs, card, param, fileName, contrast);
  }

  function exp_xscl() {
    loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
    let fileName = "蓄水期人群策略";
    let param = {
      analysis_type: 3,
    };
    let card = [1, 2, 3];
    let contrast = {
      人群包: "pack_name",
      人群包id: "pack_id",
      人群包量级: "cover_num",
      曝光次数: "show_cnt",
      曝光人数: "show_uv",
      人均曝光次数: "show_avg",
      流转规模: "to_a3_cnt",
      流转率: "to_a3_rate",
    };
    getData(fetchData_xscl, card, param, fileName, contrast);
  }

})();
