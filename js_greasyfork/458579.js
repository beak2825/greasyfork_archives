// ==UserScript==
// @name         bilibili 视频进度
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  展示多 P 视频的总时长、剩余时长、观看进度等
// @author       share121
// @match        *://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/458579/bilibili%20%E8%A7%86%E9%A2%91%E8%BF%9B%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/458579/bilibili%20%E8%A7%86%E9%A2%91%E8%BF%9B%E5%BA%A6.meta.js
// ==/UserScript==

(() => {
    class Duration {
        static preFix = Array(10)
            .fill("0")
            .map((e, i) => e + i);
        #_duration;
        #_sec;
        #_min;
        #_hour;
        #_formatTime;
        constructor(duration = 0) {
            let tmp = `${duration}`.match(/0*(\d+):0*(\d+):0*(\d+)/);
            if (tmp !== null) {
                this.formatTime = `${duration}`;
            } else {
                this.duration = duration;
            }
        }
        get duration() {
            return this.#_duration;
        }
        get sec() {
            return this.#_sec;
        }
        get min() {
            return this.#_min;
        }
        get hour() {
            return this.#_hour;
        }
        get formatTime() {
            return this.#_formatTime;
        }
        set duration(duration) {
            try {
                duration = duration.toFixed(0);
            } catch { }
            duration = BigInt(duration);
            this.#_duration = duration;
            this.#_sec = duration % 60n;
            this.#_min = (duration / 60n) % 60n;
            this.#_hour = duration / 3600n;
            this.#_formatTime = `${Duration.preFix[this.#_hour] || this.#_hour
                }:${Duration.preFix[this.#_min] || this.#_min}:${Duration.preFix[this.#_sec] || this.#_sec
                }`;
        }
        set sec(sec) {
            try {
                sec = sec.toFixed(0);
            } catch { }
            this.duration =
                this.#_hour * 3600n + this.#_min * 60n + BigInt(sec);
        }
        set min(min) {
            try {
                min = min.toFixed(0);
            } catch { }
            this.duration =
                this.#_hour * 3600n + BigInt(min) * 60n + this.#_sec;
        }
        set hour(hour) {
            try {
                hour = hour.toFixed(0);
            } catch { }
            this.duration =
                BigInt(hour) * 3600n + this.#_min * 60n + this.#_sec;
        }
        set formatTime(v) {
            let [, hour, min, sec] = v.match(/0*(\d+):0*(\d+):0*(\d+)/);
            this.duration =
                BigInt(hour) * 3600n + BigInt(min) * 60n + BigInt(sec);
        }
        toString() {
            return this.formatTime;
        }
    }
    function getWachedDuration() {
        let tmp =
            document.querySelector(".bpx-player-video-wrap>video")
                ?.currentTime ?? 0;
        try {
            tmp += __INITIAL_STATE__.videoData.pages
                .slice(0, __INITIAL_STATE__.p - 1)
                .map((e) => e.duration)
                .reduce((a, b) => a + b);
        } catch { }
        return tmp;
    }
    function getPlaybackRate() {
        return (
            document.querySelector(".bpx-player-video-wrap>video")
                ?.playbackRate ?? 1
        );
    }
    function getFinalTime(duration) {
        return new Duration(parseInt(duration) / getPlaybackRate());
    }
    let totalDuration = new Duration(),
        lastDuration = new Duration(),
        wachedDuration = new Duration();
    (function update() {
        try {
            if (
                __INITIAL_STATE__.videoData.duration &&
                totalDuration.duration != __INITIAL_STATE__.videoData.duration
            ) {
                totalDuration.duration = __INITIAL_STATE__.videoData.duration;
                document
                    .querySelectorAll(".video-data-list .totalDuration")
                    .forEach((e) => {
                        e.children[0].innerHTML =
                            e.title = `总时长 ${totalDuration.formatTime}`;
                    });
            }
            document
                .querySelectorAll(".video-data-list:not(:has(.totalDuration))")
                .forEach((e) =>
                    e.append(
                        document
                            .createRange()
                            .createContextualFragment(
                                `<span class="item totalDuration" title="总时长 ${totalDuration.formatTime}"><span class="item-text">总时长 ${totalDuration.formatTime}</span></span>`
                            )
                    )
                );
            {
                let tmp = getWachedDuration();
                if (wachedDuration.duration != tmp) {
                    wachedDuration.duration = tmp;
                    document
                        .querySelectorAll("#viewbox_report .wachedDuration")
                        .forEach((e) => {
                            let tmp =
                                parseInt(wachedDuration.duration) /
                                parseInt(totalDuration.duration);
                            if (e.value != tmp) {
                                e.value = tmp;
                                if (
                                    e.title != `进度 ${(tmp * 100).toFixed(2)}%`
                                ) {
                                    e.innerHTML = e.title = `进度 ${(
                                        tmp * 100
                                    ).toFixed(2)}%`;
                                }
                            }
                        });
                }
            }
            {
                let tmp = totalDuration.duration - wachedDuration.duration;
                if (lastDuration.duration != tmp) {
                    lastDuration.duration = tmp;
                    document
                        .querySelectorAll(".video-data-list .lastDuration")
                        .forEach((e) => {
                            let tmp = `剩余时长 ${getFinalTime(lastDuration.duration).formatTime
                                }`;
                            if (e.title != tmp) {
                                e.children[0].innerHTML = e.title = tmp;
                            }
                        });
                }
            }
            document
                .querySelectorAll(".video-data-list:not(:has(.lastDuration))")
                .forEach((e) =>
                    e.append(
                        document
                            .createRange()
                            .createContextualFragment(
                                `<span class="item lastDuration" title="剩余时长 ${getFinalTime(lastDuration.duration)
                                    .formatTime
                                }"><span class="item-text">剩余时长 ${getFinalTime(lastDuration.duration)
                                    .formatTime
                                }</span></span>`
                            )
                    )
                );
            document
                .querySelectorAll("#viewbox_report:not(:has(.wachedDuration))")
                .forEach((e) => {
                    let tmp =
                        parseInt(wachedDuration.duration) /
                        parseInt(totalDuration.duration);
                    e.append(
                        document
                            .createRange()
                            .createContextualFragment(
                                `<progress value="${tmp}" max="1" title="进度 ${(
                                    tmp * 100
                                ).toFixed(
                                    2
                                )}%" style="width:100%;" class="wachedDuration">进度 ${(
                                    tmp * 100
                                ).toFixed(2)}%</progress>`
                            )
                    );
                });
        } finally {
            requestAnimationFrame(update);
        }
    })();
})();
