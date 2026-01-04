// ==UserScript==
// @name               Auto Dark Mode for Bahamut AniMad
// @name:zh-TW         巴哈姆特動畫瘋自動黑暗模式
// @description        Automatically switch the theme between light and dark, based on the browser’s color scheme preference.
// @description:zh-TW  根據瀏覽器的佈景主題設定，自動從明亮和黑暗模式間切換。
// @icon               data:image/webp;base64,UklGRnIGAABXRUJQVlA4IGYGAAAQJACdASqQAJAAPtFgq08oJaQjKRZJyQAaCWIAyQkF1ckHPnn7vRb/lN2bzrPox3lj0JfOu/8vtBf5vJOcFaWuCGZXwp+wWwb4kSvAx0Stzc/nhJy1R+DmnYyGUE5MUW5CTcSPgmEoHm5PNAswIWJqRvZcCsqM09J40EvQ3+KbIBUcRNyNoGIjaRtT2IBuSIq84MhK8qyb1BHXapW7qGN3yukKcVzx5eHhstVndRw9UXA4o3plAht9vHztfXsixnFh+YUQmUxga9qKoVUQnPGF0IYbaZs9l1j/hzHlOR9UQapayFu4BMKtMYGwpCnlySRf4vXabKrlVNQrdBtr6YdzQ2yzPYJW3snJVL+dE4olMjCKaJaJF9EaUdWqAovIVf0dk+EV3S8rYTgA/vOHfjlvU/nYGpVr22WF+MgTnueJhRdeHjOiWiXtcb9xRJjsPpPQazgy626q204miS3XN0OVQ2tZZ9ocpyMPkHOQB8AyCVyach11k77FS9ayU2HzveJmun4Ajw6e8eGOd2pxgfuVVPcncLVX0ezEyXyh1S3DkNhYmOTUCRh/eYc2jWvZ8Yx/JGYtO3sB21dUJUCTIFLhEgL+LO1m6lHVQijQuEGmiViIKjWVDVOg7i6tI2W3JSaM1LSVTTXsSgszRtR+0Cpl3Jtz84AIJOQf8C+gFOBEDYt23WLtj/N+56TvFfHsODtSQCZMjxzIEVnEK0UUyxHz7hkjhtzgkO6fIXQCLhZdaows67Z3YvM/24CYTvOLAXv6l0I/kHXGcmK/V+Zpi4Oi2/QkZuxO9irjh/UWdBwhlEm0RcTk1a6hiJJfG0fhSROBYX5XY7mOObU77eZiNcTBNGzHESkzNkiMDXdcUClO7C1PQYhionM5IxQ9AdH4zxelj/MY2GqzSawX1W+OA7PZdO0ty1Zt/2TLFtLc7ZC1cfS/PxDQqNX6ePDt+kb3Y/8FNs37aoJjytnjIukAbDRN1OEBTG/v89LqqhGI1nUFDbPzl27Zq1r7aGQk5YRPccKYL6SZ2jAaGABESm2Eh1ZOlBLbX+77+RTLwiFPWDX1w68fBWurXWdoXfQTP0qeU29947rzC/1NJj04a8v2p8OAee3F0xIyPmhqCfhJM0Q/e7jlpLwgcsaJTPSFGfgeT+Zgw6+W7kzMTVOXVMZPmAd/4hyciRQCg8yXIvZJeeCCZHDxMW6R8kFmS7oAXjcfhNnM724+PdoohurjrcgNj7RTXM7CDmiUBqJBMqwBxW662hknXe7b9Dc2dm0HYDOI4pWmJxv1FXCPJ6+auqz9LaDQZPFcUHCd7JEThv73+vYMCgUyY9TKw7juAHB2ou/k/MXVgkg9Hc1WnKcVn3NtMt8ncJo562jFXwIJRFg3jayfQp9aQ+lDcnJjqe5ZG+JOLoTInmMz6/eSvhVJDP3gtuyVtzb/XdopQ9QS981Tibx/RW6+n3q6ZdA4S8FvK1dGcOsgvincoHjW+EseSj66/0Hc3G660aZ0aQ0vVfRAeoIXQ1UfpGYlx9ZuqI+Wr8L5N30b5LYju+yTY+vWxJKRUDHeSreg1BWczgvVX31KAK9pWbruly6jiYHnlWQfMN9wOH0bOIuUS5X1oTTk3Xrmiq6YsbXFs2RDWk0DCvS/A+ay3too9TLfFtd+DwPmh0WXqUClw+FRAuYGg621Pr93wpFgkwV8fzgb1g0DXQ929uJajz2FZDcuCquT9XUMaR8ld/m+hYVLkq6j3/niCGDjzy8ADlE3zF0atPMVcFsv6At9vH+KsQ0Hs5jVt1eWtCBrT9C0haBFtFBPwqA3tD1Q+LRqntivxPc02R8jeaRLBWTtkImiEH/RNSbwBhwobnIuI2wk3KpBmNseuYPJJObF+4J540Brt4j+/Cr8YmyoAIPR0n/1NMgXKnpvNEybiAc1Nj6KQ8DJJ/OZV2FMH//xBJnNK1pOoNoQG6/1v3E4oOXlixvHCLeHPNq2bPqwzn3woNpwA/8B89Wnm1fFc/AUjR93HbazWcYlqjdWa1QyOdkqUoir8ebMuoscHryVxXuGd/nBj8VqqxMXy49y6ZLkDF7QpVx7Bh/Fp4EkUGGv9otl+SNPOYprnrl5IiSEV8vkfEVvW+r/6HI+Xy4N3m3bTuK479C4VGVFDg++01OmIS7gCP2JSFjMO+FDTU2FoAc5VResCSAAAAA=
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.0.6
// @license            MIT
// @match              https://ani.gamer.com.tw/*
// @run-at             document-idle
// @grant              none
// @supportURL         https://greasyfork.org/scripts/447811/feedback
// @downloadURL https://update.greasyfork.org/scripts/447811/Auto%20Dark%20Mode%20for%20Bahamut%20AniMad.user.js
// @updateURL https://update.greasyfork.org/scripts/447811/Auto%20Dark%20Mode%20for%20Bahamut%20AniMad.meta.js
// ==/UserScript==

const toggle = document.getElementById("lightSwitch");
const query = matchMedia("(prefers-color-scheme: dark)");

query.addEventListener("change", updateTheme);
updateTheme(query);

function updateTheme({ matches: isDarkMode })
{
    if (toggle.checked !== isDarkMode)
    {
        toggle.click();
    }
}
