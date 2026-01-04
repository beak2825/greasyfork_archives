// ==UserScript==
// @name         Rizz Your Waifu 
// @version      1.8.5
// @author      me
// @description  auto swiper/message swiper
// @match        https://beta.character.ai/*
// @match        https://plus.character.ai/*
// @match        https://old.character.ai/*
// @match        https://character.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=character.ai
// @grant        none
// @run-at      document-start
// @namespace https://greasyfork.org/users/1436344
// @downloadURL https://update.greasyfork.org/scripts/527291/Rizz%20Your%20Waifu.user.js
// @updateURL https://update.greasyfork.org/scripts/527291/Rizz%20Your%20Waifu.meta.js
// ==/UserScript==

(function() {
    const HIGHLIGHT_DEFAULT_COLOR = "red"; //Ex: red, #FFFFFF, rgba(255,255,255);
    const DEFAULT_STORAGE = "__RYW";

    //CAI has a lot of trackers now
    const NO_ERROR_REPORTING = false;
    const NO_TRACKING = true;
    const NO_MONITORING = true;

    const B64_BONK_AUDIO = "data:audio/mp3;base64,SUQzBAAAAAABBlRYWFgAAAASAAADbWFqb3JfYnJhbmQAaXNvbQBUWFhYAAAAEwAAA21pbm9yX3ZlcnNpb24ANTEyAFRYWFgAAAAgAAADY29tcGF0aWJsZV9icmFuZHMAaXNvbWlzbzJtcDQxAFRTU0UAAAAPAAADTGF2ZjYwLjE2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAABRAAAmswAICg0QEhIVGBodHSAiJSgoKi0wMzU1ODs9QEBJT1RZWV1iZmtrb3R4fYKChomMj4+RlJeZmZyfoaSkp6qsr7KytLe6vLy/wsTHx8rMz9LS1dfa3d/f4uXn6urt7/L19ff6/f8AAAAATGF2YzYwLjMxAAAAAAAAAAAAAAAAJAZAAAAAAAAAJrONloY5AAAAAAAAAAAAAAAAAAAAAP/7EGQAD/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZCIP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBkRA/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGRmD/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZIgP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBkqg/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTMD/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZN2P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk3Y/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTdj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZN2P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk3Y/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTdj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZN2P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVCIdCgDAQDDBAAAA/4xGB5QZND/xR3DytTOFP+rbDirNt5gD/+xBk3Y/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAAQ5/y0dwXj/C+Gwlg8P/BaBMCUL44//1EozMn//x6GiBKM7/8TqDAAZEA4CAhEYaFhH4AMAiI0wfDJ4tNOgoxYUTcOEMf/7EGTdj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABEA5CwywFDHw2NzPMweGjAIHLtmXiwY4AxidRmIxWXVXQaegmVjZkqoZ7AFAWgiXeNA5qKaaKdmttAADwYE3U+26RkHH//sQZN2P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAE5jQcjqXTMNXDFlM0QrMWKViLBvdDLOzIhAHADNGlpFu8GDySL5MEl8PzkpZpeamgu6DqAYLe8KgDhMmiSYzXo3feVh//+xBk3Y/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAAQZlHuwAh9Tdv5xc61wuCOFOONJS9rwQ/H23h+9doXbni6iVjyPopgtS3fi9O7r6vtCnZhmXd///////7mGH4YfhzuF2f/7EGTdj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABGZ6JsAAEzhpqTBZkqkh5wOBoFP+D0ZlY2mIzgQkGRCGl7XHNjLs0hMRYTJaj+V1WtofKJmfMrDOpnKr1Wss0KFDVrr5//sQZN2P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAE+a7za8GudbtbfktvedVpv5z7W+c51XFv//nVaxrfOM11//8WtqucPowFR/1156xQBSkCIQTlv/AVhXM+pUCO2FoCSCP/+xBk3Y/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARYm5XheJ4RQnNlttgvqKVViYK1ilkcNnvsVbYLXBuGuSYp4CzAQQwkSPLcJSItcDLoSED7qwkxbq2AGGRMCNJ7fABOt//7EGT/gAAAAH+FAAAIAAANIKAAAQjsxSmZpoAAAAA0gwAAAE4YAKM7aJrZhAiP6CssTTXq0pikWSGl95QcqKofM1hbVXkBuUjAvcKyypyhxRGenKqkAgqRkGhDNTX/rYnZm/bdGftS//uAZP2AB3JK0m5zZAIAAA0gwAAADfjzVH23gCAAADSDgAAET8V6oGXGCbRv/AEaT5f4UQnkJL1DASqigUpZ0rSVQra2rcrdn4KtVO9UOciI25cjF22UvDCmvr7oYeVHKl3p6HdK+dwu5OqBxuKIAMrBAoaLv+AFlmDhgQoOMRy9BKBskIQORuYjcqVi2UKdCIdyrQqvKc52BwfrvfyLg68FyS0uMznDhN7DY1H/TTesa17Q+jFRNDJMTmNBWmADdAhTRy7/gBCaXiZiYKKHIiqOSVsDI8Q5HVDlFIG2BxKEWCAkaMDWzFyQgpXZVtNhQ66PSfQpXcwSzTT1U0gNitb6M+Vnv5lYxIJ8tQuoPlcA2xmAmpvAAm5KIgKoZ2aAW/WAe5vWmZNwZtGZ8rGIALkRZZQ1ilrEow2tKZ+RC5ziAvNp/ccBmOjZPj2BdqFqBsOAiK6ppuiAAsQkJSXgAJXICUQjQiA8hQUxSun/+1Bk8wDybh1X+y8ZyAAADSAAAAEKOLVZ7SRs6AAANIAAAAQy53Jk7TFwu5ImiERnDLcoNx6ExEXmlCD/BGZUa2cNrf2MUEEEkzo0OTJp9WIYisw5nRQHacwG7vAilSyDA3jQTY4iqgIWEUvfdRZVWBLYgGEcjWxd3qgcEW8apdUhRClPrTJ/wskHh3accVE5oHHmx+Y3eqqAJIyABvbgATqw1k1s09JRd7arvYdIazhuNA9ax5hBOJ2Jo2k9GHKlssjPh5y1+co39LI4Qdn1//tAZPkA8js21mtGE5gAAA0gAAABCeSbU+2M0yAAADSAAAAE3cdRXegH1LTQH0dAC7qztcLrGaEJwgYJEDlJ3LmYHYBICRFqV3lDdErzLq8wKiGgJuZcpAopRVjFsb7GeORQ8hMHn//vwJg/cv///+QqoDREYBd24AEZXNBJkc4aaahwI3Fkyn3mkKjz1dn1BfU2XKcUJjdJhErCOutZDSTdr7OR1v6iSXKWhmMeUhK1KzVnQIj/+1Bk9oDyjjbU+2kTSAAADSAAAAEJCI9NrbCtIAAAP8AAAASyqlxN2sdhIvOQRQEopQBJsylK5YEw9lOdEG6spTBWrKSIO4MhOVE5xISiutC+q9ixVjgzo8/bZHkN6yhOHTP+bgxTAiFd6ZwI/Uvb0sEKrjecF/zTOBl0NWAXHCATd+ABGlyu0cUJxNMrXtBqlS7m4OS6jn3xKUW6mKwaV2Yyb3x3U2SDu03LY/8OHwAmQiheRBnqi+Uhfmb/f////rTAARISkABSYQEC6lAY//swZP+B8jssUutpK1gAAA/wAAABCDyJUa0lDGAAAD/AAAAE38dY2jgnGyyA2ShaGRdHk7OR+LPWjidqhvIY6jKPq7f64hFlM6w7By//YCR6D4IPuZritrCJOjURSbutwDvHgADv4AAoDSuSNNHfNWRIgAdzGkDGXRJlwdycF4pUeaW40UtBUJZImbm+ZQN0rxETf/ETYxCNPu2C//tAZPaB8fkjVGtJE1gAAA/wAAABCBx1T62wqWgRAGXAAAAA0lq3ZkgrfRVAro0ADV8AkoLNmPDIPT4CaLBzI8qilUBWGoD2ygvXM0YSpQQ7C3ufNHHIRTkV390sHQd0+mKggsKtAtHQ/SpwBjgIMADt+AALAQnPSmfr5wbEvwzAHcSNQB0jFagzUaHSUzDEpEZsNbp4nj0Sv0+ywEHYJIDQkMH9QIHEhgAyXFyZ4eHAIEUs5Q7/+0Bk/QHSSi1S62krWAVjuXAAAl5I7KdNrbBp4BmPJcQAjwFrgHODYIM34ACwC8qEzKjN+IELS1w0ENIvoBoDLwEiGGf63jhrUtUVNcPrTmfzj7pss9v6Q/2JlBaxON+20h8Q0uWuDjwNBjlxjypScAJYJDECrtwAFUkXahj6pljajLBqSH2TQUusuBCbiV3NvLYzuFltok99ZbeDlUfKS7b19nG2igePuBoWEoWBK5AovpIvBf/7QGT3gfILItPrKRs6BMAZYAAAAAkUo03tMGngAAA/wAAABJLADwiALlzdWjw+Z6+bM0tBV8qZtG3MldZnmw05HbYjBAqT2q4OIsDrtWQY6KTTPxX3CS1MF/2b1oGt126Hgl7O3zWVwKdFgCTv0ABFCdizATQkA+SnLicRTEgU1DZnWZEq6dJlC6kXxHUNIdtLKS6imiH7/27CA4WYUdQOUWtWh+0+2/4ul43ASQVkBT/0AN6h//swZPkB8h8cU+tPQUoAAA/wAAABB9CJT62sqyAAADSAAAAEtJASpJ5JEHZSwNtGXj6YvDQTqDNZC5U8v16emVn2Hyaja0T9TL8tgQBAMQEuVinCoYzj3VKKFP0Ihh7VICldgBV28AEBN6ysHCBxweuMXFbOofJYX9AcRjoHspaCSPg9pQbMRxccs1Opz9k8d/374OZdLXvfrhFp//tQZPOA8mAcUvtvGXgAAA0gAAABCViZS62wyyAAADSAAAAEyZ1mhpAVHkk9TfsYAU4KHMltv8AKcGjQySSF81Yk5nYa5ZaBEbChGURwVz65e2uYasFU/zVTiCKHmUhc1zHtzYcw0K45Yktn4cyvVQpCrDLhdzVgaebpOb8AAQCna/Akc1gTzWKnwuZ3gWPi4FyQCdQQ1nis+LB6cU3920CE9LRX9Tyutkj5Do2K85EhowBWpFcyVv0yntLjCjNgxSSRr8p7wavWqOgWQC87bf/7MGT+AfI3HVN7TELIAAANIAAAAQhYdUutJQyoAAA0gAAABCRlrQxYiRRjVWrEiyape5tkcsMUqGbrFpKFSCowBFhWVDcvAAATaaLUXME8xpd7DBbnp0p6yGq58pcY8YkkZwLhQ1rZUga1h8TH1x8/wyCwqpdCybWA21tjlsAVopKJNQT4+y7ibEhQYoPy6Blll2u47KKDCgQY0v/7QGT1APIgHlLp6UNIAAANIAAAAQiwj02tMGlgAAA0gAAABOQeKKyjXB7gc2UamkxBTUUzLjEwMKqqqqqq7lAVgAAEBqgRAKAIeQtuifFPCg4JB25gT/6xaMCSREoGmICf0UxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVgAAA1mHFTEFNRTMuMTAwVVVVVVVV//tAZPkA8johUutvMUgAAA0gAAABCPB9T+yxCuAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVX/+zBk+oHx1B1S6wxCGAAADSAAAAEHNHVF7KRLIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDD/+yBk/AHxxx7O+y9BugAADSAAAAEF1Fc1p7BIoAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZPAD8NQFyckpSAAAAA0gAAABAUwDKwCAACAAAD/AAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk4I/wLADJKEAACAAAD/AAAAEAAAH+AAAAIAAAP8AAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTdj/AAAH+AAAAIAAAP8AAAAQAAAf4AAAAgAAA/wAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZN2P8AAAf4AAAAgAAA/wAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk3Y/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTdj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZN2P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk3Y/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTdj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZN2P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk3Y/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTdj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZN2P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk3Y/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTdj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZN2P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk3Y/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTdj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZN2P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk3Y/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTdj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZN2P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk3Y/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTdj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZN2P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk3Y/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTdj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZN2P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk3Y/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTdj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZN2P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk3Y/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTdj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZN2P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk3Y/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTdj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZN2P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk3Y/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTdj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZN2P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk3Y/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7EGTdj/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZN2P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xBk3Y/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==";
    const STREAMING_URL = "https://" + document.location.hostname + "/chat/streaming/";
    const CANCEL_URL = "https://" + document.location.hostname + "/chat/history/msgs/cancel/";
    const NEO_URL = "wss://neo.character.ai/ws/";
    const ANNOTATION_URL = "https://neo.character.ai/annotations/create";
    const TURNS_RGX = /https:\/\/neo\.character\.ai\/turns\/[\w-]+\//gm;

    const SENTRY_URL = "sentry.io";
    const EVENTS_URL = "events.character.ai";
    const CLOUD_MONITORING_NAME = "datadoghq";

    const E_VERSION = "1.8.4";
    const E_DATE = "23/01/2025";
    const PROTOCOL_LEGACY = "LEGACY";
    const PROTOCOL_NEO = "NEO";
    const BETA = "BETA";
    const NEXT = "NEXT";
    const fetchFn = window.fetch;
    const websocketFn = window.WebSocket;
    const sendSocketfn = window.WebSocket.prototype.send;
    const open_prototype = XMLHttpRequest.prototype.open;


    //TODO: redo all this(???
    var current_protocol = PROTOCOL_LEGACY;
    var readyqueue = [];
    var last_user_msg_uuid = null;
    var last_params = null;
    var mainelem = null;
    var lastheaders = null;
    var lastbody = null;
    var override_primary = null;
    var ishided = false;
    var allow_generating = true;
    var activerequests = 0;
    var req_version = 0;
    var okmessages = 0;
    var templates = {
        "msg": null,
        "task": null
    };
    var last_chat_id = null;
    var current_state = null;
    var warned = false;
    var highlight_words_cache = [];
    var character_cache = [];
    var user_token = null;
    var user_info = null;
    var char_id = "";

    /*Chat2 support*/
    var neo_socket = null;
    var neo_waiting_for_turn = false;
    var neo_waiting_for_delete = false;
    var neo_payload_origin = "null";
    var neo_capture_next_request = false;
    var neo_captured_next_request = "";
    var neo_readyqueue = [];
    var neo_requests = new Map();
    var neo_last_request_id = null;
    var neo_last_candidate_id = "";
    var neo_last_turn = null;
    var neo_swiper = null;
    var neo_sended = false;
    var neo_ignore_delete_prompt = false;
    var custom_prompt = null;
    var auto_stopped = false;
    var websocket_captured = false;

    //RYW SE Variables
    var candidate_cache = [];
    var waiting_request_id = "";
    var pending_payload = null;
    var task_controller = null;
    var confuser_level = 0;
    var injected_last = null;
    var ignore_delete = false;
    var neo_last_chosen_turn = null;
    var turns_since_last_inject = 0;
    var rgx_str_v2 = /\<h(\d+)>/;
    var kvp = new Map();
    var references = new Map();
    var references_compare = new Map();
    var last_turn_update_index = 0;
    var last_turn_update_was_changed = false;
    var enable_turn_changer = true;
    var warn_changes = true;

    //*** CODE FROM CHARACTER SELECTOR, THIS WILL BREAK WHEN OLD SITE RIP ***
    var characters_in_chat_cache = [];
    var selected_character_id = "";
    var modal = null;
    var dropdown = null;
    var watchdog = null;

    class ProfilePhotoWatchdog {
        constructor() {
            this.dom = null;
            this.observer = null;
            this.initialized = false;
            this.firstcheck = false;
            this.nodes_to_analyze_later = [];
            setTimeout(this.tryInit, 1);
        }

        tryInit() {
            try {
                var self = this;
                this.dom = document.querySelector(".chat2");
                if (this.dom == undefined || this.dom == null) {
                    setTimeout(this.tryInit, 10);
                    return;
                }

                let thisElement = this.dom.querySelector(".inner-scroll-view");

                if (thisElement == null) {
                    setTimeout(this.tryInit, 10);
                    return;
                }

                this.dom = thisElement;

                this.observer = new MutationObserver(function (e) {
                    e.forEach(function(record) {
                        if (record.addedNodes.length > 0) {
                            for (let i = 0; i < record.addedNodes.length; i++) {
                                let item = record.addedNodes[i];
                                watchdog.analyzeNode(item);
                            }
                        }
                    });
                });

                this.observer.observe(thisElement, { childList: true });
                this.initialized = true;
                this.firstTreatment();
            } catch (ex) {
                setTimeout(this.tryInit, 3000);
            }
        }

        firstTreatment() {
            if (!this.firstcheck) {
                let nodes = this.dom.childNodes;
                for (let i = 0; i < nodes.addedNodes.length; i++) {
                    let node = nodes[i];
                    this.analyzeNode(node);
                }
                this.firstcheck = true;
            }
        }

        analyzeNode(node) {
            let img = node.querySelector("img");

            if (img !== null) {
                //so maybe this is a message, idk
                try {
                    let element = node.querySelector(".rounded");

                    if (element !== null) { //hmm
                        let result = characters_in_chat_cache.some(function(charData) {
                            if (element.parentElement.innerHTML.indexOf(charData.participant__name) != -1) {
                                img.src = "https://characterai.io/i/80/static/avatars/" + charData.avatar_file_name;
                                return true;
                            }
                            return false;
                        });

                        if (!result) {
                            this.nodes_to_analyze_later.push(node);
                        }
                    }
                } catch (ex) {
                }
            }
        }

        analyzePending() {
            try {
                let nodes = this.nodes_to_analyze_later;
                for (let i = 0; i < nodes.length; i++) {
                    let node = nodes[i];
                    this.analyzeNode(node);
                }
                this.nodes_to_analyze_later = [];
            } catch (ex) {
                this.nodes_to_analyze_later = [];
            }
        }
    }

    class FakeDropdownController {
        constructor() {
            this.dom = document.createElement("div");
            this.dom.innerHTML = '<div class="col-auto ps-2 dropdown dropup show" style="flex: 0 0 auto;width: auto;"><span data-toggle="dropdown" aria-haspopup="listbox"> <div data-tag="currentChar" style="cursor: pointer;display: flex;justify-content: center;align-items: center;"><b data-tag="currentCharName">Loading...</b><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"> <path fill="none" d="M0 0h24v24H0z"></path> <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"></path> </svg></div> </span> <div data-tag="dropDownMenu" tabindex="-1" role="listbox" aria-hidden="false" class="dropdown-menu show" style="position: absolute;inset: auto 0px 0px auto;transform: translate(0px, -24px);display: none;"> <h6 tabindex="-1" class="dropdown-header">Select character to reply...<br><small>(press enter to not reply)</small></h6> <div tabindex="-1" class="dropdown-divider"></div><button type="button" data-tag="charBtn" tabindex="0" role="option" class="dropdown-item" style="display: flex; align-items: center;"> <div>Char</div> </button><button type="button" data-tag="newCharBtn" tabindex="0" role="option" class="dropdown-item" style="display: flex; align-items: center;"> <div><em>new character...</em></div> </button> </div> </div>';
            this.dom.style = "display: flex; justify-content: center; align-items: center; margin: 10px; user-select:none";
            this.charbtn = this.dom.querySelector("[data-tag=charBtn]");
            this.newcharbtn = this.dom.querySelector("[data-tag=newCharBtn]");
            this.dropdownmenu = this.dom.querySelector("[data-tag=dropDownMenu]");
            this.currentchar = this.dom.querySelector("[data-tag=currentChar]");
            this.isvisible = false;

            this.dom.addEventListener("click", this.onClick.bind(this));
            this.newcharbtn.addEventListener("click", this.onAddNewChar.bind(this));

            var site = getCurrentSite();
            var elem = (site == BETA) ? "#user-input" : "textarea[inputmode]";

            switch(site) {
                case BETA: {
                    document.querySelector(elem).parentElement.insertBefore(this.dom, null);
                    break;
                }
                case NEXT: {
                    try {
                        var damnButton = document.querySelector(elem).parentElement.parentElement.querySelector("button");
                        document.querySelector(elem).parentElement.parentElement.insertBefore(this.dom, damnButton.parentElement);
                    } catch (ex) {
                        //All we had to do was get the damn button CJ
                        console.error("[RYW] failed to append FakeDropdown, site changed(?");
                    }
                    break;
                }
            }
        }

        destroy() {
            this.isvisible = false;
            this.dom.parentNode.removeChild(this.this);
        }

        onClick(e) {
            var self = this;
            this.isvisible = !this.isvisible;
            this.dropdownmenu.style.display = this.isvisible ? "block" : "none";

            let buttons = this.dropdownmenu.querySelectorAll("button");

            for(var i = 0; i < buttons.length; i++) {
                let button = buttons[i];
                if (button.getAttribute("data-tag") === "newCharBtn") {
                    continue;
                }

               button.parentNode.removeChild(button);
            }

            characters_in_chat_cache.forEach(function(charData) {
                let newUiElement = self.charbtn.cloneNode(true);
                newUiElement.innerText = charData.participant__name;
                newUiElement.setAttribute("data-externalid", charData.external_id);
                newUiElement.addEventListener("click", function(e) {
                    selectCharacter(this.getAttribute("data-externalid"));
                });

                self.dropdownmenu.querySelector(".dropdown-divider").parentElement.insertBefore(newUiElement, self.newcharbtn);
            });
        }

        onAddNewChar(e) {
            var site = getCurrentSite();

            switch(site) {
                case BETA: {
                    modal = new FakeModalController();
                    break;
                }
                case NEXT: {
                    var smodal = new SelectCharacterFakeModal(character_cache, function(external_id) {
                        selectCharacter(external_id);
                    });
                    break;
                }
            }
        }
    }

    class FakeModalController {
        constructor() {
            this.dom = document.createElement("div");
            this.dom.innerHTML = '<div class=""> <div class="modal fade show" role="dialog" tabindex="-1" style="display: block;"> <div class="modal-dialog modal-dialog-centered" role="document" style="margin-top: 0px;"> <div class="modal-content"> <div class="modal-body"> <div data-tag="charList" style="user-select:none;max-height: 300px;overflow-y: scroll;overflow-x: hidden;display: flex;flex-direction: column;"> <div data-tag="charOption" style="width:100%"> <img src="https://characterai.io/i/80/static/avatars/uploaded/2023/3/22/WOUx3xnZRql_j1TsQfS1TcNCI30D6uoPQvlGlKdYxHg.webp" style="height: 45px;width: 45px;margin-right: 10px;border-radius: 45px;object-fit: contain;"><b style="pointer-events:none">charname</b> <span style="pointer-events:none">@charowner</span> </div> </div> <input data-tag="searchInput" placeholder="Search..." style="width: 100%;"> </div> <div class="modal-footer"><span>Missing character? Start a chat, then reload the page!</span><button data-tag="cancelButton" type="button" class="btn btn-secondary">Cancel</button><button data-tag="addButton" type="button" disabled="" class="btn btn-primary disabled">Add</button></div> </div> </div> </div> <div class="modal-backdrop fade show"></div> </div>';
            this.dom.style = "position: relative; z-index: 1050; display: block;";
            this.chartemplate = this.dom.querySelector('[data-tag="charOption"]');
            this.charlist = this.dom.querySelector('[data-tag="charList"]');
            this.addbtn = this.dom.querySelector('[data-tag="addButton"]');
            this.charlist.removeChild(this.chartemplate);
            this.selectedid = "";
            this.selected = null;

            this.dom.querySelector('[data-tag="cancelButton"]').addEventListener("click", this.onCancel.bind(this));
            this.addbtn.addEventListener("click", this.onAdd.bind(this));
            this.dom.querySelector('[data-tag="searchInput"]').addEventListener("keyup", this.onSearchInputKey.bind(this));

            document.body.appendChild(this.dom);
            this.onData(character_cache.slice(0, 100));
        }

        onCancel(e) {
            this.dom.parentNode.removeChild(this.dom);
        }

        onSearchInputKey(e) {
            let value = e.target.value.toLowerCase();

            let results = character_cache.filter(function (charData) {
                return charData.participant__name.toLowerCase().indexOf(value) != -1;
            });

            this.onData(results.slice(0, 100));
        }

        onData(data) {
            var self = this;
            this.charlist.innerHTML = "";
            data.forEach(function(each) {

                let newUiElement = self.chartemplate.cloneNode(true);
                newUiElement.querySelector("b").innerText = each.participant__name;
                newUiElement.querySelector("span").innerText = "@" + each.user__username;
                newUiElement.setAttribute("data-externalid", each.external_id);
                newUiElement.querySelector("img").src = (each.avatar_file_name.length > 1) ? ("https://characterai.io/i/80/static/avatars/" + each.avatar_file_name) : "https://characterai.io/i/80/static/avatars/uploaded/2022/12/6/j7C6apwVP7XPVkqssQH5VPlFQ6AGBZFBpJKT9NIKYlc.webp";

                //No css injected, so i need use this lol
                newUiElement.addEventListener("click", function(e) {
                    if (self.selected !== null) {
                        self.selected.style.backgroundColor = "";
                    }

                    self.selected = e.target;
                    self.selectedid = e.target.getAttribute("data-externalid");
                    e.target.style.backgroundColor = "rgb(68 114 175 / 58%)";

                    self.addbtn.classList.remove("disabled");
                    self.addbtn.removeAttribute("disabled");
                });

                self.charlist.appendChild(newUiElement);
            });
        }

        onAdd(e) {
            this.dom.parentNode.removeChild(this.dom);
            selectCharacter(this.selectedid);
        }
    }

    function tryGetCurrentCharacter() {
        let external_id = new URLSearchParams(document.location.search).get("char");
        if (external_id != null) {
            getCharacterInfo(external_id, function() {
                selectCharacter(external_id);
            });
        }
    }

    async function getCharacterInfo(external_id, callback) {

        let results = character_cache.filter(function (charData) {
            return charData.external_id == external_id;
        });

        if (results.length != 0) {
            let result = results[0];
            if (callback) {
                callback(result);
                return;
            }
        }

        let token = user_token;

        if (token == null) {
            return;
        }

        let response = await fetch("https://plus.character.ai/chat/character/info/", {
            mode: "cors",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + token,
            },
            method: "POST",
            body : JSON.stringify({ "external_id" : external_id })
        });

        if (response.ok) {
            let json = await response.json();

            if (!character_cache.some(function(charData) {
                return charData.external_id === external_id;
            })) {
                character_cache.push(json.character);
            }

            if (callback) {
                callback(json.character);
            }
        } else {
            console.log("not ok");
        }
    }

    function addCharacterToChatCache(external_id) {
        if (external_id === undefined || external_id === "") return;

        let results = character_cache.filter(function (charData) {
            return charData.external_id == external_id;
        });

        if (results.length != 0) {
            let result = results[0];

            if (!characters_in_chat_cache.some(function(charData) {
                return charData.external_id === external_id;
            })) {
                characters_in_chat_cache.push(result);
            }
        }
        else {
            getCharacterInfo(external_id, function(charData) {
                addCharacterToChatCache(external_id);
            });
        }
    }

    function selectCharacter(external_id) {
        if (external_id === undefined || external_id === "") return;

        let results = character_cache.filter(function (charData) {
            return charData.external_id == external_id;
        });

        if (results.length != 0) {
            let result = results[0];

            if (!characters_in_chat_cache.some(function(charData) {
                return charData.external_id === external_id;
            })) {
                characters_in_chat_cache.push(result);
            }

            selected_character_id = external_id;
            dropdown.currentchar.querySelector('[data-tag="currentCharName"]').innerText = result.participant__name;
        } else {
            selected_character_id = "";
            //alert("Error: No character data for: " + external_id);
        }
    }

    async function fetchInitialData(onFinish = null) {

        let response = null;
        let host = getCurrentSite() == BETA ? document.location.hostname : "plus.character.ai";

        if (user_token !== null) {
            response = await fetch("https://" + host + "/chat/characters/recent/", {
                mode: "cors",
                cache: "no-cache",
                headers: {
                    "Authorization": "Token " + user_token,
                }
            });

            if (response.ok) {
                let json = await response.json();
                character_cache = character_cache.concat(json.characters);
            } else {
                //alert("Error fetching recent character data...");
            }

            response = await fetch("https://neo.character.ai/chats/recent/", {
                mode: "cors",
                cache: "no-cache",
                headers: {
                    "Authorization": "Token " + user_token,
                }
            });

            if (response.ok) {
                let json = await response.json();
                json.chats.forEach(chat => {
                    //different from recent characters.... bruh
                    character_cache.push({
                        external_id : chat.character_id,
                        participant__name : chat.character_name,
                        avatar_file_name : chat.character_avatar_uri,
                        user__username : ""
                    });
                });
            } else {
                //alert("Error fetching neo recent character data...");
            }
        }

        response = await fetch("https://" + host + "/chat/characters/public/", {
            mode: "cors",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + user_token,
            }
        });

        if (response.ok) {
            let json = await response.json();
            character_cache = character_cache.concat(json.characters);
        } else {
            //alert("Error fetching character data...");
        }

        response = await fetch("https://neo.character.ai/recommendation/v1/user", {
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (response.ok) {
            let json = await response.json();
            character_cache = character_cache.concat(json.characters);
        } else {
            //alert("Error fetching character data...");
        }

        if (onFinish !== null) {
            onFinish();
        }
    }

    function addToPane() {
        dropdown = new FakeDropdownController();
        watchdog = new ProfilePhotoWatchdog();
    }
    /*End code character selector*/

    function decodeBase64(base64) {
        const text = atob(base64);
        const length = text.length;
        const bytes = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
            bytes[i] = text.charCodeAt(i);
        }
        const decoder = new TextDecoder();
        return decoder.decode(bytes);
    }

    function hasRefValid(word) {
        if (references.has(word)) {
            return true;
        }

        return false;
    }

    //removed because was too powerful
    function parseAndFindCoincidences(txt, inverse = false, addZeroWidth = false) {
        return {
            newtext: txt,
            coincidences: new Map()
        };
    }

    //Taken from https://gist.github.com/scwood/3bff42cc005cc20ab7ec98f0d8e1d59d
    function uuidV4() {
        const uuid = new Array(36);
        for (let i = 0; i < 36; i++) {
            uuid[i] = Math.floor(Math.random() * 16);
        }
        uuid[14] = 4; // set bits 12-15 of time-high-and-version to 0100
        uuid[19] = uuid[19] &= ~(1 << 2); // set bit 6 of clock-seq-and-reserved to zero
        uuid[19] = uuid[19] |= (1 << 3); // set bit 7 of clock-seq-and-reserved to one
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        return uuid.map((x) => x.toString(16)).join('');
    }

    function changeFuncs() {

        if (window.__RYW) {
            if (window.__RYW.hasOwnProperty("SE")) {
                return; //this almost never happens.
            }
        }

        function CustomWebSocket(url, protocols) {
            websocket_captured = true;
            const ws = new websocketFn(url, protocols);
            if (url == NEO_URL) {
                if (neo_socket == null || (neo_socket != null && neo_socket != ws)) {
                    if (neo_socket != null) {
                        neo_socket.removeEventListener("message", neoSocketMessage);
                        neo_socket.removeEventListener("close", neoSocketDeadLikeMeIn5Years);
                    } else {
                        try {
                            var bb = new bubbleDOMController(0);
                            bb.setAsMessage("Connecting...");
                            mainelem.querySelector("#cresponses .details").appendChild(bb.dom);

                            ws.addEventListener("open", function() {
                                bb.selfDestroy();
                            });
                        } catch (ex) {
                        }
                    }

                    neo_socket = ws;
                    neo_socket.addEventListener("message", neoSocketMessage);
                    neo_socket.addEventListener("close", neoSocketDeadLikeMeIn5Years);
                }
            }
            return ws;
        }

        CustomWebSocket.prototype = websocketFn.prototype;
        window.WebSocket = CustomWebSocket;

        window.WebSocket.prototype.send = function(...args) {
            if (this.url == NEO_URL) {
                if (neo_socket == null || (neo_socket != null && neo_socket != this)) {
                    if (neo_socket != null) {
                        neo_socket.removeEventListener("message", neoSocketMessage);
                        neo_socket.removeEventListener("close", neoSocketDeadLikeMeIn5Years);
                    }

                    neo_socket = this;
                    neo_socket.addEventListener("message", neoSocketMessage);
                    neo_socket.addEventListener("close", neoSocketDeadLikeMeIn5Years);
                }
            }

            try {
                var json = JSON.parse(args[0]);

                switch (json.command) {
                    case "create_and_generate_turn":
                        {
                            if (!neo_waiting_for_turn) {
                                sendAPrompt(json);
                                disableControl(true);
                                neo_payload_origin = json.origin_id;
                                neo_waiting_for_turn = true;
                                neo_sended = false;
                                let newver = ++req_version;
                                req_version = newver;
                                last_chat_id = json.payload.turn.turn_key.chat_id;
                                neo_last_request_id = json.request_id;

                                if (tryPreProcess(json)) {
                                    return;
                                }
                            }

                            if ((selected_character_id != "") && (selected_character_id != char_id)) {
                                json.payload.character_id = selected_character_id;
                                if (getCurrentSite() == NEXT) {
                                    //cai next ui is gay, so I need to change the request id to be able to trick the frontend with the original request and thus avoid a visual bug with character selector
                                    json.request_id = uuidV4();
                                }
                            }

                            args[0] = JSON.stringify(json);
                            current_protocol = PROTOCOL_NEO;
                            break;
                        }

                    case "generate_turn_candidate": {
                        if (neo_capture_next_request) {
                            neo_capture_next_request = false;
                            neo_last_request_id = json.request_id;
                            neo_captured_next_request = json.request_id;
                            return;
                        }
                        break;
                    }
                }

            } catch (ex) {
                //console.error("[RYW]",ex);
            }

            sendSocketfn.call(this, ...args);
        }
    }

    function tryPreProcess(json) {
        return false;
    }

    //helper function, thanks chatgpt
    function areMapsEqual(map1, map2) {
        if (map1.size !== map2.size) {
            return false;
        }

        for (let [key, value] of map1) {
            if (!map2.has(key)) {
                return false;
            }

            if (map2.get(key) !== value) {
                return false;
            }
        }

        return true;
    }

    function hsvToRgb(h, s, v) {
        let f = (n, k = (n + h / 60) % 6) =>
        v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
        const r = Math.round(f(5) * 255);
        const g = Math.round(f(3) * 255);
        const b = Math.round(f(1) * 255);
        return `rgb(${r},${g},${b})`;
    }

    function neoSocketMessage(e) {
        var json = JSON.parse(e.data);

        if (json.hasOwnProperty("fake")) {
            return;
        }

        if (json.hasOwnProperty("command")) {
            switch (json.command) {
                case "add_turn": {
                    if (json.hasOwnProperty("turn") && (!json.turn.author.hasOwnProperty("is_human") || !json.turn.author.is_human)) {
                        if (neo_waiting_for_turn) {
                            neo_waiting_for_turn = false;
                            last_turn_update_index = 0;
                            last_turn_update_was_changed = false;
                            auto_stopped = false;
                            activerequests = 0;
                            okmessages = 1;
                            neo_requests = new Map();
                            neo_last_turn = json.turn;
                            neo_last_candidate_id = (json.turn.candidates.length > 0) ? json.turn.candidates[0].candidate_id : "";
                            neo_swiper = neoSwiperController();
                            var msgbox = mainelem.querySelector("#cresponses .details");
                            msgbox.innerHTML = "";
                            setAllowGenerating(true);
                            disableControl(false);
                            mainelem.querySelector("[data-tag=deleteresend]").style.display = "block";

                            if (json.turn.candidates[0].hasOwnProperty("safety_truncated")) {
                                var test = new Audio(B64_BONK_AUDIO);
                                test.play();
                            }
                        }
                    }

                    if ((selected_character_id != "") && (selected_character_id != char_id) && (getCurrentSite() == NEXT)) {
                        json.request_id = neo_last_request_id;
                        json.fake = true;

                        if (!json.turn.author.hasOwnProperty("is_human")) {
                            json.turn.author.author_id = char_id;
                        }

                        neo_socket.dispatchEvent(new MessageEvent("message", {
                            bubbles: true,
                            cancelable: false,
                            data: JSON.stringify(json)
                        }));
                    }

                    if (json.hasOwnProperty("turn")) {
                        if (json.turn.hasOwnProperty("candidates")) {
                            if ((pending_payload !== null) && (waiting_request_id == json.request_id)) {
                                injected_last = json.turn;
                                turns_since_last_inject = 0;
                                sendSocketfn.call(neo_socket, JSON.stringify(pending_payload));
                            }
                        }
                    }
                    break;
                }
                case "update_turn": {
                    let request = neo_requests.get(json.request_id);

                    if (request !== undefined) {
                        try {
                            if (json.hasOwnProperty("turn") && json.turn.candidates[0].hasOwnProperty("is_final")) {
                                okmessages++;
                                activerequests = Math.max(0, activerequests - 1);

                                json.turn.candidates.forEach(candidate => {
                                    candidate_cache.push(candidate);
                                });

                                if (okmessages >= 26 && !auto_stopped) {
                                    auto_stopped = true;
                                    setAllowGenerating(false);
                                    var bubble = new bubbleDOMController(0);
                                    bubble.dom.classList.add("warned");
                                    bubble.setAsMessage("Auto stopped because the swipe limit (30) (reserved for editing)");
                                    mainelem.querySelector("#cresponses .details").appendChild(bubble.dom);
                                }
                            }
                        } catch(e) {

                        }

                        request.bubble.websocketEvent(json.command, json);
                    } else {

                        try {
                            if ((selected_character_id != "") && (selected_character_id != char_id) && (getCurrentSite() == NEXT)) {
                                json.request_id = neo_last_request_id;
                                json.turn.author.author_id = char_id;
                                json.fake = true;

                                neo_socket.dispatchEvent(new MessageEvent("message", {
                                    bubbles: true,
                                    cancelable: false,
                                    data: JSON.stringify(json)
                                }));
                            }
                        } catch(e) {

                        }
                    }

                    break;
                }

                case "neo_error": {
                    let request = neo_requests.get(json.request_id);

                    if (request !== undefined) {
                        request.bubble.neoError(json);
                    }
                    break;
                }

                case "remove_turns_response": {
                    if (neo_ignore_delete_prompt) {
                        neo_ignore_delete_prompt = false;
                        neo_waiting_for_delete = false;
                        break;
                    }
                    if (neo_waiting_for_delete) {
                        neo_waiting_for_delete = false;

                        try {
                            setTimeout(function() {
                                document.querySelector("textarea").dispatchEvent(
                                    new KeyboardEvent('keydown', {
                                        bubbles: true,
                                        cancelable: true,
                                        key: 'Enter',
                                        code: 'Enter',
                                        keyCode: 13,
                                        which: 13
                                    })
                                );
                            }, 100);
                        } catch (ex) {
                            console.log("no send button");
                        }
                    } else {
                        setAllowGenerating(false);
                        refreshNeoTurns(function() { });
                    }
                    break;
                }
            }
        }
    }

    function neoSocketDeadLikeMeIn5Years(e) {
        neo_socket = null;
        [...neo_requests.values()].forEach(function(request) {
            request.bubble.informDisconnect(e.code);
        });

        var bubble = new bubbleDOMController(0);
        bubble.dom.classList.add("warned");
        bubble.setAsMessage("Connection closed");
        mainelem.querySelector("#cresponses .details").appendChild(bubble.dom);
    }

    function neoSwiperController() {
        var version = req_version + 0;
        var state = 0;
        var data = null;

        return new Promise((resolve, reject) => {
            var tmer = null;

            function check() {
                if (req_version != version) {
                    resolve(true);
                    return;
                }

                if (!neo_capture_next_request) {
                    if (activerequests < 2 && allow_generating) {
                        createNeoSwipe();
                    }

                    switch (state) {
                        case 0: {
                            if (neo_readyqueue.length > 0) {
                                data = neo_readyqueue.shift();
                                state = 1;
                            }
                            break;
                        }
                        case 1: {
                            state = 0;
                            data.request_id = neo_captured_next_request;
                            neo_socket.dispatchEvent(new MessageEvent("message", {
                                bubbles: true,
                                cancelable: false,
                                data: JSON.stringify(data)
                            }));
                            break;
                        }
                    }
                }

                tmer = setTimeout(check, 100);

            }
            tmer = setTimeout(check, 100);
        });
    }

    function sendAndExpect(socket, command, payload) {
        return new Promise((resolve, reject) => {
            try {
                var req_id = uuidV4();

                if ((socket == null) || (socket.readyState != 1)) {
                    throw new Error("Socket is not connected");
                }

                var _payload = {
                    "command": command,
                    "request_id": req_id,
                    "payload": payload,
                    "origin_id": neo_payload_origin
                };

                var _onmsg = function(e) {
                    var json = JSON.parse(e.data);

                    if (json.request_id == req_id) {
                        socket.removeEventListener("message", _onmsg);

                        if (json.command == "neo_error") {
                            reject(new Error(json.comment));
                        }

                        resolve(json);
                    }
                }

                socket.addEventListener("message", _onmsg);
                sendSocketfn.call(socket, JSON.stringify(_payload));
            } catch (ex) {
                reject(ex);
            }
        });
    }

    function waitForTurn(socket, request_id) {
        return new Promise((resolve, reject) => {
            var _onmsg = function(e) {
                var json = JSON.parse(e.data);

                if (json.request_id == request_id) {

                    if (json.command == "neo_error") {
                        reject({error: json.comment});
                        return;
                    }

                    if (json.turn.candidates[0].hasOwnProperty("is_final") && json.turn.candidates[0].is_final) {
                        socket.removeEventListener("message", _onmsg);
                        resolve(json);
                    }
                }
            }

            socket.addEventListener("message", _onmsg);
        });
    }

    function gotoChat(charId, chatId) {
        var url = new URL((getCurrentSite() == BETA) ? "/chat2" : ("/chat/" + charId), "https://" + document.location.hostname);
        var params = new URLSearchParams();

        if (getCurrentSite() == BETA) {
            params.append("char", charId);
        }
        params.append("hist", chatId);

        url.search = params;
        document.location = url;
    }

    function createAnnotation(turn_key, candidate_id) {
        var arr = ["annotations_emotional_support", "annotations_friendship", "annotations_cooking", "annotations_interactive_story_telling", "annotations_story_telling", "annotations_comedy", "annotations_discussion", "annotations_gameplay"];
        fetch(ANNOTATION_URL, {
            "headers": {
                "content-type": "application/json",
                "origin-id" : neo_payload_origin,
                "request-id" : uuidV4()
            },
            "body": JSON.stringify(
                {
                    "turn_key": turn_key,
                    "candidate_id": candidate_id,
                    "annotation": {
                        "annotation_type": arr[Math.floor(Math.random() * arr.length)],
                        "annotation_value": 1
                    }
                }
            ),
            "method": "POST",
            "credentials": "include"
        });
    }

    async function requestCopyFromNeo(chat_id, end_turn_id) {
        try {

            let response = await fetch("https://neo.character.ai/chat/" + chat_id + "/copy", {
                mode: "cors",
                cache: "no-cache",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                method : "POST",
                body : JSON.stringify({ end_turn_id : end_turn_id })
            });

            if (response.ok) {
                let json = await response.json();
                if (json.hasOwnProperty("new_chat_id")) {
                    return json.new_chat_id;
                }
                else {
                    throw new Error("not ok");
                }
            }
            else {
                throw new Error("response not ok");
            }
        } catch (ex) {
            return undefined;
        }
    }

    async function refreshNeoTurns(callback) {
        references = new Map();
        references_compare = new Map();
        var msgbox = mainelem.querySelector("#cresponses .details");
        var b = new bubbleDOMController(0);
        b.setAsMessage("Getting last messages...");
        msgbox.appendChild(b.dom);

        [...neo_requests.values()].forEach(function(request) {
            request.bubble.selfDestroy();
        });

        try {

            let response = await fetch("https://neo.character.ai/turns/" + last_chat_id + "/?candidate_filter=all", {
                mode: "cors",
                cache: "no-cache",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (response.ok) {
                let json = await response.json();

                b.selfDestroy();

                var showmsg = getLocalSettingSaved("sefirstrun", "1");

                if (showmsg === "0") {
                    saveToLocalStorage({ "sefirstrun" : "1" });
                    var bubble = new bubbleDOMController(0);
                    let msgdata = {"turn_key": {"chat_id": "", "turn_id": "" }, "author": {"author_id": "", "is_human": true, "name": "[deleted]" }, "candidates": [{"raw_content": "Hi {{user}}! thanks for getting a copy of this version! Remember you can leave your feedback and also give suggestions for maybe could be added in the future. And if for some reason you got the script without paying, I swear that I will find you one day and", "safety_truncated" : true, "is_final": true } ], };

                    bubble.setTurnAndCandidate(msgdata, msgdata.candidates[0]);
                    bubble.status = 2;
                    bubble.updateBtnStatusses();
                    msgbox.appendChild(bubble.dom);
                }

                okmessages = 0;
                candidate_cache = [];

                if (json.turns.length > 0) {
                    var turn = json.turns[0];
                    neo_last_turn = turn;
                    neo_last_candidate_id = turn.primary_candidate_id;

                    var turns_sorted = [...turn.candidates].sort((a, b) => {
                        const date1 = Date.parse(a.create_time);
                        const date2 = Date.parse(b.create_time);
                        if (date1 === date2) {
                            return 0;
                        }
                        return date1 < date2 ? -1 : 1;
                    });

                    //i blame the devs for this trolling
                    var candidates = (getCurrentSite() == BETA) ? turn.candidates : turns_sorted;

                    candidates.forEach(function(candidate) {
                        okmessages++;
                        var bubble = new bubbleDOMController(0);
                        msgbox.appendChild(bubble.dom);
                        bubble.setTurnAndCandidate(turn, candidate);
                        bubble.status = 7;
                        bubble.updateBtnStatusses();
                        bubble.grow();

                        neo_requests.set(uuidV4(), {
                            "payload": null,
                            "bubble": bubble
                        });
                    });

                    injected_last = null;
                    turns_since_last_inject = 0;

                    json.turns.reverse().forEach(function(turn) {
                        turns_since_last_inject++;
                        //tries to add cache, if avaiable.
                        if (!turn.author.hasOwnProperty("is_human")) {
                            addCharacterToChatCache(turn.author.author_id);
                        }

                        turn.candidates.forEach(function(candidate) {
                            if (candidate.hasOwnProperty("raw_content")) {
                                if (candidate.raw_content.indexOf("###") === 0) {
                                    custom_prompt = turn;
                                }
                            }

                            candidate_cache.push(candidate);
                        });
                    });
                }
            }
            else {
                throw new Error("response not ok");
            }
        } catch (ex) {
            b.setAsMessage("Error loading messages");
            return;
        }

        callback();

        if (watchdog !== null) {
            watchdog.analyzePending();
        }
    }

    function combineChats(chats) {
        let combinedData = {
            turns: [],
            meta: {
                next_token: null
            }
        };

        let turnIds = new Set();
        let candidateIds = new Set();

        chats.forEach(json => {
            json.turns.forEach(turn => {
                if (!turn.hasOwnProperty("turn_key")) {
                    return;
                }
                if (!turnIds.has(turn.turn_key.turn_id)) {
                    turnIds.add(turn.turn_key.turn_id);

                    // Filter out duplicate candidates within the turn
                    let uniqueCandidates = [];
                    turn.candidates.forEach(candidate => {
                        if (!candidateIds.has(candidate.candidate_id)) {
                            candidateIds.add(candidate.candidate_id);
                            uniqueCandidates.push(candidate);
                        }
                    });

                    // Replace candidates with unique candidates
                    turn.candidates = uniqueCandidates;
                    combinedData.turns.push(turn);
                }
            });

            combinedData.meta.next_token = json.meta.next_token;
        });

        return combinedData;
    }

    async function getAllChatTurns(chat_id, allCandidates = false, progressFunc = undefined, next_token = null) {
        return new Promise(async (resolve, reject) => {
            var jsons = [];

            try {
                while(true) {
                    const searchParams = new URLSearchParams();

                    if (next_token !== null) {
                        searchParams.append("next_token", next_token)
                    }

                    if (allCandidates) {
                        searchParams.append("candidate_filter", "all");
                    }
                    let response = await fetch("https://neo.character.ai/turns/" + chat_id + "/?" + searchParams.toString(), {
                        mode: "cors",
                        cache: "no-cache",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    });
                    if (!response.ok) {
                        reject("Response not ok");
                        break;
                    }
                    let json = await response.json();
                    if (!json.hasOwnProperty("meta") || (json.meta.next_token === null)) {
                        break;
                    }

                    next_token = json.meta.next_token;
                    jsons.push(json);

                    if (progressFunc) {
                        progressFunc(json.turns.length);
                    }

                }
            } catch (ex) {
                reject("Failed to load chat");
            }

            resolve(combineChats(jsons));
        });
    }


    async function getRecentChatFrom(character_id, callback) {

        let response = await fetch("https://neo.character.ai/chats/recent/" + character_id, {
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (response.ok) {
            let json = await response.json();
            if (json.hasOwnProperty("chats") && json.chats.length > 0) {
                last_chat_id = json.chats[0].chat_id;
                callback(json);
            }
        } else {

        }
    }

    async function getChatsFromCharacter(character_id, callback) {
        const searchParams = new URLSearchParams();
        searchParams.append("character_ids", character_id);
        searchParams.append("num_preview_turns", "2");

        let response = await fetch("https://neo.character.ai/chats/?" + searchParams.toString(), {
            mode: "cors",
            cache: "no-cache",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (response.ok) {
            let json = await response.json();
            if (json.hasOwnProperty("chats") && json.chats.length > 0) {
                callback(json);
            }
        } else {

        }
    }

    function gotoSwipeNum(num) {
        for(let i = 0; i < 100; i++) {
            //Bruteforce method because i'm lazy
            try {
                var site = getCurrentSite();
                switch(site) {
                    case BETA:
                        {
                            let swiperbutton = document.querySelector('.swiper-button-prev');
                            if (swiperbutton != undefined) {
                                if (swiperbutton.classList.contains("swiper-button-disabled")) {
                                    break;
                                } else {
                                    swiperbutton.click();
                                }
                            }
                            break;
                        }
                    case NEXT: {
                        swipeBack();
                        break;
                    }
                }
            } catch (ex) {
            }
        }

        for(let i = 1; i < num; i++) {
            try {
                swipeNext()
            } catch (ex) {
            }
        }
    }

    function getZeroWidthText(text) {
        const zSpace = "﻿"; //—

        return text.split(" ").map(word => {
            let chosen = (Math.random() < 0.5) ? zSpace : zSpace;
            if (word.length <= 4) {
                return word.split('').map(char => char + chosen).join('');
            } else {
                return word.split('').map((char, index) => (index % 2 === 0) ? char + chosen : char).join('');
            }
        }).join(" ");
    }

    function createNeoSwipe() {
        if (neo_last_turn == null) {
            return;
        }

        var char_id = neo_last_turn.author.author_id;

        if (selected_character_id != "") {
            char_id = selected_character_id;
        }

        var payload = {
            "command": "generate_turn_candidate",
            "request_id": uuidV4(),
            "payload": {
                "character_id": char_id,
                "turn_key": neo_last_turn.turn_key,
            },
            "origin_id": neo_payload_origin
        };

        var bubble = new bubbleDOMController(0);
        var msgbox = mainelem.querySelector("#cresponses .details");
        msgbox.appendChild(bubble.dom);

        neo_requests.set(payload.request_id, {
            "payload": payload.payload,
            "bubble": bubble
        });
        sendSocketfn.call(neo_socket, JSON.stringify(payload));
        activerequests++;
    }

    function updatePrimaryCandidate(candidate_id) {
        if (neo_last_turn == null) {
            return;
        }

        console.log("updating primary", candidate_id);

        var payload = {
            "command": "update_primary_candidate",
            "payload": {
                "candidate_id": candidate_id,
                "turn_key": neo_last_turn.turn_key
            },
            "origin_id": neo_payload_origin
        };

        neo_socket.send(JSON.stringify(payload));
    }

    function createNeoSwipeEdit(bubble, newRaw) {
        if (neo_last_turn == null) {
            return;
        }

        var payload = {
            "command": "edit_turn_candidate",
            "request_id": uuidV4(),
            "payload": {
                "new_candidate_raw_content": newRaw,
                "turn_key": neo_last_turn.turn_key,
            },
            "origin_id": neo_payload_origin
        };

        neo_requests.set(payload.request_id, {
            "payload": payload.payload,
            "bubble": bubble
        });

        neo_socket.send(JSON.stringify(payload));
    }

    function editLastInjected(newRaw) {
        if (injected_last == null) {
            return;
        }

        var payload = {
            "command": "edit_turn_candidate",
            "request_id": uuidV4(),
            "payload": {
                "new_candidate_raw_content": newRaw,
                "turn_key": injected_last.turn_key,
            },
            "origin_id": neo_payload_origin
        };

        neo_socket.send(JSON.stringify(payload));
    }

    function removeTurns(turns, regenerateId = false) {
        turns_since_last_inject -= turns.length;

        if (turns_since_last_inject < 0) {
            turns_since_last_inject = 0;
        }

        var payload = {
            "command": "remove_turns",
            "request_id": (regenerateId ? uuidV4() : neo_last_request_id),
            "payload": {
                "chat_id": neo_last_turn.turn_key.chat_id,
                "turn_ids": turns
            },
            "origin_id": neo_payload_origin
        };

        neo_socket.send(JSON.stringify(payload));
        neo_waiting_for_delete = true;
    }

    var _interceptors = [
        {"regex": ANNOTATION_URL,
         "state" : 1,
         "abort" : true,
         "back" : function(response) {
             return response;
         }},
        {"regex": /https:\/\/neo\.character\.ai\/turns\/[\w\-]+\/remove/gm,
         "state" : 4,
         "back" : function(response) {
             setAllowGenerating(false);
             refreshNeoTurns(function() { });
             return response;
         }},
        {"regex": /https:\/\/neo\.character\.ai\/annotations\/[\w\-]+\/[\w\-]+\/[\w\-]+/gm,
         "state" : 1,
         "abort" : true,
         "back" : function(response) {
             //I don't really like this sus annotation tracker.
             return response;
         }},
        {"regex": /https:\/\/neo\.character\.ai\/turns\/[\w\-]+\//gm,
         "state" : 4,
         "back": function(response) {
             var json = JSON.parse(response);
             if (!json.hasOwnProperty("turns")) return JSON.stringify(json);

             json.turns.forEach(turn => {
                 if (turn.candidates) {
                     turn.candidates.forEach(candidate => {
                         var ignoreedited = getLocalSettingSaved("ignoreedited", "lignoreno");

                         if (ignoreedited != "lignoreno") {
                             delete candidate.base_candidate_id;
                             delete candidate.editor;
                         }

                         if (enable_turn_changer) {
                             if (candidate.raw_content) {
                                 let txt = candidate.raw_content;
                                 candidate.raw_content = parseAndFindCoincidences(txt, true).newtext;
                             }
                         }
                     });
                 }
             });
             return JSON.stringify(json);
         }}
    ];

    XMLHttpRequest.prototype.open = function() {
        var self = this;
        var args = arguments;
        _interceptors.forEach(function(obj) {
            if (obj.hasOwnProperty("abort") && args['1'].match(obj.regex)) {
                throw new Error("We don't want these request");
            }

            args['1'].match(obj.regex) && self.addEventListener('readystatechange', function(event) {

                if (self.readyState === obj.state) {
                    var response = obj.back(event.target.responseText);
                    Object.defineProperty(self, 'response', {writable: true});
                    Object.defineProperty(self, 'responseText', {writable: true});
                    Object.defineProperty(self, 'status', {writable: true});
                    self.response = self.responseText = response;
                }
            });
        });
        return open_prototype.apply(this, arguments);
    };

    async function handlefetch(...args) {
        if (args[0] == STREAMING_URL && (mainelem != null)) {
            current_protocol = PROTOCOL_LEGACY;

            var json = JSON.parse(args[1].body);

            if ("text" in json && json.text.trim() != "") {
                var promp_t = getLocalSettingSaved("ljailbreak", "");

                if (promp_t.length > 1) {
                    json.text += "\n![" + promp_t.replaceAll("\n", ";\t").replaceAll("(", "{").replaceAll(")", "}").replaceAll("[", "{").replaceAll("]", "}") + "](https://png-pixel.com/1x1-ff00007f.png)";
                    args[1].body = JSON.stringify(json);
                }
            }

            var isClean = false;
            var mode = getCurrentMode();

            lastheaders = args[1].headers;
            lastbody = json;

            if (json.hasOwnProperty("parent_msg_uuid")) {
                if (json.parent_msg_uuid == null) {
                    isClean = true;
                } else {
                    if (json.parent_msg_uuid == last_user_msg_uuid) {
                        if (mode == "nsfw") {
                            if (!warned) {
                                warned = true;
                                alert("Please note that if you swipe then submit the answer, it will become the chosen answer and if you choose the old one again it won't work. You should not use swipes like this with this extension.");
                            }
                        }
                        return constructAwaiter();
                    }
                }
            } else { //Weird CAI bug, happens when swipe
                alert("Dev fuck up, extension dead?");
                return constructAwaiter();
            }

            if (isClean) {
                var firstrequest = tryGetNewMessage(args[1], 0, mode);
                setAllowGenerating(true);
                return constructAwaiter();
            }
        }
        else {
            if (((args[0].indexOf(SENTRY_URL) != -1) && NO_ERROR_REPORTING) || ((args[0].indexOf(EVENTS_URL) != -1) && NO_TRACKING) || ((args[0].indexOf(CLOUD_MONITORING_NAME) != -1) && NO_MONITORING)) {
                return new Promise((resolve, reject) => {
                    reject();
                });
            }

            if ((args[0].indexOf(ANNOTATION_URL) != -1)) {
                return new Promise((resolve, reject) => {
                    reject();
                });
            }
        }

        let response = fetchFn(...args);
        return response;
    }

    var f = async (...args) => {
        return handlefetch(...args);
    }

    class EventEmitter {
        on(name, callback) {
            var callbacks = this[name];
            if (!callbacks) this[name] = [callback];
            else callbacks.push(callback);
        }

        dispatch(name, event) {
            var callbacks = this[name];
            if (callbacks) callbacks.forEach(callback => callback(event));
        }
    }

    class Task {
        constructor(title) {
            this.dom = templates.task.cloneNode(true);
            this.title = title;
            this.status = 0;
            this.steps = [];
            this.result = {};
            this.events = new EventEmitter();
            this.isCancellable = true;
            this.isCancelled = false;
            this.removeAtComplete = true;
            this.dispatchOnStep = true;
            this.hasResults = false;

            let btns = this.dom.querySelector(".topbtns").getElementsByClassName("abtn");

            for (let i = 0; i < btns.length; i++) {
                btns[i].addEventListener("click", this.onBtnClick.bind(this));
            }

            this.events.on("func", this.onFuncEvent.bind(this));
        }

        run() {
            var self = this;
            return new Promise(async (resolve, reject) => {
                try {
                    self.changeStatus(1);
                    for(var i = 0; i < self.steps.length; i++) {
                        var step = self.steps[i];
                        await step(self); //Send self as reference (for change title or another thing)
                        if (self.dispatchOnStep) {
                            self.events.dispatch("task_step", { step: i, total : self.steps.length });
                        }
                    }
                    resolve();
                } catch (ex) {
                    if (ex.hasOwnProperty("info")) {
                        self.changeTitle(self.title + " error: " + ex.info);
                    }
                    else {
                        self.changeTitle(self.title + " error: " + ex);
                    }
                    self.removeColor();
                    self.addColor("errored");
                    reject();
                }
            });
        }

        complete() {
            if (this.status == 1) {
                this.changeStatus(2);
            }
        }

        changeTitle(newTitle) {
            this.dom.querySelector(".reqtitle").innerText = newTitle;
        }

        changeStatus(newStatus) {
            this.status = newStatus;
            this.updateBtnStatusses();
        }

        removeColor() {
            this.dom.classList.remove("warned");
            this.dom.classList.remove("errored");
        }

        addColor(type) {
            this.removeColor();
            this.dom.classList.add(type);
        }

        addStep(stepFunc) {
            this.steps.push(stepFunc);
        }

        updateBtnStatusses() {
            let btns = this.dom.querySelector(".topbtns").getElementsByClassName("abtn");
            for (var i = 0; i < btns.length; i++) {
                btns[i].style.display = "none";
            }

            switch (this.status) {
                case 1: {
                    if (this.isCancellable) {
                        this.dom.querySelector("[data-tag=cancel]").style.display = "block";
                    }
                    break;
                }
                case 2: {
                    if (this.hasResults) {
                        this.dom.querySelector("[data-tag=view]").style.display = "block";
                    }

                    this.dom.querySelector("[data-tag=close]").style.display = "block";
                    break;
                }
            }
        }

        onBtnClick(e) {
            var self = this;
            e.stopImmediatePropagation();
            this.events.dispatch("func", { "task" : this, "func" : e.target.getAttribute("data-tag") });
        }

        onFuncEvent(ev) {
            switch(ev.func) {
                case "close":
                    {
                        task_controller.removeViewing(this);
                        break;
                    }
                case "cancel":
                    {
                        this.isCancelled = true;
                        break;
                    }
            }
        }

        selfDestroy() {
            try {
                this.dom.parentElement.removeChild(this.dom);
            } catch (ex) { }
        }
    }

    class SelectCharacterFakeModal {
        constructor(characters, onConfirmMethod) {

            var charactersDom = document.createElement("div");
            charactersDom.innerHTML = '<div data-tag="characters" style="height:200px;overflow:hidden;overflow-y:auto"></div><input type="text" data-tag="searchInput" placeholder="Search..." style="width: 100%;"><span>Missing character? Start a chat, then reload the page!</span>';

            var charSlotDom = document.createElement("div");
            charSlotDom.innerHTML = '<div data-tag="charOption" style="width:100%;display: flex;align-items: center;"> <img style="height: 45px;width: 45px;border-radius: 45px;object-fit: contain;"><div style="display:flex;align-items: center;justify-content: space-between;width: 100%;"><b style="pointer-events:none" data-tag="charname">Who</b> <div class="abtn" style="display:none" data-tag="changebtn">Change</div> </div></div>';

            this.onConfirmMethod = onConfirmMethod;
            this.characters = characters;
            this.alertelement = new generic_alert(
                null,
                "Select a character",
                charactersDom,
                [{
                    text: "Select",
                    function: this.onConfirm.bind(this)
                },{
                    text: "Cancel",
                    function: this.onCancel.bind(this)
                }]);

            this.alertelement.ismodal = true;
            this.dom = this.alertelement.uielement;
            this.chartemplate = charSlotDom;
            this.charlist = charactersDom.querySelector('[data-tag="characters"]');
            this.selectedid = "";
            this.selected = null;

            this.dom.querySelector('[data-tag="searchInput"]').addEventListener("keyup", this.onSearchInputKey.bind(this));
            this.alertelement.append();
            this.onData(characters.slice(0, 100));
        }

        onCancel(e) {
            this.dom.parentNode.removeChild(this.dom);
        }

        onSearchInputKey(e) {
            let value = e.target.value.toLowerCase();

            let results = this.characters.filter(function (charData) {
                return charData.participant__name.toLowerCase().indexOf(value) != -1;
            });

            this.onData(results.slice(0, 100));
        }

        onData(data) {
            var self = this;
            this.charlist.innerHTML = "";
            data.forEach(function(each) {

                let newUiElement = self.chartemplate.cloneNode(true);
                newUiElement.querySelector("[data-tag=charname]").innerText = each.participant__name;
                //newUiElement.querySelector("span").innerText = "@" + each.user__username;
                newUiElement.querySelector("[data-tag=charOption]").setAttribute("data-externalid", each.external_id);
                newUiElement.querySelector("img").src = (each.avatar_file_name.length > 1) ? ("https://characterai.io/i/80/static/avatars/" + each.avatar_file_name) : "https://characterai.io/i/80/static/avatars/uploaded/2022/12/6/j7C6apwVP7XPVkqssQH5VPlFQ6AGBZFBpJKT9NIKYlc.webp";

                newUiElement.addEventListener("click", function(e) {
                    e.stopPropagation();

                    if (self.selected !== null) {
                        self.selected.style.backgroundColor = "";
                    }

                    self.selected = newUiElement;
                    self.selectedid = each.external_id;
                    newUiElement.style.backgroundColor = "rgb(68 114 175 / 58%)";
                });

                self.charlist.appendChild(newUiElement);
            });
        }

        onConfirm(e) {
            this.onConfirmMethod(this.selectedid);
        }
    }

    class TaskController {
        constructor() {
            this.pending = [];
            this.running = [];
            this.showing = [];
            this.events = new EventEmitter();
            this.checktimer = setTimeout(this.check.bind(this), 10);
        }

        check() {
            var self = this;
            this.checktimer = setTimeout(this.check.bind(this), 10);

            if (this.pending.length > 0) {
                if (this.running.length < 2) {
                    var task = this.pending.shift();
                    this.running.push(task);
                    this.showing.push(task);

                    self.hideSection(false);
                    mainelem.querySelector("#ctasks .details").appendChild(task.dom);

                    var completeTask = function(completedSuccefully) {
                        task.complete();
                        var ind = self.running.indexOf(task);
                        self.running.splice(ind, 1);
                        self.events.dispatch("tasks_queue", self.pending.length);

                        if (completedSuccefully) {
                            if (task.removeAtComplete) {
                                self.removeViewing(task);
                            }
                        }
                    }

                    task.run()
                        .then(() => {
                        completeTask(true);
                    })
                        .catch(() => {
                        console.warn("[RYW] task error");
                        completeTask(false);
                    });
                }
            }

            if (this.running.length == 0) {
                removePageConfirmation();
            }

            if (this.showing.length == 0) {
                self.hideSection(true);
            }
        }

        hideSection(hide) {
            mainelem.querySelector("#ctasks").style.display = hide ? "none" : "flex";
        }

        removeViewing(task) {
            var ind = this.showing.indexOf(task);
            if (ind > -1) {
                this.showing.splice(ind, 1);
            }
            task.selfDestroy();
        }

        appendTask(task) {
            addPageConfirmation();
            this.pending.push(task);
            this.events.dispatch("tasks_queue", this.pending.length);
        }
    }

    async function translate(text, sLang, tLang) {
        try {
            const format = "html";
            var key = "";

            const response = await fetch(`https://translate.googleapis.com/translate_a/t?client=gtx&format=${format}&sl=${sLang}&tl=${tLang}&key=${key}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: `q=${encodeURIComponent(text)}`
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const json = await response.json();

            if (Array.isArray(json[0])) {
                return json[0][0];
            } else {
                return json[0];
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    class bubbleDOMController {
        constructor(attempt = 0) {
            this.dom = templates.msg.cloneNode(true);
            this.botname = this.dom.querySelector(".botname");
            this.botmsg = this.dom.querySelector(".botmsg");
            this.rawmsg = this.dom.querySelector(".rawmsg");
            this.reqstatus = this.dom.querySelector(".reqstatus");
            this.replyid = this.dom.querySelector(".replyid");
            this.streamcontroller = null;
            this.errored = false;
            this.sendedtoui = false;
            this.stopped = false;
            this.isediting = false;
            this.ishided = true;
            this.linkedbubbles = [];
            this.turns = [];
            this.datas = [];
            this.turn = null;
            this.candidate = null;
            this.status = 0;
            this.num = 0;
            this.lastchunk = null;
            this.lastdata = null;
            this.container = null;
            this.isCategory = false;

            let btns = this.dom.querySelector(".topbtns").getElementsByClassName("abtn");

            for (let i = 0; i < btns.length; i++) {
                btns[i].addEventListener("click", this.onBtnClick.bind(this));
            }

            btns = this.dom.querySelector(".bottombtns").getElementsByClassName("abtn");

            for (let i = 0; i < btns.length; i++) {
                btns[i].addEventListener("click", this.onBtnClick.bind(this));
            }

            this.dom.addEventListener("click", this.onClick.bind(this));
            this.botname.innerText = "";
            this.botmsg.innerText = "";
            this.botmsg.style.display = "none";
            this.rawmsg.innerText = "";
            this.reqstatus.innerText = (attempt > 0) ? ("Got error, retry... x" + attempt) : "Waiting for the server...";
            this.dom.querySelector("textarea").addEventListener("input", this.grow.bind(this));
            this.updateBtnStatusses();
            this.grow();
        }

        assignController(controller) {
            var self = this;
            this.streamcontroller = controller;
            controller.events.on("chunk", function(chunk) {
                if (self.dom == null) {
                    return;
                }

                if (chunk.hasOwnProperty("src_char")) {
                    if (self.status == 0) {
                        self.status = 1;
                    }
                    self.lastchunk = chunk;
                    self.botname.innerText = chunk.src_char.participant.name;
                    self.botmsg.innerText = ((chunk.replies[0].text.indexOf("﻿") != -1 ) ? "(Zero width) " : "") + chunk.replies[0].text;
                    self.rawmsg.innerText = chunk.replies[0].text;
                    self.updateBtnStatusses();
                    self.grow();
                    self.highlight();
                }
            });

            controller.events.on("result", function(status) {
                if (self.dom == null) {
                    return;
                }
                switch (status.status) {
                    case "errored": {
                        self.status = 2;
                        self.errored = true;
                        self.dom.classList.add("errored");
                        self.reqstatus.innerText = status.error;

                        if (getCurrentMode() == "nsfw") {
                            if (status.error === "No eligible candidates") {
                                setTimeout(function() {
                                    self.selfDestroy();
                                }, 1000);
                            }
                        }
                        break;
                    }
                    case "done": {
                        if (!self.errored) {
                            self.status = 3;
                            self.reqstatus.innerText = "OK";
                            self.replyid.innerText = "#" + okmessages;
                        }
                        break;
                    }
                }

                self.updateBtnStatusses();
            });
        }

        websocketEvent(eventType, data) {
            var self = this;

            switch (eventType) {
                case "update_turn": {
                    if (data.hasOwnProperty("turn")) {
                        if (self.status == 0) {
                            self.status = 1;
                        }

                        self.lastdata = data;
                        self.datas.push(data);

                        var finished = false;

                        if (self.isediting) {
                            let result = data.turn.candidates.filter((candidate) => candidate.candidate_id == data.turn.primary_candidate_id);

                            if (result.length != 0) {
                                self.status = 3;
                                self.reqstatus.innerText = "Edited";
                                this.dom.classList.remove("warned");
                                self.updateBtnStatusses();
                                self.grow();

                                data.turn.candidates = result;
                                self.lastdata = data;
                            } else {
                                this.dom.classList.remove("warned");
                                this.dom.classList.add("errored");
                                self.reqstatus.innerText = "Script error: Failed";
                                self.errored = true;
                                self.status = 2;
                            }
                            return;
                        }

                        if (data.turn.candidates[0].hasOwnProperty("is_final")) {
                            //because the swipe, the primary candidate is other, so remind to the server
                            if (neo_last_candidate_id != "") {
                                updatePrimaryCandidate(neo_last_candidate_id);
                            }
                        }

                        self.setTurnAndCandidate(data.turn, data.turn.candidates[0]);
                        self.updateBtnStatusses();
                        self.grow();
                    }
                    break;
                }
            }
        }

        setTurnAndCandidate(turn, candidate) {
            this.turn = turn;
            this.candidate = candidate;
            this.botname.innerText = turn.author.name;

            if (candidate.hasOwnProperty("is_final")) {
                this.status = 3;
                this.reqstatus.innerText = "OK";
                this.replyid.innerText = "#" + okmessages;
                this.num = okmessages;
            }

            if (candidate.hasOwnProperty("editor")) {
                this.reqstatus.innerText = "Edited";
            }

            if (candidate.hasOwnProperty("safety_truncated")) {
                this.status = 3;
                this.reqstatus.innerText = "Filtered";
                this.dom.classList.add("warned");

                if (!neo_sended && (neo_last_turn != null)) {
                    neo_sended = true;
                    createAnnotation(neo_last_turn.turn_key, neo_last_candidate_id);
                }
            }

            if (candidate.hasOwnProperty("raw_content")) {
                this.botmsg.value = ((candidate.raw_content.indexOf("﻿") != -1 ) ? "(Zero width) " : "") + candidate.raw_content;
                this.rawmsg.innerText = candidate.raw_content;
            } else {
                this.dom.classList.remove("warned");
                this.dom.classList.add("errored");
                this.errored = true;
                this.status = 2;
            }

            this.highlight();
            //this.translate();
        }

        async translate() {
            var translatedText = await translate(this.rawmsg.innerHTML, "lt", "en", "text");
            if (translatedText != null) {
                this.rawmsg.innerHTML = translatedText;
            }
        }

        highlight() {
            let parsed = parseAndFindCoincidences(this.botmsg.value, true);
            let txt = parsed.newtext;
            let split = txt.split(" ");
            var highlight_words = [...highlight_words_cache];

            parsed.coincidences.forEach((value, key) => {
                highlight_words.push([("[" + key + "]")]);
            });

            split.forEach(function(word_orig) {
                let result = word_orig;
                highlight_words.forEach(function (word) {
                    if (word_orig.toLowerCase().indexOf(word[0].toLowerCase()) == 0) {
                        var col = (word.length > 1) ? word[1] : HIGHLIGHT_DEFAULT_COLOR;
                        txt = txt.replaceAll(word_orig.toLowerCase(), "<span style='color:" + col + ";'>" + word_orig + "</span>");
                    }
                });
            });
            this.rawmsg.innerHTML = txt;
        }

        grow() {
            var elem = this.dom.querySelector("textarea");
            elem.style.height = "5px";
            elem.style.height = (elem.scrollHeight) + "px";
        }

        informHTTPError(code) {
            this.dom.classList.add("errored");
            this.reqstatus.innerText = "HTTP " + code;
        }

        informDisconnect(code) {
            if (this.status == 1 || this.status == 0) {
                this.dom.classList.add("errored");
                this.reqstatus.innerText = "Error: Ended by disconnect: " + code;
                this.status = 2;
                this.errored = true;

                activerequests = Math.max(0, activerequests - 1);
            }
        }

        neoError(neoErrorData) {
            if (this.status == 1 || this.status == 0) {
                this.dom.classList.add("errored");
                this.reqstatus.innerText = "Error from server: (" + neoErrorData.error_code + ") " + neoErrorData.comment;
                this.status = 2;
                this.errored = true;

                activerequests = Math.max(0, activerequests - 1);

                if (neoErrorData.error_code == 429) {
                    setAllowGenerating(false);
                    this.reqstatus.innerText = "Denied by server - Possible swipe limit reached (30)";
                }
            }
        }

        setAsMessage(msg) {
            if (this.status == 1 || this.status == 0) {
                this.status = 2;
                this.updateBtnStatusses();
            }
            this.reqstatus.innerText = msg
        }

        setAsCategory(authors, turns, timestamp) {
            this.status = 8;
            this.isCategory = true;
            this.turns = turns;
            let authorsnames = new Set(authors.map(a => a.name));
            this.reqstatus.innerText = Array.from(authorsnames).join(",") + " " + timeAgo(timestamp);
            this.updateBtnStatusses();
        }

        onClick(event) {
            var self = this;

            if (this.status !== 8) return;

            this.ishided = !this.ishided;
            if (this.ishided) {
                this.linkedbubbles.forEach(bubble => {
                    bubble.selfDestroy();
                });
                this.linkedbubbles = [];
                return;
            }

            let reversed_turns = [...this.turns];
            reversed_turns.reverse(); //for better reading

            var i = 1;

            reversed_turns.forEach((turn) => {
                var candidate_bubbles = [];

                turn.candidates.forEach(candidate => {
                    var newbubble = new bubbleDOMController();
                    newbubble.setTurnAndCandidate(turn, candidate);
                    newbubble.status = 9;
                    newbubble.turns = self.turns;
                    newbubble.updateBtnStatusses();
                    newbubble.grow();
                    newbubble.replyid.innerText = "";

                    candidate_bubbles.push(newbubble);
                    self.linkedbubbles.push(newbubble);

                    if (turn.hasOwnProperty("primary_candidate_id") && turn.primary_candidate_id != candidate.candidate_id) {
                        newbubble.dom.style.marginLeft = "45px";
                        newbubble.dom.style.opacity = "80%";
                    }
                });

                var primary_bubbles = candidate_bubbles.filter(bubble => turn.primary_candidate_id === bubble.candidate.candidate_id );

                primary_bubbles.forEach(primary_bubble => {
                    var container = document.createElement("div");
                    container.style = "position:relative;overflow:hidden";

                    primary_bubble.container = container;
                    primary_bubble.dom.style.marginTop = "0px";
                    primary_bubble.dom.style.marginLeft = "25px";

                    container.appendChild(primary_bubble.dom);
                    self.dom.parentElement.insertBefore(primary_bubble.container, self.dom.nextSibling);

                    if (primary_bubble.turn.candidates.length > 1) {
                        i++;
                        var sep = document.createElement("div");
                        sep.style="position:absolute;top:0;left:26px;backgroundd:white;width:10px;height:100%";

                        var hue = (i * 20.0);
                        var saturation = 0.5;
                        var value = 0.7;

                        var color = hsvToRgb(hue, saturation, value);
                        sep.style.backgroundColor = color;
                        sep.style.top = primary_bubble.dom.style.height;
                        primary_bubble.container.appendChild(sep);
                    }

                    candidate_bubbles.forEach(bubble => {

                        if (turn.primary_candidate_id === bubble.candidate.candidate_id) {
                            return;
                        }

                        primary_bubble.container.appendChild(bubble.dom);
                    });
                });
            });
        }

        updateBtnStatusses() {
            let btns = this.dom.querySelector(".topbtns").getElementsByClassName("abtn");
            for (var i = 0; i < btns.length; i++) {
                btns[i].style.display = "none";
            }

            this.dom.querySelector(".bottombtns").style.display = "none";

            switch (this.status) {
                case 1: {
                    //this.dom.querySelector("[data-tag=stopgen]").style.display = "block";
                    break;
                }
                case 2: {
                    this.dom.querySelector("[data-tag=remove]").style.display = "block";
                    break;
                }
                case 3: {
                    this.rawmsg.style.display = "block";
                    this.botmsg.style.display = "none";

                    if (!this.isCategory) {
                        let btn = this.dom.querySelector("[data-tag=copy]");
                        btn.style.display = "block";
                    }

                    if (!this.sendedtoui) {
                        this.dom.querySelector("[data-tag=sendui]").style.display = "block";

                        if (!this.isediting && current_protocol == PROTOCOL_NEO) {
                            this.dom.querySelector("[data-tag=editcan]").style.display = "block";
                        }
                    }
                    break;
                }
                case 4: {
                    if (this.stopped) {
                        let btn = this.dom.querySelector("[data-tag=stopgen]");
                        btn.style.display = "block";
                        btn.innerText = "Stopped";
                    }
                    break;
                }
                case 5: {
                    if (!this.sendedtoui) {
                        this.dom.querySelector(".bottombtns").style.display = "flex";
                    }
                    break;
                }
                case 6: {
                    if (!this.sendedtoui) {
                        this.isediting = true;
                        this.dom.querySelector(".bottombtns").style.display = "flex";
                        let btn = this.dom.querySelector("[data-tag=editsave]");
                        btn.innerText = "Saving...";
                        btn = this.dom.querySelector("[data-tag=editcancel]");
                        btn.style.display = "none";
                        this.rawmsg.innerText = this.botmsg.value;

                        createNeoSwipeEdit(this, this.botmsg.value);
                    }
                    break;
                }

                case 7:
                case 8: {
                    let btn = this.dom.querySelector("[data-tag=gocan]");
                    btn.style.display = "block";

                    if (!this.isCategory) {
                        btn = this.dom.querySelector("[data-tag=copy]");
                        btn.style.display = "block";
                    }
                    break;
                }

                case 9: {
                    let btn = this.dom.querySelector("[data-tag=clone]");
                    btn.style.display = "block";

                    if (!this.isCategory) {
                        btn = this.dom.querySelector("[data-tag=copy]");
                        btn.style.display = "block";
                    }
                    break;
                }
            }
        }

        selfDestroy() {
            if (this.container != null) {
                this.container.parentNode.removeChild(this.container);
                this.container = null;
            }
            if (this.dom != null) {
                this.dom.parentNode.removeChild(this.dom);
                this.dom = null;
            }
        }

        onBtnClick(e) {
            var self = this;
            e.stopImmediatePropagation();

            if (neo_waiting_for_turn) {
                alert("You need to wait m8");
                return;
            }

            switch (e.target.getAttribute("data-tag")) {
                case "remove": {
                    self.selfDestroy();
                    break;
                }
                case "sendui": {
                    if (!self.sendedtoui) {
                        self.sendedtoui = true;
                        if (current_protocol == PROTOCOL_LEGACY) {
                            override_primary = self.lastchunk.replies[0].uuid;
                            readyqueue.push(self.streamcontroller.stream);
                        } else {
                            //200ms to give you time to capture the request
                            let newver = ++req_version;
                            req_version = newver;
                            neo_capture_next_request = true;

                            setTimeout(function() {
                                neo_swiper = neoSwiperController();
                                neo_capture_next_request = false; //give up
                            }, 200);

                            if (self.lastdata.turn.candidates[0].hasOwnProperty("raw_content")) {
                                self.lastdata.turn.candidates[0].raw_content = parseAndFindCoincidences(self.lastdata.turn.candidates[0].raw_content, true).newtext;
                            }

                            neo_readyqueue.push(self.lastdata);
                            var candidate_id = self.lastdata.turn.candidates[0].candidate_id;
                            neo_last_candidate_id = candidate_id
                            neo_last_chosen_turn = self.lastdata.turn;
                            updatePrimaryCandidate(candidate_id);
                        }

                        swipeNext();
                    }
                    break;
                }
                case "stopgen": {
                    //Never finished
                    if (!self.stopped) {
                        cancelMessage(lastbody.history_external_id, self.lastchunk.replies[0].uuid, self.lastchunk.replies[0].text.length).then(function() {
                            self.status = 4;
                        });
                        self.stopped = true;
                    }
                    break;
                }
                case "editcan": {
                    self.status = 5;
                    self.rawmsg.style.display = "none";
                    self.botmsg.style.display = "flex";
                    self.dom.querySelector("textarea").removeAttribute("readonly");
                    self.grow();
                    break;
                }
                case "editcancel": {
                    self.status = 3;
                    self.dom.querySelector("textarea").setAttribute("readonly", "");
                    self.botmsg.value = self.lastdata.turn.candidates[0].raw_content;
                    self.grow();
                    break;
                }
                case "editsave": {
                    self.isediting = true;
                    self.status = 6;
                    self.dom.querySelector("textarea").setAttribute("readonly", "");
                    self.grow();
                    break;
                }
                case "gocan": {
                    if (self.isCategory) {
                        var turn = self.turns[0];
                        gotoChat(turn.author.author_id, turn.turn_key.chat_id);
                        break;
                    }
                    var site = getCurrentSite();

                    switch(site) {
                        case NEXT: {
                            neo_capture_next_request = true;

                            setTimeout(function() {
                                 neo_capture_next_request = false;
                            }, 10);
                            break;
                        }
                    }
                    gotoSwipeNum(self.num);
                    updatePrimaryCandidate(self.candidate.candidate_id);
                    break;
                }
                case "clone": {
                    function cloneAtPoint() {
                        var maxIndex = self.turns.findIndex(
                            turn =>
                            turn.candidates.some(
                                candidate =>
                                candidate.candidate_id == self.candidate.candidate_id
                            )
                        );

                        if (maxIndex == -1) {
                            alert("Sorry, i can't find the message. Error ocurred!");
                            return;
                        }

                        //If the selected candidate is not primary
                        self.turns[maxIndex].primary_candidate_id = self.candidate.candidate_id;

                        var slicedTurns = self.turns.slice(maxIndex);

                        var task = new Task("Clone chat");
                        task.removeAtComplete = false;
                        task.addStep((task) => {
                            return new Promise(async (resolve, reject) => {
                                if (user_info == null) {
                                    reject({info: "No user info"});
                                    return;
                                }

                                try {
                                    var allTurns = { turns : slicedTurns };
                                    task.changeTitle("Requesting...");
                                    var newChatId = await requestCopyFromNeo(self.turns[maxIndex].turn_key.chat_id, self.turns[maxIndex].turn_key.turn_id);

                                    if (newChatId === undefined) {
                                        newChatId = await buildChatAppender(task, user_info.id.toString(), char_id, allTurns);
                                    }

                                    task.hasResults = true;
                                    task.result.charId = char_id;
                                    task.result.chatId = newChatId;
                                    task.removeColor();
                                    task.changeTitle("Clone chat complete");
                                    resolve();
                                } catch(ex) {
                                    reject(ex);
                                }
                            });
                        });

                        task.events.on("func", (obj) => {
                            var type = obj.func;
                            if (type === "view") {
                                var chatId = obj.task.result.chatId;
                                var charId = obj.task.result.charId;
                                gotoChat(charId, chatId);
                            }
                        });

                        task_controller.appendTask(task);
                    }

                    var alert = new generic_alert(
                        null,
                        "Confirmation",
                        "This will create a new clone of this chat from the beginning to this point. Are you sure?<br>(Can take a while, you can continue chatting)",
                        [{
                            text: "Yes",
                            function: cloneAtPoint
                        },{
                            text: "No",
                            function: null
                        }]);

                    alert.ismodal = true; alert.append();
                    break;
                }

                case "copy": {
                    async function copy() {
                        let btn = self.dom.querySelector("[data-tag=copy]");
                        try {
                            await navigator.clipboard.writeText(self.rawmsg.innerText);
                            btn.innerText = "Copied";
                        } catch (err) {
                            btn.innerText = "Error";
                        }

                        setTimeout(function () { btn.innerText = "Copy" }, 1000);
                    }
                    copy();
                    break;
                }
            }

            self.updateBtnStatusses();
        }
    }

    function tryGetNewMessage(args, attempt, mode) {
        var bubble = new bubbleDOMController(attempt);
        var msgbox = mainelem.querySelector("#cresponses .details");
        msgbox.innerHTML = "";
        msgbox.appendChild(bubble.dom);

        if (attempt == 0) {
            last_user_msg_uuid = null;
        } else {
            var json = JSON.parse(args.body);
            json.retry_last_user_msg_uuid = last_user_msg_uuid;
            args.body = JSON.stringify(json);
        }

        var req = createAndCancel(args, false);
        let newver = ++req_version;
        req_version = newver;
        readyqueue = [];
        okmessages = 0;

        req.then(function(result) {
            bubble.selfDestroy();

            result.req.then(function(response) {
                readyqueue.push(response.body);
            });

            var chunk = result.chunk;
            var modified = JSON.parse(JSON.stringify(args));

            if (!(chunk.last_user_msg_uuid == null) && !(chunk.last_user_msg_uuid == "")) {
                last_user_msg_uuid = chunk.last_user_msg_uuid;
            }

            var modifiedjson = JSON.parse(modified.body);
            modifiedjson.parent_msg_uuid = chunk.last_user_msg_uuid;

            modified.body = JSON.stringify(modifiedjson);

            requestSwipes(modified, newver);
        });
        req.catch(function(chunk) {
            bubble.selfDestroy();

            if (typeof(chunk) == "object" && chunk.hasOwnProperty("last_user_msg_uuid")) {
                last_user_msg_uuid = chunk.last_user_msg_uuid;

                setTimeout(function() {
                    tryGetNewMessage(args, attempt + 1, mode);
                }, Math.min(2000, 5 + (attempt * 10)));
            } else {
                alert("Unexpected fatal error. Please reload the page");
            }
        });
        return req;
    }

    function requestSwipes(body, version) {
        last_params = body;
        for (var i = 0; i < 5; i++) {
            setTimeout(function() {
                createAndRegister(body, version);
            }, 1000 + (i * 50));
        }
    }

    function swipeNext() {
        document.body.dispatchEvent(
            new KeyboardEvent('keydown', {
                bubbles: true,
                key: 'ArrowRight',
            })
        );
    }

    function swipeBack() {
        document.body.dispatchEvent(
            new KeyboardEvent('keydown', {
                bubbles: true,
                key: 'ArrowLeft',
            })
        );
    }

    function constructAwaiter() {

        return new Promise((resolve, reject) => {
            var tmer = null;

            function check() {
                if (readyqueue.length > 0) {
                    clearInterval(tmer);
                    let res = new Response(readyqueue.shift(), {
                        "status": 200
                    });
                    disableControl(false);
                    resolve(res);
                }
            }
            tmer = setInterval(check, 50);
        });
    }

    function disableControl(disableControl) {
        try {
            if (disableControl) {
                mainelem.querySelector("#ccontrol").classList.add("modechanger_disabled");
            } else {
                mainelem.querySelector("#ccontrol").classList.remove("modechanger_disabled");
            }
        } catch (ex) {}
    }

    function disableModeChanger(disableMode) {
        try {
            if (disableMode) {
                mainelem.querySelector("#cmode").classList.add("modechanger_disabled");
            } else {
                mainelem.querySelector("#cmode").classList.remove("modechanger_disabled");
            }
        } catch (ex) {}
    }

    function constructStreamController(response) {
        let reader = response.body.getReader();
        let emitter = new EventEmitter();
        var lastchunk = null;
        var chunkcount = 0;
        let stream = new ReadableStream({
            start(controller) {
                function pump() {
                    reader.read().then(({
                        done,
                        value
                    }) => {
                        if (done) {
                            controller.close();
                            if (chunkcount == 0) {
                                emitter.dispatch("result", {
                                    "status": "errored",
                                    "error": "Empty response"
                                });
                            } else {
                                emitter.dispatch("result", {
                                    "status": "done"
                                });
                            }
                            return;
                        }

                        let text = new TextDecoder().decode(value);

                        if (chunkcount == 0 && ((text.length == 0) || (text.charCodeAt(0) == 60))) //<
                        {
                            controller.close();
                            emitter.dispatch("result", {
                                "status": "errored",
                                "error": "Unexpected response"
                            });
                            return;
                        }

                        let clean = text.split(String.fromCharCode(10));
                        let chunks = [];

                        for (var i = 0; i < clean.length; i++) {
                            try {
                                chunks.push(JSON.parse(clean[i]));
                                chunkcount++;
                            } catch (ex) {}
                        }

                        if (chunks.length != 0) {
                            let chunk = chunks[chunks.length - 1];

                            if (last_user_msg_uuid != null) {
                                chunk.last_user_msg_uuid = last_user_msg_uuid;
                            }

                            if (chunk.hasOwnProperty("abort")) {
                                emitter.dispatch("result", {
                                    "status": "errored",
                                    "error": chunk.error,
                                    "last_user_msg_uuid": chunk.last_user_msg_uuid
                                });

                                if (lastchunk != null) {
                                    lastchunk.is_final_chunk = true;
                                    value = new TextEncoder().encode(JSON.stringify(lastchunk) + String.fromCharCode(13, 10));
                                    emitter.dispatch("chunk", lastchunk);
                                }
                            } else {
                                lastchunk = chunk;

                                value = new TextEncoder().encode(JSON.stringify(lastchunk) + String.fromCharCode(13, 10));
                                emitter.dispatch("chunk", chunk);

                                if (chunk.is_final_chunk) {
                                    emitter.dispatch("result", {
                                        "status": "done"
                                    });
                                }
                            }
                        }

                        controller.enqueue(value);
                        pump();
                    })
                }
                pump();
            }
        });

        return {
            "stream": stream,
            "events": emitter
        };
    }

    function cancelMessage(history, uuid, letters) {
        let newopts = {};
        newopts.method = "POST";
        newopts.headers = lastheaders;
        newopts.body = JSON.stringify({
            "history_id": history,
            "msg_uuid": uuid,
            "num_letters": letters
        });
        var req = fetchFn(CANCEL_URL, newopts);
        return req;
    }

    function createAndRegister(params, version) {
        if (version == req_version) {
            if (activerequests >= 2 || !allow_generating) {
                return;
            }
            let max = 100;
            if (okmessages >= max) {
                return;
            }
            activerequests++;
            var req = createAndBuild(params);
            req.then(function(chunk) {
                activerequests = Math.max(0, activerequests - 1);
                okmessages++;
                createAndRegister(params, version);
            });
            req.catch(function(err) {
                activerequests = Math.max(0, activerequests - 1);

                if (err.status != 429) {
                    createAndRegister(params, version);
                }
            });
        }
    }

    function createAndBuild(params) {
        return new Promise((resolve, reject) => {
            var url = STREAMING_URL;
            var mode = getCurrentMode();

            if (mode == "nsfw") {
                url = STREAMING_URL.replace("/streaming/", "/non-streaming/");
            }

            var req = fetchFn(url, params);
            var lastchunk = null;
            var bubble = new bubbleDOMController();
            mainelem.querySelector("#cresponses .details").appendChild(bubble.dom);

            req.then(function(res) {
                if (res.ok) {
                    let controller = constructStreamController(res);
                    bubble.assignController(controller);
                    controller.events.on("chunk", function(chunk) {
                        lastchunk = chunk;
                        if (chunk.is_final_chunk) {
                            resolve(chunk);
                        }
                    });
                    controller.events.on("result", function(result) {
                        switch (result.status) {
                            case "errored": {
                                reject({
                                    "status": 200,
                                    "error": new Error(result.error)
                                });
                                break;
                            }
                            case "done": {
                                resolve(lastchunk);
                            }
                        }
                    });
                } else {
                    bubble.informHTTPError(res.status);
                    reject({
                        "status": res.status,
                        "error": null
                    });
                }
            });
            req.catch(function(error) {
                reject({
                    "status": 0,
                    "error": error
                });
            });
        });
    }

    function createAndCancel(params, sendcancel) {
        return new Promise((resolve, reject) => {
            var req = fetchFn(STREAMING_URL, params);
            var lastchunk = null;
            var sendedcancel = !sendcancel;
            req.then(function(res) {
                let controller = constructStreamController(res.clone());
                controller.events.on("chunk", function(chunk) {
                    lastchunk = chunk;
                    if (chunk.is_final_chunk) {
                        resolve({
                            "chunk": chunk,
                            "req": req
                        });
                    } else {
                        if (!sendedcancel) {
                            cancelMessage(lastbody.history_external_id, chunk.replies[0].uuid, 1).catch(function(e) {
                                reject(new Error("Failed to cancel"));
                            }).then(function() {
                                sendedcancel = true
                            });
                        }
                    }
                });
                controller.events.on("result", function(result) {
                    switch (result.status) {
                        case "errored": {
                            reject(result);
                            break;
                        }
                        case "done": {
                            resolve({
                                "chunk": lastchunk,
                                "req": req
                            });
                        }
                    }
                });
            });
            req.catch(function(error) {
                reject(error);
            });
        });
    }

    function sendAPrompt(json) {
        try {
            if (custom_prompt != null) {
                neo_ignore_delete_prompt = true;
                removeTurns([custom_prompt.turn_key.turn_id], true);
                custom_prompt = null;
            }

            if (custom_prompt == null) {
                var promp_t = getLocalSettingSaved("ljailbreak", "");

                if (promp_t.length > 1) {
                    var objectcloned = JSON.parse(JSON.stringify(json));
                    objectcloned.request_id = uuidV4();
                    objectcloned.payload.turn.turn_key.turn_id = uuidV4();
                    objectcloned.payload.turn.candidates[0].candidate_id = uuidV4();
                    objectcloned.command = "create_turn";
                    objectcloned.payload.turn.candidates[0].raw_content = "###" + promp_t;
                    delete objectcloned.payload.turn.primary_candidate_id;
                    custom_prompt = objectcloned.payload.turn;
                    neo_socket.send(JSON.stringify(objectcloned));
                    return true;
                }
            }

            return false;
        } catch(ex) {
            console.warn(ex);
            return false;
        }
    }

    function getCurrentMode() {
        var value = mainelem.querySelector('input[name="drone"]:checked').value;
        return value;
    }

    function switchVisibility() {
        ishided = !ishided;
        var bound = getLocalSettingSaved("dock_pos", "right");

        var width = mainelem.clientWidth;

        if (bound === "left") {
            width *= -1;
        }

        if (!ishided) {
            mainelem.querySelector(".ptrk_hide").removeAttribute("hided");
            mainelem.style.transform = "";
        } else {
            mainelem.querySelector(".ptrk_hide").setAttribute("hided", "");
            mainelem.style.transform = "translateX(" + width + "px)";
        }
    }

    function hideFieldsExcept(arr) {
        var fields = ["#csettings", "#cresponses", "#ccontrol", "#ctools", "#chistory"];
        fields.forEach(fieldname => {
            mainelem.querySelector(fieldname).style.display = "none";
        });
        arr.forEach(fieldname => {
            mainelem.querySelector(fieldname).style.display = "flex";
        });
    }

    function timeAgo(now, time = null) {
        const periods = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year', ''];
        const lengths = [60, 60, 24, 7, 4.35, 12, 10];

        now = Math.floor(now / 1000);

        if (time === null) {
            time = Math.floor(Date.now() / 1000);
        }

        if (parseInt(time) <= 0) {
            return 'Never';
        }

        let difference = Math.abs(time - now);

        let j;
        for (j = 0; difference >= lengths[j] && j < lengths.length - 1; j++) {
            difference /= lengths[j];
        }

        difference = Math.round(difference);

        if (difference !== 1) {
            periods[j] += "s";
        }

        return difference + ' ' + periods[j] + " ago";
    }


    function onFunctionButton(e) {
        switch (e.target.getAttribute("data-tag")) {
            case "stop_gen": {
                setAllowGenerating(false);
                break;
            }
            case "resume_gen": {
                setAllowGenerating(true);
                if (last_params != null && current_protocol == PROTOCOL_LEGACY) {
                    requestSwipes(last_params, req_version);
                }
                break;
            }
            case "deleteresend": {
                ignore_delete = true;
                setAllowGenerating(false);
                disableControl(true);
                removeTurns([neo_last_turn.turn_key.turn_id]);
                break;
            }
            case "settings": {
                let settings = mainelem.querySelector("#csettings");
                let ishided = settings.style.display === "none";
                hideFieldsExcept(ishided ? ["#csettings"] : ["#cresponses", "#ccontrol"]);

                var cnf_highlight = getLocalSettingSaved("lhighlightwords", "");
                mainelem.querySelector('[name="lhighlightwords"]').value = cnf_highlight;

                var cnf_jailbreak = getLocalSettingSaved("ljailbreak", "");
                mainelem.querySelector('[name="ljailbreak"]').value = cnf_jailbreak;
                break;
            }
            case "tools": {
                let settings = mainelem.querySelector("#ctools");
                let ishided = settings.style.display === "none";
                hideFieldsExcept(ishided ? ["#ctools"] : ["#cresponses", "#ccontrol"]);
                break;
            }
            case "history": {
                let settings = mainelem.querySelector("#chistory");
                let ishided = settings.style.display === "none";
                hideFieldsExcept(ishided ? ["#chistory"] : ["#cresponses", "#ccontrol"]);
                break;
            }
            case "save_settings": {
                var form = mainelem.querySelector("#csettings form");
                var formData = new FormData(form);
                var newConfig = {};

                for (var entry of formData.entries()) {
                    console.log(entry);

                    var valid = false;
                    switch(entry[0]) {
                        case "ljailbreak":
                        case "lhighlightwords":
                        case "characterselector":
                        case "ignoreedited":{
                            valid = true;
                            break;
                        }
                    }

                    if (valid) {
                        var cnf = {};
                        cnf[entry[0]] = entry[1];
                        Object.assign(newConfig, cnf);
                    }
                }

                saveToLocalStorage(newConfig);
                refreshHighlightConfig();
                break;
            }

            case "dockposition": {
                switch (e.target.getAttribute("value")) {
                    case "lleft": {
                        dockLeft();
                        saveToLocalStorage({ dock_pos : "left" });
                        break;
                    }
                    case "lright": {
                        dockRight();
                        saveToLocalStorage({ dock_pos : "right" });
                        break;
                    }
                }
                break;
            }

            case "characterselector": {
                switch (e.target.getAttribute("value")) {
                    case "lyes": {

                        if (dropdown !== null) {
                            break;
                        }

                        saveToLocalStorage({ characterselector : "lyes" });
                        appendCharacterSelector();
                        break;
                    }
                    case "lno": {
                        saveToLocalStorage({ characterselector : "lno" });
                        alert("Too lazy to remove the controller without bugging it all, reload the page to remove it");
                        break;
                    }
                }
                break;
            }

            case "duplicate_chat": {
                if (current_protocol == PROTOCOL_LEGACY) {
                    alert("This option is not avaiable for legacy chat.");
                    return;
                }
                if (last_chat_id == null) {
                    alert("No chat detected!");
                    return;
                }
                requestDuplicateChat();
                break;
            }

            case "export_chat": {
                if (current_protocol == PROTOCOL_LEGACY) {
                    alert("This option is not avaiable for legacy chat.");
                    return;
                }
                if (last_chat_id == null) {
                    alert("No chat detected!");
                    return;
                }
                requestExportChat();
                break;
            }

            case "delete_chat": {
                if (current_protocol == PROTOCOL_LEGACY) {
                    alert("This option is not avaiable for legacy chat.");
                    return;
                }
                if (last_chat_id == null) {
                    alert("No chat detected!");
                    return;
                }
                deleteAllChatMessages();
                break;
            }

            case "remove_jailbreak": {
                if (current_protocol == PROTOCOL_LEGACY) {
                    alert("This option is not avaiable for legacy chat.");
                    return;
                }
                if (last_chat_id == null) {
                    alert("No chat detected!");
                    return;
                }
                deleteAllChatMessages(true);
                break;
            }

            case "force_legacy": {
                if (getCurrentSite() != BETA) {
                    alert("This is only for the old site!");
                    return;
                }

                document.location.href = "https://old.character.ai/chat?char=" + char_id + "&hist=" + uuidV4();
                break;
            }

            case "ignoreedited": {
                alert("Changes will apply the next reload of page");
                break;
            }

            case "create_from_import": {
                mainelem.querySelector('#importChatInput').click();
                break;
            }
        }
    }

    function buildChatAppender(task, userId, characterId, turnData) {
        return new Promise(async (resolve, reject) => {
            try {
                task.removeColor();
                task.changeTitle("Connecting...");
                var tmp_socket = new WebSocket(NEO_URL);

                await new Promise((resolve, reject) => {
                    tmp_socket.addEventListener("open", evt => {
                        resolve();
                    }, { once: true });
                    tmp_socket.addEventListener("error", error => {
                        reject(new Error("Socket error"));
                    }, { once: true });
                });

                if (task.isCancelled) {
                    resolve(0);
                    return;
                }

                var chat_id = uuidV4();
                var start = new Date().getTime();

                await sendAndExpect(tmp_socket, "create_chat", {
                    "chat": {
                        "chat_id": chat_id,
                        "creator_id": userId,
                        "visibility": "VISIBILITY_PRIVATE",
                        "character_id": characterId,
                        "type": "TYPE_ONE_ON_ONE"
                    },
                    "with_greeting": false
                });

                var turns = turnData.turns.reverse();
                var errors = 0;

                while(turns.length > 0) {

                    if (task.isCancelled) {
                        resolve(chat_id);
                        return;
                    }

                    var turn = turns.shift();
                    var isHuman = turn.author.hasOwnProperty("is_human") && turn.author.is_human;
                    var primary_candidates = turn.candidates.filter(candidate => candidate.candidate_id === turn.primary_candidate_id );

                    if (primary_candidates.length == 0) {
                        console.warn("no primary found when appending turn");
                        continue;
                    }

                    primary_candidates = primary_candidates.map(candidate => {
                        candidate.candidate_id = uuidV4();
                        return candidate;
                    });

                    if (isHuman) {
                        await sendAndExpect(tmp_socket, "create_turn", {
                            "num_candidates": 1,
                            "character_id": characterId,
                            "turn": {
                                "turn_key": {
                                    "turn_id": uuidV4(),
                                    "chat_id": chat_id
                                },
                                "author": {
                                    "author_id": userId,
                                    "is_human": true,
                                    "name": "WhoCares"
                                },
                                "candidates": primary_candidates,
                                "primary_candidate_id" : primary_candidates[0].candidate_id
                            }
                        });
                    }
                    else if(!isHuman) {
                        try {
                            var who = turn.author.author_id;

                            if (turnData.hasOwnProperty("override_characters")) {
                                if (turnData.override_characters.get(turn.author.author_id) !== undefined) {
                                    who = turnData.override_characters.get(turn.author.author_id);
                                }
                            }

                            var response = await sendAndExpect(tmp_socket, "generate_turn", {
                                "num_candidates": 1,
                                "character_id": who,
                                "chat_id": chat_id
                            });

                            var waitPromise = null;

                            if (!response.turn.candidates[0].hasOwnProperty("is_final") || !response.turn.candidates[0].is_final) {
                                waitPromise = waitForTurn(tmp_socket, response.request_id);
                                sendAndExpect(tmp_socket, "abort_generation", {});
                            }

                            if (waitPromise !== null) {
                                await waitPromise;
                            }

                            await sendAndExpect(tmp_socket, "edit_turn_candidate", {
                                "new_candidate_raw_content": primary_candidates[0].raw_content,
                                "turn_key": response.turn.turn_key
                            });
                        } catch (ex) {
                            errors++;

                            if (errors > 2) {
                                reject({info: "Too many errors " + ex.toString()});
                            }
                        }
                    }

                    task.changeTitle(task.title + "... (Turns left: " + turns.length + ")");
                }

                tmp_socket.close();
                resolve(chat_id);
            } catch (exception) {
                reject({info: exception.toString()});
            }
        });
    }

    function requestExportChat() {
        var confirmAl = new generic_alert(
            null,
            "Export chat",
            '<span>Currently not in a readable format. This is intended to be imported only using RYW.<br><br>Format:</span><br><select name="format_export" style="display:flex; margin-right: 5px; flex-direction: column;flex-shrink: 0;flex-grow: 1;"> <option value="format_json" selected>Default (Raw JSON)</option></select>',
            [{
                text: "Export",
                function: function() {
                    var value = confirmAl.uielement.querySelector('select[name="format_export"]').value;
                    var task = new Task("Export chat");
                    task.removeAtComplete = false;
                    task.addStep((task) => {
                        return new Promise(async (resolve, reject) => {

                            try {
                                task.changeTitle("Loading chat... DO NOT INTERACT!");
                                task.addColor("warned");

                                var allTurns = await getAllChatTurns(last_chat_id, true);
                                task.removeColor();

                                const jsonStr = JSON.stringify(allTurns);
                                const blob = new Blob([jsonStr], { type: 'application/json' });

                                const link = document.createElement('a');
                                link.href = URL.createObjectURL(blob);

                                let authorsnames = new Set(allTurns.turns.map(x => x.author.name));
                                let nameParts = Array.from(authorsnames);
                                let date = new Date();

                                nameParts.push("raw_");
                                nameParts.push(date.getMonth() + 1);
                                nameParts.push(date.getDate());
                                nameParts.push(date.getFullYear());

                                link.download = nameParts.join("_") + '.json';

                                task.hasResults = true;
                                task.result.clickUrl = link;
                                task.changeTitle("Export complete");
                                resolve();
                            } catch(ex) {
                                console.log(ex);
                                reject(ex);
                            }
                        });
                    });

                    task.events.on("func", (obj) => {
                        var type = obj.func;
                        if (type === "view") {
                            var urlObj = obj.task.result.clickUrl;
                            urlObj.click();
                        }
                    });

                    task_controller.appendTask(task);
                }
            }]);

        confirmAl.ismodal = true; confirmAl.append();
    }

    function requestDuplicateChat() {

        function duplicateChat() {
            var task = new Task("Duplicate chat");
            task.removeAtComplete = false;
            task.addStep((task) => {
                return new Promise(async (resolve, reject) => {
                    if (user_info == null) {
                        reject({info: "No user info"});
                        return;
                    }

                    try {
                        task.changeTitle("Loading chat... DO NOT INTERACT!");
                        task.addColor("warned");
                        var allTurns = await getAllChatTurns(last_chat_id, true);
                        task.removeColor();
                        task.changeTitle("Requesting...");
                        var lastTurn = allTurns.turns[0];

                        var newChatId = await requestCopyFromNeo(last_chat_id, lastTurn.turn_key.turn_id);

                        if (newChatId === undefined) {
                            newChatId = await buildChatAppender(task, user_info.id.toString(), char_id, allTurns);
                        }

                        task.hasResults = true;
                        task.result.charId = char_id;
                        task.result.chatId = newChatId;
                        task.removeColor();
                        task.changeTitle("Duplicate chat complete");
                        resolve();
                    } catch(ex) {
                        reject(ex);
                    }
                });
            });

            task.events.on("func", (obj) => {
                var type = obj.func;
                if (type === "view") {
                    var chatId = obj.task.result.chatId;
                    var charId = obj.task.result.charId;
                    gotoChat(charId, chatId);
                }
            });

            task_controller.appendTask(task);
        }

        var alert = new generic_alert(
            null,
            "Confirmation",
            "Do you want to clone this chat? (Can took some time)",
            [{
                text: "Yes",
                function: duplicateChat
            },{
                text: "No",
                function: null
            }]);

        alert.ismodal = true; alert.append();
    }

    function deleteAllChatMessages(jailbreakOnly = false) {
        var alert = new generic_alert(
            null,
            "Confirmation",
            (jailbreakOnly ? "Delete automated messages? (User prompt, word changing)" : "Delete all messages of this chat?"),
            [{
                text: "Yes",
                function: async function() {
                    try {
                        var allTurns = await getAllChatTurns(last_chat_id, true);
                        if (!jailbreakOnly) {
                            removeTurns(allTurns.turns.map(x => x.turn_key.turn_id), false);
                        } else {
                            var toremove = [];
                            allTurns.turns.forEach(turn => {
                                turn.candidates.forEach(candidate => {
                                    if (candidate.hasOwnProperty("raw_content")) {
                                        if ((candidate.raw_content.indexOf("#!#") === 0) || (candidate.raw_content.indexOf("###") === 0)) {
                                           toremove.push(turn.turn_key.turn_id);
                                        }
                                    }
                                });
                            });

                            removeTurns(toremove, false);
                        }
                        neo_waiting_for_delete = false;
                    } catch(ex) {
                        console.warn(ex);

                        var alert2 = new generic_alert(
                            null,
                            "Error",
                            "Try again",
                            [{
                                text: "Close",
                                function: null
                            }]);

                        alert2.ismodal = true; alert2.append();
                    }
                }
            },{
                text: "No",
                function: null
            }]);

        alert.ismodal = true; alert.append();
    }

    function onImportFileSubmit(e) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const jsonData = JSON.parse(e.target.result);

                    if (!jsonData.hasOwnProperty("turns")) {
                        throw new Error("Unrecognized format");
                    }

                    jsonData.override_characters = new Map();

                    var charactersDom = document.createElement("div");
                    charactersDom.innerHTML = '<b>Import options</b><br>Override Characters<br><div data-tag="characters" style="height:200px;overflow:hidden;overflow-y:auto"></div>';

                    var charSlotDom = document.createElement("div");
                    let charhtml = '<div data-tag="charOption" style="width:100%;display: flex;align-items: center;"> <img style="height: 45px;width: 45px;border-radius: 45px;object-fit: contain;"><div style="display:flex;align-items: center;justify-content: space-between;width: 100%;"><b style="pointer-events:none" data-tag="charname">Senko</b> <div class="abtn" data-tag="changebtn">Change</div> </div></div>';
                    charSlotDom.innerHTML = charhtml;

                    var ids = [];
                    var authors = jsonData.turns.map(x => x.author).filter(y => !y.hasOwnProperty("is_human") && (ids.indexOf(y.author_id) == -1) && ids.push(y.author_id));
                    var overrides = [];

                    authors.forEach(function(each) {

                        let newUiElement = charSlotDom.cloneNode(true);
                        newUiElement.querySelector("[data-tag=charname]").innerText = each.name;
                        newUiElement.querySelector("[data-tag=charOption]").setAttribute("data-externalid", each.author_id);

                        getCharacterInfo(each.author_id, function(charData) {
                            newUiElement.querySelector("img").src = (charData.avatar_file_name.length > 1) ? ("https://characterai.io/i/80/static/avatars/" + charData.avatar_file_name) : "https://characterai.io/i/80/static/avatars/uploaded/2022/12/6/j7C6apwVP7XPVkqssQH5VPlFQ6AGBZFBpJKT9NIKYlc.webp";
                        });

                        newUiElement.querySelector("[data-tag=changebtn]").addEventListener("click", function(e) {
                            e.stopPropagation();

                            var smodal = new SelectCharacterFakeModal(character_cache, function(external_id) {
                                getCharacterInfo(external_id, function(charData) {
                                    newUiElement.querySelector("[data-tag=charname]").innerText = each.name + " - > " + charData.participant__name;
                                    newUiElement.querySelector("img").src = (charData.avatar_file_name.length > 1) ? ("https://characterai.io/i/80/static/avatars/" + charData.avatar_file_name) : "https://characterai.io/i/80/static/avatars/uploaded/2022/12/6/j7C6apwVP7XPVkqssQH5VPlFQ6AGBZFBpJKT9NIKYlc.webp";
                                });
                                jsonData.override_characters.set(each.author_id, external_id);
                                overrides.push(external_id);
                            });
                        });

                        charactersDom.querySelector("[data-tag=characters]").appendChild(newUiElement);
                    });

                    var alert = new generic_alert(
                        null,
                        "Create chat from import",
                        charactersDom,
                        [{
                            text: "Start",
                            function: function() {
                                console.log("Creating new chat", jsonData);

                                var task = new Task("Create chat");
                                task.removeAtComplete = false;
                                task.addStep((task) => {
                                    return new Promise(async (resolve, reject) => {
                                        if (user_info == null) {
                                            reject({info: "No user info"});
                                            return;
                                        }

                                        try {
                                            var newChatId = await buildChatAppender(task, user_info.id.toString(), (overrides.length > 0) ? overrides[0] : authors[0].author_id, jsonData);

                                            task.hasResults = true;
                                            task.result.charId = (overrides.length > 0) ? overrides[0] : authors[0].author_id;
                                            task.result.chatId = newChatId;
                                            task.removeColor();
                                            task.changeTitle("Create chat complete");
                                            resolve();
                                        } catch(ex) {
                                            reject(ex);
                                        }
                                    });
                                });

                                task.events.on("func", (obj) => {
                                    var type = obj.func;
                                    if (type === "view") {
                                        var chatId = obj.task.result.chatId;
                                        var charId = obj.task.result.charId;
                                        gotoChat(charId, chatId);
                                    }
                                });

                                task_controller.appendTask(task);
                            }
                        },{
                            text: "Cancel",
                            function: null
                        }]);

                    alert.ismodal = true; alert.append();
                } catch (error) {
                    console.error(error);

                    var alert2 = new generic_alert(
                        null,
                        "Uh oh!",
                        error,
                        [{
                            text: "Close",
                            function: null
                        }]);

                    alert2.ismodal = true; alert2.append();
                }
            };
            reader.readAsText(file);
        }
    }

    function onModeChange(e) {
        var value = e.target.value;
        switch(value) {
            case "sfw": {
                mainelem.querySelector("#cconfuser").style.display = "none";
                mainelem.querySelector("#cconfuser_value").value = "0";
                changeConfuserLevel(1);
                confuser_level = 0;
                hideFieldsExcept(["#cresponses", "#ccontrol"]);
                break;
            }
            case "nsfw": {
                confuser_level = 1;
                hideFieldsExcept(["#cresponses", "#ccontrol"]);
                break;
            }
        }
    }

    function changeConfuserLevel(val) {
        var level = parseInt(val, 10);
        confuser_level = level;
        var str = "";
        mainelem.querySelector("#cconfuserlevel").innerText = str;
    }

    function onConfuserSlideChange(e) {
        changeConfuserLevel(e.target.value);
    }


    function dockLeft() {
        mainelem.classList.add("ptrk_side_left");
        mainelem.querySelector(".ptrk_hide").classList.add("ptrk_hide_side_left");
    }

    function dockRight() {
        mainelem.classList.remove("ptrk_side_left");
        mainelem.querySelector(".ptrk_hide").classList.remove("ptrk_hide_side_left");
    }

    function refreshHighlightConfig() {
        highlight_words_cache = [];

        var str = getLocalSettingSaved("lhighlightwords", "");
        var split = str.split("\n");
        split.forEach(function(highlightCnf) {
            if (highlightCnf.length > 1) {
                highlight_words_cache.push(highlightCnf.split(";"));
            }
        });
    }

    function refreshCurrentState() {
        setTimeout(refreshCurrentState, 500);
        let path = document.location.href;

        if (path != current_state) {
            onStateChanged(document.location.pathname);
        }
    }

    function onStateChanged(state) {
        current_state = document.location.href;
        let charId = null;
        let chatId = null;
        let params = new URLSearchParams(document.location.search);

        switch(state) {
            case "/chat": {
                current_protocol = PROTOCOL_LEGACY;
                disableModeChanger(false);
                disableControl(true);

                if (params.get("char") != null) {
                    charId = params.get("char");
                }
                break;
            }

            case "/chat2": {
                current_protocol = PROTOCOL_NEO;
                disableModeChanger(true);
                disableControl(true);

                if (params.get("hist") != null) {
                    last_chat_id = params.get("hist");
                    chatId = params.get("hist");
                }
                if (params.get("char") != null) {
                    charId = params.get("char");
                }

                //Character selector
                characters_in_chat_cache = [];
                selected_character_id = "";
                appendCharacterSelector();
                break;
            }

            default: {
                current_protocol = PROTOCOL_NEO;
                var site = getCurrentSite();
                switch(site) {
                    case NEXT: {
                        disableModeChanger(true);
                        disableControl(true);

                        let path = document.location.pathname;
                        if (path.indexOf("/chat/") != -1) {

                            let params = new URLSearchParams(document.location.search);

                            if (params.get("hist") != null) {
                                last_chat_id = params.get("hist");
                                chatId = params.get("hist");
                            }

                            charId = document.location.pathname.substring(6);
                            try {
                                appendCharacterSelector();
                            } catch (ex) {
                                console.error("failed to append character selector", ex);
                            }
                        }
                        break;
                    }
                }

                changeFuncs();
                break;
            }
        }

        if (charId !== null && current_protocol == PROTOCOL_NEO) {
            char_id = charId;

            getChatsFromCharacter(charId, function(response) {

                var nodes= mainelem.querySelectorAll("#chistory .mbubble");
                for(var i = 0; i < nodes.length; i++) {
                    var node = nodes[i];
                    node.parentElement.removeChild(node);
                }

                var l = 1;

                response.chats.forEach(chat => {
                    if (chat.hasOwnProperty("preview_turns") && chat.preview_turns.length > 1) {
                        l++;
                        var test = new bubbleDOMController(0);
                        mainelem.querySelector("#chistory .details").appendChild(test.dom);
                        var dotLen = 2;

                        function setTurnCount(count) {
                            dotLen++;
                            test.setAsMessage("Loading" + ".".repeat(dotLen));
                        }

                        setTurnCount(0);

                        setTimeout(function() {
                            getAllChatTurns(chat.chat_id, true, setTurnCount).then(allTurns => {
                                test.setAsCategory((chat.hasOwnProperty("name") ? [ { name : chat.name } ] : allTurns.turns.map(x => x.author)), allTurns.turns, Date.parse(allTurns.turns[0].create_time));
                            }).catch(error => {
                                test.setAsMessage("Server error \¯\\_(ツ)_/¯");
                            });
                        }, 100 * l);
                    }
                });
            });

            //Important to publish events in websocket
            if (neo_last_request_id == null && charId != null) {
                neo_last_request_id = uuidV4().slice(0, 24) + charId.slice(-12);
            }

            if (chatId !== null) {
                refreshNeoTurns(function() {
                    if (char_id != null) {
                        selectCharacter(char_id);
                    }
                });
                return;
            }

            getRecentChatFrom(charId, function() {
                refreshNeoTurns(function() {
                    if (char_id != null) {
                        selectCharacter(char_id);
                    }
                })
            });
        }
    }

    function appendCharacterSelector() {
        var characterSelectorEnabled = getLocalSettingSaved("characterselector", "lyes");

        if (characterSelectorEnabled === "lyes")
        {
            var checkNeoChat = function() {

                var site = getCurrentSite();
                var elemName = (site == BETA) ? ".chat2" : "textarea[inputmode]";
                var elem = document.querySelector(elemName);

                switch(site) {
                    case BETA:
                        {
                            if (document.querySelector(elemName) === null) {
                                return false;
                            }
                            break;
                        }
                    case NEXT: {
                        break;
                    }
                }

                if (!elem) {
                    return false;
                }

                addToPane();
                tryGetCurrentCharacter();

                var x = new MutationObserver(function (e) {
                    e.forEach(function(record) {
                        if (record.addedNodes.length > 0) {
                            for (let i = 0; i < record.addedNodes.length; i++) {
                                let item = record.addedNodes[i];
                                if (item.className == "container-fluid chatbottom") {
                                    addToPane();
                                    selectCharacter(selected_character_id);
                                }
                            }
                        }
                    });
                });

                x.observe(elem, { childList: true });
                return true;

            }

            var infinitecheck = function() {
                if (!checkNeoChat()) {
                    setTimeout(infinitecheck, 10);
                }
            }

            infinitecheck();
        }
    }

    function generic_alert(image, title, summary, buttons) {
        var self = this;
        this.eventclose = new Event('close');
        this.destroyatclick = true;
        this.untouchable = false;
        this.ismodal = false;
        let elem = document.createElement("div");
        elem.setAttribute("class", "modal-black-wrap");
        this.modalbackground = elem;

        this.append = function() {
            if (this.ismodal) {
                document.body.appendChild(this.modalbackground);
            }
            document.body.appendChild(this.uielement);
        }

        this.destroyclosebutton = function() {
            self.uielement.getElementsByClassName("close")[0].remove();
        }

        this.close = function() {
            try {
                self.uielement.dispatchEvent(self.eventclose);

                if (self.ismodal) {
                    self.modalbackground.parentNode.removeChild(self.modalbackground);
                }

            } catch (e) {}

            self.destroy();
        }

        this.closeWithAnimation = function() {
            self.uielement.classList.add("generic-alert-box-hiding");
            setTimeout(self.close, 200);
        }

        this.destroy = function() {
            self.uielement.parentNode.removeChild(self.uielement);
        }

        this.addclass = function(classname) {
            var current = self.uielement.getAttribute("class");
            self.uielement.classList.add("generic-alert-box-" + classname);
        }

        this.uielement = document.createElement("div");
        this.uielement.setAttribute("class", "generic-alert-box");
        this.uielement.innerHTML = ' <p class="title"></p> <div class="close" style="right: 10px;top: 10px;"></div> <div class="content"><p></p> </div> <div class="buttonregion"></div>';

        if (!(summary instanceof HTMLElement)) {
            this.uielement.getElementsByClassName("content")[0].getElementsByTagName("p")[0].innerHTML += summary;
        }
        else {
            this.uielement.getElementsByClassName("content")[0].appendChild(summary);
        }

        if (image !== null && image != "") {
            let imageelement = document.createElement("img");
            imageelement.setAttribute("src", image);
            this.uielement.getElementsByClassName("content")[0].prepend(imageelement);
        }

        this.uielement.getElementsByClassName("title")[0].innerHTML = title;
        this.uielement.getElementsByClassName("close")[0].addEventListener('click', this.closeWithAnimation);

        let buttonregion = this.uielement.getElementsByClassName("buttonregion")[0];

        buttons.forEach(function(me) {
            let newbutton = document.createElement("div");
            newbutton.setAttribute("class", "helbutton");
            newbutton.innerHTML = me.text;

            var func = function() {

                if (self.untouchable) return;

                try {
                    if (me.function !== null) {
                        me.function();
                    }
                } catch (e) {}

                if (self.destroyatclick) {
                    self.close();
                }
            }

            newbutton.addEventListener('click', func);
            buttonregion.appendChild(newbutton);
        });
    }

    function setAllowGenerating(allow) {
        if (allow) {
            mainelem.querySelector("[data-tag=resume_gen]").style.display = "none";
            mainelem.querySelector("[data-tag=stop_gen]").style.display = "block";
            allow_generating = true;
        } else {
            mainelem.querySelector("[data-tag=stop_gen]").style.display = "none";
            mainelem.querySelector("[data-tag=resume_gen]").style.display = "block";
            allow_generating = false;
        }
    }

    function getLocalSettingSaved(param, defaultValue = undefined) {
        let existingData = localStorage.getItem(DEFAULT_STORAGE);

        if ((existingData !== null)) {
            var json = JSON.parse(existingData);

            if (json.hasOwnProperty(param)) {
                return json[param];
            }
        }

        return defaultValue;
    }

    function saveToLocalStorage(json) {
        let existingData = localStorage.getItem(DEFAULT_STORAGE);

        if (!existingData) {
            localStorage.setItem(DEFAULT_STORAGE, JSON.stringify(json));
            return;
        }

        let existingJSON = JSON.parse(existingData);

        for (let prop in json) {
            existingJSON[prop] = json[prop];
        }

        localStorage.setItem(DEFAULT_STORAGE, JSON.stringify(existingJSON));
    }

    function onBeforeUnload(evt) {
        evt.preventDefault();
        evt.returnValue = '';
        return true;
    }

    function addPageConfirmation() {
        window.addEventListener('beforeunload', onBeforeUnload);
    }

    function removePageConfirmation() {
        window.removeEventListener('beforeunload', onBeforeUnload);
    }

    let startX;
    let startWidth;
    let side;
    let resizableDiv;

    function initResize(e) {
        startX = e.clientX;
        startWidth = parseInt(document.defaultView.getComputedStyle(resizableDiv).width, 10);
        side = e.target.classList.contains('left') ? 'left' : 'right';

        document.addEventListener('mousemove', doResize, false);
        document.addEventListener('mouseup', stopResize, false);
    }

    function doResize(e) {
        let newwidth = 0;
        if (side === 'left') {
            newwidth = startWidth - (e.clientX - startX);
        } else if (side === 'right') {
            newwidth = startWidth + (e.clientX - startX);
        }
        resizableDiv.style.width = `${newwidth}px`;
    }

    function stopResize() {
        document.removeEventListener('mousemove', doResize, false);
        document.removeEventListener('mouseup', stopResize, false);

        saveToLocalStorage({"width" : resizableDiv.style.width});
    }
    function createResizer(position) {
        const resizer = document.createElement('div');
        resizer.classList.add('resizer', position);
        return resizer;
    }
})();