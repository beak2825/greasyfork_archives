// ==UserScript==
// @name         学人VIP
// @namespace    studyVIP.taozhiyu.gitee.io
// @version      0.6
// @description  解锁VIP
// @author       涛之雨
// @match        *://www.businessreview.global/*
// @match        *://*.economist.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAcwAAAHMCAMAAABvBWi0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABC1BMVEX4AADVAABjAACxAAA4AAAAAACMAAD4Awj4BAb4BAQRERERbbn/////uW1tuf+5bRHclEMREW25/////7ltERERQ5Tc//8REUOU3P///9yUQxFDlNz/3JRDERG5uZRtbW1tQ0NDQxERQ23/3Ny5lG1tlLnc3P/cubm5ubltQ5RtEUO5udz/3LltQxG5lENDQ0MRQ0OUlG25lJTc3Ny5bUNDbbm53P9DbZS53NxDbW1tbUPcuZSU3LmUbW2UlLncuW0TEREREg9tubkTEBMQEw9tudyUudwRbZSUbUNtlNxDlLnc3LlDQ21tbZTclG1DQ5SUQ0P/ubltlJSUubm53LmUuf+5bW2UlNy5/9yMDBpxAAAAAWJLR0QMgbNRYwAAGPRJREFUeNrtnWt720Z6hgWAYrsURclxJIahFNmyJauNbKsryyd112nTuM7a67Tbw+7//yV7EZjzeYChAI6e+4stnPnemBczA2CwtQUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABDoSj7PgIQRzUqbDO2t9dls6hE+g5BNpTb29smm+PtGkugR+Pue+X0HYNMKEbGaBalO9Bju+YwIDM9NKYjaSox3GAqgkWzUgedkJkaQZp4baykQJtyMF3PdrX1A5mJkQIqFsCRFOmRtuKYzyxb6oTMtMjKxEtgYZ1jmN2uvjuCzKQo2VSMaLntirVyFmy3qdhK2xiFr1cqBFy2x8oqLJcUthmW+RLjqmp9jVkHY9mJGFKXLWW1u5WpnkgBq6qHy2aoZ7MqR51voBwPxqgSGSFhju0/s9B+UOddR8jUziRvMCvr4SaQWZ/LA/GpHJaQs2TPpX2dGBNblu1HbEI7lbxpobT+yEQyu1TqU1JYf461eaLGpmXlpXXZVvfvPRHsx5tM5vp6PaMYW3+ppXmi/cCWJ2XrUMQegD3LppTZOg5JKW0/1dI8UX9D206g9ud15BHYs2xama2qgamxnrfGLoUy0S8o2m9FPQTPmaBWf4VZaWUOwaYY1pG51sr7YB05q/1eI8OghThiR85uy64yu915SMPY+EN5ERC705Wjb1eR1eMUd05HxXDsWDi1zD6um+PYYwykvcy4UzoqzzqybHqZPdRphyBTPoY4mTF51pVl08vsIdEOT2ZkelJ37Fh97Fo0VuaYPuUyLtUCT2h/3dlkmXKqjJQZUaVWgi4HO1amNL/Qek9a/JI8ZMpBjsxOapAd5cGpvZNM5XkM/3l1X2TGhkDds7U8uHV0lGno2rz7PDsEmfKasbXA4DyrLKiEurNMg817KFOpZMaez8F51i29u0wtR9x5fXYAMqv2qxpjGLibImp2iMwkN+o3XKarXyaEMmx9d5ZNITPNnfrNltm1vz6wj3jk3ksCmVoPU68yR1UH5NMi4hA6h8DVS8ew33pPJzP6Xvk6ZXY6k+RoRazYpVTrv8GWZ8eeOKeQqR7I/ZOpXWmie06cfa4U+4PBDZBpD2n4enoPdnQlcOSPoSrcexiQ2UZmgp6TsT/QyiL6L12HzF4rQL3INHRqdtu1sWgrp4x+WV1HBejeydQvmS16Tvx51nu6rKNp0munQbllLil+2ss03fSNPqm8ebby7mAdnQa9duf1IbO0bC4Kb571Ztm1dOfd9Q3N3mUad9c1z2olz3+yrKGjvd9bYD3ILIyb65xn3SZMm1/DLbB+b073IHNs3V4U6jmhFG1/lu0uU/8lA3hJoa3MpHtLnGdH/qPtKlO/9g/h/aE7lVlYtte538C1F2OUu8k0JZgBFMy7lWm9A9e1f7Zy7MW47ViZVUGpzM9aDqFg3q1M6wa73gcr7fPMpT75Q9D9GbRHZa1HXqXbouMWl1JqzZXMDF8cumOZjn3F1usdN59DsmyGr/TVR+1FV9Dy+lC4whG7sdIaTXmOpW6V38u2QQZ0l21TSpkyHkq0BWdB200qc1NcJmxPaT2q3YqmzYZ/9L+txDKHcb30UqUrloaHH7ud3rY8G5RlE8ocxtgx0fHq1prSWm6egd0it8eOLOwUSSZzQ1Ks4fd0SSj6E5JBbQg72vZMR20rNolkDqKrIIDEvY9q589Y99vtVc3KtB9rP2ESmRtSKlMXS71ZUgQ83Bp1iORUC3xhsLPM0VCGzfOT/KaA+eGnbme6snY9rTBMMxErUx4bdVgjlEbGqXP12/KIRekJqRtTnpV3ZD8DUzzQtSmkLZbWF6bU6XGJVgl4Xa5D37HPQOb22nBr0JqrNDbdXgnTDyE0y0Jma5naFZiVdK2eEZXOle0W4VkWMtvKdD0uo5XZmJ+j51lZbxW8KmQGytRr+Y5xX+Mum9pmg08MyGwl03DjS5xtT8EBqB2CVfCWILONTIPLsXt+hE217y58WD7IbCGz8C6q909EVGmVlkj4t4wgM16m6eGCwrtIuE25KI4lt84SDpnRMk0uNVPjgGVsKF+zkv5ytnIgM1ZmEbag4Tmv4OvmKO6IILOtTOMDXIaoVIHbM2Ef2MhdujOQOQpFiayfgPdZ7SE2PekV+DSG/Yk/9/oZyAwm4hy3YSwzlvRptBHWs2fLs56iDZkxmINsWbjDa5u2POs5aMgMpzC7tIbErCQk1drybOSXpSAzOFT+xGl5QDpg1+bTxleBgsxQ2pixFDD/V+fH8fu6XzI7fOHJ/iyU+xJorZb6cq15RV/wITMI2xslvuqM/Xk4z1fnTXnW20y9RzLbf67LqsTfC+B4utGp05RnvYd8j2S2/VpFYe1dC+nRcQ1T7bh2BnTm69wfmfZ3H6PWi3TptumIZpsXSHOVWQ+7IP4ONTjBD1l1KpdbTptV1Fr+I85VpvdJ/GCZthpp+LMDLftzAMX5dnrcWWk+L2Ke6hl33sI9xzdGRcSmWtUsJbrcDwPej51EFYvur1obEsWmXLCGgOeiGWcjgYjWFTDgewCh01uT7RKk8phW3+HZLJxjunT5VlfbiovY+YDKTxyui2Z8uUiSH9kpgcpPJK5e0fZb6zamCi2cqPzEkrBcslLV+VI3RuWnFZaWZtmyWKQa6qjEBbMFhm86dRlNo0pVA0WOBQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMFJYvqhUjEYjfIolIcW4HI1Go3K8xqhaZNocg1YU0ida1lZKLNZKfIouIdrXdrQvHxVJ/ELm2qEfxS2rqqrGI/1zZqsP3ScJNdLsuqnUD5hVI9nmKFm5sVeA1pfa7xWVIcClZHP9MkEaCuPnNktxImRuCrWp+n9FORqVRVFVVdFMLsVFZJlkKZnVuu4PBAoyfYuCeCoWXVLxqZoEW9CiKVVy61V4M0b8UKgwlU7RvxBLZZLv78pLVuS7zyy9S1PFafg2uhlWAtUP847Iv5pMqRnDbErf327yqF1mJW1QcNw0i8gmK7IEZAbCCmBT5SnGTMaYWHbLpDEuNW8OmcLCJT+K1V5L8QwpyQKQGQhVVtEgsrRbkTJilFmOaXu0ZJuRqAwyDZOIOCazEl3R+ZAZyIgEvmReRiTCBZFZFM0FriyKoo58SXuHeJALoTyWPFUWBF7eyIKrLYjr8HrRiOfZiv4XMgPZFqo5jSNVplabLaSVeY6mLQ7pjy0mQ8y89SYqXrK5zDGfz9q6kBkICVMlm9tyyWQ0JVYpTzTefHFBGr1mqstxmULbhWmFzDAKQaYQ4i15kiZzdbdMuDoWcoRltVumaquyWWEyrfU050A91yLzH9z8o4nfZYpFJiuQY+5HkSnXXCutX6cUg0+ar0WoTNoeabZSOWROQDZApsrOdDrdnUwms+l0uldPWf1vfzKZPPhmOn34bT3p4HDKZk8mO/VfjNUyM/qfmtWazVYnk8n8u9Ufi+/JvKWwpLBZYXI99eG39ZE1G2k2scsPuNkcZKqsYnN0zBU2sdwn8d1vFpJkNn8sfjh59JjG3SiTrFvPYidCgMxG3V69YnMOQGYgq4CugrhDgskCd8oLpiyzjvvKPy9EzTRW+prF9/nSVGyQTFIk6wNpdgOZgdSB2iOl6cnTs/Pps1WIn10cCuVJlEkLzoQGlp4KfHFBbbNm44TPc8usD+XhPx2yk6DZJdnIEjLtLMlJv6SXwH/+jl4NWXkSi1odWVIIWXZtEisJdxP72kwzneXfMJlNgv1RKOuzqZJyIdPMAS2Cjc3F9yTG08vv5WWmD59PJo/FnLdkFSByZTx6PplMTr9jZ0Kz7PTFS0KgzANawyKZlexotfX5bAqZDmY0jFdnFxf/sipc87OLi98/EhYhUqbXh7vU2+XFxTmvzZIiOJ0ursnUupTS0k7ZC5NJd6ek+en0Cdk4ZNqoPVw+dy7DrOzS62MjV2lQCO2V5xNpySiZdEX2N7M7nU4vINNFHdPFK9citOCxJmlT+m5EM68Fa825sWwrk+xuVz7EJnujNuumCdWTV7TOOX/zVqyzrDh9zWXOz5qW5tPjHVEBmVxvqZnSWqbS1OH7X7xC08QHVbW4fnbx9nqqVEAb5icnJyePyR/vTk7eG7Zz9e7k5OT9sX+HPmZKg4bs/5G0EGSa4aWKXvO+TbDV1khdSFYg08b8jXDNW9w+SrDJ9iyDzifIdFFnyZOTlwnyZCdOv5GrPxYgc+A8+Nc/nPzxMCzRQ+bAYW0gfp/FCmQOHCbzg39ZyBw4RObihTL9J8K/EVb/h8yBM//36+vr66eP1ek/Eyb/UVP/DZkZAZkZAZkZAZkZAZkZAZkZAZkZAZkZAZkZAZkZAZkZAZkZAZkZAZkZAZkZAZkZAZkZAZkZAZkZAZkZAZkZAZkZAZkZAZmd4A8g//RT38cCmR3hDyD//HPfxwKZHYHMDpgeym/+7ud4ILMDkOkCMpPsfRhSN0xmv0BmTlBbRJ757/4ODzIzYogy5+qbpfNffCPggMkwZR68lsfVOP0oDzS24j8/OTehjQJJoAMRHtnGgtHOo41icDLnv8rBJkMryeF/8I171Mm2Mm8O1bNmoxiaTDJoHR2/6IANnCIl2nokuVu7znYy633zWc2ATn76HbtLZFgy62IpuWOjf4qplzr5YM2WLWTOf5lK55E4pKsT78BZd8awZPIRjKgGPmXXsNTiqVlnC5l8ANc9ZRuQ2RIeUnrxWqoThNIqBPJP1xJsJXky27o8+cXEkAMgszN84GstprQ4CWNj8xK2DIy8kTqnqzkAMruzVIPE3TX5T0jFwnW0u0xhR/XfkNkdIYb7yoTanTBfbEYkkMkTbb1hyEwAK3l0xHt6Hb2s2wCCNbF2k0ImL/N1+uZNkzM6/QOaJpGQdHfLrodiq1L4wITU8kwhU0202saH3qMwGJnKZ0AiqEOcRKa5Vcsn9ztOux/I1D/xpbZfpW+YDJlcZMq07mhvzgmlo5Ad2tDv3UCmxKoQXtI7MgcXDewrCp8vNH5wf2XqboFMZQkhw+6023l/ZC+TNxf3QmROhBuakNmWocgUgMy2MJmXF4GcO2R+JF3oqkwy+RYy10p8lXEWFE9JZhyQ2ZZ+Zc7fGTroILMtaWTOAuIvwPYl3IpROwd2pqYDCzuT7hjIrHHINHfMQqYLUWZA39zR8R3JZGna3F0LmSaGKtPSMQuZLoYqk10y5foTZLqY06rk81CZX+gaQqMxvUzLvUzIDCVMpolkMudnatfEM2OPxXQ1+WnfX74l5CrzlhbbP7N7Hl9ZO/KjLvOt+IDmbsQTQNPg3sH1k6tMpsnUabDUlpLXhsyEvDF3xopd8buQqTNImUZOP/Lo0Qf3NCBzI7gRyuWR9fY+ZG4Ap6956KzF0i1TaERAZo/Mz4KKpVEmf6Y6SuZGsgkyg4rlyxom8+tLwm/0PHj4X3TSy1+VpeijIpC5dsQGvfVt6ZB7j940CZmJeGnlC5f51LzE2mRevfQzkOvlZEAyO8nYW5NMuZPPwoCejIZMyEwOZCYAMm0y3x1DZksGJ3N5BJlt6SrzyjzgktyPc2te6OQ9OQguc/7LFDJb01WmGeWdB1dH4ESUuerME2UanrL/cYDv+Q1FpqVk1beXadgWf7AsYRu9UC9Z7shTmf9Nxl1j6+87tg2ZMbCwxb6FbnoXKaxnl+wNMpPTUqbUOy+kWscDO5C5dtrJvDkXxOyLD6IsXtl0SjIX30NmelrInN9IpXJX9fTBfJWVn+3bg8z0sEtfqMwvb5Xr5LF+s/mJKdtC5tphKTJE5vzNx+lUd2l6dGDxw3tZqLzI5XM0TdJwxe4sXf0yDZb55Y/n06nZJR8cWBb6+fcnbFdSS2Y1MDE6DVJgfgLHJfPqzz+aB0UQRou2Po67p89XRi2FzA4Y4+56bsoSd7nP5+C1S4ewCfK8EGQmwTj2yH70Guog7sZUy/IwSwf0ywyQmQRTGD0vXOm9u6avZZxq9SOevOn5cHTsOArIjGcWHzVllUvLOLCqTqGXvknu/M0HyEyDftH0PjIn1pps3QLNgmJHnzbsxAf+J5P5VX+O6wvamcGol8DFC/86LPafP/kW/fJRTal0C/umDaLToBNShnvy7FPwkFpPfggcZvvqL2/11s6BdM5AZp+8exT3FOuV+ztu8/8h3T2f4ub1RV4y7zmQmRGQmRGQmRGQmRGQmRGQmRGQmRGQmRGQmRGQmRGQmRGQmRGQmRGQmRGQmRGQmRGQmRGQmRGQmRGQmRGQmRGQmRGQmRGQmRGQmRGQmRGQmRGQmREbLXP+OMFGMmI4Mv90XbPnXOjgLR/Y4PSj9KrsO8/bfEHb32yGI3OpDTGgsRoshL4e++a1/KbrweHC/YHZgO1vOpsksxnGpymN5DV59uZzPaCBc6RnyLxDvMGmL543I1XM5GEryNqXn1ptn36LXHuDnn7WvB5l7508ojv9m6xaf/ioXzZIJhu0QhwKjQwOxMaz2Gu1fTq2iTYG2I4wg45mog8CxUbRuA0cT2FN9Cbz4O21DNGxUCZ/FoZyIjFvBC6F0LK4OkaLmIny1YM5nJrnzoTt+mUGjOm/VvqTaR63UI+OGF8S2/pKSWO5J5Qs11hBLpm2k4FOr9cKktnrl1E3SybJrbd1vOoUWFdhDw4D4uiSacuzdMP1SRIos0ebGyJzftaM01KP8XzJh+9d1P+jo8w+q/8yt1BI6C3DnNKjUWZTx3uTCJn9jQy0KTIjPgF91EImuzjuGdYhK9lkLlbn0PW5esg9cG9kkgxtk0mrrbumY2wm2mSSTQoj8vVVNHuTSVpwZ5/pZ4TIYJNf6XeG/pfMsIywHiuTiLGVGtqIlWRLWdYnUzg/+7pq9tzOvDlkp7HSDlxKw8V2l7kzlbevYsqzM8mWVyaTH/tppFT0KrMZmHlfioQwXrrQZusukwbalgINeVbucgqQaW2u3hF9ynxAotE4k2SS0LJhuUngdt3f8p45ZM6cqrk5Yb5SmP0y6Tbuo0z5miTK3DlUigmV6d6eQyYr2tYUONNEyFk2QKbUx9AD/V4zxQAKMvVOgM4y+fi1tosmLYf76ip0pyiZbsR4cJmGFjyTOX93cmL9iqZDJh+O33bR1PKsWmUKv2beywoQjaBaMpvPsokhYTIdY+DvuWTyMd+PPN/oY8VqqZgJr83e06ZJfTI3v128Zq6mSrmqq0yhNmzNgUqepavsq9vwtzPvXacBD6GpaXL62hJzp0w7Yn+T7cKrXCO1XobgHqC+smxfMnfY/crzqfF+5rlwX1P4OEVbmeKXNXz1WTJ/Kavz9M1eCH2z962jPerj72JRaidTXsvXbyDdI+EL4xaYJ27RMidXSkfBGV3q9jh0d7aiKeVZvS8XN6cttJcpc0oD6nxcg2n4P3fRFPPsjqYmTOaH/lxuuEz2aenb5669sX7ZHXfRFPPsTPMeIvOy16+cbLLMU/o5TM9TVPz2Fv3fvnvBffXhvxqvzL4fzuutaSJd935TajUf5MuiJXGx5satJ7MJj9hJz/fp8BqsnmXttdn6xuv7lz3mV0Lv7cxVgdA+OKuVnC+G7jvarrtVZyjlQ7zL6Olw47UePcsG9AD1zQBknhpaG2o1wvA5zdC0LPfLzIzLUFh7xJBlITMA88NASgW/vUzWxGxi7ulyo3n2t0P9KCDTC62QHv3a/Pv/xttIrWXyFL6nbMlYaaLvI/1VWqcBMj2wL3ofHdO+WVZ2vgrFoq1M7pIq4J1BJptE0OLcoAky3bDGxcNveUc7syk80dVSJtu+UNB5N60p0y7NG5pApgfhPsNz081poS/AUZvVKrO8NitcjnnCFJqHht4a6Qou9/ZCpoM3rNisXJoeG3H3jpGl7PcobvhmdvX1lLJPEHsCFEuQaeULb1xe1tEQ72eKrRVrT51HJrsca3VjoftJf3VeyLNK8wUyLQgqaXCkm9NSV5nlPoRb5pvX9g2IF8Ynr4xb1bMsZFoQXZmfaBfKlafvzShTLJaGaEv1qSevjo2Hpq4GmRZYA4H3kauvqd9YmvdXx/J8k0ypGnNpCLZkU06nS/NkyLRDO7L5BVEbc2D+0XXl0kq2xNLtcjKxXlA3md4qQEv11pVhAIlV4dPO+6Ui0/i0CFduU8U2M5yC1Zn+Xun7TqmnmkYDmZ8daq6UvlyLLJrHP0xs0DSd0cBA/bUzT5UmR+igS8ojXc63DZx3rZtHTnp7lG4N9N7RzggeQUusvDhszaQrspGbQ9/bK5vFBsrkF81r12h5D/72wrup+V/yuWAOSiboDGRmBGRmBGRmBGRmBGRmBGRmBGRmBGRmBGRmBGRmBGRmBGRmBGRmBGRmBGRmBGRmBGRmBGRmBGRmBGRmBGRmBGRmBGRmBGRmBGRmBGRmBGRmBGRmBGRmBGRmBGRmBGRmBGRmBGRmBGRmBGRmBGRmBGRmBGRmxN8B9RLqV70c7QYAAAAASUVORK5CYII=
// @require      https://cdn.bootcdn.net/ajax/libs/hls.js/1.0.8-0.canary.7807/hls.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js
// @resource     jq https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.slim.min.js
// @require      https://cdn.jsdelivr.net/npm/@zip.js/zip.js@2.6.60/dist/zip-full.min.js
// @require      https://greasyfork.org/scripts/455943-ajaxhooker/code/ajaxHooker.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @antifeature  tracking ============================================>>>说明：我们仅会在经济学人文章阅读页面收集您使用本插件的情况，以帮助作者了解插件的用户数量。这个操作仅会收集您的IP地址信息，不包含您鼠标、键盘点击在内的所有操作，没有任何安全风险，不会产生性能损耗。为了保护您的知情权以及使用体验，特告知于您。本插件系开源脚本，所有代码均可查看源码，请您放心安装。 <<<============================================
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        window.onurlchange
// @run-at       document-start
// @license      GPL3.0
// @homepage     https://greasyfork.org/zh-CN/scripts/441874
// @downloadURL https://update.greasyfork.org/scripts/441874/%E5%AD%A6%E4%BA%BAVIP.user.js
// @updateURL https://update.greasyfork.org/scripts/441874/%E5%AD%A6%E4%BA%BAVIP.meta.js
// ==/UserScript==
/*global Hls zip md5 $ ajaxHooker Swal*/
/* jshint esversion: 11 */
ajaxHooker.filter([
    {url: "/api/bulk-subscriber"},
]);
(function glob() {
    'use strict';
    if(!document.head)return setTimeout(glob,50);
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "//js.users.51.la/21234891.js";
    document.head.appendChild(script);
    (()=>{
        let i=0,x=setInterval(()=>{
            [...document.querySelectorAll("link[rel*='icon']")].map(a=>a.remove());
            const link=document.createElement('link');
            link.rel = 'icon';
            link.href = GM_info.script.icon;
            document.head.appendChild(link);
            if(i++>5)clearInterval(x);
        },500);
    })();
    const addElement=(tag,args)=>{
        const dom=document.createElement(tag);
        for(const arg in args){
            dom[arg]=args[arg];
        }
        document.head.append(dom);
    };

    addElement('script', {
        textContent:GM_getResourceText("jq")
    });

    const V=GM_getValue('version')||"";
    if(V!==GM_info.script.version){
        Swal.fire({
            title: '[学人VIP] 已更新!',
            html: `<div style="text-align: left;">当前版本：V${GM_info.script.version}<br>
最新特性：<br>
- 添加版本特性弹窗<br>
- 添加 Ctrl + P 保存 PDF 或 打印 的适配<br>
<hr>
（更多信息，请前往 <a href="https://greasyfork.org/zh-CN/scripts/441874" style="text-decoration: underline;color: #6495ed;">脚本网站</a> 查看）</div>`,
            icon: 'success',
            confirmButtonText: '好诶！'
        }).then((result) => {
            GM_setValue('version',GM_info.script.version);
        });
    }
    if(location.href.includes("businessreview.global")){
        const main=(url)=>{
            const path = location.pathname.replace(/-/g,"_").split("/"),
                  lang = ['zh_CN','en_GB','zh_TW'].includes(path[1])?path[1]:'en_GB',
                  articleID=path.pop(),
                  D=GM_getValue('dataList')||{};
            if(D[articleID]&&Object.keys(D[articleID])) setTimeout(()=>doInject(D[articleID]),500);
            else {
                fetch('https://api.hummingbird.businessreview.global/api/article?id=' + articleID).then(a=>a.json()).then(tao=>{
                    const D=GM_getValue('dataList')||{};
                    D[articleID]=tao;
                    GM_setValue('dataList',D);
                    doInject(tao);
                });
            }
            function doInject(tao){
                if(tao.has_video){
                    if(document.querySelector('video'))return;
                    const Dom=document.querySelector('.ds-banner-alert--warning');
                    const {data}=tao.body.content.find(a=>a.type==="video");
                    const url=data[0].url;
                    if(Hls.isSupported()) {
                        const vid=btoa((Math.random()+"").slice(2)).substr(0,10);
                        document.querySelectorAll('figure[class*=leadimage]').forEach(a=>a.remove());
                        Dom.parentElement.insertBefore(Object.assign(document.createElement('video'),{
                            id:`v_${vid}`,
                            controls:true,
                            style:'width:100%',
                            poster:`https://d2du2xc4tgl2mb.cloudfront.net/article_images/${articleID}/${encodeURIComponent(tao.body.content.find(a=>a.type==="image").data[0].image_path)}`
                              }),Dom);
                        const hls = new Hls();
                        hls.loadSource(decodeURIComponent(url).replace('businessreviewglobal-cdn.com','d2du2xc4tgl2mb.cloudfront.net'));
                        hls.attachMedia(document.getElementById(`v_${vid}`));
                    }else Dom.parentElement.insertBefore(Object.assign(document.createElement('div'),{innerHTML:`<br><p>不支持hls播放器</p><br>`}),Dom);

                    Dom.querySelector("strong").innerText=articleID==="en_GB"?"Ok, fine. Now, it works :)":"好吧好吧，现在支持在线播放了:)";
                    Dom.className=Dom.className.replace('warning','success');
                    return;
                }
                const Dom=document.querySelector("div[class^=article-content_wrapper]");
                if(!Dom||!Dom.childNodes.length)return setTimeout(()=>doInject(tao),500);
                const {className}=Dom.childNodes[0];
                let MyDom="";
                tao.body.content.map((a,index)=>{
                    switch (a.type) {
                        case "image":
                            if(index===0)return;
                            for (const i of a.data) {
                                if (i.lang === lang) {
                                    MyDom+=`<figure><img style="width:100%" src="https://d2du2xc4tgl2mb.cloudfront.net/article_images/${articleID}/${encodeURIComponent(i.image_path)}" alt="" class="img-responsive"><figcaption>&ZeroWidthSpace;</figcaption></figure>`;
                                    break;
                                }
                            }
                            break;
                        case "paragraph":
                            if(!new URL(location.href).searchParams.get('dualLang')){
                                for (const i of a.data) {
                                    if (i.lang === lang) {
                                        MyDom+=`<p class="${className}">${i.text}</p>`;
                                        break;
                                    }
                                }
                            }else{
                                // 双语
                                ['en_GB','zh_CN'].map(x=>{
                                    MyDom+=`<p class="${className}">${a.data.find(a=>a.lang===x).text}</p>`;
                                });
                            }
                            break;
                        case "subtitle":
                        case "video":
                            break;
                        default:
                            console.log("未识别的类型",a);
                    }
                });
                Dom.innerHTML=MyDom;
                const verifyZipPassword = async (file, password) => {
                    let reader, mp3blob = "";
                    try {
                        reader = new zip.ZipReader(new zip.BlobReader(file), { password });
                        const entries = await reader.getEntries();
                        try {
                            const audioBlob = await entries[0].getData(new zip.BlobWriter());
                            const newreader = new FileReader();
                            newreader.addEventListener("loadend", function(){
                                const newAudioBlob=new Blob([newreader.result],{type: 'mp3'});
                                mp3blob = URL.createObjectURL(audioBlob);
                                $(".progress").hide();
                                $("#TPlayer").show();
                                document.querySelector('#TPlayer').src=mp3blob;
                                document.querySelector('#TPlayer').setAttribute('aid',articleID);
                            });
                            newreader.readAsArrayBuffer(audioBlob);
                        } catch (error) {
                            return { state: false, error };
                        }
                    } finally {
                        if(reader&&reader.close)await reader.close();
                    }
                    return {state: true,url:mp3blob};
                };
                const requestmp3=async (mp3zipurl)=>{
                    try{
                        const rep=await fetch(mp3zipurl).catch(a=>console.log('无音频'));
                        if (!rep||rep.status!==200) {
                            return;
                        }
                        $('body').append($('<div id="TPlay" style="position:fixed;left: 10px;right: 10px;bottom:3%;height: 54px;box-shadow: #00000066 1px 2px 10px 2px;border-radius: 90px;"><div class="progress">0%</div><audio id="TPlayer" controls style="width: 100%;display: none;"></audio></div>'));
                        let size = 0;
                        const body = rep.body,
                              len = rep.headers.get('Content-Length');
                        const reader = body.getReader();
                        const steam=await new ReadableStream({
                            start(controller) {
                                return pump();
                                function pump() {
                                    return reader.read().then(res => {
                                        const { done, value } = res;
                                        if (done) {
                                            controller.close();
                                            $(".progress").text('100%');
                                            return;
                                        }
                                        size += value.length || 0;
                                        const rate = (100 * size / Number(len)).toFixed(2) + "%";
                                        $(".progress").width(rate).text(rate);
                                        controller.enqueue(value);
                                        return pump();
                                    });
                                }
                            }
                        });
                        const blob=await (new Response(steam)),
                              a = await blob.blob();
                        verifyZipPassword(a, md5('2q09kj876$A&21786351+_))l;k98zTRWE%$#*&^'+mp3zipurl.split("/").pop()))
                            .then(a=>{
                            URL.revokeObjectURL(a);
                        })
                            .catch(err => console.error(err));
                    }catch(e){
                        console.log(e);
                    }
                };

                if(!document.querySelector('#TPlayer')||document.querySelector('#TPlayer').getAttribute('aid')!==articleID) requestmp3("https://d2du2xc4tgl2mb.cloudfront.net/"+tao.publication_date.substr(0,7)+'/audio/'+articleID+'_mp3.zip');
            }
        };
        GM_addStyle(`
div[class*=authwall],
div[class*=mobilelink],
p[class^=article-content_linear__text]{
    display:none!important;
}
.progress {
    background: -webkit-repeating-linear-gradient(135deg, #5FB878, #5FB878 15px, #5FB87880 15px, #5FB87880 38px);
    background: -moz-repeating-linear-gradient(135deg, #5FB878, #5FB878 15px, #5FB87880 15px, #5FB87880 38px);
    background: -o-repeating-linear-gradient(135deg, #5FB878, #5FB878 15px, #5FB87880 15px, #5FB87880 38px);
    background: repeating-linear-gradient(-45deg, #5FB878, #5FB878 15px, #5FB87880 15px, #5FB87880 38px);
    height: 54px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
       -moz-box-align: center;
            align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
       -moz-box-pack: center;
            justify-content: center;
    -webkit-border-radius: 90px;
       -moz-border-radius: 90px;
            border-radius: 90px;
    min-width: 10%;
    -webkit-animation: bg-scroll 500ms infinite linear;
       -moz-animation: bg-scroll 500ms infinite linear;
         -o-animation: bg-scroll 500ms infinite linear;
            animation: bg-scroll 500ms infinite linear;
    font-size: 40px;
    font-weight: bold;
}

@-webkit-keyframes bg-scroll {
    from {
        background-position: 0 0;
    }
    to {
        background-position: 0px 54px;
    }
}

@-moz-keyframes bg-scroll {
    from {
        background-position: 0 0;
    }
    to {
        background-position: 0px 54px;
    }
}

@-o-keyframes bg-scroll {
    from {
        background-position: 0 0;
    }
    to {
        background-position: 0px 54px;
    }
}

@keyframes bg-scroll {
    from {
        background-position: 0 0;
    }
    to {
        background-position: 0px 54px;
    }
}

@media print{
  div[class^="header_header__langswitch__"],footer,#TPlay {
    display:none
  }
  header[class*="header_header__"]::before{
    content: "本PDF文档由涛之雨\a  [学人VIP]脚本生成";
    position: absolute;
    white-space: pre;
    right: 25px;
    top: 30px;
  }
}
`);
        main(location.href);

        if (window.onurlchange === null) {
            window.addEventListener('urlchange', ({url}) => {
                if(document.querySelector('#TPlayer')&&(
                    document.querySelector('#TPlayer').getAttribute('aid')!==location.pathname.replace(/-/g,"_").split("/").pop()||
                    location.pathname==="/")
                  ) document.querySelector('#TPlayer').parentElement.remove();
                main(location.href);
            });
        }
        const checker=setInterval(()=>{
            // 这是什么神仙bug。。。
            if(document.body.innerText.includes('An error 404 occurred on server')){
                clearInterval(checker);
                location.reload();
            }
        },100);
    }else if(location.href.includes("economist.com")){
        ajaxHooker.hook(request => {
            if (request.url==='/api/bulk-subscriber') {
                request.response = res => {
                    res.json.isBulkSubscriber=true;
                };
            }
        });
    }
})();
