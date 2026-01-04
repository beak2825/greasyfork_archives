// ==UserScript==
// @name         Yiddish24 (Kol Mevaser) Download Button
// @namespace    http://tampermonkey.net/
// @version      0.3/3-28-2024
// @description  On any page opened on Yiddish24, adds a download button on the right-side of audio player for each audio on the page!
// @author       Knaper Yaden
// @match        https://www.yiddish24.com/*
// @match        http://www.yiddish24.com/*
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABILAAASCwAAAAAAAAAAAACUZ1r/lGda/5RnWv+UZ1r/lGda/5RnWv+UZ1r/lGda/5NoW/+SaF3/lGda/5RnWv+VaFv/lGhb/5RnWv+UZ1r/lGda/5RnWv+UZ1r/lGda/5RnWv+UZ1r/lGda/5NoW/+YZFT/nGFP/5VnWv+TZlr/kGFT/5JkV/+UaFv/lGda/5RnWv+UZ1r/k2hc/5NnW/+UZ1r/lGda/5NoW/+ZY1P/eHyB/2WMnv+TZlr/lmlc/6eCeP+cc2f/kWNW/5VoW/+UZ1r/lGda/5piUf+WZVf/kmhd/5JoXf+Ral//nGFQ/2GPnf8Rzv//f3Fw/6Z2aP/p4+H/3tDM/510aP+SZFb/lmZY/45sYv9rh5T/jWxk/5xhT/+dYE3/mmJS/6BdSP91f4b/HcX//4BvbP+nemz/283J/9C9t/+Zb2L/k2VY/5NoXP+bYlH/XJKp/yLA+v9KoMT/XZKo/22Gkv+Adnb/bYWR/yDC//+HamP/qHdo/9fIxP+acGP/kGJU/5VoW/+UZ1r/lGda/5piUv85rtb/Fcr//y237f8mvPf/IcD7/xvF//8iwf7/I7Pr/5CfqP/Cm5D/jWBT/5VpXP+UZ1r/lGda/5NoXP+ZY1P/gXZ1/xzE//9nipr/TJ/B/1iWsP9xg4z/IsL//0aWtv+km5r/5tbR/9G/uv+ccmb/kmRX/5RnWv+UZ1r/kWpf/51gTf9KoMD/MLXk/1aXr/8hwPb/k2hc/yq78v9te4T/tHxq/9TGw/+dc2f/kWNW/5VoW/+UZ1r/lGda/5ljU/+YZFT/hHRx/xvF//9xgov/Lbfl/02euv87rtv/UpKr/7B8a//Drqj/pH5z/5xzZ/+SZFf/lGda/5ZmWP91f4b/kWle/6BeSf8zsuP/UZu4/354ev8cxPr/I8D8/0uYt/+sd2f/3NLP/+Xb1/+acGT/kmVX/5NoXP+bYlH/NrDX/0Gozf+TaFz/NLLi/zyr0/+kW0P/WZWt/w/P//85qtD/om9h/+zn5f/p4N7/pH5z/5BhVP+TaFz/mGRU/4F2d/8gwfb/Gcf//xLM//9ijaD/m2FQ/5VmWP94foT/c3qB/6N6b/+phXv/k2ZY/5pvY/+TZVj/lGda/5NoXP+aY1L/hXJv/1Oat/9kjJ7/lWZZ/5RnWv+TaFv/mmJR/5pjUv+RZFb/kGFT/5RnWv+TZVj/lGda/5RnWv+UZ1r/k2hc/5dkVf+dYE3/m2FQ/5RnWv+UZ1r/lGda/5NoXP+TaFz/lGhb/5VoW/+UZ1r/lGda/5RnWv+UZ1r/lGda/5RnWv+TaFv/kmld/5JoXf+UZ1r/lGda/5RnWv+UZ1r/lGda/5RnWv+UZ1r/lGda/5RnWv+UZ1r/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491119/Yiddish24%20%28Kol%20Mevaser%29%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/491119/Yiddish24%20%28Kol%20Mevaser%29%20Download%20Button.meta.js
// ==/UserScript==

var $ = window.jQuery;
$('.playing-panel').each(function() {
    var dl = $(this).attr("data-song-url");
    if (dl) {
        var filename = dl.split('/').pop(); // Extract filename from URL
        $(this).prepend('<span class="dl-button" data-url="' + dl + '" data-filename="' + filename + '"><i class="fas fa-download"></i></span>');
    }
});

$('.dl-button').on('click', function() {
    var url = $(this).data('url');
    var filename = $(this).data('filename');
    if (url && filename) {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const blobUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = blobUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(blobUrl);
                document.body.removeChild(a);
            })
            .catch(error => {
                console.error('Error downloading file:', error);
            });
    }
});