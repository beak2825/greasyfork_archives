// ==UserScript==
// @name         File Operator
// @description  Operate files (multiple, resize etc.)
// @version      1.1
// @author       Secant(TYT@NHD)
// @include      http*://www.nexushd.org/attachment.php*
// @include      http*://v6.nexushd.org/attachment.php*
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/browser-image-compression@latest/dist/browser-image-compression.js
// @grant        none
// @icon         data:image/x-icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AOFvIgDhbyIA4W8iAOFvIgDhbyIA4W8iAOFvIhrhbyJ54W8ik+FvImThbyIx4W8iDuFvIgDhbyIA4W8iAOFvIgD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A4XAiAOFwIgDhcCIA4XAiAOFwIgDhcCIY4G4h195pH//daB7/3mkf/95qH/7fbCDk4G4huuFwIoXhcCJS4XAiI+FwIgb///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wDicSQA4nEkAOJxJADicSQA4nEkAOJxJHnfayH/3Wgg/91oIP/daCD/3Wgg/91pIP/eaSH/3moh/99rIf/fbCL64G4j1+FwI6ricSR14nEkQOJxJBj///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AOJzJQDicyUA4nMlAOJzJQDicyUA+uXX6//////////////////////////////////////eayL/3msi/95rIv/ebCL/32wj/99tI//gbiP/4G8k8OFxJMv99O/y//////ro25nicyUM////AP///wD///8A////AP///wD///8A43UnAON1JwDjdScA43UnAON1Jwfzx6jw99vJ///////////////////////55Nf/99vJ/99uJf/fbiX/324l/99uJf/fbiX/324l/99uJf/fbiX/77eS////////////8LmU/uFyJuTicye743UnieN1J0rjdScG////AP///wDkdykA5HcpAOR3KQDkdykA5HcpLOJ0KPzgcij/7rCG////////////8LmU/+ByKP/gcij/4HIo/+ByKP/gcij/4HIo/+ByKP/gcij/4HIo/+SEQ//////////////////wuZT/4HIo/+BzKP/hcyj/4nQo/+N3KaTkdykB////AOR5KwDkeSsA5HkrAOR5KwDkeStY4nYr/+F1K//jfjj////////////pmGD/4XUr/+F1K//hdSv/4XUr/+F1K//hdSv/4XUr/+F1K//hdSv/+N3L//////////////////C6lf/hdSv/4XUr/+F1K//hdSv/4ncr/+R5K1T///8A5XssAOV7LADleywA5XssAOV7LI3jei7/4nku/+J5Lv///////////+mbYv/ieS7/4nku/+J5Lv/ieS7/4nku/+J5Lv/ieS7/4nku/+ujcP//////////////////////8byX/+J5Lv/ieS7/4nku/+J5Lv/jei7/5XssdP///wDlfS4A5X0uAOV9LgDlfS4A5X0vwuN8Mf/jfDH/43wx////////////6p1l/+N8Mf/jfDH/43wx/+N8Mf/jfDH/43wx/+N8Mf/lhD7//O/m///////////////////////xvpj/43wx/+N8Mf/jfDH/43wx/+R8MP/lfS5P////AOaAMADmgDAA5oAwAOaAMBPlgDLm5IA0/+SANP/kgDT////////////roGf/5IA0/+SANP/kgDT/5IA0/+SANP/kgDT/5IA0//PIp//////////////////9+PP///////LAmv/kgDT/5IA0/+SANP/kgDT/5YAy9uaAMB////8A54IyAOeCMgDngjIA54IyN+aDNv/lhDj/5YQ4/+WEOP///////////+yjav/lhDj/5YQ4/+WEOP/lhDj/5YQ4/+WEOP/qm13/////////////////99nB//nhzv//////8sKc/+WEOP/lhDj/5YQ4/+WEN//mgzTQ54IyAv///wDnhDQA54Q0AOeENADnhDRs5oc5/+aIO//miDv/5og7////////////7KZs/+aIO//miDv/5og7/+aIO//miDv/5og7//niz/////////////748//pl1T/+eLP///////zxJ3/5og7/+aIO//miDv/5oc6/+eFNaX///8A////AOiHNgDohzYA6Ic2AOiHN57niz3/54w+/+eMPv/njD7////////////tqW7/54w+/+eMPv/njD7/54w+/+eMPv/wt4f/////////////////88af/+eMPv/548////////PGn//njD7/54w+/+eMPv/nizz/6Ic2bv///wD///8A6Ik4AOiJOADoiTgA6Is7z+iOQf/oj0L/6I9C/+iPQv///////////+6rcf/oj0L/6I9C/+iPQv/oj0L/6ZZO//749P////////////zx6P/oj0L/6I9C//nj0P//////9Meh/+iPQv/oj0L/6I9C/+iMPv/oiTg6////AP///wDpizoA6Ys6AOmLOh7pj0D06ZNF/+mTRf/pk0X/6ZNF////////////7650/+mTRf/pk0X/6ZNF/+mTRf/317r/////////////////7650/+mTRf/pk0X/+uTR///////0yaL/6ZNF/+mTRf/pk0T/6Y8/7OmLOhf///8A////AOqNPADqjTwA6o08SOqTRP/qlkj/6pZI/+qWSP/qlkj////////////vsHb/6pZI/+qWSP/qlkj/77B2//////////////////fYu//qlkj/6pZI/+qWSP/65dL///////XLpP/qlkj/6pZI/+qVR//qjz/G////AP///wD///8A6o8+AOqPPgDqjz5665dI/+uaS//rmkv/65pL/+uaS/////////////CzeP/rmkv/65pL/+uaS//77N7////////////++fT/7KBW/+uaS//rmkv/65pL//rm0///////9c2l/+uaS//rmkv/65hI/+qQP5D///8A////AP///wDrkUAA65FAAOuTQrLsm0z/7J1O/+ydTv/snU7/7J1O////////////8bZ6/+ydTv/snU7/9Mic//////////////////TInP/snU7/7J1O/+ydTv/snU7/+ufT///////2zqf/7J1O/+ydTv/smUn/65FAYP///wD///8A////AOuSQQDrkkEJ7JdH2u2eT//tn1D/7Z9Q/+2fUP/tn1D////////////yt3z/7Z9Q/++rZv/++fX////////////87d//7Z9Q/+2fUP/tn1D/7Z9Q/+2fUP/759T///////bPqP/tn1D/7Z9Q/+yZSf/rkkEt////AP///wD///8A7JRDAOyUQyjtnEz87qJT/+6iU//uolP/7qJT/+6iU/////////////K5fv/uolP/+uLK//////////////////K5fv/uolP/7qJT/+6iU//uolP/7qJT//vo1f//////99Gp/+6iU//uoVL/7ZlJ3uyUQwv///8A////AP///wDtlkQP7ZZEWe6gUP/vpVb/76VW/++lVv/vpVb/76VW////////////87yA//O8gP/////////////////42LX/76VW/++lVv/vpVb/76VW/++lVv/vpVb/++nV///////30qv/76VW/++jU//tmUi1////AP///wD///8A////AO2YRzTumkqM76VW//CpW//wqVv/8Klb//CpW//wqVv////////////0v4T//fXr/////////////vr1//GuZf/wqVv/8Klb//CpW//wqVv/8Klb//CpW//76tb///////jUrf/wqVv/76VW/+2YSIH///8A////AP///wD///8A7ZpKT+6eTqzvqFv/8Kxf//CsX//wrF//8Kxf//CsX/////////////vq1//////////////////2y5v/8Kxf//CsX//wrF//8Kxf//CsX//wrF//8Kxf//vq1///////++rX//CsX//vplj/7ZpKSv///wD///8A////AP///wDunEwf7pxMbPCnWv/xrmL/8a9j//GvY//xr2P/9cOK/////////////////////////////OvY//GvY//xr2P/8a9j//GvY//xr2P/8a9j//GvY//0voD//vr2///////++vb/87h2/++mWPXunEwj////AP///wD///8A////AO6dTgDunU4B7p1OlO+mWfzwql7/+Nu6//zw4v/////////////////////////////////0wIP/8bFm//GxZv/xsWb/8bFm//GxZv/2zqD//PHj///////////////////////++vb//Ovb9f/9/DH///8A////AP///wD///8A7p5QAO6eUADunlAA7p5QJO6eUFP64szM/O3f7vvr2fn76tf/++rY//vr2f/869n/+Ni0//Gyaf/xsmn/8bJp//Gyaf/xsmn/8bJp//bPof/87Nr//Oza//zs2v/87Nr//Oza//vr2f/87+Ho////MP///wD///8A////AP///wDun1IA7p9SAO6fUgDun1IA7p9SAO6fUgDun1IA7p9SDe6fUjTun1Jm76FUme+lWszwqV7x8axi//GuZf/xsGj/8rJq//K0a//ytGz/8rRs//K0bP/ytGz/8rRs//K0bP/ytGz/8a5k/+6fUnL///8A////AP///wD///8A////AO6fUwDun1MA7p9TAO6fUwDun1MA7p9TAO6fUwDun1MA7p9TAO6fUwDun1MA7p9TAO6fUxnun1NC7p9Td++jWKzwp13Y8Kth+/GuZf/xsGj/8rJq//K0bP/ytW7/8rVu//K0bP/wqmD+7p9TMv///wD///8A////AP///wD///8A7qBUAO6gVADuoFQA7qBUAO6gVADuoFQA7qBUAO6gVADuoFQA7qBUAO6gVADuoFQA7qBUAO6gVADuoFQA7qBUAO6gVAbuoFQl7qBUVO+hVYfvpVu88Klg5vCtZP/xrmb/8Kph/u6gVIL///8A////AP///wD///8A////AP///wDuoFQA7qBUAO6gVADuoFQA7qBUAO6gVADuoFQA7qBUAO6gVADuoFQA7qBUAO6gVADuoFQA7qBUAO6gVADuoFQA////AP///wD///8A////AP///wDuoFQO7qBUNe6gVFnuoFQu////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A//////9////8A////AA///gAAH/4AAAP+AAAA/gAAAPwAAAD8AAAA/AAAAPwAAAD8AAAA+AAAAfgAAAH4AAAB+AAAAfgAAAHwAAAD8AAAA/AAAAPwAAAD4AAAA+AAAAfwAAAH8AAAB/4AAAf/8AAP//+AD///+A///////////8=
// @namespace    https://greasyfork.org/users/152136
// @downloadURL https://update.greasyfork.org/scripts/36435/File%20Operator.user.js
// @updateURL https://update.greasyfork.org/scripts/36435/File%20Operator.meta.js
// ==/UserScript==
/* global imageCompression */
(function($) {
  'use strict';

  Array.prototype.imap = function (fun, hook, int) {
    let i = 0;
    let progress = 0;
    const length = this.length;
    const newArray = this.slice();
    return new Promise((resolve) => {
      if (length === i) {
        resolve(newArray);
      }
      const trigger = setInterval(async () => {
        newArray[i] = fun(this[i]);
        newArray[i].then(() => {
          ++progress;
          hook(progress/length);
        });
        if (i < length - 1) {
          ++i;
        }
        else {
          clearInterval(trigger);
          resolve(newArray);
        }
      }, int);
    });
  }

  function updateProgress(percentage) {
    $('[name="submit"]').val(`${(percentage*100).toFixed(1)}%`);
  }

  async function file2DataURL (file) {
    const reader = new FileReader();
    return new Promise(resolve => {
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }

  async function imageResize (file, w, h, enlarge = true) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const dataURL = await file2DataURL(file);
    const img = new Image();
    return new Promise(resolve => {
      img.onload = () => {
        const ow = img.width;
        const oh = img.height;
        if (w && !h) {
          if (ow <= w && !enlarge) {
            resolve(file);
          }
          h = w / ow * oh;
        }
        else if (!w && h) {
          if (oh <= h && !enlarge) {
            resolve(file);
          }
          w = h / oh * ow;
        }
        else if (!w && !h) {
          resolve(file);
        }
        canvas.width = w;
        canvas.height = h;
        context.drawImage(img, 0, 0, w, h);
        canvas.toBlob((blob) => {
          const newFile = new File([blob], file.name, {type: file.type});
          canvas.remove();
          resolve(newFile);
        }, file.type, 1);
      }
      img.src = dataURL;
    });
  }

  function focusInsert (myValue) {
    const target = $("#compose textarea", window.parent.document)[0];
    const start_pos = target.selectionStart;
    const end_pos = target.selectionEnd;
    target.value = target.value.substring(0, start_pos) + myValue + target.value.substring(end_pos, target.value.length);
    target.selectionEnd = start_pos + myValue.length;
    target.focus();
    return true;
  }

  if(document.URL.match(/attachment\.php/) && window.parent.location.href.match(/comment|upload|fun|edit|forums|sendmessage\.php/)) {
    const maxSize = $('[name="file"]').attr('multiple', true).parent()[0].textContent.match(/([\.\d]+) MB/)[1];
    // const maxNum = parseInt($('font[color="red"]').text());
    const limitWidth = 1920;
    const $altSize = $('[name="altsize"]');
    $altSize.attr('title', `大小限制以内，宽度${limitWidth}px以内`)[0].nextSibling.textContent = '按需压缩 ';
    $('form').on('submit', async (e) => {
      e.preventDefault();
      const inputElements = $(e.currentTarget).next().find(':input').prop('disabled', true);
      e.currentTarget.disabled = true;
      let files = e.target[0].files;
      let BBCodeList;
      const MB = 1048576;
      BBCodeList = await Promise.all(await Array.from(files).imap(async (f) => {
        if ($altSize[0].checked && f.size/MB > maxSize && f.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
          f = await imageResize(f, limitWidth, null, false);
          if (f.size/MB > maxSize) {
            f = new File([await imageCompression(f, {
              maxSizeMB: maxSize,
              useWebWorker: true,
              maxIteration: 10
            })], f.name, {type: f.type});
          }
        }
        const formData = new FormData();
        formData.append('file', f);
        const attaPost = await fetch('attachment.php', {
          method: 'POST',
          body: formData
        });
        if (!attaPost.ok) {
          return `${f.name} 上传发生错误：${attaPost.status} ${attaPost.statusText}`;
        }
        else {
          const attaData = await attaPost.text();
          const BBCodeMatch = attaData.match(/\[attach\][\S\s]+\[\/attach\]/);
          if (BBCodeMatch) {
            if (f.type.slice(0, 5) === 'image') {
              const formData = new FormData();
              formData.append('body', BBCodeMatch[0]);
              const prevData = await fetch('preview.php', {
                method: 'POST',
                body: formData
              }).then(e => e.text());
              const imgURLMatch = prevData.match(/src="(\S+)\.thumb.jpg"/);
              if (imgURLMatch) {
                return `[img]${imgURLMatch[1]}[/img]`;
              }
              else {
                return BBCodeMatch[0]
              }
            }
            else {
              return BBCodeMatch[0];
            }
          }
          else {
            return `${f.name} 上传发生错误：${attaData.match(/<span class="striking">(.+?)<\/span>/)[1]}`;
          }
        }
      }, updateProgress, 1000));
      $('[name="submit"]').val('上传');
      const left = await fetch('attachment.php').then(e => e.text()).then(e => e.match(/<font color="red">(\d+)<\/font>/)[1]);
      $('font[color="red"]').text(left);
      inputElements.prop('disabled', false);
      return focusInsert(BBCodeList.join('\n\n'));
    });
  }
})(window.$.noConflict(true));