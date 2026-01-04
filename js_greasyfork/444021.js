// ==UserScript==
// @name         adrenalineyt Theme (Shellshock.io)
// @namespace    http://tampermonkey.net/
// @version      0.42
// @description  !
// @author       Blizzard
// @match        https://shellshock.io/
// @match        https://algebra.best/
// @match        https://eggcombat.com/*
// @match        https://shellshock.io/*
// @match        https://eggfacts.fun/*
// @match        https://biologyclass.club/*
// @match        https://egghead.institute/*
// @match        https://egg.dance/*
// @match        https://eggisthenewblack.com/*
// @match        https://mathfun.rocks/*
// @match        https://hardboiled.life/*
// @match        https://overeasy.club/*
// @match        https://zygote.cafe/*
// @match        https://mathdrills.info
// @match        https://eggsarecool.com/*
// @match        https://deadlyegg.com/*
// @match        https://mathgames.world/*
// @match        https://hardshell.life/*
// @match        https://violentegg.club/*
// @match        https://yolk.life/*
// @match        https://softboiled.club/*
// @match        https://scrambled.world/*
// @match        https://deathegg.world/*
// @match        https://violentegg.fun/*
// @icon         data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUTEhIVFhUVGBgVGBgVFhYWFRcXGBgWGhkXHh0aHSggGBolHRcYIjEhJSkrLi4uFyAzODMtNyktLisBCgoKDg0OGxAQGy0lICYtLTUtLS8uLS0tLy0vLS0tLS8tLS0tLS0tLS0vLS0tLS0wLS0vLS0tLS0tLS0tLS0tL//AABEIALEBHAMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAAAQMEBQYHAgj/xABLEAACAQMBBAcEBgYGBwkAAAABAgMABBEhBRIxQQYTIlFhcYEHMpGxFCNCUnKhYoKSosHRFSQzQ7LwNERTc4Ph8QgmNVRjZJPCw//EABkBAAIDAQAAAAAAAAAAAAAAAAADAQIEBf/EADQRAAEDAgIJAwQBAwUAAAAAAAEAAhEDITFBBBJRYXGBkaHwE7HRIjLB4fEUIzNCUmKC4v/aAAwDAQACEQMRAD8A4lRRRUKEUUUUIRRRRQhFFFFCEUUUUIRRRRQhFFFFCEUUUUIRRRRQhFFFFCEBc0hFFWmyhA56u4dogdBIF31U/pLxx4rr4GmU2B5iYVXEi6gwSbp11B0Pl/OtP7PZEjv4usP1cm9C5H3JkaPP72fSoPSDotPaBZGCvDJrHNEd+Fx+iw+RwR3VUQylSCOXD+XlWimTTcA4eZx5jvS3fUDC2XTXY0kcqvIO0d6KQY4SRnv7mUgjvwa1fSs/92rNRxjmTeHcGFxj5gVcbIeLbuz3AwLyJU3geLtGMI/6y7yE/peVZDpJdPDDHby5EU8BU5+zJHJvI+P0WUA+DNXSqNZVD3TBkdSDhuOSxt1qbmjKD7juM1z6xsHmkEaAlmIAA4kmrvamyrS1bqpZpHlXRliUMiNzDMSMnwANX/sjRTfrw3wrlPFwpwPPNc8lYkkkkknJzxzzrEdWgwENBJ2iQLn48haBNVxvAGzgrTaGzd1FmjYPE+QGHEMMZRhybBB8jVba25kdY14uyoPNiAPnVx0emHVXMT+46K3k6thSPHDMPI1Z+z2wBvlkfG5bq07d3YB3f3ip9Kh1D1dRzRAdlsvB5bECqGazScM+UrPbfj3Z5F+6xX4HH8KgVK2m+ZGPeSfiaiVm0kzVcd5906iIptG4JaKXGmfSvIFJTEuNM+n+fjRVltu16iQQH3olAfwkPadfNSd3zWq2rPZqO1VDXawlFFFFUUoooooQiiiihCKKKKEIooooQiiiihCKKKKEIooooQiiiihCKKKKEIpKWihC1/QbpmbEtFMnX2cuksLYI/GoOgYemcDuBGj6U+zyNohfbLfrrVxvboyXi7x36cMHUc++uWVs/Z301m2dNhe3FJo8THsseRH3W5Z+Oa10KkkMPf5y3HkbYKqtgFw8+fM4SdFL2aznWaI7rJnj7rLzVhzU8x8iK6r0r2dDt6wE1pgXMJZ+qJG9lgOsiP4t0FW4Ejlk4evejVptO2kuLHCuw3twgApKOKEct4ad2QCK5Ba7RntJt6J2idTg8QdDqD68q6D6dJ7RqyCLGRe+RGY8CxtfUY76rg4XtxCq9m3stncK4DJJE4JDAqylTqCDqD4Ve9K9jxXLG8sio63Ly25IVo3OrFM6OhOTgajPDFaubpfsvaCD+k7fMygDr4ezIfPGM+RyPCoqbU2HaDMNtPcvxUXEhVAfwjRh5g1QUhqlrxIyhwtzw5GDuyTC+TrNMbZBvy278N6wVnYyGMoiMXYgnAOgGePdWk2ZF9GsrqU+85WAEd51Yegx8am2227radzHbRxrEjNkxQKETdXtNvHi2QManGSKsOmxtNnwQ2W8s9zEpLL/AHMcr6tJIPtvyVOAAy2cgU1j6VKIxiBu5cSZ6JTmVKhM4Z/yuTz5zrzpupdzGzZc6niT3+NWPQ/o9Jf3cdsmRvnLtySMau58hw7zgc649Rh1o84rex0hLf2HVWNuzDDXEksg7zEgREPkW634VP6B2iK8l7MoaKzXfCkaSTnPUx+WQXPgnjS+0faST3zCEAQW6rbQgcBHEMZ9W3j61qdj9G87OVrhzBap9bIwA32LYwqg+9KwA48AVHKt9Ojr1DrWDB/Awxn9SkPqarQALuP89lzpLeWcyzNkgHflkbhvOSePNmOcAanXuqvq66Q7Y64iOJBDbR56qFTkDPF3PF5DzY+QwABVJWCpAMDqtDZN0tFFFKVkUUUUIRRRRQhFFFFCEUUUUIRRT5gwgZtN73fHHE+VR6s5pbioBBwRXrHjSUVClLjxrzS0UShFFFJUIS0UUlCEtFJS0ISqpPCrHZ1uqtvyPgLrgan/AJfnVZUy/jMbdUdCmjDufmPTh8a00SGf3ImNu3LDrjklVBrfTMT4Vu+inTo20y/R0wo0YMdZF5g6+o7q0ntU6NJcKdoWeoYAzIOTFQyv4BlPxx31xu1uDG6uvFSCO7TkfCuxbW6QrZ3FlPHrbXVnHvofdZN98qf0kDLg8iPE1vZpIrmaka2GwERYcrxOGdrLKaJpWZ9uO2Dt+ecCVyCBGDgEHjrUvZ1lLcTKkaFmYhQBWo6V7ENvKGjVJLaTLQyjmBnKNjhIp7JHhmrvoDsRpZC0QKhRiRicIqniAx4ZGnrVqehtwLoAve3l7cbKr9IOTZJ2XWjuoU2Fs7fiKve3H1ZlGoTABIX9EZGvMkHgABwy8kLMWYkliSSTkknUknma+gOkfSK1iVEEa3MsYYBmGYlLHJ0PvHP5AVj4eltwzhYrS0LseyDbRZH7Kj86tU0Rz6cmxnPPZwERAMbsZUt0lrXR7Zcd87Od1huiey7ieTEETyDg26pKjPeeA9a60uxxsewkZmRLq6G5x1jj5ooGrMeZ4cMnQZsLbpi1raSTTyxyvH2OrhVUiWQjIQFR9Y2DkkdkcsmuTttK52lc5ZjJNKwUeGTgKBwVR3VFJrqZFIxAM8d2UN27SNklFQh0vGyOH7V30D6Epfz674hjw0rkgDHHd/E2D5DJ8Da+0rpXHOwtbdN2CHsq2NCeBKjl+L3vLJyvTrpSuzoBsqwIBQf1mYe80jAFkB7+GW5aKMYOOY2u0njbfUAvyZxv7viA2hPic0v+oYHzgMo995OAwgZq/ov1Ymds+24DPaVqNkezu7vBvRRkIftt2V/exn0NWMnsVvs/29p6yMD8NysHtPbFxOfrp5ZPxyMw9ATgDwFQN7xPxrJVq0nGzY84x2Cexj2i7p88zKSiiisaciiiihCKKKKEIooooQirXozsdry5SBTgHJdjwSNRl3PgACaqq22xx9E2Pc3PCW9kFnEeYiUb87DwbRKbRALpOA8/ncqvmLLNbdvElnYxDdiXsRA8RGuik/pH3j4sarqSlqj3l5LnYlSAAICKKKKqpSVpujPRGW7V5dI4Y/ekc7qA92T/AJxVX0f2Y91cRQRjLSOFHqeJ8Bx9K13tV2mqSrs22OLazAQgf3k+O3I2OJHu68CGrTRDWjXeJ2Dh4O+yCp+s76WmN6if0ZsaA/X3k9y3NbSIKg/4kpG8PECpUe0ej/um0vgPvdZGW88ZxWApar65BkAdAralrldBvujezZYjNZy3MgHFDuBl89DUO8ntrBkT6KsrlFdxK7EKHAZV7ONd0g+tUPRbbMlpcJLGeBwyn3XXmrDmK6b036DttIJtHZwDrIiCSHeAdWRQuBnQkAAY8PGui3SG+lrU2hrttvBOXAjGJyGifUIe4kbL/OWazI2JZ7SjeSxBguI133tXbeDKOLxP9od6nUVhri3ZGKsCCNK3nRrodtKCdJEtJ1dTxMbKMcCN49nBGnGtxL7NIzK1xfyLFCDvdWp+scZ4Fh7inwydTqONLfRa+nrOID9guTy27+pwV21HNfAB1dpwHNc76FbC3IpNp3C4gt/7EN/fXP2FA5qp7R/DjvxjZpCzFicliSSeJJ1Jrbe0jpet46wWyiO0txuRIowumhbA7+Xh61hayViA0MGWPHzyE9lyXIrbMPpWxoyNZLCdkI59Rc4YN44lBHhmsZEBnXhWp2XBNbB2XDRSLuEjVCDruOPsnB4HjxGeNM0Slrm+HtYx+QqVquqN/utB0E2sryNZzNvQ3DaA/Yl0CsvcSRg9+a0/T67ls7eO2XTI3sRrurgfawO8n93xrmli0aODgg8RjUj8wa690pKbR2bDeqA8kPYkxkHXAbOOGpDeTGuu17pbrOEEkWyP+k7ROGGxc9zQQ6BgOozFvMVzHZReWVEGSHYLr3k6fOtDtfZJWaWCJsSAagaFtM7vwxp/kO+zq3Et/FvAqEYNgkEEjgBgDXOD5A91Vl3fv9IaYsOsaUuuQM5LE+eOVbWF12zIjPeSByseqyuDbHAz2ET7qm6WfVQW0APJ528Wdgo/djHxqZ7KbtYbqW4YZ+j280wHiiGmPaQUkmWWL3WijYL91SNfgwas5sLaRgdiODo0bDvVuI9cYrjV3AaTDrA9gRGWwrp0wTRtcjvn3RFOHdpLhySzF2wAzszEk8eZJPGriLbtgBunZ7sPv9eFfHfu9WV9PzrKMNaKxN0p7RAj3Pf2Wg0WuMnzotBtrZsJjW4tXJjYld1wA6MADunGnA5Hfr3Vn6stnSHq5Yz7siqw/EmcH4Mw9aW22WWRXY7ocZXxAJXPxVh6VepT9XVe0XIuBuP5seaqx2pLScPPkKsooorCtCKKKKEIooooQiiiihCdggLkhdTjOK23tQi+jrs+xHC3tVdv97OxaT/CtZDZMxSaNhykXyxnBHljNbn232pG0OvB3o5UVFI4B4QEkjPcwOD5OO+tYa30NbOT2iOocUnWPqRl/M+w6rnVFFFZE5FFFFCF1H2E7LDXn0nGVgR97wJXC/Eb37Nc1vbpppHlc5aR2kY97MSx/M10/wD7P20gt5LbsdJ4jgd7Ic/4S9YfpZ0cazlYA78O+ypIOGn2G+5IOBU92Rka1rq/UxpAsAPz+Z6pTIDiJvPx+IVDRSUtZE1IDWu6I9ObmwY9U/ZPvIfdPj5+NZKgDJwKbSquYbdNqo+mHYrskPtiuHO7gDwxx8jxFevalfdfYW99Azbkv1Ug3id2QZ4+JwfgK422QeOorqHRYC62XtC145hS+jHc8Wk2PMoBXRpVy5p1WhrhsEWNuxhZX0gCNYkg7b3F7cRNlyypMFjK4ykUjfhUn5UiT7p7IGe8gH56VYw9Kr5MdXeTxgcBHI0a/BSBWACmPuk8IHc/C1EvOC8Q7BnJ7SFfxaH4cfyrovRzYb9UoZTnG42OaZyN5Tje/IjQjuqh2T7VNoR6Syide6VIyf2iufjmtBF096/dEqBY2+1FmPd8Sh3gSPA+ldfQXUm/4xfOTJ6AAdFz9LbUNnHhAjuSVTbe6Mi2YyMx3ToMAnHPGcaHzxU7od0qFizI43rebCzRnlkYJGvvAH10Hlsb7ZL3Uf1EgkdR24ycMy9+Cca40Kkjx1rl/SzZptnXf3lBXIUghi2e1nPDH8q01dQUibbxhz3bR2ukUw/XGO74tjsK1G01l2bdQToxltt9ZIpV4OhIO633W3TgjzPgKLp3ZGG/lCHs9Zvrj7hO+mPDBFOdFLu8mi6mCKSRFOgCs6BSdQx4LrqDkYye+txd9DZLtbdpGRJETq3XfEhwuie5vDIQjOccKjXD2Bzn3tjjuO3blmNqvqlpIa22zt8dN1+P9IpCGjTmkSD0KhsfvVS1oOl4Q3MpU5y5xyCgaBfQYqlSIkHwGfTn/OuNpbXGs4eW/QXQ0cj0gfLpmrKzsS0Ms5HYjKL5u+9hR3nCk1Ct4GkdURSzuQqqBksxOAB3kmtn02tVtUg2ZF2mh+tuSuu/dSKo3R3hFAUeJPjSqAxJEx7/AK8tKvU2BUnRPY8l9dpApxvZLufdjiUZdz3ADh44HOjpVtNZLhuoBEEYEUI44ijG6p8yBvHvLE866BsnYT2ezSkKGS+v1Knc1KQ/cB4BebNkDxwuawE+yIYjuS3SFx73VgOgPcG4N5jTuzxrUKNZrbWJ2kDdmRifZJNSmTfDd5l+VRUUUVzVqRRRRQhFFFFCEUUUUIXqNsEHuNbrb220a4uIbjJtrnq5gwG80ErRIRMg54JIZftKSNDg1gqm3Uu+qE8Qm7+zp8sVrovim4cOByM9vwkvH1tPm0exXi+tGicoxB7mU5R15Mp5qf8Arg1FpwyHG7nQagd3l3V4rM4CbJomLooooqqlWOwdqvaXEc8Zw0bBh445HwI09a6F0hure6umdG3Uu1WQHip3veSRe9XDfka5ZTq3DAYycA5Hhnj/AA+FbtE0z0ZBEjzzdfas2kaP6osYK39/7JL7d6y1Ec6HXCyKHHo+M/OszP0K2ijbp2fdZ8IJGHoVBBqFZ7buIjmOaRPwsw+Rq0fp5tAjH0ybH4z/ADqj/RcZEjdH/rzYrs12iDfn+vlP2/s8vt3rJ0S0i4mS6dYgP1NZCfALUXadzawKYrMtK50e5dd3I5rEn92p5sSWPgMiqa8v5ZTmSRnP6TE/Oo1V9RrP8fU48hl5ndW1S77unmKSup+xWcG5hjYDEi3MDfgKRyAftFvjXLa3HselI2nbgcDJ80YH8sUaMYcQc2n2UVRYcR7rH7QtjFLJGeKOyHzUkfwqPV/0+UDaN4BwFxJ/jaqClVvvPE+6u3AJBV30dbekEfAP2R375HZPxxVMiknAGTWs6NW0UUiSTyDfVgVijwzFgcgu3BQOONSfCtegseagc39cJ3pGkuaGEHzet3su/wCot2uHY5gcRrjRnwCVQfrYBPJQx5V5tvaTbXO7FtOBXAOk0Q7cZ7yPtDvx8DWS2/tvr4N0FVCTgbp0Gqv/AC41mlsCdRjB44O+B6iunpT3Gp9AmMCLEcCMM5v1WPR2tDPqMTiNvEH4911XphsV3jWS3u5JrRh2dwK0Y8CE3cHzGR31fdBLZ7XZVzKc8GKd4yoGfDlWP6K330CLfDu5fslM7kZxzYa7xGfDFbSy24LqyuxHg70TSKoGnZK9kY8SfjTalN+oARm2TOUibC3PApbHt1yQcjA5GL/jFcJ2ts9wxYKcHXgcjNWPQ7YdxPKpigkkXJDAIxGCCCCcYGh51tNmSXQ3XkuI7ODkerQyv4IpBdj48K0/SX2kfQ7aMQb7SyA7rTEFgg06wqOyuTnA14GslXRxTqmqwYHMwBne3bHdhOinV16eo44jLGPM8FF2L0STY8b3bxh7sgrApwVizpvEnTf14D+Omc6JdBri9uzJL7m8Xmc65zru+Oe7upNhm52tcoGcsW7TuxJCIPeOvADgAMDUVf8AST2mwWsf0PZsasigqZnLbrH7RXdIL517ZIzyyMGmVS2mwBsF5vIs0DK2JzgYkySqU9ao4zZotGJJ4++y0Qk9pe2NGtLMYQKElkHvPj+7yOCjuHEmuLzWbgkYPwromz/aQYhvSQJM3IBUijHmSHd/3adk9s0mezs6yA7ijE/HT5Vm0n0CGtvbOQePmGQwT6Aq3NuEftctooorkLaiiikoQlooooQiiiihCKTNLQRUoSmvaqDzwfypsGkNXDpxUQvboRxGP8/nXivayEacu46ivW8p4rjyP8DRqg4HqiTmm6K9Hd7z8B/OvJqpEKZSUtFFVQiiin7GzkmkSKJC7uQqqoySTUgShR66P7FbMnaULHQRLNK2eQCBR8Cw+NQNudHU2aiLOwe5btdWpyE7i3gOQ5k55CrjodObTZl9fNo9xizg5HUFpWHhjGvfHit7KAp2LhJGWU7/ADDZBWf1C+8WHdc/27cmW5mkPF5Hf9pi38agVbX1gUgSZ9OvLdUOZRDhn/DnsjvIPdVRWbSBDydt/hMpGWpQadtZijBhxBzTVP2URd1RVLFjgKBliT3Y50tk6wjHJWdEFXm203WDbuYrhRIuORBKuue9XDD1HfXvYlvalxiWWOQkYDJvqT5pr8RWnPROb6LLbyoVljzeRA4yoO6J4+OmV3Hx/wCke+sxsGwMcwc67uWGNcsB2fzrtinUNYWBBONrZ2POecZLnOcwUzci2G3K6vts7J6wK0M8bJH2CoLAq+WJ0I1JJPOpnQuZohcxHI+ofHfvaY8tR/nFZKBXhcvvIudCrHIYHirDmKuLSIqVaLe3JAVAznd3h7vlzB56Vrpy90kEHO+WGHRZnnUFjIGHHj1UzZsTXkiM69tXzv50YLk6/kM1QdJb1Zp2bOVXCJ3BF0X48fMmtRsm8MNleXB97ejtYweAZt5nx5Kv5is59DWV0KjCSELrxRiQCp8BkYPcRzqtf+4NQYyJ37/P4tSHp/Uf4WqjElrseOKFGM+0i2d0arbA8PDfzx7mNULdHba2wNoXaxyYz1MIM8w/Fu9hD4Fs+FWPTDpCyXUyR6JC4ihXkFiURjTu7IOPCucTyMzFmJLEkkniSeJrn6RUbTAIu47cBGG4mLcsltpMLyQbAbPMPlaq82TaSg/Q7guwBJjlRo5MDiRxU+hrJyIwOKdspWWRGX3lYMPQ5oumG+27wyceVZKr2vph8QZgxnyjl/KfTaWu1ZkRmmaKKKxpyKSlpKEJaSiva48R48RVgJQV5pKeKf8AUa/EcRTZU8eXeOFSWkeefCgFJilU48f415r0D3/86gHNBT3VZ1TXvH2h/MeI/KmK9lRxB+Oh/l+dPtMD/aLk/eHZY+fJvPGfGmlodu9u0x3HBVkjy/7USjFSepU+648nG6fjqv5imurbkPhr8qqaRGPa/tZSHg+QvFFS1t5mwBE7Z4dhiT5aVYwdEb19TbPGv3p923T9qYqKPTOU9Ea4VHSVrYujdnEc3e0YtNers1a5c+G/hY1PjvGrO22xZxf6Bs1MjQ3N8evIPIhAOrVuYwGPgauzR3HH9qDUAWe6OdD7y+I+jwsUJwZX7EI1x750J/RXJ8K6bZWdpsCB5Q6XN+wKhx7iZ4qg7u9uJ4aZOG9k319cI0rPK6nKq5AUvgYKRqOxDGPtMOXE6hKz/SSCCAB7p+ukIykEZKqf0nb3hGOWMFsaHBOOi3QadNmu8ydmXM/jErG7SXvcGtEb/hZa2trjaFzkktJM4BdvdyxwPz0CjyFbzalnFeSQ2UL7mz7CNjLNy3AczTaaF5GGF78k441ldl3szsCi5mmzBbRxgKEDZR5FA0BxmNW8XOexVj042ilpANl27hmBD3kq8JJl4Qqf9nH8xyOcrLqbGki5OZ37t4sBsJm1gwNe43sNnnfK3ErLdKttfTLhpQu5GAI4YxwihTSNB6anxJNVkMqg9pQw7tR8jTVIBXODzrStRAiFeWMlgTmWK4Uc92ZCPQGPP51dxdNo7UFdmWaW5IwZ5T11yQeOGOkee5RWJIpKadIOQAO0Afx0ASxSG0nn4e633QHpVJ9OjEp3uvbq3LHOS4K72uucMR5MacvbtlcoQrIWxkAKeOmd3GvDjWO2HG3Woy/YIfPdunOa00Y624IXTfYkerb+PLGa7OgVnup6zjckAbx+VztLYxroaMAfOymHZtpcaSsbd+Tghkb8Skg+oOdedWVhsO5imMsQjuLfsq3UOJR1agBTgdpWXAOoHPvqsSz+kx3AUdpCZlHPCHtr6x7x/wCGO+svZ3LwtvqzKw5qSv5irV3tZV1gMbyq0ml1OCtj7S1SKC3hhPZd57mT8UhQJp+ii4+NYaw2g0fAnBIOO8jOPmR61Pv9sNKvbO+Rrk6nub+frVMU3gSOWvpXP0h8Vdek7zErZSbLNWoFoukki3ai7hPbwBcR/aDKAOuHerADPcwJ4Gs6k4+0N75/HjTUchU5UkHvBxXknNZKlbWOsLHMZcQPxgntpwIOHdSnutN1VVAeOOJ8ydaiUtFJfUc8384bExrQ3BFFFFUUr3HJjkCO4/5zUxI4H+20TfpgvGf1lG8v7J86gUUxtQixAI3/ACIPfiqls3Bjzp2UmeydNcBl+8hDr8Rw9ai16RyOBx5V6388cetS7UJ+mRux72Q3WH3X7JuvayEa5r31eeGPRx/GvTW7D7L/ALOR8c1LaVQXAKgvbgUgdT7y48Vx8jpUqC7CjB3ZF+7KCCPJlO8vo2O8VA07/nT8MAP96i+e9/Bauyo7KOsfkA9FBaN/nsre02PBcHEUwic8FmZSmfxjBH7JqbP7OdpKCyWxlX70DLID6A735VRR2iZw1xGB4LKflHVvYWtqva/pF42HOO3mJ+IK4p5Yx4uAN4c32lKa8g4k8Wn3j8Kvm6M3ye/ZXK/it5R81pgbDueH0af/AOKT+VbKLaYUdnb14PAJdD/9hUe/2sW0/pa/l5f2b48svc5/Kqf00nFX9SFnU2Der/q88Y73Vol9WfCj416j2MOMtxbp3/Wdc58lh39fMjzFanZvs0urr6zdeKPiZrsiMeeDlj56it10b9l9jDrK73TjU7v1MCjjktnex45we6rii0WdccfAObgqa5xFjw8nouWbN6Om4kEdnFNcPzLIEQeO6GIUeLNjwrq/Rn2WR269ftKVG3Rnq97chTzbTTwUAedP9IfajYbOj6ixjjlccoQEt1Piw98/hznvFcX6UdMLvaD71zKWH2UHZiXyUaepyfGoNbVs36R3/XEydhUikDd1z2XSenftJgRTBZESEDd3woWBAOCon2gPHThx0xx65uWkcvIzMzHLMxyxPeSajk1fbBvktP6wVDzj+wVhlI25TMD7xH2V79TwGVmoatsAPPIHJWDQy+Z86LRvdf0TFvH/AMSmjCqP/IwMuB+Gd15cVB11Jzz9mzqeNO3M7SOzyMWdiWZmOWZjqSTzNNUmrVLz555xljWwkq76J7L+kTMPsxRSzOe5Y1yf4D1qlra7FH0XZF3cnSS8dbKLv6tcSTt4qeyvnU6OYeHHK/RRUEtI2rF55+tSILrdOqRsO4qPmNaYVyOFWNpJbvpKjIfvxEY9VOnqCKZQmfpdB34dcOtt6pVwu2Rux+el1bbPuFkIRVVM929jPI6k6U9seRlu33l3RGJm4a5VGx/CvWz7OFEeTfbdCnUqCQCQM43hxJxxHOpq3MU0TyJvFo49xmZQpdSCASFJ1A048CK7zGuOqHuGtjaLgLlPI+otBjC+0qb0G6UJBcILgBkBCFyMFVbQgn7S94Pp4xOm3QqWC5ZFI6ksWjcnC7h1AJ4AgHGuOGaznWqvLjy/jrV3N0xeSAKx3jENxlOoeLPZb8SHnxw3hWaWVDFV3vlftnmbp8OYD6Y9vP2vNp0HZiALuzB+68u7nyOMU/F7PLuFt54usjfMZaFlkAV9N7sk8M59KzbzK/aTIHME+7/MVebK2pvKrrq0bBXU6b68VbT7XEfCjR6dE1B2znbFxzysbSFNZ9QMM88B+D5jux1xCUYowwVJBHiKbrZ+0gOlyGDs8E8aTw7/AG8K4wyZOSN11YYB0rF1xq7GscQJ5/yfwdwXQpuLhJS0UUUlXRSUtFShAH+eFeih7jXigGpgKLpaSnBMf+tOLcDnHGfiPkau1rT/AKo4g/iT2UEnZ5zhR69I5HAkeWlWK7TUDS2g9QW/xGnF28w/1e10/wDbxn5iminS/wB/YpZe/JvcKAs7nTeJ8+186l2djNKexbvJ+CJif3Vq5tfaJfxDETwp+CCIfJcU7ce0vakgw19KPwBI/wA0UUwvH+8nr7FQG/8AEDzcpFh0GvXGRsuTzlZ4lHj2imleW6KGP/SLrZ1vjipnaeQeG7GZCTVVbpfbRk3FNzdP3FpJQM8yWOFHicVsbH2fQWg39rXkcPPqISJZvXAIXzwR402m/IAdBPKB5nCo5mcnqYVXDYbMTjPc3bclggS2T1eUFseSg1rtg2tyF3rLZ8dsoGs8naZR97rZuHkMjwqtuOntlZjGzbFA3Ke57T571GdPRseFY3b/AEnvbw5u7hivEKx3VHlEox649a0B4aDLZO0/GAG8u/KUWybG2wfMSeQ6Z9C2l0mtbU79xcvtC4HBUYi3Q+DHj+oAKwfSvp7d3w3GcRw8oohup6ge965rNSSryBPi/wDBRw9SaimsmkaW51gen6AA/wCsA7Sn0qIbePPfr2QTS0UVgK0IoJooqEIopAKKEKbsfZslzNHBEMySsEXu15nuUDJJ5AGrvp3tON5I7W2ObazTqYj/ALRs5lm83fJ8sU3Z3Ysrdih/rVypXI4wW7ccd0kvDwT8embpzv7bYzPYfv24qouZyRQKWkpSstJdXQWxhi4NMxmc/oISkY8i2+f1Fp/o4yxxyMzdl9xCSDjVjy4nQN8KpJJQ7gt7kaKvogAwPFmyf1jXu9uj1aJwzmVscNeygHgFX9811qdUMcapvqi3L6QeEmd4nZfE+mXNFMZ487+ftO7atGikZDqRqCDo0bAFWB4EEcCKqo3KnI41axbSDx9XOpYL/ZuMb6DJOBnRlySd095wRxqP9JC8Y4pByJDD/CQwPrWaoGPdrtdA9uOfMSPZNYXNGqRPnlsU0/ZQ4+0R8O741K2HP1fWyHgsTADvd+wvw3i36tNTzxuDuxBMa4Dsw8cb2T+dQzIcY5Zz/Kq64Y8PBwFonHmBmp1dZpafPAt7fAXmxBKNZbCfDd/Uz6/4x8659Wy9nd8P65aucJc2sgH+9i+sjPn2W9TWQk48APLh/wAqrX+toqbfxHz7KzPpOqvNFFFZU1FFFJQhFLmgDOgqWmzZSM7hUd74jX4uQKu1j3faCeF1Bc0YlQ6KnmwC+/PED3KWkPxRSv71MHqxw6xvRUH/ANquaRH3EDmPYSeyp6gyk8B+cO6aRPEDzP8ALWve4vN8/hUn/Fik4+6o/M/OpENovGSaNB3DLt6BAR8SKs1mwTvMgdZAQXDMx5suvMcSE+8AO9yT+6gJq82dNYoRi3mvJPuseqh/Yj3pGH6y1SyPAvuK7nvkwg/ZUk/vU2965G7vbq/dXsr8BTQ9jMY5XPXDn9SXDnYTzgDpj7LeXvTO6EfVGeKyi5QWajf9d06Z/Sk9KylxtGP7IY88sQzHXjkjdU+SE/pVS0tH9a4fYAO5+J5cVJ0drvuM+de6ly3jE5GF8Rkv+0cn4YFRePP415xRisz6jnmXXTQxrcFJitC3Box5yIvzNEloV4vH6OrfKo4FPxxp9pz5Afx5fCmNDTl1MKp1hn2TBFPWlrJK4SKN5HPBUUux8gBk1cbMnhU9izEzDXeuJGEa+JClFx+I1az9KZFUobgInODZyLbxeTyKo3vhID31b+nAvrCNt47gTylVFWcAe34JTVv0BuAQLmSK3LcI3YPctpyhjy2fBt2vN3sGztm/rF0zkcYohmQ+DHhH5HXy41VXO35SpSILBGdCsWQzDXR3JLv5E48BVPVvVosENbO8z7SjUe4yXRuHyrTaV9G5+qi3VGignQDwUc/FixPfVZmiikVKrnmSmNYGiAldiSSTkmkoopZurIoooqEIzypZGyc+Q9AMD8hSUVMnBEJKKWiiUJUbBzXkiloomyF7glKMGXQimyaWip1jEZKIEyiiiiqqUUlLRUhBVjY8DVbN7xoorTpP+JnNJpf5HIFFFFZW4JxSvwrwlLRUv+4IbglopaKhCSloooQvNLS0UHFCQ0tFFXUFSLr3F8/51Gooqa338gq08OZRRRRS1dLRRRQhFFFFCEUUUUIRRRRQhFFFFCEUUUUIRRRRQhFFFFCF/9k=
// @grant        none
// @lisense MIT
// @downloadURL https://update.greasyfork.org/scripts/444021/adrenalineyt%20Theme%20%28Shellshockio%29.user.js
// @updateURL https://update.greasyfork.org/scripts/444021/adrenalineyt%20Theme%20%28Shellshockio%29.meta.js
// ==/UserScript==

    (function () {
    const addScript = () => {
        document.head.innerHTML += `<style>
* {
	--ss-transparent: #00000000;
	--ss-black: #000;
	--ss-white: #8cb8ff; /*White Text*/
	--ss-offwhite: #FFF3E4;
	--ss-yellow0:#000000;
	--ss-yellow: #171717;
	--ss-yolk0: #171717;
	--ss-yolk: #000000; /*Yellow Buttons*/
	--ss-yolk2: #0044b3;
	--ss-red0: #000000;
	--ss-red: #000000;
	--ss-red2: #000000;
	--ss-red-bright: #000000;
	--ss-pink: #000000;
	--ss-pink1: #000000;
	--ss-pink-light: #000000;
	--ss-brown: #000147;
	--ss-blue00: ##0099ff;
	--ss-blue0: #ffffff;
	--ss-blue1: #0407b8;
	--ss-blue2: ##0099ff;
	--ss-blue3: #5566ee; /*Lighter Box Borders*/
	--ss-blue4: ##0099ff; /*Blue Subtitles, Darker Box Borders*/
	--ss-blue5: #171717;
	--ss-green0: #000000;
	--ss-green1: #000000;
	--ss-green2: #000000;
	--ss-orange1: #595959;
	--ss-vip-gold: linear-gradient(to right, #0004ff, #0003c9, #0002a1, #000170, #000147);
	--ss-clear: rgba(255, 255, 255, 0);
	--ss-blue2clear: rgba(94, 186, 217, 0);
	--ss-shadow: rgba(0,0,0,0.4);
	--ss-blueshadow: #4a4dff;
	--ss-darkoverlay: rgba(0, 0, 0, 0.8);
	--ss-darkoverlay2: rgba(0, 0, 0, 0.2);
	--ss-lightoverlay: url("https://media.discordapp.net/attachments/968115538976972831/968352357983346758/Screen_Shot_2022-04-26_at_09.55.53.png"); /*Main Background*/
	--ss-lightbackground: linear-gradient(var(--ss-blue1), var(--ss-blue2));
	--ss-blueblend1: linear-gradient(#349ec1, #5fbad8); /*Some Box fill colors*/
	--ss-scrollmask1: linear-gradient(var(--ss-blue2clear), var(--ss-blue2));
	--ss-scrollmask2: linear-gradient(rgba(56, 158, 192, 0), #389EC0);
	--ss-fieldbg: linear-gradient(#91CADB, #000000, #000000, #000000, #000000);
	--ss-white-60: rgba(255,255,255,.6);
	--ss-white-90: rgba(255,255,255,.9);

	--ss-me-player-bg: url(https://mir-s3-cdn-cf.behance.net/project_modules/disp/67d89460550773.5a512c466d624.gif);
	--ss-them-blue-bg: rgba(0,66,87,.8);
	--ss-them-blue-color: #003b75;
	--ss-them-red-bg:  rgb(133,0,0,.8);
	--ss-them-red-color: #ff4145
	--ss-me-red-bg: rgba(255,65,69,.8);
	--ss-me-blue-bg: rgb(94,187,217,.8);
}

#healthContainer {
	position: absolute;
	left: 50%; bottom: 1em;
	transform: translateX(-50%);
	display: inline-block;
	width: 6em; height: 6em;
	background: var(--ss-blueshadow);
	border-radius: 50%;
	text-align: center;
}

#health {
}

#healthHp {
	font-family: 'Nunito', bold italic;
    font-weight: bold;
    color: var(--ss-green);
    font-size: 1.2em;
    transform: translateY(-3.45em);
}

.healthBar {
	transform-origin: center;
	transform: rotate(90deg);
	fill: white;
	stroke: #231052;
	stroke-width: 1em;
	stroke-dasharray: 14.4513em;
	transition: all 0.3s ease-in-out;
}

.healthYolk {
	fill: white;
}

.healthSvg {
	width: 100%; height: 100%;
}

.crosshair {
	position: absolute;
	transform-origin: 50% top;
	top: 50%;
	border: solid 0.05em ;
	height: 0.8em;
	margin-bottom: 0.12em;
	opacity: 1;

	left: calc(50% - 0.15em);
	background: blue;
	width: 0.3em;
}

.crosshair.normal {
	left: calc(50% - 0.15em);
	background: blue;
	width: 0.3em;
}

#hardBoiledContainer {
	position: absolute;
	left: 50%; bottom: 1em;
	transform: translateX(-50%);
	display: inline-block;
	width: 6em; height: 6em;
	text-align: center;
}

#hardBoiledValue {
	font-family: 'Nunito', bold;
    font-weight: bold;
    color: var(--ss-blue);
    font-size: 1.6em;
    transform: translateY(-2.6em);
}

#hardBoiledShieldContainer {
	width: 100%;
	height: 100%;
    fill: purple;
}

.hardBoiledShield {
	position: absolute;
	transform: translateX(-50%);
	height: 100%;
    fill: purple;
}

.crosshair.powerful {
	left: calc(50% - 0.25em);
	background: blue;
	width: 0.2em;
}

#maskmiddle {
	background: url('https://images-ext-1.discordapp.net/external/1DBI0gpeLZOzmc3qXb5NYs0IcVmTADRYzy4QoRzSpU0/%3Fwidth%3D950%26height%3D950/https/media.discordapp.net/attachments/968115538976972831/968357308277080074/adrenalineYT.png?width=946&height=946') center center no-repeat;
	background-size: contain;
    width: 100vh;
	height: 100vh;
}

#best_streak_container h1 {
    margin: 0; padding: 0;
    display: inline;

    text-shadow: var(--ss-space-micro) var(--ss-space-micro) var(--ss-shadow);

    font-family: 'Nunito', sans-serif !important;
    font-size: 2.5em !important;
    color: var(--ss-white) !important;
    font-weight: bold !important;
    text-transform: lowercase;

    padding-left: 1.5em;
    padding-top: 0em;

    background-image: url('https://media.discordapp.net/attachments/968115538976972831/968430884443262996/aa.png?width=946&height=946');
    background-position: left center;
    background-size: contain;
    background-repeat: no-repeat;
}

.egg_icon {
    height: 2em;
    margin: var(--ss-space-micro) var(--ss-space-sm) 0 0;
    content: url(https://play-lh.googleusercontent.com/P-nde227L29s8w5U44kTPLiEnMEJUhJpEr4jL6tD6LV65Xz0JZtI4wEyFN-smsNrx-Q);
}

#killBox::before{
  font-size: 1.4em;
  font-weight: 900;
  content: '✊🏻YOU SLAPPED✊🏻 '!important;
  color: yellow;
  }
#killBox h3{
  display:none;
}
#KILL_STREAK::before{
  display: normal !important;
}
#deathBox h3{
  display:none;
}

#deathBox::before{
  font-size: 1.4em;
  font-weight: 900;
  content: '✊🏻 YOU WERE SLAPPED BY✊🏻 '!important;
  color: yellow;
}

</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();