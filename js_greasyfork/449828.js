// ==UserScript==
// @name         任意视频倍速播放
// @namespace    http://tampermonkey.net/
// @version      0.5.3
// @description  任意浏览器视频倍速播放，按键调速。
// @author       shandianchengzi
// @include      *
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAGJJJREFUeF7tnQm0dlVZx//OSAqSiZaiUgFmWgmlYipiTiQOOZSZppYJClo5gqaVE4pTpZiapWaDiZmahVNqRuKAmlYWYEKSpVALIcXUrNZvtc/i/e53793PHs4++5zzPGu9673fd/b43+f/7ukZriQXR8AR2BGBKzk2joAjsDMCThB/OxyBXRBwgvjr4Qg4QfwdcATyEPAZJA83z7USBJwgKxlo72YeAk6QPNw810oQcIKsZKC9m3kIOEHycPNcK0HACbKSgfZu5iHgBMnDzXOtBAEnyEoG2ruZh4ATJA83z7USBJwgKxlo72YeAk6QPNxq5tpX0v6SrhO+KftSSV8K35fXrMzLSkPACZKGV2rqG0o6TNKh4Zu/r7eFEFePFPr1LYS5WNI54XNu+P58asM8vQ0BJ4gNp1iqa0g6UtKdNsgAKa4Vy1jp+ZclDWTh+/2SzpL0tUrlr7YYJ0je0H+bpFuHz1GBGHkljZsLovD5qKSPSPr3catbXulOEPuY3k3S3QMpbm/P1lXKMwNR3inpXV21rNPGOEF2H5jbSrpX+Nyy0zHMbdbfSvrT8PlQbiFLz+cE2XuEb75Bih9e+gsQ+vfXG2T59Er6bOqmE+QKmO4v6eGSjjUht9xEb5f0Wkl/vNwu2nvmBPl/UjxC0h3tsK0i5QckvSaQZRUd3q6TayXIfmG2gBg/sNrRt3X8bzaIcpkty3JSrY0gHM8eH2aM75xwGLmf+C9JX93y4f+uKulbJR0Qvq88YTs3q/5sIMor1nRcvCaCPErSEyUd0vCFu0ASm96/3/L9lYQ2oIYCYfhwCw+xt36unVBeadLzJL1Q0qtKC5pD/jUQ5C6BGNxhjCkXSWLd/lfhFhtipBChpG0DcW4j6Q5hP3VgSYGGvNylQJT3GNLONsmSCcKvLDPGo0canQslcTz6wfD98ZHqyS32cEkcU98ufB+UW1Ak328GorAEW5wslSAQ4wmSblB5xL4Y7gveFr4rFz9qcVx43jvc8Vy/ck1fkPSiQJTKRU9b3NIIwonUqZLuWhFWNs7DjTPEQBV9zsKeZiAKpNmnYmfeLenJkjj5WoQsiSDcZ0AO1uM1BPWL3w/k+OcaBXZYxk3CjAJ2R1RqH+r4kITLxtnLEgiCqjnEeFyl0XiHpNdJekOl8uZSDKd8fGoR5TcCUWatcj93gnBqAzlq3IJDCIgBQdYsNYnCqR6zyYfnCuicCXJcIAe34iXyO5J+S5JrtO6JIkThUvVWJeBK4vYdkryysJxJss+VIKdIOqkQMYyInifpzYXlLDk7G/jHh891CzsK1icXltE8+xwJcpqkxxQgxanU8yVBslmvjwswSM2K+TBEYdYukZdLOqGkgNZ550aQ35P0UwUgocLNL9nZBWWsOSvH5xDlHgUgcDL4kIL8TbPOiSDcQXBunyNcZD01KNvl5Pc8eyLws5KeXXARy70SdzHdy1wI8r4CxwhnSHqKJExMXeohgAkyS9VjMovEmcTRmXmbZZsDQUrIwT6DmcNlPASeW7D57p4kvRPkrZlTMWrmHC2ePt574SVvIPDAcOR+0wxUWDrfJyNfkyw9E4S7iUdmoPAngRyfycjrWfIR+O5Akh/LKOLVkn4uI9/oWXolyHMyl0accj10dNS8gt0QeH3mKRVLtaf1Bm2PBPllSb+SAVS3v0IZfZl7ltzZn3H/1Z463xtBcsnxMkmP7QlYb4teKunEDBy6IklPBAEYCJIqGEdhrOPSHwIYrWGWmyrMIjmriNR6oul7IQi34+wfUoXTD05BXPpFgAtBTiNThdt2bt0nlR4I8r3BkfJ3JCKBugOOA1z6RwCHGalmBP8qCYfheISZTHogyJ9J+tFEBB7grjETEZs+Oa5d35TYjD+XdM/EPFWTT02QnONcNHnxpOEyPwTwMINGb4pMevw7JUGYBVJvup8l6Rkp6Hra7hB4pqSnJ7aKm/rU2Sexiu2TT0UQbl0J4HJwQi84W8fKzWX+COCVMeXm/PywH2muHTEVQbDiS1FJwJ0MGzaX5SDAD2SKeyZUiO7XuvtTEORhiS5hiKsHOT7RGhyvb1QEsHWHJDgUtwruiXCs0UxaEwQHC7jrvEVCD3/GDZ0S0JpXUsJP4DTDKn8X3Kg2C8PQmiDckKZsslFXqOXvyjoInq4tAvjPSlETYpOfo3GR1auWBMEtKLPHvsaW4iWdpRVOFlyWiwCeU1hq4ZXeIpeHWaSJe9OWBElRg/5yIMdZFsQ8zewRODKQ5FrGnjQza2hFEE4fUoJCPilTyc2IryfrEAGUTl+Q0C5u5kf3adaKICytiFNhke7tlC2d8DRZCKT4HyAuy+hhulsQhKM5oqVaxZUQrUgtL12qUiOnYKN6kW9BkL9McC7tp1bLe+lTe5RyqoVz7KNSK0hJPzZBUjQ4CeHFSQZqzi7rRQCzB04wrVGIR9XsHpsgeNA71jjW6Fmhb+XiCKCnZY2i+/YCj5tRpMckCHo2nG9bZNROWhrgabpDIOXHlfsy9PWqy5gEwVzywcYWT6bObGyfJ2uPQIo5xB8UOjXfsXdjEYTIT9aANGcm3KK2HyavcUoE2Ivc3tiA244RyWosgqS4fGG9iU8rF0dgKwJ41rTuS0dx/TQGQQiqeY4kIqjGBO1M1J7/O5bQn68SgasGMweL9jeRiA+rHRRpDIKkrB1dpWSV731Sp1NUUKrvZccgCAYtP22A4F/C7IFBlIsjsBMCGFRhLHcjA0S/KwmDvGpSmyDXC8urAwwt/DVJv2hI50kcgZdI+gUDDJeEZdbFhrSmJLUJgvXfb5tqln5E0nuNaT3ZuhG4s6S/MEJAeLgUK8Vdi61NEAzr72voyMclHWFI50kcgQGBj0k63ADHWxIdgjQjyHeF5dVVDJ3oxjmxoa2epA8ErM7NvxmWWf9Uo9k1ZxCmNut9BrMHs4iLI2BFgNmDWcQi3J9Yl/rNZhDIAUliwr6D/YeLI5CKAPsQ9iMxgRw54fv2KrfmDMKlH57aY8LJFSdYLo5AKgKcZHGiFRM8wlsuF2PlqBZB0N23rvlo+KQu7aOoeIJeEeDdsca7Z0+MjVGR1CIIF4MWj3eooNysqMWeee0InCcJ384x4cKQi8MiqUUQqzPi6jedBb1/UNAivoEknAXgWKJH96Y/GY7EOdjAvoaNqtXOpgCebrOi2g4mMani7LwWQaz7D+JDvCLWswbPtzsyxEEd8fSId/ilBm2wVLHT0SazNe20Ljcsdc0lTdN9SA2CXFeSVZ8KbctzJx6JWDzET4eXr9ptbGZ/8X6/m9+n/wzthCg42luL4KHTOtOjx/UfJcDUIMgxkgiVFRPUkW8aS9TgOQ7sLG70CQ3Hy8fyawphNiNKbEw+FdpZvN6OVdTR84skofcXE0L7nRFLtNvzGgSxTnm97D/+NxEwDHEgygWJ+UqTpzhRoy4iydJOrPCWLlaVpuIrhRoEIV7g8YYROSEjPp2h2OQkqQShAlwR8fK9OLm2/AypBBlq4o6J2efz+VV3nxM7olMNrWS/y743W2oQxHq7ebQk3IpOLTkEGdrMSRdE4RdsbMklCO36XCAJps9LFOuyvlhrowZBMHy6oWEUDpRUTU/fUN9OSUoIMpSJd3F+pT9Z0I5Y1hKCDGXzgwShcau0JDko/AjE+sQsajG02rGcUoLgrp7TlJhADAjSg9QgCP0gTsVwLDxGxKMaBBnwxjcyRFmSBgNH8fsbXqhrl5zylRLEqmHZk8f2WgQZxoaXDqLUdqJckyC09dKNY2HIPXfBXZTFu3uR5ngpQbjR5GYzJgSPZ5Peg9QmyNAnPAHyK42z7hpSmyBDm4jMRDtZJs5Z2IAfZ+gAzgv/0JBu2ySlBLEasfRyggUIYxFkABjv5LyAbJRLZCyCDG3ioIF2cvAwRzlRkuUQosg4r5QgVmP6Xk6wWhCEOji44OUrUesfmyADKTi6Zon4bzNjyZ2Ml7hFzkFKCYI6BkFMYjKKW8hYpTs8H3sG2ayWSzuIwiVeqrQiCO3iEhSSnJbayAnTW93bckCBM5EsKSUIukLoDMXk+yWhEtGDtCTI0F+0CHgBU5QLWxJkaCd10k6L6tDUY/l9xmN2lpIW1aJt+1NKEOsl4aGS0OPvQaYgCP1GoZDZhH2bRaYgyNCuaiarlo5mpjnEqPhadFlYShCrK5YbS7owE4ja2aYiyNAPa/DJKQlCW6uZrdYewFCe9bKwyMVUKUE+IwnTxpigeWlViY+VVfp8aoLQ/rsYHKFNTRDayYyHb9weBVV2i2YGpuAWC8RRlli89NiDxIQb96/EEjV63gNBCC70kEh/eyBITxe8W+H6FuMNOfYgkClLSmeQb0jCRX1McCb3P7FEjZ47QexA90yQK0vCSVxMCK1xtViinZ6XEgQ9LGaHmOxTO25DrMJdnvdAEF9iFQxgyEocGsykY8LhCPpYWVJKEKsm73WCLlBWIytnmpogvkmvM6AoKlp8BxRp9JYSxOqs4dslfaEOLsWlTEUQP+YtHro9CsAbjeX2v+g0rpQg6PHcztBvHMudb0jXIskUBPGLwvoje7DRMZx1xt62haUE4cYV666Y4JIUbyE9SEuCuKrJeCN+c6N9C04bcN6QJaUEsTrx+sEEz9xZHUnI1IIgrqyYMCCZSbHzONuQF1V3VN6zpJQgVocNxLruRa16bIK4unvWq5icCWMpjKZiUuS4oZQgp0g6KdZCST8u6XRDuhZJxiKIG0y1GL0r6iCi7RsNVT5P0smGdNsmKSVIE6OV3M7tkK82QdzktvIAGYuzGus9VhK+zbKklCB3k/ROQ83MHswiPUgtgrjThmlHk9mDWSQmdy9x9l1KkJsYPQ4WnUXHEEh8XoMg7vYnEfQRklvv4HB3i9vbLCklCJV+VRKqJDGpUVesDsvzEoK44zgLwm3SWMYRVZRrljSnxkuL8zSsu2LSy12IBditfXHXo7HRbfvcegeCFSvWrNlSgyDWtWAvJ1mpBHHn1dmv12gZrSdYxXvfGgR5lqRfMkBR5H7FUL41iYc/sCLVbzrrCdazJT29pBs1CPJQYyy4Itvgkk5uyesBdCqCOVFRVl8IxM58fUkbaxDEGvEHwxU2THxPLR6CbeoRyK8fAz0OhiyGereShCfJbKlBECq/RBI2HzHB2Vct15yxumLPPYhnDKE+nx9lDKOBrcgBpV2oRRBrxJ+nSkI9xcURyEUAtZHnGjK/xeizbdeiahHEGoaNuH/HGjrnSRyBnRAg1sk9DfAUh1+jjloEOVIShikxwYadYDuWmCKxsvz5+hDAthwTWouNOYZ8Z5VCVIsgeC3BBZBlH1IcebS0055/tghYQ6+x/8DVj8XrSZMlFpW8TdK9DNAX6ecbyvcky0XAan+E6cG9a8BQawahLVwWcmkYE6bImxmdfsXK8ufrQQD3Uv9ojIfJ5SCXhMVSkyBW1XcaXRT1p7jXXsAcEbBGM6NvRSrum+DUJAjlotaOIllMiuyEY4X780UiYPV/gHMQFGOrSG2CYN74FEPL8BHFMmvJwe4NMHgSIwKcfLK8snjxfL7RDNxUdW2CWA3padyjJbFhd3EEYggcL4kNukWqOgipTRA6wNkzIddiUuSvKFa4P18UAlb/ax+SxJ1cNRmDIKiTPMfYwrtKeo8xrSdbJwI4+n63setPM6qhGIurd5O+WeEtE+IRYtuNuryLI7ATAqirx2KpDHmxbE2JAxlFfYwZhErxdMKxr0V+yOghz1KWp1kWAnjk/KixS+8Kx7vG5LZkYxHkuIQNOCat+C5ycQS2IvBSSfheswgb+VdaEqakGYsgBDf5hKTvMTSGI18MW4h36OIIDAgQV5B3yHK0+w/hHfpabfjGIgjtfJKkU40NLrYdNtbjyeaDgNXXAT16sqQXjNG1MQlCZFtC8N7I0HACLd5BEr8ELo4AKw9CR1gCxOJJ/3BjxNtkZMckCI1J+RUgyMzDknvgGZaIwOsk4XDBIqOuPsYmCJGlWEfuZ+mppJ8weuw2FufJZogA/tP+yNjuy8Le47PG9MnJxiYIDfp1SY8ztgwysdTqJaa6sdmerBICxD5nacWhjUWIxfLzloS5aVoQxOoWaOjDqFNmLlCerwkCKUtyGlTs1ifWqxYEoQ2cMDwx1pjwHL9ZzCLo1bisBwH095g9LP6uQOWF4aR0VIRaEYSQvXhGZ09ikbdKuq8loadZDAK46bmPsTfsOdAcHz20eCuC0G/U219uBIBkzzCa8CYU6Uk7RQAT2WcmtO0xCervCcXunbQlQagdrUy0M62C4T0G+C7LRQBHHzj8sAra32iBN5HWBMFW+B0JPcOKDDC4DHJZHgJcIvOjiXWpVe5hDPtnLW/XdK0JQmNQKHtUQuvdfj0BrJkltdqZD916lSQUYZvJFAQ5JHhhxLGXVUbTtbE2wNNVRyBFV4/KcUyIt8TzqrdklwKnIAjNSd2wk+f+kt7cEhyvazQE7ieJQEYp0mxjvtmoqQiSs9QiIOMDJOEA22W+COB4+k3GwK+TLa2GiqckCH58sQLDotAq+FzlEpEQwC7zQ+AW4TLQ4sN56B0WhVinMvbNZUqC0FkC6kCSqyX0nMsh4rN/PSGPJ50egauHeOVcGlvlG4Ec77dmqJ1uaoLQH2tskc2+ExieAPEu80HggvDDltLiKjE+UircmrYHgtCm12bYgmCMdURJ5z1vMwQ+FoyaUirEJuThKRnGSNsLQQ4MS63UoO/VHYWNAfLKy7Q6EtyE6ZNhaXXR1Nj1QhBwYDYg1uFBiaCwYb+NpMsT83nycRHYV9KHJbExT5ELQ2xBZp3JpSeCAAabdrQ6909E5vyg4zWaZVlie9aeHK1tdKYOTgTi0qDFPdmmvNc9yGa7IMn7EoEl+cXhlwe1epfpEEANnZUATjtS5WhjiOfUcrPT9zaDDB3JJQkB5nFlmnpLmw2gZ9wDAbQdcBV6zQxcuiMHfeiVIMNyK2cmIS+mm9iTuLRDAHsO7DpypEty9E6QUpJgR4KSIyrzLuMhgKo6DgItAVy3a0W35JgDQWgjTsFyTzSwI4EkqMy71EeAuIGQw+IccLvaObnkPqtb6XmJtQkacQ+Jf5grOI2AKC71EIAYqKznCnEEiSfYtcyFIIAISfCbhU5PjpwpiRiKrg2cg94VedDGPUkSoc5yBB063PV0Tw46NyeCDCQh9kjulE4ZxLqDKJ/LGd0V57lxIAa2PLnCkhez61mQY44EGUjyxsJQv5ADklgDQ+a+EEvJBymYNSBJrrBExq3obMgxV4IMJME+mUupEmG5BVFYfrnsjQDLKIjBsqpEuLzFD8GsyDFngtB2dH3YKJ5QMnIhL9rEaI92o+JQoU8lRXBRi6f9Gtq0p4UDklnqys1tD7LdoD8yEOWAkjci5EUPDKLwvUbBmyXEqOHV8pJAjFfPGcglEAT8CfbIbMKlUw1hJoEozCxrEGYKiMHMUUPQgOBY/ewahU1ZxlIIAoZXCSR5fEVAzwmeHbmV/0DFcnso6o7h9psb8MMqNujFgRzfrFjmZEUtiSADiCgrnmwMIJoC/EcCWXCT+amUjB2lJY447lwhxa0rt4vweacEZcXKRU9X3BIJAprsRwi38ARJRNytLTia4D4Gg6De1es56cOgjPsHa+z6FLyILPuiEI6AfceiZKkEGQYJXR+I8qARRw0vK8wuEOW9Hay72Y/dORyBM0ukeBFJhekNgRi5unKp9TVPv3SCDIA+MBCl9rJiuwHDf9MHg+4Y5/5ckPFdO6wc4cpQv0GnafjGNWeKz6ncF44fBALYnJ5bwFzyrYUgjAebeGaTEwtVVXLHFrc3A2FYimDcxQePkcPffCMYHA2ffTb+Zuk4EGIKt0eoirwskGMRm/DYYK6JIAMWmIJyrPmIETbyMbzn+pwN+GvCsTemzauRNRJkGFw27wNR2MS67I0AhxADMdiMr07WTJDNwX5wIEuzyEWdv2kEteGSlPgdqxYnyJ7Df8zG5VmJSv0cXyr2F1yI8jljjh0Yo81OkO1RRRGSy7Ths98Y4HdQ5mUbpIAYs1QoHBNHJ0gcXe4RNskSz9F/imGm4Hv0UMr9w7FzC50gaaPHsuvI8CHwPX/PQfCPix9jvvl4UFTjqDlBjEDtkAwXqRgVbX7KSqyTGwOwzQ8uPV0yEHCCZIAWyYJm7KFBQ3bz7+tXruqLktA2Pjd8b/5duar1FucEaTf2zDYQhotK1EH493bftAh1FX71t/vmog4y+KzQYOycIA1A9irmi4ATZL5j5y1vgIATpAHIXsV8EXCCzHfsvOUNEHCCNADZq5gvAk6Q+Y6dt7wBAk6QBiB7FfNFwAky37HzljdAwAnSAGSvYr4IOEHmO3be8gYIOEEagOxVzBcBJ8h8x85b3gABJ0gDkL2K+SLgBJnv2HnLGyDwf9V/IQWblhPcAAAAAElFTkSuQmCC
// @license      GPL3
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/449828/%E4%BB%BB%E6%84%8F%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/449828/%E4%BB%BB%E6%84%8F%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==


// 默认按键配置
const DEFAULT_KEYS = {
    speedUp: 'w',
    speedDown: 's',
    forward: 'ArrowRight',
    backward: 'ArrowLeft',
    volumeUp: 'ArrowUp',
    volumeDown: 'ArrowDown',
    normalSpeed: '1',
    doubleSpeed: '2',
    tripleSpeed: '3',
    quadrupleSpeed: '4',
    speedList: {
        normalSpeed: 1.0,
        doubleSpeed: 2.0,
        tripleSpeed: 3.0,
        quadrupleSpeed: 4.0
    }
};

const JS_name = "VIDEOSPEED_keys";

// 获取配置
function getConfig() {
    const savedKeys = GM_getValue(JS_name);
    return savedKeys ? {...DEFAULT_KEYS, ...savedKeys} : DEFAULT_KEYS;
}

// 轻提醒
function Toast(msg, duration) {
    duration = isNaN(duration) ? 3000 : duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText = "font-family:siyuan;max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
    document.body.appendChild(m);
    setTimeout(function() {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function() {
            document.body.removeChild(m)
        }, d * 1000);
    }, duration);
}

// 配置快捷键
function configureShortcuts() {
    const keys = getConfig();

    const configWindow = document.createElement('div');
    configWindow.style.position = 'fixed';
    configWindow.style.top = '50%';
    configWindow.style.left = '50%';
    configWindow.style.transform = 'translate(-50%, -50%)';
    configWindow.style.backgroundColor = '#fff';
    configWindow.style.padding = '20px';
    configWindow.style.border = '1px solid #ddd';
    configWindow.style.borderRadius = '8px';
    configWindow.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.3)';
    configWindow.style.zIndex = '10000';
    configWindow.style.width = '500px';
    configWindow.style.maxHeight = '80vh';
    configWindow.style.overflowY = 'auto';
    configWindow.style.fontFamily = 'Arial, sans-serif';

    // 创建表单内容
    let formHTML = `
        <h3 style="margin-top: 0; font-size: 18px; color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">
            配置快捷键
        </h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
    `;

    // 添加快捷键输入字段
    const keyLabels = {
        speedUp: '加速键 (默认: w)',
        speedDown: '减速键 (默认: s)',
        forward: '前进5秒键 (默认: →)',
        backward: '后退5秒键 (默认: ←)',
        volumeUp: '增加音量键 (默认: ↑)',
        volumeDown: '降低音量键 (默认: ↓)'
    };

    const speedLabels = {
        normalSpeed: '倍速键 (默认: 1)',
        doubleSpeed: '倍速键 (默认: 2)',
        tripleSpeed: '倍速键 (默认: 3)',
        quadrupleSpeed: '倍速键 (默认: 4)'
    };

    for (const [key, label] of Object.entries(keyLabels)) {
        formHTML += `
            <label style="font-size: 14px; display: block; margin-bottom: 5px;">
                ${label}
                <input type="text" id="${key}" value="${keys[key] || ''}"
                       style="width: 100%; padding: 5px; margin-top: 2px; border: 1px solid #ccc; border-radius: 4px;">
            </label>
        `;
    }

    for (const [key, label] of Object.entries(speedLabels)) {
        formHTML += `
            <label style="font-size: 14px; display: block; margin-bottom: 5px;">
            <input type="text" id="${key}_value" value="${keys['speedList'][key] || ''}" style="width: 10%; padding: 5px; margin-top: 2px; border: 1px solid #ccc; border-radius: 4px;">    
            ${label}
                <input type="text" id="${key}" value="${keys[key] || ''}"
                       style="width: 100%; padding: 5px; margin-top: 2px; border: 1px solid #ccc; border-radius: 4px;">
            </label>
        `;
    }

    formHTML += `
        </div>
        <p>倍速调节范围：0.1~16<br>具体的键位与名称的对应关系可以查询：https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/code</p>
        <div style="text-align: right; margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px;">
            <button id="saveShortcuts" style="padding: 8px 16px; margin-right: 10px; background-color: #4CAF50;
                    color: white; border: none; border-radius: 4px; cursor: pointer;">保存</button>
            <button id="cancelShortcuts" style="padding: 8px 16px; background-color: #f44336;
                    color: white; border: none; border-radius: 4px; cursor: pointer;">取消</button>
        </div>
    `;

    configWindow.innerHTML = formHTML;
    document.body.appendChild(configWindow);

    // 添加事件监听器
    document.getElementById('saveShortcuts').addEventListener('click', () => {
        const newKeys = {...keys};
        const newSpeedList = {...keys.speedList};

        // 更新普通按键
        for (const key of Object.keys(keyLabels)) {
            newKeys[key] = document.getElementById(key).value.trim() || DEFAULT_KEYS[key];
        }

        // 更新速度按键和对应的速度值
        for (const key of Object.keys(speedLabels)) {
            newKeys[key] = document.getElementById(key).value.trim() || DEFAULT_KEYS[key];
            const speedValue = parseFloat(document.getElementById(`${key}_value`).value);
            newSpeedList[key] = isNaN(speedValue) ? DEFAULT_KEYS.speedList[key] : speedValue;
        }

        newKeys.speedList = newSpeedList;
        GM_setValue(JS_name, newKeys);
        document.body.removeChild(configWindow);
        Toast('快捷键配置已保存，刷新页面后生效', 2000);
    });

    document.getElementById('cancelShortcuts').addEventListener('click', () => {
        document.body.removeChild(configWindow);
    });

    // 添加ESC键关闭功能
    const closeOnEsc = (e) => {
        if (e.key === 'Escape') {
            document.body.removeChild(configWindow);
            document.removeEventListener('keydown', closeOnEsc);
        }
    };
    document.addEventListener('keydown', closeOnEsc);
}

// 显示当前配置
function showCurrentConfig() {
    const keys = getConfig();
    const configText = `
当前快捷键配置:
加速: ${keys.speedUp}
减速: ${keys.speedDown}
前进5秒: ${keys.forward}
后退5秒: ${keys.backward}
增加音量: ${keys.volumeUp}
降低音量: ${keys.volumeDown}
${keys.speedList.normalSpeed}倍速: ${keys.normalSpeed}
${keys.speedList.doubleSpeed}倍速: ${keys.doubleSpeed}
${keys.speedList.tripleSpeed}倍速: ${keys.tripleSpeed}
${keys.speedList.quadrupleSpeed}倍速: ${keys.quadrupleSpeed}
    `.trim();

    alert(configText);
}

// 重置为默认配置
function resetToDefault() {
    if (confirm('确定要重置为默认快捷键配置吗？')) {
        GM_setValue(JS_name, DEFAULT_KEYS);
        Toast('已重置为默认配置，刷新页面后生效', 2000);
    }
}

async function mainFunc(){
    const keys = getConfig();

    document.body.onkeydown = function(ev) {
        var e = ev || event;
        // 避免短时间重复触发同一按键
        this.lastKey = this.lastKey || '';
        this.lastTime = this.lastTime || 0;

        if(this.lastKey === e.key) {
            if((new Date()).getTime() - this.lastTime < 100) {
                return;
            }
        }

        this.lastKey = e.key;
        this.lastTime = (new Date()).getTime();

        let video = document.getElementsByTagName('video')[0];

        if(video){
            switch(e.key){
                case keys.speedUp: // 加速
                    video.playbackRate += 0.25;
                    Toast(video.playbackRate.toFixed(2), 100);
                    break;
                case keys.speedDown: // 减速
                    video.playbackRate -= 0.25;
                    Toast(video.playbackRate.toFixed(2), 100);
                    break;
                case keys.forward: // 前进5秒
                    video.currentTime += 5;
                    break;
                case keys.backward: // 后退5秒
                    video.currentTime -= 5;
                    break;
                case keys.volumeUp: // 增加音量
                    video.volume = Math.min(video.volume + 0.1, 1);
                    Toast(video.volume.toFixed(1), 100);
                    break;
                case keys.volumeDown: // 降低音量
                    video.volume = Math.max(video.volume - 0.1, 0);
                    Toast(video.volume.toFixed(1), 100);
                    break;
                case keys.normalSpeed: // 正常速度
                    video.playbackRate = keys.speedList.normalSpeed;
                    Toast(video.playbackRate.toFixed(1), 100);
                    break;
                case keys.doubleSpeed: // 2倍速
                    video.playbackRate = keys.speedList.doubleSpeed;
                    Toast(video.playbackRate.toFixed(1), 100);
                    break;
                case keys.tripleSpeed: // 3倍速
                    video.playbackRate = keys.speedList.tripleSpeed;
                    Toast(video.playbackRate.toFixed(1), 100);
                    break;
                case keys.quadrupleSpeed: // 4倍速
                    video.playbackRate = keys.speedList.quadrupleSpeed;
                    Toast(video.playbackRate.toFixed(1), 100);
                    break;
                default:
                    return;
            }
        }
    }
}

 // 注册菜单命令
GM_registerMenuCommand('配置快捷键', configureShortcuts);
GM_registerMenuCommand('查看当前配置', showCurrentConfig);
GM_registerMenuCommand('重置为默认配置', resetToDefault);

(function() {
    'use strict';
    window.onhashchange=mainFunc;
    mainFunc();
    // 这个代码不管用，会导致所有的都运行不了。建议编辑脚本，设置-通用-仅在顶层页面（框架）运行-是
    // if(window.top === window.self){
    // }
})();