// ==UserScript==
// @name         抖音插件
// @namespace    https://github.com/QYG2297248353/tampermonkey_douyin
// @version      v1.0.0
// @description  自动跳过广告
// @author       新疆萌森软件开发工作室
// @match        *://*.douyin.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAHrJJREFUeF7tnQl4E9Xax/8zadMWSmlStgooyI4oiKgom6BsKiIo7iCLKPiB93rl+/ReLy64gLsirrjvioKCCoIIAoKKiCBIaWlpgdJS2ibd0qZJ5nzPCQ2Wtkkmk5nMmeSc58kTlnPO+77/c345M3OWERCBlJaW1p4Q0keSpO6iKJ4pSVJHQRDSCSGtALQUBCEZQAKAuAi4w02wr4AbgJMQUgmgTBCEYkJIgSiKhyVJyhFFMVMQhD0lJSX5WociaGEgLS2tpyRJlxFChgqCcBGADlrY4XXGvAJHCCHbBEHYJIri9yUlJRlqK6IaICkpKV1FUbxREIRrAPRV21FeH1dAhgK7CCFfSJL0cXl5+QEZ+YNmCRsQq9U6EsBsQsiEoNZ4Bq5AhBQQBGEFgFdKS0vXhWNSMSAWi2UwgPsBjAnHAV6WK6CxAmsAPGaz2bYosaMEkASLxfI0gDlKDPIyXAGdFFhis9nm0Zv/UOyHBEhqaupwQRBeAdAjFCM8L1eAEQX2E0Jm2+32DXL9kQ2IxWKZDeBluRXzfFwBhhW402az0R/6oEkWIKmpqfMFQVgQtDaegStgEAUIIQ/Y7fZHgrkbFBAORzAJ+f8bVQE5kAQEhF9WGbXpud8hKBDwcssvIHU35D+EYIhn5QoYUgFCyAh/N+7+AKGPcnfxp1WGbG/udOgK7LfZbHT1R6NHwE0CYrFYXuTzHKGrzEsYWgE6TzK3YQSNAKmbId9s6FC581wBZQoMaTjj3hQgq/nyEWXq8lKGV2CNzWYbWz+KUwChCw8JIWsNHyYPgCugUAFBEEbVX+DYEJDlfFWuQmV5sahQgK4CLi0tnegL5iQgdD+HyWTKioooDRKE+6JBcF1EF0VHPsXt+BXxP8pekhR5B3W06PF4uvn2k5wEhM+YR75FKCAVy1ZF3jCA5nf/D8zLPtbFNutG68+wnwTEYrH8wXcCRrbp9AQkadEjSFzyXGQDNo61XTabrR911wtI3R7yfcbxPzo81ROQhLdeQ7MH/h0dQmoQhSiKvegedy8gFouFbn6ik4M8RVABPQExr1yB5nfOiGC0hjM112azLfECkpqa+pkgCJMMF4LBHdYTkLhtW9Bi0lUGV1A79wkhy+x2+3W+EeQwP5pHO7H91awnIN4fxl6dIFSURz5wY1g8YrPZOgr0UDdJko4Yw+fo8lJvQJrfMRXmb1ZGl6gqRiOKYgfBarWOJoTQkx94irACwQDZkKitQ+68PCRed22TRqbk5sLu8WjrAOO1C4IwRkhNTZ0rCMJixn2NSvfkAHKJqG3onquvhqmsrJGRgRkZyHSGdACIto7qUDsh5C46gjxHCPmnDvZj3iQLgPy1eg16P/lEo7YYl52Nnyrp0bixmwRBeJ6OIJ/XHRcau0roFDkLgJS73Ui58kqgwWgxIy8PK+x2nZRhwyw9xlSwWCw/AbiYDZdiywsWAKGKb123Hhc//ugp4v87Px+vFRfHVoM0jnYrHUH2C4LQPdaV0CN+VgDZV1OL0yeMR/OampMyvF5cjPvyNX+7gB6yy7ZJCMmkgBQKgtBWdimeUTUFWAGEBrT9z704/66/T5PNcToxIEP1twmopl0kKiKEHKOXWPROrHkkDHIbpyrAEiDUs7+Wf4neL75w0skhmZnYW10dy81WRQFx8Tc76dMHWAPETYCKm26CpbDAK8gDR49iyfHj+ojDhlU3BYSw4UvsecEaILQFsmtq0WXsaG9jbKiowDU5ObHXMPUi5oDo2PwsAkLlWJ6Vg4m3n1jpOyorC785HDqqpK9pDoiO+rMKCJUk81gRut9wPb6w2zEzL09HlfQ1zQHRUX+WAaGyuCQJtTffgpnbtmJNeWyu+uWAcECCKrBmycu46YH/Bs0XjRk4IDq2KusjSH1pnt+4GQ/NvgPisUIdFYu8aQ5I5DU/adFIgFCnhxTY8NubryPhw3djBhQOCAckJAUEB7xwmD98F/E/bULcL9tCKm+0zBwQHVvMaCOI9+kWAXrUm1w3ZR9A3JYfYf76S8Rto+teoytxQHRsTyMCQuV6yw3MqG1CuFonxKNHIRbkQywshFBSDPN33xgaHA4IB0SRAn4haVBbi0njOCCKFOaFYNQRxNd09HJrvBPIkPw3JgeEd3TFChgdEF/gM2uBN9xNy8ABUdw9eMFoAYS25Ltu4G038GOD0YQDwvu5YgWiCRCfCOs9wHv0UzeicEAUdw9eMBoB8bXqYQIspqPKhPGQthr3lZf8KZaOnEYzID5Zs1evQe78/+LbsjLscDhw3O1GsdsNFzHGNiQOCAdEUwVyV69BpwbnbjkJwdHaWhS53Rh74ICm9sOtnAMSroJhlI+FEaQpQOpLZt21KwwFtS/KAdFeY78WOCAAB0THDsi6aQ4IB4T1PqqrfxwQDoiuHZB14xwQDgjrfVRX/zggHBBdOyDrxjkgHBDW+6iu/nFAOCC6dkDWjXNAOCCs91Fd/eOAcEB07YCsG+eAcEBY76O6+scB4YDo2gFZN64HIDvLK3BuSouIScPXYkVM6ugzpAcgG3f8gbSNG1B96624oJVVc1E5IJpLHL0G9ALkknl3e0Xdd+lIlE6bhkHt0zUTmQOimbTRX7HegPgUpqAU33wLhnQ+XXXROSCqSxo7FbICiJagcEBipz+rHilrgPgCzO99Fg6OHAVP335o3z4dXc3ximPngCiWjhdkFZCGLZNx0SDkjxyJhD590C3NiraiILvxOCCypeIZGypgFEAa+r1z1Ggcu2QEEtLSENciGYlJSUhOTEBKfDysJhFJ9QpwQHi/V6wAi4B8UFqKW6zhPf71iCaUdugAe/ppqGzXDud+tcKvRnzLreLuE/0FWQRkXHY2sp1O3NWmDWa1aqV5I3BANJc4AgYEEVK7dpDatgNplw4pvT2k00+Hp+MZSHzzVcWnl7MKyE+VlV5R28XHY3pamhcWsyD/viOUFuGAhKIWC3kFAa5hw+EafQXc/fqDpJ8GqVVrv56Fc7Qm64D4gqag3Gq1YmarVrDGxanaShwQVeXUpjI6MrgHDYFrxCi4xlwOklj/NjOwzVgApCEoEywWdE9IUKUxOCCqyKh+JZ4+58A1aGgdGCMVG4glQOqLdG6zZri4eXNcnJzs/W5pMinSkAOiSDbtCrkuGw3nLVNBv9VIsQpIQ+2GJSdjaIsWoN/9mzWTLS0HRLZU2mZUGwyftxyQxu3WQhRxXvPmaBUXhzSTCWlxcSf+7PuYTCf/zgHRtt8HrV0rMDggQaWPigxRezav1mBwQKKi/wcNIuoAkdJPg2PBIrjGXhk0+HAypApAPxEY9uRjMH34vvfxJ72MaFP3aR0f7/1zoEsIozzmDUcno5eNKkDcg4bCsWAhPD16qdouIoBLTcDZAnC2CFxhAlrXzZv9sfgl9FvxuV97HBBVmyLilUUNIM7J0+B4eCFgNqsiYjKAUaa/P539TCRzQFSRm9lKogKQ6gcfRc3MO1URmY4O19eB0VbG6goOiCqyM1uJ4QGpfOdjVeY0hpuAO+OAa0Oc7+KAMNu3VXHM0ICUb9oOz5ldwhLiQvEEGFMULjHigIQlP/OFDQuI7UhpWOLSe4wFZuBuhWD4jHNAwmoG5gsbEpCKFavhPv9CxeKOMQEL4oHz6eOpMBMHJEwBGS9uOECq738INbPvUiQr5YGCcb/yMwga2eWAKGoKwxQyFCC1E69D1eJXFYk7QASeNgPDVBg16jvAAVHUHIYpZBhAXIOHofIT/3ubAyk+0QS8bAbkPLYNteU4IKEqZqz8hgDE070nKr5ZD5IkfyOTrxmmxwFvqjN32GTLckCM1eFD9ZZ5QEiqBXSuwz3gglBj8z6helZDOKhDHJCQm8VQBZgHpOr1d1F7+biQRX0wHnhIxZtxfw5wQEJuGkMVYBoQumSdjh6hpgkmYLk6W6aDmuaABJXI0BmYBkTJMhK6ZOSHCMHBL7EM3fdlOc8sIEpGD7ps5OdEWXGrlomPIKpJyWRFzAIS6uhxjnjisqqLjBW4arYEB0RNNdmri0lAQh096BkaaxOBQSpPAsppLg6IHJWMm4dJQEIdPV40A3PCXHSotAk5IEqVM0Y55gAJdfTQeiIwWDNyQIIpZOz/Zw6QUEaPc0VgbQLQKkL3HbsrHSjdnwlTYQGaHzoEa/YBtNu3D4mOKr+9gO9J54CopoDnnH4o//YH2fVROEaGuANQduV1GbeX2ODcsgXdVq1E2+wDoRbnp5qErBhbBZgaQWrm3I3q++bLUmhuHLBYw2UkFAysWoXz331blj/+MvERJCz5dC/MFCAVn62E++LBQUWxCsAviUBXjS6t/lz7Pc5e+FhQP+Rk4IDIUYndPMwAIp3WHmW//ilLKbrGiq610iL9vPRNDPzoA9Wq5oCoJqUuFTEDiHPKdDgefzqoCHTUoKMHHUXUTgU33oT0wgJVq+WAqCpnxCtjBpDKtz+Ca+SYoALQ+w56/6F2qpg7Fy327FG7Wn6Trrqika2QDUBEEfasfJAgby3qLQJ7NVhrdfDlV9F52aeqKl/sdiO3thajsrL81svP5lVVck0qYwIQOnLQESRYmh9/4tAFNVPujt/Rad49YVVZ5vGAvvhyS1UVfquqwhGXC4UuV9A6OSBBJdI9AxOAOJ54Ds6bbw0qxq5EgC5KVCuVu9xImTEdOHxYUZUbKiqwtLgY9NtJSMh1cEBCliziBZgApHz1BnjO7hsw+PEm4EuV93lkb9yELg8/GLLovzscXjA+tdlCLlu/AAckLPkiUpgJQOx/7AcJ8KplqsR7ZmCy2jfnM2cCB0KbHf/EZsOdhw6p0jgcEFVk1LQS/QGJj4ft4LGAQXYSgL+SgNDPNPFfbW7GfnSaPSskcV8vLsZ9+fkhlQmUmQOimpSaVaQ7IFLHM1C2bWfAAGfGAa+rvKykdMlLsH7h/8U3DR26LicH31dUqNoQHBBV5dSkMt0BcV8wEBXLvw0Y3NtmYKqKl1dOiSDhyiuA6mpZok7Ly8NXdrusvKFk4oCEopY+eXUHpHb8RFS99EbA6DOTgG4qzpxn5Oah57SpshR/oagIDxeoO7vuM8wBkdUEumbSHZCaO+agev4CvyJ0F4H9Kk8O7li/Aec96t+mzxn6tOqyABN94bYcByRcBbUvrzsgjoceg/O22X4jnREHvKHy/UfWBx+h25tLg6o7+9ChsB/l8pv0oDIznUF3QKpeexu1V4z3K9K7ZuVvf/JXaemiJ2D9bk3AhqGTf9fk5GjaeHwE0VReVSrXHZCKT76Ee/BQv8HsTDzxPnI1k/ueexD3++8Bq7zp4EGsKS9X02yjujggmsqrSuW6A1L55gdwjb7cbzAlSeovbbfNfwCWLZv92jxcW4u++/apIjC/xNJcRk0N6A5I1YuvoXbCpCaDbCEA5WrODtZZyXt8Ec5Y951fYd8vLcU/FK7PCqW1+AgSilr65NUdEMeiZ+G8pelHrmeJwB6Vn2BRmfc8vxh9vvL/Mp6JOTnYqPKkYFPNywHRp9OHYlV3QOgjXvqot6l0uQn4RuUFitTOlnXrMfjxR5u06SYEbXbvDkVDxXk5IIqli1hB/QH5172o+de9TQY8O+7Eq9PUThtzcnHJjGlNVks3OnXfu1dtk03W5xp7JSqXvufX1oZE4BKVH1D8tH0HBv3fPL82x2Vne/e28HRCAd0Bcd40BY4nn2+yPbTYIEUN7aisxnnjmn4wcMDpxAUZGRHpH87J0+BY+ExEAdm6cTMufvgBDojMFtYdENeIkah8r+ntrvfEA0+rvIPQp0v2nLvQZW/jU1R+czgCbpOVqausbNUBRk9agRYjyOYVX2HI4qZ/kKhNPoKc2nS6A+Lp3QflazdF9BKLGlu3YRNGLmi8WWqHw4GRGi4vqR8oPUWSnibpL2kByKY33sLQD9/nI4isnzAGLrGINQ323U0fbEBX8NKVvFqkn+0VGDjhqkZV5zidGBCBSyx3v/6o+Pr7gKFpAciWRU9i8HerOSAyO5XuIwj1074nG/Rttg3TdSbgUw2eYvnsZL70Crp//tkpZm0eD7pocPxPw9joEav0qNVASQtADtx2O7pm+z9phV9iMXaJRd2pemkpasdf06ivXGkCVmkIyO9Fxeh/feNJykCHvcn84QmarXzjz/B07R5RQCoJkDxieECbHBAGAXHeOBmOp15o1HAjTMB6DQGhBn/+6BMMXPraKbYvzcrCTocjaCdXmqFm5p2ofrDpeZj6dao9ghyucaLj2MCH83FAGATE070nyn/Y2qi/0fcNHtBgqUl9Q8ddLrQeNeoU2/OOHMFbJSVK+3/Acp6evVH5/meQ0k8LWr/axxxlHytClxuuD2j3wowMZDmdQX2LlQxM3INQsSkgFJSGydMMUHmurJGNv0rt6H3NhJP//lFpKeZosBbLff5A0LVnUoeOsvpXYRLQVsWdlLt/2IhzHnk4oO1Oe/ag3OOR5V8sZGIGEMeCRXBOv72R5vsSgZ5aEwLg67zDuHLqFK/9vNpaXLR/P2okSbU+QF8tV/XCKyAtU2XXSejbSVVMx/9zP1pvazxS+0xUSxLa/ynvhH0V3WK6KmYAcQ2/zHvp0TB9lQBcpfFbpHw2/8g7jH7/vhcoKMDthw7h8zAPhqP1kpQUOKfNRPW/7gNM8gMZawK+VfH+q9IjIfmySwN2RvrDcG4ElvkzTUQD55gBhPpVtvk3SJ3PPMXFp+KBeRrNpjfVUMW1Lri//BLbFy3Erbm5YbUlBcM5dSY8XbqGXI/ap9jvzTuEs6YGPt7116oqjAnxIL2QAzNYAaYAaeoy6/Y44DWNJgsDtdVRexnG3zEb2esCb82tXwe9fHINGQb3kEu839LpnRR1h84C8HMi0EbF+499q75Br2cDv39FzVMjFQXOYCGmAGnqMusSE7BBxUuNUNpgmQe4ISMH5hXLYDqUCzEvDyL9LimBZLWCWKwgVitcQ4fD3X8APH37gyQnh2KiybzPm4F/qHgOGDVSOW8eknfsCOjbIwUFeK6oKGz/o6kCpgChwlasXOvtbPWTPQloqeKvaSgNOM4JfB3BhzqTTMBnKv8g5NvL0H7C1UHDnpybi2/KyoLmi6UMzAHivG0WHA89fkobaHJwtcxW3isBVzuBA6G/3UCmhb+z0dfLZWkw73Pwi+XovOTFoP4MzMhAJp8DOUUn5gCR2rRF+fqtIJa/12bdYAI+VvlXNWhvqZeBQtKnJpQSoeel8x103kPtVOSsRZtJ1wIythBHYomN2vFpXR9zgNCAHY89BeetM07G3k4ACjToPKGIu1EChmsEySgT8J1GPwC7tmxF3/n3Bw31h4oKXKvxOWBBnWAwA5OAeHr0QsXK70Ca/33DuzoBGCN/GkETqSkktzmBbJUut84TAfqUjn60SA5JQrPJk4GjR4NW/9+jR/Hy8eNB88VaBiYBoY1Q/b//Qc0//t47fV88sDCC8yH+OsJRAix1A6+5gQIFoFDGb4gDxorAzRqB4fN97+87cdY9/5LVp0dnZWG7hgs0ZTnBYCZmAaH3IOUr10Lq3MUrG/21/U2DI4CUtgkFhT7d+t4D0MfBwRK9jJpiAugMuRbveG9o3+72IHXWHUB2djDXcNTlQp+//gqaLxYzMAsIbQx6H0LvR3zpLTMwTeNfXaWdYLcE7JKAw+TEAkN630S/fZ9Iz3VuWrMWQ59YKCscrRZnyjLOeCamAaHa1T+adJAIbGFoFGG1bTflHsbQaScWXspJk3JysF7GUy45dUVbHuYB8Zx1NiqWrQRJaenV/iMzcCOjowgLneOAowbtpk9D8rFCWe78UlWFsXz9lV+tmAfEe6lVb/LwUhPwvUaPRGX1KMYzZb24BN2WfyHbS/pSUvpyUp6aVsAQgFDXq15/B7WXnziF5IsEYKLOj3xZ7FC7f9yMcx7yfyhcQ5/zXS4Mz8wEPU2SJ4MDQhISUPnh53APHAStzuw1cifZdTAPfafLe++iL8578/OxlI8eAZvdMCMIjYKkpnrfiEu35n5oBm7i9yLexs2pqMSZV40LiW96ej09xZ6nwAoYChAaCj3soHz1BvRs0xrbEvRb5ctKx6r2SEiir7SuCW0dTKRe8cCKTkr9MBwgNFDPmV1QvvEX3JcgMjG7rlR8VcpNmQKEeMDEq8eP4z8ylp+o4p/BKzEkIF5I6s703ZwIDI7AoQ5MtvOsWcD+/SG59md1Na7KzkYZP7lElm6GBYRG5z7vAsStXINSnVf6ylJaxUz7DuahV4g35D7zt+Tm4lu+KUp2axgaEO89SYfTMWPbdjzTnIGVjLJlV57xr69WovfzzymqgF9ahS6b4QHxhmw2Y/XOXbgwvW3oChikRFFlFRKffQYpGzYo8pg/tVIkm/5vmFLmduNSaXFx+N8PP8XtIwMfzqyWvUjWc+C3Hej69FPAsWOKzO6vqfEehMdT6ApExwhSF3f3xEQ8M+cumGbNxkDribVbRk6HjxWhzcsvIWFT0y8YkhNbhceDMyLwOgc5vhgxDwXEBSBqptwuat4c33Ttit+fehr9B5xnxDaB0+1B6apVSKcHLYRx/CndUdiBHyUaTh9wU0DoK02bh1MLa2V7JiZia48eKB44EPnTb0Pfbic2XbGeHG43bFu3of377wFhrrClx4gOzcwEHUF4UqxAlZCamlooCELU3d1SSN7v1AldEhJQMnQYjk2dit6dlZ10qFhemQVLqhwo/Wkrur3zlvdc4HATneu48eBB705BnpQrQAg5RgHZLwhC4FcdKbeha0kKyeKOHTGg2Ylj0itGjEDR1RPRqkd3tDTr/1i45MgRtFi5EuZvvwWqqlTRal15OR4oKAC9MecpPAUIIZn0EusnABeHVxW7pVuaTFjYvj1uqHfOFkQRRWPGoGj0GLTu3h1tEyOzwcTt8cCemQnrxo0Qf/0VCPNw7IaqP1FYiCcUPulitwV19WwrHUE+FwSh8QsCdfVLfeN3t2mD+enpTVZc2fss7LtsJGxnn4Pk9Hbo3CwJ6SocdVricKD2SD5S9+xB0q+/ANu3h3XT7U+V3dXVeKywEHT04Ek9BQghXwhWq/U5Qsg/1auW3Zoub9kS97Zti7OTgq9NyejdB4XnDcDxM86AKSUF8S1aIKFZMzRLSkKKOR6S0wmhpgam6mrEVVXBXFmJhMpymPMOITljH5IyM0NeYRuqcvSFN4uLirD4+HHQP/OkrgKCIDxPR5C5giAsVrdqdmujl1wUklmtW7PrpAzPltvtXjjo6MGTNgoQQu6iI8hoQoj8l2Bo40vEa6Wjyby2bdFPxmgScecCGPyuvBzvlJSAfvOkrQKCIIwR0tLS2kuSdERbU+zWfmtaGuiHdVA4GJHvQ6IodvDeiloslsMAOkTeBXYsUkgmW63oX/dImAXP6GQffV/H12Vl+Fmlx8AsxGUQH47YbLaOXkBSU1M/EwRhkkEc19TNYcnJuKJlS+8nPT7ycyUHnU5sq6ryHuRG4aglCg4A1lSh2KicELLMbrdf5xtB5gAI/oaV2NDGG2ULUcTIlBQMSU72fs5M0GauhL6TnAKxtaoKWyorsZMfIM1KL5trs9mWeAFJS0vrKUnSPlY8Y9GPXomJGJqcjHOSktAjMRF0lr6ZGNpe31KPB8ddLhx3u7G5stL74ZdOLLY2IIpir5KSkoyT02EWi+UPAH3ZdJdNr043m9HZbEayyeQdcXzfLkK8EDT8ePjlEpsN2dirXTabrR/955OApKamzhcEYYFRIuB+cgW0UoAQ8oDdbn/kFEBSUlK6mkymLK2M8nq5AkZRwOPxdCsvLz9wCiD0L1ardTkhZIJRAuF+cgXUVkAQhBWlpaUTffWesiTParWOJISsVdsor48rYBQFBEEYVVpauq5JQOg/WiyW1QDGGCUg7idXQEUF1thstrH162u0qNtisQwGsFlFo7wqroBRFBhis9m2BASkbhShk4Z08pAnrkCsKLDEZrPNbRisv21BCRaLZReAHrGiDo8zphXYb7PZ6BygUy4gdH3WcEEQfohp2XjwMaEAIWSE3W5v8sjKgBtLLRbLbAAvx4RKPMhYVeBOm832ir/gg+685jPssdpvoj/u+jPmigGhBTkk0d9ZYi1COXBQTYKOID7h+OVWrHWhqI434GVV0Me8/qSpu3Gn12v86VZU95+oDW4/IWS2vxvypqKWPYLUK0wfAT/N50mithNFa2B0nmNeU49yAwWsBBBvfXUz7vfzZSnR2p+iJi56Ys9jDWfI5UanGBCfAbrAEcBsvgpYruQ8XyQUoKtyAbxSf+GhErthA+IzSveTiKJ4Y90xpnxnopLW4GXCVWAXPS5UkqSPffs5wq1QNUDqO1K3x/0yQshQQRAuivUjhcJtJF7erwJHCCHbBEHYJIri93QPudpaaQJIQyfp4XSEkD6SJHUXRfFMSZI6CoKQTghpBaClIAjJAOixIVHzpiu1GyrG6nPTm2lCCH25U5kgCMWEkAJRFA9LkpQjimKmIAh7SkpK8rXW5f8BL6Vz+SaPT58AAAAASUVORK5CYII=
// @run-at       document-end
// @license MIT
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/481722/%E6%8A%96%E9%9F%B3%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/481722/%E6%8A%96%E9%9F%B3%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const nodeClass = "u0N5WOYm"

    // 存储之前的所有 MutationObserver
    var previousObservers = [];

    // 异步函数，用于延迟指定的毫秒数
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 获取节点DOM
    async function findConsecutiveChildElements(containerClass) {
        var container = document.querySelector("." + containerClass);
        var childElements = container.children;
        var consecutiveCount = 0;
        var result = [];

        for (var i = 0; i < childElements.length; i++) {
            if (childElements[i].children.length > 0) {
                consecutiveCount++;
                result.push(childElements[i]);

                if (consecutiveCount === 3) {
                    // 如果之前有观察器，则先停止它们
                    previousObservers.forEach(observer => {
                        observer.disconnect();
                    });

                    // 针对每个找到的节点设置观察器
                    result.forEach(node => {
                        setupMutationObserver(node);
                    });

                    // 中间节点
                    var middleNode = result[1];

                    // 节点文本
                    var nodeText = middleNode.innerText;

                    // 判断是否存在 “广告” 字样
                    if (nodeText.indexOf("广告") !== -1) {
                        GM_log("跳过广告")
                        // 按下键盘下键
                        var e = new KeyboardEvent("keydown", { keyCode: 40 });
                        document.dispatchEvent(e);
                    }

                    // 退出循环
                    break;
                }
            } else {
                // Reset consecutive count and result if no sub-elements found
                consecutiveCount = 0;
                result = [];
            }
        }
        return consecutiveCount === 3;
    }

    // 设置 MutationObserver 的函数
    function setupMutationObserver(targetNode) {
        // 观察者的选项（要观察哪些突变）
        var config = { childList: true, subtree: true };

        // 创建一个链接到回调函数的观察者实例
        var observer = new MutationObserver(handleMutation);

        // 开始观察目标节点的配置突变
        observer.observe(targetNode, config);

        // 存储当前观察器，以便在下次设置新的观察器时可以停止它
        previousObservers.push(observer);
    }

    // 观察到突变时要调用的函数
    function handleMutation(mutationsList) {
        for (var mutation of mutationsList) {
            // 处理变化
            if (mutation.type === 'childList') {
                findConsecutiveChildElements(nodeClass);
            }
        }
    }

    // 异步循环执行函数
    async function asyncLoop() {
        while (true) {
            try {
                var find = await findConsecutiveChildElements(nodeClass);
                if (find) {
                    break
                } else {
                    GM_log("查找节点失败，正在重试");
                    await delay(1000);
                }
            } catch (error) {
                GM_log("查找节点失败，正在重试");
                await delay(1000);
            }
        }
    }

    // 异步循环执行函数
    asyncLoop();

    GM_log("抖音插件已启动");
})();