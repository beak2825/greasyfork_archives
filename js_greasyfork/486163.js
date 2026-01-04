// ==UserScript==
// @name         Better ANNEX for BUBT
// @namespace    https://naeembolchhi.github.io/
// @version      0.7
// @description  A wide range of improvements to ANNEX for BUBT.
// @author       NaeemBolchhi
// @match        http*://103.15.140.122/*
// @match        http*://hr.bubt.edu.bd/*
// @license      GPL-3.0-or-later
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAJTZJREFUeJztnQmYHFW1xwNJ2CEBAoEQkkzXrZ6EgbBEkCWyaRBkDwyQpOvUJGAA2QVFQTDgQ0EFZBFFQZYsklo6GYEgzwVBUEGRRQURIfgIOwJhCYtA3v90dWQyZKaruqv63u4+5/t+30BmqurWPUvd9dwBA0SqFjdUG7m+2s4N1H5uaHdRoM4El4AbgA9uA3eC+8HfwBPgafAiWAreBu+U+QAsL/NBj39nXgcvgWfAk+BR8GdwN/g5KILZ4DJwFjiafHWAE6gJKNumM6+esJruuhIRaSgp+GPWgwPtCGeaCmaB68Ht4EGwpOy8yxuEd8Fz4C/gV2AOuAB0IVDsiuA1VHd9i4hoEWd+2wgnsCfDGb4JbgL3lr+0H2TgiCbzGkWtlFsosC53Amu6G1jjO72Ogbp1JCJSs8z0coPxtdsJTeIzyo7+AEVNa92OZzrLyoFhATiPQmtfx7M21K1PEZF+hUI7B4M9FswDfwXvGeBMzQK3jh6naOzhKxTYn5x584jVdetcpIWlK1TbRMZYGhR7yQAnaTV4UPM3FKoL0X3Ya+rcUYN024RIE4vjq41hcMeBm8XhjYQDwi/B151A5XXbi0gTiBvY28GgvkdRk77VBukaHZ4CvdYN1P7T5igZWBSJJ+SrnSmagltigBEL6fAyReMHRzpFa7BuGxMxTMrz7z8C/2eAsQrZwtOPHnQ+ac879pQFS60qrmdtRNEqtocNMEpBD0vQRbjc8ZTSbY8idRJE/t0pGsh71wADFMyAx3fuRDA4wrlxvIwXNJuUF+WcSvK1FyrDYz/fIC+3gW67FalRurzc0JIyo3Xpug1LaCzeANeixThKtx2LJJRpnhoC5V1M0dywbkMSGhte0TmPPDVat12LVJAp8/JrQlkXkji+kD68Tfp6CnLDddu5SC+ZNWvAahStw3/WAEMRmhve0PWtgmetrdvuRQbwqL7FC3ceMsAwhNaCBwsn67b/lpWpYdu6UMC14D8GGIPQutxeCNUI3f7QUkK+moSKf8oA5QsCs5RCdcyA5bo9o8nlpEVqICr7CvC+AUoXhN50F/z8EN1+0pRCobUlKvg+A5QsCP2Blqk9Qbe/NJU4RTURFfuCAcoVhDhwAteCbr9pCkFFOuAtA5QqCEn4kEI1S7f/NLRQYPHcvozyC43MZbLtuApBxZ1IMtgnNAdXzpql26MaSPDl58MxJKuu0Eycp9uvGkLQb9qFotzwuhUmCGkjA4P9SVeohlF0So5uRQlCFrxDvtpOt58ZK6igWw1QkiBkyWNUzMlGot6CiiEDlCMI9eB/dPubUTKju30wRcdY61aMINSD99xQ5XT7nTFCUXZe3UoRhHryE91+Z4YsLwWAxQYoRBDqyX8cP7+FbvfTLm6g9jNAGYKgg5N0+592QSXcYIAiBEEHf9Dtf9oFlfCoAYoQBB186Hj2UN0+qE2mzVE8+i8n9AitzI66/VCbuKE1xgAFCIJODtDth9qEQrW9AQoQBJ1M0e2H2oR8Nc4ABQiCPkJ1mG4/1CYUWMO0K0AQ9DJJtx9qFVTASwYoQRB0Yen2Qa2CCrjLACUIgg6WTuluG6TbB7UKKuFsAxQhCDq4Rrf/aZeuQG1BkvhTaE320e1/RggqYpEByhCEerJ4+kJrsG7fM0KcQH2SOI+6fqUIQr1wdfudUYIK6TZAKYJQDx7pCnJr6PY5o8QJrRGomFcMUI4gZIrjW7vq9jcjBZVzjG7lCEKWuIG6SLefGS0k+QGE5uVuJ8itpdvHjJbpC601UVH3GqAsQUiTJa5nb6bbvxpCCkV7Q1TYIwYoTRDS4FXy7XbdftVQQkFpUPAxA5QnCLWwlEI5DagqcQN7E1TgQwYoURCq4eWuwN5Ktx81tDhFaygq8nYDlCkISXjUDXKjdftPU8jUuaMGoUKvMECpghADqxsM0e03TSeo3MPBm/oVLAh98pVCOK61t/jGFTdU7U6o7ETXBKodlXyfAYoWhJ485QQq0Qq/gmetD3veKZnXNJFQtAloCYWqLcl1XQvGcJfgTPCeAYoXhKvc0EqU339q2LYuugl/cn3lJPOaJhKKAgBX4DOoiMSjpWg9dODaOw0wAKE1+Qe+4LsntVvXszai8uyWBICPKvNltAR2SXqPTq9jNVw7DbxogEEIrcEy8MVCqBIv68VHqw3XPr7iXhIAVq7Yt50q86R3hbn1KUov9rYBBiI0Jx/ii385fm5epb3vQb0+VBIAVlHJ4HszvVxVI6luYHOKsYtIjhwT0mWu61tVL+fF9SfQKj5OEgD6rvA70VyqevME+flRuMelJIFAqB7+GM3GV7/q1Xxd3pi1cY95fT1DAkD/CniJfHVQLc9wPTWcoq7BawYYlNAY8EfjYgqVqsm+fZvt+/H+niUBIIZCHDS/HE/VtLKqPEbAg4UPGmBggpk8DU6C4w+rydauGzOQYnZDJQAkU07N56jNmlV67s7gGvCOAUYn6IWb+SFampNmdLfXvIKPAnsi7ve3uM+XAJBcYbc7gT0qjee789uG4H5HgXsMMEShvrCTHu8EVlUj+r2FgjbOYfETSnjGhQSA6pTHX+7LCsX8uumVxR6Nex5Hssy4mfk/cC7YntePpGE3M6+esDq6DKcRr2OpokwSAGpT6HPgK1O621JNsUy+xfsNvgDuIDmvoNHhpDJno4nPTr96qnYSqqlUYZCvEhIA0lHyE1DGSbxHIIMycmYi7iZcD143wKCF/uEm+C/AMW6gLB7zycAmDqKUBpMlAKSr/KfASYVwXCaHLkz31GAnsHfAM86gaA+CnGmoH26h/QnMwkdgLydsXy8L3Q9YXrLXI8H9aZZfAkA2RvE8ON8N7UyTMswI82u5odoFzzqdoqxFbxngEM0O7wD9LTgXwXjfgmdvlKWOp84dtQaedQrV2NTvCwkA2RrLG/gqzIWTdtTjfabNUQPJt/J47hHge+CPJK2EWuCvO4/WXw1mUGDv6N6kUhv47U+gxy0pWvf/UpbvKAGgfob0Bwqs4x2vva4HM/DzYLjb4PmHka++hp9F8C8DnMs0XgW/At8GU6CrCYX5djbN+T5k1qwBq+Fjwf17HkOoS64JCQD1NzQ+f3AunHI37tfpEje0eN54O3AgOBn8CNxNzb2tmZ2cp1mvh4PzOMpk/qrjvzft9PTpAuXocAJ1FX4+W+86kQCg1yD/Ca7El3mC7rroKYX5+XVRJgtlmxg5SWl9wgVgNkWDjzy1ZdLeBs7T+ARFC6p+StEy2BNBJ/n2ng6ncfPNSpKJ+lUo3zfBw6RxqlcCgH7jXQEM2LoKBrujzpZBEikUx6wBx9qEQpuNeVsKrV3dQE2iUB2C/+c56i5wLIydF6qcXQ4iDJrZ9qUro77T4/fnUDSweTzuNd2J9lBMxr0/C4PdDf+9PZ5l4+dw+ml+Td31EFfIz/H4zIXgLzqdXgJAWQwLAD3h6cQ5CAhHFYLc+rrrSaQ66fRGDkRw3Au6/CFFR80Z4fQSAMpicADoCe/o+j34BpQ1vlFaB60qXYHNKbe+DG4jPpZLv/1IAOhLGiQA9Obf4NfgfDSPJ2ax+lAkvqD7wl0R7uIsAE+SgV95CQB9SIMGgN7wANjvqJR9yJ5Mxdymuuu1WQUBl3dv7kfROMXPwQsG6F8CQLXSJAFgVbBh/oZ4IYlvH4l+6Ejddd1oUgjUMIrW3POMwiKKZhneN0C3EgDSkiYOAKuCWwo8+nyzE6iLncCa7gbWeF49qFsPOsUt5kdTYB2IOuFFUjeBeyna5albXxIAspYWCwB9wYOMiykaaORVglfAIU5Bd+Jz5CubimMH69ZTtcLbb6dHeRY+g/c5Hj8vAR5Fa/l5bf0yA+pfKxIADFBCA8DbkHn58AMU5SgIiae2wtJX8zgEiiPhYOgbWztTaG3leNbm7oKxqa2ZP2K+tabrqc3c0M6XE11OAkfgq30Mfp5F0Zp5XqR0K0WLgR6laEWj7IOogAQAA5TQxLAD8g5Fng7jJdC8sYWb10soWuvwRJnF5X97tvw3/y5f8yaJE2eKBAADlCAIupAAYIASBEEXEgAMUIIg6EICgAFKEARdSAAwQAmCoAsJAAYoQRB0IQHAACUIgi4kABigBEHQhQQAA5QgCLpo7QAQWjvqVoAgaKag2w+1SVeobAMUIAjacAPrEN1+qE0c31qfGiyDiyCkzO66/VCroAKeNkAJgqCLLXX7oFahKNuLbiUIgg6e7vRGrqbbB7UKRYde6FaEIOjgUt3+p126QsXjAK8boAxBqCtuYO2k2/+MEFTGjbqVIQj1xbpq5s0jVtfte0YIBTYfxfy2fqUIQl04veX7/r2FSskwtStGELLkDfA53b5mpHQF+XUoyk+nW0mCkAUPub6d0+1nRguFNh+HLUkohWbjKtdXqWVpbmpBZX3JAIUJQhq8DA6aNUu3VzWSLC8FgRsMUJ4g1MJ8x1OJz4l0A7WLc+P4lj4tagAfl4UK7DZAiYKQlOfBwZ1eR+JRflx3OngP/Nz1rPWy8K2Gka4FY9dCRdxigEIFIQ4fkK++hZ9Dktr6zKsnrI7rftzrfg+DLbLwrYaRo72OQRQdGKlbuYLQHwspVHY1No5uwnCKzoVc1X1fdAL702n7VUNJ13VjODp+wwAlC0Jv7sVX/1OdXnW27YZqL4q6DP09430K7PPRSmjthUOoiGkkqwUFM7jXDdSkalfzIWCshntcQNHJ0HGf+QsnTD6o2FSCSugAfzfAAITW5H/xNd6jljX8jq9G4z5/qPL5LyHwNE8GIbzQ9mDfJNc4QW49io6jlkxCQj3gVudlcPyta7b3UJ1C0anLtZSH7X4ehfmhtZZHu1CUFfgdJ7A+k/RaJ1B749pnDDAQoTn5Exz2GApzG9Vq5/jqt+N+d6dcvhfIV0fUWjatQh+lBee+0OSk1xdCxa2Bb1JpoES7wQiNz5Pga3D88dUO7PWUKfPya+J+3wXLMizzLyiwGnOPAa18LgA78QlV3mdr8EsDDEhoPO6n0gIce+s0t+hSNGhdr3yX3E25eJqn1kmr/HURWtXBIL66ckZ3e1VLIXH9Z0gGCYX+Yfu4HF/5g93A2ix9m7Z5aq/aQb5aeRHvddrUuaMGpf1emQj1fTLQnW5gD6vmnl0LxgzCtZ0kW4tbnQ/A38B14ASwV1cxX5VNxRE43gQqzRIYMTj9OHDRojE74xD1fzQYN5/2qPrexbGDEY2PwD0eNUAhQjq8BX4DimAuuBZ8D3wVHE2hPbm0mSawR00Jt1wjTVvt084CexeKHP8DA+qnN/8An+e9NfWoi8RClc8G5HGBi6bMyw+u9hmllYS+2gf3udMAhQjV89XCgpwxe+phU4eiTL8lM774lVgMzuZBc931tpJQ/MNBeWPEtrU+D1+Gbag0p5vpqKyQPl9Kw95qlYJnrY8Wxpcp+rLqrpNqeMNBq8kNrLzuuiwJJTsdmKcKL+0KcmvX/Fzf2hD3mg7+bIBShP55rSvMrZWGvVUrcPrdUQ4fvGlAfaQBt1p+B44hL7emtoql6o4HXwwOS60MfmkKkddlv2iAYoSPc3Nauk5oF7zsnFecPmlAHWTJayCkwD6w0+uo71gBVRcAVnAX2CatsvDsAZpHu+Gel4JXDFCMEDE3LR33K8tLTr8rnnclRQPHjdC3Txv+CAbgqDRa2hWFagsADA8S+o5vjUmzXFO629agKBjwNuRm/wKYTmYBwC3aW1CovkBR9qlK23JbDZ5xuQv1cyGF9i4nLVLpTylS7QFgBe9Q6XQhK/WTVnnrpht1E46naLrnPQOU00qkEgCmL7TW4b37uN+5FGWaeopa8ytfLdwq5lb35W6gDi0EanjNSqH0AsAK3kXEmgeHzWyU051v80gwb0T6OriPzJz/bSZiB4DpC/MbuKHaCl25g3HdmeAaipaILybZL5IFL1GUzWiuW2ot29PwEf5EIVSbxmoxUPoBYAXslD93fLVnLc4eR7o8xTMKe5cN7naSKca0qRgAKHJySRZjFhxwESCstv4Ul1UA6MnDTmCdUPCs7Ac1BpRXIIaqA/AqxIvAPRR1UXQrpNHgaV9eU39MxToP1AMGlFdYNX3nSqT6BIAVvApucAN7u1Q9PoY4RWuwE9pj8fzPgdPAbPAISbOU4TEVXujFJ0R/0Q1t1JFlo88ee/UnSQAwGWMCQE/Y4L5GXnUbjtKSQjhuDfRXc2APlKdA0azDfIq2qL5ugPLSgkeU2Ul/SqVBOKuAPuNeTmC3JXH0voQkAJiMkQFgBXwO4d1wwDPcUG1SqyGmLU6QG4ruSzu6EzwlyQNbR1M0+PhDsICi7gXvetQRLLhbs4Q4c040qv4jcD44zg2sya6vJqLceQqtoVlntCUJACZjdADoCQcDXh55phPmap/iqLPM9HKDCkV7Awrym6ObY5OvxsMBd6TAnojgxoOU+8ExD8C/TS4RqMkIfEcx+O/O//576XfWAfhC74Mv9B743c7EuRtDtRXuNcr18xsV5nfoWz66CiEJACbTMAGgJzyL8BdwNZjEzlVHexZJKCQBwGQaMgD0hpvYvAjoVCrKGe+mCUkAMJmmCAC9eQ7chqbyuWgWf5JzDtTR3kV6CUkAMJmmDAC94WWSdyAgXIm+9xSg6mj/LS8kAcBkWiIArIoXKMpC9APyLXIDtXXDJGvUKDNvHjHICdW2xHvVA3UV+HKla0gCgMm0bABYFby67Z9UyuWuroahn4ifuzmhvXGqXtQA4hTzw5zA4gy6fFoOTyHyGMtj9PHz8uIsBZYAYC4SAGLCewg4OPBUZOAE6rtuYB3Lh1CSnxs37SYr8bnzuoT89rXRDeKVj5+lwD4WP79F0Uo/XrPPabn/naBeJAA0NhIAUoQX3zxLUbprTkj5M4qWFfN05bfB2QgcJ7jRqsL90cKY6PhqAoX5rcE417dyrmeNdsP8ZjPC/DDy29ZHt2Sdqf6YIfz/KyDPGgnHzeMe27mhxUkyPk2hOgi4FH2xz6MoW871YCFFmXofpGjXHWeYSXObrQSAxkYCgFATEgAaGwkAQk1IAGhsJAAINSEBoLGRACDUhASAxkYCgFATEgAaGwkAQk1IAGhsJAAINSEBoLGRACDUhASAxkYCgFATEgAaGwkAQk1IAGhs+g4ATmBNMKCAgtlIAEgXTrU+hQKbl3gfRNFS7iyf128LoM2AChHMRgJAWoTq/FVlYcbvPp/hc/sOAIVb2takKBmn/soRTEUCQO186ARqOp+A3E8dhhk9u+8AUH7w4wZUkGAuEgBq4y009/eOUYf7ZPT8igFgvgGVJJiLBIDqeZp8Na5S/bG4gWVlVIZKAcA63ICKEsxFAkB13FcI85vHcf5yHX4uo3JUCAB8mGaU5EJ3hQlmIgEgOUV8+deP6/zlOvxZRmXpPwCUHu6XTtHVXWmCmUgASMalU8O2ROctUpTlKc0sTj2JEQC8/Pr4wxcNqDzBPCQAxOfkpOcw4pr/oegkrKzKVDkAlAriq1MNqEDBPCQAVIYzKR+YxPE5/TrXbR3KFi8AcOSiKNGl7soUzEICQP+8BHZI4vzTPDWEouzT9ShfvADA4gbWaEqWMlpofiQA9M2j5Fmjkjg/BVaO6rv2Jn4AiApo70fZ9kmExkJ3AOCDYb8DplKoTsDPPxpQJ8ztTmBvmMi3QvUpiloM9SxnsgBQVugpBlSwYAY6A8AfnFAN7/msPe/Yk7uqJ1N2o+Zx+HGhmF8riU+5gT2VSqsC617W5AGAxYlGJ3Ubn6AfXQHgbQqtEf088xwd9QG/OHtGd3ui06hx3Vmkb89NdQGgXPCvG2CAgl50BYBr+33o8tJzf1LHeniffFVI4j/l1sqPNeuv+gBQVu4XSW9zS9CLpgBgn1LpuUd7HTyV9ss61MFSMDGR33j5dSg6hFa3/moLACxuoA4mPf0XQT+6WgAXxbFNJ7B5EdvDGb7/U65vJ3KiQtHeHNf9xQDdMbUHABbXt/jM+MUGvJBQX3QFgOccrz3WQJsTqi3w989kUIZ7CoG1SRI/cXxrBzJrb03fAWBGd3uyNcuhNRQ3DAx4KaF+aJwFsC6La5tuUPpAvZ7i829y/dy6ifwjSvG11ACd9aRiUtAzk7xkafAlVFNTrmzBXHSvAzgxrmnibz9L6Yy2f2daqAYlcQtc8wWKlgTr1ldvYmUF/lKSly1dG+ZH4brbDHhBIVt0B4AP0Ac/ILZdBurYGp7Fg90zO72EvhCoS8ncgfLYacEvnDUr2Ytza8CNmj1LDHhRIRt0BwDmLdjZJ+KaJf7+wiqesQzsk8T8uQtN5neJE50LMHtKd9saSSqBpeDneXMDL8x424AXFtLFhADAvEChNTqOPZY3tiVJdfccBdY2iWy+mN8Q191ngH4qkfhgkLsd3x6WpDI+up89EtdfS7KXoJkwJQAwjxWK8dbfk5dfA39/T4x7Puj6aoskdu4G9lhc96QBuolDVScDLXHwuySV0lOcwGrHPa4nCQTNgEkBgLlr+kJrzTh2SL61Ef7+sX7udQsYksS28fefpsbaMVv10WDvoln0tU6vI1GGk5XuH6qtcJ8fgvcMqAihOkwLAMxsXmYbxwYLgcWH37ywintcVfDaE3V3cc10arxubs1nA/6qv00ZccQJ7C1xn/PJvDlSoTImBgA+ZWdWbPvz1c4UDfJF1/rWGZ3eyKSpu84j3g+gXx9JSeVwUHbcmYlnCXpJV8Dro62jcK8/G1AxQjzMDAARblzbw99OBu+Aw5PY7EmL1EBcc6MBeqiWVE8HvgutgfYkFbhKiXZy8ZLJb4NXDKgkoW9MDgDvOeiTxzU7tEQ3S2KmM8L8enjGnQbooBZSPx6co+ilhWI+0TLJvsQp2twq4LUEC0jOKTQRkwMAs7QrsDrSsMWV3ilUvNDt7wbUf62kHgBW8Dw43rlx/MDUKt1r4/UEnWARNWZ/qxkxPQAwT7uBin0KTyVxwtKYwXMG1H0aZBYAVvA4Kv+IWscHPlY2BAMnWmXI/a83DajIVqURAgDzYCFU69Vqd7A5PirvDQPeJy0yDwD/VQCa8lPjTs8kkakhH2Nu7YpnnElROmVT1103I40SAJhFXQvGJNrE0+s9Tqfm64bWLQCsgBMhHMvZWqpVRCVxfHs4Wh374znfQl/tQQMquZlppADAfD+xQUWD0ldQc35Y6h4AVvAvcH5hQbLUydWIE1jD8axJ4EvgdpLsRWkyr1L9k3nTuqfHtR0qjkXrUt1qQJmzwupPcVkGgBVw/30u+Wr7uEqpVZyiNRh9OV6FOLmc3fgOkqCQBO4D/5q4hRWoPSrVN9XvlJu48Jd8cqVyu6G9KQXN3YJ0fKvvfQ5UnwDQE24qnsqHkSb06ZqFZysosEaTb+2FMnwefB/cDV7TrSSNvAp+Ay5Dl+oY1A+vcx89bY5KmvbaxC/o2+gq7txnmX17G/zN0waUM1OmePl1+lNcvQPACvhr/DPXV4dkOVYQV1COYYiU21M063Ac+C7oBo9Q46397smy8juwg15CnCzDt/eHo2/n+GqTpCfZ9iWkP/V1X/ybQrXrx8trc5LbVgj8z1VSnK4AsLKSoqQKh06Zl0+Uo7Ausrw0LzwEXRirXF88+DiNotNpuHvBxs/B4i6KBkA5OUoW00j/gePysVL/AL+naK3EbIqOzToNEDgAwWwijD7P+RvTcvBKgmfVkoUna3g9CWeu4rX8F1DU4mmVXard/SvOjADQE14WXISzdXYFubXrYbxZyYzu9oHT/NzablENJS83HF+dLfHVzTFuaI37L4H673/j3cfy74l3sIVqRJenhk0vtq8//aYxiZO01FPwbu0G2I7wcb5YQXHGBYCecNObB5cuQEDYlr/EIuYKZZOWW6gBfEw+1v3prTSTA0BveGmmD47ud2RTRItAL54BNiJ8BLqhbf0nTqHGCgC94RHcW9Bc5qPLxqW9FFkkmUAPhxlgE8JHXBNDaQ0dAHrDA2S8dfMHwEEfuq0Odt8S4nq5zSvt/iyf0/eiAXYgMKHaq6JiqbkCwKrgeW4eMb8WX6iT0Cf61IwgV/c1CI0iR/ulc/Z2A6dEdVZaJxHtivPV9ErXk7nTga3GM44X49Qvav4A0BfcWrgXeA6nM/fV4U5RbesU7VRyHJgshcBexwms7SiwOTPTLDAH/Jai6cv+psfurHRvCvJWhXsIdcE6OZYxUOsGgP7gdQl/pejY6dluNHd8AgLFoWhW7eR4amQtO84yk9KRbfYwlHNrlHlfhxc0heoiihyc90fwklduole74eVDJ0Ze/vKzdOuwlXmbQiteWn+SAFAt7ETcvXiCouXNnH+ez4JfCOZRqSlsXQwHPDcapLROhVMe54ZqJn7nOIFdwO8OA5N7gr85jH/HRH9rnYp/P6u8n4GPn+JmOR94wemseUHLn8DjFLVo6rGNteI5khwkDdBPK3N+LOeXACBUwXNUHFuxb0lRMNRd1lZkmeOrTSUACNnh24fGsKutSVK66SDZSd8kAUBIzgNxsj7h724woKytxLPoKiZLiUYSAISqsPauZFswRj6Wq5GO0Gp0KuY/kAAgpMX9Jy2qnDOAePux/rK2Ard0eh2JcjhIABBqwvXVgZXsi5dnUzRbob28Tcwy8q0tEzu/BAChRp5wvPa1KtlYl5fjcyFfNaC8zQpV5fwSAIQUOC2WnYWlZCW6y9qMBFU1/SUACCnxFvl2rOYnRdmLdJe3mXgagXWjqp1fAoCQEjfHSdbCGZ4oWmKtu7zNAK+x2LEm548CAG8K0f4yQuNzZBx7cznVmUwNpoA1o2bnZ5nmqS31v4zQBLzihNaIODaHv/0MeM+AMjckTqCuSO34vWlz1EBq7LTXgiG4gfplpzcy1oAU/n6m7vI2KLdSMZdugliKUlnrfjGhOTg1gd1dZEB5G4n7wZBUnT9ShHW1AS8nNAf/cUO1Wxy7Ky8SusaAMjcCT6KLFX+XX7IAoHY34AWF5uF5J7A3j2N7fHYCSTbhSixxQrtiIpaqpRyJHzHgRYXm4Z7pC63+U1KXpZxMdIEBZTaR5xzfyj65LR50ogEvKzQXN3R6A2KNVvNpzhQdD6e7zCbxdFdg5bL2/ZKUm2J/N+Clhebiq3FtsNPrgA3aNxpQZhP4J/mqug0+1Qr51n5UfcJIQVgVHzpB5XTiK6TrujGrU3TYqe5y64RH+4dn6et9CgXWHAMqQGgu3o+zdXhlOyyddtyKH6Nb3cDeICv/rihdYY4PhnjUgIoQmou33dCumEWop1CoDiHebKS/7PXi+07RjjVwmqlQWDrqeakBFSI0F8vg1HsmsUV0H7al5j91mFs6x3d6Heks701DyFd7oVDvGFA5QnOxDOyRxBbRJN4E1/zagLJnwQsUc+FU3aV0WEV9DpsQWgsOAvslscWZXo7XCpxPzXXs2C/wod0sK/9NRRzfPoCkJSCkDz4sdiGxPQZqT+Kvpv7y18o5sQ7vNEGgKO4OvGZApQnNBX/Nz0hsj6HFXYKbDCh/NfwDX/1PZOGnmQqCAA8MPmlABQrNxw+cG8cPTG6TqpMaK7nId8i3kx3cYZIgcm2MQHCLARUpNB+LeAo6sU2G9qZk/glED1FgTcjCJ+sunIkEL3QqSUYXIX0eI8/OV2OXTpjnHa2mbWh7E3zBKcbbFNVQ4kbzs5JIREibpWhpHlKNTZY3FPFJRK9ofgee17+yK7T0LOetl/B2T7zo2eBdAwxHaB4+dH115ZTutqpSXxWK9oa4xyyKphvrXfai41tj0/Y1owX9Gxsv/r8GGI7QXDzghHbV22HJK80WXED1yXn5M7BTnPTozSnLS4Hgs8T9OP2GIzQPb6JLcHLcvAKrEvKtjXGf0yn9GQNu6s8FO7Su4/cSbrahQo6m5lisIZjDr9HH36IW2yxvdHPA32osC59z+HUKVXZpuhpdpnlqHYoGZJ43wHiExuYNcI5btDZOwzbLM1k7gysoGqmPW447KLAnF/z8OmmUoyXEDUqBwCVZRCQk50XYz2lOkB+alX2SpzZA1/VgPCukVU9tc3KO4/G1H5VVGVpCSps5on0Fcla8UAl2uiPIy69dTxt1PGsonrs/uAwOP90J1Jh6Pr9lBBXcAS6h1kr2IPQPTyXzGQE7d103xpx98SLZietZ60HhvOX4DgMMUNADf+1nuL6dSv9epEHFDe0cDOEUktWFrcC/wFfQvx/LZ1KIiKwkrq+2goF8mQKr1ukawRx4fQivGt3BuXF8rANERUQ4HdQYPgsdhvMr8L4BhizEgxfJ3Em8GSawO2ZePUH69SK1ieuVFnLsDb4LnjLAyIWV4ab9JXD4fRG0N9RtLyJNLl2+GgmDO4iiBR2LDXCAVuMJcDmc/XDyrTajstqKtJ64gdqcQrUPjPIsiroM9dgE0irwlO3t4Ewwieta1r+LGC1T544a5IRWnqJWwjngNvCSAc5kOryPo9vhkfpQHYCvuz2ju32Qbn2KiKQizvy2DTlFE/FqsyjVdJE4WWNzpZyuBKd7/3v53c9By+lI8tVOnKZapuZEWlLIy6/h+nbODazd4BSHUbQu4UqwiKL1Ca8b4Lhx4bI+BBZQtOryRLzXYQ5vgvHVyCndbfJFFxFJKoX5Y9eFM43GF3M7J1R7OIHN3QunHCzOI15HHiWp5AQRvO/hjxRtP+XNULwzcimufavEyptP3u3x7y+DF/Hfi/Hzr+Beik7GuRnMLj/jXHBC6dm+OtgJrE+Rb29DobUF/k12q4n0Kf8P03F9q+iO2VgAAAAASUVORK5CYII=
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486163/Better%20ANNEX%20for%20BUBT.user.js
// @updateURL https://update.greasyfork.org/scripts/486163/Better%20ANNEX%20for%20BUBT.meta.js
// ==/UserScript==

// Table values
let weekDates = document.querySelectorAll('#MainContent_GridView2 tr td:nth-of-type(2)');
    // weekDays = document.querySelectorAll('#MainContent_GridView2 tr td:nth-of-type(3)'),
    // checkIns = document.querySelectorAll('#MainContent_GridView2 tr td:nth-of-type(4)'),
    // checkOuts = document.querySelectorAll('#MainContent_GridView2 tr td:nth-of-type(5)'),
    // workingHours = document.querySelectorAll('#MainContent_GridView2 tr td:nth-of-type(6)'),
    // dayStatus = document.querySelectorAll('#MainContent_GridView2 tr td:nth-of-type(7)');

// Function takes a start time and end time to calculate working hours for one day
function calcDayHours(startTime, endTime) {
    //const startTime = "08:03:55";
    //const endTime = "14:53:53";

    // Split the time values into hours, minutes, and seconds
    const startParts = startTime.split(":");
    const endParts = endTime.split(":");

    // Create Date objects for the start and end times
    const startDate = new Date(0, 0, 0, startParts[0], startParts[1], startParts[2]);
    const endDate = new Date(0, 0, 0, endParts[0], endParts[1], endParts[2]);

    // Calculate the time difference in milliseconds
    const timeDifference = endDate - startDate;

    // Convert the time difference to hours, minutes, and seconds
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    //console.log(`Duration: ${hours} hours, ${minutes} minutes, ${seconds} seconds`);

    // Format the time values to ensure they have two digits
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

// Function spits out the current tme in HH:mm:ss format.
function timeNow() {
    const currentDate = new Date();

    // Get current hours, minutes, and seconds
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    // Format the time values to ensure they have two digits
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    // Create the HH:mm:ss string
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

function setLatestDay() {
    if (document.querySelector('.my-latest-day')) {
        return;
    }

//     let dateStrings = [];

//     for (let x = 0; x < weekDates.length; x++) {
//         dateStrings.push(weekDates[x].innerText);
//     }

    // Convert date strings to Date objects
    // const dates = dateStrings.map(dateString => new Date(dateString));

    // Find the latest date
    // const latestDate = new Date(Math.max(...dates));
    const latestDate = new Date();

    // Create a custom formatted date string
    const fMonth = latestDate.toLocaleDateString('en-us', {month: 'short'}),
          fDay = latestDate.toLocaleDateString('en-us', {day: 'numeric'}),
          fYear = latestDate.toLocaleDateString('en-us', {year: 'numeric'}),
          fWeekday = latestDate.toLocaleDateString('en-us', {weekday: 'long'});

    const ffMonth = fMonth < 10 ? `0${fMonth}` : fMonth,
          ffDay = fDay < 10 ? `0${fDay}` : fDay;

    // console.log(`${fDay} ${fMonth} ${fYear} ${fWeekday}`);

    const fLatest = `${ffDay} ${ffMonth} ${fYear} ${fWeekday}`;

    console.log(fLatest);

    for (let x = 0; x < weekDates.length; x++) {
        if (weekDates[x].innerText == fLatest) {
            weekDates[x].parentNode.classList.add('my-latest-day');
        }
    }
}

function autoDayHour() {
    let latestDay = document.querySelector('.my-latest-day');

    if (!latestDay.children[latestDay.children.length-1].innerText.match(/present/i)) {
        return;
    }

    if ((latestDay.children[latestDay.children.length-3].innerText !== '' &&
         latestDay.children[latestDay.children.length-3].innerText !== ' '
        ) &&
       !latestDay.children[latestDay.children.length-3].classList.contains('my-dynamic-exit')) {
        return;
    }

    let checkOutNow = latestDay.children[latestDay.children.length-3];

    checkOutNow.classList.add('my-dynamic-exit');
    checkOutNow.children[0].innerText = timeNow();

    let workingNow = latestDay.children[latestDay.children.length-2];

    workingNow.classList.add('my-dynamic-workhours');
    workingNow.children[0].innerText = calcDayHours(latestDay.children[latestDay.children.length-4].innerText, checkOutNow.children[0].innerText);
}

function getWeeklyHours(timeArray) {
    // Initialize total time to 0
    let totalTime = 0;

    // Loop through each time value
    timeArray.forEach(timeString => {
      // Split the time value into hours, minutes, and seconds
      const [hours, minutes, seconds] = timeString.split(':');

      // Convert the time values to milliseconds and add to the total
      totalTime += (parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60 + parseInt(seconds, 10)) * 1000;
    });

    // Convert the total time back to HH:mm:ss format
    const totalHours = Math.floor(totalTime / (1000 * 60 * 60));
    const totalMinutes = Math.floor((totalTime % (1000 * 60 * 60)) / (1000 * 60));
    const totalSeconds = Math.floor((totalTime % (1000 * 60)) / 1000);

    // Format the time values to ensure they have two digits
    const formattedHours = totalHours < 10 ? `0${totalHours}` : totalHours;
    const formattedMinutes = totalMinutes < 10 ? `0${totalMinutes}` : totalMinutes;
    const formattedSeconds = totalSeconds < 10 ? `0${totalSeconds}` : totalSeconds;

    // Create the HH:mm:ss string
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

document.addEventListener('click', function(e) {
    if (!e.target.classList.contains('btn-success') || !e.target.innerText.match(/working\sday/i)) {
        return;
    }

    e.target.parentNode.parentNode.classList.toggle('count-this-day');
});

function whichDaysOnly() {
    let countThese = document.querySelectorAll('.count-this-day'),
        countArray = [];

    for (let x = 0; x < countThese.length; x++) {
        countArray.push(countThese[x].children[5].innerText);
    }

    let showCase = document.querySelector('.total-hours-showcase');

    if (countArray.length == 0) {
        showCase.classList.add('hidden');
    } else {
        showCase.classList.remove('hidden');
    }

    showCase.innerText = getWeeklyHours(countArray);
}

function addStyles() {
    let styles = document.createElement('style');
    styles.setAttribute('type','text/css');
    styles.innerHTML = `
        .count-this-day .btn-success:not(.btn-rounded) {
            background-color: #5da4b7;
            border-color: #5da4b7;
        }
        .count-this-day .btn-success:not(.btn-rounded):hover,
        .count-this-day .btn-success:not(.btn-rounded):focus,
        .count-this-day .btn-success:not(.btn-rounded):active,
        .count-this-day .btn-success:not(.btn-rounded).active {
            background-color: #518fa0;
            border-color: #518fa0;
        }
        .my-dynamic-exit, .my-dynamic-workhours {
            font-style: italic;
        }
        .total-hours-showcase {
            position: absolute;
            display: flex;
            height: 100%;
            width: 500%;
            font-style: italic;
            right: calc(100% + 20px);
            align-items: center;
            justify-content: flex-end;
        }
        .total-hours-showcase.hidden {
            display: none;
        }
        #MainContent_GridView2_wrapper {
            overflow: auto;
        }
        @media only screen and (min-width: 600px) {
            .total-hours-showcase::before {
                content: 'Total Hours:';
                margin-right: 5px;
            }
        }
    `;

    document.body.appendChild(styles);
}

function showWeekTotal() {
    let spanly = document.createElement('span'),
        ddown = document.querySelector('#MainContent_UpdatePanel1').parentNode.parentNode.children[0].children[1];

    spanly.classList.add('total-hours-showcase', 'hidden');
    spanly.innerText = '';
    ddown.appendChild(spanly);
}

function tryProcess() {
    try {setLatestDay();} catch {}
    try {autoDayHour();} catch {}
    try {whichDaysOnly();} catch {}
}

function hideMidMissed(dir) {
    // this hides the rows for students who missed their midterm exam
    // needs to be clicked to enable.

    if (dir === "enable") {
        let midVal = document.querySelectorAll('#MainContent_GridView1 tbody > tr > td:nth-child(6) > input'),
            print = "";

        for (let x = 0; x < midVal.length; x++) {
            if (midVal[x].value === "") {
                print = print + `#MainContent_GridView1 tbody > tr:nth-child(${x+1}) {display: none;}`;
            }
        }

        if (!document.querySelector('#midmissstyle')) {
            let styleElm = document.createElement('style');
            styleElm.type = "text/css";
            styleElm.id = "midmissstyle";
            styleElm.innerHTML = print;
            document.head.appendChild(styleElm);
        } else {
            document.querySelector('#midmissstyle').innerHTML = print;
        }
    }

    if (dir === "disable") {
        if (document.querySelector('#midmissstyle')) {
            document.querySelector('#midmissstyle').innerHTML = "";
        }
    }
}

function addMidHideButton() {
    document.addEventListener('click', function(e) {
        if (e.target !== document.querySelector('#MainContent_GridView1 thead > tr > th:nth-child(6)')) {
            return;
        }

        if (!sessionStorage.getItem('midclicked') || sessionStorage.getItem('midclicked') !== "enabled") {
            hideMidMissed('enable');
            sessionStorage.setItem('midclicked', 'enabled');
        } else {
            hideMidMissed('disable');
            sessionStorage.setItem('midclicked', 'disabled');
        }
    });
}

if (window.location.href.match(/dashboard/i)) {
    try {addStyles();} catch {}
    try {showWeekTotal();} catch {}
    try {setInterval(tryProcess, 100);} catch {}
}
sessionStorage.removeItem('midclicked');
try {addMidHideButton();} catch {}