// ==UserScript==
// @name         【etai2019】明里美术馆
// @version      0.1.1
// @description  JavLibrary，优化图片展示
// @author       etai2019
// @license      GPL-3.0 License
// @namespace    etai2019

// @match        https://www.javlibrary.com/*

// @require      https://unpkg.com/vue@3/dist/vue.global.js
// @grant        GM_addStyle
// @icon         data:image/jpeg;base64,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

// @downloadURL https://update.greasyfork.org/scripts/501765/%E3%80%90etai2019%E3%80%91%E6%98%8E%E9%87%8C%E7%BE%8E%E6%9C%AF%E9%A6%86.user.js
// @updateURL https://update.greasyfork.org/scripts/501765/%E3%80%90etai2019%E3%80%91%E6%98%8E%E9%87%8C%E7%BE%8E%E6%9C%AF%E9%A6%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        .app {
            position: fixed;
            top: 8%;
            right: 2%;
            background-color: rgba(0,0,0,0);
            opacity: .6;
        }
        .app:hover {
            opacity: 1;
            z-index: 2;
        }

        .panel-avatar {
            border-radius: 50%;
        }
        .panel-avatar:hover {
            cursor: pointer;
        }

        .gallery-overlay {
            position: fixed;
            height: 100%;
            top: 0%;
            width: 100%;
            background: rgba(0, 0, 0, 0.6);
            display: none;
        }
        .image-gallery {
            position: fixed;
            top: 10%;
            left: 10%;
            height: 80%;
            width: 80%;
            padding-bottom: 4em;
            background-color: black;
            border-radius: .5em;
            border: 1px solid #000;
            box-sizing: border-box;
            overflow: hidden;
        }

        .gallery-image-box {
            width: 20%;
            position: relative;
            display: inline-block;
            vertical-align: middle;
        }
        .gallery-image-box:hover {
            cursor: pointer;
        }
        .gallery-image-box img{
            height: 100%;
            width: 100%;
            position: relative;
            object-fit: contain;
        }
        .gallery-image-box-goto {
            position:absolute;
            bottom: 0px;
            right: 0px;
            background-color: purple;
            padding: .5em;
            border-radius: 50%;
            color: #fff;
        }
        .gallery-image-box-goto:hover {
            cursor: pointer;
        }

        .gallery-top-image {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            display: none;
            background-color: rgba(0,0,0,0.8);
            z-index: 2;
        }

        .gallery-top-image img {
            height: 100%;
            width: 100%;
            object-fit: contain;
        }

        .gallery-top-image iframe {
            height: 50%;
            width: 50%;
            position: fixed;
            top: 25%;
            left: 25%;
        }

        .gallery-header {
            background-color: #f2f2f2;
            display: flex;
            justify-content: space-between;
            padding: .5em;
            font-size: 1.5em;
            border-bottom: 1px solid #000;
        }

        .gallery-header div:last-of-type {
            padding: 0 1em;
        }

        .gallery-header div:last-of-type:hover {
            cursor: pointer;
        }

        .gallery-video {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 6em;
        }
    `);

    const wd = window.unsafeWindow || document.defaultView || window;
    wd.Vue = Vue;

    const app$ = document.createElement('div');
    app$.id = "app";
    document.body.appendChild(app$);

    const template = `
    <div class="rate-popup" v-if="showPopup">
        <div class="rate-popup-body">
            <div style="text-align: center" @click="jumpPopup">好用请一定点我回个贴吧！小秘书真的非常需要你的回帖来完善（只弹一次）</div>
            <div style="text-align: center" @click="closePopup">点我关闭</div>
        </div>
    </div>

    <div ref="gallery$" class="gallery-overlay" @click="onShowImageGallery">
        <div class="image-gallery">
            <div class="gallery-header">
                <div>
                    <span>紬宝美术馆 - 已装载 {{imageGalleryLinks.length}} 张图片</span>
                </div>
                <div @click.stop.prevent="onShowImageGallery">关闭</div>
            </div>

            <div style="height: 100%; overflow: auto;">
                <div ref="galleryTopImage$" class="gallery-top-image" @click.stop.prevent="onCloseLargeMedia">
                    <img :src="galleryTopImageLink"></img>
                    <iframe scrolling="no" autoplay></iframe>
                </div>
                <div class="gallery-image-box" v-if="videolink">
                    <div class="gallery-video" @click.stop.prevent="onShowLargeMedia(null, true)">▶️</div>
                </div>
                <div class="gallery-image-box" v-for="link in imageGalleryLinks" :key="link">
                    <img :src="link" @click.stop.prevent="onShowLargeMedia(link)"></img>
                </div>
            </div>
        </div>
    </div>


    <div class="app" ref="app">
        <img class="panel-avatar" :src="avatar" @click="onShowImageGallery">
    </div>
    `

    const app = Vue.createApp({
        template: template,
        data() {
            return {
                activePanel: "",
                avatar: "",
                avatar2: "",
                toggleOn: true,
                commentsPerPage: 9,
                showPopup: false,
                lifetimePages: 0,

                // 图片展
                videolink: null,
                isShowImageGallery: false,
                imageGalleryLinks: [],
                galleryTopImageLink: '',
            }
        },
        methods: {
            applyGalleryDisplay() {
                this.$refs.gallery$.style.display = this.isShowImageGallery ? 'block' : 'none';
            },
            onCloseLargeMedia() {
                this.$refs.galleryTopImage$.style.display='none';
                this.$refs.galleryTopImage$.querySelector('iframe').removeAttribute('src')
            },
            onShowLargeMedia(link, isVideo = false) {
                this.$refs.galleryTopImage$.style.top = this.$refs.gallery$.scrollTop + "px";
                this.$refs.galleryTopImage$.style.display = 'block';

                this.$refs.galleryTopImage$.querySelector('img').style.display = 'none'
                this.$refs.galleryTopImage$.querySelector('iframe').style.display = 'none'

                if (isVideo) {
                    this.$refs.galleryTopImage$.querySelector('iframe').style.display = 'block'
                    this.$refs.galleryTopImage$.querySelector('iframe').setAttribute('src', this.videolink)
                } else {
                    this.$refs.galleryTopImage$.querySelector('img').style.display = 'block'
                    this.galleryTopImageLink = link;
                }
            },
            onShowImageGallery(){
                this.isShowImageGallery = !this.isShowImageGallery;
                this.applyGalleryDisplay();

                if (!this.isShowImageGallery) {
                    this.onCloseLargeMedia();
                }
            },
            jumpPopup() {
                window.open(`https://${window.location.host}/thread-1960202-1-1.html`);
                this.closePopup();
            },
            closePopup() {
                this.showPopup = false;
            },
            getImgs() {
                return Array.from(document.querySelector('.previewthumbs').querySelectorAll('a[href]'))
                        .filter(x => {
                            const imageLink = x.getAttribute('href')
                            return imageLink.startsWith("http") && imageLink.endsWith("jpg")
                        });
            }
        },
        mounted() {
            // 初始化媒体链接和点击事件
            const this$ = this

            // 视频
            const videoplayer$ = document.querySelector('.btn_videoplayer')
            if (videoplayer$) {
                try {
                    // https://www.javlibrary.com/cn/?v=javmekyy7e
                    // _0x74d4[11] + document.querySelector('.btn_videoplayer').getAttribute('attr-data') + _0x74d4[12]
                    // <video data-binding="play" playsinline="" data-service="mono" data-mode="detail" autoplay="" src="//cc3001.dmm.co.jp/litevideo/freepv/1/1dl/1dldss317/1dldss317hhb.mp4"></video>
                    this.videolink = _0x74d4[11] + document.querySelector('.btn_videoplayer').getAttribute('attr-data') + _0x74d4[12]
                    console.log('视频地址：', this.videolink)

                    // 克隆原来的元素阻止点击事件
                    const clone$ = videoplayer$.cloneNode(true)
                    videoplayer$.parentNode.insertBefore(clone$, videoplayer$)
                    clone$.addEventListener('click', function(e) {
                        this$.onShowImageGallery()
                        this$.onShowLargeMedia(null, true)

                        e.preventDefault();
                        e.stopPropagation();
                    })

                    videoplayer$.parentNode.removeChild(videoplayer$)
                } catch (error) {
                    console.error('无法解析视频！', error)
                }
            }

            // 图片
            const imgs$ = this.getImgs();
            if (imgs$.length > 0) {
                const this$ = this
                imgs$.forEach(x => {
                    const imageLink = x.getAttribute('href')
                    this.imageGalleryLinks.push(imageLink);

                    x.addEventListener('click', function(e) {
                        this$.onShowImageGallery()
                        this$.onShowLargeMedia(x.getAttribute('href'))

                        e.preventDefault();
                        e.stopPropagation();
                    })
                });
            }

        },
        async created() {

            // 初始化面板状态
            this.avatar = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAwADAAAD/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAEAAAAAAAD/4gxYSUNDX1BST0ZJTEUAAQEAAAxITGlubwIQAABtbnRyUkdCIFhZWiAHzgACAAkABgAxAABhY3NwTVNGVAAAAABJRUMgc1JHQgAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLUhQICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFjcHJ0AAABUAAAADNkZXNjAAABhAAAAGx3dHB0AAAB8AAAABRia3B0AAACBAAAABRyWFlaAAACGAAAABRnWFlaAAACLAAAABRiWFlaAAACQAAAABRkbW5kAAACVAAAAHBkbWRkAAACxAAAAIh2dWVkAAADTAAAAIZ2aWV3AAAD1AAAACRsdW1pAAAD+AAAABRtZWFzAAAEDAAAACR0ZWNoAAAEMAAAAAxyVFJDAAAEPAAACAxnVFJDAAAEPAAACAxiVFJDAAAEPAAACAx0ZXh0AAAAAENvcHlyaWdodCAoYykgMTk5OCBIZXdsZXR0LVBhY2thcmQgQ29tcGFueQAAZGVzYwAAAAAAAAASc1JHQiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAABJzUkdCIElFQzYxOTY2LTIuMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWFlaIAAAAAAAAPNRAAEAAAABFsxYWVogAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z2Rlc2MAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5jaAAAAAAAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5jaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkZXNjAAAAAAAAAC5JRUMgNjE5NjYtMi4xIERlZmF1bHQgUkdCIGNvbG91ciBzcGFjZSAtIHNSR0IAAAAAAAAAAAAAAC5JRUMgNjE5NjYtMi4xIERlZmF1bHQgUkdCIGNvbG91ciBzcGFjZSAtIHNSR0IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZGVzYwAAAAAAAAAsUmVmZXJlbmNlIFZpZXdpbmcgQ29uZGl0aW9uIGluIElFQzYxOTY2LTIuMQAAAAAAAAAAAAAALFJlZmVyZW5jZSBWaWV3aW5nIENvbmRpdGlvbiBpbiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHZpZXcAAAAAABOk/gAUXy4AEM8UAAPtzAAEEwsAA1yeAAAAAVhZWiAAAAAAAEwJVgBQAAAAVx/nbWVhcwAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAo8AAAACc2lnIAAAAABDUlQgY3VydgAAAAAAAAQAAAAABQAKAA8AFAAZAB4AIwAoAC0AMgA3ADsAQABFAEoATwBUAFkAXgBjAGgAbQByAHcAfACBAIYAiwCQAJUAmgCfAKQAqQCuALIAtwC8AMEAxgDLANAA1QDbAOAA5QDrAPAA9gD7AQEBBwENARMBGQEfASUBKwEyATgBPgFFAUwBUgFZAWABZwFuAXUBfAGDAYsBkgGaAaEBqQGxAbkBwQHJAdEB2QHhAekB8gH6AgMCDAIUAh0CJgIvAjgCQQJLAlQCXQJnAnECegKEAo4CmAKiAqwCtgLBAssC1QLgAusC9QMAAwsDFgMhAy0DOANDA08DWgNmA3IDfgOKA5YDogOuA7oDxwPTA+AD7AP5BAYEEwQgBC0EOwRIBFUEYwRxBH4EjASaBKgEtgTEBNME4QTwBP4FDQUcBSsFOgVJBVgFZwV3BYYFlgWmBbUFxQXVBeUF9gYGBhYGJwY3BkgGWQZqBnsGjAadBq8GwAbRBuMG9QcHBxkHKwc9B08HYQd0B4YHmQesB78H0gflB/gICwgfCDIIRghaCG4IggiWCKoIvgjSCOcI+wkQCSUJOglPCWQJeQmPCaQJugnPCeUJ+woRCicKPQpUCmoKgQqYCq4KxQrcCvMLCwsiCzkLUQtpC4ALmAuwC8gL4Qv5DBIMKgxDDFwMdQyODKcMwAzZDPMNDQ0mDUANWg10DY4NqQ3DDd4N+A4TDi4OSQ5kDn8Omw62DtIO7g8JDyUPQQ9eD3oPlg+zD88P7BAJECYQQxBhEH4QmxC5ENcQ9RETETERTxFtEYwRqhHJEegSBxImEkUSZBKEEqMSwxLjEwMTIxNDE2MTgxOkE8UT5RQGFCcUSRRqFIsUrRTOFPAVEhU0FVYVeBWbFb0V4BYDFiYWSRZsFo8WshbWFvoXHRdBF2UXiReuF9IX9xgbGEAYZRiKGK8Y1Rj6GSAZRRlrGZEZtxndGgQaKhpRGncanhrFGuwbFBs7G2MbihuyG9ocAhwqHFIcexyjHMwc9R0eHUcdcB2ZHcMd7B4WHkAeah6UHr4e6R8THz4faR+UH78f6iAVIEEgbCCYIMQg8CEcIUghdSGhIc4h+yInIlUigiKvIt0jCiM4I2YjlCPCI/AkHyRNJHwkqyTaJQklOCVoJZclxyX3JicmVyaHJrcm6CcYJ0kneierJ9woDSg/KHEooijUKQYpOClrKZ0p0CoCKjUqaCqbKs8rAis2K2krnSvRLAUsOSxuLKIs1y0MLUEtdi2rLeEuFi5MLoIuty7uLyQvWi+RL8cv/jA1MGwwpDDbMRIxSjGCMbox8jIqMmMymzLUMw0zRjN/M7gz8TQrNGU0njTYNRM1TTWHNcI1/TY3NnI2rjbpNyQ3YDecN9c4FDhQOIw4yDkFOUI5fzm8Ofk6Njp0OrI67zstO2s7qjvoPCc8ZTykPOM9Ij1hPaE94D4gPmA+oD7gPyE/YT+iP+JAI0BkQKZA50EpQWpBrEHuQjBCckK1QvdDOkN9Q8BEA0RHRIpEzkUSRVVFmkXeRiJGZ0arRvBHNUd7R8BIBUhLSJFI10kdSWNJqUnwSjdKfUrESwxLU0uaS+JMKkxyTLpNAk1KTZNN3E4lTm5Ot08AT0lPk0/dUCdQcVC7UQZRUFGbUeZSMVJ8UsdTE1NfU6pT9lRCVI9U21UoVXVVwlYPVlxWqVb3V0RXklfgWC9YfVjLWRpZaVm4WgdaVlqmWvVbRVuVW+VcNVyGXNZdJ114XcleGl5sXr1fD19hX7NgBWBXYKpg/GFPYaJh9WJJYpxi8GNDY5dj62RAZJRk6WU9ZZJl52Y9ZpJm6Gc9Z5Nn6Wg/aJZo7GlDaZpp8WpIap9q92tPa6dr/2xXbK9tCG1gbbluEm5rbsRvHm94b9FwK3CGcOBxOnGVcfByS3KmcwFzXXO4dBR0cHTMdSh1hXXhdj52m3b4d1Z3s3gReG54zHkqeYl553pGeqV7BHtje8J8IXyBfOF9QX2hfgF+Yn7CfyN/hH/lgEeAqIEKgWuBzYIwgpKC9INXg7qEHYSAhOOFR4Wrhg6GcobXhzuHn4gEiGmIzokziZmJ/opkisqLMIuWi/yMY4zKjTGNmI3/jmaOzo82j56QBpBukNaRP5GokhGSepLjk02TtpQglIqU9JVflcmWNJaflwqXdZfgmEyYuJkkmZCZ/JpomtWbQpuvnByciZz3nWSd0p5Anq6fHZ+Ln/qgaaDYoUehtqImopajBqN2o+akVqTHpTilqaYapoum/adup+CoUqjEqTepqaocqo+rAqt1q+msXKzQrUStuK4trqGvFq+LsACwdbDqsWCx1rJLssKzOLOutCW0nLUTtYq2AbZ5tvC3aLfguFm40blKucK6O7q1uy67p7whvJu9Fb2Pvgq+hL7/v3q/9cBwwOzBZ8Hjwl/C28NYw9TEUcTOxUvFyMZGxsPHQce/yD3IvMk6ybnKOMq3yzbLtsw1zLXNNc21zjbOts83z7jQOdC60TzRvtI/0sHTRNPG1EnUy9VO1dHWVdbY11zX4Nhk2OjZbNnx2nba+9uA3AXcit0Q3ZbeHN6i3ynfr+A24L3hROHM4lPi2+Nj4+vkc+T85YTmDeaW5x/nqegy6LzpRunQ6lvq5etw6/vshu0R7ZzuKO6070DvzPBY8OXxcvH/8ozzGfOn9DT0wvVQ9d72bfb794r4Gfio+Tj5x/pX+uf7d/wH/Jj9Kf26/kv+3P9t////2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAoACgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9uof5V8L/APBY3/grrH+wpFpPw+8EyWVx8U/FFqb17q4h+0QeFrDDf6U8RyJZ22OY42BQBd8gKsiyfdVqFL5kkWGP+N2OFRe7H2A5r+Xnx9+1Iv7Vf7cHxE+L2s295qVn4+8Qmw06BI/OmtNOAPkReWvzsYreKNMKp3CJf7vE47EOnD3d2ehl+HVapaWxQ+LP7cXx++KHiC31u68ZfFG1j1K/kWxv5NbvoXZYwGxG6yARk5LBY9qqAFUKCc/ov/wSe/4Kd/E74Z/ELQfCHxi8YXXjTwT4olisLbUtaujcap4fupG2xSm6f95Pbs5CyrOzNGCGRlEbJL33xO+A3hbWP2CdF0vUtGjsfGutpJr2kWRijSZnKCQLErFWbDYLbV4jl3HaOn5N/Hm58Q3/AMQfB994btNT1XT/AB8jWdlY6bbyXV4L+PCzWbRIC5uNrRybVXnzCoyySBfFw+Mm5Jrc+gxOX04031W1+3of1USRlXZW+XaSCKK4n9mn4lTfGf8AZr+HPjK4cSXHi3wvpeszMDnMlxZxTP8A+PO1FfTRlzK6Pj5e67M43/goP8Um+DP7Bvxk8Swztb3mm+DtTWykBAZbua3eC2xnuZ5YwPcivyv/AOCI+leA/Ef/AATvvLdNB0/V/HWm+LLrTLwpp6XWoJI92R5kQb5vMjsWRkCYb5Tj5jz65/wct/tZ6j8PvAHgH4W6a7xw+LHm13UsHAmS2eOO2RvVFmdpCP70UZ/h4+Gv+CRNn8P/ABD4Q+O3h3xNFqn2nwC+neNtZl0+eeb+1tERxHPd+QqkpNp8kkcxnjAZoLidHWQRx14uZvnvGPQ+iyblpyUqjspaf156d0fvn4s+GPgv4l+JNCvPEnhHSb6TSgLnTW1SwSdrcxiRImQOCFZUkZQw5VZmAI3sD8VftEfDr4Y/se/thXnxm02zh061t9Fv9W8YaFZWiXETxS/u4LqCJkK2txeXgjs85SOQ3Nw+FJnkb3r9mrxx4F1/wFY3Hw3m1rxFakGBNU1E3XlqVPluu+4AAwy4YRLksvzcjI/JH/gsH+2tpfhH9rr4/fD7xF4Bn8Qap4o8J+G9K8IeI31Waz/smC3ujfzXIgjys8b3TM0YbnMCAlkYCvHj++fI/me1W/2e7g21sr6fO13bvqz9jv8Agk38QJviV/wTr+Fmo3DRNcR6ZJZS+U2YwYLmWIBe+0KqgZ9KK+cv+DaT43r8Sv2HvEXh2W4Wa+8GeKp08sc+VbXUaSx/nMl304wAe5or67C2lSi/I+JxSUa0r9z5l/4OmZbHUNP+EmrXGl6tpl5ZtqVk2pNFGYZYHFvJtDK5JaJkaQIygFmGGwXFfCv/AAR+8ZXnwf8A23fGWqQPDNb+LPDV14VuoXUS21zBfeVLLFJuUq6hICuD1Kg4wOSivn6laU4yk9/+GPoqNGMZRitv+HP6EL218U+DvjNdaHGI5Ph/PY2VroVnZsbeXTVtrd2mdmUgyedJKqFWOFWBcA7jt+QP+Cun/BHrQP8AgoRaaF4u8N3t54X+KfhPTRpdpe3FlO+mataqzOtpdeWjNGFkdyk0QZkEjAxyjYqFFY/DUdjqnL2lKN10X/D+pP8A8G237JHjz9j7wV8aoPiXpS+GNZ1zxDptpaWLXsU63MNrbSt9qidCQ8UjXmAeoaJ1YKwKgoor6LB1GqSt/Wp8zjKa9q7/ANaI/9k=";
            this.avatar2 = "data:image/jpeg;base64,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";

        }
    }).mount('#app')

    // Your code here...
})();

