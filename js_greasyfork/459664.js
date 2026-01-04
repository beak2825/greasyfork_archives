// ==UserScript==
// @name               Auto Dark Mode for AniList Submission Manual
// @name:zh-TW         AniList 投稿指引自動黑暗模式
// @description        Automatically switch the theme between light and dark, based on the browser’s color scheme preference.
// @description:zh-TW  根據瀏覽器的佈景主題設定，自動從明亮和黑暗模式間切換。
// @icon               data:image/webp;base64,UklGRg4EAABXRUJQVlA4WAoAAAAIAAAAfwAAfwAAVlA4IDQDAADQEwCdASqAAIAAPpFAmkqlo6IhqZUZELASCWUGh6L/3tJpslTxm0JPmA/UDqH/rh+M3GUegBNd3fMGB2bJgSuZHFytz3Kiy8SYFuBz93mXq89PHtqHZfSz3VL9MtmW5wOl/BVyUsoTLAyxJVu2/mUueOjpe5sJwHZE/oumqQTFAAuI+v0YnXMTElRm/p/u0DFSStLXt4z2pp9lcxFwyOXAecJ6sHF9gAD+8LWr90V3xK2IkZYRqaqm9lRkOSn8l2YzmFFZ/XMzGbEl7lffQlJlkWUI2Oznn05nRb7j2IBLkg4Cyb/gC+q5uzbQ0N2BSNmlROi383C8Cb1KL9KTLSxRXTLcri670WrdUBJC5t6BkjvOkgA/RHAcXj8bU0gSjJbsUwYE+HkAElnlfi8NgxJad1iYgtADsutcNTr8Gjtph7GguB4NifbFJyGnj+NhE+5r53gcd/OVNP97FYSLwjq4CPJP64iBeN8fScWC9Bx0x7K255ArY4BiRcAZKgpMch4zf69GtHdBVVXAQ1UPsrqTy8cr0URGeXR+ABXOEkdZeKtCdIocEcEgh9Jq4ifeWra4kWVjzo5mOktKXtTx9mfzKmJsb3XfDblzfjVHK3fX0su8tliKNwwpCacx4bBhT2DGdbFsUKsjv7XucTT3Z0VjcEs8YA6vHkRzZHqLutKftc4dFcrGlhaDn6bnwlJQu//purvJgJBBMQWj5DUF4U7iYkk4xBRaLVsT3nPQxW2CsPICa6z856x0cC20LULLySvh/rJZsR598TUsseM9w9n3PleVk2CDNx5ixO239HMEcfrAJIOwns7e+6hqvpYOkC9wTL6yj2KeKYu4FYXj8J9WFDPb/hypxvWoqh7r0/T/w3n39Ugxv5/LPYzbnUWx7PokSdPMu1Uvl7WR5UJ9mylr7lUrZgqOqpDSEgq/kzLkUdntdxrYdqbrUVdnF1z1aa+Yv8Jj+n8OcQea0TovY7YS6smY6rS0rebKRPu/4U3N13rhPSIPEXnWXcPRpHZsrVJGQjJaDD32wboKWmDlD1J4gPf0OD1Y9VhBeVRF64uEjzNI8id94k7lHXmqS+KkPnfgAAAARVhJRrQAAABJSSoACAAAAAYAEgEDAAEAAAABAAAAGgEFAAEAAABWAAAAGwEFAAEAAABeAAAAKAEDAAEAAAACAAAAEwIDAAEAAAABAAAAaYcEAAEAAABmAAAAAAAAAEgAAAABAAAASAAAAAEAAAAGAACQBwAEAAAAMDIxMAGRBwAEAAAAAQIDAACgBwAEAAAAMDEwMAGgAwABAAAA//8AAAKgBAABAAAAgAAAAAOgBAABAAAAgAAAAAAAAAA=
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            2.0.1
// @license            MIT
// @match              https://submission-manual.anilist.co/*
// @run-at             document-end
// @inject-into        page
// @grant              none
// @supportURL         https://greasyfork.org/scripts/459664/feedback
// @downloadURL https://update.greasyfork.org/scripts/459664/Auto%20Dark%20Mode%20for%20AniList%20Submission%20Manual.user.js
// @updateURL https://update.greasyfork.org/scripts/459664/Auto%20Dark%20Mode%20for%20AniList%20Submission%20Manual.meta.js
// ==/UserScript==

const isGreasemonkey = (GM.info.scriptHandler === "Greasemonkey");

if (isGreasemonkey)
{
    window.onLight = window.eval("onLight");
    window.onDark = window.eval("onDark");
}

const query = matchMedia("(prefers-color-scheme: dark)");

function toggle()
{
    query.matches ? onDark() : onLight();
}

if (isGreasemonkey)
{
    exportFunction(toggle, window, { defineAs: "toggle" });
}
else
{
    window.toggle = toggle;
}
