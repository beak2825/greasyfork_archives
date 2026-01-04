
// ==UserScript==
// @name         Sermon Downloader
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  It downloads sermans in .sog format
// @author       Viacheslav Guk
// @match        https://branham.ru/sermons/*
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443779/Sermon%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/443779/Sermon%20Downloader.meta.js
// ==/UserScript==

const MAX_SYMBOLS_IN_STRING = 300;

const sermonDownloaderClass = 'Viacheslav-Guk-sermon-downloader';

const download = (filename, text) => {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

const format = (text) =>
  text
    .split(/\n+/)
    .reduce((prev, current) => {
      while (current.length > MAX_SYMBOLS_IN_STRING) {
        const newLine = [/.+[\.\?\!][\"]?/g, /.+[\;][\"]?/g, /.+[\,][\"]?/g, /.+[\s][\"]?/g, /.+/g].reduce(
          (p, cur) => p || current.substr(0, MAX_SYMBOLS_IN_STRING).match(cur)?.[0],
          null,
        );

        prev.push(newLine);

        current = current.substr(newLine.length).trim();
      }

      return current ? [...prev, current] : prev;
    }, [])
    .join('\n');

if (!$(`.${sermonDownloaderClass}`)?.length) {
  $('body').append(
    `<div class="${sermonDownloaderClass}" role="button" style="display: block;width: 36px;height: 36px;padding: 4px 12px;transform: rotate(270deg);border-radius: 50%;position: fixed;top: 10px;left: 10px;z-index: 9999;background: #fff;color: #000;" onmouseover="this.style.boxShadow='0 0 20px red';" onmouseout="this.style.boxShadow='';"><svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.8 6C0.800231 5.80092 0.840319 5.60391 0.917897 5.42058C0.995476 5.23726 1.10897 5.07135 1.25169 4.93264L5.97038 0.331436C6.19935 0.113323 6.50501 -0.0056885 6.8211 0.000209132C7.13719 0.00610676 7.43821 0.136438 7.65889 0.362941C7.87957 0.589444 8.00213 0.893859 7.99997 1.21017C7.99782 1.52649 7.87113 1.82921 7.64739 2.05268L3.59662 6L7.64739 9.94732C7.87113 10.1708 7.99782 10.4735 7.99997 10.7898C8.00213 11.1061 7.87957 11.4106 7.65889 11.6371C7.43821 11.8636 7.13719 11.9939 6.8211 11.9998C6.50501 12.0057 6.19935 11.8867 5.97038 11.6686L1.25169 7.06736C1.10897 6.92865 0.995475 6.76274 0.917897 6.57941C0.840319 6.39609 0.800231 6.19908 0.8 6Z" fill="#425C74"/></svg></div>`,
  );


  const year = $('span.my-1')[0].textContent.replace('-', '');
  const title = $('h4.mt-3')[0].textContent.toUpperCase();
  const translation = $('span.my-1')[2].textContent;
  const content = $('span.p-text')
  .get()
  .map(({ textContent }, idx) => `${idx + 1}. ${textContent}`)
  .join('\n');

  $(document).ready(function() {
    $(`.${sermonDownloaderClass}`).on('click', function() {
      download(`${year}-${title}.sog`, `${year}\n(${translation}) ${title}\n${format(content)}\n`);
    });
  });
}
