// ==UserScript==
// @name         [RED/OPS/DIC] Upload Assistant
// @namespace    https://greasyfork.org/users/321857-anakunda
// @version      1.431
// @description  Accurate filling of new upload/request and group/request edit forms based on foobar2000's playlist selection or web link, offline and online release integrity check, tracklist format customization, featured artists extraction, classical works formatting, online cover art lookup, reporting open requests, form enhancements and more
// @author       Anakunda
// @run-at       document-end
// @copyright    © 2025 Anakunda (https://greasyfork.org/users/321857)
// @license      GPL-3.0-or-later
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA+CAYAAABgFuiwAAAKN2lDQ1BzUkdCIElFQzYxOTY2LTIuMQAAeJydlndUU9kWh8+9N71QkhCKlNBraFICSA29SJEuKjEJEErAkAAiNkRUcERRkaYIMijggKNDkbEiioUBUbHrBBlE1HFwFBuWSWStGd+8ee/Nm98f935rn73P3Wfvfda6AJD8gwXCTFgJgAyhWBTh58WIjYtnYAcBDPAAA2wA4HCzs0IW+EYCmQJ82IxsmRP4F726DiD5+yrTP4zBAP+flLlZIjEAUJiM5/L42VwZF8k4PVecJbdPyZi2NE3OMErOIlmCMlaTc/IsW3z2mWUPOfMyhDwZy3PO4mXw5Nwn4405Er6MkWAZF+cI+LkyviZjg3RJhkDGb+SxGXxONgAoktwu5nNTZGwtY5IoMoIt43kA4EjJX/DSL1jMzxPLD8XOzFouEiSniBkmXFOGjZMTi+HPz03ni8XMMA43jSPiMdiZGVkc4XIAZs/8WRR5bRmyIjvYODk4MG0tbb4o1H9d/JuS93aWXoR/7hlEH/jD9ld+mQ0AsKZltdn6h21pFQBd6wFQu/2HzWAvAIqyvnUOfXEeunxeUsTiLGcrq9zcXEsBn2spL+jv+p8Of0NffM9Svt3v5WF485M4knQxQ143bmZ6pkTEyM7icPkM5p+H+B8H/nUeFhH8JL6IL5RFRMumTCBMlrVbyBOIBZlChkD4n5r4D8P+pNm5lona+BHQllgCpSEaQH4eACgqESAJe2Qr0O99C8ZHA/nNi9GZmJ37z4L+fVe4TP7IFiR/jmNHRDK4ElHO7Jr8WgI0IABFQAPqQBvoAxPABLbAEbgAD+ADAkEoiARxYDHgghSQAUQgFxSAtaAYlIKtYCeoBnWgETSDNnAYdIFj4DQ4By6By2AE3AFSMA6egCnwCsxAEISFyBAVUod0IEPIHLKFWJAb5AMFQxFQHJQIJUNCSAIVQOugUqgcqobqoWboW+godBq6AA1Dt6BRaBL6FXoHIzAJpsFasBFsBbNgTzgIjoQXwcnwMjgfLoK3wJVwA3wQ7oRPw5fgEVgKP4GnEYAQETqiizARFsJGQpF4JAkRIauQEqQCaUDakB6kH7mKSJGnyFsUBkVFMVBMlAvKHxWF4qKWoVahNqOqUQdQnag+1FXUKGoK9RFNRmuizdHO6AB0LDoZnYsuRlegm9Ad6LPoEfQ4+hUGg6FjjDGOGH9MHCYVswKzGbMb0445hRnGjGGmsVisOtYc64oNxXKwYmwxtgp7EHsSewU7jn2DI+J0cLY4X1w8TogrxFXgWnAncFdwE7gZvBLeEO+MD8Xz8MvxZfhGfA9+CD+OnyEoE4wJroRIQiphLaGS0EY4S7hLeEEkEvWITsRwooC4hlhJPEQ8TxwlviVRSGYkNimBJCFtIe0nnSLdIr0gk8lGZA9yPFlM3kJuJp8h3ye/UaAqWCoEKPAUVivUKHQqXFF4pohXNFT0VFysmK9YoXhEcUjxqRJeyUiJrcRRWqVUo3RU6YbStDJV2UY5VDlDebNyi/IF5UcULMWI4kPhUYoo+yhnKGNUhKpPZVO51HXURupZ6jgNQzOmBdBSaaW0b2iDtCkVioqdSrRKnkqNynEVKR2hG9ED6On0Mvph+nX6O1UtVU9Vvuom1TbVK6qv1eaoeajx1UrU2tVG1N6pM9R91NPUt6l3qd/TQGmYaYRr5Grs0Tir8XQObY7LHO6ckjmH59zWhDXNNCM0V2ju0xzQnNbS1vLTytKq0jqj9VSbru2hnaq9Q/uE9qQOVcdNR6CzQ+ekzmOGCsOTkc6oZPQxpnQ1df11Jbr1uoO6M3rGelF6hXrtevf0Cfos/ST9Hfq9+lMGOgYhBgUGrQa3DfGGLMMUw12G/YavjYyNYow2GHUZPTJWMw4wzjduNb5rQjZxN1lm0mByzRRjyjJNM91tetkMNrM3SzGrMRsyh80dzAXmu82HLdAWThZCiwaLG0wS05OZw2xljlrSLYMtCy27LJ9ZGVjFW22z6rf6aG1vnW7daH3HhmITaFNo02Pzq62ZLde2xvbaXPJc37mr53bPfW5nbse322N3055qH2K/wb7X/oODo4PIoc1h0tHAMdGx1vEGi8YKY21mnXdCO3k5rXY65vTW2cFZ7HzY+RcXpkuaS4vLo3nG8/jzGueNueq5clzrXaVuDLdEt71uUnddd457g/sDD30PnkeTx4SnqWeq50HPZ17WXiKvDq/XbGf2SvYpb8Tbz7vEe9CH4hPlU+1z31fPN9m31XfKz95vhd8pf7R/kP82/xsBWgHcgOaAqUDHwJWBfUGkoAVB1UEPgs2CRcE9IXBIYMj2kLvzDecL53eFgtCA0O2h98KMw5aFfR+OCQ8Lrwl/GGETURDRv4C6YMmClgWvIr0iyyLvRJlESaJ6oxWjE6Kbo1/HeMeUx0hjrWJXxl6K04gTxHXHY+Oj45vipxf6LNy5cDzBPqE44foi40V5iy4s1licvvj4EsUlnCVHEtGJMYktie85oZwGzvTSgKW1S6e4bO4u7hOeB28Hb5Lvyi/nTyS5JpUnPUp2Td6ePJninlKR8lTAFlQLnqf6p9alvk4LTduf9ik9Jr09A5eRmHFUSBGmCfsytTPzMoezzLOKs6TLnJftXDYlChI1ZUPZi7K7xTTZz9SAxESyXjKa45ZTk/MmNzr3SJ5ynjBvYLnZ8k3LJ/J9879egVrBXdFboFuwtmB0pefK+lXQqqWrelfrry5aPb7Gb82BtYS1aWt/KLQuLC98uS5mXU+RVtGaorH1futbixWKRcU3NrhsqNuI2ijYOLhp7qaqTR9LeCUXS61LK0rfb+ZuvviVzVeVX33akrRlsMyhbM9WzFbh1uvb3LcdKFcuzy8f2x6yvXMHY0fJjpc7l+y8UGFXUbeLsEuyS1oZXNldZVC1tep9dUr1SI1XTXutZu2m2te7ebuv7PHY01anVVda926vYO/Ner/6zgajhop9mH05+x42Rjf2f836urlJo6m06cN+4X7pgYgDfc2Ozc0tmi1lrXCrpHXyYMLBy994f9Pdxmyrb6e3lx4ChySHHn+b+O31w0GHe4+wjrR9Z/hdbQe1o6QT6lzeOdWV0iXtjusePhp4tLfHpafje8vv9x/TPVZzXOV42QnCiaITn07mn5w+lXXq6enk02O9S3rvnIk9c60vvG/wbNDZ8+d8z53p9+w/ed71/LELzheOXmRd7LrkcKlzwH6g4wf7HzoGHQY7hxyHui87Xe4Znjd84or7ldNXva+euxZw7dLI/JHh61HXb95IuCG9ybv56Fb6ree3c27P3FlzF3235J7SvYr7mvcbfjT9sV3qID0+6j068GDBgztj3LEnP2X/9H686CH5YcWEzkTzI9tHxyZ9Jy8/Xvh4/EnWk5mnxT8r/1z7zOTZd794/DIwFTs1/lz0/NOvm1+ov9j/0u5l73TY9P1XGa9mXpe8UX9z4C3rbf+7mHcTM7nvse8rP5h+6PkY9PHup4xPn34D94Tz+49wZioAAAAJcEhZcwAACxIAAAsSAdLdfvwAAA9/SURBVHiczVoJdFTndb5vmTe7ZiQhhARC0GIn6BizJOAkJtRubBYDKcjEaWwdbHJasH1y0uUkUOy4pydObeO0dRK3TQ05sVGEaTDGMnuQ7XoBXINNLYwRi81i0L7NPm/e2vv/773RrNIMSLRXZzRv3vv/9//fvfe/9/vve7wOoyOLH13sOPjvB8UlG1f5VLd9nOxxVKgl9nEKB7xstzkZlmHJWLqmaYKoxDkVZC4k9gnRRB+HnwNP7wxa9xiN+fCjcZOlP7mvQva5Jn596w+mRJyMJwbK72RdA0VNgK4jHCkGlgJ18sczwNoY4Nwc2MADLvA3zHvp0ainN3pp2U/ua9/7sx291zun6wK2+Kf318arfXWDJXxZiJGbEoko6HENGETBkD/G+maSfQhOXSHwNFAlFSRdhQgDTT0cC/YaO/hr3A988zePBNwdgU8P/v32yzcU2JK/u7ckVFs2d6DCUR2U4o1aPAbEz9DbEAQLOpPePs3dEaROzxjAOZ0zWmgAciwOXUx8W6/DBt4v+1fPf2Fdd8mlvg/2P/1qcMyBLfrnNbM7J3nq+rV4kxYJIRgG+BQwRa9ZxrAiPWRZdE38LasQkIKNATcPlTPHP7Don9ac/sOPXvy4mNsWBWz+5ocXdZSy42OxUCOHM+JwIjQgFHOTEYTeC8HyDIeuqkCnFNgWqvGs/sbmdZVH177wh0LvUxCwpY9/Z1z/9Mo7r/AJuxaJN/Lc6APKFOquxBsQZSwcbjzrtjd8tfHReyvP9r2z7x939I3Uf0RgS5/4bmX3jKq7rkrBJlbUgTNBXY+QgKKbd0k9ziXkCsdxoIty02d8EKQZ4x/AOb2578nfdw83xrDAFm+od/fcMuGujkSwidNodBhTK+UTOiaObVMBvhAHtkHduPuXbKjffWDTrmi+PsMC66+bsKhDDjXxCEpnmOGaFjlRPefxiP1wCjaMnpelwMvc9IqVeKo5X9u8wBZsfnhhh112caIGOgaJ/y9CFGzDPHjJHnPf/sLahUfWbT6Uq11OYAt//tDMK6VMpRZNNHIs93/ifsMKuqUWF5s+89oa7v75gzNbfry1NbNJFrClG+o9XZPcdfF4tJEfA1BZrpdngOHGJTSNKDwWjzZdrvJ97571K8/uf/a1NI6ZBSw0pfy2Pki8zOmQxSDGQvKuMX14lZKrPP7r0qLbyyb778Cf76ReTwO25PFVZd1+rlKX4pQejYUL6iNMONmugKuUg0oytPvsVUseW1V64Kmdg1aLNGChat/MsC5vY2FswnqmdfJZa6RIqad8kwQe1MTtgWrvHZBitSSwe3BtDfhtlaCIVBMjASMWLVR03MLoKTOy+tLzOdIItSpjNNawTY4GQ8ekv6xAV4mzkmDYv2lXJA2YWOG9Kcyp21mlsLUVRQVoBbqVkxMoWaabFewTVeIUZb7+BAyBw2Ef0jcLV8Yx4a0BRvp9dJx7Nv78OA3YoIerUFSVmraQ6c4pnQou3j4iOKKj08GrEFFFagTSZ275NLKVHsbldGrVmJyA1sAXxk2sKznGI7RMURXotbM+6xwFtmR9vSPq4nyMKhfEMBi8+fPzvg/Ty2pBVBLUGtYAmZMlLH3hjifghHQJdBsH0901sPtbG0DBDeYQ9CFA5DeZvN1mhzM9F+HO1x8HxckjSbBaZAMjHsYgOwo4oDQNWFxgfXEb7GCkjHHyCLm1iEoQFQli+GHzKIO0syGBhbgMtkEZpEqG7pxJH1kzgNGuGXPVaCvshmOwompEP5eRU/NFVQIs4WCdf/LEqqp3ntzZSYFF7YxPxW7FpC0yFgFkffIBoxGWtEVqJgziAvYb4yT7MJClTFpaQHZB+xKEEoLjkW0I+WdIrqAXvBzm9To8NIDJTptPLxJYUUJXODpqQgM2pBhasXbNWWtaT8dqeCcwMp4niLncQ1j3Ee1sCflNgakeoVTX9ByDjK5ojJaDURQyormGLZ3kyTS6poHisXnIMX/32oWlwYGQxvnLQFcUKGiRFStkMoxuLqjM+2f+HmbTSSynGk30DMsRj+N4HsKBEL9w7SIfL2ETxcW3kMU3pkI2qUTTzDWOwwzlV2J4yLIcQxIgSA7+YAKzMh+XFB9j54eqKKMoRsAzgFiFgKKHYIzeWfzDJCdpZIK4ucBhrNFcvMfGBfVADKDUiWFFAxKLChFa+CRJVk/PLOnFUT25+Gk6ZowISfsk1xo5ZozAgNcZ3cyFKYQwS+fmMYttVYrQbEhSS1AEN8eFeRwRIWrGmtaNCi1j9cwRhskESYIWOB4EXqA3ZpIJGmh+ovwuhRxaE6OVYfwn8DbgNDZ5jXJTvKeiqUMJeJg6pakr41vLcMmEArqqCbym6TaISem0xbpdnj0h+e4KD4CXc2LulSinI0JAlzq94MCJa8nhTSvSuMGgmyhwNdCDOccAz5gFU1LSK3f5kiBzAUkCNu+VbGeipIRA1sg1jed5Nqb1R5fitX05lJNb8KYPvfevwEfRuqqeDOGiKELTyvWwYOosCCdiwJKCKvECTTFoEgK+EOqCO3dsxByDfVRjUglFhj/ylsPr33sSHIIDLEJP+B8J4UxK8tKZdHfPXDlsTLmb5XiJf2NLy8DE5bMEKZ4AnlZ29SFXzCGWNSXcvkpOFdi4Sl2UsASRV01LWTmZhVA8Av2xQXR/niqAeKBIEpK5+klfkUV6xikpY2hAyhIdkX6kXwlwMh7Q0sw2RK2SkZJuOnH87rCnZcfxIL98/Qq3+8QFiHWFgK8tBz1RIBEm/+w8rWAxcZI58Zs4O2uohawzJxLZo5c/gSvhfnC7PaAQ7bJmeCKuxJlexaFVbFwyaGq0psHDYexLnsa4TFoGJtVKJnnLWtQHWVB7I+CJyITxAk8CUonH2dt5sR/gjytQfemayW85MAawMUS/oKFva2Z+V82BiRU3nziIVmIppbImopmasdxKT0kDMm6dPIITLvVfhVfPHgG30w0qiRBkc2oqXE/pb5qPKkbrCIGb4aRlG1Z6+L2bmiMLH17UKpy9DOp82dBIMUKWGIJjSEVLMjggiXrjbGXwi8M74NDFj8CP1pJZdDAz3INpMSsI4IUkML/TAyLuw/6mZTN0JULg8RiWpv0Y3TBWDlpFK1ft4QZfuffC3k2vRShXtPtc4JegofdsT5N7RjVoJEoWA5AWH3AkwXCTzmAf/Mv7r8BvWw9BicsNCnoZWVtWqTqru3lKQ2sdv9IGP32vCd68egoV4qYKAWJxNru9JQyOLWP+8vTFlXff/OgCOUeB7UGE37x/wYmuIxdAv7W6cEBJXPiHk+Icdvjxsa0QCISgNxqgliLG0EhQY5j0xQ8GfyQf8qCjQ4rAkuZ/gIvBbnRHBfxew8pEYWQtJhMApWUpg5Oo4rKBcqIdxvFCmLhh0mJE/DVlV8rPXV0TPNnxomsEq6XRJH3oN2l9QRoAQWDBx/mMhGtsvtB1GAqCRk0WzMhr8DtynAAFPhf7wO4QwAZ2IM+wgTNBWdNgs61F3RIJBtfaCRU31X5EQJHTSWB7cK0tWH3Hu8cPnAb7l8ajpofyUzFCchWZjETomcwY5WgyGc6YRXJeGqQlWFLj4DCyDdVQWOq+SQaSaSl6D1SKSwDxkw4Yr3ENrnJPxLqUVlf0TSzrn3iuY3X7/lNQsmp2o4IckuGKeyChWdxNIOGcNRJxhuhaSsEzaTjLktmSExQY50gC19+7CJOnTj6299nm5GOlNGB7nt5FHmL/zttd8cPElyaAMB0tF5GMUF2s0LqAFRXSwaVG3tQ6BptGoMGIgvn0ivdkPXaIv38JKkRY45tUmvYgMPuhxPoVjhntAy3Ht34A/Pq7MMnZMWkrxUXJVGENts7kqnsmmzAZ5/U0N8zZEb1BDYnAvH0Bpt02fe+eZ14LpTbJArbv2WZx+cb6jun9k+9p+7d39vv/9lvACCRHqUWDI9saa83Q4k/Gys/eO+vGtmakYdD9WK8TIi+fWDOtzB92j/PKmU1yPh8jLvntjfX/rSXkVW3PvbWz7K//FBhS24vLVFPDg9GNCWYydHNPlgnOYBG6Gf5HAERBGS6Y+J92cJ3q8X76efdL8PaprGZ5n2jufnrX4PLH6t9SDp/588+ebflP/6MLgK3yghYW08AZAPRha36Z4Ky9VNGbdpM6qYNxkHeehNnz6/bA57mfsQ/7DHrPU7sGv/3YvS22Y+dXfPrMoeaSh74GwpyJIEfiRrS7hnWnM4XVpbI7grHD5jmIvnQcpk+tWu6vLhvM13zE1yF2P/XqwLKN9W87Sz1zT245epf4jSldnhW3vqi7OSOJp0a/sRTCBdEFQ1uPf78GBLV27rSje57K/ypSQS+w7MU1t2z9ijaxP/Jh9WeBdT0/OwSu5beAfe5kpEsYwcja0/QhUjvagsGCQz4b2XnyQW9bv+/CpZ7n4fj5YbsU/MqRlfzm/Nnc7V1n2k+d23VyXuC/zscdd970a2Em8kuvDbcuCt3sJfNW2n4eiltPlpigogfaGpwffFHef7nvV4V0K/olsb2YL5ZtWNH6YfOxI7fWzVp66ZXWHwV2n1RtcyY/50CA3CQ/MB7eCA7k/RDVrP6SE2qOZJZPzOKSAepMg/2N8xWDVwZ+UWj3a3qtj+zhyHftnKnvnTz08b6vrJx3e9fZznX9Ry76FI+QYKpKfsnXlAKHUZQvc9NaH2A0Y9CqBbmqblR5OI8Doq98vNp+9PL4QPvgc8XM8bpexLSyfdXN1a1VX550iqzFufO/dlugfQCCx67+QFFULq6oPDJinp1Stkl45OsjE2vN2Kpwgg2CLx77C8/pnvLBIkERGZVXZy0LEqmcNuHTCTdPLEPWoe41gS/8y7vLuuzsnssce5qVlfxWQ1clbB1iCgSefwsqIpq980p/we6XKqMCLFVSQVpyaEvLwK1/tbgio0I4JOYaZH1OUM71QWTLUaitLH+wrn5GMzzz2jXNY9SB5RNkJbm5GEn0do4+KYntawPlQBvcMvemRbWzpn6IOTSUs08BcsOAZYmZ91iye2gPQ2Db8Ue83THnvBW3NXnLvYnrAUXkxgMz3Y5x2YC8ehHbdwakg6dh6rSJkfPtV/8DtrwxKsPcOGA62esjiUW3Y9HtpNZOiL1+Evyi/sPZS76yv3xS+SC8f3bUhrthwFielUle0s70QPhA21r+XG9p3VenfVIzs/bdfZua874peq1yw4Bp0YQz8OvDIKClptw8MX6+L7xl+awpJZgLRx0UkRsGzBWWtGlxtqHmvttfd/lxa4Bul7mdH025YcA+2H74E9zbtWO0y8pzYyH/C38GEwO0/dZWAAAAAElFTkSuQmCC
// @match        https://redacted.ch/upload.php*
// @match        https://redacted.ch/torrents.php?action=editgroup&*
// @match        https://redacted.ch/torrents.php?action=edit&*
// @match        https://redacted.ch/requests.php?action=new*
// @match        https://redacted.ch/requests.php?action=edit*
// @match        https://redacted.sh/upload.php*
// @match        https://redacted.sh/torrents.php?action=editgroup&*
// @match        https://redacted.sh/torrents.php?action=edit&*
// @match        https://redacted.sh/requests.php?action=new*
// @match        https://redacted.sh/requests.php?action=edit*
// @match        https://notwhat.cd/upload.php*
// @match        https://notwhat.cd/torrents.php?action=editgroup&*
// @match        https://notwhat.cd/torrents.php?action=edit&*
// @match        https://notwhat.cd/requests.php?action=new*
// @match        https://notwhat.cd/requests.php?action=edit*
// @match        https://orpheus.network/upload.php*
// @match        https://orpheus.network/torrents.php?action=editgroup&*
// @match        https://orpheus.network/torrents.php?action=edit&*
// @match        https://orpheus.network/requests.php?action=new*
// @match        https://orpheus.network/requests.php?action=edit*
// @match        https://dicmusic.com/upload.php*
// @match        https://dicmusic.com/torrents.php?action=editgroup&*
// @match        https://dicmusic.com/torrents.php?action=edit&*
// @match        https://dicmusic.com/requests.php?action=new*
// @match        https://dicmusic.com/requests.php?action=edit*
// @match        https://dicmusic.club/upload.php*
// @match        https://dicmusic.club/torrents.php?action=editgroup&*
// @match        https://dicmusic.club/torrents.php?action=edit&*
// @match        https://dicmusic.club/requests.php?action=new*
// @match        https://dicmusic.club/requests.php?action=edit*
// @connect      file://*
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/bencode-js.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/libLocks.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/xhrLib.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/gazelleApiLib.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/progressBars.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/imageHostUploader.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/QobuzLib.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/GazelleTagManager.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/langCodes.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/libStringDistance.min.js
// @downloadURL https://update.greasyfork.org/scripts/389583/%5BREDOPSDIC%5D%20Upload%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/389583/%5BREDOPSDIC%5D%20Upload%20Assistant.meta.js
// ==/UserScript==

// Additional setup: to work, set the pattern below as built-in foobar2000 copy command or custom Text Tools plugin quick copy command
//   $replace($replace([%album artist%]$char(30)[%album%]$char(30)[$if3(%date%,%ORIGINAL RELEASE DATE%,%year%)]$char(30)[$if3(%releasedate%,%retail date%,%date%,%year%)]$char(30)[$if2(%label%,%publisher%)]$char(30)[$if3(%catalog%,%CATALOGNUMBER%,%CATALOG NUMBER%,%labelno%,%catalog #%,%SKU%)]$char(30)[$if2(%country%,%RELEASECOUNTRY%)]$char(30)%__encoding%$char(30)%__codec%$char(30)[%__codec_profile%]$char(30)[%__bitrate%]$char(30)[%__bitspersample%]$char(30)[%__samplerate%]$char(30)[%__channels%]$char(30)[%__channel_mode%]$char(30)[$if3(%media%,%format%,%source%,%MEDIATYPE%,%SOURCEMEDIA%,%discogs_format%)]$char(30)[%genre%[|%style%]]$char(30)[%discnumber%]$char(30)[$if2(%totaldiscs%,%disctotal%)]$char(30)[%discsubtitle%]$char(30)[%track number%]$char(30)[$if2(%totaltracks%,%TRACKTOTAL%)]$char(30)[%title%]$char(30)[%track artist%]$char(30)[$if($strcmp(%performer%,%artist%),,%performer%)]$char(30)[$if3(%composer%,%writer%,%SONGWRITER%,%author%,%LYRICIST%)]$char(30)[%conductor%]$char(30)[%remixer%]$char(30)[$if2(%compiler%,%mixer%)]$char(30)[$if2(%producer%,%producedby%)]$char(30)[%length_seconds_fp%]$char(30)[%length_samples%]$char(30)[%filesize%]$char(30)[%replaygain_album_gain%]$char(30)[%replaygain_album_peak%]$char(30)[%replaygain_track_gain%]$char(30)[%replaygain_track_peak%]$char(30)[%album dynamic range%]$char(30)[%dynamic range%]$char(30)[%__tool%][ | $if2(%MQAENCODER%,%ENCODER%)][ | %ENCODER_OPTIONS%]$char(30)[$if2(%url%,%www%)]$char(30)[$directory_path(%path%)]$char(30)[$filename(%path%).$ext(%path%)]$char(30)[$if2(%comment%,%description%)]$char(30)$trim([BARCODE=$trim($replace($if3(%barcode%,%MCN%,%ICPN%), ,)) ][UPC=$trim($replace($if3(%UPC%,%UPC-A%,%UPCA%), ,)) ][UPC-E=$trim($replace($if2(%UPC-E%,%UPCE%), ,)) ][EAN=$trim($replace($if3(%EAN%,%EAN-13%,%EAN13%), ,)) ][IAN=$trim($replace($if3(%IAN%,%GTIN%,%GTIN-13%), ,)) ][EAN-8=$trim($replace($if2(%EAN-8%,%EAN8%), ,)) ][DISCID=$trim(%DISCID%) ][ASIN=$trim(%ASIN%) ][ISRC=$trim(%ISRC%) ][ISWC=$trim(%ISWC%) ][DISCOGS_ID=$trim(%discogs_release_id%) ][MBID=$trim(%MUSICBRAINZ_ALBUMID%) ][ACCURATERIPCRC=$trim(%ACCURATERIPCRC%) ][ACCURATERIPDISCID=$trim(%ACCURATERIPDISCID%) ][ACCURATERIPID=$trim(%ACCURATERIPID%) ][SOURCEID=$trim($replace(%SOURCEID%, ,_)) ][CT_TOC=$trim(%CDTOC%) ][ITUNES_TOC=$trim(%ITUNES_CDDB_1%) ][RELEASETYPE=$replace($if2(%RELEASETYPE%,%RELEASE TYPE%), ,_) ][COMPILATION=$trim(%compilation%) ][EXPLICIT=$trim($if2(%ITUNESADVISORY%,%EXPLICIT%)) ]SCENE=$if($and(%ENCODER%,%LANGUAGE%,%MEDIA%,%PUBLISHER%,%RELEASE TYPE%,%RETAIL DATE%,%RIP DATE%,%RIPPING TOOL%),1,0) [LANGUAGE=$trim($replace(%LANGUAGE%, ,_)) ][ORIGINALFORMAT=$trim($replace(%ORIGINALFORMAT%, ,_)) ][BPM=$trim(%BPM%) ][MD5=$info(md5)])$char(30)[$if3(%lyrics%,%unsynced lyrics%,%UNSYNCEDLYRICS%,%SYNCEDLYRICS%)],$char(13),$char(29)),$char(10),$char(28))
//
// As alternative to pasted playlist, e.g. requests creation, valid URL to page on supported web can be used.
// List of supported domains:
//
// For music releases:
// - qobuz.com
// - highresaudio.com
// - bandcamp.com
// - prestomusic.com
// - discogs.com
// - supraphonline.cz
// - bontonland.cz
// - nativedsd.com
// - junodownload.com
// - hdtracks.com
// - deezer.com
// - spotify.com
// - prostudiomasters.com
// - 7digital.com
// - e-onkyo.com
// - acousticsounds.com
// - indies.eu
// - beatport.com
// - traxsource.com
// - musicbrainz.org
// - music.apple.com
// - vgmdb.net
// - tidal.com
// - ototoy.jp
// - music.yandex.ru
// - mora.jp
// - allmusic.com
// - bleep.com
// - boomkat.com
// - ecmrecords.com
// - actmusic.com
// - jpc.de
// - store.pias.com
// - dominomusic.com
// - kompakt.fm
// - eclassical.com
// - qq.com
// - muziekweb.nl
// - beatsource.com
// - music.163.com
// - extrememusic.com
// - rateyourmusic.com
// - recochoku.jp
// - music.youtube.com
// - music.amazon.com
// - kuwo.cn
// - melon.com
// - genie.co.kr
// - music-flo.com
// - kugou.com
// - music.bugs.co.kr
// - joox.com (defunct/removed)
// - soundcloud.com
//
// For e-bbook releases:
// - martinus.cz, martinus.sk
// - goodreads.com
// - databazeknih.cz
// - boomkat.com
// - openlibrary.org
// - books.google.com
// - play.google.com (books)
// - alza.cz, alza.sk
//
// For application releases:
// - sanet.st

'use strict';

Array.prototype.includesCaseless = function(str) {
	if (typeof str != 'string') return false;
	str = str.toLowerCase();
	return this.some(elem => typeof elem == 'string' && elem.toLowerCase() == str);
};
Array.prototype.pushUnique = function(...items) {
	if (Array.isArray(items) && items.length > 0) items.forEach(it => { if (!this.includes(it)) this.push(it) });
	return this.length;
};
Array.prototype.pushUniqueCaseless = function(...items) {
	if (Array.isArray(items) && items.length > 0) items.forEach(it => { if (!this.includesCaseless(it)) this.push(it) });
	return this.length;
};
// Array.prototype.getUnique = function(prop) {
//   return this.every((it) => it[prop] && it[prop] == this[0][prop]) ? this[0][prop] : null;
// };
Array.prototype.equalTo = function(arr) {
	return Array.isArray(arr) && arr.length == this.length
		&& Array.from(arr).sort().toString() == Array.from(this).sort().toString();
};
Array.prototype.equalCaselessTo = function(arr) {
	function adjust(elem) { return typeof elem == 'string' ? elem.toLowerCase() : elem }
	return Array.isArray(arr) && arr.length == this.length
		&& arr.map(adjust).sort().toString() == this.map(adjust).sort().toString();
};
Array.prototype.homogeneous = function() {
	return this.every(elem => elem === this[0]);
}
Array.prototype.distinctValues = function() {
	return this.filter((elem, index, arrRef) => arrRef.indexOf(elem) == index);
};

String.prototype.trueLength = function() {
	return this.normalize('NFC').length;
	//   var index = 0, width = 0, len = 0;
	//   while (index < this.length) {
	// 	var point = this.codePointAt(index);
	// 	width = 0;
	// 	while (point) {
	// 	  ++width;
	// 	  point = point >> 8;
	// 	}
	// 	index += Math.round(width / 2);
	// 	++len;
	//   }
	//   return len;
};
String.prototype.flatten = function() {
	return this.replace(/\n/g, '\x1C').replace(/\r/g, '\x1D');
};
String.prototype.expand = function() {
	return this.replace(/\x1D/g, '\r').replace(/\x1C/g, '\n');
};
String.prototype.titleCase = function() {
	return this.toLowerCase().split(' ').map(x => x[0].toUpperCase() + x.slice(1)).join(' ');
};
String.prototype.collapseGaps = function() {
	return this.replace(/(?:[ \t\xA0]*\r?\n){3,}/g, '\n\n').replace(/\[(\w+)\]\[\/\1\]/ig, '').trim();
};
String.prototype.consolidateWhitespace = function() {
	return this.replace(/\s+/ig, ' ');
};
String.prototype.properTitleCase = function(langCode = 'en') {
	if (![this.toUpperCase(), this.toLowerCase()].some(str => this == str)) {
		if (langCode) langCode = langCode.toLowerCase(); else return this;
		if (Array.isArray(caseFixes[langCode]))
			return caseFixes[langCode].reduce((result, replacer) => result.replace(...replacer), this);
		console.warn('String.prototype.properTitleCase() called with invalid language id:', langCode);
	}
	return this;
};
// phpBB extensions
String.prototype.phpBB = function(tag) {
	return tag ? '[' + tag + ']' + this + '[/' + tag.replace(/=.*$/, '') + ']' : this;
};
String.prototype.bbBold = function() { return this.phpBB('b') };
String.prototype.bbItalic = function() { return this.phpBB('i') };
String.prototype.bbUnderline = function() { return this.phpBB('u') };
String.prototype.bbCode = function() { return this.phpBB('code') };
String.prototype.bbPre = function() { return this.phpBB('pre') };
String.prototype.bbSize = function(size) { return size ? this.phpBB('size=' + size) : this };
String.prototype.bbAlign = function(alignment) { return alignment ? this.phpBB('align=' + alignment) : this };
String.prototype.bbColor = function(color) { return color ? this.phpBB('color=' + color) : this };
String.prototype.bbArtist = function() { return this.phpBB('artist') };
String.prototype.bbPad = function(padding) { return padding && isRED ? this.phpBB('pad=' + padding) : this };
String.prototype.bbPlain = function() { return this.phpBB('plain') };
String.prototype.bbHide = function(caption = undefined) {
	return caption ? this.phpBB('hide=' + caption) : this.phpBB('hide');
};
String.prototype.bbQuote = function(caption = undefined) {
	return caption ? this.phpBB('quote=' + caption) : this.phpBB('quote');
};
String.prototype.bbImg = function() { return httpParser.test(this) ? this.phpBB('img') : this };
String.prototype.bbUrl = function(url = undefined) {
	return url && httpParser.test(url) ? this.phpBB('url=' + url) : httpParser.test(this) ? this.phpBB('url') : this;
};

Date.prototype.getDateValue = function() {
	return Math.floor((this.getTime() / 1000 / 60 - this.getTimezoneOffset()) / 60 / 24);
};
Date.prototype.isExactDate = function() {
	return this.getUTCMilliseconds() > 0 || this.getUTCSeconds() > 0 || this.getUTCMinutes() > 0 || this.getUTCHours() > 0
		|| this.getUTCDate() > 1 || this.getUTCMonth() > 0;
};
Date.prototype.toUTCDateString = function(useWeekDay = true) {
	if (isNaN(this)) return NaN;
	const components = [this.toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric' })];
	// if (this.getUTCMonth() > 0 || this.getUTCDate() > 1 || this.getUTCHours() > 0
	// 		|| this.getUTCMinutes() > 0 || this.getUTCSeconds() > 0 || this.getUTCMilliseconds() > 0) {
		components.unshift(this.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short' }),
			this.toLocaleDateString('en-US', { timeZone: 'UTC', day: '2-digit' }));
		if (useWeekDay) components.unshift(this.toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'short' }));
	// }
	return components.join(' ');
};

class HTML extends String { };

const isFirefox = /\b(?:Firefox)\b/.test(navigator.userAgent) || Boolean(window.InstallTrigger);
const testDomain = domain => document.location.hostname.toLowerCase() == domain.toLowerCase();
const testPath = path => document.location.pathname.toLowerCase() == `/${path}.php`.toLowerCase();

const isRED = testDomain('redacted.ch') || testDomain('redacted.sh');
const isOPS = testDomain('orpheus.network');
const isNWCD = testDomain('notwhat.cd');
const isDIC = testDomain('dicmusic.com') || testDomain('dicmusic.club');

const urlParams = new URLSearchParams(document.location.search);

function hasStyleSheet(name) {
	if (name) name = name.toLowerCase(); else throw 'Invalid argument';
	const hrefRx = new RegExp('\\/' + name + '\\b', 'i');
	if (document.styleSheets) for (let styleSheet of document.styleSheets)
		if (styleSheet.title && styleSheet.title.toLowerCase() == name) return true;
			else if (styleSheet.href && hrefRx.test(styleSheet.href)) return true;
	return false;
}
const isLightTheme = ['postmod', 'shiro', 'layer_cake', 'proton', 'red_light', '2iUn3'].some(hasStyleSheet);
if (isLightTheme) console.log('Light Gazelle theme detected');
const isDarkTheme = ['kuro', 'minimal', 'red_dark', 'Vinyl'].some(hasStyleSheet);
if (isDarkTheme) console.log('Dark Gazelle theme detected');

const isUpload = testPath('upload');
const isAddFormat = isUpload && parseInt(urlParams.get('groupid')) > 0;
const isGroupEdit = testPath('torrents') && urlParams.get('action') == 'editgroup';
const isTorrentEdit = testPath('torrents') && urlParams.get('action') == 'edit';
const isRequestNew = testPath('requests') && urlParams.get('action') == 'new';
const isRequestFormat = isRequestNew && parseInt(urlParams.get('groupid')) > 0;
const isRequestEdit = testPath('requests') && urlParams.get('action') == 'edit';

const discogsOrigin = 'https://www.discogs.com';
const dcRlsParser = /^(?:https?):\/\/(?:\w+\.)*discogs\.com\/releases?\/(\d+)(?=$|\/|\?)/i;
const mbrRlsPrefix = 'https://musicbrainz.org/release/';
const mbrRlsParser = /^(?:https?):\/\/(?:beta\.)?musicbrainz\.org\/(?:\w+\/)*release\/([\w\%\-]+)/i;
const amEntityParser = /^(?:https?):\/\/(?:[\w\%\-]+\.)*apple\.com\/(?:\S+\/)?(album|artist|playlist)\/(?:[\w\%\-]+\/)?(?:id)?(\d+)\b/i;
const deezerAlbumPrefix = 'https://www.deezer.com/album/';
const dzrEntityParser = /^(?:https?):\/\/(?:[\w\%\-]+\.)*deezer\.com\/(?:\S+\/)?(album|artist|track|comment|playlist|radio|user)\/(\d+)\b/i;
const hyphenCoupling = /[\w\(\)\[\]\{\}]-\s/;
const imageExtensions = ['jpg', 'jpeg', 'jfif', 'png', 'gif', 'bmp', 'webp', 'tif', 'tiff', 'heic'];
const ctxt = document.createElement('canvas').getContext('2d');
const UA = 'Upload Assistant/1.0 (Windows NT 10.0; Win64; x64)';
const fb2kFormat = '$replace($replace([%album artist%]$char(30)[%album%]$char(30)[$if3(%date%,%ORIGINAL RELEASE DATE%,%year%)]$char(30)[$if3(%releasedate%,%retail date%,%date%,%year%)]$char(30)[$if2(%label%,%publisher%)]$char(30)[$if3(%catalog%,%CATALOGNUMBER%,%CATALOG NUMBER%,%labelno%,%catalog #%,%SKU%)]$char(30)[$if2(%country%,%RELEASECOUNTRY%)]$char(30)%__encoding%$char(30)%__codec%$char(30)[%__codec_profile%]$char(30)[%__bitrate%]$char(30)[%__bitspersample%]$char(30)[%__samplerate%]$char(30)[%__channels%]$char(30)[%__channel_mode%]$char(30)[$if3(%media%,%format%,%source%,%MEDIATYPE%,%SOURCEMEDIA%,%discogs_format%)]$char(30)[%genre%[|%style%]]$char(30)[%discnumber%]$char(30)[$if2(%totaldiscs%,%disctotal%)]$char(30)[%discsubtitle%]$char(30)[%track number%]$char(30)[$if2(%totaltracks%,%TRACKTOTAL%)]$char(30)[%title%]$char(30)[%track artist%]$char(30)[$if($strcmp(%performer%,%artist%),,%performer%)]$char(30)[$if3(%composer%,%writer%,%SONGWRITER%,%author%,%LYRICIST%)]$char(30)[%conductor%]$char(30)[%remixer%]$char(30)[$if2(%compiler%,%mixer%)]$char(30)[$if2(%producer%,%producedby%)]$char(30)[%length_seconds_fp%]$char(30)[%length_samples%]$char(30)[%filesize%]$char(30)[%replaygain_album_gain%]$char(30)[%replaygain_album_peak%]$char(30)[%replaygain_track_gain%]$char(30)[%replaygain_track_peak%]$char(30)[%album dynamic range%]$char(30)[%dynamic range%]$char(30)[%__tool%][ | $if2(%MQAENCODER%,%ENCODER%)][ | %ENCODER_OPTIONS%]$char(30)[$if2(%url%,%www%)]$char(30)[$directory_path(%path%)]$char(30)[$filename(%path%).$ext(%path%)]$char(30)[$if2(%comment%,%description%)]$char(30)$trim([BARCODE=$trim($replace($if3(%barcode%,%MCN%,%ICPN%), ,)) ][UPC=$trim($replace($if3(%UPC%,%UPC-A%,%UPCA%), ,)) ][UPC-E=$trim($replace($if2(%UPC-E%,%UPCE%), ,)) ][EAN=$trim($replace($if3(%EAN%,%EAN-13%,%EAN13%), ,)) ][IAN=$trim($replace($if3(%IAN%,%GTIN%,%GTIN-13%), ,)) ][EAN-8=$trim($replace($if2(%EAN-8%,%EAN8%), ,)) ][DISCID=$trim(%DISCID%) ][ASIN=$trim(%ASIN%) ][ISRC=$trim(%ISRC%) ][ISWC=$trim(%ISWC%) ][DISCOGS_ID=$trim(%discogs_release_id%) ][MBID=$trim(%MUSICBRAINZ_ALBUMID%) ][ACCURATERIPCRC=$trim(%ACCURATERIPCRC%) ][ACCURATERIPDISCID=$trim(%ACCURATERIPDISCID%) ][ACCURATERIPID=$trim(%ACCURATERIPID%) ][SOURCEID=$trim($replace(%SOURCEID%, ,_)) ][CT_TOC=$trim(%CDTOC%) ][ITUNES_TOC=$trim(%ITUNES_CDDB_1%) ][RELEASETYPE=$replace($if2(%RELEASETYPE%,%RELEASE TYPE%), ,_) ][COMPILATION=$trim(%compilation%) ][EXPLICIT=$trim($if2(%ITUNESADVISORY%,%EXPLICIT%)) ]SCENE=$if($and(%ENCODER%,%LANGUAGE%,%MEDIA%,%PUBLISHER%,%RELEASE TYPE%,%RETAIL DATE%,%RIP DATE%,%RIPPING TOOL%),1,0) [LANGUAGE=$trim($replace(%LANGUAGE%, ,_)) ][ORIGINALFORMAT=$trim($replace(%ORIGINALFORMAT%, ,_)) ][BPM=$trim(%BPM%) ][MD5=$info(md5)])$char(30)[$if3(%lyrics%,%unsynced lyrics%,%UNSYNCEDLYRICS%,%SYNCEDLYRICS%)],$char(13),$char(29)),$char(10),$char(28))';
const maxPathLen = 180;
const tzOffset = new Date().getTimezoneOffset() * 60 * 1000;
const oAuth2timeReserve = 30; // reserve this time (s) for upcoming authorized request
const category = document.getElementById('categories');
const selectedCategoryName = () => category != null && category.selectedIndex in category ?
	category[category.selectedIndex].text : undefined;
const isSelectedCategory = (...categoryNames) => category != null
	&& categoryNames.includes(selectedCategoryName());

const prefs = {
	autfill_delay: 1000, // delay in ms to autofill form after pasting text into box, 0 to disable
	clean_on_apply: false, // clean the input box on successfull fill
	cleanup_descriptions: true, // pre-submit cleanup to all description fields (remove empty placeholders, redundant info and garbage like empty tag pairs etc.)
	care_cd_extras: true, // if uploading a CD rip, check before submit if .LOG file is attached and present in .torrent file
	check_cd_log: true, // if uploading a CD rip, check log score at runtime when attached
	fix_capitalization: true, // properly fix capitalization (turn off if improperly capitalizing non-english titles)
	keep_meaningles_composers: false, // keep composers from file tags also for non-composer emphasing genres
	include_all_performers: false, // include to album guests all named performers
	default_medium: '', // preset this media type if it can't be deduced from metadata (Gazelle-compatible names as they appear in dropdown, empty string to not use)
	single_threshold: 10 * 60, // For autodetection of release type: max length of single in s
	EP_threshold: 26 * 60, // For autodetection of release type: max time of EP in s
	anthology_time_threshold: 120 * 60, // For autodetection of release type: threshold time in s to consider single artist release anthology
	anthology_tracks_threshold: 20, // For autodetection of release type: tracklist length to consider single artist release anthology
	auto_rehost_cover: true, // PTPimg / using 3rd party script
	auto_preview_cover: true,
	image_size_warning: 2048, // threshold in KiB for making cover size warning // 0 to disable
	image_size_reduce_threshold: 4096, // threshold in KiB for attempt to reduce cover size // 0 to disable
	validate_torrent: true, // auto validate .torrent file added to upload form (path lengths, presence of rejectable files etc.)
	auto_fill_by_torrent_name: true, // try to lookup torrent description online and fill upload form accordingly (for now only supported category is e-books)
	auto_fill_by_torrent_name_greediness: 1, // 0: accept only unique of results closely matching torrent name; 1: accept most relevant of results closely matching torrent name; 2: accept highest ranked of matching titles, or first if none matches; 3. take most similar title of anything returned, whatever low similarity
	auto_fill_by_torrent_name_min_similarity: 0.87,
	torrent_input_highlight_color: 'lawngreen', // highlight color of torrent input control on drag over, set to undefined to disable
	cover_lookup_providers: 'all', // itunes/lastfm/deezer/musicbrainz/qobuz/tidal/discogs in specific order or 'all' for all | empty for no lookup
	metadata_lookup_providers: 'all',
	store_lookup_providers: 'all',
	ignored_store_lookup_providers: '',
	fetch_tags_from_artist: 0, // add N most used tags from release artist (if one) - experimental/may inject nonsense tags for coinciding artists; 0 for disable
	estimate_decade_tag: true, // deduce decade tag (1980s, etc.) from album year for regular albums
	check_whitespace: true, // check tags for leading/trailing spaces and unreadable characters
	assume_rg: true, // do a reminder on missing RG info; on by default
	assume_dr: false, // do a reminder on missing DR info (only for Hi-Res tracks); off by default
	assume_weblink: false, // do a reminder on missing source URL (tag URL); off by default
	sacd_decoder: 'foobar2000\'s SACD decoder (DSD2PCM direct / 64fp / 30kHz lowpass)',
	use_store_logos: false, // use online source's pictograms instead of textual form (if defined) // some logos may conflict with some stylesheets (visibility problems)
	use_store_names: true, // use online source's friendly in place of source link (if defined)
	insert_release_date: true, // ..to rls description
	selfrelease_label: 'self-released',
	upcoming_tags: '', // add this tag(s) to upcoming releases (requests); empty to disable
	remap_texttools_newlines: false, // convert underscores to linebreaks (ambiguous)
	messages_verbosity: 0,
	find_relations: true, // notify about existing torrents and requests of the same release
	relations_check_interval: 0, // check for relations periodically after intervals (in s) / 0 = OFF
	check_site_logs: true, // search site log for deleted uploads of the same release / not working on Orpheus
	check_for_cd_duplicity: true,
	clone_submit_button: true,
	focus_to_form: true,
	reorder_upload_fields: true, // move release type in fornt of initial year; YADG-aware
	no_multiformat: false,
	ops_always_edition: true, // (only new uploads) don't use original release but always specific edition (unify with other trackers)
	add_spectrals_template: true,
	yadg_auto_next_scraper: false,
	yadg_no_autosearch: ['beatport', 'musicbrainz', 'discogs'],
	// online parsers specific
	apple_use_release_cover: true, // usually smaller version of search result cover
	apple_get_png_cover: false,
	deezer_get_png_cover: false,
	deezer_jpeg_quality: 100,
	deezer_highest_resolution: 1500,
	deezer_explore_resolutions: true,
	use_kana: false, // include Kana(JP) version in artist/title names; applies to mora.jp online parser
	// online service credentials
	discogs_key: 'OrFLNXqtEcdKLEicmywE',
	discogs_secret: 'mveXGdQOjbhPuLXEajOzrwRgQPpRFlUc',
	//discogs_token: '',
	spotify_clientid: '6d358a207c634b1ebac640149a6090da',
	spotify_clientsecret: '4c59880a4ec241ed9c89a24e66468c64',
	lastfm_api_key: 'b9f26370d7266fbb3151b2ad4f7a74c9',
	qobuz_userid: '', // e-mail
	qobuz_userpassword: '',
	hra_userid: '', // e-mail
	hra_userpassword: '',
	deezer_arl: 'c79bdcf2fc03b9c45f8229a36049189588071e0ba9f8399b2ae995ca992810355fb9773eb2f1ab7c1b50d846dd05fce31adae3a491596d8a2bc9fe56d5e6f2a0803685767614085e3d26f27415d593fe8763f2048df265b59a2ee5e3490485df',
	// request specific
	request_prefill_formats: false,
	request_default_bounty: 0, // set this bounty in MB after successfull fill of request form / 0 for disable
	new_request_defaults: { media: [ ], formats: [ ], bitrates: [ ] },
	include_tracklist_in_request: false, // false: include one line summary only; true: include full tracklisting
	bounty_presets: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(x => x * 100).concat([
		1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
		25, 30, 35, 40, 45, 50, //60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200,
	].map(x => x * 2**10)),
	// tracklist specific
	tracklist_style: 1, // 1: classic with components colouring, 2: propertional font right-justified, 3: classic center aligned
	tracklist_title: 'Tracklist',
	colorless_tracklist: true, // Strip all colours from tracklist
	sort_tracklist: true,
	singles_conventional_format: false, // force one track singles to be formatted same way as albums with numbered tracklist
	reformat_trackartist: true, // (if track artist differs from main artist) rebuild track artist from partial track artists, turn off if generating wrong track artists
	max_tracklist_width: 80, // right margin of the right aligned tracklist. should not exceed the group description width on any device
	title_separator: '. ', // divisor of track# and title
	pad_leader: ' ',
	bpm_summary: true,
	include_lyrics: true,
	tracklist_head_color: null, // #778899, #4682B4, #a7bdd0
	tracklist_disctitle_color: null, // '#909090', '#4d7772', '#2bb7b7', #bb831c
	tracklist_work_color: '#448980', // '#808000', #b16890
	tracklist_tracknumber_color: '#8899AA',
	tracklist_artist_color: '#9b7d00',
	tracklist_composer_color: '#53813e',
	tracklist_duration_color: '#007ab7', // #2196f3
	// online check paramaters
	check_integrity_online: true, // If provided URL tag, compare local release with release online and lookup for discrepancies
	strict_online_check: false, // set to true for strict online check (metadata comparison is case sensitive)
	album_length_divergences: '[0.75, 0.01, 2.50]', // online check: tolerated album length divergences in % (for times in s / for times in ms / for vinyl)
	track_length_divergences: '[2.5, 0.1, 5.0]', // online check: tolerated track length divergences in s (for times in s / for times in ms / for vinyl)
	diag_mode: false,
};
if (GM_getValue('check_logs') != undefined) GM_deleteValue('check_logs');
for (let key in prefs) prefs[key] = GM_getValue(key, prefs[key]);
// ['image_size_warning', 'image_size_reduce_threshold']
// 	.forEach(itemProp => { if (prefs[itemProp] < 8) prefs[itemProp] *= 2**10 });

const itunesImageMax = [/\/(\d+x\d+)\w*\.(\w+)$/, '/100000x100000-999.' + (prefs.apple_get_png_cover ? 'png' : '$2')];
const dzrImageMax = prefs.deezer_get_png_cover ? [/\/(\d+x\d+)(?:\-\d+)*\.\w+$/, '/1400x1400.png']
	: [/\/(\d+x\d+)(?:\-\d+)*(?=\.\w+$)/, '/1400x1400-000000-' + (parseInt(prefs.deezer_jpeg_quality) || 100) + '-0-0'];
const caseFixes = {
	en: [
		/*[
			/\b(\w+)\b/g, match => match[0].toUpperCase() + match.slice(1).toLowerCase()
		], */[
			new RegExp(`(\\w+|[\\,\\)\\]\\}]) +(${[
				'A', 'After', /*'Along', */'An', 'And A', 'And In', 'And The', 'And', /*'Around', */'As A', 'As An', 'As',
				'At A', 'At The', 'At', /*'But', */'By A', 'By An', 'By The', 'By', 'For A', 'For An', 'For The', 'For',
				'From A', 'From The', 'From', 'If', 'In A', 'In A', 'In An', 'In An', 'In The', 'In To', 'In', 'Into',
				'Nor', 'Not', 'Of A', 'Of A', 'Of An', 'Of The', 'Of', 'Off', 'On A', 'On An', 'On The', 'On', 'Onto',
				'Or The', 'Or', 'Out Of A', 'Out Of The', 'Out Of', 'Out', 'Over', /*'So', */'The', 'To A', 'To An',
				'To The', 'To', 'Vs', 'With A', 'With The', 'With', 'Without', 'Yet',
			].join('|')})(?=\\s+)`, 'g'), (match, preWord, shortWord) => preWord + ' ' + shortWord.toLowerCase(),
		], [
			/, +(So|But)\b(?!$)/g, (match, shortWord) => ', ' + shortWord.toLowerCase()
		], [
			new RegExp(`(^|\\s)(${['by', 'in', 'of', 'on', 'or', 'to', 'for', 'out', 'into', 'from', 'with'].join('|')})$`, 'g'),
			(match, prefix, shortWord) => prefix + shortWord[0].toUpperCase() + shortWord.slice(1).toLowerCase(),
		],
		[/([\-\:\&\;]) +(the|a|an)(?=\s+)/g, (match, sym, article) => sym + ' ' + article[0].toUpperCase() + article.slice(1).toLowerCase()],
		[/\b(?:Best +of)\b/g, 'Best Of'],
	],
};
const torrentStats = { };
const form = ['form.create_form', 'form.edit_form', 'form#request_form']
	.reduce((elem, selector) => elem || document.body.querySelector(selector), null);
console.assert(form != null);

let ref, uaData = null, autoFill, releaseTypes, artistTypes, discTotal, bpAccessToken = null;
let dzApiTimeFrame = { }, relationsCheckTimer = null, tfMessages = [ ];
let logsWatcher = null, damageControlWatcher = null, torrentInputWatcher = null, yadgResponseWatcher = null;
let scdAPI = null, groupTorrents = null, scdMessages = null;
try {	var siteArtistsCache = JSON.parse(sessionStorage.siteArtistsCache) } catch(e) { siteArtistsCache = { } }
try {	var notSiteArtistsCache = JSON.parse(sessionStorage.notSiteArtistsCache) } catch(e) { notSiteArtistsCache = [ ] }

function formItem(name) {
	const item = form.elements.namedItem(name);
	return item != null && item instanceof NodeList ? item[0] : item;
}
function formItems(name) {
	const items = form.elements.namedItem(name);
	return items == null ? [ ] : items instanceof NodeList ? items : [items];
}

imageHostUploaderInit(inputDataHandler, textAreaDropHandler, textAreaPasteHandler, imageUrlResolver);

if (form != null) {
	form.ondragover = voidDragHandler1;
	form.ondrop = voidDragHandler1;
}
if (prefs.focus_to_form && !document.location.hash)
	/*if (document.body.querySelector('table#dnulist.hidden') != null
			&& (ref = document.getElementById('upload_table')) != null)
		ref.parentNode.scrollIntoView({ behavior: 'smooth', block: 'start' });
	else */for (let id of [/*'upload_table', */'dnu_header', 'request_form', 'content', 'upload_table'])
		if ((ref = document.getElementById(id)) != null) {
			if (ref.id == 'content' && ref.firstElementChild) ref = ref.firstElementChild;
			ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
			break;
		}

function clearTfMessages(scope = 1) {
	let tr = document.body.querySelector('table#upload-assistant tr.ua-messages');
	if (tr == null) return;
	tr.querySelectorAll('div.ua-message').forEach(message =>
		{ if (tfMessages.includes(message) == (scope == 0)) message.remove() });
	hideEmptyMessages();
}

function requestFilled() {
	const requestId = parseInt(urlParams.get('requestid'));
	if (!(requestId > 0)) {
		addMessage('Invalid request id ' + requestId, 'warning');
		return;
	}
	const xhr = new XMLHttpRequest, params = new URLSearchParams({ action: 'request', id: requestId });
	xhr.open('GET', '/ajax.php?' + params, false);
	xhr.setRequestHeader('Accept', 'application/json');
	xhr.send();
	if (xhr.status < 200 || xhr.status >= 400) {
		addMessage(`Request status unknown: ${xhr.status} (${xhr.statusText})`, 'warning');
		return;
	}
	let response = JSON.parse(xhr.responseText);
	if (response.status == 'success') response = response.response; else {
		addMessage(`Request status unknown: ${response.status} (${response.error})`, 'warning');
		return;
	}
	if (!response.isFilled) return false;
	alert('The request was already filled by ' + response.fillerName);
	return true;
}

let css = document.createElement('style');
css.type = 'text/css';
css.innerText = `
#upload-assistant td {
	padding: 10px;
	text-align: center; border: none;
}
#upload-assistant textarea#ua-data {
	width: 100%; height: 100%; min-height: 45pt;
	margin: 0; box-sizing: border-box;
	padding: 5px;
	resize: vertical;
	${false && isDarkTheme ? 'color: darkgrey; background-color: #222;' : 'color: grey; background-color: AntiqueWhite;'}
	font: 500 10pt "Segoe UI", sans-serif;
}
#upload-assistant textarea#ua-data:focus { ${false && isDarkTheme ? 'color: white;' : 'color: black;'} }
#upload-assistant div.ua-button {
	vertical-align: middle;
	background-color: transparent !important;
}
#upload-assistant input.ua-button {
	margin: 0;
	/*color: White;*/
	/*background-color: #725200;*/
	width: 13em; height: 27px;
	font: 500 10pt "Segoe UI", sans-serif;
}

#upload-assistant tr.ua-messages div.ua-message { text-indent: -2em; margin-left: 2em; }
#upload-assistant tr.ua-messages div.ua-critical { color: Red; font-weight: bold; font-size: 10pt; }
#upload-assistant tr.ua-messages div.ua-critical-lite { color: Red; font-weight: 500; font-size: 9.5pt; }
#upload-assistant tr.ua-messages div.ua-warning { color: #ff8d00; font-weight: 500; font-size: 9pt; }
#upload-assistant tr.ua-messages div.ua-notice { color: #e3d67b; }
#upload-assistant tr.ua-messages div.ua-info { color: White; }

::placeholder {
	font: bold 12pt Calibri, "Segoe UI", Tahoma, sans-serif;
	color: #888;
	/*text-shadow: 0px 0px 3px #b4b4b4;*/
}
`;
document.head.append(css);

const placeholders = [
	'Paste/drop selected album in foobar2000 or web link to release page here',
	'Paste/drop web link to release page here',
];

{ // Create UA panel
	let table, tr, td, input;

	function createTable(...captions) {
		const bgColors = [
			'burlywood', 'cadetblue', 'darkcyan', 'darkgoldenrod', 'darkgrey', 'darkkhaki',
			'darkolivegreen', 'dimgray', 'dimgrey', 'gold', 'goldenrod', 'khaki', 'lightgray',
			'lightgrey', 'olive', 'olivedrab', 'orange', 'palegoldenrod', 'peru', 'silver',
			'slateblue', 'slategray', 'slategrey', 'steelblue', 'tan', 'teal', 'wheat',
			'yellowgreen', 'turquoise', 'tomato', 'skyblue',
		];
		table = document.createElement('table');
		table.id = 'upload-assistant';
		let tbody = document.createElement('tbody');
		tr = document.createElement('tr');
		tr.className = 'ua-input-controls';
		tr.style.backgroundColor = GM_getValue('panel_random_color', false) ?
			bgColors[Math.floor(Math.random() * bgColors.length)] : isDarkTheme ? 'darkslategray' : 'goldenrod';
		tr.style.verticalAlign = 'middle';
		td = document.createElement('td');
		uaData = document.createElement('textarea');
		uaData.id = 'ua-data';
		uaData.className = 'noWhutBB';
		uaData.spellcheck = false;
		uaData.placeholder = placeholders[0];
		uaData.onpaste = uaInsert;
		if (!isNWCD) {
			uaData.ondrop = uaInsert;
			uaData.ondragover = clear0;
			uaData.ondragenter = uaData[`ondrag${'ondragexit' in uaData ? 'exit' : 'leave'}`] = function(evt) {
				if (evt.relatedTarget == evt.currentTarget) return false;
				if (evt.type == 'dragenter' && !evt.dataTransfer.types.some(type => ['Files', 'text/plain'].includes(type)))
					return false;
				evt.currentTarget.style.backgroundColor = evt.type == 'dragenter' ? 'chartreuse' : null;
			};
			if (isFirefox) uaData.oninput = fixFirefoxDropBug;
		} else uaData.ondrop = uaData.ondragstart = uaData.ondragover = function(evt) {
			evt.stopPropagation();
			return false;
		};
		let body = document.getElementById('body');
		if (body != null && httpParser.test(body.value)) {
			uaData.value = RegExp.$1;
			body.value = '';
			//if (prefs.autfill_delay > 0) autoFill = setTimeout(fillFromText, prefs.autfill_delay);
		}
		td.append(uaData);
		tr.append(td);
		td = document.createElement('td');
		td.style.width = '10%';
		captions.forEach(function(caption, index) {
			let div = document.createElement('div');
			div.className = 'ua-button';
			div.style.setProperty('margin', index > 0 ? '7px 0 0' : '0', 'important');
			input = document.createElement('input');
			input.type = 'button';
			input.id = 'autofill-form-' + (index + 1);
			input.className = 'ua-button';
			input.value = caption;
			input.onclick = fillFromText;
			div.append(input);
			td.append(div);
		});
		tr.append(td);
		tbody.append(tr);
		table.append(tbody);
		return table;
	}

	if ((ref = document.body.querySelector('form#upload_table > div#dynamic_form')) != null) {
		if (isUpload || ref.querySelectorAll('input[type="text"]').length > 0 || ref.getElementsByTagName('TEXTAREA').length > 0) {
			createTable('Autofill form (overwrite)', 'Autofill form (keep values)');
			ref.before(table);
		}
	} else if (isGroupEdit && (ref = document.body.querySelector('form.edit_form')) != null) {
		createTable('Autofill (overwrite values)', 'Autofill (keep/append values)');
		table.style.marginBottom = '1em';
		ref.before(table);
	} else if (category != null) {
		createTable('Autofill form (overwrite)', 'Autofill form (keep values)');
		(td = document.createElement('td')).colSpan = 2;
		td.append(table);
		(tr = document.createElement('tr')).append(td);
		category.parentNode.parentNode.nextElementSibling.before(tr);
	} else console.warn('Upload Assistant: unknown document structure');

	if (prefs.clone_submit_button && form != null) {
		ref = document.createElement('DIV');
		ref.className = 'form-submit';
		ref.style = 'position: fixed; top: 10pt; right: 10pt; padding: 5pt; border-radius: 50%; z-index: 999; transition: 1s ease-out;';
		ref.style.opacity = 0;
		ref.style.transform = `translateX(80px)`;
		ref.style.backgroundColor = `#${isDarkTheme ? '2f4f4f' : 'b8860b'}80`;
		const submitBtns = form.querySelectorAll('input[type="submit"]'), okButton = document.createElement('BUTTON');
		okButton.id = 'form-submit';
		okButton.innerHTML = isUpload ? `
<svg version="1.1" width="16" viewBox="0 0 120 127.71">
	<g style="fill: white;">
		<path d="M28 35.71c0,5.92 9.56,4 20,4l0 52c0,5.02 0,4 12.51,4 11.49,0.04 11.49,1.02 11.49,-4l0 -52c6.09,0 20,1.55 20,-3 0,-5.4 -10.09,-13.63 -14.58,-19.42 -16.64,-21.51 -17.8,-20.72 -26.57,-9.73 -3.63,4.56 -22.85,24.3 -22.85,28.15z"/>
		<path d="M0 119.71c0,4.84 3.16,8 8,8l104 0c4.84,0 8,-3.16 8,-8l0 -32 -16 0 0 24 -88 0 0 -24 -16 0 0 32z"/>
	</g>
</svg>
` : `
<svg version="1.1" width="16" viewBox="0 0 6812.4 6469.34">
	<g style="fill: white;">
		<path d="M1932.55 4749.88c-39.39,-34.61 -18.01,-7.46 -48.56,-56.72l-102.88 -266.05c-50.41,-130.52 -85.82,-217.75 -147.91,-339.65 -690.76,-1356.29 -1536.81,-373.58 -1633.19,-156.51 348.16,226.99 649.76,655.54 899.53,1102.95 129.28,231.56 224.78,430.02 319.86,683.35 91.56,243.95 162.52,548.23 246.67,752.1l826.58 -593.35c231.8,-148.7 178.39,-135.89 321.14,-379.38 1054.11,-1797.94 1274.18,-2270.88 2678.59,-3840.43 222.8,-249 465.8,-492.74 718.64,-712.84 220.92,-192.31 553.47,-513.75 801.39,-655.81 -39.35,-145.95 -126.18,-205.03 -205.22,-287.53 -1023.42,548.28 -2396.22,1829.7 -3161.24,2704.12 -280.88,321.04 -788.92,960.33 -1040.58,1335.5 -161.84,241.26 -342.43,483.82 -472.81,710.26z"/>
	</g>
</svg>
`;
		okButton.style = `
padding: ${isUpload ? 17.5 : 18.4}px 18px; color: white; background-color: darkgreen;
border: none; border-radius: 50%; transition: background-color 200ms;
`;
		okButton.dataset.backgroundColor = okButton.style.backgroundColor;
		(okButton.setDisabled = function(disabled = true) {
			this.disabled = disabled;
			this.style.opacity = disabled ? 0.5 : 1;
			this.style.cursor = disabled ? 'not-allowed' : 'pointer';
		}).call(okButton, Array.prototype.every.call(submitBtns, elem => elem.disabled));
		okButton.onclick = function(evt) {
			function failHandler(reason) {
				target.style.backgroundColor = 'red';
				if (reason) alert('Submit failed for the reason:\n' + reason);
				target.setDisabled(false);
			}

			const target = evt.currentTarget;
			if (target.disabled) return false; else target.setDisabled(true);
			target.style.backgroundColor = 'orange';
			try {
				if (isRequestNew && typeof Calculate == 'function') Calculate();
				if (!validateForm(form)) throw undefined;
				if (urlParams.has('requestid') && requestFilled()) throw undefined;
				if (typeof relationsCheckTimer == 'number') clearInterval(relationsCheckTimer);
				if (prefs.cleanup_descriptions) cleanupDescriptions(form);
			} catch(e) { return (failHandler(e), false) }
			(isAddFormat ? Promise.resolve('Not editable') : new Promise(function(resolve, reject) {
				const image = form.elements.namedItem('image');
				if (image == null) resolve('No image input'); else if (image.disabled) new MutationObserver(function(ml, mo) {
					for (let mutation of ml) if (!mutation.target.disabled) {
						mo.disconnect();
						resolve('Image input completed (delayed)');
					}
				}).observe(image, { attributes: true, attributeFilter: ['disabled'] }); else resolve('Image input complete');
			})).then(function(formReadyState) {
				if (isUpload && ajaxApiKey && (!evt.ctrlKey || evt.altKey)) { // use API to create the upload
					const payLoad = new FormData, deleteFields = (...names) => names.forEach(FormData.prototype.delete.bind(payLoad));
					for (var element of form.elements) {
						if (element.disabled || !['INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName) || !element.name || ![
							'groupid', 'requestid', 'file_input', 'type', 'title', 'year', 'tags', 'image',
							'releasetype', 'artists[]', 'importance[]', 'importance_0[]', 'vanity_house',
							'record_label', 'catalogue_number',
							'media', 'format', 'bitrate', 'other_bitrate', 'vbr', 'logfiles[]', 'scene', 'unknown',
							'album_desc', 'release_desc', 'desc', 'processed_by',
						].includes(element.name) && (!evt.altKey || !['submit', 'auth'].includes(element.name)) && ![
							/^(?:extra_(?:file_\d+|(?:format|bitrate|release_desc)\[\]))$/,
							/^(?:remaster_(?:year|title|record_label|catalogue_number))$/,
						].some(rx => rx.test(element.name))) continue;
						switch (element.type) {
							case 'button':
								continue;
							case 'file':
								if (element.files.length <= 0) break;
								for (let file of element.files) payLoad.append(element.name, file);
								continue;
							case 'checkbox': case 'radio':
								if (!element.checked) continue;
							default:
								if (!element.value && (element.required || !element.name.endsWith('[]'))) break;
								payLoad.append(element.name, element.value);
								continue;
						}
					}
					if ((element = form.elements.namedItem('media')) == null || element.value != 'CD')
						payLoad.delete('logfiles[]');
					if ((element = form.elements.namedItem('bitrate')) == null || element.value != 'Other')
						deleteFields('other_bitrate', 'vbr');
					if ((element = form.elements.namedItem('unknown')) != null && element.checked)
						deleteFields(...['year', 'title', 'record_label', 'catalogue_number'].map(s => 'remaster_' + s));
					payLoad.set('timestamp', Date.now());
					payLoad.set('submitted_by', 'Upload Assistant v' + GM_info.script.version);
					/*if (!evt.altKey) */return queryAjaxAPI('upload', null, payLoad).then(function(response) {
						console.assert(['groupid', 'torrentid'].every(param => response[param] > 0));
						target.style.backgroundColor = 'green';
						const url = new URL('torrents.php', document.location.origin);
						for (let param of ['groupid', 'torrentid']) url.searchParams.set(param, response[param]);
						document.location.assign(url);
					});
				} else HTMLFormElement.prototype.submit.call(form);
			}).catch(failHandler);
		};
		okButton.onmouseenter = okButton.onmouseleave = function(evt) {
			if (evt.relatedTarget == evt.currentTarget || evt.currentTarget.disabled) return false;
			evt.currentTarget.style.backgroundColor = evt.type == 'mouseenter' ? 'limegreen'
				: evt.currentTarget.dataset.backgroundColor || null;
		};
		let tooltip = 'Validate';
		if (prefs.cleanup_descriptions) tooltip += ', clean up';
		tooltip += ` and ${isUpload ? 'upload' : 'submit'} - this is sticky form submit button.`;
		if (isUpload) tooltip += `
Incomplete form or form containing invalid/nonsense values won't be posted.
Submit via API ${ajaxApiKey ? 'is active (Ctrl+click to enforce standard submit method)'
	: 'available on setting up ajax.php auth key (not active)\nStorage entry name in form \${sitename}_api_key'}.`;
		okButton.title = tooltip;
		for (let submitBtn of submitBtns) new MutationObserver((ml, mo) =>
			{ okButton.setDisabled(Array.prototype.every.call(submitBtns, elem => elem.disabled)) })
				.observe(submitBtn, { attributes: true, attributeFilter: ['disabled'] });
		ref.append(okButton);
		document.body.append(ref);
		setTimeout(function(elem) {
			elem.style.transform = 'translateX(0)';
			elem.style.opacity = 1;
		}, 1000, ref);
	}

	for (let styleSheet of document.styleSheets) try {
		let href = styleSheet.href && new URL(styleSheet.href), cssRule;
		switch (href && href.pathname.replace(/^.*\//, '').toLowerCase()) {
			case 'global.css':
				for (cssRule of styleSheet.cssRules)
					if (cssRule.selectorText == 'td.label') cssRule.style.verticalAlign = 'middle'
				break;
			case 'style.css':
				// for (cssRule of styleSheet.cssRules)
				// 	if (cssRule.selectorText == 'td, th') cssRule.style.padding = '2px 5px';
				break;
		}
	} catch(e) { console.warn('Exception during styleSheets iteration:', e) }
}

function yadgObserver(root = form || document.body, timeout = 15000) {
	function apiAdapter(root) {
		let input = root.querySelector('input#yadg_input');
		return input && {
			input: input,
			scraper: root.querySelector('select#yadg_scraper'),
			submit: root.querySelector('input#yadg_submit'),
			response: root.querySelector('div#yadg_response'),
			scrapers: Array.from(root.querySelectorAll('select#yadg_scraper > option'), option => option.value),
		};
	}

	let yadg = apiAdapter(root);
	return yadg != null ? Promise.resolve(yadg) : new Promise(function(resolve, reject) {
		let counters = [0, 0], timeStamp = Date.now();
		const mo = new MutationObserver(function(ml, mo) {
			++counters[0];
			for (let mutation of ml) for (let node of mutation.addedNodes) {
				++counters[1];
				if (node.nodeType != Node.ELEMENT_NODE || (yadg = apiAdapter(node)) == null) continue;
				clearTimeout(timer);
				mo.disconnect();
				yadg.root = node;
				if (prefs.diag_mode) console.log('YADG located by trigger:', yadg, counters, (Date.now() - timeStamp) / 1000);
				return resolve(yadg);
			}
		}), timer = setTimeout(function(mo) {
			mo.disconnect();
			reject('Timeout reached');
		}, timeout, mo);
		mo.observe(root, { childList: true, subtree: true });
	});
}
let yadg = yadgObserver();

function validateForm(form) {
	function formatSpecific(name, value) {
		const elem = itemGetter(name);
		return elem != null && elem.value == value;
	}
	function invalidHandler(msg) {
		if (msg) alert(msg);
		return false;
	}
	function trimElement(elem) {
		const trimmed = elem.value.trim();
		if (elem.value.length > trimmed.length) elem.value = trimmed;
	}

	if (torrentStats.severityLevel >= 3) return invalidHandler('Torrent file invalid or breaking site rules');
	if (!(form instanceof HTMLFormElement)) throw 'Invalid argument'; else if (!form.reportValidity()) return false;
	const itemGetter = HTMLFormControlsCollection.prototype.namedItem.bind(form.elements);
	for (var elem of form.getElementsByTagName('INPUT')) {
		if (['text', 'number', 'search', 'url'].includes(elem.type) && !elem.disabled && elem.value) trimElement(elem);
		if (['text'].includes(elem.type) && ['tags', 'tagname', 'taglist'].includes(elem.name)) {
			const tags = new TagManager(elem.value);
			elem.value = tags.toString();
		}
	}
	for (elem of form.getElementsByTagName('TEXTAREA')) if (!elem.disabled && elem.value) trimElement(elem);
	if (isUpload) switch (selectedCategoryName()) {
		case 'Music': {
			const [format, bitrate] = ['format', 'bitrate'].map(itemGetter);
			if (bitrate != null) {
				if (format != null) {
					const isLossless = /\b(?:Lossless)$/.test(bitrate.value),
								isNominal = /^\d+$/.test(bitrate.value) || bitrate.value == 'Other';
					let bitrateOK;
					switch (format.value) {
						case 'FLAC': bitrateOK = isLossless; break;
						case 'MP3': bitrateOK = /^(?:V\d|AP[SX]) \(VBR\)$/.test(bitrate.value) || isNominal; break;
						case 'AAC': case 'AC3': case 'Opus': bitrateOK = isNominal; break;
						case 'DTS': bitrateOK = isNominal || isLossless; break;
						case 'Vorbis': case 'OGG': bitrateOK = /^q\d+\.\S+ \(VBR\)$/.test(bitrate.value) || isNominal; break;
						case 'DSD': bitrateOK = /^DSD(64|128|256|512|1024)$/.test(bitrate.value); break;
						default: console.warn('Unknown format:', format.value);
					}
					if (bitrateOK == false) return invalidHandler('Invalid bitrate for selected format');
				}
				if (bitrate.value == 'Other') {
					const customBR = itemGetter('other_bitrate');
					if (customBR != null) {
						let bitrate = Math.round(parseFloat(customBR.value));
						if (bitrate >= 192) customBR.value = bitrate;
							else return invalidHandler('Invalid or too low custom bitrate (192k or more)');
					}
				}
			}
			if (prefs.care_cd_extras && formatSpecific('media', 'CD') && formatSpecific('format', 'FLAC')) {
				let logsAttached = 0;
				for (let logFile of document.body.querySelectorAll('input[name="logfiles[]"]'))
					for (let file of logFile.files) if (file.name.toLowerCase().endsWith('.log')) ++logsAttached;
				const issues = [ ], dt = discTotal || 1;
				if (logsAttached < dt) issues.push(logsAttached > 0 ?
					`only ${logsAttached} LOG file(s) for ${dt} disc(s) attached to form` : 'no LOG file attached to form');
				if (torrentStats.foldersWithLog < dt) issues.push(torrentStats.foldersWithLog > 0 ?
					`only ${torrentStats.foldersWithLog} folder(s) with LOG file for ${dt} disc(s) in .torrent file` : 'no LOG file in .torrent file');
				if (torrentStats.foldersWithCue < dt) issues.push(torrentStats.foldersWithCue > 0 ?
					`only ${torrentStats.foldersWithCue} folder(s) with CUE file for ${dt} disc(s) in .torrent file` : 'no CUE file in .torrent file');
				if (torrentStats.foldersWithLog >= dt && torrentStats.foldersWithCue >= dt && torrentStats.foldersWithLogCue >= 0)
					if (torrentStats.foldersWithLogCue <= 0) issues.push('No folder(s) with LOG and CUE file in .torrent file');
					else if (discTotal > 0 && torrentStats.foldersWithLogCue != discTotal)
						issues.push(`${torrentStats.foldersWithLogCue} folder(s) with LOG and CUE file in .torrent file mismatch to ${discTotal} disc(s) uploaded`);
				if (issues.length > 0 && !confirm(`You're going to upload a CD rip, the following deficiencies for "perfect FLAC" are present:

${issues.map(issue => '- ' + issue).join('\n')}

Are you sure to proceed?
(You can turn off this reminder by setting care_cd_extras storage param to false)`)) return false;
			}
			break;
		}
	} else if ((isRequestNew || isRequestEdit) && isSelectedCategory('Music')) {
		const reqControl = new RequestControl(form);
		if (!reqControl.anyOf('media')) return invalidHandler('No media selected');
		if (!reqControl.anyOf('formats')) return invalidHandler('No format selected');
		if (!reqControl.anyOf('bitrates')) return invalidHandler('No bitrate selected');
		return true;
	} else return true;
	const thisYear = new Date().getFullYear(), years = ['year', 'remaster_year'].map(itemGetter);
	let isUnknown = form.elements.namedItem('unknown');
	let isUnknownYear = form.elements.namedItem('unknown_year');
	isUnknown = isUnknown != null && isUnknown.checked;
	isUnknownYear = isUnknownYear != null && isUnknownYear.checked;
	for (elem of years) if (elem != null) {
		if (elem.name == 'remaster_year' && isUnknown) continue;
		if (elem.name == 'year' && isUnknownYear) continue;
		const year = parseInt(elem.value);
		if (!(year >= 1900)) {
			elem.focus(); elem.select();
			return invalidHandler('Invalid ' + elem.name.toUpperCase());
		} else if (year > thisYear + 1 && !confirm(`Suspicious ${elem.name.toUpperCase()} value <${year}> - correct?`)) {
			elem.focus(); elem.select();
			return false;
		}
	}
	if (!isUnknown && !isUnknownYear && years.every(Boolean) && parseInt(years[0].value) > parseInt(years[1].value))
		return invalidHandler('Release year must be equal or greater than first release year');
	for (elem of ['remaster_record_label', 'record_label', 'recordlabel'].map(itemGetter))
		if (elem != null && [/^(?:\d+\s+)?Records DK2?$/i].some(rx => rx.test(elem.value))) elem.value = '';
	return true;
}

function cleanupDescriptions(form) {
	if (!(form instanceof HTMLFormElement)) throw 'Invalid argument';
	let emptyTagMatch = /\s*(?: \| )?\[(\w+)(?:=([^\[\]]*))?\]\[\/\1\]/.source;
	emptyTagMatch = [new RegExp(emptyTagMatch, 'gm'), new RegExp(emptyTagMatch, 'm')];
	const foodrParser = /\s*^(\[hide=DR(\d+)\]\[pre\][\S\s]+\[\/pre\]\[\/hide\])/m;
	for (let textArea of form.getElementsByTagName('textarea')) {
		if (!['album_desc', 'description', 'desc', 'body', 'release_desc', 'release_lineage'].includes(textArea.name)
				|| textArea.value.length <= 0) continue;
		let clean = [
			/\r?\n^\[pad=\d+\|\d+\|\d+\|\d+\]\[\/pad\]$/gm,
			/[ \t\xA0]+$/gm,
			/[ \t]*Vinyl rip by \[color=\S+\]\[\/color\]\s*/im,
			/\[u\]Lineage:\[\/u\]\n\n/i,
		].reduce((description, rx) => description.replace(rx, ''), textArea.value), matches;
		do clean = clean.replace(emptyTagMatch[0], ''); while (emptyTagMatch[1].test(clean));
		if ((matches = foodrParser.exec(clean)) != null) [
			/(^| \| )DR(\d+)$/m,
			/(^| \| )\[color=\#?\w+\]DR(\d+)\[\/color\]$/m,
			/(^\d+(?:\.\d+)?(?:\/\d+(?:\.\d+)?)*\s*kHz)$/,
		].forEach(function(anchor, index) {
			let anchorMatches = anchor.exec(clean.replace(foodrParser, ''));
			if (anchorMatches == null) return;
			clean = anchorMatches.input.slice(0, anchorMatches.index);
			if (anchorMatches[1]) {
				clean += anchorMatches[1];
				if (!anchorMatches[1].endsWith(' | ')) clean += ' | ';
			}
			clean += matches[1] + anchorMatches.input.slice(anchorMatches.index + anchorMatches[0].length);
		});
		textArea.value = clean.replace(/(?:[ \t\xA0]*\r?\n){3,}/g, '\n\n').trim();
	}
}

function setDynaHandlers() {
	const root = document.body.querySelector('div#dynamic_form') || form;
	console.assert(root != null);
	if (root == null) return;
	const tBody = root.querySelector(':scope > table > tbody');
	console.assert(tBody != null);
	for (let input of root.querySelectorAll('input[type="text"], input[type="url"]'))
		if (['image', 'verification'].some(value => ['id', 'name'].some(attr => input[attr] == value))) setInputHandlers(input);
	for (let textArea of root.getElementsByTagName('TEXTAREA')) if (textArea.id != 'ua-data') setTextAreahandlers(textArea);
	if (isUpload && isSelectedCategory('Music')) {
		if (prefs.no_multiformat && (ref = document.getElementById('add_format')) != null)
			ref.parentNode.parentNode.style.visibility = 'collapse';
		if (!prefs.no_multiformat && typeof createDropDownOptions != 'function'
				&& isUpload && !prefs.no_multiformat && tBody != null) {
			damageControlWatcher = new MutationObserver(function(ml, mo) {
				for (let mutation of ml) for (let node of mutation.addedNodes)
					if (node.nodeType == Node.ELEMENT_NODE && node.matches('tr[id^="extra_format_row"]'))
						for (let option of node.querySelectorAll('select > option'))
							if (option.label.startsWith('function(')) option.remove();
			});
			damageControlWatcher.observe(tBody, { childList: true });
		}
	}

	// CD log watcher
	if (isUpload && isSelectedCategory('Music') && (prefs.check_cd_log || prefs.check_for_cd_duplicity && isAddFormat)) {
		function installLogWatchers(logFields) {
			console.assert(logFields instanceof HTMLElement);
			if (!(logFields instanceof HTMLElement)) return;
			const selector = 'input[type="file"]', listener = ['input', function(evt) {
				console.assert(evt.currentTarget instanceof HTMLInputElement, evt, evt.currentTarget);
				if (prefs.check_cd_log) {
					const target = evt.currentTarget;
					if (Array.isArray(target.messageElements)) {
						for (let node of target.messageElements) node.remove();
						delete target.messageElements;
					}
					Array.prototype.forEach.call(target.files, function(file) {
						const formData = new FormData;
						formData.set('action', 'takeupload');
						formData.set('log', file);
						queryAjaxAPI('logchecker', undefined, formData).catch(reason => reason == 'endpoint not found' ?
								localXHR('/logchecker.php', undefined, formData).then(function(document) {
							let elem = document.body.querySelector('blockquote > strong + span');
							if (elem == null) throw 'Invalid page structure';
							const response = { score: parseInt(elem.textContent) };
							elem = document.body.querySelectorAll('blockquote > h3 + ul > li');
							response.issues = elem != null && elem.length > 0 ?
								Array.from(elem).map(li => li.textContent.trim()).filter(Boolean) : [ ];
							return response;
						}) : Promise.reject(reason)).then(function(response) {
							let message = `"${file.name}" log score ${response.score}%`;
							if (Array.isArray(response.issues) && response.issues.length > 0)
								message = new HTML(message + '<br>' + response.issues.map(issue => '- ' + issue).join('<br>'));
							if (!Array.isArray(target.messageElements)) target.messageElements = [ ];
							target.messageElements.push(addMessage(message, 'info'));
						});
					});
				}
				if (prefs.check_for_cd_duplicity && isAddFormat) {
					if (Array.isArray(scdMessages)) {
						for (let elem of scdMessages) elem.remove();
						scdMessages = null;
						hideEmptyMessages();
					}
					let allLogs = Array.from(logFields.querySelectorAll(selector), input => Array.from(input.files));
					const allSlotsTaken = allLogs.every(files => files.length > 0);
					allLogs = Array.prototype.concat.apply([ ], allLogs)
						.filter(file => file.name.toLowerCase().endsWith('.log'));
					if (allLogs.length > 0) {
						const loadScript = url => new Promise((resolve, reject) => document.head.append(Object.assign(document.createElement('script'), {
							type: 'text/javascript', src: url,
							onload: evt => { resolve(evt.currentTarget) }, onerror: evt => { reject('Script failed to load') },
						})));
						if (!(scdAPI instanceof Promise)) scdAPI = unsafeWindow.similarCDDetector ? Promise.resolve(unsafeWindow.similarCDDetector)
							: loadScript('https://openuserjs.org/src/libs/Anakunda/Requests.min.js').then(requests =>
								loadScript('https://openuserjs.org/src/scripts/Anakunda/[RED]_Similar_CD_Detector.min.user.js')).then(scd =>
							unsafeWindow.similarCDDetector || Promise.reject('Similar CD Detector failed to load'));
						if (!(groupTorrents instanceof Promise)) groupTorrents =
							queryAjaxAPI('torrentgroup', { id: parseInt(urlParams.get('groupid')) })
								.then(torrentGroup => torrentGroup.torrents.filter(torrent => torrent.hasLog));
						Promise.all([Promise.all(allLogs.map(logFile => new Promise(function(resolve, reject) {
							const fr = new FileReader;
							fr.onload = evt => { resolve(evt.currentTarget.result) };
							fr.onerror = evt => { reject(`Log file reading error (${logFile.name})`) };
							fr.readAsText(logFile);
						}))), groupTorrents, scdAPI]).then(async function([logs, torrents, scdAPI]) {
							if (torrents.length <= 0) return;
							if (!['getSessionsFromLogs', 'getUniqueSessions'].some(fn => typeof scdAPI[fn] == 'function'))
								throw 'Assertion failed: Required API endpoints missing';
							const userSessions = await (scdAPI.getSessionsFromLogs || scdAPI.getUniqueSessions)(logs, true);
							if (['releaseFingerprintFromTorrent', 'releaseFingerprintFromSessions', 'testSimilarity'].every(fn => typeof scdAPI[fn] == 'function')) {
								const userRelease = scdAPI.releaseFingerprintFromSessions(userSessions);
								var testWorker = torrent => scdAPI.releaseFingerprintFromTorrent(torrent.id).then(function(torrentRelease) {
									try {
										const remarks = scdAPI.testSimilarity(userRelease, torrentRelease, true);
										return remarks ? { torrent: torrent, remarks: remarks } : null;
									} catch(e) { return null }
								});
							} else if (['getSessionsFromTorrent', 'releaseFingerprintFromSessions', 'testSimilarity'].every(fn => typeof scdAPI[fn] == 'function'))
								testWorker = torrent => scdAPI.getSessionsFromTorrent(torrent.id).then(function(torrentSessions) {
									try {
										return {
											torrent: torrent,
											remarks: scdAPI.testSimilarity(...[userSessions, torrentSessions].map(scdAPI.releaseFingerprintFromSessions), true),
										}
									} catch(e) { return null }
								});
							else if (['testSimilarity'].every(fn => typeof scdAPI[fn] == 'function'))
								testWorker = torrent => scdAPI.testSimilarity(userSessions, torrent.id)
									.then(remarks => ({ torrent: torrent, remarks: remarks }), reason => null);
							else throw 'Assertion failed: Required API endpoints missing';
							if (userSessions != null) return Promise.all(torrents.map(testWorker)).then(function(results) {
								scdMessages = (results = results.filter(result => result != null)).length > 0 ? results.map(function(result, index) {
									const type = result.torrent.reported || result.torrent.trumpable || !(result.torrent.logScore >= 100) ? 'notice' : 'warning';
									let message = `${{ 'warning': 'This', 'notice': 'Unless uploading a trump, this' }[type]} pressing will be considered dupe to <a href="/torrents.php?torrentid=${result.torrent.id}" target="_blank" style="color: skyblue;">${result.torrent.remasterYear > 0 ? `${result.torrent.remasterYear} - ${[
										'remasterRecordLabel',
										'remasterCatalogueNumber',
										'remasterTitle',
									].map(prop => result.torrent[prop]).filter(Boolean).join(' / ')}` : (result.torrent.remastered ? 'unknown' : 'unconfirmed') + ' edition'}</a>`;
									if (result.remarks === true) message += ' - identical rips';
									else if (Array.isArray(result.remarks) && result.remarks.length > 0)
										message += '<br>' + result.remarks.map(safeText).join('<br>');
									return addMessage(new HTML(message), type);
								}) : [addMessage('Pressing is unique within the release group', 'info')];
							}); else scdMessages = [addMessage('Invalid logfiles attached', 'notice')];
						}).catch(reason => { scdMessages = [addMessage(`CD duplicity test failed for the reason: ${reason}`, 'notice')] });
					}
				}
			}], setLogWatcher = input => { input.addEventListener(...listener) };
			logFields.querySelectorAll(selector).forEach(setLogWatcher);
			logsWatcher = new MutationObserver(function(ml, mo) {
				for (let mutation of ml) {
					for (let node of mutation.addedNodes) if (node.nodeType == Node.ELEMENT_NODE
							&& node.matches(selector)) setLogWatcher(node);
					for (let node of mutation.removedNodes) if (node.nodeType == Node.ELEMENT_NODE
							&& node.matches(selector)) node.removeEventListener(...listener);
				}
			});
			logsWatcher.observe(logFields, { childList: true });
		}

		installLogWatchers(document.body.querySelector('form#upload_table div#dynamic_form td#logfields'));
	}

	if (form != null) {
		// set up form valiadtors where possible
		for (let elem of [
			'file', 'artist', 'importance', 'title', 'releasetype', 'year', 'remaster_year',
			'format', 'bitrate', 'media', 'album_desc', 'desc', 'description', 'body', 'tags',
			'amount_box',
		]) if ((elem = formItem(elem) || document.getElementById(elem)) != null && !elem.required
				&& elem.offsetWidth > 0 && elem.offsetHeight > 0) elem.required = true;
		let unknown = form.elements.namedItem('unknown');
		if (unknown != null) unknown.onchange = function(event) {
			const remasterYear = form.elements.namedItem('remaster_year');
			if (remasterYear != null) remasterYear.required = !event.currentTarget.checked;
		};
		unknown = form.elements.namedItem('unknown_year');
		if (unknown != null) unknown.onchange = function(event) {
			const year = form.elements.namedItem('year');
			if (year != null) year.required = !event.currentTarget.checked;
		};
		for (let textArea of ['album_desc', 'desc', 'description', 'body'/*, 'release_desc'*/])
			if ((textArea = formItem(textArea) || document.getElementById(textArea)) != null) textArea.minLength = 10;
		for (let textArea of root.getElementsByTagName('TEXTAREA'))
			if (textArea.name) textArea.maxLength = 2**16 - 1;
		for (let input of ['year', 'remaster_year'].map(formItem)) if (input != null) {
			//input.type = 'number';
			input.min = 1900;
			input.max = new Date().getUTCFullYear() + 1;
		}
		for (let input of root.querySelectorAll('input[name="image"]'))
			input.pattern = isRED ? '^[hH][tT][tT][pP][sS]:\\/\\/\\S+' : '^[hH][tT][tT][pP][sS]?:\\/\\/\\S+';
		if (isUpload && !prefs.no_multiformat && isSelectedCategory('Music') && tBody != null) {
			torrentInputWatcher = new MutationObserver(function(ml, mo) {
				for (let mutation of ml) for (let node of mutation.addedNodes)
					if (node.nodeType == Node.ELEMENT_NODE && node.matches('tr#[id^="extra_format_row"]')) {
						for (let tagName of ['INPUT', 'SELECT']) for (let elem of node.getElementsByTagName(tagName))
							if (elem.offsetWidth > 0 && elem.offsetHeight > 0) elem.required = true;
						node.querySelectorAll('input[type="file"][accept$=".torrent"]').forEach(torrentInputHandler);
					}
			});
			torrentInputWatcher.observe(tBody, { childList: true });
		}
		if (isUpload && isSelectedCategory('Music')) {
			function onChange(evt) {
				function whitelistValues(select, rxFilter) {
					if (!(select instanceof HTMLSelectElement)) return;
					if (rxFilter) rxFilter = new RegExp(`^(?:${rxFilter})$`, 'i');
					for (let option of select.options)
						option.hidden = option.disabled = option.index > 0 && rxFilter && !rxFilter.test(option.value);
					const enabledOptions = Array.prototype.slice.call(select.options, 1).filter(option => !option.disabled);
					const selectIndex = enabledOptions.length == 1 ? enabledOptions[0].index
						: select.selectedIndex > 0 && select.options[select.selectedIndex].disabled ? 0 : undefined;
					if (selectIndex >= 0 && select.selectedIndex != selectIndex) {
						select.selectedIndex = selectIndex;
						notifyChange(select);
					}
				}

				if (evt.currentTarget instanceof HTMLSelectElement) switch (evt.currentTarget) {
					case media:
						switch (evt.currentTarget.value) {
							case 'CD': case 'WEB': case 'Vinyl': case 'DVD': case 'SACD':
							case 'Cassette': case 'Soundboard': case 'DAT':
								whitelistValues(format, formatWhitelist(evt.currentTarget.value));
								break;
							case 'Blu-Ray': case 'Blu-ray': case 'BD':
								whitelistValues(format, formatWhitelist('Blu-Ray'));
								break;
							default: whitelistValues(format);
						}
						onChange({ currentTarget: format });
						break;
					case format:
						whitelistValues(bitrate, evt.currentTarget.selectedIndex > 0 ? bitrateWhitelist(evt.currentTarget.value)
							: Array.prototype.slice.call(evt.currentTarget.options, 1).filter(option => !option.disabled)
								.map(option => bitrateWhitelist(option.value)).filter(Boolean).join('|') || undefined);
						break;
				}
			}

			const [media, format, bitrate] = ['media', 'format', 'bitrate']
				.map(HTMLFormControlsCollection.prototype.namedItem.bind(form.elements));
			const formatWhitelist = medium => ({
				'CD': 'MP3|FLAC|AAC|Vorbis|Opus',
				'DVD': 'MP3|FLAC|AAC|AC3|DTS|Vorbis|Opus',
				'Vinyl': 'MP3|FLAC|AAC|Vorbis|Opus',
				'Soundboard': 'MP3|FLAC|AAC|Vorbis|Opus',
				'SACD': 'MP3|FLAC|AAC|DSD|Vorbis|Opus',
				'DAT': 'MP3|FLAC|AAC|Vorbis|Opus',
				'Cassette': 'MP3|FLAC|AAC|Vorbis|Opus',
				'WEB': 'MP3|FLAC|AAC|DSD|Vorbis|Opus',
			}[medium]), bitrateWhitelist = format => ({
				'MP3': '(?:V\\d|AP[SX]) \\(VBR\\)|\\d+|Other',
				'FLAC': media != null && media.value == 'CD' ? 'Lossless' : '(?:24bit )?Lossless',
				'AAC': '\\d+|Other',
				'AC3': '\\d+|Other',
				'Vorbis': 'q\\d+\\.x \\(VBR\\)|Other',
				'DTS': /*'|(?:24bit )?Lossless|' + */'Other',
				'DSD': media != null && media.value == 'SACD' ? 'DSD64' : 'DSD(?:64|128|256|512|1024)',
			}[format]);
			if (media != null) media.addEventListener('change', onChange);
			if (format != null) format.addEventListener('change', onChange);
		}

		// optimize layout
		if (prefs.reorder_upload_fields) if (isUpload) {
			function reorder(...inputs) {
				if ((inputs = inputs.map(HTMLFormControlsCollection.prototype.namedItem.bind(form.elements))).every(Boolean))
					inputs[0].parentNode.parentNode.before(inputs[1].parentNode.parentNode);
			}

			reorder('format', 'media');
			//reorder('year', 'unknown_year');
		} else if (isRequestNew || isRequestEdit) {
			const rows = ['formats_tr', 'media_tr'].map(id => document.getElementById(id));
			if (rows.every(Boolean)) rows[0].before(rows[1]);
		}
	}

	// Always use edition on OPS
	if (isOPS && isUpload && (ref = document.getElementById('remaster')) != null) {
		ref.checked = true;
		if (!isAddFormat && prefs.ops_always_edition) {
			const elem = ref.parentNode.parentNode;
			elem.style.display = 'none';
			if ((ref = document.body.querySelector('span#year_label_not_remaster')) != null) ref.textContent = 'Initial year:';
			if ((ref = document.body.querySelector('tr#edition_year > td.label')) != null) ref.textContent = 'Edition year:';
			if ((ref = document.body.querySelector('tr#edition_title > td.label')) != null) ref.textContent = 'Edition title:';
			if ((ref = document.getElementById('label_tr')) != null) /*ref.style.display = 'none'; */ref.remove();
			if ((ref = document.getElementById('catalogue_tr')) != null) /*ref.style.display = 'none'; */ref.remove();
			document.body.querySelectorAll('table#edition_information > tbody > tr')
				.forEach(tr => { elem.parentElement.insertBefore(tr, elem) });
		} else Remaster();
	}

	// set YADG handlers
	yadg.then(function(yadg) {
		/*yadg.input.onpaste = */yadg.input.ondrop = function(evt) {
			const searchTerm = evt[{ drop: 'dataTransfer', paste: 'clipboardData' }[evt.type]].getData('text/plain');
			if (searchTerm) evt.currentTarget.value = searchTerm; else return;
			if (yadg.submit != null && !yadg.submit.disabled) yadg.submit.click();
			return false;
		};
		yadg.input.ondblclick = clear0;
		if (yadg.response == null) return; // assertion failed!
		let menu = document.createElement('menu'), resultItem;
		menu.type = 'context';
		menu.id = 'afc7e09d-8ea2-4d3f-a320-d1d0f5a177f7';
		menu.innerHTML = '<menuitem label="Use cover from this source" /><menuitem label="-" />';
		menu.firstElementChild.onclick = function(evt) {
			console.assert(resultItem instanceof HTMLAnchorElement, 'resultItem instanceof HTMLAnchorElement', resultItem);
			const status = document.createElement('span');
			status.style = 'color: red; background-color: white; margin-left: 10px;';
			status.textContent = '[ processing... ]';
			resultItem.after(status);
			console.time('Image URL Resolver/Rehoster');
			imageUrlResolver(resultItem.href, { ctrlKey: evt.ctrlKey, shiftKey: evt.shiftKey })
					.then(result => verifyImageUrl(result).then(function(imageUrl) {
				if (!isNWCD) input.value = imageUrl;
				const size = getRemoteFileSize(imageUrl);
				coverPreview(input, imageUrl, size);
				return checkImageSize(imageUrl, input, size).then(function(imageUrl) {
					if (!prefs.auto_rehost_cover && !isNWCD) return;
					input.disabled = true;
					return safeRehostSingleImage(imageUrl).then(function(imageUrl) {
						if (imageUrl == null) throw 'invalid image';
						input.value = imageUrl;
						const summary = document.body.querySelector('input[name="summary"]');
						if (summary != null && !summary.disabled && !summary.value) summary.value = 'Cover update/rehost';
					});
				}).catch(function(reason) {
					if (!isNWCD) input.value = imageUrl;
					status.textContent = '[ not rehosted ]';
					addMessage(reason + ' (not rehosted)', 'warning');
				}).then(function() {
					input.disabled = false;
					status.textContent = '[ success ]';
					status.style.color = 'green';
				});
			})).catch(function(reason) {
				status.textContent = '[ fail ]';
				alert(reason);
			}).then(function() {
				console.timeEnd('Image URL Resolver/Rehoster');
				setTimeout(() => { status.remove() }, 5000);
			});
		};
		document.body.append(menu);
		yadgResponseWatcher = new MutationObserver(function(ml, mo) {
			for (let mutation of ml) for (let node of mutation.addedNodes)
				if (node.nodeType == Node.ELEMENT_NODE && node.id == 'yadg_release_list') {
					const input = findImageInput();
					if (input == null || input.disabled) return;
					for (let a of node.querySelectorAll('li > a')) {
						a.oncontextmenu = evt => { resultItem = evt.currentTarget };
						a.setAttribute('contextmenu', menu.id);
					}
					return;
				} else if (node.nodeType == Node.TEXT_NODE && node.textContent.includes('no matches')) {
					if (prefs.yadg_auto_next_scraper && yadg.scraper != null) {
						switch (yadg.scraper.value) {
							case 'junodownload': yadg.scraper.value = 'beatport'; break;
							case 'googleplay': case 'googleplay': case 'metalarchives': case 'beatport':
								yadg.scraper.value = 'deezer'; break;
							case 'allmusic': yadg.scraper.value = 'deezer'; break;
							case 'deezer': yadg.scraper.value = 'itunes'; break;
							case 'itunes': yadg.scraper.value = 'discogs'; break;
							case 'discogs': yadg.scraper.value = 'musicbrainz'; break;
							case 'musicbrainz': yadg.scraper.value = 'discogs'; break;
							default: return;
						}
						if (yadg.submit == null || prefs.yadg_no_autosearch.includes(yadg.scraper.value)) return;
						console.assert(!yadg.submit.disabled);
						if (!yadg.submit.disabled) yadg.submit.click();
					}
					return;
				}
		});
		yadgResponseWatcher.observe(yadg.response, { childList: true });
		const row = document.getElementById('artist_tr');
		if (row != null) row.parentElement.insertBefore(yadg.root, row);
	});
}

if (form != null) {
	form.onsubmit = function(evt) {
		const submitBtns = form.querySelectorAll('input[type="submit"]');
		for (let submitBtn of submitBtns) submitBtn.disabled = true;
		if (isRequestNew && typeof Calculate == 'function') Calculate();
		if (validateForm(evt.currentTarget) && (!urlParams.has('requestid') || !requestFilled())) return true;
		evt.stopImmediatePropagation();
		evt.preventDefault();
		for (let submitBtn of submitBtns) submitBtn.disabled = false;
		return false;
	};
	if ((isUpload || isRequestNew) && prefs.relations_check_interval > 0) form.addEventListener('submit',
		evt => { if (typeof relationsCheckTimer == 'number') clearInterval(relationsCheckTimer) });
	form.append(Object.assign(document.createElement('input'), {
		type: 'hidden',
		name: 'processed_by',
		value: 'Upload Assistant v' + GM_info.script.version,
	}));
	if (prefs.cleanup_descriptions) form.addEventListener('submit', evt => { cleanupDescriptions(evt.currentTarget) });
}
setDynaHandlers();
if (category != null && !category.disabled) { // only on new upload
	const dynamicForm = document.body.querySelector('form#upload_table div#dynamic_form');
	console.assert(dynamicForm != null);
	category.addEventListener('change', function(evt) {
		yadg = Promise.reject('Not available');
		for (let mo of [logsWatcher, damageControlWatcher, torrentInputWatcher, yadgResponseWatcher])
			if (mo instanceof MutationObserver) mo.disconnect();
		const ua = document.body.querySelector('table#upload-assistant');
		if (ua != null) {
			if ((ref = ua.querySelector('tr.ua-messages')) != null) ref.remove();
			ua.hidden = !isSelectedCategory('Music', 'Applications', 'E-Books', 'Audiobooks');
			if (!ua.hidden) uaData.placeholder = placeholders[isSelectedCategory('Music') ? 0 : 1];
		}
		if (form != null) for (let tagName of ['INPUT', 'SELECT', 'TEXTAREA']) for (let elem of form.getElementsByTagName(tagName))
			if (elem.required && (elem.offsetWidth <= 0 || elem.offsetHeight <= 0)) elem.required = false;
	});
	if (dynamicForm != null) new MutationObserver(function(ml, mo) {
		for (let mutation of ml) for (let node of mutation.addedNodes)
			if (node.nodeType == Node.ELEMENT_NODE && node.matches('table.layout')) {
				yadg = isSelectedCategory('Music') ? yadgObserver(node) : Promise.reject('Non-music category');
				return setDynaHandlers(node);
			}
	}).observe(dynamicForm, { childList: true });
}

if (isGroupEdit) yadg.then(function(yadg) {
	const groupId = parseInt(urlParams.get('groupid'));
	console.assert(groupId > 0, 'groupId > 0');
	if (groupId > 0) queryAjaxAPI('torrentgroup', { id: groupId }).then(function({group}) {
		if (group.categoryId != 1) return; // non-music release
		let searchTerm = decodeHTML(group.name);
		if (group.releaseType != 7) {
			const mainArtists = group.musicInfo[group.musicInfo.dj.length > 0 ? 'dj' : 'artists'].slice(0, 3);
			if (mainArtists.length > 0)
				searchTerm = mainArtists.map(artist => decodeHTML(artist.name)).join(', ') + ' - ' + searchTerm;
		} //else searchTerm = 'Various Artists - ' + searchTerm;
		if ((yadg.input.value = searchTerm) && yadg.submit != null) yadg.submit.click();
	}); else throw 'Group id not present in url';
});

function torrentInputHandler(input) {
	if (!(input instanceof HTMLInputElement)) throw 'Invalid argument';
	input.oninput = function(evt) {
		if (evt.currentTarget.files.length <= 0) return;
		const isMainTorrent = evt.currentTarget.name == 'file_input';
		if (isMainTorrent) {
			for (let message of tfMessages) message.remove();
			tfMessages = [ ];
			hideEmptyMessages();
		}
		for (const torrent of Array.from(evt.currentTarget.files, function getTorrentFromFile(file) {
			if (!(file instanceof Blob)) throw 'Invalid argument';
			return new Promise(function(resolve, reject) {
				const fr = new FileReader;
				fr.onload = evt => { try { resolve(Bencode.decode(evt.currentTarget.result)) } catch(e) { reject(e) } };
				fr.onerror = fr.ontimeout = function(error) {
					console.error('FileReader error (%s):', file.name, error);
					reject(error);
				};
				fr.readAsBinaryString(file);
			});
		})) {
			if (prefs.validate_torrent) torrent.then(function(torrent) {
				const severityLevel = validateTorrentFile(torrent);
				if (isMainTorrent) torrentStats.severityLevel = severityLevel;
			});
			if (isMainTorrent && prefs.care_cd_extras) torrent.then(countTorrentStats);
			if (isMainTorrent && prefs.auto_fill_by_torrent_name) torrent.then(autoFillFromTorrent);
		}
	};
	if (prefs.torrent_input_highlight_color) input.ondragenter = input[`ondrag${'ondragexit' in input ? 'exit' : 'leave'}`] = input.ondrop = function(evt) {
		if (evt.relatedTarget == evt.currentTarget) return false;
		evt.currentTarget.style.backgroundColor = evt.type == 'dragenter' ? prefs.torrent_input_highlight_color : null;
	};
}
if (isUpload) document.body.querySelectorAll('input[type="file"][accept$=".torrent"]').forEach(torrentInputHandler);

if ((ref = document.getElementById('dnulist')) != null) {
	if (ref.querySelector(':scope > tbody > tr strong.important_text') != null)
		for (let tr of ref.querySelectorAll(':scope > tbody > tr:not([class])'))
			if (tr.querySelector('strong.important_text') == null) tr.hidden = true;
	if (document.getElementById('showdnu') == null) {
		function toggleDnuList() {
			let elem = document.getElementById('dnulist');
			if (elem == null) return; // assertion failed
			const hidden = elem.hidden;
			if ((elem = document.getElementById('dnu_header')) != null)
				while ((elem = elem.nextElementSibling) != null) elem.hidden = !hidden;
		}

		toggleDnuList();
		if ((ref = document.getElementById('dnu_header')) != null) {
			ref.style.cursor = 'pointer';
			ref.title = 'Toggle DNU list';
			ref.onclick = toggleDnuList;
		}
	}
}

const findImageInput = () => document.body.querySelector('input#image[type]')
	|| document.body.querySelector('input[name="image"][type]');

class RequestControl {
	constructor(form, checkBoxes = false, setListeners = false) {
		if (!(form instanceof HTMLFormElement)) throw 'Form not initialised';
		this.categories = ['media', 'formats', 'bitrates'];
		const allowedBitrates = Object.freeze({
			'FLAC': ['Lossless', '24bit Lossless'],
			'MP3': ['192', 'APS (VBR)', 'V2 (VBR)', 'V1 (VBR)', '256', 'APX (VBR)', 'V0 (VBR)', '320', 'Other'],
			'AAC': ['192', '256', '320', 'Other'], 'AC3': ['192', '256', '320', 'Other'], 'DTS': ['Other'],
			'DSD': ['DSD64', 'DSD128', 'DSD256', 'DSD512', 'DSD1024'],
			'Vorbis': ['q5.x (VBR)', 'q6.x (VBR)', 'q7.x (VBR)', 'q8.x (VBR)', 'q9.x (VBR)'],
		});
		this.values = { };
		for (let category of this.categories) {
			this.values[category] = { };
			this.values[category].all = form.querySelector('input[name="all_' + category + '"]');
			console.assert(this.values[category].all != null);
			if (setListeners) this.values[category].all.addEventListener('change', this.onAllChange.bind(this));
			this.values[category].all.required = false;
			for (let elem of form.querySelectorAll('input[type="checkbox"][name="' + category + '[]"]')) {
				const label = elem.nextElementSibling;
				console.assert(label.tagName == 'LABEL');
				this.values[category][label.textContent.trim()] = elem;
				if (setListeners) elem.addEventListener('change', this.onChange.bind(this));
				elem.required = false;
			}
		}
		this.dependencies = {
			'CD': { 'FLAC': ['Lossless'], 'MP3': allowedBitrates.MP3, 'AAC': allowedBitrates.AAC, 'Vorbis': allowedBitrates.Vorbis },
			'DVD': { 'FLAC': allowedBitrates.FLAC, 'MP3': allowedBitrates.MP3, 'AAC': allowedBitrates.AAC, 'AC3': allowedBitrates.AC3, 'DTS': allowedBitrates.DTS, 'Vorbis': allowedBitrates.Vorbis },
			'Vinyl': { 'FLAC': allowedBitrates.FLAC, 'MP3': allowedBitrates.MP3, 'AAC': allowedBitrates.AAC, 'Vorbis': allowedBitrates.Vorbis },
			'Soundboard': { 'FLAC': allowedBitrates.FLAC, 'MP3': allowedBitrates.MP3, 'AAC': allowedBitrates.AAC, 'Vorbis': allowedBitrates.Vorbis },
			'SACD': { 'FLAC': allowedBitrates.FLAC, 'MP3': allowedBitrates.MP3, 'AAC': allowedBitrates.AAC, 'Vorbis': allowedBitrates.Vorbis, 'DSD': ['DSD64'] },
			'DAT': { 'FLAC': allowedBitrates.FLAC, 'MP3': allowedBitrates.MP3, 'AAC': allowedBitrates.AAC, 'Vorbis': allowedBitrates.Vorbis },
			'Cassette': { 'FLAC': allowedBitrates.FLAC, 'MP3': allowedBitrates.MP3, 'AAC': allowedBitrates.AAC, 'Vorbis': allowedBitrates.Vorbis },
			'WEB': { 'FLAC': allowedBitrates.FLAC, 'MP3': allowedBitrates.MP3, 'AAC': allowedBitrates.AAC, 'Vorbis': allowedBitrates.Vorbis, 'DSD': allowedBitrates.DSD },
			'Blu-Ray': { 'FLAC': allowedBitrates.FLAC, 'MP3': allowedBitrates.MP3, 'AAC': allowedBitrates.AAC, 'AC3': allowedBitrates.AC3, 'DTS': allowedBitrates.DTS, 'Vorbis': allowedBitrates.Vorbis },
		};
		this.dependencies['Blu-ray'] = this.dependencies['BD'] = this.dependencies['Blu-Ray'];
		if (checkBoxes) this.defaultValues = {
			media: ['CD', 'WEB'],
			formats: ['FLAC', 'MP3'],
			bitrates: {
				'FLAC': allowedBitrates.FLAC, 'MP3': ['V0 (VBR)', '320'], 'AAC': allowedBitrates.AAC,
				'AC3': allowedBitrates.AC3, 'DTS': allowedBitrates.DTS, 'Vorbis': allowedBitrates.Vorbis,
				'DSD': allowedBitrates.DSD,
			},
		};
		for (const name of ['needlog', 'minlogscore', 'needcue', 'needchecksum'])
			this[name] = form.elements.namedItem(name);
	}

	updateControls(cls, applyDefaults = 0) {
		let index = this.categories.indexOf(cls = cls.toLowerCase());
		if (index < 0) throw 'Invalid category class';
		this.values[cls].all.disabled = index > 0 && !this.values[this.categories[index - 1]].all.checked;
		if (this.values[cls].all.disabled) this.values[cls].all.checked = false;
		const allowedValues = new Set, allMedia = Object.keys(this.dependencies);
		if (!this.values[cls].all.checked) switch (cls) {
			case 'media':
				for (let media of allMedia) allowedValues.add(media);
				break;
			case 'formats':
				for (let media of allMedia.filter(media => media in this.values.media && this.values.media[media].checked))
					for (let format in this.dependencies[media]) allowedValues.add(format);
				break;
			case 'bitrates':
				for (let media of allMedia.filter(media => media in this.values.media && this.values.media[media].checked))
					for (let format of Object.keys(this.dependencies[media]).filter(format => format in this.values.formats && this.values.formats[format].checked))
						for (let bitrate of this.dependencies[media][format]) allowedValues.add(bitrate);
				break;
			default: throw 'Invalid category class';
		}
		// if (!this.values[cls].all.checked) {
		// 	let allowedValues = this.dependencies;
		// 	for (let ndx = 0; ndx < index; ++ndx) {
		// 		const category = this.categories[ndx];
		// 		const keys = Object.keys(allowedValues).filter(value => value in this.values[category]
		// 			&& this.values[category][value].checked);
		// 		allowedValues = keys.length > 0 ? Object.assign.apply({ }, keys.map(value => allowedValues[value])) : { };
		// 	}
		// 	allowedValues = new Set(Object.keys(allowedValues));
		// }
		for (let key in this.values[cls]) {
			if (key != 'all') {
				this.values[cls][key].disabled = this.values[cls].all.checked || !allowedValues.has(key);
				if (this.values[cls].all.checked) this.values[cls][key].checked = true;
				else if (this.values[cls][key].disabled) this.values[cls][key].checked = false;
				else if (applyDefaults >= 3 && 'defaultValues' in this && cls in this.defaultValues
						&& (Array.isArray(this.defaultValues[cls]) ? this.defaultValues[cls].includes(key) : index > 0
							&& Object.keys(this.defaultValues[cls]).some(key2 => key2 in this.values[this.categories[index - 1]]
								&& this.values[this.categories[index - 1]][key2].checked
									&& Array.isArray(this.defaultValues[cls][key2]) && this.defaultValues[cls][key2].includes(key))))
					this.values[cls][key].checked = true;
				else if (applyDefaults >= 2 && !this.values[cls].all.checked)
					this.values[cls][key].checked = false;
				if (cls == 'media' && key == 'CD') this.setCDValues(this.values[cls][key].checked);
				else if (cls == 'formats' && key == 'FLAC' && this.values[cls][key].onchange) this.values[cls][key].onchange();
			}
			const label = this.values[cls][key].nextElementSibling;
			console.assert(label != null);
			if (label != null) label.style.opacity = this.values[cls][key].disabled ? 0.4 : 1;
		}
		if (++index < this.categories.length) this.updateControls(this.categories[index], applyDefaults > 0 ? 3 : 0);
	}
	onAllChange(evt) {
		console.assert(!evt.currentTarget.disabled);
		this.updateControls(evt.currentTarget.name.replace(/^all_/, ''), evt.currentTarget.checked ? 2 : 0);
	}
	onChange(evt) {
		console.assert(!evt.currentTarget.disabled);
		this.updateControls(evt.currentTarget.name.replace(/\[\]$/, ''), evt.currentTarget.checked ? 1 : 0);
	}
	select(category, state = true, ...values) {
		if (!this.values[category]) throw 'Invalid argument';
		if (values.length > 0) for (let value of values) {
			if (value in this.values[category] && !this.values[category][value].disabled) this.values[category][value].checked = state;
		} else if (!this.values[category].all.disabled) this.values[category].all.checked = state;
		this.updateControls(category, state ? 1 : values.length > 0 ? 0 : 2);
	}
	anyOf(category, ...values) {
		if (!this.values[category]) throw 'Invalid argument';
		if (values.length > 0) return values.some(value => this.values[category][value] && this.values[category][value].checked);
		return Object.keys(this.values[category]).some(key => this.values[category][key] && this.values[category][key].checked);
	}
	setCDValues(state) {
		if (this.needlog != null) {
			if (this.needlog.checked != Boolean(state) && (!state || prefs.request_prefill_formats)) this.needlog.checked = state;
			this.needlog.disabled = !state;
			this.needlog.nextElementSibling.style.opacity = state ? 1 : 0.4;
			this.needlog.nextElementSibling.nextElementSibling.style.opacity = state ? 1 : 0.4;
			if (state && typeof ToggleLogScore == 'function') ToggleLogScore();
		}
		if (this.minlogscore != null) {
			this.minlogscore.disabled = !state;
			if (state) this.minlogscore.value = 100;
		}
		if (this.needcue != null) {
			if (this.needcue.checked != Boolean(state) && (!state || prefs.request_prefill_formats)) this.needcue.checked = state;
			this.needcue.disabled = !state;
			this.needcue.nextElementSibling.style.opacity = state ? 1 : 0.4;
		}
		if (this.needchecksum != null) {
			if (!state && this.needchecksum.checked) this.needchecksum.checked = false;
			this.needchecksum.disabled = !state;
			this.needchecksum.nextElementSibling.style.opacity = state ? 1 : 0.4;
		}
	}
}

function getRequestDefaults(category) {
	let defaults = category && prefs.new_request_defaults && prefs.new_request_defaults[category];
	if (defaults && !Array.isArray(defaults)) defaults = defaults.aplit(/\s*[,;]+\s*/);
	return Array.isArray(defaults) && defaults.length > 0 ? defaults : undefined;
}

if (isRequestFormat) {
	function inputEnabler(mutationsList, mo) {
		mo.disconnect();
		for (let mutation of mutationsList) mutation.target.readOnly = false;
	}
	for (let name of ['title', 'tags']) for (let elem of form.querySelectorAll(`input[name="${name}"]`))
		if (elem.readOnly) elem.readOnly = false;
			else new MutationObserver(inputEnabler).observe(elem, { attributes: true, attributeFilter: ['readonly'] });
}
if (isRequestNew) {
	const input = document.getElementById('amount_box'), unit = document.getElementById('unit');
	if (input != null) {
		input.type = 'number';
		input.style.width = '6em';
		input.title = 'Use wheel control to navigate through quick bounty presets';
		if (Array.isArray(prefs.bounty_presets)) {
			const datalist = document.createElement('DATALIST');
			datalist.id = 'bounties';
			for (let amount of prefs.bounty_presets.concat(prefs.bounty_presets
					.filter(x => x >= 2**10).map(x => Math.round(x / 2**10))).distinctValues()) {
				const option = document.createElement('option');
				option.value = amount;
				datalist.append(option);
			}
			input.before(datalist);
			input.setAttribute('list', datalist.id);
		}
		input.ondblclick = evt => { if (evt.currentTarget.value) evt.currentTarget.value = '' };
		if (unit != null) input.onmousewheel = input.onwheel = function(evt) {
			if (!evt.deltaY && !evt.deltaX || !Array.isArray(prefs.bounty_presets)) return;
			switch (unit != null && unit.value.toLowerCase()) {
				case 'gb':
					var bountyPresets = prefs.bounty_presets.filter(x => x >= 2**10).map(x => x / 2**10).distinctValues();
					break;
				case 'mb':
				default:
					bountyPresets = prefs.bounty_presets.distinctValues();
			}
			let amount = parseFloat(evt.currentTarget.value) || 0;
			switch (Math.sign(Math.sign(evt.deltaX) - Math.sign(evt.deltaY))) {
				case +1: amount = Math.min(...bountyPresets.filter(x => x > amount)); break;
				case -1: amount = Math.max(...bountyPresets.filter(x => x < amount)); break;
				default: return;
			}
			if (isFinite(amount)) {
				evt.currentTarget.value = amount;
				if (typeof evt.currentTarget.onchange == 'function') evt.currentTarget.onchange();
					else notifyChange(evt.currentTarget); //Calculate();
			}
			return false;
		}
	}
}
if (form != null && (isRequestNew || isRequestEdit)) {
	const reqControl = new RequestControl(form, prefs.request_prefill_formats, true);
	if (isRequestNew) for (let category of reqControl.categories) reqControl.select(category);
}

setAjaxApiLogger(function(action, timeFrame, timeStamp) {
	const delay = timeFrame.expiresAt - timeStamp;
	if (delay <= 1000 && prefs.messages_verbosity < 1) return;
	let message = `waiting ${Math.ceil(delay / 1000)} s for next AJAX timeframe`;
	if (prefs.diag_mode) message += `; action=${action} (${timeFrame.requestCounter})`;
	addMessage(message, 'info');
});

if (urlParams.has('category') && category != null && !category.disabled) {
	let _category = urlParams.get('category');
	if (parseInt(_category) >= 0 || (_category = Array.prototype.find.call(category.options,
			option => option.text.toLowerCase() == _category.toLowerCase())) && (_category = _category.value)) {
		category.value = _category;
		category.dispatchEvent(new Event('change'));
	}
}
if (urlParams.has('url')) {
	const url = urlParams.get('url'), fillMode = urlParams.get('ua-fill-mode');
	const uaData = document.getElementById('ua-data');
	if (uaData != null && httpParser.test(url)) {
		uaData.value = url;
		const evt = new Event('url-param');
		if (fillMode && fillMode.toLowerCase() == 'overwrite') evt.altKey = true;
		fillFromText(evt);
	}
}

if (typeof GM_registerMenuCommand == 'function' && typeof GM_setClipboard == 'function')
	GM_registerMenuCommand('Store foobar2000\'s copy format string to clipboard', function setFormatString() {
		GM_setClipboard(fb2kFormat, 'text');
		alert('Clipboard set, paste it to Preferences > Display > Classic User Interface > Title Formatting > Copy command');
	});

const queryAppleAPI = (endPoint, params, market = 'us') => endPoint ? (function() {
	const configValidator = config => config && config.MEDIA_API && config.MEDIA_API.token
		&& (!config.timeStamp || config.timeStamp + 7 * 24 * 60*60*1000 >= Date.now() + 30 * 1000);
	if ('appleMusicDesktopConfig' in localStorage) try {
		var config = JSON.parse(localStorage.getItem('appleMusicDesktopConfig'));
		if (!configValidator(config)) throw 'Expired or incomplete cached Apple Music desktop environment';
		if (prefs.diag_mode) console.info('Re-using cached Apple Music desktop environment:', config);
		return Promise.resolve(config);
	} catch(e) {
		console.info(e, localStorage.appleMusicDesktopConfig);
		localStorage.removeItem('appleMusicDesktopConfig');
	}
	const timeStamp = Date.now();
	return globalXHR('https://music.apple.com/').then(function({document}) {
		if ((config = document.head.querySelector('meta[name="desktop-music-app/config/environment"][content]')) != null) try {
			(config = JSON.parse(decodeURIComponent(config.content))).timeStamp = timeStamp;
			if (configValidator(config)) return config;
		} catch(e) { console.warn('Invalid Apple Music desktop environment format:', e, config.content) }
		if ((config = document.head.querySelector('script[type="module"][src]')) != null)
			return globalXHR(new URL(config.getAttribute('src'), 'https://music.apple.com'), { responseType: 'text' }).then(({responseText}) =>
				(config = /\b(?:const\s+kd\s*=\s*['"]([^\s'"]{64,}?)|\w+\s*=\s*['"]([^\s'"]{268}))['"]/.exec(responseText)) != null && configValidator(config = {
					MEDIA_API : { token: config[1] || config[2] },
					timeStamp: timeStamp,
				}) ? config : Promise.reject('Missing Apple Music OAuth2 token'));
		return Promise.reject('Missing Apple Music OAuth2 token');
	}).then(function(config) {
		console.info('Apple Music OAuth2 token successfully extracted:', config.MEDIA_API.token);
		localStorage.setItem('appleMusicDesktopConfig', JSON.stringify(config));
		return config;
	});
})().then(function request(config) {
	if (!config.retryCounter) config.retryCounter = 0;
	let url = config.MUSIC && config.MUSIC.BASE_URL || 'https://amp-api.music.apple.com/v1';
	url = new URL(`${url}/catalog/${market || 'us'}/${endPoint.replace(/^\/+|\/+$/g, '')}`);
	if (params) url.search = new URLSearchParams(params);
	url.searchParams.set('omit[resource]', 'views,meta,autos');
	url.searchParams.set('l', config.i18n && config.i18n.defaultLocale || 'en-us');
	url.searchParams.set('platform', 'web');
	return globalXHR(url, {
		responseType: 'json',
		headers: {
			Referer: 'https://music.apple.com/',
			Origin: 'https://music.apple.com',
			Host: url.hostname,
			Authorization: 'Bearer ' + config.MEDIA_API.token,
		},
	}).then(({response}) => response, function(reason) {
		let status = /^HTTP error (\d+)\b/.exec(reason);
		if (status != null) status = parseInt(status[1]);
		if ([400, 401, 403].includes(status)) {
			localStorage.removeItem('appleMusicDesktopConfig');
			if (config.retryCounter++ <= 0) return request(config);
			alert('Apple Music request problem:\n' + reason + '\n(retry with new token)');
			//return queryAppleAPI(endPoint, params);
		}
		return Promise.reject(reason);
	});
}) : Promise.reject('Endpoint is missing');

const tidalAccess = {
	apiBase: 'https://api.tidal.com/v1',
	clientId: GM_getValue('tidal_clientid', localStorage.getItem('tidalClientId')
		|| '7m7Ap0JC9j1cOM3n' || 'zU4XHVVkc2tDPo4t'),
	clientSecret: GM_getValue('tidal_clientsecret', localStorage.getItem('tidalClientSecret')
		|| 'vRAdA108tlvkJpTsGZS8rGZ7xTlbJ0qaZ2K9saEzsgY=' || 'VJKhDFqJPqvsPVNBV6ukXTJmwlvbttP7wlMlrc72se4='),
	auth: null,

	authorize: function(weakRequest = false) {
		const oAuth2base = 'https://auth.tidal.com/v1/oauth2',
					devAuthEndpoint = oAuth2base + '/device_authorization',
					tokenEndpoint = oAuth2base + '/token',
					scopes = ['r_usr', 'w_usr', 'w_sub'];
		const isTokenValid = accessToken => typeof accessToken == 'object' && accessToken.token_type
			&& accessToken.access_token && accessToken.expires_at >= Date.now() + oAuth2timeReserve * 1000;
		const isSessionValid = session => session && typeof session == 'object' && session.userId > 0 && session.sessionId;
		const authMethods = {
			'SessionId': () => Promise.reject('Method removed'),
			'DeviceToken': () => Promise.resolve([undefined, { 'token': this.clientId }]),
			'OAuth2': () => (function() {
				if ('tidalAccessToken' in localStorage) try {
					var accessToken = JSON.parse(localStorage.tidalAccessToken);
					if (isTokenValid(accessToken)) {
						if (prefs.diag_mode) console.debug('Re-using Tidal access token:', accessToken,
							'expires at', new Date(accessToken.expires_at).toLocaleString(),
							'(' + makeTimeString((accessToken.expires_at - Date.now()) / 1000) + ')');
						return Promise.resolve(accessToken);
					}
				} catch(e) { localStorage.removeItem('tidalAccessToken') }
				if (!this.clientId || !this.clientSecret)
					return Promise.reject('Tidal credentials not configured (OAuth2-deviceFlow)');
				let timeStamp;
				return (accessToken && accessToken.refresh_token ? (function() {
					timeStamp = Date.now();
					return globalXHR(tokenEndpoint, { responseType: 'json' }, new URLSearchParams({
						grant_type: 'refresh_token',
						refresh_token: accessToken.refresh_token,
						client_id: this.clientId,
						client_secret: this.clientSecret,
					})).then(({response}) => {
						if (!response.refresh_token) response.refresh_token = accessToken.refresh_token;
						return response;
					});
				}).call(this) : Promise.reject('Cached token not available')).catch(reason => {
					if (weakRequest && 'tidalLoginSuccess' in localStorage
							&& !JSON.parse(localStorage.getItem('tidalLoginSuccess')))
						return Promise.reject('Skipping prompt to login (weak request)');
					return globalXHR(devAuthEndpoint, { responseType: 'json' }, new URLSearchParams({
						client_id: this.clientId,
						scope: scopes.join(' '),
					})).then(({response}) => new Promise((resolve, reject) => {
						//console.debug('[Tidal] device_authorization:', response);
						const loginWnd = GM_openInTab('https://' + response.verificationUriComplete,
							{ active: true, insert: true, setParent: true });
						const expiry = Date.now() + response.expiresIn * 1000, interval = response.interval * 1000;
						let msg = 'to continue, please authorize the script with your Tidal account in the newly opened tab';
						if (weakRequest) msg += '.\nIf not having Tidal account or don\'t want to use the service, just close the tab.';
						addMessage(msg, 'notice');
						(function askToken() {
							timeStamp = Date.now();
							GM_xmlhttpRequest({
								method: 'POST',
								url: tokenEndpoint,
								headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' },
								data: new URLSearchParams({
									client_id: this.clientId,
									client_secret: this.clientSecret,
									device_code: response.deviceCode,
									grant_type: 'urn:ietf:params:oauth:grant-type:device_code', //'authorization_code',
									scope: scopes.join(' '),
								}).toString(),
								responseType: 'json',
								onload: response => {
									const errorString = () => response.response.status + '/' + response.response.sub_status +
										'/' + response.response.error + ': ' + response.response.error_description;
									//console.debug('[Tidal] token:', response.response);
									if (response.status >= 200 && response.status < 400) {
										if (!loginWnd.closed) loginWnd.close();
										resolve(response.response);
									} else if (response.status == 400 && response.response.error == 'authorization_pending') {
										if (Date.now() <= expiry)
											if (!loginWnd.closed) setTimeout(askToken.bind(this), interval);
												else reject('athorization by user cancelled');
										else {
											if (!loginWnd.closed) loginWnd.close();
											reject('athorization by user not completed in time (' + errorString() + ')');
										}
									} else {
										if (!loginWnd.closed) loginWnd.close();
										reject('HTTP/' + response.status + ' (' + response.statusText + '); ' + errorString());
									}
								},
								onerror: response => { reject(defaultErrorHandler(response)) },
								ontimeout: response => { reject(defaultTimeoutHandler(response)) },
							});
						}).call(this);
					}));
				}).then(response => {
					if (typeof response != 'object') throw 'invalid response';
					console.assert(timeStamp > 0, 'timeStamp > 0');
					accessToken = response;
					if (!accessToken.timestamp) accessToken.timestamp = timeStamp;
					if (!accessToken.expires_at) accessToken.expires_at = accessToken.timestamp +
						(accessToken.expires_in_ms || accessToken.expires_in * 1000);
					if (!isTokenValid(accessToken)) {
						console.warn('Ivalid Tidal token received:', accessToken);
						return Promise.reject('invalid token received');
					}
					localStorage.setItem('tidalAccessToken', JSON.stringify(accessToken));
					return accessToken;
				});
			}).call(this).then(accessToken => [{ 'Authorization': `${accessToken.token_type} ${accessToken.access_token}` }]),
		};
		const authSequence = [/*'SessionId', 'DeviceToken'*/];
		authSequence['tidalAccessToken' in localStorage ? 'unshift' : 'push']('OAuth2');
		return (this.auth || (this.auth = (function tidalAuth(index = 0) {
			const method = authMethods[authSequence[index]];
			if (typeof method == 'function') return method.call(this).catch(reason => {
				console.warn('Tidal ' + authSequence[index] + ' auth metod failed:', reason);
				return tidalAuth.call(this, index + 1);
			});
			//this.auth = null;
			localStorage.setItem('tidalLoginSuccess', false);
			return Promise.reject('all auth methods failed');
		}).call(this)));
	},
	requestAPI: function(endPoint, params, countryCode = 'US') {
		if (!endPoint) return Promise.reject('No API endpoint');
		const weakRequest = /^(?:search)\//i.test(endPoint);
		return (function apiCall() {
			return this.authorize(weakRequest).then(credentials => {
				if ('tidalLoginSuccess' in localStorage) localStorage.removeItem('tidalLoginSuccess');
				setTimeout(() => { this.auth = null }, 5000);
				const url = new URL(endPoint, this.apiBase);
				return globalXHR(this.apiBase + '/' + endPoint + '?' + new URLSearchParams(Object.assign({ }, params || { }, {
					deviceType: 'BROWSER',
					locale: 'en_US',
					countryCode: countryCode,
				}, credentials[1] || { })).toString(), {
					responseType: 'json',
					headers: credentials[0],
				}).then(({response}) => response, reason => {
					if (!/^(?:HTTP error (401))\b/i.test(reason) || !('tidalAccessToken' in localStorage))
						return Promise.reject(reason);
					localStorage.removeItem('tidalAccessToken');
					if (weakRequest) return Promise.reject(reason);
					this.auth = null;
					return apiCall.call(this);
				});
			});
		}).call(this);
	},
};

const mixcloudQuery = (query, variables) => ('mixcloudCsrfToken' in sessionStorage ?
		Promise.resolve(sessionStorage.getItem('mixcloudCsrfToken')) : globalXHR('https://www.mixcloud.com/', { method: 'HEAD' }).then(function(response) {
	let csrfToken = /^set-cookie:.*\b(?:csrftoken)\s*=\s*(\w+)\b/im.exec(response.responseHeaders);
	if (csrfToken != null) csrfToken = csrfToken[1]; else return Promise.reject('No CSRF token returned');
	sessionStorage.setItem('mixcloudCsrfToken', csrfToken);
	return csrfToken;
})).then(csrfToken => globalXHR('https://www.mixcloud.com/graphql', {
	responseType: 'json',
	headers: { 'X-CSRFToken': csrfToken },
}, { query: query || { }, variables: variables || { } })).then(({response}) => response.data);

let siteTagsCache;
if ('siteTagsCache' in localStorage) try { siteTagsCache = JSON.parse(localStorage.getItem('siteTagsCache')) }
	catch(e) { siteTagsCache = undefined }
if (!siteTagsCache) siteTagsCache = { };
const getAmazonCfg = (url = 'https://music.amazon.com/') => globalXHR(url = new URL(url), { headers: { 'User-Agent': UA } }).then(function(response) {
	let preConnect = response.document.head.querySelector('link[rel="preconnect"]');
	if (preConnect != null) preConnect = preConnect.href; else throw 'Assertion failed: preConnect != null';
	for (var appConfig of response.document.head.getElementsByTagName('SCRIPT'))
		if ((appConfig = /^\s*(?:window\.amznMusic)\s*=\s*(\{[\S\s]+\});\s*$/.exec(appConfig.text)) != null) try {
			appConfig = eval('(' + appConfig[1] + ')').appConfig;
			break;
		} catch (e) { console.warn(e) }
	if (!appConfig) throw 'Assertion failed: amznMusic != null';
	sessionStorage.setItem('amznAppConfig', JSON.stringify(appConfig));
	if (prefs.diag_mode) console.debug('Amazon appConfig:', appConfig);
	return {
		urlBase: preConnect,
		headers: {
			'User-Agent': UA,
			'Referer': url.href,
			'x-amzn-authentication': JSON.stringify({
				interface: 'ClientAuthenticationInterface.v1_0.ClientTokenElement',
				accessToken: appConfig.accessToken,
			}),
			'x-amzn-request-id': uuid(),
			'x-amzn-session-id': appConfig.sessionId,
			'x-amzn-timestamp': Date.now(),
			'x-amzn-page-url': url.href,
			'x-amzn-csrf': JSON.stringify({
				interface: 'CSRFInterface.v1_0.CSRFHeaderElement',
				token: appConfig.csrf.token,
				timestamp: appConfig.csrf.ts,
				rndNonce: appConfig.csrf.rnd,
			}),
			'x-amzn-application-version': appConfig.version,
			'x-amzn-currency-of-preference': 'USD' || appConfig.currencyOfPreference,
			'x-amzn-device-family': 'RetailWebPlayer.web',
			'x-amzn-device-model': 'WEBPLAYER',
			'x-amzn-device-type': appConfig.deviceType,
			'x-amzn-device-id': appConfig.deviceId,
			'x-amzn-device-language': 'en_US' || appConfig.displayLanguage,
			'x-amzn-device-time-zone': 'Etc/UTC' || makeTimeString(-new Date().getTimezoneOffset(), true),
			'x-amzn-os-version': '1.0',
			'x-amzn-device-width': 1920,
			'x-amzn-device-height': 1080,
			'x-amzn-user-agent': UA,
			'x-amzn-affiliate-tags': '',
			'x-amzn-ref-marker': '',
			'x-amzn-music-domain': url.hostname,
			'x-amzn-referer': url.href,
			'x-amzn-page-url': url.href,
			'x-amzn-weblab-id-overrides': '',
			'x-amzn-video-player-token': '',
			'x-amzn-feature-flags': 'hd-supported',
		},
	};
	return Promise.reject('Config could not be extracted');
});

function checkBarcode(barcode, allowAddCheckDigit = false) {
	if (!barcode || !/^\d+$/.test(barcode = barcode.replace(/\W+/g, '')) || barcode.length < 7)
		return console.info('Invalid barcode: %s (%s)', barcode, 'invalid format');
	const typeString = { 8: 'EAN-8', 12: 'UPC', 13: 'EAN-13', 14: 'GTIN' };
	const validated = (function checkBarcode(barcode) {
		const digits = Array.from(barcode, ch => parseInt(ch));
		const checkDigit = (effectiveLength = digits.length) => digits.length > 0 && effectiveLength > 0 ?
			(10 - digits.slice(0, effectiveLength).reverse().reduce((sum, digit, index) =>
				sum + digit * ((index & 1) == 0 ? 3 : 1), 0) % 10) % 10 : undefined;
		const checkDigitAt = (skipNumbers = 0) => checkDigit(digits.length - 1 - skipNumbers)
			== digits[digits.length - 1 - skipNumbers];
		if (typeString[digits.length] && checkDigitAt(0)) {
			console.info('Valid %s:', typeString[barcode.length], barcode);
			return barcode;
		} else if (typeString[digits.length - 2] && checkDigitAt(2)) {
			barcode = barcode.slice(0, -2);
			console.info('Valid %s with 2 char add-on code:', typeString[barcode.length], barcode);
			return barcode;
		} else if (typeString[digits.length - 5] && checkDigitAt(5)) {
			barcode = barcode.slice(0, -5);
			console.info('Valid %s with 5 char add-on code:', typeString[barcode.length], barcode);
			return barcode;
		} else if (typeString[digits.length + 1] && allowAddCheckDigit) {
			barcode += checkDigit(digits.length);
			console.info('Valid %s after adding check digit:', typeString[barcode.length], barcode);
			return barcode;
		} else if (digits.length < 18) return checkBarcode('0' + barcode);
	})(barcode);
	if (validated) return validated;
	console.info('Invalid barcode: %s (%s)', barcode,
		typeString[barcode.length] ? 'check digit mismatch' : 'invalid length');
}

/*******************************************************************************************************************************
 *                                                                                                                             *
 *                                                      DESCRIPTION MAKER                                                      *
 *                                                                                                                             *
 *******************************************************************************************************************************/
function fillFromText(evt) {
	if (!(uaData instanceof HTMLTextAreaElement)) throw '!(uaData instanceof HTMLTextAreaElement)';
	if (autoFill) {
		clearTimeout(autoFill);
		autoFill = undefined;
	}
	const overwrite = evt instanceof Event && (evt.type == 'click' ? evt.target.id == 'autofill-form-1' : evt.altKey);
	const hyperlinkStyle = 'color: skyblue;',
				bracketStripper = /\s+(\([^\(\)]+\)|\[[^\[\]]+\]|\{[^\{\}]+\})/g,
				tailingBracketStripper = /(?:\s+(\([^\(\)]+\)|\[[^\[\]]+\]|\{[^\{\}]+\}))+\s*$/,
				quoteDetector = /\[(?:quote(?:=[^\[\]]*)?|\/quote)\]/i,
				reportedDupes = new Map, reportedRequests = new Map, reportedGroups = new Map;
	//let promise = clientInformation.clipboard.readText().then(text => uaData = text);
	//if (typeof uaData != 'string') return false;
	let i, matches, sourceUrl;
	if (typeof relationsCheckTimer == 'number') {
		clearInterval(relationsCheckTimer);
		relationsCheckTimer = null;
	}
	const failhandler = reason => { addMessage(reason, 'critical') };
	if (category != null) switch (selectedCategoryName()) {
		case 'Music': return fillFromText_Music();
		case 'Applications': return fillFromText_Apps().then(lookupNonMusicRelations, failhandler);
		case 'E-Books': case 'Audiobooks': return fillFromText_Ebooks().then(lookupNonMusicRelations, failhandler);
		default:
			console.warn('Assertion failed: unexpected category', category);
			throw 'Not supported category';
	} else return isTorrentEdit || form.elements.namedItem('releasetype') != null ? fillFromText_Music()
			: fillFromText_Apps(true).catch(reason => fillFromText_Ebooks(true)).then(lookupNonMusicRelations, failhandler);

	function fillFromText_Music() {
		clearTfMessages();
		const divs = ['—', '⸺', '⸻'];
		const vaParser = /^(?:Various(?:\s+Artists)?|Varios(?:\s+Artistas)?|V\/?A|\<various\s+artists\>|Různí(?:\s+interpreti)?)$/i;
		const VA = 'Various Artists';
		const multiArtistParsers = [
			/\s*[\,\;\u3001](?!\s*(?:[JjSs]r)\b)(?:\s*(?:[Aa]nd|\&)\s+)?\s*/,
			/\s+(?:[\/\|\×]|meets)\s+/i,
		];
		const ampersandParsers = [
			/\s+(?:meets|vs\.?|X)\s+(?!\s*(?:[\&\/\+\,\;]|and))/i,
			/\s*[;\/\|\×]\s*(?!\s*(?:\s*[\&\/\+\,\;]|and))/i,
			/(?:\s*,)?\s+(?:[\&\+]|and)\s+(?!his\b|her\b|Friends$|Strings$)/i, // /\s+(?:[\&\+]|and)\s+(?!(?:The|his|her|Friends)\b)/i,
			/\s*\+\s*(?!(?:his\b|her\b|Friends$|Strings$))/i,
		];
		const featArtistParsers = [
			///\s+(?:meets)\s+(.+?)\s*$/i,
			/* 0 */ /\s+(?:[Ww](?:ith|\.?\/)|(?:(?:[Ee]n\s+)?[Dd]uo\s+)?[Aa]vec)\s+(?!his\b|her\b|Friends$|Strings$)(.+?)\s*$/,
			/* 1 */ /(?:\s+[\‐\-\−\—\–\_])?\s+(?:[Ff]eaturing\s+|(?:(?:[Ff]eat\.?|(?:[Ff]t|FT)\.))\s*|[Ff]\.?\/\s+)([^\(\)\[\]\{\}]+?)(?=\s*(?:[\(\[\{].*)?$)/,
			/* 2 */ /\s+\[\s*f(?:eat(?:\.?|uring)|t\.|\.?\/)\s+([^\[\]]+?)\s*\]/i,
			/* 3 */ /\s+\(\s*f(?:eat(?:\.?|uring)|t\.|\.?\/)\s+([^\(\)]+?)\s*\)/i,
			/* 4 */ /\s+\[\s*(?:(?:en\s+)?duo\s+)?avec\s+([^\[\]]+?)\s*\]/i,
			/* 5 */ /\s+\(\s*(?:(?:en\s+)?duo\s+)?avec\s+([^\(\)]+?)\s*\)/i,
			/* 6 */ /\s+\[\s*(?:with|[Ww]\.?\/)\s+(?![Hh]is\b|[Hh]er\b|Friends$|Strings$)([^\[\]]+?)\s*\]/,
			/* 7 */ /\s+\(\s*(?:with|[Ww]\.?\/)\s+(?![Hh]is\b|[Hh]er\b|Friends$|Strings$)([^\(\)]+?)\s*\)/,
		];
		const pseudoArtistParsers = [
			/* 0 */ vaParser,
			/* 1 */ /^(?:#??N[\/\-]?A|[JS]r\.?|Unknown(?:\s+Artist)?)$/i,
			/* 2 */ /^(?:auditorium|[Oo]becenstvo|[Pp]ublikum)$/,
			/* 3 */ /^(?:(Special\s+)??Guests?|Friends|(?:Studio\s+)?Orchestra)$/i,
			/* 4 */ /^(?:Various\s+Composers)$/i,
			/* 5 */ /^(?:[Aa]nonym)/,
			/* 6 */ /^(?:traditional|trad\.|lidová|tradicionális)$/i,
			/* 7 */ /\b(?:traditional|trad\.|lidová|tradicionális)$/,
			/* 8 */ /^(?:tradiční|lidová)\s+/,
			/* 9 */ /^(?:[Ll]iturgical\b|[Ll]iturgick[áý])/,
		];
		const remixParsers = [
			/\s+\((?:The\s+)?(?:Remix|RMX)(?:e[sd])?\)/i,
			/\s+\[(?:The\s+)?(?:Remix|RMX)(?:e[sd])?\]/i,
			/\s+(?:The\s+)?(?:Remix|RMX)(?:e[sd])?\s*$/i,
			/^(?:The\s+)?(?:(?:Remix|RMX)s)\b|\b(?:The\s+)?(?:Remixes)$/,
			/\s+\(([^\(\)]+?)[\'\’\`]s[^\(\)]*\s(?:(?:Re)?Mix|RMX|Reworx)\)/i,
			/\s+\[([^\[\]]+?)[\'\’\`]s[^\[\]]*\s(?:(?:Re)?Mix|RMX|Reworx)\]/i,
			/\s+\(([^\(\)]+?)\s+(?:(?:Extended|Enhanced)\s+)?(?:Remix|RMX|Reworx)\)/i,
			/\s+\[([^\[\]]+?)\s+(?:(?:Extended|Enhanced)\s+)?(?:Remix|RMX|Reworx)\]/i,
			/\s+\((?:Remix|RMX)(?:ed)?\s+by\s+([^\(\)]+)\)/i,
			/\s+\[(?:Remix|RMX)(?:ed)?\s+by\s+([^\[\]]+)\]/i,
			/(?:\s+[\‐\-\−\—\–]|:)\s+(.+?)\s+(?:Remix|RMX)$/i,
		];
		const arrParsers = [
			/\s+\(arr(?:anged\s+by|\.)\s+([^\(\)]+?)\s*\)/i,
			/\s+\[arr(?:anged\s+by|\.)\s+([^\[\]]+?)\s*\]/i,
		];
		const otherArtistsParsers = [
			[/^(.*?)\s+(?:under|(?:conducted)\s+by)\s+(.*)$/, 4],
			[/^()(.*?)\s+\(conductor\)$/i, 4],
			//[/^()(.*?)\s+\(.*\)$/i, 1],
		];
		const labelSubstitutes = [
			[/^(?:DG)$/, 'Deutsche Grammophon'],
			[/^(?:Not\s+specified)$/i, ''],
			//[/(?:\s*[\,\/])?\s+a\s+division\s+of\s+/i, ' / '],
			//[/\s+\(a\s+division\s+of\s+([^\(\)]+)\)/i, ' / $1'],
		];
		const artistClassParsers = [
			/* 0 */ [/^(?:Main\s?Artist)$/i],
			/* 1 */ [/^(?:Featured\s?Artist)$/i],
			/* 2 */ [/^(?:Remix)/i],
			/* 3 */ [/(?:^(?:Composer|(?:Composer)?Lyricist|Author|Writer|music|written[\s\-]by|libreto|music\simprovisation)|\b(?:lyrics))$/i],
			/* 4 */ [/^(?:Conductor|(?:Chorus|Choir)\s?Master|Director|conducts|(?:conducted|directed)[\s\-]by)$/i],
			/* 5 */ [/^(?:DJ|Compiler|Compiled[\s\-]By|compiled[\s\-]by)$/],
			/* 6 */ [/^(?:Producer|produced[\s\-]by)$/i],
			/* 7 */ [/^(?:Artist|Soloist|Vocals|Ensemble|Orchestra|Choir)$/i],
			/* 8 */ [/^(?:Arranger|Arranged[\s\-]by)$/i],
			/* 9 */ [
				/\b(?:Recorded|Engineer|Producer|Mixer|Programming|Programmer|Assistant|Translation)\b/i,
				/(?:PersonnelMastering)\b/i,
			],
		];
		const missingSpacesTest = /\b(?:(?:Vol|No)\.)(?:\d+|[IVXLCDM]+)\b|\w[\,\;\:]\S|[\?\!\)\]\}][^\,\.\;\?\!\s]|\S[\(\[\{]/;
		const twoOrMore = artist => typeof artist == 'string' && artist.length >= 2; //&& !pseudoArtistParsers.some(rx => rx.test(artist))
		const looksLikeTrueName = (artist, index = 0) => twoOrMore(artist)
			&& (index <= 0 || !/^(?:(?:his|her)\b|Friends$|Strings$|Orchestra$)/i.test(artist))
			&& artist.split(/\s+/).length >= 2 && !pseudoArtistParsers.some(rx => rx.test(artist)) || getSiteArtist(artist);
		let isVA, ajaxRejects = 0;
		if (httpParser.test(uaData.value)) try { var onlineSource = new URL(uaData.value) } catch(e) { }
		return (function() {
			if (onlineSource) return urlResolver(onlineSource).then(fetchOnline_Music);
			const fields = [
				/* 00 */ 'artist', 'album', 'album_year', 'release_date', 'label', 'catalog', 'country', 'encoding',
				/* 08 */ 'codec', 'codec_profile', 'bitrate', 'bitdepth', 'samplerate', 'channels', 'channel_mode',
				/* 15 */ 'media', 'genre', 'disc_number', 'total_discs', 'disc_subtitle', 'track_number',
				/* 21 */ 'total_tracks', 'title', 'track_artist', 'performer', 'composer', 'conductor', 'remixer',
				/* 28 */ 'compiler', 'producer', /*'arranger', */'duration', 'samples', 'filesize', 'album_gain', 'album_peak',
				/* 35 */ 'track_gain', 'track_peak', 'album_dr', 'track_dr', 'vendor', 'url', 'dirpath', 'filename',
				/* 43 */ 'description', 'identifiers', 'lyrics',
			];
			return Promise.resolve(uaData.value.split(/(?:\r?\n)+/).filter(line => line.trim().length > 0).map(function(line, ndx) {
				let metaData = line.expand().split('\x1E'), track = { identifiers: {} }, identifiers = [ ];
				const patternHint = ' (see browser\'s console for details and update your player\'s format ' +
					'pattern from this script header, by the script\'s menu command or from Greasy Fork description)';
				if (metaData.length < fields.length) {
					console.error('invalid data format for track #' + (ndx + 1) + ': length:', metaData.length,
						'(' + fields.length + '); metaData:', metaData, '; line:', line);
					throw 'invalid clipboard data format for track #' + (ndx + 1) + patternHint;
				} else if (metaData.length > fields.length) {
					console.warn('unexpected data format for track #' + (ndx + 1) + ': length:', metaData.length,
						'(expected length: ' + fields.length + '); metaData:', metaData, '; line:', line);
					addMessage('unexpected clipboard data format for track #' + (ndx + 1) + patternHint, 'warning');
				}
				fields.forEach(function(propName) {
					if (propName == 'identifiers') {
						metaData.shift().trim().split(/\s+/).forEach(function(id) {
							if (/^([\w\-]+)[=:](\S*)$/.test(id)) track.identifiers[RegExp.$1.toUpperCase()] = RegExp.$2.replace(/\x1B/g, ' ');
						});
					} else {
						track[propName] = metaData.shift();
						if (track[propName] === '') track[propName] = undefined;
					}
				});
				if (prefs.check_whitespace) {
					Object.keys(track).forEach(function(propName) {
						if (typeof track[propName] != 'string') return;
						if (!['description', 'lyrics'].includes(propName) && (track[propName].includes('\r') || track[propName].includes('\n'))) {
							track[propName] = track[propName].replace(/[\r\n]+/g, '');
							addMessage('track #' + (ndx + 1) + ' contains linebreaks in tag <' + propName + '>', 'warning');
						}
						if ((i = ['description', 'lyrics'].includes(propName) ? /[\x00-\x08\x0B\x0C\x0E-\x19]+/g : /[\x00-\x19]+/g).test(track[propName])) {
							track[propName] = track[propName].replace(i, '');
							addMessage('track #' + (ndx + 1) + ' contains control codes in tag <' + propName + '>', 'warning');
						}
						if (/^[\s\xA0]+$/.test(track[propName])) {
							track[propName] = undefined;
							addMessage('track #' + (ndx + 1) + ' in tag <' + propName + '> contains only whitespace', 'warning');
						} else if (/^[\s\xA0]+|[\s\xA0]+$/.test(track[propName])) {
							track[propName] = track[propName].trim();
							addMessage('track #' + (ndx + 1) + ' in tag <' + propName + '> contains leading/trailing whitespace', 'warning');
						}
						if (/[ \xA0]{2,}/.test(track[propName])) {
							track[propName] = track[propName].replace(/[ \xA0]{2,}/g, ' ')
							addMessage('track #' + (ndx + 1) + ' in tag <' + propName + '> contains multiple spaces', 'warning');
						}
					});
					if (missingSpacesTest.test(track.title))
						addMessage('missing space in track #' + (ndx + 1) + ' title: "' + track.title + '"', 'notice');
				}
				['description', 'lyrics'].forEach(function(propName) {
					if (track[propName] == '.') track[propName] = undefined; else if (track[propName]) {
						if (prefs.remap_texttools_newlines)
							track[propName] = track[propName].replace(/__/g, '\r\n').replace(/_/g, '\n') // ambiguous
					}
				});
				[
					'bitrate', 'bitdepth', 'samplerate', 'channels', 'total_discs', 'total_tracks', 'samples',
					'filesize', 'album_dr', 'track_dr',
				].forEach(function(propName) {
					if (track[propName] !== undefined && typeof track[propName] != 'number')
						track[propName] = parseInt(track[propName]);
				});
				['duration', 'album_peak', 'track_peak'].forEach(function(propName) {
					if (track[propName] !== undefined && typeof track[propName] != 'number')
						track[propName] = parseFloat(track[propName]);
				});
				['album_gain', 'track_gain'].forEach(function(propName) {
					if (track[propName] === '') track[propName] = undefined;
					else if (track[propName] !== undefined && typeof track[propName] != 'number')
						track[propName] = parseFloat(track[propName].replace(/\s*\b(?:dB)\s*$/i, ''));
				});
				if (track.album_year) track.album_year = extractYear(track.album_year) || NaN;
				return track;
			}));
		})().then(parseTracks).catch(reason => { addMessage(reason, 'critical') });

		function parseTracks(tracks) {
			if (tracks.length <= 0) {
				uaData.value = '';
				throw 'no tracks found';
			}
			setSiteDefaults();
			if (prefs.diag_mode) console.debug('Parsing tracks:', Array.from(tracks));
			let fontSize = GM_getValue('tracklist_base_font_size', 2);
			const maxFuzzyLevel = 3;
			const selfReleaseParsers = [
				/^(?:Self[\s\-]Released|Independ[ae]nt|vlastním?\s+náklad(?:em)?)$/i,
				/^(?:Not\s+On\s+Label|No\s+Label|\(no\s+label\)|\[no\s+label\]|none)$/i,
				/^(?:iMD)\b/,
			];
			const naParsers = [
				/^(?:#?N[\/\-]A)$/i,
				/^(?:#NA)$/,
			];
			let albumBitrate = 0, totalTime = 0, albumSize = 0, media, release = { totalDiscs: 1, sampleRates: [] };
			let allowedFormats = Array.from(form.querySelectorAll('select#format > option'))
				.filter(option => option.value.length > 0).map(option => option.value);
			if (allowedFormats.length <= 0) allowedFormats = ['MP3', 'FLAC', 'AAC', 'AC3', 'DTS', 'DSD'];
			tracks.forEach(function(track, index) {
				let trackId = track.track_number ? track.disc_number ?
						track.disc_number + '/' + track.track_number : track.track_number : index + 1;
				if (!track.track_number) {
					uaData.value = '';
					throw new HTML('missing required tag track number for track #' + trackId + ruleLink('2.3.16.4'));
				}
				if (!track.title) {
					uaData.value = '';
					throw new HTML('missing required tag track title for track #' + trackId + ruleLink('2.3.16.4'));
				}
				if (track.duration !== undefined && track.duration !== null && isUpload && (isNaN(track.duration) || track.duration <= 0)) {
					uaData.value = '';
					throw 'invalid track #' + trackId + ' length: ' + track.duration;
				}
				processTrackArtists(track);
				if (naParsers.some(rx => rx.test(track.label))) track.label = undefined;
				if (naParsers.concat([/^(?:none)$/i]).some(rx => rx.test(track.catalog))) track.catalog = undefined;
				if (/^(\d+)\s*[\/]\s*(\d+)$/.test(track.track_number)) { // track/total_tracks
					addMessage('nonstandard track number formatting for track #' + trackId + ': ' + track.track_number, 'warning');
					track.track_number = RegExp.$1;
					if (!track.total_tracks) track.total_tracks = parseInt(RegExp.$2);
				}/* else if (/^(\d+)[\.\-](\d+)$/.test(track.track_number)) { // disc_number.track_number
					addMessage('nonstandard track number formatting for track #' + trackId + ': ' + track.track_number, 'warning');
					if (!track.disc_number) track.disc_number = parseInt(RegExp.$1);
					track.track_number = RegExp.$2;
				}*/
				if (track.disc_number) {
					if (/^(\d+)\s*\/\s*(\d+)/.test(track.disc_number)) {
						addMessage('nonstandard disc number formatting for track #' + trackId + ': ' + track.disc_number, 'warning');
						track.disc_number = RegExp.$1;
						if (!track.total_discs) track.total_discs = RegExp.$2;
					} else track.disc_number = parseInt(track.disc_number);
					if (isNaN(track.disc_number)) {
						addMessage('invalid disc numbering for track #' + trackId, 'warning');
						track.disc_number = undefined;
					}
					if (track.disc_number > release.totalDiscs) release.totalDiscs = track.disc_number;
				}
				totalTime += track.duration;
				albumBitrate += track.bitrate * track.duration;
				if (track.samplerate/* && track.duration*/)
					if (typeof release.sampleRates[track.samplerate] == 'number')
						release.sampleRates[track.samplerate] += track.duration || 0;
					else release.sampleRates[track.samplerate] = track.duration || 0;
				albumSize += track.filesize;
				if (track.codec) allowedFormats.forEach(function(codec) {
					if (codec.toLowerCase() == track.codec.toLowerCase()) track.codec = codec;
				});
				if (track.encoding && !['lossless', 'lossy'].includes(track.encoding = track.encoding.toLowerCase())) {
					addMessage('invalid encoding for track #' + trackId + ': ' + track.encoding, 'warning');
					track.encoding = undefined;
				}
				if (!track.encoding && track.codec) switch (track.codec) {
					case 'FLAC': case 'WAV': case 'AIFF': case 'APE': case 'ALAC': case 'WavPack': case 'TAK':
						track.encoding = 'lossless'; break;
					case 'MP3': case 'AAC': case 'Vorbis': case 'Opus': case 'AC3':
						track.encoding = 'lossy'; break;
				}
				if (track.bitrate > 0) {
					let triggers = [24, 12];
					switch (track.codec) {
						case 'FLAC': case 'APE': case 'ALAC': case 'WavPack':
							if (track.samplerate > 0 && track.bitdepth > 0 && track.channels > 0) triggers = [
								Math.round(Math.max(track.samplerate * track.bitdepth * track.channels / 4410, 192)),
								Math.round(Math.max(track.samplerate * track.bitdepth * track.channels / 6300, 192)),
							];
							break;
						case 'MP3':
							switch (track.codec_profile) {
								case 'VBR V0': triggers = [192, 96]; break;
								case 'VBR V1': triggers = [160, 80]; break;
								case 'VBR V2': triggers = [128, 64]; break;
							}
							break;
						case 'AAC':
							if (/\b(?:TVBR)\sq(\d+)\b/.test(track.vendor)) triggers = [
								Math.round(Math.max(parseInt(RegExp.$1) * 1.9, 192)),
								Math.round(Math.max(parseInt(RegExp.$1) * 1.4, 192)),
							]; else if (/\b(?:(?:CV|A|C)BR)\s(\d+)kbps\b/.test(track.vendor)) triggers = [
								Math.round(Math.max(parseInt(RegExp.$1) * 0.75, 192)),
								Math.round(Math.max(parseInt(RegExp.$1) * 0.4, 192)),
							];
							break;
					}
					if (track.bitrate < triggers[0]) addMessage('track #' + trackId + ' has suspiciously low bitrate (' +
						track.bitrate + ' kbps)', track.bitrate < triggers[1] ? 'warning' : 'notice');
				}
				if (typeof track.identifiers.MD5 == 'string') track.identifiers.MD5 = track.identifiers.MD5.toUpperCase();
				['description', 'release_description', 'lyrics'].forEach(function(propName) {
					if (track[propName]) track[propName] = track[propName].collapseGaps();
				});
			});
			discTotal = release.totalDiscs;
			sourceUrl = getStoreUrls()[0];
			if (!onlineSource && release.totalDiscs > 1 && tracks.some(it => it.total_discs != release.totalDiscs))
				addMessage('at least one track not having properly set TOTALDISCS (' + release.totalDiscs + ')', 'info');
			[
				['artist', 'album artist'],
				['album', 'album title'],
				['album_year', 'album year'],
				['release_date', 'release date'],
				['encoding', 'encoding'],
				['codec', 'codec'],
				['codec_profile', 'codec profile'],
				['vendor', 'vendor'],
				['media', 'media'],
				['channels', 'channels'],
				['channel_mode', 'channel_mode'],
				['label', 'label'],
				['country', 'country'],
				['edition_title', 'edition title'],
				['series', 'series'],
			].forEach(function(property) {
				let values = new Set(tracks.map(track => track[property[0]])
					.filter(property => property !== undefined && property !== null));
				if (values.size == 1) release[property[0]] = values.values().next().value; else if (values.size > 1) {
					let val, diverses = '', iterator = values.values();
					while (!(val = iterator.next()).done) diverses += '<br>\t' + val.value;
					uaData.value = '';
					throw new HTML('mixed releases not accepted (' + property[1] + ') - supposedly user compilation' + diverses);
				}
			});
			if (isVA = vaParser.test(release.artist)) release.artist = VA; else if (!release.artist) {
				uaData.value = '';
				throw new HTML('missing required tag main artist' + ruleLink('2.3.16.4'));
			}
			if (!release.album) {
				uaData.value = '';
				throw new HTML('missing required tag album title' + ruleLink('2.3.16.4'));
			}
			if (prefs.check_whitespace && missingSpacesTest.test(release.album))
				addMessage('missing space in album title: "' + release.album + '"', 'notice');
			[
				'artists', 'featured_artists', 'composers', 'conductors',
				'performers', 'compilers', 'remixers', 'producers', 'arrangers',
			].forEach(function(role) {
				if (tracks.every(track => Array.isArray(track[role]) && track[role].equalTo(tracks[0][role])))
					release[role] = Array.from(tracks[0][role]);
			});
			[
				['trackArtists', 'track_artist'],
				['trackComposers', 'composer'],
				['totalTracks', 'total_tracks'],
				['discSubtitles', 'disc_subtitle'],
				['catalogs', 'catalog'],
				['bitrates', 'bitrate'],
				['bitdepths', 'bitdepth'],
				['albumgains', 'album_gain'],
				['albumpeaks', 'album_peak'],
				['albumdrs', 'album_dr'],
				['dirpaths', 'dirpath'],
				['descriptions', 'description'],
				['release_descriptions', 'release_description'],
				['genres', 'genre'],
				['urls', 'url'],
				['coverUrls', 'cover_url'],
			].forEach(function(property) {
				if (!Array.isArray(release[property[0]])) release[property[0]] = [ ];
				tracks.forEach(function(track) {
					if (track[property[1]] === undefined || track[property[1]] === null
							|| (typeof track[property[1]] == 'string' && track[property[1]].length <= 0)
							|| release[property[0]].includes(track[property[1]])) return;
					release[property[0]].push(track[property[1]]);
				});
			});
			if (release.totalTracks.length > 0) {
				if (release.totalTracks.length > 1)
					addMessage('total tracks not consistent across release: ' + release.totalTracks, 'warning');
				else if (release.totalTracks[0] != tracks.length) addMessage('total tracks not matching tracklist length (' +
					release.totalTracks[0] + ' ≠ ' + tracks.length + ')', 'warning');
			}
			tracks.forEach(function(track1, ndx1) {
				if (tracks.some((track2, ndx2) => ndx2 < ndx1 && track1.track_number == track2.track_number
						&& track1.disc_number == track2.disc_number && track1.disc_subtitle == track2.disc_subtitle)) {
					addMessage('duplicate track ' + (track1.disc_number ? track1.disc_number + '-' : '') +
						(track1.disc_subtitle ? track1.disc_subtitle + '-' : '') + track1.track_number, 'warning');
				}
			});
			if (!tracks.every(track => track.disc_number > 0) && !tracks.every(track => !track.disc_number))
				addMessage('inconsistent release (mix of tracks with and without disc number)', 'warning');
			let releaseDate = new Date(release.release_date);
			if (isNaN(releaseDate)) {
				releaseDate = normalizeDate(release.release_date);
				releaseDate = releaseDate && new Date(releaseDate.toString()) || NaN;
			}
			let releaseYear = !isNaN(releaseDate) && releaseDate.getUTCFullYear() || extractYear(release.release_date),
					language = getHomoIdentifier('LANGUAGE');
			if (language) language = langCodes.find(langCode => langCode.includesCaseless(language));
			if (language) language = language[0]; else language = 'en';
			if (!onlineSource) {
				if (!(release.album_year >= 1900))
					addMessage('album year is missing or invalid (' + release.album_year + ')', 'warning');
				if (release.codec && !allowedFormats.includes(release.codec)) {
					uaData.value = '';
					throw 'disallowed codec present (' + release.codec + ')';
				}
				if (/\b(?:MQAEncode)\b/.test(release.vendor)) {
					uaData.value = '';
					throw 'MQA format detected (' + release.vendor + '), specifically banned';
				}
				[
					['bit depths', release.bitdepths, bitdepth => ![16, 24].includes(bitdepth)],
					[
						'sample rates',
						Object.keys(release.sampleRates),
						samplerate => samplerate <= 0 || samplerate > 192000 || [44100, 48000].every(sr => samplerate % sr != 0)
					],
				].forEach(function(validator) {
					if (validator[1].length <= 0 || !validator[1].some(validator[2])) return;
					uaData.value = '';
					throw 'disallowed ' + validator[0] + ' present (' + validator[1].filter(validator[2]).toString() + ')';
				});
				if (!release.totalTracks) addMessage('total tracks not set', 'warning');
				if (release.albumgains.length > 1)
					addMessage('inconsistent album RG across release', release.totalDiscs > 1 ? 'notice' : 'warning')
				if (tracks.some(track => track.identifiers.LANGUAGE != tracks[0].identifiers.LANGUAGE))
					addMessage('inconsistent language across release', 'notice')
				if (release.albumpeaks.length > 1)
					addMessage('inconsistent album peak across release', release.totalDiscs > 1 ? 'notice' : 'warning')
				if (release.albumdrs.length > 1 && release.bitdepths.length <= 1 && Object.keys(release.sampleRates).length <= 1)
					addMessage('inconsistent album DR across release', release.totalDiscs > 1 ? 'notice' : 'warning')
				if (prefs.assume_rg && tracks.some(track => track.album_gain === undefined))
					addMessage('at least one track is missing RG info', 'notice');
				if (prefs.assume_dr && tracks.some(track => track.bitdepth > 16 && track.album_dr === undefined))
					addMessage('at least one high resolution track is missing DR info', 'notice');
				release.descriptions.forEach(function(description) {
					if (/^[\w\%\-]+\@[\w\%\-]+(?:\.[\w\%\-]+)+$|\b(?:RuTracker|FLACMANIA\.RU|24bit-music\.info|GetMetal\.CLUB|LOSSLESSBEST|flacmania\.ru)\b|~ N ~|\b[\w\%\-\.]+@[\w\%\-\.]+\.[\w\%\-]+\b/i.test(description))
						addMessage(new HTML('Advertising detected in description: ' + RegExp.lastMatch.bold()), 'warning');
				});
				release.urls.forEach(function(url) {
					if (/^(?:https?):\/\/(\w+\.)*7digital\.com\/.*\?f=/i.test(url))
						addMessage('session id present in online source URL: ' + url, 'notice');
				});
				release.dirpaths.forEach(function(dirPath) {
					if (hyphenCoupling.test(dirPath)) addMessage('torrent folder containing hyphen coupling ("' +
						dirPath + '")', 'notice');
				});
				if (tracks.every(track => track.dirpath)) {
					const rx = /[\\\/]+/, decompose = track => track.dirpath.toLowerCase().split(rx);
					let dirPaths = tracks.map(decompose)/*.filter(Boolean)*/, index, counter = 0;
					for (index = 0; index < Math.min(...dirPaths.map(f => f.length)); ++index)
						if (!dirPaths.map(f => f[index]).homogeneous()) break;
					console.assert(index > 0, 'index > 0', dirPaths);
					if ((dirPaths = dirPaths[0].slice(0, index)).length > 0) for (let track of tracks) {
						let dirPath = decompose(track);
						for (index = 0; index < Math.min(dirPaths.length, dirPath.length); ++index)
							if (dirPaths[index] != dirPath[index]) break;
						dirPath = track.dirpath.split(rx);
						console.assert(index > 0, 'index > 0', dirPaths, dirPath);
						if (index <= 0) continue;
						const totalLen = dirPath.slice(index - 1).concat(track.filename).join('/').trueLength();
						if (totalLen > maxPathLen) {
							const norm = dirPath.slice(index).concat(track.filename).join('/').normalize('NFC'),
										ll = Math.max(maxPathLen - 1 - dirPath[index - 1].trueLength(), 0);
							let elems = ['SPAN', 'SPAN', 'SPAN'].map(Document.prototype.createElement.bind(document));
							elems[0].append('file "');
							elems[2].className = 'cutpart';
							elems[2].style = 'color: red; font-weight: 900;';
							elems[2].append(norm.slice(ll));
							if (ll > 0) {
								elems[1].className = 'filename';
								elems[1].style = 'color: #FF6060;';
								elems[1].append(norm.slice(0, ll));
								elems[1].append(elems[2]);
								elems[0].append(elems[1]);
							} else elems[0].append(elems[2]);
							elems[0].append('" exceeding filepath length limit by ', (totalLen - maxPathLen).toString(),
								' ', totalLen - maxPathLen != 1 ? 'chars' : 'char');
							addMessage(elems[0], 'critical-lite');
							++counter;
						}
					}
					//if (counter > 0) throw 'One or more filenames exceeding max path limit';
				}
				if (tracks.some(track => track.identifiers.BPM && !(track.identifiers.BPM > 0)))
					addMessage('at least one track having invalid BPM', 'notice');
			}
			albumBitrate /= totalTime;
			let albumBPM = Math.round(tracks.reduce(function(acc, track) {
				return acc + parseInt(track.identifiers.BPM) * track.duration;
			}, 0) / totalTime);
			let canSort = tracks.every((tr1, ndx1) => tracks.every((tr2, ndx2) => ndx1 == ndx2
				|| tr1.track_number != tr2.track_number || tr1.disc_number != tr2.disc_number));
			let isFromDSD = false, isClassical = false, yadg_prefil = '', editionTitle = release.edition_title,
					composerEmphasis = tracks.some(track => track.identifiers.COMPOSEREMPHASIS),
					isCompilation = tracks.every(track => track.identifiers.COMPILATION == 1),
					barcodeSize, tags = new TagManager, releaseType, rx, lookupWorkers = { };
			const getBarcode = (_tracks = tracks) => [
				'UPC', 'UPC-E', 'UPC-A', 'EAN', 'EAN-8', 'EAN-13', 'IAN', 'GTIN', 'GTIN-13',
				'BARCODE', 'MCN', 'ICPN',
			].reduce((barcode, key) => barcode || checkBarcode(getHomoIdentifier(key, _tracks), true), undefined);
			let barcode = getBarcode();
			if (!barcode) barcode = release.catalogs.reduce((barcode, catNo) => barcode || checkBarcode(catNo, true), undefined);
			if (!overwrite && (ref = formItem('releasetype')) != null && ref.value) releaseType = parseInt(ref.value);
			if (i = getHomoIdentifier('RELEASETYPE') || getHomoIdentifier('RELEASE_TYPE')) {
				if (!releaseType) releaseType = getReleaseTypeFromId(i) || undefined;
				if (/^(?:Compilation)$/i.test(i)) isCompilation = true;
			}
			if ((!releaseType || releaseType == getReleaseTypeValue('EP')) && totalTime <= prefs.EP_threshold
					&& tracks.every(track => track.title.replace(tailingBracketStripper, '') == tracks[0].title.replace(tailingBracketStripper, '')))
				releaseType = getReleaseTypeValue('Single');
			if (!releaseType) if (totalTime > 0 && totalTime < prefs.single_threshold) releaseType = getReleaseTypeValue('Single');
				else if (totalTime > 0 && totalTime < prefs.EP_threshold) releaseType = getReleaseTypeValue('EP');
			if (release.genres.length > 0) {
				const classicalGenreParsers = [
					/\b(?:Classical|Classique|Klassik|Klassiek|Symphony|Symphonic(?:al)?|Operas?|Operettas?|Ballets?|(?:Violin|Cello|Piano)\s+Solos?|Chamber|Choral|Choirs?|Orchestral|Etudes?|Duets|Concertos?|Cantatas?|Requiems?|Passions?|Mass(?:es)?|Oratorios?|Poems?|Sacred|Secular|Vocal\s+Music)\b/i,
				];
				release.genres.forEach(function(genre) {
					classicalGenreParsers.forEach(function(classicalGenreParser) {
						if (classicalGenreParser.test(genre) && !/\b(?:metal|rock|pop)\b/i.test(genre)) {
							composerEmphasis = true;
							isClassical = true
						}
					});
					if (/\b(?:Soundtracks?|Score|Films?|Games?|Video|Series?|Theatre|Musical)\b/i.test(genre)) {
						if (!releaseType || [1].includes(releaseType)) releaseType = getReleaseTypeValue('Soundtrack');
						composerEmphasis = true;
					}
					if (/\b(?:Jazz|Vocal)\b/i.test(genre)
							&& !/\b(?:(?:Nu|Future|Acid)[\s\-]?Jazz|Electr(?:o|ic)[\s\-]?Swing|Hop)\b/i.test(genre)
							|| /\b(?:Christmas\s+Music)\b/i.test(genre) || [
						'miscellaneous',
					].includes(genre.toLowerCase()))
						composerEmphasis = true;
					tags.add(...genre.split(/\s*\|\s*/));
				});
				if (release.genres.length > 1) addMessage('inconsistent genre accross album: ' + release.genres.join(' / '), 'warning');
			}
			if (!onlineSource && isClassical && !tracks.every(track => track.composer)) {
				addMessage(new HTML('all tracks composers must be set for clasical music' + ruleLink('2.3.17')), 'warning');
				//return false;
			}
			// Processing artists: recognition, splitting and dividing to categores
			const roleCollisions = [
				/* 0 */ [/*3, */5], // main
				/* 1 */ [0, 3, 5], // guest
				/* 2 */ [0, 1, 3, 4, 5], // remixer
				/* 3 */ [ ], // composer
				/* 4 */ [0, 1, 3, 5], // conductor
				/* 5 */ [3], // DJ/compiler
				/* 6 */ [0, 1, 2, 3, 4, 5], // producer
				/* 7 */ [3, 5], // arranger
			];
			let artists = [ ];
			for (let ndx = 0; ndx < roleCollisions.length; ++ndx) artists[ndx] = [ ];

			function processReleaseArtists() {
				const exclusions = artist => !['conductors', 'compilers']
					.some(category => Array.isArray(release[category]) && release[category].includesCaseless(artist));
				release.guests = [ ]; artists[1] = [ ];
				if (Array.isArray(release.artists) && release.artists.length > 0) {
					artists[0] = release.artists.filter(exclusions);
					if (Array.isArray(release.featured_artists)) {
						release.guests = release.featured_artists;
						artists[1] = release.featured_artists.filter(exclusions);
					}
					yadg_prefil = joinArtists(artists[0]);
				} else {
					yadg_prefil = [0, 6, 7].some(ndx => featArtistParsers[ndx].test(release.artist))
						&& getSiteArtist(release.artist) ? release.artist : spliceGuests(release.artist);
					artists[0] = [ ];
					addArtists(0, yadg_prefil);
					artists[0] = artists[0].filter(exclusions);
					release.guests = Array.from(artists[1]);
				}
				if (release.compilers) yadg_prefil = joinArtists(release.compilers);
					else if (tracks.every(track => track.compiler && track.compiler == tracks[0].compiler))
						yadg_prefil = tracks[0].compiler;
				if (ampersandParsers.some(rx => rx.test(yadg_prefil))) getSiteArtist(yadg_prefil); // priority cache record
			}

			if (!isVA) processReleaseArtists();
			const trimRemixers = str => [
				/^(?:f(?:eat(?:\.?|uring)|t\.|\.?\/))\s+-\s+/i,
				/(?:(?:\s+|^)(?:Original|Extended|Enhanced|Radio|Dance|Club|Session|Raw|Vocal|Dub|Soulful|\d{4}))+$/i,
			].reduce((r, rx) => r.replace(rx, ''), str.trim().consolidateWhitespace());
			if ((matches = remixParsers.slice(4).reduce((acc, rx) => acc || rx.exec(release.album), null)) != null)
				addArtists(2, trimRemixers(matches[1]));
			if ((matches = arrParsers.reduce((acc, rx) => acc || rx.exec(release.album), null)) != null)
				addArtists(7, matches[1].trim());
			if (((matches = /^(.*?)\s+(?:Presents)\s+(.*)$/.exec(release.album)) != null
					|| isVA && (matches = (/\s+\(compiled\s+by\s+(.*?)\)\s*$/i.exec(release.album)
					|| /\s+(?:compiled\s+by)\s+(.*?)\s*$/i.exec(release.album))) != null) && looksLikeTrueName(matches[1])) {
				addArtists(5, matches[1]);
				if (!releaseType) releaseType = getReleaseTypeValue('Compilation');
			}
			featArtistParsers.slice(1).forEach(function(rx, ndx) {
				if ((matches = rx.exec(release.album)) == null) return;
				if (ndx >= 5 && !splitArtists(matches[1], multiArtistParsers.concat(ampersandParsers.slice(1)))
						.every((artist, ndx) => looksLikeTrueName(artist, 1))) return;
				addArtists(1, matches[1]);
				artists[0].forEach(guest => { if (release.guests.includesCaseless(guest)) release.guests.push(guest) });
				if (!onlineSource) addMessage('featured artist(s) in album title (' + release.album + ')', 'warning');
				release.album = release.album.replace(rx, '');
			});

			for (let track of tracks) {
				function addTrackPerformer(index, artist) {
					artist = guessOtherArtists(artist);
					if (artist.length <= 0 || pseudoArtistParsers.some(rx => rx.test(artist))) return;
					if (!isVA) index = 1; else if (index > 1) index = 0;
					if (artists[index].includesCaseless(artist) || index > 0 && artists[0].includesCaseless(artist)) return;
					artists[index].push(artist);
				}

				if (Array.isArray(track.track_artists) && track.track_artists.length > 0) {
					for (let artist of track.track_artists) addTrackPerformer(0, artist);
					if (Array.isArray(track.track_guests)) for (let guest of track.track_guests) addTrackPerformer(1, guest);
				} else for (let artist of splitArtists(spliceGuests(track.track_artist))) addTrackPerformer(0, artist);
				if (prefs.include_all_performers)
					for (let performer of Array.isArray(track.performers) && track.performers.length > 0 ?
						track.performers : splitArtists(track.performer)) addTrackPerformer(2, performer);
				[
					[2, 'remixer'],
					[3, 'composer'],
					[4, 'conductor'],
					[5, 'compiler'],
					[6, 'producer'],
					[7, 'arranger'],
				].forEach(function(category) {
					const arrayRef = category[1] + 's';
					addArtists(category[0], track[Array.isArray(track[arrayRef]) && track[arrayRef].length > 0 ? arrayRef : category[1]]);
				});

				if (track.title) {
					if (!track.remixer && (matches = remixParsers.slice(4).reduce((acc, rx) => acc || rx.exec(track.title), null)) != null)
						addArtists(2, trimRemixers(matches[1]));
					if (!track.arranger && (matches = arrParsers.slice(4).reduce((acc, rx) => acc || rx.exec(track.title), null)) != null)
						addArtists(7, matches[1].trim());
					featArtistParsers.slice(1).forEach(function(rx, ndx) {
						if ((matches = rx.exec(track.title)) == null) return;
						let featArtists = splitArtists(matches[1], multiArtistParsers.concat(ampersandParsers.slice(1)));
						if (ndx >= 5 && !featArtists.every((artist, ndx) => looksLikeTrueName(artist, 1))) return;
						if (Array.isArray(track.track_artists) && track.track_artists.length > 0) {
							if (!Array.isArray(track.track_guests)) track.track_guests = [ ];
							featArtists.forEach(function(featArtist) {
								if (!track.track_artists.includesCaseless(featArtist))
									track.track_guests.pushUniqueCaseless(featArtist);
							});
							if (!isVA && track.track_artists.equalCaselessTo(release.artists)
									&& track.track_guests.equalCaselessTo(release.featured_artists)) {
								track.track_artists = track.track_guests = track.track_artist = undefined;
							} else if (track.track_guests.length > 0)
								track.track_artist = joinArtists(track.track_artists) + ' feat. ' + joinArtists(track.track_guests);
						} else {
							const ma = (function() {
								const faStripper = a => [
									featArtistParsers[1],
									/\s+(?:w(?:ith|\.?\/)|avec)\s+(?!his\b|her\b|Friends$|Strings$)(.+?)\s*$/,
								].reduce((acc, rx, ndx) => acc.replace(rx, ''), a);
								return track.track_artist ?
									!featArtists.every(featArtist => track.track_artist.includes(featArtist))
										&& faStripper(track.track_artist)
									: Array.isArray(track.artists) && track.artists.length > 0 ?
										!featArtists.every(featArtist => track.artists.includesCaseless(featArtist)
											|| Array.isArray(track.featured_artists) && track.featured_artists.includesCaseless(featArtist))
											&& joinArtists(track.artists)
									: faStripper(track.artist);
							})();
							if (ma) track.track_artist = ma + ' feat. ' + matches[1];
						}
						addArtists(1, matches[1]);
						if (!onlineSource) addMessage('featured artist(s) in track title (#' + track.track_number + ': ' + track.title + ')', 'warning');
						track.title = track.title.replace(rx, '');
					});
				}
				if (isClassical && !track.composer && /^([^\(\)\[\]\{\},:]+?)(?:\s*\((?:\d{4}\s*-|b\.)\s*\d{4}\))/.test(track.disc_subtitle)) {
					//track.composer = RegExp.$1;
					addArtists(3, RegExp.$1);
				}
			}
			if (!isVA) {
				function finalize() {
					processReleaseArtists();
					for (let track of tracks) track.track_artist = track.track_guests = track.track_artists = undefined;
				}
				let tas, tgs;
				if (tracks.every(track => Array.isArray(track.track_artists) && track.track_artists.length > 0)) {
					tas = tracks.map(track => track.track_artists), tgs = tracks.map(track => track.track_guests);
					if (tas.every(ta => ta.equalCaselessTo(tas[0])) && (tgs.every(tg => !Array.isArray(tg) || tg.length <= 0)
							|| tgs.every(tg => Array.isArray(tg) && tg.length > 0 && tg.equalCaselessTo(tgs[0])))) {
						release.artists = tas[0]; release.featured_artists = tgs[0];
						release.artist = joinArtists(tas[0]);
						if (Array.isArray(tgs[0]) && tgs[0].length > 0) release.artist += ' feat. ' + joinArtists(tgs[0]);
						finalize();
					}
				} else if (tracks.every(track => !Array.isArray(track.track_artists) || track.track_artists.length <= 0)
						&& (tas = tracks.map(track => track.track_artist))[0]) {
					if (tas.homogeneous()) {
						release.featured_artists = release.artists = undefined;
						release.artist = tas[0];
						finalize();
					} else if ((tas = tracks.map(track => getArtists(track.track_artist)))
							.every(ta => ta[0].equalCaselessTo(tas[0][0]) && ta[1].equalCaselessTo(tas[0][1]))) {
						release.featured_artists = release.artists = undefined;
						release.artist = joinArtists(tas[0][0]);
						if (tas[0][1].length > 0) release.artist += ' feat. ' + joinArtists(tas[0][1]);
						finalize();
					}
				}
			}
			for (i = 0; i < Math.round(tracks.length / 2); ++i) splitAmpersands();
			release.guests = splitAmpersands(release.guests);

			function addArtists(ndx, _artists) {
				if (typeof _artists == 'string') _artists = splitArtists(_artists);
				if (Array.isArray(_artists)) for (let artist of _artists) {
					artist = ndx != 0 ? strip(artist) : guessOtherArtists(artist);
					if (artist.length > 0 && !pseudoArtistParsers.some(rx => rx.test(artist))
							&& !artists[ndx].includesCaseless(artist)
							&& !roleCollisions[ndx].some(n => artists[n].includesCaseless(artist))) artists[ndx].push(artist);
				}
			}
			function spliceGuests(str, level = 0) {
				(level > 0 ? featArtistParsers.slice(level) : featArtistParsers).forEach(function(rx, ndx) {
					const matches = rx.exec(str);
					if (matches == null || level + ndx > 5 && !splitArtists(matches[1]).every((artist, ndx) => looksLikeTrueName(artist, 1)))
						return;
					addArtists(1, matches[1]);
					str = str.replace(rx, '');
				});
				return str;
			}
			function guessOtherArtists(name) {
				otherArtistsParsers.forEach(function(it) {
					if (!it[0].test(name)) return;
					addArtists(it[1], RegExp.$2);
					name = RegExp.$1;
				});
				return strip(name);
			}
			function splitAmpersands(_artists = undefined) {
				function splitInternal(refArr, roleCollisions) {
					ampersandParsers.forEach(function(ampersandParser) {
						for (let i = refArr.length; i > 0; --i) {
							let j = refArr[i - 1].split(ampersandParser).map(strip);
							if (j.length <= 1 || getSiteArtist(refArr[i - 1])
									|| !j.some(it1 => artists.some(it2 => it2.includesCaseless(it1))) && !j.every(looksLikeTrueName)) continue;
							refArr.splice(i - 1, 1, ...j.filter(function(artist) {
								return !refArr.includesCaseless(artist) && !pseudoArtistParsers.some(rx => rx.test(artist))
									&& (!Array.isArray(roleCollisions) || !roleCollisions.some(n => artists[n].includesCaseless(artist)));
							}));
						}
					});
				}

				if (_artists !== undefined) {
					let result;
					if (typeof _artists == 'string') result = splitArtists(_artists);
						else if (Array.isArray(_artists)) result = Array.from(_artists); else return [];
					splitInternal(result);
					return result;
				}
				for (let ndx = 0; ndx < artists.length; ++ndx) splitInternal(artists[ndx], roleCollisions[ndx]);
			}
			function getArtists(trackArtist) {
				let result = [[ ], [ ]];
				if (!trackArtist || typeof trackArtist != 'string') return result;
				otherArtistsParsers.forEach(it => { if ((matches = it[0].exec(trackArtist)) != null) trackArtist = matches[1] });
				featArtistParsers.forEach(function(rx, ndx) {
					if ((matches = rx.exec(trackArtist)) == null || ndx >= 7 && !looksLikeTrueName(matches[1], 1)) return;
					splitAmpersands(matches[1]).forEach(artist => { result[1].pushUniqueCaseless(artist) });
					trackArtist = trackArtist.replace(rx, '');
				});
				splitAmpersands(trackArtist).forEach(artist => { result[0].pushUniqueCaseless(artist) });
				return result;
			}
			function getRealTrackArtist(track) {
				const artistFilter = artist => !roleCollisions[0].some(n => artists[n].includesCaseless(artist)),
							guestFilter = guest => !roleCollisions[1].some(n => artists[n].includesCaseless(guest));
				const trackPerformers = Array.isArray(track.track_artists) && track.track_artists.length > 0 ?
					[track.track_artists, Array.isArray(track.track_guests) ? track.track_guests : [ ]]
						: getArtists(track.track_artist);
				if (trackPerformers[0].length <= 0) return undefined;
				const trackSpecific = isVA || !artistsMatch([
					trackPerformers[0].filter(Array.prototype.includesCaseless.bind(artists[0])).filter(artistFilter),
					trackPerformers[0].filter(artist => !artists[0].includesCaseless(artist))
						.concat(trackPerformers[1]).filter(guestFilter),
				], [artists[0].filter(artistFilter), release.guests.filter(guestFilter)]);
				if (!trackSpecific) return undefined;
				if (!prefs.reformat_trackartist) return track.track_artist;
				trackPerformers[0] = trackPerformers[0];
				trackPerformers[1] = trackPerformers[1].filter(ta => !trackPerformers[0].includesCaseless(ta));
				return stringifyArtists(trackPerformers);
			}

			if (prefs.diag_mode) console.debug('Artists:', artists);
			if (elementWritable(document.getElementById('artist') || document.getElementById('artist_0'))) {
				let artistIndex = 0;
				const enSorter = [/^(?:The)\s+/, ''];
				catLoop: for (let importance = 0; importance < artists.length; ++importance)
					for (let artist of artists[importance]
							.filter(artist => !roleCollisions[importance].some(n => artists[n].includesCaseless(artist)))
							.sort((a, b) => a.replace(...enSorter).localeCompare(b.replace(...enSorter)))) {
						// if (isUpload) {
						// 	let id = 'artist';
						// 	if (artistIndex > 0 || document.getElementById('artist_0') != null) id += '_' + artistIndex;
						// 	while ((ref = document.getElementById(id)) == null) AddArtistField();
						// } else {
						while ((ref = formItems('artists[]')).length <= artistIndex) AddArtistField();
						ref = ref[artistIndex];
						// }
						console.assert(ref != null);
						ref.value = artist;
						ref.nextElementSibling.value = importance + 1;
						if (++artistIndex >= 200) {
							addMessage('Site limit of artist entries (200) reached, some artists will be missing from group artist list (this won\'t affect tracklist)', 'notice');
							break catLoop;
						}
					}
				if (overwrite && artistIndex > 0) while (document.getElementById('artist_' + artistIndex) != null)
					RemoveArtistField();
			}
			// Processing album title
			let album = release.album;
			[ // Release type
				[/\s+(?:\(Single\)|\[Single\]|(?:[\‐\-\−\—\–]\s+)Single)$/i, 'Single', true, true],
				[/\s+(?:\(EP\)|\[EP\]|(?:-\s+)?EP)$/, 'EP', true, true],
				[/\s+(?:\(E\.P\.\)|\[E\.P\.\]|(?:-\s+)?E\.P\.)$/, 'EP', true, false],
				[/(?:\b(?:Live)\s+(?:[aA]t|[Ii]n|[Ff]rom)\b|^Directo?\s+[Ee]n\b|\bUnplugged\b|\b(?:Acoustic\s+Stage|In\s+Concert)\b|\s+(?:Live)$)/, 'Live album', false, false],
				[/\s+(?:\((?:Live|En\s+directo?|(?:Ao|En)\s+Vivo)\b[^\(\)]*\)|(?:[\‐\-\−\—\–]\s+)(?:Live|En\s+Directo|(?:Ao|En)\s+Vivo))$/i, 'Live album', false, false],
				[/\s+\[(?:Live|En\s+directo?|(?:Ao|En)\s+Vivo)\b[^\[\]]*\]$/i, 'Live album', false, false],
				[/\S(?::|\s+[\-\−\—\–])\s+(?:Live|En\s+directo?|(?:Ao|En)\s+Vivo)\b/i, 'Live album', false, false],
				[/\b(?:(?:Best\s+Of|(?:Greatest|Best)\s+Hits|Complete\s+(.+?\s+)?(?:Albums|Recordings))\b|Collection$)|^The(\s+\w+)+Years$|(?:^|[\:\-]\s+)(?:(?:The\s+)Essential)\b|\b(?:19|20)\d{2}(?:\s*[\‐\-\−\—\–]\s*|\s+(?:to)\s+)(?:19|20)\d{2}\b/i, 'Anthology', false, false],
				[/\s+(?:\((?:Anthology|Rarities)\)|\[(?:Anthology|Rarities)\])/i, 'Anthology', false, false],
				[/\s+(?:\(Bootleg\)|\[Bootleg\]|(?:[\‐\-\−\—\–]\s+)?Bootleg)$/i, 'Bootleg', false, true],
				[/\s+(?:\([^\(\)]*\b(?:Remix(?:es)?)\)|\[[^\[\]]*\b(?:Remix(?:es)?)\]|(?:[\‐\-\−\—\–]\s+)?Remix(?:es)?)$/i, 'Remix', false, false],
				[/\s+(?:\(Mixtape\)|\[Mixtape\]|(?:[\‐\-\−\—\–]\s+)?Mixtape)$/i, 'Mixtape', true, true],
				[/\s+(?:\(Demos?\)|\[Demos?\]|(?:[\‐\-\−\—\–]\s+)?Demos?)$/i, 'Demo', false, true],
				[/\s+(?:\(Concert\s+Recording\)|\[Concert\s+Recording\]|(?:[\‐\-\−\—\–]\s+)Concert\s+Recording)$/i, 'Concert Recording', false, true],
				[/\s+(?:\(DJ\s+Mix\)|\[DJ\s+Mix\]|(?:[\‐\-\−\—\–]\s+)?DJ\s+Mix)$/i, 'DJ Mix', false, true],
				[/\s+(?:\(Interview\)|\[Interview\]|(?:[\‐\-\−\—\–]\s+)?Interview)$/i, 'Interview', false, false],
			].forEach(function(it) {
				if ((matches = it[0].exec(album)) == null) return;
				if (it[2] || !releaseType) releaseType = getReleaseTypeValue(it[1]);
				if (it[3]) album = album.slice(0, matches.index);
			});
			rx = '\\b(?:Soundtrack|Score|Motion\\s+Picture|Series|Television|Original(?:\\s+\\w+)?\\s+Cast|Music\\s+from|(?:Musique|Bande)\\s+originale)\\b';
			if (releaseType == getReleaseTypeValue('Soundtrack')
					|| reInParenthesis(rx).test(album) || reInBrackets(rx).test(album)) {
				if (!releaseType) releaseType = getReleaseTypeValue('Soundtrack');
				tags.add('score');
				composerEmphasis = true;
			}
			if (!releaseType && remixParsers.some(rx => rx.test(release.album))) releaseType = getReleaseTypeValue('Remix');
			if (!editionTitle && !isRequestNew && !isRequestEdit) [ // Edition
				/\s+\(((?:Re[/-]?master(?:ed)?|Re[/-]?masterizado|Re[/-]?masterisée|Reissued?|Deluxe|Enhanced|Expanded|Limited|Version|\d+th\s+Anniversary)\b[^\(\)]*|[^\(\)]*\b(?:Edition|Version|Re[/-]?master|Promo|Release|Édition|Reissue))\)$/i,
				/\s+\[((?:Re[/-]?master(?:ed)?|Re[/-]?masterizado|Re[/-]?masterisée|Reissued?|Deluxe|Enhanced|Expanded|Limited|Version|\d+th\s+Anniversary)\b[^\[\]]*|[^\[\]]*\b(?:Edition|Version|Re[/-]?master|Promo|Release|Édition|Reissue))\]$/i,
				/\s+-\s+([^\[\]\(\)\‐\-\−\—\–]*\b(?:(?:Re[/-]?master(?:ed)?|Re[/-]?masterizado|Re[/-]?masterisée|Bonus\s+Track)\b[^\[\]\(\)\‐\-\−\—\–]*|Re-?issued?|Edition|Version|Promo|Enhanced|Release|Édition))$/i,
			].forEach(function(rx) {
				if ((matches = rx.exec(album)) == null || release.album_year > 0 && release.album_year == releaseYear
						&& /\b(?:re[/-]?master|(?:re[/-]?issue|anniversary)\b)/i.test(matches[1])) return;
				album = album.slice(0, matches.index);
				editionTitle = matches[1];
			});
			[ // Media
				[/\s+(?:\[(?:LP|Vinyl|12"|7")\]|\((?:LP|Vinyl|12"|7")\))$/, 'Vinyl'],
				[/\s+(?:\[SA-?CD\]|\(SA-?CD\))$/, 'SACD'],
				[/\s+(?:\[(?:Blu[\s\‐\-\−\—\–]?Ray|BD|BRD?)\]|\((?:Blu[\s\‐\-\−\—\–]?Ray|BD|BRD?)\))$/, 'Blu-Ray'],
				[/\s+(?:\[DVD(?:-?A)?\]|\(DVD(?:-?A)?\))$/, 'DVD'],
			].forEach(function(it) {
				if ((matches = it[0].exec(album)) == null) return;
				media = it[1];
				album = album.slice(0, matches.index);
			});
			if (elementWritable(ref = formItem('title'))) {
				ref.value = prefs.fix_capitalization ? album.properTitleCase(language) : album;
				ref.dispatchEvent(new Event('input'));
			}
			if (yadg_prefil) yadg_prefil += ' ';
			if (yadg_prefil += album) yadg.then(function(yadg) {
				if (elementWritable(yadg.input)) yadg.input.value = yadg_prefil || ''; else return;
				if (!isUpload || yadg.submit == null || yadg.submit.disabled) return;
				if (yadg.scraper != null && prefs.yadg_no_autosearch.includes(yadg.scraper.value)) return;
				yadg.submit.click();
			});
			if (!release.album_year) release.album_year = parseInt(getHomoIdentifier('PUBYEAR')) || undefined;
			if (elementWritable(ref = formItem('year'))) ref.value = release.album_year || '';
			if (elementWritable(ref = formItem('remaster_year'))
					|| !isUpload && i > 0 && (ref = formItem('year')) != null && !ref.disabled) ref.value = releaseYear || '';
			const explicitTrack = track => track.identifiers.EXPLICIT == 1,
						cleanedTrack = track => track.identifiers.EXPLICIT > 1;
			if (tracks.some(explicitTrack)) {
				//editionTitle = editionTitle ? editionTitle + ' / ' + 'Explicit' : 'Explicit';
				addMessage('release contains explicit content', 'info');
			} else if (tracks.some(cleanedTrack)) {
				editionTitle = editionTitle ? editionTitle + ' / ' + 'Clean' : 'Clean';
				addMessage('release is clean version', 'info');
			} else if (tracks.some(explicitTrack) && tracks.some(cleanedTrack))
				addMessage('inconsistent release - mix of explicit and cleaned tracks', 'notice');
			[
				/\s+\(([^\(\)]+)\)\s*$/,
				/\s+\[([^\[\]]+)\]\s*$/,
				/\s+\{([^\{\}]+)\}\s*$/,
			].forEach(function(rx) {
				let version = tracks.map(track => rx.test(track.title) ? RegExp.$1 : null);
				if (!(version = version.homogeneous() && version[0])) return;
				if (!editionTitle && /\b(?:Re[/-]?mastered|Re[/-]?masterisée|Re[/-]?masterizado|Acoustic|Instrumental)\b/i.test(version)
						&& releaseType != getReleaseTypeValue('Single')) editionTitle = version;
				if (!releaseType && /^(?:Live|En\s+directo?|(?:Ao|En)\s+Vivo)\b/i.test(version))
					releaseType = getReleaseTypeValue('Live album');
			});
			if (!releaseType && tracks.length > 1
					&& tracks.every(track => /\s+(?:-\s+)?(?:Live|En\s+directo?|(?:Ao|En)\s+Vivo)$/i.test(track.title)))
				releaseType = getReleaseTypeValue('Live album');
			let dualMono = getHomoIdentifier('DUALMONO') > 0 || /\b(?:Mono)\b/i.test(release.channel_mode);
			let masteredForItunes = getHomoIdentifier('MASTERED_FOR_ITUNES') > 0 ? 'Mastered for iTunes' : undefined;
			if (elementWritable(ref = formItem('remaster_title'))) {
				ref.value = editionTitle || '';
				if (dualMono) if (ref.value) ref.value += ' / MONO'; else ref.value = 'MONO';
				if (masteredForItunes) if (ref.value) ref.value += ' / ' + masteredForItunes; else ref.value = masteredForItunes;
			}
			if (elementWritable(ref = formItem('remaster_record_label') || formItem('record_label') || formItem('recordlabel')))
				ref.value = release.label ? (function() {
					if (prefs.selfrelease_label && (!isVA && release.label.toLowerCase().includes(release.artist.toLowerCase())
							|| selfReleaseParsers.some(rx => rx.test(release.label)))) return prefs.selfrelease_label;
					return release.label.split(/\s*[\;\/]\s*|\s+\-\s+/)
						.map(label => labelSubstitutes.reduce((l, def) => l.replace(...def), label)).filter(Boolean).join(' / ');
				})() : '';
			if (elementWritable(ref = formItem('remaster_catalogue_number')
					|| formItem('catalogue_number') || formItem('cataloguenumber'))) {
				if (release.catalogs.length > 0) ref.value = release.catalogs
					.map(catNo => catNo.replace(/\s*;\s*/g, ' / ')).join(' / ');
				if (!ref.value && barcode) ref.value = barcode;
			}
			let scene = getHomoIdentifier('SCENE');
			if (isUpload && scene != undefined && (ref = formItem('scene')) != null && !ref.disabled) try {
				ref.checked = eval(scene.toLowerCase());
			} catch(e) { console.warn('Invalid SCENE value (' + scene + ')') }
			const br_isSet = (ref = formItem('bitrate')) != null && ref.value;
			if (elementWritable(ref = formItem('format'))) {
				if (allowedFormats.includes(release.codec)) ref.value = release.codec; else ref.selectedIndex = 0;
				notifyChange(ref); // Format();
			}
			let encoding;
			if (release.encoding == 'lossless') {
				if (release.bitdepths.includes(24)) encoding = '24bit Lossless';
				else if (release.bitdepths.some(bitdepth => bitdepth > 0)) encoding = 'Lossless';
			} else if (release.encoding == 'lossy' && release.bitrates.length > 0) {
				let lame_version = release.codec == 'MP3' && /^LAME(\d+)\.(\d+)/i.test(release.vendor) ?
						parseInt(RegExp.$1) * 1000 + parseInt(RegExp.$2) : undefined;
				if (release.codec == 'MP3' && release.codec_profile == 'VBR V0') {
					encoding = lame_version >= 3094 ? 'V0 (VBR)' : 'APX (VBR)'
				} else if (release.codec == 'MP3' && release.codec_profile == 'VBR V1') {
					encoding = 'V1 (VBR)'
				} else if (release.codec == 'MP3' && release.codec_profile == 'VBR V2') {
					encoding = lame_version >= 3094 ? encoding = 'V2 (VBR)' : 'APS (VBR)'
				} else if (release.bitrates.length == 1 && [192, 256, 320].includes(Math.round(release.bitrates[0]))) {
					encoding = Math.round(release.bitrates[0]);
				} else encoding = 'Other';
			}
			if ((ref = formItem('bitrate')) != null && !ref.disabled && (overwrite || !br_isSet)) {
				ref.value = encoding || '';
				notifyChange(ref); // Bitrate();
				if (encoding == 'Other' && (ref = formItem('other_bitrate')) != null) {
					ref.value = Math.round(release.bitrates.length == 1 ? release.bitrates[0] : albumBitrate);
					notifyChange(ref); // AltBitrate();
					if ((ref = formItem('vbr')) != null) ref.checked = release.bitrates.length > 1;
				}
			}
			if (release.media) media = estimateMedia(release.media) || media;
			const vinylTest = /^((?:Vinyl|LP) rip by\s+)(.*)$/im,
						vinyltrackParser = /^([A-Z])(?:[\-\.\s]?((\d+)(\.?\S+)?))?$/i;
			if (!media) {
				if (tracks.every(isRedBook)) {
					addMessage('media not determined - CD estimated', 'info');
					media = 'CD';
				} else if (tracks.every(track => vinyltrackParser.test(track.track_number))) {
					addMessage('media not determined - vinyl estimated', 'info');
					media = 'Vinyl';
				} else addMessage(onlineSource ? 'media not determined' : 'media not determined - NOT CD', 'info');
			} else if (tracks.every(isRedBook)) {
				if (media != 'CD') addMessage('Playlist fulfils redbook standard (' + media + ')', 'info');
			} else if (media == 'CD' && !onlineSource)
				addMessage('At least one track doesn\'t fulfill redbook standard (CD)', 'notice');
			if (elementWritable(ref = formItem('media'))) {
				const mediaMappers = isOPS ? [['Blu-Ray', 'BD']] : isNWCD ? [['Blu-Ray', 'Blu-ray']] : [ ];
				ref.value = mediaMappers.reduce((media, subst) => media.replace(...subst), media)
					|| !tracks.some(notRedBook) && prefs.default_medium || (isRED ? '' : '---');
				notifyChange(ref); // CheckYear();
			}
			if (media == 'Vinyl') {
				let badTracks = tracks.filter(track => !vinyltrackParser.test(track.track_number) && isNaN(parseInt(track.track_number)));
				if (badTracks.length > 0) addMessage('at one or more vinyl tracks having invalid track# format: ' +
					badTracks.map(track => track.track_number), 'warning');
			}
			if (isRequestNew && form != null) {
				const reqControl = new RequestControl(form);
				reqControl.select('media', false);
				let defaults = getRequestDefaults('media');
				if (defaults) reqControl.select('media', true, ...defaults);
					else if (media) reqControl.select('media', true, media);
						//else reqControl.select('media', true);
				if (defaults = getRequestDefaults('formats')) reqControl.select('formats', true, ...defaults);
					else if (release.codec) reqControl.select('formats', true, release.codec);
						//else reqControl.select('formats', true);
				if (defaults = getRequestDefaults('bitrates')) reqControl.select('bitrates', true, ...defaults);
					else if (encoding) reqControl.select('bitrates', true, encoding);
						//else reqControl.select('bitrates', true);
			}

			function isRedBook(track) {
				return track.bitdepth == 16 && track.samplerate == 44100 && track.channels == 2
					&& track.samples > 0 && track.samples % (44100 / 75) == 0;
			}
			function notRedBook(track) {
				return track.bitdepth && track.bitdepth != 16 || track.samplerate && track.samplerate != 44100
					|| track.channels && track.channels != 2 || track.samples && track.samples % 588 != 0;
			}
			if (tracks.every(it => it.identifiers.ORIGINALFORMAT && it.identifiers.ORIGINALFORMAT.includes('DSD')))
				isFromDSD = true;
			// Release type
			if (!releaseType/* || isCompilation)*/) if (isVA) releaseType = getReleaseTypeValue('Compilation');
				else if (isCompilation || totalTime > 0 && totalTime >= prefs.anthology_time_threshold
						&& tracks.length >= prefs.anthology_tracks_threshold) releaseType = getReleaseTypeValue('Anthology');
			if ((ref = formItem('releasetype')) != null)
				if (!ref.disabled && (overwrite || ref.value == 0 || ref.value == '---'))
					ref.value = releaseType || getReleaseTypeValue('Album');
			// Image
			if (elementWritable(i = findImageInput())) setCover(release.coverUrls[0]).then(function(imageUrl) {
				if (prefs.deezer_explore_resolutions && onlineSource && dzrEntityParser.test(onlineSource))
						getDeezerImageMax(imageUrl).then(function(maxImageUrl) {
					if (maxImageUrl != imageUrl) (!i.disabled ? Promise.resolve(ref) : new Promise(function(resolve, reject) {
						let ti = setTimeout(function() {
							mo.disconnect();
							reject('Timed out');
						}, 15000);
						var mo = new MutationObserver(function(mutationsList, mo) {
							console.assert(mutationsList.length == 1, 'mutationsList.length == 1');
							clearTimeout(ti); mo.disconnect();
							for (let mutation of mutationsList) if (!mutation.target.disabled) resolve(mutation.target);
							console.warn('MutationObserver callback triggered, but watched element not in expected state:', mutationsList);
						});
						mo.observe(i, { attributes: true, attributeFilter: ['disabled'] });
					})).then(input => setCover(maxImageUrl, true, input));
				});
			}, reason => getCoverOnline().catch(searchCoverOnline));
			//else if (onlineSource && dzrEntityParser.test(onlineSource) && findImageInput() != null) getCoverOnline(true);
			// Tags
			if (prefs.estimate_decade_tag && (!totalTime || totalTime < 2 * 60 * 60) && !isClassical && release.album_year > 1900
					&& (!releaseType || ['Album', 'Soundtrack', 'EP', 'Single', 'Mixtape', 'Interview', 'Demo']
							.some(rt => releaseType == getReleaseTypeValue(rt)))/*
					&& !/\b(?:remaster)/i.test(album) && !/\b(?:remaster)/i.test(editionTitle)*/)
					//&& !/\b(?:Re[/-]?master(?:ed)?|Re[/-]?masterizado|Re[/-]?masterisée|Reissue|Anniversary|Collector(?:'?s)?)\b/i.test(editionTitle)*/)
				tags.add(Math.floor(release.album_year / 10) * 10 + 's'); // experimental
			if (release.country && !tmExcludedCountries.some(it => it.test(release.country))) tags.add(release.country);
			if (!composerEmphasis && tracks.every(track => track.identifiers.HASLYRICS == 0)) tags.add('instrumental');
			const tagsRef = formItem('tags');
			if (elementWritable(tagsRef)) (function getVerifiedTags(tags, confidencyThreshold = GM_getValue('tags_confidency_threshold', 1)) {
				if (!Array.isArray(tags)) throw 'Invalid argument';
				return Promise.all(tags.map(function(tag) {
					if (!(confidencyThreshold > 0) || tmWhitelist.includes(tag) || siteTagsCache[tag] >= confidencyThreshold)
						return Promise.resolve(tag);
					return queryAjaxAPICached('browse', { taglist: tag }).then(function(response) {
						const usage = response.pages > 1 ? (response.pages - 1) * 50 + 1 : response.results.length;
						if (usage < confidencyThreshold) return false;
						siteTagsCache[tag] = usage;
						Promise.resolve(siteTagsCache).then(cache => { localStorage.setItem('siteTagsCache', JSON.stringify(cache)) });
						return tag;
					}, reason => false);
				})).then(results => results.filter(Boolean));
			})(Array.from(tags)).then(function(verifiedTags) {
				if (verifiedTags.length > 0) tagsRef.value = verifiedTags.join(', ');
				if (prefs.fetch_tags_from_artist > 0 && releaseType != 'Compilation' && artists[0].length == 1) {
					const artist = getSiteArtist(artists[0][0]);
					if (!artist) return;
					verifiedTags.add(...artist.tags.map(it => it.name).slice(0, prefs.fetch_tags_from_artist));
					if (verifiedTags.length > 0) tagsRef.value = tags.join(', ');
				}
			});
			if (!composerEmphasis/* && release.genres.length > 0*/ && !prefs.keep_meaningles_composers)
				for (let artist of formItems('artists[]')) if (['4', '5'].includes(artist.nextElementSibling.value))
					artist.value = '';

			const doubleParsParsers = [
				/\(+(\([^\(\)]*\))\)+/,
				/\[+(\[[^\[\]]*\])\]+/,
				/\{+(\{[^\{\}]*\})\}+/,
			];
			tracks.forEach(function(track) {
				doubleParsParsers.forEach(function(rx) {
					if (!rx.test(track.title)) return;
					addMessage('doubled parentheses in track #' + track.track_number + ' title ("' + track.title + '")', 'warning');
					//track.title.replace(rx, RegExp.$1);
				});
			});
			if (tracks.length > 1 && tracks.map(track => track.title).homogeneous())
				addMessage('all tracks having same title: ' + tracks[0].title, 'warning');
			if (prefs.check_site_logs && isUpload && !isOPS) findPreviousUploads();
			if ((ref = document.body.querySelector('tr#autofill_tr > td > select')) != null) {
				if (i = getHomoIdentifier('DISCOGS_ID')) {
					ref.value = 'discogs';
					notifyChange(ref);
					if (elementWritable(ref = document.getElementById('discogs'))) ref.value = i;
				} else if (i = getHomoIdentifier('MBID')) {
					ref.value = 'musicbrainz';
					notifyChange(ref);
					if (elementWritable(ref = document.getElementById('musicbrainz'))) ref.value = i;
				}
			}
			// Album description
			if (!tracks.every(track => !isNaN(parseInt(track.track_number.toString())))
					&& !tracks.every(track => vinyltrackParser.test(track.track_number.toString().toUpperCase())))
				addMessage('inconsistent tracks numbering (' + tracks.map(track => track.track_number) + ')', 'warning');
			if (release.totalDiscs < 2 && tracks.reduce(computeLowestTrack, undefined) - 1)
				addMessage('track numbering not starting from 1', 'info');
			if (!media && (ref = formItem('media')) != null && ref.value && ref.value != '---')
				media = mediaMapper(ref.value);
			let description;
			if (isRequestNew || isRequestEdit) { // request
				const mo = new MutationObserver(ml => { for (let mutation of ml)
					if (!mutation.target.disabled) mutation.target.disabled = true });
				const submitBtns = form != null ? form.querySelectorAll('input[type="submit"]') : null;
				if (submitBtns != null) for (let submitBtn of submitBtns) {
					submitBtn.disabled = true;
					mo.observe(submitBtn, { attributes: true, attributeFilter: ['disabled'] });
					submitBtn.style = 'cursor: not-allowed; opacity: 0.5;';
					if (!submitBtn.caption) {
						submitBtn.caption = submitBtn.value;
						submitBtn.value = 'Please wait...';
					}
				}
				let searchTerm = barcode || release.catalogs[0];
				//if (!searchTerm && !isVA) searchTerm = '"' + release.artist + '" "' + release.album + '"';
				if (searchTerm) {
					let wcUrl = new URL('https://www.worldcat.org/search');
					wcUrl.searchParams.set('q', '"' + searchTerm + '"');
					wcUrl.hash = encodeURIComponent('x0:music-,' +
						['cd', 'digital', 'lp', 'bluray', 'dvd', 'cassette'].map(media => '(x0:music+x4:' + media + ')').join(',') +
						'format');
					findOCLC(wcUrl, release.album);
				}
				description = [ ];
				if (!isNaN(releaseDate) && !/^\s*\d{4}\s*$/.test(release.release_date)) {
					let today = new Date().getDateValue();
					description.push((releaseDate.getDateValue() < today ? 'Released' : 'Releasing') + ' on ' + releaseDate.toUTCDateString());
					if (prefs.upcoming_tags && releaseDate.getDateValue() >= today
							&& (ref = formItem('tags')) != null && !ref.disabled) {
						let tags = new TagManager(ref.value);
						tags.add(prefs.upcoming_tags);
						ref.value = tags.toStringSorted();
					}
				}
				if (!prefs.include_tracklist_in_request) {
					let summary = '';
					if (release.totalDiscs > 1) summary += release.totalDiscs + ' discs, ';
					summary += tracks.length + ' track'; if (tracks.length > 1) summary += 's';
					if (totalTime > 0) summary += ', ' + makeTimeString(totalTime);
					description.push(summary);
				}
				const isWeb = media == 'WEB';
				const lookupWorkers = {
					'deezer': isWeb && dzLookup(true).then(release => release.link),
					'itunes': isWeb && itunesLookupByBarcode().then(results => results[0], reason => itunesLookup(true))
						.then(collection => collection.collectionViewUrl),
					'bandcamp': isWeb && bcLookup(true).then(album => album.url),
					'qobuz': isWeb && qbLookup(true).then(album => album.url),
					'tidal': isWeb && tidalLookup(true).then(album => album.url),
					'spotify': isWeb && (barcode ? querySpotifyAPI('search', { q: 'barcode:' + barcode, type: 'album' })
						.then(result => result.albums.total == 1 ? result.albums.items[0] : Promise.reject('Spotify: no matches or ambiguity')) : Promise.reject('no barcode'))
						.catch(reason => spotifyLookup(true)).then(album => album.external_urls.spotify),
					'boomkat': bkLookup(true).then(release => release.url),
					'mora': isWeb && moraLookup(true).then(release => release.packagePage),
					'netease': isWeb && neLookup(true).then(album => 'https://music.163.com/album?id=' + album.id),
					'beatport': isWeb && bpLookup(true).then(release => release.url),
					'junodownload': isWeb && junoLookup(true).then(release => release.url),
					'amazon': isWeb && ammLookup(true).then(item => item.url),
					'qqmusic': isWeb && qqLookup(true).then(album => album.url),
					'ototoy': isWeb && ottLookup(true).then(album => album.url),
					//'joox': isWeb && jxLookup(true).then(album => album.url),
					'traxsource': isWeb && tsLookup(true).then(album => album.url),
					'beatsource': isWeb && bsLookup(true).then(release => 'https://www.beatsource.com/release/' + release.slug + '/' + release.id),
					'flo': isWeb && floLookup(true).then(album => album.url),
					'discogs': !isWeb && dcLookup(true).then(release => discogsOrigin + release.uri),
					'musicbrainz': !isWeb && mbLookupByBarcode().catch(mbLookupByASIN)
						.then(releases => releases[0], reason => mbLookup(true)).then(release => mbrRlsPrefix + release.id),
					'allmusic': !isWeb && amLookup(true).then(release => release.url),
					'supraphonline': suphonLookup(true).then(album => album.url),
				};
				let lookupProviders = prefs.store_lookup_providers;
				if (!Array.isArray(lookupProviders)) lookupProviders = lookupProviders.split(/\W+/).filter(Boolean);
				let ignLookupProviders = prefs.ignored_store_lookup_providers;
				if (!Array.isArray(ignLookupProviders)) ignLookupProviders = ignLookupProviders.split(/\W+/).filter(Boolean);
				Promise.all(Object.keys(lookupWorkers).filter(key => lookupWorkers[key] instanceof Promise
						&& (prefs.store_lookup_providers.toLowerCase() == 'all'
						|| lookupProviders.some(lookupProvider => lookupProvider.toLowerCase() == key.toLowerCase()))
						&& !ignLookupProviders.some(lookupProvider => lookupProvider.toLowerCase() == key.toLowerCase()))
							.map(key => lookupWorkers[key].then(url => new URL(url), reason => null))).then(function(storeUrls) {
					if (prefs.diag_mode) console.log('Stores search results:', storeUrls);
					let externalLinks = release.urls.concat(getStoreUrls());
					externalLinks = externalLinks.concat(storeUrls.filter(url => url instanceof URL
						&& !externalLinks.some(link => link.startsWith(url.origin))).map(url => url.href)).map(getLinkCode).join('\n');
					if (barcode) externalLinks += '\nFind more stores…'.bbUrl('https://www.google.com/search?q=' + barcode);
					if (externalLinks) description.push(externalLinks.trim());
					if (prefs.include_tracklist_in_request) description.push(genPlaylist());
					if (release.descriptions.length > 0) Array.prototype.push.apply(description, release.descriptions);
					description = genAlbumHeader() + description.join('\n\n');
					if (description.length > 0) {
						if (elementWritable(ref = formItem('description'))) ref.value = description;
						else if (isRequestEdit && ref != null && !ref.disabled) {
							ref.value = ref.value.length > 0 ? ref.value + '\n\n' + description : ref.value = description;
							preview(0);
						}
					}
					if (submitBtns != null) for (let submitBtn of submitBtns) {
						if (submitBtn.caption) {
							submitBtn.value = submitBtn.caption;
							delete submitBtn.caption;
						}
						submitBtn.style = 'cursor: pointer; opacity: 1;';
						mo.disconnect();
						submitBtn.disabled = false;
					}
				});
				setReqDefaultBounty();
			} else { // upload
				description = '';
				if (prefs.bpm_summary && albumBPM > 0) description = '\n\nAverage album BPM: ' + albumBPM.toString().bbCode();
				// if (!isNaN(releaseDate)) {
				// 	if (!isNaN(rd)) description = '\n\nRelease date: ' + releaseDate.toUTCDateString();
				// }
				let vinylRipInfo;
				if (release.descriptions.length > 0) {
					description += '\n\n';
					if (isRED && prefs.tracklist_style == 3) description += '[pad=0|20]';
					if (release.descriptions.length == 1 && release.descriptions[0]
							&& (matches = vinylTest.exec(release.descriptions[0])) != null) {
						vinylRipInfo = release.descriptions[0].slice(matches.index).trim().split(/(?:[ \t]*\r?\n)+/);
						description += release.descriptions[0].slice(0, matches.index).trim();
					} else description += release.descriptions.filter(Boolean).join('\n\n');
					if (isRED && prefs.tracklist_style == 3) description += '[/pad]';
				}
				const finalizeDesc = elem => fetchOnlineAdditions().then(t => { description += '\n\n' + t }, reason => { }).then(function() {
					if (description) elem.value += '\n\n' + description.trim();
					preview(0);
				});
				if (elementWritable(ref = formItem('album_desc'))) {
					ref.value = genPlaylist();
					finalizeDesc(ref);
				} else if ((ref = formItem('body')) != null && !ref.disabled) {
					if (overwrite || ref.value.length == 0) ref.value = genPlaylist(); else {
						let eT;
						if (editionTitle) {
							eT = prefs.fix_capitalization ? editionTitle.properTitleCase(language) : editionTitle;
							if (releaseYear > 0) eT += ' (' + releaseYear + ')';
						}
						ref.value += '\n\n' + genPlaylist(false, false, eT);
					}
					finalizeDesc(ref);
				}
				// Release description
				if (elementWritable(ref = document.getElementById('release_samplerate'))) {
					ref.value = Object.keys(release.sampleRates).length == 1 && Object.keys(release.sampleRates)[0] ?
						Math.floor(Object.keys(release.sampleRates)[0] / 1000) :
					Object.keys(release.sampleRates).length > 1 || isNaN(Object.keys(release.sampleRates)[0]) ? '999' : '';
				}
				let lineage = '', rlsDesc = '', hasSR = Object.keys(release.sampleRates).length > 0;
				let srInfo = hasSR ? Object.keys(release.sampleRates).filter(samplerate => samplerate > 0)
					.sort((a, b) => release.sampleRates[b] - release.sampleRates[a])
					.map(f => f / 1000).join('/') + ' kHz' : undefined;
				let techInfo = [
					''.bbPre().bbHide('DR' + (release.albumdrs.length == 1 ? release.albumdrs[0] : '')),
				];
				if (['Blu-Ray', 'DVD', 'SACD'].includes(media)) {
					if (!isNWCD) rlsDesc = srInfo;
					addChannelInfo();
					if (media == 'SACD' || isFromDSD) addDSDInfo();
					if (prefs.cleanup_descriptions) addDRInfo();
					//addRGInfo();
					addHybridInfo();
				} else if (media == 'Vinyl') {
					let hassr = hasSR && (!isNWCD || Object.keys(release.sampleRates).length > 1);
					if (hassr) lineage = srInfo + ' ';
					if (vinylRipInfo) {
						if (vinylTest.test(vinylRipInfo[0]) && RegExp.$2.toLowerCase() != 'unknown')
							vinylRipInfo[0] = vinylRipInfo[0].replace(vinylTest, '$1[color=blue]$2[/color]');
						if (hassr) vinylRipInfo[0] = vinylRipInfo[0].replace(/^Vinyl\b/, 'vinyl');
						lineage += vinylRipInfo[0];
						lineage += '\n\n[u]Lineage:[/u]' + vinylRipInfo.slice(1).map(l => '\n' + [
							// RuTracker translation
							['Код класса состояния винила', 'Vinyl condition class'],
							['Устройство воспроизведения', 'Turntable'],
							['Головка звукоснимателя', 'Cartridge'],
							['Картридж', 'Cartridge'],
							['Предварительный усилитель', 'Preamplifier'],
							['АЦП', 'ADC'],
							['Программа-оцифровщик', 'Software'],
							['Обработка звука', 'Audio post-processing'],
							['Обработка', 'Post-processing'],
						].reduce((acc, it) => acc.replace(...it), l)).join('');
					} else lineage += `${hassr ? ' vinyl' : 'Vinyl'} rip by [color=blue][/color]\n\n[u]Lineage:[/u]\n`;
					techInfo.push('[img][/img]'.repeat(8).bbHide('Technical'));
				} else if (tracks.some(track => track.bitdepth > 16)) { // other Hi-Res
					if (!isNWCD || Object.keys(release.sampleRates).length > 1) rlsDesc = srInfo;
					if (release.channels && release.channels != 2 || dualMono) addChannelInfo();
					if (isFromDSD) addDSDInfo();
					if (!isFromDSD || prefs.cleanup_descriptions) addDRInfo();
					//addRGInfo();
					addHybridInfo();
					if (!isFromDSD && !prefs.cleanup_descriptions
							&& (Object.keys(release.sampleRates).length != 1 || Object.keys(release.sampleRates)[0] != 88200))
						techInfo.shift();
				} else { // 16bit and lossy
					if (Object.keys(release.sampleRates).some(f => f != 44100)) rlsDesc = srInfo;
					if (release.channels && release.channels != 2 || dualMono) addChannelInfo();
					addDRInfo();
					//addRGInfo();
					if (!prefs.cleanup_descriptions) techInfo.shift();
					if (release.codec == 'MP3' && release.vendor) {
						// TODO: parse mp3 vendor string
					} else if (['AAC', 'Opus', 'Vorbis'].includes(release.codec) && release.vendor) {
						let _encoder_settings = release.vendor;
						if (release.codec == 'AAC' && /^(?:qaac)\s+[\d\.]+/i.test(release.vendor)) {
							let enc = [];
							if (matches = release.vendor.match(/\bqaac\s+([\d\.]+)\b/i)) enc[0] = matches[1];
							if (matches = release.vendor.match(/\bCoreAudioToolbox\s+([\d\.]+)\b/i)) enc[1] = matches[1];
							if (matches = release.vendor.match(/\b(AAC-\S+)\s+Encoder\b/i)) enc[2] = matches[1];
							if (matches = release.vendor.match(/\b([TC]VBR|ABR|CBR)\s+(\S+)\b/)) { enc[3] = matches[1]; enc[4] = matches[2]; }
							if (matches = release.vendor.match(/\bQuality\s+(\d+)\b/i)) enc[5] = matches[1];
							_encoder_settings = 'Converted by Apple\'s ' + enc[2] + ' encoder (' + enc[3] + '-' + enc[4] + ')';
						}
						lineage = _encoder_settings;
					}
				}
				function addDSDInfo() {
					let nfo = ' DSD64';
					if (prefs.sacd_decoder) nfo += ' using ' + prefs.sacd_decoder;
					nfo += '\nOutput gain: ' + '+0dB'.bbCode();
					if (isNWCD) lineage = 'From' + nfo; else {
						if (rlsDesc) rlsDesc += ' from'; else rlsDesc = 'From';
						rlsDesc += nfo;
					}
				}
				function addDRInfo() {
					if (release.albumdrs.length != 1 || document.getElementById('release_dynamicrange') != null) return;
					let nfo = 'DR' + release.albumdrs[0];
					if (release.albumdrs[0] < 4) nfo = nfo.bbColor('red');
					if (rlsDesc) rlsDesc += ' | ';
					rlsDesc += nfo;
				}
				function addRGInfo() {
					if (release.albumgains.length <= 0) return;
					if (rlsDesc) rlsDesc += ' | ';
					rlsDesc += 'RG'; //rlsDesc += 'RG ' + albumgains[0];
				}
				function addChannelInfo() {
					if (release.channel_mode) var chi = release.channel_mode;
						else if (getHomoIdentifier('DUAL_MONO')) chi = 'dual mono';
							else if (release.channels) chi = getChanString(release.channels);
					if (!chi) return;
					if (rlsDesc) rlsDesc += ', '; else rlsDesc = 'Channels configuration: ';
					rlsDesc += chi;
				}
				function addHybridInfo() {
					if (release.bitdepths.length > 1) release.bitdepths.filter(bitdepth => bitdepth != 24).forEach(function(bitdepth) {
						var hybrid_tracks = tracks.filter(it => it.bitdepth == bitdepth).sort(trackComparer).map(function(it) {
							return (release.totalDiscs > 1 && it.disc_number ? it.disc_number + '-' : '') + it.track_number;
						});
						if (hybrid_tracks.length < 1) return;
						if (rlsDesc) rlsDesc += '\n';
						rlsDesc += 'Note: track';
						if (hybrid_tracks.length > 1) rlsDesc += 's';
						rlsDesc += ' #' + hybrid_tracks.join(', ') +
							(hybrid_tracks.length > 1 ? ' are' : ' is') + ' ' + bitdepth + 'bit lossless';
					});
				}
				rlsDesc = rlsDesc ? [rlsDesc] : [ ];
				function finRlsDesc() {
					if (techInfo.filter(Boolean).length > 0) rlsDesc.push(techInfo.filter(Boolean).join(' | '));
					if (release.release_descriptions.length > 0) Array.prototype.push.apply(rlsDesc, release.release_descriptions);
					if (prefs.insert_release_date && !isNaN(releaseDate) && !/^\s*\d{4}\s*$/.test(release.release_date))
						rlsDesc.push('Released on ' + releaseDate.toUTCDateString());
				}
				if ((ref = document.getElementById('release_lineage')) != null) {
					lineage = lineage ? [lineage] : [ ];
					finRlsDesc();
					if (sourceUrl || release.urls.length > 0) lineage.push(getReleaseUrls());
					if (elementWritable(ref) && (ref.value = lineage.join('\n\n'))) preview(1);
				} else {
					if (lineage.length > 0) rlsDesc.push(lineage);
					finRlsDesc();
					if (sourceUrl || release.urls.length > 0) rlsDesc.push(getReleaseUrls());
				}
				if (prefs.add_spectrals_template && !['Vinyl'].includes(media))
					rlsDesc.push('[img][/img]\n'.repeat(16).slice(0, -1).bbHide('Spectrograms'));
				if (elementWritable(ref = formItem('release_desc')))
					if (ref.value = rlsDesc.filter(Boolean).join('\n\n')) preview(isNWCD ? 2 : 1);
				if (release.encoding == 'lossless' && Object.keys(release.sampleRates).length <= 1
						&& release.bitdepths.length <= 1 //&& release.bitdepths.some(bitdepth => bitdepth >= 24)
						&& formItem('release_desc') != null) Promise.all(
					release.dirpaths.map(dirPath => textFileReader(dirPath + '\\foo_dr.txt')
						.catch(reason => textFileReader(dirPath + '\\' + dirPath.replace(/^.*[\\\/]/, '') + '_log.txt')))
				).then(function(drlogs) {
					let ref = formItem('release_desc');
					if (ref == null) throw "Assertion failed: formItem('release_desc') != NULL";
					const drExtractors = [
						/^(?:Official DR value):\s*(?:DR(\d+))\b/m, // foo_dynamic_range
						/^(?:Official EP\/Album DR):\s*(\d+)\b/m, // MAAT DROffline MkII
					];
					let DRs = drlogs.map(function(drlog) {
						var dr = drExtractors.reduce((dr, rx) => dr != null && dr >= 0 ? dr
							: rx.test(drlog) ? parseInt(RegExp.$1) : null, null);
						if (dr != null && dr >= 0) return dr;
						let columnIndex;
						drlog.split(/\r?\n/).forEach(function(line) {
							if (dr != null && dr >= 0) return;
							let columns = line.trim().split(/\s*\|\s*/);
							if (!(columnIndex >= 0)) columnIndex = columns.indexOf('DR (PMF)');
								else if (columnIndex >= 0 && /^\d+$/.test(columns[columnIndex])) dr = parseInt(columns[columnIndex]);
						});
						return dr != null && dr >= 0 ? dr : null;
					});
					let DRinfo = '[hide=DR';
					if (DRs[0] != null && DRs[0] >= 0 && DRs.homogeneous()) DRinfo += DRs[0];
					DRinfo += ']' + drlogs.map(foodr => foodr.bbPre()).join('\n');
					if (/(\[hide=DR(\d+)?\]\[pre\])(\[\/pre\])/m.test(ref.value))
						ref.value = RegExp.leftContext + DRinfo + RegExp.rightContext;
					else ref.value += '\n\n' + DRinfo + '[/hide]';
				}, function(reason) {
					console.log(reason);
					console.log('foo_dr.txt not exists or is forbidden to read ' +
						'(TM: Settings > Security > Allow scripts to access local files > All local files)');
				});
				if (elementWritable(ref = document.getElementById('release_dynamicrange')))
					ref.value = release.albumdrs.length == 1 ? release.albumdrs[0] : '';
				// Compare to online source
				if (!onlineSource) {
					if (prefs.assume_weblink && !sourceUrl && release.urls.length <= 0) addMessage('No lineage URL', 'notice');
					onlineSource = sourceUrl || release.urls.length > 0 ?
						urlResolver(sourceUrl || release.urls[0]).then(sourceUrl => fetchOnline_Music(sourceUrl, true))
							: Promise.reject('no lineage URL');
					onlineSource.then(completeFromOnlineSource);
					if (prefs.check_integrity_online) onlineSource.catch(reason => lookupOnlineSource().then(function(result) {
						if (typeof result == 'object') return parseLastFm(result);
						if (httpParser.test(result)) return fetchOnline_Music(result, true);
						return Promise.reject('Unhandled format');
					})).then(onlineCheck).catch(function(reason) {
						if (!media || media == 'WEB') tracks.forEach(function(track) {
							if (!track.duration || track.duration < 29.6 || track.duration > 30.4) return;
							addMessage('track ' + track.track_number + ' possible track preview', 'warning');
						});
					});
				}
			} // upload
			if ((isUpload || isRequestNew) && prefs.find_relations) lookupMusicRelations();
			if (ajaxRejects > 0 && (ref = document.body.querySelector('input#artist')) != null && !ref.disabled
					&& (ref = formItem('album_desc') || formItem('desc') || formItem('description')) != null && !ref.disabled) {
				let msg = (ajaxRejects > 1 ? ajaxRejects.toString() + ' artist queries were' : 'One artist query was') +
					' thrown due to site API policy';
				let delay = window.localStorage.getItem('ajaxTimeFrame');
				if (delay) try {
					delay = JSON.parse(delay).expiresAt;
					delay = delay > 0 ? delay - Date.now() : undefined;
				} catch(e) { console.warn(e) }
				if (!isFinite(delay)) delay = gazelleApiTimeWindow * 1000 + gazelleApiQuota * 150;
				msg += '. Multiple artists not split correctly? => Redo filling in overwrite mode';
				if (delay >= 0) {
					setTimeout(() => { addMessage('free API timeframe for requery available', 'info') }, delay);
					msg += ' after ' + Math.ceil(delay / 1000) + 's';
				}
				addMessage(msg, 'notice');
			}
			if (prefs.clean_on_apply) uaData.value = '';
			for (let key in prefs) if (typeof prefs[key] != 'function' && prefs[key] !== undefined)
				GM_setValue(key, prefs[key]);
			if (Object.keys(siteArtistsCache).length > 0) sessionStorage.siteArtistsCache = JSON.stringify(siteArtistsCache);
			if (notSiteArtistsCache.length > 0) sessionStorage.notSiteArtistsCache = JSON.stringify(notSiteArtistsCache);
			return true;

			// ---------------------------------------------------------------------------------------------------------------

			function genPlaylist(pad = true, header = true, title = undefined, useLyrics = true) {
				let style = prefs.tracklist_style;
				if (style == 2) {
					if (!tracks.every(track => track.duration)) style = 1;
					else if (prefs.include_lyrics && useLyrics && tracks.some(track => track.lyrics)
							|| tracks.map(track => track.title).some(notMonospaced)
							|| tracks.map(track => track.track_artist).some(notMonospaced)
							|| composerEmphasis && tracks.map(track => track.composer).some(notMonospaced)) style = 3;
				}
				if (!(style > 0)) return null;
				if (!isRED) pad = false;
				const colorStripper = php => [/\[color(?:=[^\[\]]+)?\]/ig, /\[\/color\]/ig]
					.reduce((acc, rx) => acc.replace(rx, ''), php);
				let playlist = '';
				if (tracks.length > 1 || releaseType != getReleaseTypeValue('Single')
						|| prefs.singles_conventional_format || isRequestNew || isRequestEdit) {
					function getClassicalWork(track) {
						console.assert(track, 'track');
						if (!track) throw 'getClassicalWork(...): track is void';
						console.assert(track.classical_work, 'track.classical_work');
						if (!track.classical_work) return undefined;
						const classicalWork = classicalWorks[track.classical_work];
						console.assert(classicalWork, 'getClassicalWork: classicalWork is undefined',
							track.classical_work, classicalWorks);
						return classicalWork;
					}
					function cleanupClassicalTags(track) {
						for (let key of ['classical_work', 'classical_title']) if (key in track) delete track[key];
					}

					playlist = (title ? title.bbPlain() : prefs.tracklist_title /*'https://ptpimg.me/970q81.png'.bbImg()*/);
					if (!prefs.colorless_tracklist && prefs.tracklist_head_color)
						playlist = playlist.bbColor(prefs.tracklist_head_color);
					playlist = playlist.bbBold().bbSize(fontSize + 1) + '\n'; //'[hr]';
					if (header) playlist = genAlbumHeader() + playlist;
					const classicalWorks = { }, classicalWorkParsers = [
						/* 0 */ /^(.*?)\s*:\s+(.+)$/,
						/* 1 */ /^(.+?)(?:\s*:|\s+-)\s+((?:Nos?(?:\.\s*|\s+))?\d+.+)$/,
						/* 2 */ /^(.+?)(?:\s*:|\s+-)\s+([CDILMVX]+(?:\.|\s-)\s+.+)$/,
					];
					const normSubstitutions = [
						[/\b(?:Pt)\b\.?\s*/ig, 'Part '], [/\b(?:Op)\b\.?\s*/ig, 'Opus '], [/\b(?:Arr)\b\.\s*/ig, 'Arrangement '],
						[/\b(?:One)\b/ig, '1'], [/\b(?:Two)\b/ig, '2'], [/\b(?:Three)\b/ig, '3'], [/\b(?:Four)\b/ig, '4'],
						[/\b(?:Five)\b/ig, '5'], [/\b(?:Six)\b/ig, '6'], [/\b(?:Seven)\b/ig, '7'], [/\b(?:Eight)\b/ig, '8'],
						[/\b(?:Nine)\b/ig, '9'], [/\b(?:Ten)\b/ig, '10'],
						[/\b(\w+)\b/g, (match, word) => word[0].toUpperCase() + word.slice(1).toLowerCase()], [/[\W]+/g, ''],
					]
					const normWorkTitle = workTitle => workTitle ?
						normSubstitutions.reduce((title, subst) => title.replace(...subst), workTitle) : undefined;
					if (composerEmphasis && !tracks.some(track => track.disc_subtitle)) for (let track of tracks) {
						cleanupClassicalTags(track);
						/*if (track.composer) */for (let classicalWorkParser of classicalWorkParsers.slice(isClassical ? 1 : 2)) {
							const m = classicalWorkParser.exec(track.title);
							if (m == null || !(track.classical_work = normWorkTitle(m[1] = m[1].trim()))
									|| !(track.classical_title = (m[2] = m[2].trim()))) continue;
							if (!(track.classical_work in classicalWorks)) {
								if (prefs.fix_capitalization) m[1] = m[1].properTitleCase(language);
								classicalWorks[track.classical_work] = { title: m[1] };
							}
							if (prefs.fix_capitalization) track.classical_title = track.classical_title.properTitleCase(language);
						}
					}
					for (let key in classicalWorks) {
						const classicalWork = classicalWorks[key], trackSet = tracks.filter(track => track.classical_work == key);
						if (trackSet.length > 1 || tracks.every(track => track.classical_work)) {
							if (trackSet[0].track_artist && trackSet[0].track_artist != release.artist
									&& trackSet.map(track => track.track_artist).homogeneous()) {
								classicalWork.performer = getRealTrackArtist(trackSet[0]);
								if (trackSet[0].conductor && trackSet.map(track => track.conductor).homogeneous())
									classicalWork.conductor = trackSet[0].conductor;
							}
							if (trackSet[0].composer && release.trackComposers.length > 1
									&& trackSet.map(track => track.composer).homogeneous()) classicalWork.composer = trackSet[0].composer;
						} else {
							trackSet.forEach(cleanupClassicalTags);
							delete classicalWorks[key];
						}
					}
					let lastDisc, lastSubtitle, lastClassicalWork, lastSide, track, duration,
							block = 0, tnOffset = 0, ignoreTrackartist = false, ignoreComposer = false,
							volumes = new Map(tracks.map(it => [it.disc_number, undefined]));
					volumes.forEach(function(val, key) {
						volumes.set(key, new Set(tracks.filter(it => it.disc_number == key).map(it => it.disc_subtitle)).size);
					});
					let vinylTrackWidth = tracks.reduce((acc, it) =>
						vinyltrackParser.test(it.track_number.toString().toUpperCase()) ?
							Math.max(parseInt(RegExp.$3) || 0, acc) : acc, -1);
					if (vinylTrackWidth >= 0) {
						vinylTrackWidth = vinylTrackWidth.toString().length;
						tracks.forEach(function(track) {
							if ((matches = vinyltrackParser.exec(track.track_number.toString())) == null) return;
							track.track_number = matches[1].toUpperCase();
							if (matches[3]) track.track_number += matches[3].padStart(vinylTrackWidth, '0');
							if (matches[4]) track.track_number += matches[4];
						});
						++vinylTrackWidth;
					}
					const padUnit = isRED ? ['[pad=0|0|5|0]', '[/pad]'] : undefined;
					if (canSort && prefs.sort_tracklist) tracks.sort(trackComparer);
					tracks.forEach(function(_track) {
						let title = '', trackArtist = _track.track_artist ? getRealTrackArtist(_track) : undefined;
						let sameMedia = (release.totalDiscs > 1 && _track.disc_number ?
							tracks.filter(track => track.disc_number == _track.disc_number) : tracks);
						let ttwidth = sameMedia.every(t => t.track_number && parseInt(t.track_number) == t.track_number) ?
							sameMedia.reduce((acc, track) => Math.max(acc, parseInt(track.track_number).toString().length), 2) : 0;

						function realTrackNumber() {
							return ttwidth > 0 && !(vinylTrackWidth >= 0) ?
								parseInt(_track.track_number).toString().padStart(ttwidth, '0') : _track.track_number;
						}
						function prologue(prefix, postfix) {
							function block1() {
								if (block == 3) playlist += postfix;
								playlist += '\n';
								if (padUnit && ![1, 2].includes(block)) playlist += padUnit[0];
								block = 1;
								ignoreTrackartist = ignoreComposer = false;
							}
							function block2() {
								if (block == 3) playlist += postfix;
								playlist += '\n';
								if (padUnit && ![1, 2].includes(block)) playlist += padUnit[0];
								block = 2;
							}
							function block3() {
								//if (block == 2 && isRED) playlist += '[hr]';
								if (padUnit && [1, 2].includes(block)) playlist += padUnit[1];
								playlist += '\n';
								if (block != 3) playlist += prefix;
								block = 3;
							}

							if (release.totalDiscs > 1 && _track.disc_number != lastDisc) {
								block1();
								lastDisc = _track.disc_number;
								lastSubtitle = lastClassicalWork = undefined;
								if (!prefs.colorless_tracklist && prefs.tracklist_disctitle_color)
									playlist += '[color=' + prefs.tracklist_disctitle_color + ']';
								playlist += '[size=' + (fontSize + 1) + '][b]';
								playlist += _track.identifiers.VOL_MEDIA && tracks.filter(it => it.disc_number == _track.disc_number)
									.every(it => it.identifiers.VOL_MEDIA == _track.identifiers.VOL_MEDIA) ?
										_track.identifiers.VOL_MEDIA.toUpperCase() + ' ' : 'Disc ' + _track.disc_number.toString();
								if (_track.disc_subtitle && (volumes.get(_track.disc_number) || 0) == 1) {
									playlist += ' – ' + (prefs.fix_capitalization ?
										_track.disc_subtitle.properTitleCase(language) : _track.disc_subtitle).bbPlain();
									lastSubtitle = normWorkTitle(_track.disc_subtitle);
								}
								playlist += '[/b][/size]';
								duration = tracks.filter(it => it.disc_number == _track.disc_number).reduce((acc, it) => acc + it.duration, 0);
								if (duration > 0) playlist += ' ' + `[${makeTimeString(duration)}]`.bbItalic().bbSize(fontSize - 1);
								if (!prefs.colorless_tracklist && prefs.tracklist_disctitle_color) playlist += '[/color]';
								tnOffset = tracks.filter(track => track.disc_number == _track.disc_number)
									.reduce(computeLowestTrack, undefined) - 1 || 0;
								if (tnOffset) addMessage('volume ' + _track.disc_number + ' track numbering not starting from 1', 'info');
							}
							if (normWorkTitle(_track.disc_subtitle) != (lastSubtitle || undefined)) {
								if (block != 1 || _track.disc_subtitle) block1();
								if (_track.disc_subtitle) {
									let workSet = tracks.filter(track => normWorkTitle(track.disc_subtitle) == normWorkTitle(_track.disc_subtitle));
									if (!prefs.colorless_tracklist && prefs.tracklist_work_color)
										playlist += '[color=' + prefs.tracklist_work_color + ']';
									playlist += '[size=' + fontSize + '][b]';
									if (trackArtist && workSet.map(getRealTrackArtist).homogeneous()) {
										playlist += trackArtist.bbPlain();
										if (composerEmphasis && _track.conductor && workSet.map(track => track.conductor).homogeneous())
											playlist += ' under ' + _track.conductor.bbPlain();
										playlist += ' - ';
										ignoreTrackartist = true;
									}
									playlist += (prefs.fix_capitalization ? _track.disc_subtitle.properTitleCase(language)
										: _track.disc_subtitle).bbPlain();
									if (_track.composer && composerEmphasis && release.trackComposers.length != 1
											&& workSet.map(track => track.composer).homogeneous()) {
										playlist += ' (' + _track.composer.bbPlain() + ')';
										ignoreComposer = true;
									}
									playlist += '[/b][/size]';
									duration = workSet.reduce((acc, track) => acc + track.duration, 0);
									if (duration > 0) playlist += ' ' + `[${makeTimeString(duration)}]`.bbItalic().bbSize(fontSize - 1);
									if (!prefs.colorless_tracklist && prefs.tracklist_work_color) playlist += '[/color]';
								}
								lastSubtitle = normWorkTitle(_track.disc_subtitle);
							}
							if (_track.classical_work != lastClassicalWork) {
								if (_track.classical_work) {
									block2();
									const classicalWork = getClassicalWork(_track);
									if (!prefs.colorless_tracklist && prefs.tracklist_work_color)
										playlist += '[color=' + prefs.tracklist_work_color + ']';
									playlist += '[size=' + fontSize + '][b]';
									if (release.trackComposers.length != 1 && classicalWork.composer)
										playlist += classicalWork.composer.bbPlain() + ': ';
									playlist += classicalWork.title.bbPlain();
									playlist += '[/b]';
									let workArtist = classicalWork.performer;
									if (workArtist && workArtist != release.artist) {
										playlist += ' (' + workArtist.bbPlain();
										if (classicalWork.conductor) playlist += ' under ' + classicalWork.conductor.bbPlain();
										playlist += ')';
									}
									playlist += '[/size]';
									duration = tracks.filter(track => track.classical_work == _track.classical_work)
										.reduce((acc, it) => acc + it.duration, 0);
									if (duration > 0) playlist += ' ' + `[${makeTimeString(duration)}]`.bbItalic().bbSize(fontSize - 1);
									if (!prefs.colorless_tracklist && prefs.tracklist_work_color) playlist += '[/color]';
								} else if (block > 2) block1();
								lastClassicalWork = _track.classical_work;
							}
							if (vinylTrackWidth >= 0) {
								let vinylTrack = vinyltrackParser.test(_track.track_number);
								if (block == 3 && lastSide && (vinylTrack ? RegExp.$1 != lastSide : _track.track_number == 1))
									playlist += '\n';
								lastSide = RegExp.$1;
							}
							block3();
						} // prologue

						switch (style) {
							case 1:
							case 3: {
								prologue('[size=' + fontSize + ']', '[/size]\n');
								track = !prefs.colorless_tracklist && prefs.tracklist_tracknumber_color ?
									'[color=' + prefs.tracklist_tracknumber_color + '][b]' : '[b]';
								track += realTrackNumber() + '[/b]' + prefs.title_separator;
								if (!prefs.colorless_tracklist && prefs.tracklist_tracknumber_color) track += '[/color]';
								if (!ignoreTrackartist && trackArtist && (!_track.classical_work || !getClassicalWork(_track).performer)) {
									if (!prefs.colorless_tracklist && prefs.tracklist_artist_color)
										title = '[color=' + prefs.tracklist_artist_color + ']';
									title += trackArtist.bbPlain();
									if (composerEmphasis && _track.conductor) title += ' under ' + _track.conductor.bbPlain();
									if (!prefs.colorless_tracklist && prefs.tracklist_artist_color) title += '[/color]';
									title += ' - ';
								}
								title += (_track.classical_title || (prefs.fix_capitalization ?
									_track.title.properTitleCase(language) : _track.title)).bbPlain();
								if (!ignoreComposer && _track.composer && composerEmphasis && release.trackComposers.length != 1
										&& (!_track.classical_work || !getClassicalWork(_track).composer)) {
									title += ' ';
									if (!prefs.colorless_tracklist && prefs.tracklist_composer_color)
										title += '[color=' + prefs.tracklist_composer_color + ']';
									title += '(' + _track.composer.bbPlain() + ')';
									if (!prefs.colorless_tracklist && prefs.tracklist_composer_color) title += '[/color]';
								}
								playlist += track + title;
								if (_track.duration) {
									playlist += ' [i]';
									if (!prefs.colorless_tracklist && prefs.tracklist_duration_color)
										playlist += '[color=' + prefs.tracklist_duration_color +']';
									playlist += '[' + makeTimeString(_track.duration) + ']';
									if (!prefs.colorless_tracklist && prefs.tracklist_duration_color) playlist += '[/color]';
									playlist += '[/i]';
								}
								if (prefs.include_lyrics && useLyrics && _track.lyrics)
									playlist += ' ' + _track.lyrics.bbPlain().bbHide('lyrics').bbSize(fontSize - 1);
								break;
							}
							case 2: {
								prologue('[size=' + fontSize + '][pre]', '[/pre][/size]');
								track = realTrackNumber();
								track += prefs.title_separator;
								if (!ignoreTrackartist && trackArtist && (!_track.classical_work || !getClassicalWork(_track).performer)) {
									title = trackArtist;
									if (composerEmphasis && _track.conductor) title += ' under ' + _track.conductor;
									title += ' - ';
								}
								title += _track.classical_title || (prefs.fix_capitalization ?
									_track.title.properTitleCase(language) : _track.title);
								if (!ignoreComposer && _track.composer && composerEmphasis && release.trackComposers.length != 1
										&& (!_track.classical_work || !getClassicalWork(_track).composer))
									title = title + ' (' + _track.composer + ')';
								let l = 0, j, left, padding, spc;
								duration = _track.duration ? ' [' + makeTimeString(_track.duration) + ']' : null;
								let width = prefs.max_tracklist_width - track.length;
								if (duration) width -= duration.length + 1;
								while (title.trueLength() > 0) {
									j = width;
									if (title.trueLength() > width) {
										while (j > 0 && title[j] != ' ') { --j }
										if (j <= 0) j = width;
									}
									left = title.slice(0, j).trim();
									if (++l <= 1) {
										playlist += track + left;
										if (duration) {
											spc = width - left.trueLength();
											padding = (spc < 2 ? ' '.repeat(spc) : ' ' + prefs.pad_leader.repeat(spc - 1)) + ' ';
											playlist += padding + duration;
										}
										width = prefs.max_tracklist_width - track.length;
									} else playlist += '\n' + ' '.repeat(track.length - 1) + left;
									title = title.slice(j).trim();
								}
								break;
							}
						}
					});
					switch (style) {
						case 1:
						case 3:
							if (totalTime > 0) {
								playlist += '\n\n' + divs[0].repeat(10) + '\nTotal time: ';
								if (!prefs.colorless_tracklist && prefs.tracklist_duration_color)
									playlist += '[color=' + prefs.tracklist_duration_color + ']';
								playlist += makeTimeString(totalTime).bbItalic();
								if (!prefs.colorless_tracklist && prefs.tracklist_duration_color) playlist += '[/color]';
								playlist += '[/size]';
							}
							break;
						case 2:
							if (totalTime > 0) {
								duration = '[' + makeTimeString(totalTime) + ']';
								playlist += '\n\n' + divs[0].repeat(32).padStart(prefs.max_tracklist_width);
								playlist += '\n' + 'Total time:'.padEnd(prefs.max_tracklist_width - duration.length) + duration;
							}
							playlist += '[/pre][/size]';
							break;
					}
					if (pad) playlist = playlist.bbPad('10|0');
					if (style == 3) playlist = playlist.bbAlign('center');
				} else { // single
					if (release.artist) {
						//if (!prefs.colorless_tracklist && prefs.tracklist_artist_color)
						//	playlist += '[color=' + prefs.tracklist_artist_color + ']';
						playlist += release.artist.bbPlain();
						//if (!prefs.colorless_tracklist && prefs.tracklist_artist_color) playlist += '[/color]';
						playlist += isRED ? '[hr]' : '\n' + divs[0].repeat(24) + '\n';
					}
					playlist += tracks[0].title.bbPlain();
					playlist = playlist.bbBold();
					if (artists[3].length > 0) {
						playlist += '\n[i]';
						//if (!prefs.colorless_tracklist && prefs.tracklist_composer_color)
						//	playlist += '[color=' + prefs.tracklist_composer_color + ']';
						playlist += '(' + joinArtists(artists[3]).bbPlain() + ')';
						//if (!prefs.colorless_tracklist && prefs.tracklist_composer_color) playlist += '[/color]';
						playlist += '[/i]';
					}
					if (tracks[0].duration) {
						playlist += '\n\n';
						//if (!prefs.colorless_tracklist && prefs.tracklist_duration_color)
						//	playlist += '[color=' + prefs.tracklist_duration_color + ']';
						playlist += '[' + makeTimeString(tracks[0].duration) + ']';
						//if (!prefs.colorless_tracklist && prefs.tracklist_duration_color) playlist += '[/color]';
					}
					playlist = playlist.bbSize(fontSize + 1);
					if (prefs.include_lyrics && useLyrics && tracks[0].lyrics)
						playlist += '\n\n' + tracks[0].lyrics.bbPlain().bbHide('Lyrics').bbSize(fontSize - 1);
					if (isRED) playlist = playlist.bbPad('20');
					playlist = playlist.bbAlign('center'); //return colorStripper(playlist.bbAlign('center'));
				}
				if (playlist.length >= 64 * 2**10)
					if (useLyrics && tracks.some(track => track.lyrics)) return genPlaylist(pad, header, title, false);
						else addMessage('playlist length exceeds 64 KiB (' + formattedSize(playlist.length) + '; will be truncated)', 'warning');
				return /*prefs.colorless_tracklist ? colorStripper(playlist) : */playlist;
			}

			function computeLowestTrack(acc, track) {
				if (Number.isNaN(acc)) return NaN;
				let tn = parseInt(track.track_number);
				if (isNaN(tn)) return NaN;
				return isNaN(acc) || tn < acc ? tn : acc;
			}

			function getLinkCode(url) {
				if (httpParser.test(url)) url = new URL(url); else return null;
				const storeDefs = {
					'7digital.com': ['https://ptpimg.me/300scj.png', '7digital'],
					'acousticsounds.com': ['https://ptpimg.me/006l78.png', 'Acoustic Sounds'],
					'actmusic.com': ['https://ptpimg.me/66o45d.png', 'ACT Music'],
					'allmusic.com': ['https://ptpimg.me/vbjw19.png', 'AllMusic'],
					'music.amazon.com': ['https://ptpimg.me/21n3b1.png', 'Amazon Music'],
					'amazon.com': ['https://ptpimg.me/21n3b1.png', 'Amazon'],
					'bandcamp.com': ['https://ptpimg.me/vwki92.jpg', 'Bandcamp'], // https://ptpimg.me/7evz4g.png
					'beatport.com': ['https://ptpimg.me/lf8q75.png', 'Beatport'],
					'beatsource.com': ['https://ptpimg.me/3u11lg.png', 'Beatsource'],
					'bleep.com': ['https://ptpimg.me/11s718.png', 'Bleep'],
					'boomkat.com': ['Boomkat'],
					'music.bugs.co.kr': ['https://ptpimg.me/8rs9c4.png', 'https://ptpimg.me/a7beq9.png', 'Bugs | 벅스'],
					'deezer.com': ['https://ptpimg.me/mx2of1.png', 'Deezer'],
					'discogs.com': ['https://ptpimg.me/v27891.png', 'Discogs'], // https://ptpimg.me/57y9c3.png
					'dominomusic.com': ['https://ptpimg.me/sfx7f0.png', 'Domino'],
					'e-onkyo.com': ['https://ptpimg.me/uke3n1.png'],
					'eclassical.com': ['https://ptpimg.me/l98s2h.png', 'eClassical.com'],
					'ecmrecords.com': ['ECM Records'],
					'extrememusic.com': ['Extreme Music'],
					'music-flo.com': ['https://ptpimg.me/bkth6r.png', 'FLO'],
					'genie.co.kr': ['https://ptpimg.me/4k9md7.png', 'Genie | 지니'],
					'hdtracks.com': ['https://ptpimg.me/eurm85.png'/*'https://ptpimg.me/wx36i4.png'*/, 'HDtracks'],
					'highresaudio.com': ['https://ptpimg.me/65xx03.png', 'HighResAudio'],
					'indies.eu': ['https://ptpimg.me/8a4w49.png', 'Indies Scope'],
					'itunes.apple.com': ['https://ptpimg.me/in7u5u.png', 'Apple Music'],
					'joox.com': ['https://ptpimg.me/9g80q0.png', 'JOOX'],
					'jpc.de': ['https://ptpimg.me/s69l4u.png', 'jpc'],
					'junodownload.com': ['https://ptpimg.me/6c7y42.png', 'Juno Download'],
					'kompakt.fm': ['Kompakt'],
					'kuwo.cn': ['https://ptpimg.me/71lmgg.png', 'Kuwo Music | 酷我音乐'],
					'kugou.com': ['https://ptpimg.me/1257u0.png', 'Kugou | 酷狗音乐'],
					'melon.com': ['https://ptpimg.me/xduo73.png', 'Melon'],
					'mora.jp': ['https://ptpimg.me/9rg495.png', 'Mora'],
					'music.163.com': ['https://ptpimg.me/v868rn.png', 'NetEase'],
					'music.amazon.com': ['https://ptpimg.me/ch5ty2.png', 'Amazon Music'],
					'music.amazon.co.uk': ['https://ptpimg.me/ch5ty2.png', 'Amazon Music'],
					'music.apple.com': ['https://ptpimg.me/in7u5u.png', 'Apple Music'],
					'music.yandex.ru': ['Yandex Music'],
					'music.youtube.com': ['https://ptpimg.me/219lp5.png', 'YouTube Music'],
					'musicbrainz.org': ['https://ptpimg.me/4m45i9.png', 'MusicBrainz'],
					'muziekweb.nl': ['Muziekweb '],
					'nativedsd.com': ['https://ptpimg.me/m6j8gp.png', 'NativeDSD'],
					'ototoy.jp': ['https://ptpimg.me/h5917l.png', 'OTOTOY'],
					'prestomusic.com': ['https://ptpimg.me/q86vjt.png', 'Presto Music'],
					'prostudiomasters.com': ['https://ptpimg.me/xkm0th.png', 'ProStudioMasters'],
					'qobuz.com': ['https://ptpimg.me/1saep4.png', 'Qobuz'],
					'qq.com': ['QQ音乐'],
					'rateyourmusic.com': ['https://ptpimg.me/5dcpw5.png', 'Rate Your Music'],
					'recochoku.jp': ['RecoChoku'],
					'spotify.com': ['https://ptpimg.me/xo5d1p.png', 'Spotify'],
					'store.pias.com': ['https://ptpimg.me/w7p8r0.png', '[PIAS]'],
					'supraphonline.cz': ['https://ptpimg.me/h85655.png', 'Supraphonline'],
					'tidal.com': ['https://ptpimg.me/w80424.png', 'Tidal'],
					'traxsource.com': ['Traxsource'],
					'vgmdb.net': ['VGMdb'],
				};
				return Object.keys(storeDefs).reduce(function(acc, domain) {
					if (acc) return acc;
					if (!url.hostname.endsWith(domain.toLowerCase()) || !Array.isArray(storeDefs[domain])) return undefined;
					return storeDefs[domain].reduce(function(acc, str) {
						if (acc) return acc;
						if (httpParser.test(str)) {
							if (prefs.use_store_logos) return str.bbImg().bbUrl(url.href);
						} else {
							if (prefs.use_store_names) return str.bbUrl(url.href);
						}
						return undefined;
					}, undefined);
				}, undefined) || url.href.bbUrl();
			}
			function getReleaseUrls() {
				return release.urls.concat(getStoreUrls()).distinctValues().map(getLinkCode).join('\n');
			}

			function genAlbumHeader() {
				return isVA || artists[0].length < 3 ? '' : (joinArtists(artists[0], artist => artist.bbArtist()) +
					' – ' + release.album.bbPlain()).bbBold().bbSize(fontSize + 1) + '\n\n';
			}

			function findPreviousUploads() {
				let torrentIds = new Set;

				function getTorrentId(span) {
					for (let a of span.getElementsByTagName('A')) {
						if (a.pathname != '/torrents.php') continue;
						let torrentId = new URLSearchParams(a.search).get('torrentid');
						if (torrentId) return parseInt(torrentId);
					}
				}
				function searchLog(searchTerm, deepScan = false) {
					localXHR('/log.php?search=' + encodeURIComponent(searchTerm)).then(function(document) {
						const normFunc = str => str.toASCII().replace(/\W+/g, '').toLowerCase();
						for (let span of document.body.querySelectorAll('table#log_table > tbody > tr > td > span.log_deleted')) {
							const torrentId = getTorrentId(span);
							console.assert(torrentId > 0, 'torrentId > 0');
							if (!torrentId || torrentIds.has(torrentId)) continue;
							torrentIds.add(torrentId);
							if (!normFunc(span.textContent).includes(normFunc(searchTerm))) continue;
							const descriptors = /\[([^\/\[\]]+?)\s*\/\s*([^\/\[\]]+?)\s*\/\s*([^\/\[\]]+?)\]/.exec(span.textContent);
							if (descriptors != null) {
								if (media && media != descriptors[1] || release.codec && release.codec != descriptors[2]
										|| encoding && encoding != descriptors[3]) continue;
							} else if (albumSize > 0) {
								let torrentSize = getSizeFromString(span.textContent, 'B');
								if (!(torrentSize > 0) || Math.abs(albumSize / torrentSize - 1) > 0.1) continue;
							}
							addMessage(new HTML('possibly same release previously deleted: ' + span.innerHTML), 'notice');
						}
						if (deepScan) for (let span of document.body.querySelectorAll('table#log_table > tbody > tr > td > span.log_upload')) {
							if (!normFunc(span.textContent).includes(normFunc(searchTerm))) continue;
							const torrentId = getTorrentId(span);
							console.assert(torrentId > 0, 'torrentId > 0');
							if (torrentId && !torrentIds.has(torrentId)) searchLog('Torrent ' + torrentId);
						}
					});
				}

				const groupId = parseInt(urlParams.get('groupid'));
				if (groupId > 0) localXHR('/torrents.php?' + new URLSearchParams({
					action: 'grouplog',
					groupid: groupId,
				}).toString()).then(function(document) {
					for (let tr of document.body.querySelectorAll('div#content table > tbody > tr[class^="row"]')) {
						if (!tr.children[1].lastChild.textContent.trim() != '(Deleted)'
								&& !/^(?:deleted torrent)\b/.test(tr.lastElementChild.textContent.trim())) continue;
						const torrentId = getTorrentId();
						console.assert(torrentId > 0, 'torrentId > 0');
						if (torrentId > 0 && !torrentIds.has(torrentId)) searchLog('Torrent ' + torrentId);
					}
				}); else {
					const mainArtists = artists[0]
						.filter(artist => !roleCollisions[0].some(n => artists[n].includesCaseless(artist)))
						.sort();
					const title = release.album.replace(tailingBracketStripper, '');
					let searchTerm = title;
					if (!isVA && mainArtists.length > 0 && mainArtists.length < 3) {
						searchTerm = mainArtists.join(' & ') + ' - ' + searchTerm;
						// Promise.all(mainArtists.map(artist => (function() {
						// 	if (notSiteArtistsCache.includesCaseless(artist)) return Promise.resolve(null);
						// 	for (let key in siteArtistsCache) if (key.toLowerCase() == artist.toLowerCase())
						// 		return Promise.resolve(siteArtistsCache[key].id);
						// 	return ajaxGetArtist(artist).then(artist => artist.id, reason => null);
						// })().then(id => id != null ? localXHR('/artist.php?action=edit&artistid=' + id).then(function(document) {
						// 	let aliases = { };
						// 	for (let li of document.body.querySelectorAll('div#content div.box.pad:last-of-type ul li')) {
						// 		let value = { name: li.children[1].textContent.trim() };
						// 		if (li.childElementCount > 2 && li.children[2].tagName == 'SPAN') {
						// 			value.redirect = parseInt(li.children[2].textContent);
						// 			if (!(value.redirect > 0)) {
						// 				console.warn('Invalid redirect id:', li);
						// 				delete value.redirect;
						// 			}
						// 		}
						// 		aliases[parseInt(li.children[0].textContent)] = value;
						// 	}
						// 	for (let id in aliases) if (aliases[id].name.toLowerCase() == artist.toLowerCase())
						// 		return aliases[id].redirect > 0 ? aliases[aliases[id].redirect].name || artist : aliases[id].name;
						// 	return artist;
						// }) : artist))).then(function(artists) {
						// 	if (!artists.equalCaselessTo(mainArtists)) searchLog(artists.sort().join(' & ') + ' - ' + title, true);
						// });
					} else if (isVA || mainArtists.length >= 3) searchTerm = VA + ' - ' + searchTerm;
					searchLog(searchTerm, true);
				}
			}

			function lookupMusicRelations() {
				if (isSelectedCategory('Music')) ajaxGetArtist(artists[0][0]).then(function(artistGroup) {
					// Find existing torrents
					const groupId = parseInt(urlParams.get('groupid'));
					function searchTorrents(matchReleaseType = true, matchYear = matchReleaseType) {
						let torrents = [ ];
						artistGroup.torrentgroup.filter(function(torrentGroup) {
							if (groupId > 0 && torrentGroup.groupId == groupId) return false;
							if (matchReleaseType && releaseType && torrentGroup.releaseType != releaseType
									&& torrentGroup.releaseType < 1000) return false;
							if (matchYear && release.album_year > 0 && torrentGroup.groupYear != release.album_year) return false;
							return titlesMatch(decodeHTML(torrentGroup.groupName), 5, 0.8);
						}).forEach(function(torrentGroup) {
							if ((isUpload || isRequestNew) && !reportedGroups.has(torrentGroup.groupId)) {
								let html = 'release group <a href="' + (isUpload ? '/upload.php?' : '/requests.php?action=new&') +
									'groupid=' + torrentGroup.groupId + '" style="' + hyperlinkStyle + '">' + torrentGroup.groupName + '</a>';
								let info = ' (<span class="release-type">' + stringifyReleaseType(torrentGroup.releaseType) + '</span>)';
								if (releaseType) {
									if (torrentGroup.releaseType != releaseType && torrentGroup.releaseType < 1000)
										html += ' of differrent type' + info;
								} else html += info;
								info = ' (<span class="group-year">' + torrentGroup.groupYear + '</span>)';
								if (release.album_year > 0) {
									if (torrentGroup.groupYear != release.album_year) html += ' with differrent year' + info;
								} else html += info;
								html += ' possibly for this ' + (isUpload ? 'release' : 'request') +
									' already exists (<a href="/torrents.php?id=' + torrentGroup.groupId +
									'" target="_blank" style="' + hyperlinkStyle + '">view group</a>)'
								reportedGroups.set(torrentGroup.groupId, addMessage(new HTML(html), 'notice'));
							}
							Array.prototype.push.apply(torrents, torrentGroup.torrent.filter(function(torrent) {
								if (torrents.some(_torrent => _torrent.id == torrent.id)) return false;
								if (torrent.trumpable) return false; // ?
								if (matchYear && releaseYear > 0 && torrent.remasterYear != releaseYear) return false;
								let defaults = getRequestDefaults('media'), CD100 = true;
								if (!defaults || !defaults.includes('CD')) CD100 = false;
								if (!isRequestNew || !defaults ? media && mediaMapper(torrent.media) != media
										: !defaults.includes(mediaMapper(torrent.media))) return false;
								//if (release.label && torrent.remasterRecordLabel.toLowerCase() != release.label.toLowerCase()) return false;
								//if (editionTitle && torrent.remasterTitle.toLowerCase() != editionTitle.toLowerCase()) return false;
								if (!isRED || release.codec != 'AAC') {
									if (!(defaults = getRequestDefaults('formats')) || !defaults.includes('FLAC')) CD100 = false;
									if (!isRequestNew || !defaults ? release.codec && torrent.format != release.codec
											: !defaults.includes(torrent.format)) return false;
									if (!(defaults = getRequestDefaults('bitrates')) || !defaults.includes('Lossless')) CD100 = false;
									if (!isRequestNew || !defaults ? encoding && torrent.encoding != encoding
											: !defaults.includes(torrent.encoding)) return false;
									if (isRequestNew && CD100 && mediaMapper(torrent.media) == 'CD'
											&& (!torrent.hasLog || torrent.logScore < 100 || !torrent.hasCue)) return false;
								}
								torrent.torrentGroup = torrentGroup;
								return true;
							}));
						});
						return torrents;
					}
					let torrents = searchTorrents(true);
					if (torrents.length > 0) {
						for (let torrent of torrents) if (!reportedDupes.has(torrent.id)) {
							const suffix = getTorrentRef(torrent) + ' ' + getFriendlyTime(torrent.time);
							if (isUpload)
								reportedDupes.set(torrent.id, addMessage(new HTML('possible dupe to release ' + suffix), 'warning'));
							else if (isRequestNew)
								reportedDupes.set(torrent.id, addMessage(new HTML('requested release possibly already on site: ' + suffix), 'notice'));
						}
					} else for (let torrent of (torrents = searchTorrents(false))) if (!reportedDupes.has(torrent.id)) {
						let html = 'existing release ' + getTorrentRef(torrent) + ' ' + getFriendlyTime(torrent.time) +
							' in different category or with different year';
						if (torrent.torrentGroup.releaseType != releaseType && torrent.torrentGroup.releaseType < 1000)
							html += ' (<span class="release-type">' + stringifyReleaseType(torrent.torrentGroup.releaseType) + '</span>)';
						if (torrent.torrentGroup.groupYear != release.album_year)
							html += ' (<span class="group-year">' + torrent.torrentGroup.groupYear + '</span>)';
						reportedDupes.set(torrent.id, addMessage(new HTML(html), 'notice'));
					}
					// Find open requests
					const requestId = parseInt(urlParams.get('requestid'));
					function searchRequests(matchReleaseType = true, matchReleaseYear = true) {
						return Promise.all(artistGroup.requests.filter(function(request) {
							if (requestId > 0 && request.requestId == requestId) return false;
							console.assert(request.categoryId == 1, 'request.categoryId == 1');
							if (request.categoryId != 1) return false;
							if (matchReleaseYear && releaseYear > 0 && request.year != releaseYear) return false;
							return titlesMatch(decodeHTML(request.title), 5, 0.8);
						}).map(request => ajaxGetRequest(request.requestId).then(function(request) {
							if (request.isFilled) return null;
							console.assert(request.categoryName == 'Music', "request.categoryName == 'Music'");
							if (request.categoryName != 'Music') return null;
							if (matchReleaseType && releaseType && request.releaseType != releaseType) return null;
							if (releaseYear > 0 && request.year != releaseYear) return null;
							//if (editionTitle && torrent.remasterTitle.toLowerCase() != editionTitle.toLowerCase()) return false;
							//if (release.label && torrent.remasterRecordLabel.toLowerCase() != release.label.toLowerCase()) return false;

							let defaults = getRequestDefaults('media'), CD100 = true;
							if (!defaults || !defaults.includes('CD')) CD100 = false;
							if (Array.isArray(request.mediaList) && !request.mediaList.includes('Any')
									&& (isRequestNew && defaults ? !defaults.some(media => request.mediaList.map(mediaMapper).includes(media))
										: media && !request.mediaList.map(mediaMapper).includes(media))) return null;
							if (!(defaults = getRequestDefaults('formats')) || !defaults.includes('FLAC')) CD100 = false;
							if (Array.isArray(request.formatList) && !request.formatList.includes('Any')
									&& (isRequestNew && defaults ? !defaults.some(format => request.formatList.includes(format))
										: release.codec && !request.formatList.includes(release.codec))) return null;
							if (!(defaults = getRequestDefaults('bitrates')) || !defaults.includes('Lossless')) CD100 = false;
							if (Array.isArray(request.bitrateList) && !request.bitrateList.includes('Any')
									&& (isRequestNew && defaults ? !defaults.some(encoding => request.bitrateList.includes(encoding))
										: encoding && !request.bitrateList.includes(encoding))) return null;
							//if ((!isRequestNew || !CD100) && media == 'CD'
							//	&& !torrent.mediaList.map(mediaMapper).includes('CD') && (!request.hasLog || request.logScore < 100 || !request.hasCue)) return null;
							return request;
						}))).then(requests => requests.filter(Boolean));
					}
					searchRequests(true).then(function(requests) {
						if (requests.length > 0) requests.forEach(function(request) {
							if (reportedRequests.has(request.requestId)) return;
							if (isUpload) reportedRequests.set(request.requestId, addMessage(new HTML('open request ' +
								getRequestRef(request) + ' ' + getRequestInfo(request) + ' possibly fillable by this upload'), 'info'));
							else if (isRequestNew) reportedRequests.set(request.requestId,
								addMessage(new HTML('release possibly already requested: ' + getRequestRef(request)), 'info'));
						}); else return searchRequests(false, false).then(requests => { requests.forEach(function(request) {
							if (reportedRequests.has(request.requestId)) return;
							if (isUpload) reportedRequests.set(request.requestId,
								addMessage(new HTML('existing request ' + getRequestRef(request) + ' in different category or with different release year'), 'info'));
							else if (isRequestNew) reportedRequests.set(request.requestId,
								addMessage(new HTML('release possibly already requested in different category or with different release year: ' + getRequestRef(request)), 'info'));
						}) });
					}).catch(reason => { console.error('searchRequests:', reason) });
					if (prefs.relations_check_interval > 0 && typeof relationsCheckTimer != 'number')
						relationsCheckTimer = setInterval(lookupMusicRelations, prefs.relations_check_interval * 1000);
				});
			}

			function getHomoIdentifier(id, _tracks = tracks) {
				if (typeof id != 'string') return undefined;
				id = id.toUpperCase();
				return _tracks.every((elem, ndx, arr) => elem.identifiers[id] != undefined
					&& elem.identifiers[id] === arr[0].identifiers[id]) ? _tracks[0].identifiers[id] : undefined;
			}

			function getReleaseTypeFromId(id) {
				let result = 0;
				if (/^(?:Album|LP)$/i.test(id)) result = getReleaseTypeValue('Album');
				if (/^(?:Live(?:\sAlbum))$/i.test(id)) result = getReleaseTypeValue('Live album');
				if (/^(?:(?:Maxi[\-\s]?)?Single|(?:7|10)")$/i.test(id)) result = getReleaseTypeValue('Single');
				if (/^(?:EP|(?:12)")$/i.test(id)) result = getReleaseTypeValue('EP');
				if (/\b(?:Soundtrack)\b/i.test(id)) result = getReleaseTypeValue('Soundtrack');
				if (/^(?:Anthology)$/i.test(id)) result = getReleaseTypeValue('Anthology');
				//if (/^(?:Compilation)$/i.test(id)) result = getReleaseTypeValue('Compilation');
				if (/^(?:Remix)$/i.test(id)) result = getReleaseTypeValue('Remix');
				if (/^(?:Bootleg)$/i.test(id)) result = getReleaseTypeValue('Bootleg');
				if (/^(?:Mixtape)$/i.test(id)) result = getReleaseTypeValue('Mixtape');
				if (/^(?:Demo)$/i.test(id)) result = getReleaseTypeValue('Demo');
				if (/^(?:Concert\sRecording)$/i.test(id)) result = getReleaseTypeValue('Concert Recording');
				if (/^(?:DJ\sMix)$/i.test(id)) result = getReleaseTypeValue('DJ Mix');
				if (/^(?:Interview)$/i.test(id)) result = getReleaseTypeValue('Interview');
				return result;
			}

			function getStoreUrls() {
				const idMapping = {
					ACOUSTICSOUNDS_ID: 'https://store.acousticsounds.com/d/{ID}/',
					ALLMUSIC_ID: 'https://www.allmusic.com/album/release/{ID}',
					AMAZON_ID: 'https://music.amazon.com/albums/{ID}',
					AMID: 'https://www.allmusic.com/album/release/{ID}',
					APPLE_ID: 'https://music.apple.com/album/{ID}',
					ASIN: 'https://www.amazon.com/gp/product/{ID}',
					//BEATPORT_ID: 'https://www.beatport.com/release/2/{ID}',
					//BEATSOURCE_ID: 'https://www.beatsource.com/release/4/{D}',
					BLEEP_ID: 'https://bleep.com/release/{ID}',
					BOOMKAT_ID: 'https://boomkat.com/products/{ID}',
					BUGS_ID: 'https://music.bugs.co.kr/album/{ID}',
					DEEZER_ID: deezerAlbumPrefix + '{ID}',
					DISCOGS_ID: discogsOrigin + '/release/{ID}',
					ECM_ID: 'https://www.ecmrecords.com/catalogue/{ID}',
					FLO_WEB_ID: 'https://www.music-flo.com/detail/album/{ID}',
					EONKYO_ID: 'https://www.e-onkyo.com/music/album/{ID}/',
					EXTREMEMUSIC_ID: 'https://www.extrememusic.com/albums//{ID}',
					GENIE_ID: 'https://www.genie.co.kr/detail/albumInfo?axnm={ID}',
					//GOOGLE_ID: 'https://play.google.com/store/music/album/?id={ID}',
					HDTRACKS_ID: 'https://www.hdtracks.com/#/album/{ID}',
					INDIESSCOPE_ID: 'https://www.indies.eu/alba/{ID}/',
					ITUNES_ID: 'https://music.apple.com/album/{ID}',
					JOOX_ID: 'https://www.joox.com/intl/album/{ID}',
					JOOX_SINGLE_ID: 'https://www.joox.com/intl/single/{ID}',
					JUNODOWNLOAD_ID: 'https://www.junodownload.com/products/{ID}',
					KUGOU_ID: 'https://www.kugou.com/yy/album/single/{ID}.html',
					KUWO_ID: 'https://www.kuwo.cn/album_detail/{ID}',
					MBID: mbrRlsPrefix + '{ID}',
					MELON_ID: 'https://www.melon.com/album/detail.htm?albumId={ID}',
					MUZIEKWEB_ID: 'https://www.muziekweb.nl/en/Link/{ID}/',
					NETEASE_ID: 'https://music.163.com/album?id={ID}',
					PIAS_ID: 'https://store.pias.com/release/{ID}',
					PROSTUDIOMASTERS_ID: 'https://www.prostudiomasters.com/album/page/{ID}',
					QQMUSIC_ID: 'https://y.qq.com/n/ryqq/albumDetail/{ID}',
					RECOCHOKU_ID: 'https://recochoku.jp/album/{ID}/',
					SPOTIFY_ID: 'https://open.spotify.com/album/{ID}',
					TRAXSOURCE_ID: 'https://www.traxsource.com/title/{ID}/',
					VGMDB_ID: 'https://vgmdb.net/album/{ID}',
					TIDAL_ID: 'http://tidal.com/album/{ID}', //'https://listen.tidal.com/album/{ID}',
					OTOTOY_ID: 'https://ototoy.jp/_/default/p/{ID}',
					YANDEX_ID: 'https://music.yandex.ru/album/{ID}',
					YTM_ID: 'https://music.youtube.com/browse/{ID}',
				};
				return Object.keys(idMapping).map(function(identifier) {
					const id = getHomoIdentifier(identifier);
					return id && idMapping[identifier].replace('{ID}', id);
				}).filter(Boolean);
			}

			function lookupWorker(alias, callback) {
				if (!alias || typeof callback != 'function') throw 'lookupWorker: invalid parameter';
				return lookupWorkers[alias] instanceof Promise ? lookupWorkers[alias] : (lookupWorkers[alias] = callback());
			}

			function getCoverOnline() {
				const urls = [sourceUrl].concat(release.urls).map(function(str) { try { return new URL(str) } catch(e) { } })
					.filter(r => r instanceof URL);
				try { var url = new URL(sourceUrl || release.urls[0]) } catch(e) { }
				let apiFirst = Promise.reject('No known API binding');
				if ((i = getHomoIdentifier('APPLE_ID') || getHomoIdentifier('ITUNES_ID'))
						|| amEntityParser.test(url) && (i = parseInt(RegExp.$2)))
					apiFirst = queryItunesAPI('lookup', { id: i })
						.then(lookup => lookup.resultCount > 0 ? setItunesImage(lookup.results[0]) : Promise.reject('no cover'));
				else if (i = getHomoIdentifier('DEEZER_ID') || (i = dzrEntityParser.exec(url)) != null && (i = parseInt(i[2])))
					apiFirst = queryDeezerAPI('album', i)
						.then(result => result.id ? setDeezerImage(result) : Promise.reject('No cover'));
				else if ((i = getHomoIdentifier('DISCOGS_ID')) || dcRlsParser.test(url) && (i = parseInt(RegExp.$1)))
					apiFirst = queryDiscogsAPI('releases/' + i).then(release => (function() {
						if (!release.master_id) return Promise.resolve([]);
						return queryDiscogsAPI('masters/' + release.master_id).then(master => master.images || []);
					})().then(function(masterImages) {
						let result = masterImages.concat(release.images || [])
							.filter(image => httpParser.test(image.resource_url || image.uri) && ['primary', 'front'].includes(image.type));
						result = result.length > 0 && (result[0].resource_url || result[0].uri) || undefined;
						return result ? getDiscogsImageMax(result).then(setCover) : Promise.reject('No cover');
					}));
				else if ((i = getHomoIdentifier('MBID') || mbrRlsParser.test(url) && (i = RegExp.$1)))
					apiFirst = getMusicBrainzCovers(i).then(function(covers) {
						return covers != null ? setCover(covers[1][0]) : Promise.reject('No cover');
					});
				else if (i = getHomoIdentifier('TIDAL_ID') || tidalRlsParser(url))
					apiFirst = tidalAccess.requestAPI('albums/' + RegExp.$1)
						.then(album => 'https://resources.tidal.com/images/' + album.cover.replace(/-/g, '/') + '/1280x1280.jpg');
				else if (url && url.hostname.endsWith('mora.jp'))
					apiFirst = loadMoraMetadata(url).then(function(packageMeta) {
						return setCover(packageMeta.packageUrl + packageMeta.fullsizeimage);
					});
				else if (url && url.hostname.endsWith('hdtracks.com'))
					apiFirst = loadHDtracksMetadata(url).then(album => setCover(album.cover));
				else if ((i = parseInt(getHomoIdentifier('BEATSOURCE_ID'))) || url && url.hostname.endsWith('beatsource.com')
						&& /\/releases?\/(?:.+\/)?(\d+)(?=\/|$)/i.test(url.pathname) && (i = parseInt(RegExp.$1)))
					apiFirst = queryBeatsourceAPI('releases/' + i)
						.then(release => setCover(release.image.uri.replace(/\/image_size\/\d+x\d+\//i, '/')));
				else if ((i = parseInt(getHomoIdentifier('NETEASE_ID'))) || url && url.hostname == 'music.163.com'
						&& /\/(?:album)\b.*\b(?:id)=(\d+)\b/i.test(url.href) && (i = parseInt(RegExp.$1)))
					apiFirst = queryNeteaseAPI('album/' + i).then(result =>
						setCover(result.album.picUrl.replace(/\?.*$/, '').replace(/\b(?:p[123])(?=\.music\.\d+\.net\b)/i, 'p4')));
				return apiFirst.catch(reason => imageUrlResolver(url).then(setCover));
			}

			function searchCoverOnline() {
				function info(service, url, id) {
					addMessage(new HTML('used cover image from ' + service + ' release id ' +
						'<a href="'+ url + '" target="_blank" style="' + hyperlinkStyle + '">' + id + '</a>'), 'info');
				}

				const lookupProviders = {
					'deezer': () => dzLookup(false).then(album => setDeezerImage(album).then(function(imgUrl) {
						info('Deezer', deezerAlbumPrefix + album.id, album.id);
						return imgUrl;
					})),
					'qobuz': () => qbLookup(false).then(function(album) {
						const resMatch = /_\d+(?=\.\w+$)/, imageUrl = album.image ? album.image.large : album.cover;
						return setCover(imageUrl.replace(resMatch, '_org'))
							.catch(reason => setCover(imageUrl.replace(resMatch, '_max')))
							.catch(reason => setCover(imageUrl.replace(resMatch, '_600')))
							.catch(reason => setCover(imageUrl)).then(function(imgUrl) {
								info('Qobuz', album.url, album.id);
								return imgUrl;
							});
					}),
					'itunes': () => itunesLookupByBarcode().then(results => results[0], reason => itunesLookup(false))
							.then(collection => setItunesImage(collection).then(function(imgUrl) {
						info('Apple Music', collection.collectionViewUrl, collection.collectionId);
						return imgUrl;
					})),
					'bandcamp' : () => bcLookup(false).then(album => (httpParser.test(album.imageUrl) ?
							Promise.resolve(album.imageUrl.replace(/_\d+(?=\.\w+$)/, '_0'))
								: imageUrlResolver(album.url)).then(setCover).then(function(imgUrl) {
						info('Bandcamp', album.url, album.id);
						return imgUrl;
					})),
					'tidal': () => tidalLookup(false).then(album => album.cover ?
							setCover('https://resources.tidal.com/images/' + album.cover.replace(/-/g, '/') + '/1280x1280.jpg').then(function(imgUrl) {
						info('Tidal', album.url, album.id);
						return imgUrl;
					}) : Promise.reject('no cover for this album')),
					'flo': () => floLookup(false).then(album => Array.isArray(album.imgList) && album.imgList.length > 0 ?
							setCover(album.imgList.reduce((acc, image) => image.url.replace(/\?.*$/, ''))).then(function(imgUrl) {
						info('FLO', album.url, album.id);
						return imgUrl;
					}) : Promise.reject('No cover')),
					'joox' : () => jxLookup(false).then(album => album.maxCoverUrl ? setCover(album.maxCoverUrl)
							: Promise.reject('JOOX: no cover for matched album')).then(function(imageUrl) {
						info('JOOX', album.url, album.id);
						return imageUrl;
					}),
					'netease': () => neLookup(false).then(function(album) {
						const albumUrl = 'https://music.163.com/album?id=' + album.id;
						return (function() {
							return httpParser.test(album.picUrl) ?
								Promise.resolve(album.picUrl.replace(/\?.*$/, '').replace(/\b(?:p[123])(?=\.music\.\d+\.net\b)/i, 'p4'))
									: imageUrlResolver(albumUrl);
						})().then(setCover).then(function(imageUrl) {
							info('NetEase', albumUrl, album.id);
							return imageUrl;
						});
					}),
					'qqmusic': () => qqLookup(false).then(album => (function() {
						if (!httpParser.test(album.albumPic)) return imageUrlResolver(album.url);
						const rx = /\/(T\d+)?(R\d+x\d+)?(M\w+?)(_\d+)?\.(\w+(?:\.\w+)*)(\?.*)?$/;
						return verifyImageUrl(album.albumPic.replace(rx, '/$1$3.$5'))
							.catch(() => verifyImageUrl(album.albumPic.replace(rx, '/$1$3$4.$5'))).catch(() => album.albumPic);
					})().then(setCover).then(function(imgUrl) {
						info('QQmusic', album.url, album.albumMID);
						return imgUrl;
					})),
					'beatsource': () => bsLookup(false).then(release => setCover(release.image.uri).then(function(imgUrl) {
						info('Beatsource', `https://www.beatsource.com/release/${release.slug}/${release.id}`, release.id);
						return imgUrl;
					})),
					'beatport': () => bpLookup(false).then(release => setCover(release.coverUrl).then(function(coverUrl) {
						info('Beatport', release.url, release.id);
						return coverUrl;
					})),
					'ototoy': () => ottLookup(false).then(album => (httpParser.test(album.jacket) ?
							Promise.resolve(album.jacket.replace(/(?=\.\w+$)/, 'orig')) : imageUrlResolver(album.url)).then(setCover).then(function(imgUrl) {
						info('OTOTOY', album.url, album.id);
						return imgUrl;
					})),
					'allmusic' : () => amLookup(false).then(album => httpParser.test(album.cover) ?
							imageUrlResolver(album.url).then(setCover).then(function(imgUrl) {
						info('AllMusic', album.url, album.id);
						return imgUrl;
					}) : Promise.reject('AllMusic: album found but no cover image')),
					'kkbox' : () => (function() {
						function search(title) {
							let searchTerm = title = '"' + title + '"';
							if (!isVA) searchTerm = '"' + release.artist + '" ' + searchTerm;
							let params = new URLSearchParams({
								word: searchTerm,
								search: 'album',
							});
							return globalXHR('https://www.kkbox.com/tw/tc/search.php??' + params.toString(), { responseType: 'document' })
									.then(({document}) => Array.from(document.body.querySelectorAll('div.search-group > div.row > div > div.album')).map(function(div) {
								const result = {
									artist: div.querySelector('div.playlist-sharer'),
									title: div.querySelector('h3 > a'),
									imageUrl: div.querySelector('a.cover > img'),
								};
								result.artist = result.artist != null ?
									result.artist.title || result.artist.textContent.trim() : undefined;
								if (result.title != null) {
									result.url = 'https://www.kkbox.com' + result.title.pathname;
									if (/\/album\/(\w+)\b/i.test(result.title.pathname)) result.id = RegExp.$1;
								}
								result.title = result.title != null ? result.title.title || result.title.textContent.trim() : undefined;
								result.imgUrl = result.imgUrl != null ? result.imgUrl.src : undefined;
								return result;
							})).then(function(results) {
								if (results.length <= 0) return Promise.reject('KKBOX: no matches');
								if (prefs.diag_mode) console.debug('KKBOX search results:', results);
								const matchers = [album => releasesMatch(album.artist, album.title, i)];
								for (var i = 0; i <= maxFuzzyLevel; ++i) {
									var f = results.filter(matchers[0]);
									for (let ndx = 1; ndx < matchers.length; ++ndx)
										if (f.length > 1 && f.some(matchers[ndx])) f = f.filter(matchers[ndx]);
									if (f.length > 1) return Promise.reject('KKBOX: ambiguity');
									if (f.length == 1) break;
								}
								if (i > maxFuzzyLevel) return Promise.reject('KKBOX: no matches');
								if (i >= 2) console.debug('KKBOX fuzzy match:', release, '≈', f[0]);
								return f[0];
							});
						}

						return search(release.album).catch(function(reason) {
							return !tailingBracketStripper.test(release.album) || !reason.endsWith('no matches') ?
								Promise.reject(reason) : search(release.album.replace(tailingBracketStripper, ''));
						});
					})().then(function(album) {
						if (!httpParser.test(album.imgUrl)) return Promise.reject('KKBOX: matched album has no cover');
						return setCover(album.imageUrl.replace(/\/r\/[a-z]\//i, '/r/'));
					}).then(function(imgUrl) {
						info('KKBOX', album.url, album.id);
						return imgUrl;
					}),
					'bleep': () => blpLookup(false).then(album => (httpParser.test(album.imageUrl) ?
							Promise.resolve(album.imageUrl.replace(/\/r\/[a-z]\//i, '/r/')) : imageUrlResolver(album.url)).then(setCover).then(function(imgUrl) {
						info('Bleep', album.url, album.id);
						return imgUrl;
					})),
					'discogs': () => dcLookup(false).then(release => (function() {
						if (!release.master_id) return Promise.reject('no master');
						return queryDiscogsAPI('masters/' + releaserelease.master_id)
							.then(master => Array.isArray(master.images) && master.images
								.filter(image => ['primary', 'front'].includes(image.type))
								.map(image => image.resource_url || image.uri)
								.filter(RegExp.prototype.test.bind(httpParser))[0] || undefined);
					})().catch(reason => undefined).then(function(imageUrl) {
						imageUrl = imageUrl || release.cover_image;
						if (!imageUrl) return Promise.reject('no cover for this release');
						return getDiscogsImageMax(imageUrl).then(setCover).then(function(imageUrl) {
							info('Discogs', discogsOrigin + release.uri, release.id);
							return imageUrl;
						});
					})),
					'musicbrainz': () => mbLookupByBarcode().catch(mbLookupByASIN)
						.catch(reason => mbLookup(false).then(release => [release])).catch(mbLookupByTOC)
						.then(releases => Promise.all(releases.map(release => getMusicBrainzCovers(release.id))))
						.then(function(releases) {
							let release = releases.find(release => release != null);
							return release != undefined ? setCover(release[1][0]).then(function(imgUrl) {
								if (/\/release\/(\S+)(?=[\/\?\#]|$)/i.test(release[0])) info('Musicbrains', release[0], RegExp.$1);
								return imgUrl;
							}) : Promise.reject('no covers found');
					}),
					'youtube': () => getYTMcfg().then(function(ytcfg) {
						const basePayLoad = getYTMrequestContext(ytcfg);
						function search(title) {
							let searchTerm = title = '"' + title + '"';
							if (!isVA) searchTerm = '"' + release.artist + '" ' + searchTerm;
							let params = new URLSearchParams({
								alt: 'json',
								key: ytcfg.INNERTUBE_API_KEY,
							});
							return globalXHR('https://music.youtube.com/youtubei/v1/search?' + params.toString(), {
								responseType: 'json',
								headers: { Referer: 'https://music.youtube.com/' },
							}, Object.assign({
								query: searchTerm,
								params: encodeURIComponent('EgWKAQIYAWoKEAMQBBAJEAUQCg=='),
							}, basePayLoad)).then(({response}) => response.contents && response.contents.sectionListRenderer ?
									response.contents.sectionListRenderer.contents[0].musicShelfRenderer.contents.map(function(item) {
								let result = {
									id: item.musicResponsiveListItemRenderer.navigationEndpoint.browseEndpoint.browseId,
									artist: item.musicResponsiveListItemRenderer.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[2].text,
									title: item.musicResponsiveListItemRenderer.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
									releaseType: item.musicResponsiveListItemRenderer.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
									year: parseInt(item.musicResponsiveListItemRenderer.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[4].text) || undefined,
									coverUrl: item.musicResponsiveListItemRenderer.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails,
								};
								result.webUrl = result.id ? 'https://music.youtube.com/browse/' + result.id : undefined;
								result.coverUrl = Array.isArray(result.coverUrl) && result.coverUrl.length > 0 ?
									result.coverUrl[0].url.replace(/(?:=[swh]\d+.*)?$/, '=s0') : undefined;
								return result;
							}) : Promise.reject('YouTube Music: no matches')).then(function(results) {
								if (results.length <= 0) return Promise.reject('YouTube Music: no matches');
								if (prefs.diag_mode) console.debug('YouTube Music search results:', results);
								const matchers = [
									album => releasesMatch(album.artist, album.title, i),
								];
								for (var i = 0; i <= maxFuzzyLevel; ++i) {
									var f = results.filter(matchers[0]);
									if (f.length > 1) return Promise.reject('YouTube Music: ambiguity');
									if (f.length == 1) break;
								}
								if (i > maxFuzzyLevel) return Promise.reject('YouTube Music: no matches');
								if (i >= 2) console.debug('YouTube Music fuzzy match:', release, '≈', f[0]);
								return f[0];
							});
						}

						return search(release.album).catch(function(reason) {
							return !tailingBracketStripper.test(release.album) || !reason.endsWith('no matches') ?
								Promise.reject(reason) : search(release.album.replace(tailingBracketStripper, ''));
						});
					}).then(album => setCover(album.coverUrl).then(function(imageUrl) {
						info('YouTube Music', album.webUrl, album.id);
						return imageUrl;
					})),
					'lastfm': () => queryLastFmAPI('album.getinfo', {
						artist: (isVA ? VA : release.artist),
						album: release.album,
					}).then(function(result) {
						if (result.error) return Promise.reject(result.message);
						let image = ['mega', 'extralarge', '', 'large', 'medium', 'small'].reduce(function(acc, size) {
							return acc || result.album.image.find(image => image.size === size && httpParser.test(image['#text']));
						}, undefined);
						if (!image) return Promise.reject('no cover for matched album');
						image = image['#text'];
						return setCover(image.replace(/\/\d+(?:x\d+|s)\//i, '/')).catch(reason => setCover(image)).then(function(imgUrl) {
							info('Last.fm', result.album.url, result.album.id || result.album.mbid || '#N/A');
							return imgUrl;
						});
					}),
				};
				if (typeof prefs.cover_lookup_providers == 'string')
					var lookupChain = prefs.cover_lookup_providers.toLowerCase() == 'all' ? Object.keys(lookupProviders)
						: prefs.cover_lookup_providers.match(/\b(\w+)\b/g).map(s => s.toLowerCase());

				function lookupProvider(index = 0) {
					if (!(index >= 0 && index < lookupChain.length))
						return Promise.reject('Provider index out of bounds (' + index + ')');
					return (lookupChain[index] in lookupProviders ? lookupProviders[lookupChain[index]]() : Promise.reject('unknown provider')).catch(function(reason) {
						if (prefs.diag_mode) console.debug('Cover lookup failed for', lookupChain[index], ':', reason);
						return ++index < lookupChain.length ? lookupProvider(index)
							: Promise.reject('no online resource matched this release');
					});
				}

				if (!Array.isArray(lookupChain) || lookupChain.length <= 0)
					return Promise.reject('No valid cover provider selected');
				if (prefs.diag_mode) console.debug('Starting cover lookup with these providers:', lookupChain.join(', '));
				return lookupProvider().catch(function(reason) {
					addMessage('cover lookup failed (' + reason + ')', 'notice');
					return Promise.reject(reason);
				});
			}

			function setItunesImage(collection) {
				if (!collection || typeof collection != 'object') throw 'parameter is not valid';
				const getFromAPI = () => imageUrlResolver(collection.collectionViewUrl).then(setCover);
				return httpParser.test(collection.artworkUrl100) ? setCover(collection.artworkUrl100.replace(...itunesImageMax))
					.catch(getFromAPI).catch(reason => setCover(collection.artworkUrl100)) : getFromAPI();
			}
			function setDeezerImage(album) {
				if (!album || typeof album != 'object') throw 'parameter is not valid';
				return verifyImageUrl(album.cover).catch(reason => ['xl', 'big', 'medium', 'small']
						.reduce((acc, size) => acc || album['cover_' + size], null) || Promise.reject('no cover'))
					.then(getDeezerImageMax).then(setCover);
			}

			function completeFromOnlineSource(onlineTracks) {
				fillMissingValue(formItem('media'), 'media');
				fillMissingValue(formItem('year'), 'album_year');
				let ref = formItem('remaster_year') || !isUpload && formItem('year');
				if (ref != null && !ref.disabled && (ref.value == '' || !isRED && ref.value == '---')) {
					let value = getHomoValue('release_date');
					if (value != null) ref.value = extractYear(value);
				}
				fillMissingValue(formItem('remaster_record_label')
					|| formItem('record_label') || formItem('recordlabel'), 'label');
				if ((ref = formItem('remaster_catalogue_number') || formItem('catalogue_number')
						|| formItem('cataloguenumber')) != null && !ref.disabled) {
					const normalize = str => str.toUpperCase().replace(/[\s\-]+/g, '');
					for (let catNo of onlineTracks.map(onlineTrack => onlineTrack.catalog).filter(Boolean).distinctValues().reverse())
						if (!normalize(ref.value).includes(normalize(catNo)))
							if (ref.value.length <= 0) ref.value = catNo; else ref.value = catNo + ' / ' + ref.value;
					if (barcode || (barcode = getBarcode(onlineTracks)) && !normalize(ref.value).includes(barcode))
						ref.value = [ref.value, barcode].filter(Boolean).join(' / ');
				}

				function getHomoValue(propName) {
					return onlineTracks[0][propName] && onlineTracks.map(track => track[propName]).homogeneous() ?
						onlineTracks[0][propName] : null;
				}
				function fillMissingValue(node, propName) {
					if (!node || node.disabled || node.value != '' && (isRED || node.value != '---')) return;
					let value = getHomoValue(propName);
					if (value != null) node.value = value;
				}
			}

			function onlineCheck(onlineTracks) {
				if (!Array.isArray(onlineTracks) || onlineTracks.length <= 0) {
					addMessage('online check not performed (empty tracklist)', 'notice');
					return Promise.reject('No tracks');
				}
				if (prefs.diag_mode) console.debug('Checking against online tracks:', onlineTracks);
				let issueCounter = 0, hiresTimes = getHomoIdentifier('DURATION_PRECISION', onlineTracks);
				hiresTimes = hiresTimes ? hiresTimes.toLowerCase() == 'ms' : onlineTracks.some(function(track) {
					let remainder = Math.floor((track.duration - Math.floor(track.duration)) * 1000) / 100;
					return remainder > Math.floor(remainder);
				});
				let devIndex = media == 'Vinyl' ? 2 : hiresTimes ? 1 : 0, albumLengthDivergences, trackLengthDivergences;
				try { albumLengthDivergences = JSON.parse(prefs.album_length_divergences) }
					catch(e) { albumLengthDivergences = [0.75, 0.01, 2.50] }
				try { trackLengthDivergences = JSON.parse(prefs.track_length_divergences) }
					catch(e) { trackLengthDivergences = [2.5, 0.1, 5.0] }
				const arrayCompare = prefs.strict_online_check ? Array.prototype.equalTo : Array.prototype.equalCaselessTo;
				function mismatch(localStr, onlineStr, rx) {
					function normalize(val) {
						if (val == undefined || val == null) return '';
						if (typeof val != 'string') val = val.toString();
						if (rx instanceof RegExp || typeof rx == 'string') val = val.replace(rx, '');
						val = val.replace(/[\(\)\-\s]+/g, '');
						return prefs.strict_online_check ? val : val.toLowerCase();
					}
					return normalize(localStr) != normalize(onlineStr);
				}
				const mainArtistMismatch = () => release.artist != onlineTracks[0].artist
						&& !artistsMatch([artists[0], release.guests], Array.isArray(onlineTracks[0].artists)
							&& onlineTracks[0].artists.length > 0 ? [onlineTracks[0].artists, onlineTracks[0].featured_artists]
								: getArtists(onlineTracks[0].artist));
				const stripFeatArtists = title => title ? featArtistParsers.slice(1)
					.reduce((acc, rx, ndx) => rx.test(acc) ? acc.replace(rx, '') : acc, title) : undefined;
				onlineTracks.forEach(processTrackArtists);
				if (onlineTracks[0].artist && onlineTracks.map(track => track.artist).homogeneous()
						&& (isVA ? !vaParser.test(onlineTracks[0].artist) : mainArtistMismatch())) {
					++issueCounter;
					addMessage(new HTML('online album main artist mismatch ("' +
						safeText(release.artist).bold() + '" ≠ "' + safeText(onlineTracks[0].artist).bold() + '")'), 'warning');
				}
				if (onlineTracks[0].album && onlineTracks.map(track => track.album).homogeneous()
						&& mismatch(release.album, onlineTracks[0].album) && mismatch(album, onlineTracks[0].album)
						&& mismatch(release.album, stripFeatArtists(onlineTracks[0].album))) {
					++issueCounter;
					addMessage(new HTML('online album title mismatch ("' +
						safeText(release.album).bold() + '" ≠ "' + safeText(onlineTracks[0].album).bold() + '")'), 'warning');
				}
				if (onlineTracks[0].label && onlineTracks.map(track => track.label).homogeneous()
						&& mismatch(release.label, onlineTracks[0].label, /-|\s+(?:Records|Recordings)$/ig)) {
					++issueCounter;
					addMessage(new HTML('online album label mismatch ("' +
						safeText(release.label).bold() + '" ≠ "' + safeText(onlineTracks[0].label).bold() + '")'), 'notice');
				}
				if (release.catalogs.length == 1
						&& onlineTracks[0].catalog && onlineTracks.map(track => track.catalog).homogeneous()
						&& mismatch(release.catalogs[0], onlineTracks[0].catalog, /[\s\-]/g)) {
					++issueCounter;
					addMessage(new HTML('online album catalogue# mismatch ("' +
						safeText(release.catalogs[0]).bold() + '" ≠ "' + safeText(onlineTracks[0].catalog).bold() + '")'), 'notice');
				}
				if (onlineTracks[0].album_year && onlineTracks.map(track => track.album_year).homogeneous()
						&& release.album_year != onlineTracks[0].album_year) {
					++issueCounter;
					addMessage(new HTML('online album year mismatch (' +
						(release.album_year || '<unset>').toString().bold() + ' ≠ ' + onlineTracks[0].album_year.toString().bold() + ')'), 'warning');
				}
				if (onlineTracks[0].release_date && !isNaN(releaseDate) && onlineTracks.map(track => track.release_date).homogeneous()
						&& releaseDate.getDateValue() != new Date(onlineTracks[0].release_date.toString()).getDateValue()) {
					++issueCounter;
					addMessage(new HTML('online album release date mismatch (' +
						(release.release_date || '<unset>').toString().bold() + ' ≠ ' + onlineTracks[0].release_date.toString().bold() + ')'), 'notice');
				}
				if (tracks.length != onlineTracks.length) {
					++issueCounter;
					addMessage(new HTML('online album different tracklist length (' + tracks.length.toString().bold() +
						' ≠ ' + onlineTracks.length.toString().bold() + ')'), 'warning');
				}
				if (totalTime > 0) {
					let ttOnline = onlineTracks.reduce((acc, track) => acc + (track.duration || NaN), 0);
					if (ttOnline > 0 && Math.abs(totalTime - ttOnline) * 100 / ttOnline > albumLengthDivergences[devIndex]) {
						++issueCounter;
						addMessage(new HTML('online album duration mismatch (' + makeTimeString(totalTime).bold() +
							' ≠ ' + makeTimeString(ttOnline).bold() + ')'), 'warning');
					}
				}
				if (releaseType > 0) {
					let rt = getHomoIdentifier('RELEASETYPE', onlineTracks) || getHomoIdentifier('RELEASE_TYPE', onlineTracks);
					if (rt && (rt = getReleaseTypeFromId(rt)) > 0 && rt != releaseType)
						addMessage(new HTML('online album release type mismatch (' +
							safeText(stringifyReleaseType(releaseType) || releaseType).bold() + ' ≠ ' +
							safeText(stringifyReleaseType(rt) || rt).bold() + ')'), 'warning');
				}
				if (tracks.some(track => track.identifiers.EXPLICIT > 0))
					if (onlineTracks.some(explicitTrack) && !tracks.some(explicitTrack))
						addMessage('explicitness info mismatches online release (explicit)', 'notice');
					else if (onlineTracks.some(cleanedTrack) && !tracks.some(cleanedTrack))
						addMessage('explicitness info mismatches online release (cleaned)', 'notice');
				for (let ndx = 0; ndx < tracks.length; ++ndx) {
					if (ndx >= onlineTracks.length) {
						addMessage('end of online tracklist reached, tracks from #' + (ndx + 1) + ' to end will not be checked', 'notice');
						break;
					}
					//for (let rx of featArtistParsers.slice(1)) if (rx.test(track.title) track.title = track.title.replace(rx, '');
					if (mismatch(tracks[ndx].title, onlineTracks[ndx].title)
							&& mismatch(tracks[ndx].title, stripFeatArtists(onlineTracks[ndx].title))) {
						++issueCounter;
						addMessage('online track #' + (ndx + 1) + ' title mismatch ("' +
							(tracks[ndx].title || '') + '" ≠ "' + (onlineTracks[ndx].title || '') + '")', 'warning');
					}
					if (onlineTracks[ndx].track_artist && mismatch(tracks[ndx].track_artist, onlineTracks[ndx].track_artist)) {
						let trackArtists = Array.isArray(tracks[ndx].track_artists) && tracks[ndx].track_artists.length > 0 ?
							[tracks[ndx].track_artists, tracks[ndx].track_guests] : getArtists(tracks[ndx].track_artist);
						let onlineSrackArtists = Array.isArray(onlineTracks[ndx].track_artists) && onlineTracks[ndx].track_artists.length > 0 ?
							[onlineTracks[ndx].track_artists, onlineTracks[ndx].track_guests] : getArtists(onlineTracks[ndx].track_artist);
						if (!artistsMatch(trackArtists, onlineSrackArtists)) {
							++issueCounter;
							addMessage('online track #' + (ndx + 1) + ' track artist mismatch ("' +
								(tracks[ndx].track_artist || '') + '" ≠ "' + (onlineTracks[ndx].track_artist || '') + '")', 'notice');
						}
					}
					if (onlineTracks[ndx].track_number && tracks[ndx].track_number != onlineTracks[ndx].track_number) {
						++issueCounter;
						addMessage('online track #' + (ndx + 1) + ' track number mismatch (' +
							(tracks[ndx].track_number || '<unset>') + ' ≠ ' + onlineTracks[ndx].track_number + ')',
							release.totalDiscs > 1 ? 'notice' : 'warning');
					}
					if (onlineTracks[ndx].disc_number && (onlineTracks[ndx].disc_number > 1 || tracks[ndx].disc_number)
							&& tracks[ndx].disc_number != onlineTracks[ndx].disc_number) {
						++issueCounter;
						addMessage('online track #' + (ndx + 1) + ' disc number mismatch (' +
							(tracks[ndx].disc_number || '<unset>') + ' ≠ ' + onlineTracks[ndx].disc_number + ')', 'warning');
					}
					if (onlineTracks[ndx].disc_subtitle && mismatch(tracks[ndx].disc_subtitle, onlineTracks[ndx].disc_subtitle)) {
						++issueCounter;
						addMessage('online track #' + (ndx + 1) + ' disc subtitle mismatch ("' +
							(tracks[ndx].disc_subtitle || '') + '" ≠ "' + onlineTracks[ndx].disc_subtitle + '")', 'notice');
					}
					if (tracks[ndx].duration > 0 && onlineTracks[ndx].duration > 0) {
						let timeDif = Math.abs(tracks[ndx].duration - onlineTracks[ndx].duration);
						if (timeDif > trackLengthDivergences[devIndex]) {
							++issueCounter;
							addMessage('online track #' + (ndx + 1) + ' duration mismatch (' +
								makeTimeString(tracks[ndx].duration) + ' ≠ ' + makeTimeString(onlineTracks[ndx].duration) + ')',
								(timeDif > [5.0, 0.2, 8][devIndex] ? 'warning' : 'notice'));
						}
					}
					if (tracks[ndx].identifiers.MD5 && onlineTracks[ndx].identifiers.MD5
							&& tracks[ndx].identifiers.MD5 != onlineTracks[ndx].identifiers.MD5.toUpperCase())
						addMessage('online track #' + (ndx + 1) + ' MD5 mismatch (' + tracks[ndx].identifiers.MD5 + ' ≠ ' +
							onlineTracks[ndx].identifiers.MD5.toUpperCase() + ')', 'warning');
				}
				if (issueCounter == 0) {
					i = 'online check completed without remarks';
					if (prefs.messages_verbosity >= 1) addMessage(i, 'info'); else {
						// for (let message of document.body.querySelectorAll('table#upload-assistant tr.ua-messages div.ua-message.ua-info'))
						// 	if (message.textContent.startsWith('Info: checking online against ')) return message.append(' (' + i + ')');
						console.debug(i);
					}
				}
			}

			function lookupOnlineSource() {
				function info(service, url, id) {
					if (prefs.check_integrity_online) addMessage(new HTML('checking online against ' + service +
						' release id <a href="' + url + '" target="_blank" style="' + hyperlinkStyle + '">' + id + '</a>'), 'info');
				}
				function mbEpilogue(releases) {
					info('MusicBrainz', mbrRlsPrefix + releases[0].id, releases[0].id);
					return mbrRlsPrefix + releases[0].id;
				}

				const commonMedia = !media || ['CD', 'WEB'].includes(media),
							singleVolume = !release.totalDiscs || release.totalDiscs < 2;
				let lookupProviders = [ ];
				if (commonMedia && barcode) lookupProviders.push([
					querySpotifyAPI('search', { q: 'barcode:' + barcode, type: 'album' })
						.then(result => result.albums.total > 0 ? result.albums.items : Promise.reject('Spotify: no matches')),
					function(albums) {
						if (prefs.diag_mode) console.debug('Spotify lookup by barcode successfull:', barcode, 'matches:', albums);
						info('Spotify', albums[0].external_urls.spotify, albums[0].id);
						return albums[0].href;
					}
				]);
				if (commonMedia) lookupProviders.push([spotifyLookup(false), function(album) {
					info('Spotify', album.external_urls.spotify, album.id);
					return album.href;
				}]);
				if (barcode) lookupProviders.push([mbLookupByBarcode(), mbEpilogue]);
				if (commonMedia && barcode) lookupProviders.push([itunesLookupByBarcode(), function(collections) {
					info('Apple Music', collections[0].collectionViewUrl, collections[0].collectionId);
					return collections[0].collectionViewUrl;
				}]);
				if (getHomoIdentifier('ASIN')) lookupProviders.push([mbLookupByASIN(), mbEpilogue]);
				lookupProviders.push([mbLookup(false), function(release) {
					info('MusicBrainz', mbrRlsPrefix + release.id, release.id);
					return mbrRlsPrefix + release.id;
				}]);
				if (commonMedia && singleVolume) lookupProviders.push([dzLookup(false), function(album) {
					info('Deezer', deezerAlbumPrefix + album.id, album.id);
					return deezerAlbumPrefix + album.id;
				}]);
				if (commonMedia) lookupProviders.push([itunesLookup(false), function(collection) {
					info('Apple Music', collection.collectionViewUrl, collection.collectionId);
					return collection.collectionViewUrl;
				}]);
				if (commonMedia) lookupProviders.push([qbLookup(false), function(album) {
					info('Qobuz', album.url, album.id);
					return album.url;
				}]);
				lookupProviders.push([dcLookup(false), function(release) {
					info('Discogs', discogsOrigin + release.uri, release.id);
					return release.resource_url;
				}]);
				if (commonMedia) lookupProviders.push([tidalLookup(false), function(album) {
					info('Tidal', album.url, album.id);
					return album.url;
				}]);
				lookupProviders.push([suphonLookup(false), function(album) {
					info('Supraphonline', album.url, album.id);
					return album.url;
				}]);
				lookupProviders.push([amLookup(false), album => amLookupRelease(album).then(function(release) {
					info('AllMusic', release.url, release.id);
					return release.url;
				})]);
				if (commonMedia && singleVolume) lookupProviders.push([bsLookup(false), function(release) {
					const url = 'https://www.beatsource.com/release/' + release.slug + '/' + release.id;
					info('Beatsource', url, release.id);
					return url; //release.url // https://api.beatsource.com/v4/catalog/releases/{ID}/
				}]);
				if (commonMedia && singleVolume) lookupProviders.push([bpLookup(false), function(release) {
					//const url = 'https://www.beatport.com/release/' + release.slug + '/' + release.id;
					info('Beatport', release.url, release.id);
					return release.url;
				}]);
				if (commonMedia && singleVolume) lookupProviders.push([tsLookup(false), function(album) {
					info('TraxSource', album.url, album.id);
					return album.url;
				}]);
				if (commonMedia) lookupProviders.push([neLookup(false), function(album) {
					const albumUrl = 'https://music.163.com/album?id=' + album.id;
					info('NetEase', albumUrl, album.id);
					return albumUrl;
				}]);
				if (commonMedia && singleVolume) lookupProviders.push([bcLookup(false), function(album) {
					info('Bandcamp', album.url, album.id);
					return album.url;
				}]);
				if (commonMedia && singleVolume) lookupProviders.push([moraLookup(false), function(album) {
					info('Mora', album.packagePage, album.packageId);
					return album.packagePage;
				}]);
				if (commonMedia && singleVolume) lookupProviders.push([ottLookup(false), function(album) {
					info('OTOTOY', album.url, album.id);
					return album.url;
				}]);
				// if (commonMedia && singleVolume) lookupProviders.push([jxLookup(false), function(album) {
				// 	info('JOOX', album.url, album.id);
				// 	return album.url;
				// }]);
				if (singleVolume) lookupProviders.push([mbLookupByTOC(), mbEpilogue]);
				if (commonMedia && singleVolume) lookupProviders.push([
					queryLastFmAPI('album.getinfo', {
						artist: (isVA ? VA : release.artist),
						album: release.album,
					}).then(result => result.error ? Promise.reject('Last.fm: ' + result.message) : result.album),
					function(album) {
						info('Last.fm', album.url, album.id || album.mbid || '#N/A');
						return album; // return object
					}
				]);

				const workerResult = index => {
					if (lookupProviders[index][0] instanceof Promise) return lookupProviders[index][0];
						else if (typeof lookupProviders[index][0] == 'function') return lookupProviders[index][0]();
							else throw 'invalid search worker type at index ' + index;
				};
				const lookupProvider = (index = 0) => index >= 0 && index < lookupProviders.length ? workerResult(index)
					.then(lookupProviders[index][1]).catch(reason => ++index < lookupProviders.length ? lookupProvider(index)
						: Promise.reject('no online resource matched this release'))
					: Promise.reject('provider index out of range');

				if (prefs.diag_mode) for (let index = 0; index < lookupProviders.length; ++index) {
					workerResult(index).then(result => { console.debug('metaLookupProviders[', index, '] match:', result) },
						reason => { console.debug('metaLookupProviders[', index, '] failed:', reason) });
				}
				return lookupProvider().catch(function(reason) {
					addMessage('online check not performed (' + reason + ')', 'notice');
					return Promise.reject('lookupOnlineSource: ' + reason);
				});
			}

			function spotifyLookup(matchLayout = false) {
				function search(title) {
					let searchTerm = 'album:"' + title + '"';
					//searchTerm = 'artist:"' + (isVA ? VA : release.artist) + '" ' + searchTerm;
					if (!isVA) searchTerm = 'artist:"' + release.artist + '" ' + searchTerm;
					return querySpotifyAPI('search', {
						q: searchTerm,
						type: 'album',
						limit: 50,
					}).then(function(result) {
						if (result.albums.total <= 0) return Promise.reject('Spotify: no matches');
						if (prefs.diag_mode) console.debug('Spotify search results:', result.albums);
						const matchers = [
							item => (item.album_type != 'single' ? releaseType != getReleaseTypeValue('Single')
									: ['Single', 'EP', 'Remix'].map(getReleaseTypeValue).includes(releaseType))
								&& releasesMatch(item.artists.map(artist => artist.name), item.name, i)
								&& (!matchLayout || (!item.total_tracks || item.total_tracks == tracks.length)
									&& (!item.release_date || !releaseYear || extractYear(item.release_date) == releaseYear)),
							//item => item.explicit,
						];
						if (!matchLayout) Array.prototype.push.apply(matchers, [
							item => extractYear(item.release_date) == releaseYear,
							item => item.total_tracks == tracks.length,
						]);
						for (var i = 0; i <= maxFuzzyLevel; ++i) {
							var f = result.albums.items.filter(matchers[0]);
							for (let j = 1; j < matchers.length; ++j)
								if (f.length > 1 && f.some(matchers[j])) f = f.filter(matchers[j]);
							if (f.length > 1) return Promise.reject('Spotify: ambiguity');
							if (f.length == 1) break;
						}
						if (i > maxFuzzyLevel) return Promise.reject('Spotify: no matches');
						if (prefs.diag_mode && i >= 2) console.debug('Spotify fuzzy match:', release, '≈', f[0]);
						return f[0];
					});
				}

				return search(release.album).catch(reason => !tailingBracketStripper.test(release.album)
					|| !reason.endsWith('no matches') ? Promise.reject(reason)
						: search(release.album.replace(tailingBracketStripper, '')));
			}

			function dzLookup(matchLayout = false) {
				function search(title) {
					let query = { album: title }
					//query.artist = isVA ? VA : release.artist;
					if (!isVA) query.artist = release.artist;
					return queryDeezerAPI('search/album', {
						q: Object.keys(query).map(key => key + ':"' + query[key] + '"').join(' '),
						strict: 'on',
						order: 'RANKING',
					}).then(function(result) {
						if (result.total <= 0) return Promise.reject('Deezer: no matches');
						if (prefs.diag_mode) console.debug('Deezer search results:', result.data);
						const isSingle = releaseType == getReleaseTypeValue('Single'), matchers = [
							album => isSingle == (album.record_type == 'single') && releasesMatch(album.artist.name, album.title, i)
								&& (!matchLayout || !album.nb_tracks || album.nb_tracks == tracks.length),
							album => album.explicit_lyrics,
						];
						if (!matchLayout) Array.prototype.push.apply(matchers, [
							album => album.nb_tracks == tracks.length,
						]);
						for (var i = 0; i <= maxFuzzyLevel; ++i) {
							var f = result.data.filter(matchers[0]);
							for (let j = 1; j < matchers.length; ++j)
								if (f.length > 1 && f.some(matchers[j])) f = f.filter(matchers[j]);
							if (f.length > 1) return Promise.reject('Deezer: ambiguity');
							if (f.length == 1) break;
						}
						if (i > maxFuzzyLevel) return Promise.reject('Deezer: no matches');
						if (i >= 2) console.debug('Deezer fuzzy match:', release, '≈', f[0]);
						return f[0];
					});
				}

				return search(release.album).catch(reason => !tailingBracketStripper.test(release.album)
					|| !reason.endsWith('no matches') ? Promise.reject(reason)
						: search(release.album.replace(tailingBracketStripper, '')));
			}

			function itunesLookup(matchLayout = false) {
				function search(title) {
					let searchTerm = '"' + title + '"';
					//searchTerm = '"' + (isVA ? VA : release.artist) + '" ' + searchTerm;
					if (!isVA) searchTerm = '"' + release.artist + '" ' + searchTerm;
					return queryItunesAPI('search', {
						term: searchTerm,
						media: 'music',
						entity: 'album',
						//country: 'US',
					}).then(function(result) {
						if (result.resultCount <= 0) return Promise.reject('Apple Music: no matches');
						if (prefs.diag_mode) console.debug('Apple Music search results:', result.results);
						const matchers = [
							function(collection) {
								if (matchLayout && (collection.trackCount > 0 && collection.trackCount != tracks.length
										|| (collection.releaseDate && releaseYear > 0 && extractYear(collection.releaseDate) != releaseYear)))
									return false;
								let isSingle = collection.collectionName.endsWith(' - Single');
								if (isSingle) collection.collectionName = collection.collectionName.slice(0, -9);
								let isEP = collection.collectionName.endsWith(' - EP');
								if (isEP) collection.collectionName = collection.collectionName.slice(0, -5);
								isSingle = isSingle || collection.collectionType == 'Single';
								isEP = !isSingle && (isEP || collection.collectionType == 'EP');
								return (releaseType == getReleaseTypeValue('Single')) == isSingle
									&& (!isEP || releaseType == getReleaseTypeValue('EP'))
									&& (releasesMatch(collection.artistName, collection.collectionName, i)
									|| collection.collectionCensoredName && releasesMatch(collection.artistName, collection.collectionCensoredName, i));
							},
							collection => collection.collectionExplicitness == 'explicit'/*
								|| collection.collectionExplicitness != 'cleaned'*/,
						];
						if (!matchLayout) Array.prototype.push.apply(matchers, [
							collection => extractYear(collection.releaseDate) == releaseYear,
							collection => collection.trackCount == tracks.length,
						]);
						for (var i = 0; i <= maxFuzzyLevel; ++i) {
							var f = result.results.filter(matchers[0]);
							for (let j = 1; j < matchers.length; ++j)
								if (f.length > 1 && f.some(matchers[j])) f = f.filter(matchers[j]);
							if (f.length > 1) return Promise.reject('Apple Music: ambiguity');
							if (f.length == 1) break;
						}
						if (i > maxFuzzyLevel) return Promise.reject('Apple Music: no matches');
						if (prefs.diag_mode && i >= 2) console.debug('Apple Music fuzzy match:', release, '≈', f[0]);
						return f[0];
					});
				}

				return search(release.album).catch(reason => !tailingBracketStripper.test(release.album)
					|| !reason.endsWith('no matches') ? Promise.reject(reason)
						: search(release.album.replace(tailingBracketStripper, '')));
			}
			function itunesLookupByBarcode() {
				if (!barcode) return Promise.reject('Apple Music: unknown barcode');
				return queryItunesAPI('lookup', {
					upc: barcode,
					media: 'music',
					entity: 'album',
					//country: 'US',
				}).then(function(result) {
					if (result.resultCount <= 0) return Promise.reject('Apple Music: no matches');
					if (prefs.diag_mode) console.debug('Apple Music search by UPC results:', result.results);
					const matchers = [
						collection => collection.collectionExplicitness == 'explicit'/*
							|| collection.collectionExplicitness != 'cleaned'*/,
						collection => extractYear(collection.releaseDate) == releaseYear,
						collection => collection.trackCount == tracks.length,
					];
					if (result.results.length > 1 && result.results.some(matchers[0]))
						result.results = result.results.filter(matchers[0]);
					if (result.results.length <= 0) return Promise.reject('Apple Music: no matches');
					return result.results;
				});
			}

			function mbLookup(matchLayout = false) {
				function search(title) {
					let query = {
						//'artist': isVA ? VA : release.artist,
						'release': title,
					};
					if (!isVA) query.artist = release.artist;
					return queryMusicBrainzAPI('release', {
						query: Object.keys(query).map(key => key + ':"' + query[key] + '"').join(' AND '),
					}).then(function(result) {
						if (result.count <= 0) return Promise.reject('MusicBrainz: no matches');
						if (prefs.diag_mode) console.debug('MusicBrainz search results:', result.releases);
						const matchers = [
							release => release.quality != 'low'
								&& (media ? [media] : tracks.some(notRedBook) ? ['WEB'] : ['CD', 'WEB'])
									.some(_media => release.media.map(media => estimateMedia(media.format) || media.format).includes(_media))
								&& releasesMatch(release['artist-credit'].map(artist => artist.name), release.title, i)
								&& (!matchLayout || (!release['track-count'] || release['track-count'] == tracks.length)
									&& (!releaseYear || !release.date || extractYear(release.date) == releaseYear))
								&& (!releaseType || !release['release-group'] || (function(releaseGroup) {
									const isPrimaryType = primaryType => releaseGroup['primary-type'] == primaryType;
									const hasSecondaryType = secondaryType => 'secondary-types' in releaseGroup
										&& releaseGroup['secondary-types'].includes(secondaryType);
									switch (releaseType) {
								case 'Single': return ['Single', 'EP'].some(isPrimaryType);
								case 'EP': return ['EP', 'Single'].some(isPrimaryType);
								case 'Live album': case 'Concert Recording': return !isPrimaryType('Single') && hasSecondaryType('Live');
								case 'Soundtrack': return /*!isPrimaryType('Single') && */hasSecondaryType('Soundtrack');
								case 'Anthology': case 'Compilation': return !isPrimaryType('Single') && hasSecondaryType('Compilation');
								case 'Remix': return /*!isPrimaryType('Single') && */hasSecondaryType('Remix');
								case 'DJ Mix': return /*!isPrimaryType('Single') && */hasSecondaryType('DJ-mix');
								case 'Demo': return /*!isPrimaryType('Single') && */hasSecondaryType('Demo');
								case 'Mixtape': return /*!isPrimaryType('Single') && */hasSecondaryType('Mixtape/Street');
								case 'Interview': return /*!isPrimaryType('Single') && */hasSecondaryType('Interview');
								case 'Bootleg': //return !isPrimaryType('Single')/* && hasSecondaryType('Bootleg')*/;
									}
									return true;
								})(release['release-group'])),
						];
						if (!matchLayout) Array.prototype.push.apply(matchers, [
							release => release['track-count'] == tracks.length,
						]);
						for (var i = 0; i <= maxFuzzyLevel; ++i) {
							var f = result.releases.filter(matchers[0]);
							for (let j = 1; j < matchers.length; ++j)
								if (f.length > 1 && f.some(matchers[j])) f = f.filter(matchers[j]);
							if (f.length > 1) return Promise.reject('MusicBrainz: ambiguity');
							if (f.length == 1) break;
						}
						if (i > maxFuzzyLevel) return Promise.reject('MusicBrainz: no matches');
						if (prefs.diag_mode && i >= 2) console.debug('MusicBrainz fuzzy match:', release, '≈', f[0]);
						return f[0];
					});
				}

				return search(release.album).catch(reason => !tailingBracketStripper.test(release.album)
					|| !reason.endsWith('no matches') ? Promise.reject(reason)
						: search(release.album.replace(tailingBracketStripper, '')));
			}
			function mbLookupByBarcode() {
				if (!barcode) return Promise.reject('MusicBrainz: unknown barcode');
				return queryMusicBrainzAPI('release', { query: 'barcode:' + barcode }).then(function(result) {
					if (result.count <= 0) return Promise.reject('MusicBrainz: no matches');
					if (prefs.diag_mode) console.debug('MusicBrainz lookup by barcode successfull: ' + barcode + '; matches: ' + result.count);
					return result.releases;
				});
			}
			function mbLookupByASIN() {
				let asin = getHomoIdentifier('ASIN');
				if (!asin) return Promise.reject('MusicBrainz: unknown ASIN');
				asin = asin.replace(/\s+/g, '');
				return queryMusicBrainzAPI('release', { query: 'asin:' + asin }).then(function(result) {
					if (result.count <= 0) return Promise.reject('MusicBrainz: no matches');
					if (prefs.diag_mode) console.debug('MusicBrainz lookup by ASIN successfull: ' + asin + '; matches: ' + result.count);
					return result.releases;
				});
			}
			function mbComputeDiscID(mbTOC) {
				if (!Array.isArray(mbTOC) || mbTOC.length != mbTOC[1] - mbTOC[0] + 4 || mbTOC[1] - mbTOC[0] > 98)
					throw 'Invalid or too long MB TOC';
				const stringifyArray = (arr, width = 8) =>
					arr.map(n => n.toString(16).toUpperCase().padStart(width, '0')).join('');
				return CryptoJS.SHA1(stringifyArray(mbTOC.slice(0, 2), 2) + stringifyArray(mbTOC.slice(2), 8).padEnd(800, '0'))
					.toString(CryptoJS.enc.Base64).replace(/\=/g, '-').replace(/\+/g, '.').replace(/\//g, '_');
			}
			function mbLookupByDiscID(mbTOC, allowFuzzy = true) {
				if (!Array.isArray(mbTOC) || mbTOC.length != mbTOC[1] - mbTOC[0] + 4)
					return Promise.reject('mbLookupByDiscID(…): missing or invalid TOC');
				let mbDiscId = mbComputeDiscID(mbTOC);
				if (!mbDiscId) return Promise.reject('MusicBrainz: no matches');
				const params = { toc: mbTOC.join('+'), inc: ['artists'].join('+') };
				if (media != 'CD') params['media-format'] = 'all';
				const getReleases = (offset = 0) => queryMusicBrainzAPI('discid/' + (mbDiscId || '-'), Object.assign({
					offset: offset,
					limit: 100,
				}, params)).then(function(result) {
					if (!allowFuzzy && !result.id || !Array.isArray(result.releases) || result.releases.length <= 0)
						return Promise.reject('MusicBrainz: no matches');
					if (prefs.diag_mode) console.debug('MusicBrainz lookup by discId/TOC successfull:',
						mbDiscId, '/', params, 'releases:', result.releases, result.id);
					return result['release-count'] > result['release-offset'] + result.releases.length ?
						getReleases(result['release-offset'] + result.releases.length)
							.then(Array.prototype.concat.bind(result.releases)) : result.releases;
				});
				return getReleases().then(function(releases) {
					const minSimilarity = 0.90 - Math.min(tracks.length, 30) / 100;
					const optedOut = releases.filter(match => titlesMatch(match.title, 3, minSimilarity));
					return optedOut.length > 0 ? optedOut : releases;
				});
			}
			function mbLookupByMetaTOC() {
				if (release.totalDiscs > 1) return Promise.reject('TOC lookup not possible for multidisc release');
				if (tracks.length < 3) return Promise.reject('TOC lookup given up for insufficient tracklist length');
				let TOC;
				if (TOC = getHomoIdentifier('ITUNES_TOC')) { // iTunes scheme
					TOC = TOC.split('+').map(index => parseInt(index));
					TOC = [1, TOC[2], TOC[1]].concat(TOC.slice(3));
				} else if (TOC = getHomoIdentifier('CT_TOC')) { // CUETools scheme
					TOC = TOC.split('+').map(index => parseInt(index, 16));
					TOC = [1, TOC.shift(), TOC.pop()].concat(TOC);
				}
				return mbLookupByDiscID(TOC);
			}
			function mbLookupByAutoTOC() {
				if (release.totalDiscs > 1) return Promise.reject('AutoTOC lookup not possible for multidisc release');
				if (tracks.length < 3) return Promise.reject('AutoTOC lookup given up for insufficient tracklist length');
				if (!tracks.every(track => track.samplerate > 0 && track.samples > 0))
					return Promise.reject('MusicBrainz: insufficient information for TOC calculation');
				let lastFrame = 0;
				const TOC = [0].concat(tracks.map(track => (lastFrame += Math.round(track.samples * 75 / track.samplerate))))
					.map(offset => 150 + offset);
				TOC.unshift(TOC.pop());
				return mbLookupByDiscID([1, tracks.length].concat(TOC), true);
			}
			function mbLookupByTOC() {
				return mbLookupByMetaTOC().catch(reason => typeof reason == 'string' && !reason.includes('no matches') ?
					mbLookupByAutoTOC() : Promise.reject(reason));
			}

			function dcLookup(matchLayout = false) {
				const search = query => queryDiscogsAPI('database/search', query).then(function(result) {
					if (result.results.length <= 0) return Promise.reject('Discogs: no matches');
					if (prefs.diag_mode) console.debug('Discogs search results:', result.results);
					const matchers = [ ];
					return (function getMatches(fuzzyLevel = 0) {
						return fuzzyLevel >= 0 && fuzzyLevel <= maxFuzzyLevel ? Promise.all(result.results.map(function(result) {
							if (media ? Array.isArray(result.format)
									&& !result.format.some(format => estimateMedia(format) == media)
										: !result.format.some(format => ['CD', 'WEB'].includes(estimateMedia(format))))
								return Promise.reject('Media mismatch');
							if (!['barcode', 'catno'].some(param => query[param])) {
								if (/^(.+?)\s+\(\d+\)\s+-\s+(.+)$/.test(result.title) || /^(.+?)\s+-\s+(.+)$/.test(result.title)) {
									if (!releasesMatch(RegExp.$1, RegExp.$2, fuzzyLevel)) return Promise.reject('Artist - Title mismatch');
								} else {
									console.warn('Failed to parse Discogs title:', album.title);
									var titleFail = true;
								}
							}
							if (matchLayout && releaseYear > 0 && result.year && extractYear(result.year) != releaseYear)
								return Promise.reject('Release year mismatch');
							return matchLayout || titleFail ? queryDiscogsAPI('releases/' + result.id).then(function(release) {
								if (titleFail && !releasesMatch(release.artists.map(artist => artist.name), release.title, fuzzyLevel))
									return Promise.reject('Artist - Title mismatch');
								if (matchLayout && release.tracklist.length != tracks.length) return Promise.reject('Tracklist mismatch');
								return result;
							}) : Promise.resolve(result);
						}).map(result => result.catch(reason => null))).then(matches => matches.filter(Boolean)).then(function(matches) {
							for (let j = 0; j < matchers.length; ++j)
								if (matches.length > 1 && matches.some(matchers[j])) matches = matches.filter(matchers[j]);
							if (matches.length > 1) return Promise.reject('Discogs: ambiguity');
							if (matches.length <= 0) return getMatches(fuzzyLevel + 1);
							matches[0].url = getItemUrl(matches[0]);
							if (prefs.diag_mode && fuzzyLevel >= 2) console.debug('Discogs fuzzy match:', release, '≈', matches[0]);
							return matches[0];
						}) : Promise.reject('Discogs: no matches');
					})();
				});

				return (barcode ? search({
					barcode: barcode,
					type: 'release',
					sort: 'score,desc',
					strict: true,
				}) : Promise.reject('no matches')).catch(function(reason) {
					if (!reason.endsWith('no matches')) return Promise.reject(reason);
					return release.catalogs.length > 0 ? search({
						label: release.label && (isVA || !release.label.includes(release.artist))
							&& !selfReleaseParsers.some(rx => rx.test(release.label)) ? release.label.replace(/\s+.*$/, '') : '',
						catno: release.catalogs[0], //release.catalogs.join('; ')
						type: 'release',
						sort: 'score,desc',
					}) : Promise.reject('no matches');
				}).catch(function(reason) {
					const query = {
						release_title: release.album,
						type: 'release',
						sort: 'score,desc',
						strict: false,
					};
					if (!isVA) query.artist = release.artist; //query.artist = '"' + (isVA ? VA : release.artist) + '"';
					return search(query).catch(function(reason) {
						if (!query.release_title || !tailingBracketStripper.test(release.album) || !reason.endsWith('no matches'))
							return Promise.reject(reason);
						query.release_title = release.album.replace(tailingBracketStripper, '');
						return search(query);
					});
				});
			}

			function qbLookup(matchLayout = false) {
				function searchMarket(title, market) {
					if (!title) return Promise.reject('The parameter is not valid (searchMarket)');
					let searchTerm = '"' + title + '"';
					if (!isVA) searchTerm = '"' + release.artist + '" ' + searchTerm; //if (isVA) searchTerm = '"' + VA + '" ' + searchTerm;
					return queryQobuzAPI('catalog/search', Object.assign({ query: searchTerm + ' #ByReleaseName' }, market ? {
						store: market,
						zone: market.replace(/-.*$/, ''),
					} : null)).then(function({albums}) {
						if (albums.total <= 0) return Promise.reject('Qobuz: no matches');
						if (prefs.diag_mode) console.debug('Qobuz search results (API):', market, albums);
						const matchers = [
							item => item.parental_warning,
						];
						if (!matchLayout) Array.prototype.push.apply(matchers, [
							item => extractYear(item.release_date_download) == releaseYear,
							item => item.tracks_count == tracks.length,
						]);
						for (var i = 0; i <= maxFuzzyLevel; ++i) {
							var f = albums.items.filter(item => (function() {
								if (isVA) return vaParser.test(item.artist.name);
								let remoteArtist = item.artist.name.toLowerCase();
								if (remoteArtist == release.artist.toLowerCase()
										|| i >= 1 && remoteArtist.toASCII() == release.artist.toLowerCase().toASCII()
										|| i >= 2 && jaroWrinkerSimilarity(remoteArtist, release.artist.toLowerCase()) >= 0.95) return true;
								return artists[0].some(function(localArtist) {
									localArtist = localArtist.toLowerCase();
									return remoteArtist == localArtist || i >= 1 && remoteArtist.toASCII() == localArtist.toASCII()
										|| i >= 2 && jaroWrinkerSimilarity(remoteArtist, localArtist) >= 0.95;
								});
							})() && titlesMatch(item.title.replace(/\s+\(Explicit\)$/i, ''), i, 0.9)
								&& (!matchLayout || (!item.tracks_count || item.tracks_count == tracks.length)
									 && (!item.release_date_download || !releaseYear || extractYear(item.release_date_download) == releaseYear)));
							for (let j = 0; j < matchers.length; ++j)
								if (f.length > 1 && f.some(matchers[j])) f = f.filter(matchers[j]);
							if (f.length > 1) return Promise.reject('Qobuz: ambiguity');
							if (f.length == 1) break;
						}
						if (i > maxFuzzyLevel) return Promise.reject('Qobuz: no matches');
						if (prefs.diag_mode && i >= 2) console.debug('Qobuz fuzzy match:', release, '≈', f[0]);
						return f[0];
					}).catch(function(reason) {
						if (reason.endsWith('ambiguity')) return Promise.reject(reason);
						searchTerm = title;
						if (!isVA) searchTerm = release.artist + ' ' + searchTerm; //if (isVA) searchTerm = VA + ' ' + searchTerm;
						const reqUrl = new URL('https://www.qobuz.com/search');
						if (market) reqUrl.pathname = market + reqUrl.pathname;
						reqUrl.search = new URLSearchParams({
							q: searchTerm,
							//s: 'rdc', // descending sort by release date
							i: 'boutique',
						});
						return globalXHR(reqUrl).then(function({document}) {
							let results = [ ];
							document.body.querySelectorAll('div.search-results > div.product').forEach(function(div) {
								let result = {
									artist: div.querySelector('div.artist-name > a'),
									title: div.querySelector('div.album-title > a'),
									cover: div.querySelector('div.album-cover > a > img'),
									genre: div.querySelector('span.category'),
									label: div.querySelector('span.brand'),
								};
								if (result.artist == null || result.title == null) return;
								result.id = result.title.pathname.replace(/^.*\//, '');
								result.url = 'https://www.qobuz.com' + result.title.pathname;
								result.artist = result.artist.textContent.trim();
								result.title = result.title.textContent.trim();
								result.cover = result.cover && (result.cover.dataset.src || result.cover.src);
								result.genre = qbGenreToEnglish(result.genre.textContent.trim());
								result.label = result.label && result.label.textContent.trim();
								if (result.id && result.artist && result.title
										&& !results.some(album => album.id == result.id)) results.push(result);
							});
							if (results.length <= 0) return Promise.reject('Qobuz: no matches');
							if (prefs.diag_mode) console.debug('Qobuz search results (web):', market, results);
							const matchers = [
								result => result.title.endsWith(' (Explicit)'),
							];
							return (function getMatches(fuzzyLevel = 0) {
								return fuzzyLevel >= 0 && fuzzyLevel <= maxFuzzyLevel ? Promise.all(results.map(function(result) {
									if (!(function() {
										if (isVA) return vaParser.test(result.artist);
										let remoteArtist = result.artist.toLowerCase();
										if (remoteArtist == release.artist.toLowerCase()
												|| fuzzyLevel >= 1 && remoteArtist.toASCII() == release.artist.toLowerCase().toASCII()
												|| fuzzyLevel >= 2 && jaroWrinkerSimilarity(remoteArtist, release.artist.toLowerCase()) >= 0.95) return true;
										return artists[0].some(function(localArtist) {
											localArtist = localArtist.toLowerCase();
											return remoteArtist == localArtist || fuzzyLevel >= 1 && remoteArtist.toASCII() == localArtist.toASCII()
												|| fuzzyLevel >= 2 && jaroWrinkerSimilarity(remoteArtist, localArtist) >= 0.95;
										});
									})() || !titlesMatch(result.title.replace(/\s+\(Explicit\)$/i, ''), fuzzyLevel, 0.9))
										return Promise.reject('Artist - Title mismatch');
									return matchLayout ? queryQobuzAPI('album/get', { album_id: result.id }).then(function(response) {
										if (response.tracks_count > 0 && response.tracks_count != tracks.length)
											return Promise.reject('Tracklist mismatch');
										if (releaseYear > 0 && extractYear(response.release_date_download) != releaseYear)
											return Promise.reject('Release year mismatch');
										return result;
									}, reason => fetchOnline_Music(result.url, true).then(function(onlineTracks) {
										if (onlineTracks.length != tracks.length) return Promise.reject('Tracklist mismatch');
										if (releaseYear > 0 && onlineTracks[0].release_date && extractYear(onlineTracks[0].release_date) != releaseYear)
											return Promise.reject('Release year mismatch');
										return result;
									})) : Promise.resolve(result);
								}).map(result => result.catch(reason => null))).then(matches => matches.filter(Boolean)).then(function(matches) {
									for (let j = 0; j < matchers.length; ++j)
										if (matches.length > 1 && matches.some(matchers[j])) matches = matches.filter(matchers[j]);
									if (matches.length > 1) return Promise.reject('Qobuz: ambiguity');
									if (matches.length <= 0) return getMatches(fuzzyLevel + 1);
									if (prefs.diag_mode && fuzzyLevel >= 2) console.debug('Qobuz fuzzy match:', release, '≈', matches[0]);
									return matches[0];
								}) : Promise.reject('Qobuz: no matches');
							})();
						});
					});
				}

				const marketChain = [
					'gb-en', 'fr-fr', 'us-en', 'de-de', 'es-es', 'it-it', 'au-en',
					//'nl-nl', 'ch-fr', 'at-de', 'be-fr', 'lu-fr', 'ie-en', 'dk-en', 'fi-en', 'se-en', 'no-en', 'nz-en',
				];
				function searchMarkets(title/*, marketIndex = 0*/) {
					if (!Array.isArray(marketChain) || marketChain.length <= 0/*
						 || !(marketIndex >= 0 && marketIndex < marketChain.length)*/) return searchMarket(title);
					// return searchMarket(title, marketChain[marketIndex])
					// 	.catch(reason => reason.endsWith('no matches') && ++marketIndex < marketChain.length ?
					// 		searchMarkets(title, marketIndex) : Promise.reject(reason));
					let searchWorkers = marketChain.map(market => searchMarket(title, market));
					const _searchMarket = (marketIndex = 0) => searchWorkers[marketIndex]
						.catch(reason => reason.endsWith('no matches') && ++marketIndex < searchWorkers.length ?
							_searchMarket(marketIndex) : Promise.reject(reason));
					return _searchMarket();
				}

				return searchMarkets(release.album).catch(reason => !reason.endsWith('no matches')
					|| !tailingBracketStripper.test(release.album) ? Promise.reject(reason)
						: searchMarkets(release.album.replace(tailingBracketStripper, '')));
			}

			function tidalLookup(matchLayout = false) {
				function search(title) {
					let searchTerm = '"' + title + '"';
					//searchTerm = '"' + (isVA ? VA : release.artist) + '" ' + searchTerm;
					if (!isVA) searchTerm = '"' + release.artist + '" ' + searchTerm;
					return tracks.length > 1 ? tidalAccess.requestAPI('search/albums', { query: searchTerm, limit: 25 }).then(function(result) {
						if (result.totalNumberOfItems <= 0) return Promise.reject('Tidal: no matches');
						if (prefs.diag_mode) console.debug('Tidal search results:', result.items);
						const matchers = [
							item => releasesMatch(item.artists.filter(artist => artist.type == 'MAIN').map(artist => artist.name), item.title, i)
								&& (matchLayout || (!item.numberOfTracks || item.numberOfTracks == tracks.length)
									&& (!releaseYear || !item.releaseDate || extractYear(item.releaseDate) == releaseYear)),
							item => item.explicit,
						];
						if (matchLayout) Array.prototype.push.apply(matchers, [
							item => extractYear(item.releaseDate) == releaseYear,
							item => item.numberOfTracks == tracks.length,
						]);
						for (var i = 0; i <= maxFuzzyLevel; ++i) {
							var f = result.items.filter(matchers[0]);
							for (let j = 1; j < matchers.length; ++j)
								if (f.length > 1 && f.some(matchers[j])) f = f.filter(matchers[j]);
							if (f.length > 1) return Promise.reject('Tidal: ambiguity');
							if (f.length == 1) break;
						}
						if (i > maxFuzzyLevel) return Promise.reject('Tidal: no matches');
						if (prefs.diag_mode && i >= 2) console.debug('Tidal fuzzy match:', release, '≈', f[0]);
						return f[0];
					}) : tidalAccess.requestAPI('search/tracks', { query: searchTerm, limit: 25 }).then(function(result) {
						if (result.totalNumberOfItems <= 0) return Promise.reject('Tidal: no matches');
						if (prefs.diag_mode) console.debug('Tidal search results:', result.items);
						const matchers = [
							item => item.explicit,
						];
						for (var i = 0; i <= maxFuzzyLevel; ++i) {
							var f = [ ];
							result.items.forEach(function(item) {
								if (!releasesMatch(item.artists.filter(artist => artist.type == 'MAIN').map(artist => artist.name),
									item.album.title, i) || f.findIndex(album => album.id == item.album.id) >= 0) return;
								item.album.explicit = item.explicit;
								item.album.url = 'https://tidal.com/album/' + item.album.id;
								f.push(item.album);
							});
							if (f.length > 1 && f.some(matchers[0])) f = f.filter(matchers[0]);
							if (f.length > 1) return Promise.reject('Tidal: ambiguity');
							if (f.length == 1) break;
						}
						if (i > maxFuzzyLevel) return Promise.reject('Tidal: no matches');
						if (prefs.diag_mode && i >= 2) console.debug('Tidal fuzzy match:', release, '≈', f[0]);
						return f[0];
					});
				}

				return search(release.album).catch(reason => !tailingBracketStripper.test(release.album)
					|| !reason.endsWith('no matches') ? Promise.reject(reason)
						: search(release.album.replace(tailingBracketStripper, '')));
			}

			function tsLookup(matchLayout = false) {
				function search(searchTerm) {
					let query = new URLSearchParams({ term: '"' + searchTerm + '"' });
					return globalXHR('https://www.traxsource.com/search/titles?' + query).then(function({document}) {
						let results = Array.from(document.body.querySelectorAll('div.release-grid div.grid-page > div.grid-item')).map(function(div) {
							let result = { id: parseInt(div.dataset.tid) }, elem = div.querySelector('div.ellip');
							if (elem != null) result.artist = elem.childNodes[2].textContent.trim();
							if ((elem = div.querySelector('div.ellip a.com-title')) != null) {
								result.album = elem.textContent.trim();
								result.url = 'https://www.traxsource.com' + elem.pathname;
							}
							if ((elem = div.querySelector('div.ellip a.com-label')) != null)
								result.label = elem.textContent.trim();
							if ((elem = div.querySelector('div.grid-image img')) != null)
								result.cover = elem.src.replace(/\/scripts\/.+\/\d+x\d+\//i, '/files/images/');
							return result;
						});
						if (results.length <= 0) return Promise.reject('TraxSource: no matches');
						if (prefs.diag_mode) console.debug('TraxSource search results:', results);
						const matchers = [ ];
						return (function getMatches(fuzzyLevel = 0) {
							return fuzzyLevel >= 0 && fuzzyLevel <= maxFuzzyLevel ? Promise.all(results.map(function(result) {
								if (!releasesMatch(result.artist, result.album, fuzzyLevel))
									return Promise.reject('Artist - Title mismatch');
								return matchLayout ? fetchOnline_Music(result.url, true).then(function(onlineTracks) {
									if (onlineTracks.length != tracks.length) return Promise.reject('Tracklist mismatch');
									if (releaseYear > 0 && onlineTracks[0].release_date && extractYear(onlineTracks[0].release_date) != releaseYear)
										return Promise.reject('Release year mismatch');
									return result;
								}) : Promise.resolve(result);
							}).map(result => result.catch(reason => null))).then(matches => matches.filter(Boolean)).then(function(matches) {
								for (let j = 0; j < matchers.length; ++j)
									if (matches.length > 1 && matches.some(matchers[j])) matches = matches.filter(matchers[j]);
								if (matches.length > 1) return Promise.reject('TraxSource: ambiguity');
								if (matches.length <= 0) return getMatches(fuzzyLevel + 1);
								if (prefs.diag_mode && fuzzyLevel >= 2) console.debug('TraxSource fuzzy match:', release, '≈', matches[0]);
								return matches[0];
							}) : Promise.reject('TraxSource: no matches');
						})();
					});
				}

				return search(release.album).catch(reason => tailingBracketStripper.test(release.album)
					&& reason.endsWith('no matches') ? search(release.album.replace(tailingBracketStripper, ''))
						: Promise.reject(reason));
			}

			function suphonLookup() {
				function search(title) {
					let searchTerm = '"' + title + '"';
					//searchTerm = '"' + (isVA ? VA : release.artist) + '" ' + searchTerm;
					if (!isVA) searchTerm = '"' + release.artist + '" ' + searchTerm;
					return globalXHR('https://www.supraphonline.cz/vyhledavani?q=' + encodeURIComponent(searchTerm)).then(function({document}) {
						var results = Array.from(document.body.querySelectorAll('div.albumlist > ul > li')).map(function(div) {
							let result = { }, elem = div.querySelector('div.title a');
							if (elem != null) {
								if (/\/album\/(\d+)\b/i.test(elem.pathname)) result.id = parseInt(RegExp.$1);
								result.album = elem.title || elem.textContent.trim();
								result.url = 'https://www.supraphonline.cz' + elem.pathname;
							}
							if ((elem = div.querySelector('div.subtitle')) != null)
								result.artist = elem.title || elem.textContent.trim();
							if ((elem = div.querySelector('span.image img')) != null) result.cover = elem.src;
							return result;
						});
						if (results.length <= 0) return Promise.reject('Supraphonline: no matches');
						if (prefs.diag_mode) console.debug('Supraphonline search results:', results);
						for (var i = 0; i <= maxFuzzyLevel; ++i) {
							var f = results.filter(result => releasesMatch(result.artist, result.album, i));
							if (f.length > 1) return Promise.reject('Supraphonline: ambiguity');
							if (f.length == 1) break;
						}
						if (i > maxFuzzyLevel) return Promise.reject('Supraphonline: no matches');
						if (prefs.diag_mode && i >= 2) console.debug('Supraphonline fuzzy match:', release, '≈', f[0]);
						return f[0];
					});
				}

				return search(release.album).catch(reason => !tailingBracketStripper.test(release.album)
					|| !reason.endsWith('no matches') ? Promise.reject(reason)
						: search(release.album.replace(tailingBracketStripper, '')));
			}

			function bsLookup_backend(apiFunc, providerName, matchLayout = false) {
				function search(title) {
					let searchTerm = '"' + title + '"';
					//searchTerm = '"' + (isVA ? VA : release.artist) + '" ' + searchTerm;
					if (!isVA) searchTerm = '"' + release.artist + '" ' + searchTerm;
					return apiFunc('search', {
						'q': searchTerm,
						'type': 'releases',
						'per_page': 30,
						//'order_by': '-release_date',
					}).then(function({releases}) {
						if (!Array.isArray(releases) || releases.length <= 0) return Promise.reject(providerName + ': no matches');
						if (prefs.diag_mode) console.debug(providerName + ' search results:', releases);
						const matchers = [
							release => release.is_explicit,
						];
						if (!matchLayout) Array.prototype.push.apply(matchers, [
							release => release.track_count == tracks.length,
						]);
						return (function getMatches(fuzzyLevel = 0) {
							return fuzzyLevel >= 0 && fuzzyLevel <= maxFuzzyLevel ? Promise.all(releases.map(function(release) {
								if (!release.artists || release.artists.length <= 0) {
									if (!titlesMatch(release.name, fuzzyLevel)) return Promise.reject('Title mismatch');
									var brokenApi = true;
								} else if (!releasesMatch(release.artists.map(artist => artist.name), release.name, fuzzyLevel))
									return Promise.reject('Artist - Title mismatch');
								if (matchLayout && release.track_count > 0 && release.track_count != tracks.length)
									return Promise.reject('Tracklist mismatch');
								if (matchLayout && releaseYear > 0 && release.publish_date && extractYear(release.publish_date) != releaseYear)
									return Promise.reject('Release year mismatch');
								return matchLayout && !release.track_count || brokenApi ? apiFunc('releases/' + release.id).then(function(_release) {
									if (brokenApi && !releasesMatch(_release.artists.map(artist => artist.name), _release.name, fuzzyLevel))
										return Promise.reject('Artist - Title mismatch');
									if (matchLayout && _release.track_count != tracks.length) return Promise.reject('Tracklist mismatch');
									if (matchLayout && releaseYear > 0 && _release.publish_date && extractYear(_release.publish_date) != releaseYear)
										return Promise.reject('Release year mismatch');
									return release;
								}, function(reason) {
									console.warn('Failed to get release', release.id, 'detail:', reason);
									console.debug(brokenApi, matchLayout, release);
									return !brokenApi || matchLayout && release.track_count > 0 ? release : Promise.reject(reason);
								}) : Promise.resolve(release);
							}).map(result => result.catch(reason => null))).then(matches => matches.filter(Boolean)).then(function(matches) {
								for (let j = 0; j < matchers.length; ++j)
									if (matches.length > 1 && matches.some(matchers[j])) matches = matches.filter(matchers[j]);
								if (matches.length > 1) return Promise.reject(providerName + ': ambiguity');
								if (matches.length <= 0) return getMatches(fuzzyLevel + 1);
								if (prefs.diag_mode && fuzzyLevel >= 2) console.debug(providerName + ' fuzzy match:', release, '≈', matches[0]);
								return matches[0];
							}) : Promise.reject(providerName + ': no matches');
						})();
					});
				}

				return typeof apiFunc == 'function' ? search(release.album)
					.catch(reason => !tailingBracketStripper.test(release.album) || !reason.endsWith('no matches') ?
						Promise.reject(reason) : search(release.album.replace(tailingBracketStripper, '')))
					: Promise.reject('invalid parameter');
			}
			function bsLookup(matchLayout = false) { return bsLookup_backend(queryBeatsourceAPI, 'Beatsource', matchLayout) }
			function bpLookup(matchLayout = false) { return bsLookup_backend(queryBeatportAPI, 'Beatport', matchLayout) }

			function neLookup(matchLayout = false) {
				function search(title) {
					const start = Date.now();
					let query = {
						s: '"' + title + '"',
						limit: 25,
						type: 10,
						//csrf_token: '',
					};
					//query.s = '"' + (isVA ? VA : release.artist) + '" ' + query.s;
					if (!isVA) query.s = '"' + release.artist + '" ' + query.s;
					return queryNeteaseAPI('cloudsearch/get/web', query).then(function(response) {
						if (!response.result) return Promise.reject('API returns malformed result');
						return !response.abroad ? response.result : (function() {
							function injectScript(src, errorHandler) {
								console.assert(src);
								coreJS = document.createElement('SCRIPT');
								coreJS.id = 'netease.core.js';
								coreJS.type = 'text/javascript';
								coreJS.async = false;
								const promise = new Promise(function(resolve, reject) {
									function errorHandler(currentTarget, reason) {
										console.warn('NetEase core.js (%s): %s', currentTarget.src, reason);
										if (typeof errorHandler == 'function') errorHandler(resolve, reject, currentTarget);
											else reject('NetEase core.js ' + reason);
									}

									coreJS.onload = function(evt) {
										if ([/*'asrsea', */'settmusic'].every(function(pubSym) {
											try { return typeof eval(pubSym) == 'function' } catch(e) { return false }
										})) resolve(evt.currentTarget); else errorHandler(evt.currentTarget, 'public functions not accessible');
									};
									coreJS.onerror = evt => { errorHandler(evt.currentTarget, 'loading error') };
									coreJS.src = src;
									document.head.append(coreJS);
								});
								return (coreJS.loader = promise);
							}

							var coreJS = document.getElementById('netease.core.js');
							if (coreJS != null && coreJS.loader instanceof Promise) return coreJS.loader;
							return injectScript('https://s1.music.126.net/web/s/core.js', function(resolve, reject, currentScript) {
								console.warn('Trying to fetch core.js url from root doc');
								globalXHR('https://music.163.com/').then(function({document}) {
									const script = document.body.querySelector(':scope > script[src*="/core"]');
									if (script != null && script.src) {
										window.document.head.removeChild(currentScript);
										injectScript(script.src).then(resolve, reject);
									} else reject('Invalid root document structure');
								}, reject);
							});
						})().then(core => decodeURIComponent(settmusic(response.result, 'fuck~#$%^&*(458')));
					}).then(result => JSON.parse(result)).then(result => result.albumCount > 0 ?
							result.albums : Promise.reject('NetEase: no matches'), function(reason) {
						console.warn('NetEase search-list method failed:', reason);
						query.s = '"' + title + '"'; // ?
						query.limit = 50;
						return queryNeteaseAPI('search/suggest/web', query).then(function(result) {
							if (result.code != 200 || !result.result)
								return Promise.reject('API returns malformed result (' + result.msg + ')');
							return result.result.albums || Promise.reject('NetEase: no matches');
						});
					}).then(function(albums) {
						if (!Array.isArray(albums) || albums.length <= 0) return Promise.reject('NetEase: no matches');
						if (prefs.diag_mode) console.debug('NetEase search results:', albums, 'in', (Date.now() - start) / 1000, 's');
						const matchers = [
							album => (album.type != 'EP/Single' || !releaseType // "专辑" == "album"
									|| ['Single', 'EP', 'Remix'].map(getReleaseTypeValue).includes(releaseType))
								&& releasesMatch(Array.isArray(album.artists) ?
									album.artists.map(artist => artist.name) : album.artist.name, album.name, i)
								&& (!matchLayout || !album.size || album.size == tracks.length),
						];
						if (!matchLayout) Array.prototype.push.apply(matchers, [
							album => album.size == tracks.length,
						]);
						for (var i = 0; i <= maxFuzzyLevel; ++i) {
							var f = albums.filter(matchers[0]);
							for (let j = 1; j < matchers.length; ++j)
								if (f.length > 1 && f.some(matchers[j])) f = f.filter(matchers[j]);
							if (f.length > 1) return Promise.reject('NetEase: ambiguity');
							if (f.length == 1) break;
						}
						if (i > maxFuzzyLevel) return Promise.reject('NetEase: no matches');
						if (prefs.diag_mode && i >= 2) console.debug('NetEase fuzzy match:', release, '≈', f[0]);
						return f[0];
					});
				}

				return search(release.album).catch(reason => !tailingBracketStripper.test(release.album)
					|| !reason.endsWith('no matches') ? Promise.reject(reason)
						: search(release.album.replace(tailingBracketStripper, '')));
			}

			function bcLookup(matchLayout = false) {
				// // search through API returns only 4 results
				// const search = title => queryBandcampAPI('fuzzysearch/1/autocomplete', { q: title }).then(function(result) {
				function search(title) {
					const getPage = (page = 1) => page > 0 ? globalXHR('https://bandcamp.com/search?' + new URLSearchParams({
						q: '"' + title + '"',
						item_type: 'a',
						page: page,
					}).toString()).then(({document}) => Array.from(document.body.querySelectorAll('div.results > ul.result-items > li.searchresult')).map(function(li) {
						try {
							var result = JSON.parse(li.dataset.search);
							if (result.type.toLowerCase() != 'a') return;
						} catch(e) {
							result = { }; // return;
							console.warn('Bandcamp: could not detect search result type', li);
						}
						result.part = 'a'; // ??
						if (!result.id) try {
							if ((result.id = /\b(?:id)=(\d+)\b/.exec(li.previousSibling.previousSibling.nodeValue)) != null)
								result.id = parseInt(result.id[1]);
						} catch(e) { }
						if ((result.imageUrl = li.querySelector('div.art > img')) != null)
							result.imageUrl = result.imageUrl.src;
						if ((result.name = li.querySelector('div.heading > a')) != null) try {
							result.url = new URL(result.name);
							result.url.search = '';
							result.name = result.name.textContent.trim();
						} catch(e) { return false }
						if ((result.band_name = li.querySelector('div.subhead')) != null)
							result.band_name = result.band_name.textContent.trim().replace(/^(?:by)\s+/, '');
						if ((result.num_tracks = li.querySelector('div.length')) != null) {
							result.length = result.num_tracks.textContent.trim();
							if ((result.num_tracks = /\b(\d+)\s+tracks?\b/i.exec(result.num_tracks.textContent)) != null)
								result.num_tracks = parseInt(result.num_tracks[1]);
						}
						if ((result.release_date = li.querySelector('div.released')) != null) {
							result.release_date = new Date(result.release_date.textContent.replace(/^\s*(?:released)\s+/, ''));
							if (isNaN(result.release_date)) delete result.release_date;
						}
						if ((result.tags = li.querySelector('div.tags')) != null)
							result.tags = result.tags.textContent.trim().replace(/^(?:tags):\s+/, '').split(/\s*,\s*/);
						return result.name && result.url ? result : null;
					}).filter(Boolean)) : [ ];
					return Promise.all(Array.from({ length: 6 }, (_, ndx) => getPage(ndx + 1)))
							.then(results => Array.prototype.concat.apply([ ], results)).then(function(results) {
						// if (!Array.isArray(result.auto.results) || result.auto.results.length <= 0)
						// 	return Promise.reject('Bandcamp: no matches');
						if (results.length <= 0) return Promise.reject('Bandcamp: no matches');
						if (prefs.diag_mode) console.debug('Bandcamp search results:', results);
						const matchers = [
							result => result.type == 'a' && releasesMatch(result.band_name, result.name, i)
								&& (!matchLayout || (!result.num_tracks || result.num_tracks == tracks.length)
									&& (!releaseYear || !result.release_date || result.release_date.getUTCFullYear() == releaseYear)),
						];
						if (!matchLayout) Array.prototype.push.apply(matchers, [
							result => releaseYear > 0 && result.release_date && result.release_date.getUTCFullYear() == releaseYear,
							result => result.num_tracks == tracks.length,
						]);
						for (var i = 0; i <= maxFuzzyLevel; ++i) {
							var f = results.filter(matchers[0]);
							for (let j = 1; j < matchers.length; ++j)
								if (f.length > 1 && f.some(matchers[j])) f = f.filter(matchers[j]);
							if (f.length > 1) return Promise.reject('Bandcamp: ambiguity');
							if (f.length == 1) break;
						}
						if (i > maxFuzzyLevel) return Promise.reject('Bandcamp: no matches');
						if (prefs.diag_mode && i >= 2) console.debug('Bandcamp fuzzy match:', release, '≈', f[0]);
						return f[0];
					});
				}

				return search(release.album).catch(reason1 => (!isVA ? search(release.artist) : Promise.reject('VA'))
					.catch(reason2 => !reason1.endsWith('no matches') && tailingBracketStripper.test(release.album) ?
						search(release.album.replace(tailingBracketStripper, '')) : Promise.reject(reason2)));
			}

			function amLookup(matchLayout = false) {
				function search(searchTerm) {
					searchTerm = '"' + searchTerm + '"';
					if (!isVA) searchTerm = '"' + release.artist + '" ' + searchTerm;
					return globalXHR('https://www.allmusic.com/search/albums/' + encodeURIComponent(searchTerm)).then(function({document}) {
						let results = Array.from(document.body.querySelectorAll('div#resultsContainer div.album')).map(function(div) {
							let result = {
								title: div.querySelector('div.title > a'),
								artist: div.querySelector('div.artist > a'),
								year: div.querySelector('div.year'),
								genres: div.querySelector('div.genres'),
							};
							Object.keys(result).forEach(key => {
								result[key] = result[key] != null ? result[key].textContent.trim() || undefined : undefined;
							});
							if (result.year) result.year = parseInt(result.year);
							if (result.genres) result.genres = result.genres.split(/\s*,\s*/);
							result.url = div.querySelector('div.title > a');
							result.url = result.url != null ? result.url.href : undefined;
							if ((result.id = /-(mw\d+)$/i.exec(result.url)) != null) result.id = result.id[1];
							if ((result.cover = div.querySelector('div.cover img')) != null) try {
								result.cover = new URL(result.cover.src);
								if (!result.cover.pathname.includes('/images/no_image/')) {
									result.cover.searchParams.set('f', 0);
									result.cover = result.cover.href;
								} else result.cover = undefined;
							} catch(e) {
								console.warn(e);
								result.cover = undefined;
							}
							return result;
						});
						if (results.length <= 0) return Promise.reject('AllMusic: no matches');
						if (prefs.diag_mode) console.debug('AllMusic search results:', results);
						const matchers = [ ];
						return (function getMatches(fuzzyLevel = 0) {
							return fuzzyLevel >= 0 && fuzzyLevel <= maxFuzzyLevel ? Promise.all(results.map(function(result) {
								if (!releasesMatch(result.artist, result.title, fuzzyLevel))
									return Promise.reject('Artist - Title mismatch');
								return matchLayout ? fetchOnline_Music(result.url, true).then(function(onlineTracks) {
									if (onlineTracks.length != tracks.length) return Promise.reject('Tracklist mismatch');
									// if (releaseYear > 0 && onlineTracks[0].release_date && extractYear(onlineTracks[0].release_date) != releaseYear)
									// 	return Promise.reject('Release year mismatch');
									return result;
								}) : Promise.resolve(result);
							}).map(result => result.catch(reason => null))).then(matches => matches.filter(Boolean)).then(function(matches) {
								for (let j = 1; j < matchers.length; ++j)
									if (matches.length > 1 && matches.some(matchers[j])) matches = matches.filter(matchers[j]);
								if (matches.length > 1) return Promise.reject('AllMusic: ambiguity');
								if (matches.length <= 0) return getMatches(fuzzyLevel + 1);
								if (prefs.diag_mode && fuzzyLevel >= 2) console.debug('AllMusic fuzzy match:', release, '≈', matches[0]);
								return matches[0];
							}) : Promise.reject('AllMusic: no matches');
						})();
					});
				}

				return search(release.album).catch(reason => tailingBracketStripper.test(release.album)
					&& reason.endsWith('no matches') ? search(release.album.replace(tailingBracketStripper, ''))
						: Promise.reject(reason));
			}
			function amLookupRelease(album) {
				return globalXHR((album.id ? 'https://www.allmusic.com/album/' + album.id : album.url) + '/releasesAjax').then(function({document}) {
					let releases = Array.from(document.body.querySelectorAll('div#releases > table.releaseTable > tbody > tr')).map(function(tr) {
						let result = {
							title: tr.querySelector('td.meta > span.title > a'),
							year: tr.querySelector('td.yearFormat > span:nth-of-type(1)'),
							media: tr.querySelector('td.yearFormat > span:nth-of-type(2)'),
						};
						Object.keys(result).forEach(key => {
							result[key] = result[key] != null ? result[key].textContent.trim() || undefined : undefined;
						});
						if (result.year) result.year = parseInt(result.year);
						if (result.media) result.media = estimateMedia(result.media);
						result.url = tr.querySelector('td.meta > span.title > a');
						result.url = result.url != null ? result.url.href : undefined;
						result.id = (result.id = /-(mr\d+)$/i.exec(result.url)) != null ? result.id[1] : undefined;
						result.labels = Array.from(tr.querySelectorAll('td.meta > span.labelRelId > a'))
							.map(a => a.title || a.textContent.trim());
						result.catalog = tr.querySelector('td.meta > span.labelRelId');
						result.catalog = result.catalog != null && result.catalog.lastChild.nodeType == Node.TEXT_NODE ?
							result.catalog.lastChild.wholeText.trim().replace(/-\s*/, '') : undefined;
						return result;
					});
					if (prefs.diag_mode) console.debug('AllMusic releases for ' + album.id + ':', releases);
					if (releaseYear > 0) releases = releases.filter(release => !release.year || release.year == releaseYear);
					if (media) {
						var f = releases.filter(release => media == release.media);
						if (f.length > 0) return f[0];
					}
					const commonMedia = ['WEB', 'CD', undefined];
					f = releases.filter(release => commonMedia.includes(media) && commonMedia.includes(release.media));
					return f.length > 0 ? f[0] : Promise.reject('AllMusic: no matches');
				});
			}

			function ottLookup(matchLayout = false) {
				const search = title => globalXHR('https://ototoy.jp/find/find.php?q=' + encodeURIComponent(title)).then(function({document}) {
					const results = Array.from(document.body.querySelectorAll('div.find-candidates-box > div.album')).map(function(div) {
						let result = {
							title: 'div.title > a',
							artist: 'div.artist > span > a',
						}, ref;
						Object.keys(result).forEach(key => {
							result[key] = div.querySelector(result[key]);
							result[key] = result[key] != null ? result[key].title || result[key].textContent.trim() : undefined;
						});
						if ((ref = div.querySelector('figure img.disc-jacket')) != null) result.jacket = ref.src;
						if ((ref = div.querySelector('div.title > a')) != null) {
							result.url = 'https://ototoy.jp' + ref.pathname;
							if (/\/p\/(\d+)\b/.test(ref.pathname)) result.id = parseInt(RegExp.$1);
						}
						return result;
					});
					if (results.length <= 0) return Promise.reject('OTOTOY: no matches');
					if (prefs.diag_mode) console.debug('OTOTOY search results:', results);
					const matchers = [ ];
					return (function getMatches(fuzzyLevel = 0) {
						return fuzzyLevel >= 0 && fuzzyLevel <= maxFuzzyLevel ? Promise.all(results.map(function(result) {
							if (!releasesMatch(result.artist, result.title, fuzzyLevel))
								return Promise.reject('Artist - Title mismatch');
							return matchLayout ? fetchOnline_Music(result.url, true).then(function(onlineTracks) {
								if (onlineTracks.length != tracks.length) return Promise.reject('Tracklist mismatch');
								if (releaseYear > 0 && onlineTracks[0].release_date && extractYear(onlineTracks[0].release_date) != releaseYear)
									return Promise.reject('Release year mismatch');
								return result;
							}) : Promise.resolve(result);
						}).map(result => result.catch(reason => null))).then(matches => matches.filter(Boolean)).then(function(matches) {
							for (let j = 0; j < matchers.length; ++j)
								if (matches.length > 1 && matches.some(matchers[j])) matches = matches.filter(matchers[j]);
							if (matches.length > 1) return Promise.reject('OTOTOY: ambiguity');
							if (matches.length <= 0) return getMatches(fuzzyLevel + 1);
							if (prefs.diag_mode && fuzzyLevel >= 2) console.debug('OTOTOY fuzzy match:', release, '≈', matches[0]);
							return matches[0];
						}) : Promise.reject('OTOTOY: no matches');
					})();
				});

				return search(release.album).catch(reason1 => (!isVA ? search(release.artist) : Promise.reject('VA'))
					.catch(reason2 => !reason1.endsWith('no matches') && tailingBracketStripper.test(release.album) ?
						search(release.album.replace(tailingBracketStripper, '')) : Promise.reject(reason2)));
			}

			// probably not functional anymore without QQ account
			function qqLookup(matchLayout = false) {
				function search(title) {
					title = '"' + title + '"';
					if (!isVA) title = '"' + release.artist + '" ' + title;
					return globalXHR('https://c.y.qq.com/soso/fcgi-bin/client_search_cp?' + new URLSearchParams({
						format: 'json',
						w: title,
						t: 8,
						inCharset: 'utf8',
						outCharset: 'utf-8',
					}).toString(), { responseType: 'json' }).then(function({response}) {
						if (response.code != 0) return Promise.reject('response code ' + response.code);
						if (response.data.album.totalnum <= 0) return Promise.reject('QQ音乐: no matches');
						if (prefs.diag_mode) console.debug('QQ音乐 search results:', response.data.album.list);
						const getItemUrl = item => item.albumMID ? 'https://y.qq.com/n/ryqq/albumDetail/' + item.albumMID : undefined,
									matchers = [ ];
						return (function getMatches(fuzzyLevel = 0) {
							return fuzzyLevel >= 0 && fuzzyLevel <= maxFuzzyLevel ? Promise.all(response.data.album.list.map(function(result) {
								if (!releasesMatch(result.singer_list.map(singer => singer.name), result.albumName, fuzzyLevel))
									return Promise.reject('Artist - Title mismatch');
								return matchLayout ? fetchOnline_Music(getItemUrl(result), true).then(function(onlineTracks) {
									if (onlineTracks.length != tracks.length) return Promise.reject('Tracklist mismatch');
									if (releaseYear > 0 && onlineTracks[0].release_date && extractYear(onlineTracks[0].release_date) != releaseYear)
										return Promise.reject('Release year mismatch');
									return result;
								}) : Promise.resolve(result);
							}).map(result => result.catch(reason => null))).then(matches => matches.filter(Boolean)).then(function(matches) {
								for (let j = 0; j < matchers.length; ++j)
									if (matches.length > 1 && matches.some(matchers[j])) matches = matches.filter(matchers[j]);
								if (matches.length > 1) return Promise.reject('QQ音乐: ambiguity');
								if (matches.length <= 0) return getMatches(fuzzyLevel + 1);
								matches[0].url = getItemUrl(matches[0]);
								if (prefs.diag_mode && fuzzyLevel >= 2) console.debug('QQ音乐 fuzzy match:', release, '≈', matches[0]);
								return matches[0];
							}) : Promise.reject('QQ音乐: no matches');
						})();
					});
				}

				return search(release.album).catch(reason => !tailingBracketStripper.test(release.album)
					|| !reason.endsWith('no matches') ? Promise.reject(reason)
						: search(release.album.replace(tailingBracketStripper, '')));
			}

			function blpLookup(matchLayout = false) {
				const search = title => globalXHR('https://bleep.com/search/query?q=' + encodeURIComponent(title)).then(function({document}) {
					const results = Array.from(document.body.querySelectorAll('ul.product-list > li.product')).map(function(li) {
						let result = {
							id: parseInt(li.dataset.id) || undefined,
							artist: li.querySelector('dd.artist > a'),
							title: li.querySelector('dd.release-title > a'),
							label: li.querySelector('dd.label > a'),
							trackCount: li.querySelector('span.track-count'),
							imageUrl: li.querySelector('a.artwork > img'),
						};
						result.artist = result.artist != null ? result.artist.title || result.artist.textContent.trim() : undefined;
						result.url = result.title != null ? 'https://bleep.com' + result.title.pathname : undefined;
						result.title = result.title != null ? result.title.title || result.title.textContent.trim() : undefined;
						result.label = result.label != null ? result.label.title || result.label.textContent.trim() : undefined;
						result.trackCount = result.trackCount != null && /\b(\d+)\b/.test(result.trackCount.textContent) ?
							parseInt(RegExp.$1) || undefined : undefined;
						result.imageUrl = result.imageUrl != null ? result.imageUrl.src : undefined;
						return result;
					});
					if (results.length <= 0) return Promise.reject('Bleep: no matches');
					if (prefs.diag_mode) console.debug('Bleep search results:', results);
					const matchers = [
						result => releasesMatch(result.artist, result.title, i)
							&& (!matchLayout || !result.trackCount || result.trackCount == tracks.length),
					];
					if (!matchLayout) Array.prototype.push.apply(matchers, [
						result => result.trackCount == tracks.length,
					]);
					for (var i = 0; i <= maxFuzzyLevel; ++i) {
						var f = results.filter(matchers[0]);
						for (let j = 1; j < matchers.length; ++j)
							if (f.length > 1 && f.some(matchers[j])) f = f.filter(matchers[j]);
						if (f.length > 1) return Promise.reject('Bleep: ambiguity');
						if (f.length == 1) break;
					}
					if (i > maxFuzzyLevel) return Promise.reject('Bleep: no matches');
					if (prefs.diag_mode && i >= 2) console.debug('Bleep fuzzy match:', release, '≈', f[0]);
					return f[0];
				});

				return search(release.album).catch(reason1 => (!isVA ? search(release.artist) : Promise.reject('VA'))
					.catch(reason2 => !reason1.endsWith('no matches') && tailingBracketStripper.test(release.album) ?
						search(release.album.replace(tailingBracketStripper, '')) : Promise.reject(reason2)));
			}

			function jxLookup(matchLayout = false) {
				function search(title) {
					let searchTerm = '"' + title + '"';
					if (!isVA) searchTerm = '"' + release.artist + '" ' + searchTerm;
					return globalXHR('https://api-jooxtt.sanook.com/openjoox/v2/search_type?' + new URLSearchParams({
						type: 1,
						key: searchTerm,
						lang: 'en',
					}).toString(), { responseType: 'json' }).then(function({response}) {
						if (response.error_code != 0) return Promise.reject('response code ' + response.error);
						if (response.albums.length <= 0) return Promise.reject('JOOX: no matches');
						for (let album of response.albums) for (let artist of album.artist_list) artist.name = atob(artist.name);
						if (prefs.diag_mode) console.debug('JOOX search results:', response.albums);
						const getItemUrl = item => item.id ? 'https://www.joox.com/intl/album/' + item.id : undefined;
						const matchers = [
							album => album.name.endsWith(' (Explicit)'),
						];
						return (function getMatches(fuzzyLevel = 0) {
							return fuzzyLevel >= 0 && fuzzyLevel <= maxFuzzyLevel ? Promise.all(response.albums.map(function(result) {
								if (!releasesMatch(result.artist_list.map(artist => artist.name),
										result.name.replace(/\s+\(Explicit\)/i, ''), fuzzyLevel))
									return Promise.reject('Artist - Title mismatch');
								return matchLayout ? fetchOnline_Music(getItemUrl(result), true).then(function(onlineTracks) {
									if (onlineTracks.length != tracks.length) return Promise.reject('Tracklist mismatch');
									if (releaseYear > 0 && onlineTracks[0].release_date && extractYear(onlineTracks[0].release_date) != releaseYear)
										return Promise.reject('Release year mismatch');
									return result;
								}) : Promise.resolve(result);
							}).map(result => result.catch(reason => null))).then(matches => matches.filter(Boolean)).then(function(matches) {
								for (let j = 1; j < matchers.length; ++j)
									if (matches.length > 1 && matches.some(matchers[j])) matches = matches.filter(matchers[j]);
								if (matches.length > 1) return Promise.reject('JOOX: ambiguity');
								if (matches.length <= 0) return getMatches(fuzzyLevel + 1);
								matches[0].url = getItemUrl(matches[0]);
								if (matches[0].images) matches[0].maxCoverUrl =
									matches[0].images.reduceRight((acc, image) => image.url.replace(/\/(\d+)$/, '/0'), undefined);
								if (prefs.diag_mode && fuzzyLevel >= 2) console.debug('JOOX fuzzy match:', release, '≈', matches[0]);
								return matches[0];
							}) : Promise.reject('JOOX: no matches');
						})();
					});
				}

				return Promise.reject('Defunct');
				// return search(release.album).catch(reason => !tailingBracketStripper.test(release.album)
				// 	|| !reason.endsWith('no matches') ? Promise.reject(reason)
				// 		: search(release.album.replace(tailingBracketStripper, '')));
			}

			function bkLookup(matchLayout = false) {
				const search = title => globalXHR('https://boomkat.com/products?q[keywords]=' + encodeURIComponent(title)).then(function({document}) {
					const results = Array.from(document.body.querySelectorAll('div.product-listing div.product')).map(function(div) {
						let result = {
							artists: Array.from(div.querySelectorAll('div.details div > a > strong'))
								.map(strong => strong.textContent.trim()),
							title: div.querySelector('div.details div > a > span.album-title'),
							label: div.querySelector('div > span[class=""] > a'),
							catNo: div.querySelector('div > span.catnum'),
							genre: Array.from(div.querySelectorAll('div > span.genre > a')).map(a => a.textContent.trim()).join(', '),
							url: div.querySelector('div.details div > a'),
							imageUrl: div.querySelector('div.img img'),
						};
						result.title = result.title != null ? result.title.textContent.trim() : undefined;
						result.label = result.label != null ? result.label.textContent.trim() : undefined;
						result.catNo = result.catNo != null ? result.catNo.textContent.trim().replace(/^Cat No:\s*/i, '') : undefined;
						//result.id = result.url != null ? result.url.pathname.replace(/^.*\//, '') : undefined;
						result.url = result.url != null ? 'https://boomkat.com' + result.url.pathname : undefined;
						result.imageUrl = result.imageUrl != null ? result.imageUrl.src.replace(/\/product\//i, '/original/') : undefined;
						return result;
					});
					if (results.length <= 0) return Promise.reject('Boomkat: no matches');
					if (prefs.diag_mode) console.debug('Boomkat search results:', results);
					const matchers = [
						result => releasesMatch(result.artists, result.title, i),
						//result => result.trackCount == tracks.length,
					];
					for (var i = 0; i <= maxFuzzyLevel; ++i) {
						var f = results.filter(matchers[0]);
						for (let j = 1; j < matchers.length; ++j)
							if (f.length > 1 && f.some(matchers[j])) f = f.filter(matchers[j]);
						if (f.length > 1) return Promise.reject('Boomkat: ambiguity');
						if (f.length == 1) break;
					}
					if (i > maxFuzzyLevel) return Promise.reject('Boomkat: no matches');
					if (prefs.diag_mode && i >= 2) console.debug('Boomkat fuzzy match:', release, '≈', f[0]);
					return f[0];
				});

				return search(release.album).catch(reason1 => (!isVA ? search(release.artist) : Promise.reject('VA'))
					.catch(reason2 => !reason1.endsWith('no matches') && tailingBracketStripper.test(release.album) ?
						search(release.album.replace(tailingBracketStripper, '')) : Promise.reject(reason2)));
			}

			function ammLookup(matchLayout = false) { // Amazon Music
				return getAmazonCfg('https://music.amazon.com/search/').then(function(appConfig) {
					function search(title) {
						title = '"' + title + '"';
						if (!isVA) title = '"' + release.artist + '" ' + title;
						return globalXHR(appConfig.urlBase + 'api/showSearch?' + new URLSearchParams({
							keyword: JSON.stringify({
								interface: 'Web.TemplatesInterface.v1_0.Touch.SearchTemplateInterface.SearchKeywordClientInformation',
								keyword: title,
							}),
							userHash: JSON.stringify({ level: 'LIBRARY_MEMBER' }),
						}).toString(), {
							responseType: 'json',
							headers: appConfig.headers,
						}).then(({response}) => response.methods[0].template.widgets.find(widget => widget.header == 'Albums').items).then(function(items) {
							if (items.length <= 0) return Promise.reject('Amazon Music: no matches');
							if (prefs.diag_mode) console.debug('Amazon Music search results:', items);
							const getItemUrl = item => item.primaryLink && item.primaryLink.deeplink ?
								'https://music.amazon.com' + item.primaryLink.deeplink : undefined;
							const matchers = [ ];
							return (function getMatches(fuzzyLevel = 0) {
								return fuzzyLevel >= 0 && fuzzyLevel <= maxFuzzyLevel ? Promise.all(items.map(function(result) {
									if (!releasesMatch(result.secondaryText, result.primaryText.text, fuzzyLevel))
										return Promise.reject('Artist - Title mismatch');
									return matchLayout ? fetchOnline_Music(getItemUrl(result), true).then(function(onlineTracks) {
										if (onlineTracks.length != tracks.length) return Promise.reject('Tracklist mismatch');
										if (releaseYear > 0 && onlineTracks[0].release_date && extractYear(onlineTracks[0].release_date) != releaseYear)
											return Promise.reject('Release year mismatch');
										return result;
									}) : Promise.resolve(result);
								}).map(result => result.catch(reason => null))).then(matches => matches.filter(Boolean)).then(function(matches) {
									for (let j = 0; j < matchers.length; ++j)
										if (matches.length > 1 && matches.some(matchers[j])) matches = matches.filter(matchers[j]);
									if (matches.length > 1) return Promise.reject('Amazon Music: ambiguity');
									if (matches.length <= 0) return getMatches(fuzzyLevel + 1);
									matches[0].url = getItemUrl(matches[0]);
									if (prefs.diag_mode && fuzzyLevel >= 2) console.debug('Amazon Music fuzzy match:', release, '≈', matches[0]);
									return matches[0];
								}) : Promise.reject('Amazon Music: no matches');
							})();
						});
					}

					return search(release.album).catch(reason => tailingBracketStripper.test(release.album)
						&& reason.endsWith('no matches') ? search(release.album.replace(tailingBracketStripper, ''))
							: Promise.reject(reason));
				});
			}

			function floLookup() {
				function search(title) {
					let searchTerm = '"' + title + '"';
					//searchTerm = '"' + (isVA ? VA : release.artist) + '" ' + searchTerm;
					if (!isVA) searchTerm = '"' + release.artist + '" ' + searchTerm;
					return globalXHR('https://www.music-flo.com/api/search/v2/search?' + new URLSearchParams({
						keyword: searchTerm,
						searchType: 'ALBUM',
						sortType: 'ACCURACY',
						size: 50,
					}).toString(), { responseType: 'json' }).then(function({response}) {
						if (response.code != 2000000) return Promise.reject(response.message);
						//if (response.data.totalCount <= 0) return Promise.reject('FLO: no matches');
						console.assert(Array.isArray(response.data.list), 'Array.isArray(response.data.list)', response);
						return response.data.list[0].list.map(function(album) {
							album.webId = Array.from(album.id.toString()).map(c => 'danielzohy'[parseInt(c)]).join('');
							return album;
						});
					}).then(function(results) {
						console.assert(results.length > 0, 'results.length > 0');
						if (results.length <= 0) return Promise.reject('FLO: no matches');
						if (prefs.diag_mode) console.debug('FLO search results:', results);
						const getItemUrl = item => item.webId ? 'https://www.music-flo.com/detail/album/' + item.webId : undefined;
						const matchers = [ ];
						return (function getMatches(fuzzyLevel = 0) {
							return fuzzyLevel >= 0 && fuzzyLevel <= maxFuzzyLevel ? Promise.all(results.map(function(result) {
								if (!releasesMatch(result.artistList.map(artist => artist.name), result.title, fuzzyLevel))
									return Promise.reject('Artist - Title mismatch');
								if (result.albumType == 'SL' ? !['Single', 'EP', 'Remix'].map(getReleaseTypeValue).includes(releaseType)
										: releaseType == getReleaseTypeValue('Single'))
									return Promise.reject('Release type mismatch');
								if (matchLayout && releaseYear && result.releaseYmd && parseInt(result.releaseYmd.slice(0, 4)) != releaseYear)
									return Promise.reject('Release year mismatch');
								return matchLayout ? globalXHR('https://www.music-flo.com/api/meta/v1/album/' + result.id + '/track', {
									responseType: 'json',
								}).then(function({response}) {
									if (response.data.list.length != tracks.length) return Promise.reject('Tracklist mismatch');
									return result;
								}) : Promise.resolve(result);
							}).map(result => result.catch(reason => null))).then(matches => matches.filter(Boolean)).then(function(matches) {
								for (let j = 0; j < matchers.length; ++j)
									if (matches.length > 1 && matches.some(matchers[j])) matches = matches.filter(matchers[j]);
								if (matches.length > 1) return Promise.reject('FLO: ambiguity');
								if (matches.length <= 0) return getMatches(fuzzyLevel + 1);
								matches[0].url = getItemUrl(matches[0]);
								if (prefs.diag_mode && fuzzyLevel >= 2) console.debug('FLO fuzzy match:', release, '≈', matches[0]);
								return matches[0];
							}) : Promise.reject('FLO: no matches');
						})();
					});
				}

				return search(release.album).catch(reason => !tailingBracketStripper.test(release.album)
					|| !reason.endsWith('no matches') ? Promise.reject(reason)
						: search(release.album.replace(tailingBracketStripper, '')));
			}

			function junoLookup(matchLayout = false) {
				function search(searchTerm) {
					if (!isVA) searchTerm = release.artist + ' ' + searchTerm;
					return globalXHR('https://www.junodownload.com/search/?' + new URLSearchParams({
						'q[all][]': searchTerm,
					}).toString()).then(function({document}) {
						let results = Array.from(document.body.querySelectorAll('div.row > div > div.jd-listing-item')).map(function(div) {
							let result = {
								artist: div.querySelector('div.juno-artist > a'),
								title: div.querySelector('a.juno-title'),
								label: div.querySelector('a.juno-label'),
								details: div.querySelector('div > div.text-sm'),
							};
							for (let key in result)
								result[key] = result[key] != null ? result[key].textContent.trim() || undefined : undefined;
							result.id = div.querySelector('a.juno-title');
							result.id = result.id != null ? result.id.pathname.split('/').filter(Boolean).pop() : undefined;
							result.url = div.querySelector('a.juno-title');
							result.url = result.url != null ? 'https://www.junodownload.com' + result.url.pathname : undefined;
							result.coverUrl = div.querySelector('div > a > img');
							result.coverUrl = result.coverUrl != null ?
								result.coverUrl.src.replace(/\/\d+\//, '/full/').replace(/(\.\w+)$/, '-BIG$1') : undefined;
							if (result.details) result.details = result.details.split(/\r?\n/);
							return result;
						});
						if (results.length <= 0) return Promise.reject('Juno Download: no matches');
						if (prefs.diag_mode) console.debug('Juno Download search results:', results);
						const matchers = [ ];
						return (function getMatches(fuzzyLevel = 0) {
							return fuzzyLevel >= 0 && fuzzyLevel <= maxFuzzyLevel ? Promise.all(results.map(function(result) {
								if (!releasesMatch(result.artist, result.title, fuzzyLevel))
									return Promise.reject('Artist - Title mismatch');
								return matchLayout ? fetchOnline_Music(result.url, true).then(function(onlineTracks) {
									if (onlineTracks.length != tracks.length) return Promise.reject('Tracklist mismatch');
									if (releaseYear > 0 && onlineTracks[0].release_date && extractYear(onlineTracks[0].release_date) != releaseYear)
										return Promise.reject('Release year mismatch');
									return result;
								}) : Promise.resolve(result);
							}).map(result => result.catch(reason => null))).then(matches => matches.filter(Boolean)).then(function(matches) {
								for (let j = 0; j < matchers.length; ++j)
									if (matches.length > 1 && matches.some(matchers[j])) matches = matches.filter(matchers[j]);
								if (matches.length > 1) return Promise.reject('Juno Download: ambiguity');
								if (matches.length <= 0) return getMatches(fuzzyLevel + 1);
								if (prefs.diag_mode && fuzzyLevel >= 2) console.debug('Juno Download fuzzy match:', release, '≈', matches[0]);
								return matches[0];
							}) : Promise.reject('Juno Download: no matches');
						})();
					});
				}

				return search(release.album).catch(reason => tailingBracketStripper.test(release.album)
					&& reason.endsWith('no matches') ? search(release.album.replace(tailingBracketStripper, ''))
						: Promise.reject(reason));
			}

			function moraLookup(matchLayout = false) {
				function search(searchTerm) {
					searchTerm = '"' + searchTerm + '"'
					if (!isVA) searchTerm = '"' + release.artist + '" ' + searchTerm;
					return globalXHR('https://mora.jp/search/getResult?' + new URLSearchParams({ keyWord: searchTerm }).toString(),
							{ responseType: 'json' }).then(function({response}) {
						if (response.data.packageResult.total <= 0) return Promise.reject('mora: no matches');
						if (prefs.diag_mode) console.debug('mora search results:', response.data.packageResult);
						const matchers = [
							result => (releasesMatch(result.artistName, result.packageTitle, i)
								|| result.artistNameKana && releasesMatch(result.artistNameKana, result.packageTitle, i)
								|| result.packageTitleKana && releasesMatch(result.artistName, result.packageTitleKana, i)
								|| result.artistNameKana && result.packageTitleKana
									&& releasesMatch(result.artistNameKana, result.packageTitleKana, i))
								&& (!matchLayout || !result.packageTrack || result.packageTrack == tracks.length),
							result => (parseInt(result.bitPerSample) == 24) === (encoding == '24bit Lossless'),
						];
						if (!matchLayout) Array.prototype.push.apply(matchers, [
							result => result.packageTrack == tracks.length,
						]);
						for (var i = 0; i <= maxFuzzyLevel; ++i) {
							var f = response.data.packageResult.list.filter(matchers[0]);
							for (let j = 1; j < matchers.length; ++j)
								if (f.length > 1 && f.some(matchers[j])) f = f.filter(matchers[j]);
							if (f.length > 1) return Promise.reject('mora: ambiguity');
							if (f.length == 1) break;
						}
						if (i > maxFuzzyLevel) return Promise.reject('mora: no matches');
						if (prefs.diag_mode && i >= 2) console.debug('mora fuzzy match:', release, '≈', f[0]);
						return f[0];
					});
				}

				return search(release.album).catch(reason => tailingBracketStripper.test(release.album)
					&& reason.endsWith('no matches') ? search(release.album.replace(tailingBracketStripper, ''))
						: Promise.reject(reason));
			}

			function ruleLink(rule) {
				return ' (<a href="/rules.php?p=upload#r' + rule + '" target="_blank" style="' +
					hyperlinkStyle + '">' + rule + '</a>)';
			}

			function releasesMatch(remoteArtist, remoteTitle, relaxLevel = 0, minSimilarity = 0.9, minFullSimilarity) {
				if (typeof remoteArtist == 'string') {
					if (isVA != vaParser.test(remoteArtist)) return false;
					if (!isVA) remoteArtist = getArtists(remoteArtist)[0];
				} else if (!Array.isArray(remoteArtist)) return false;
				if (!isVA && !artists[0].equalCaselessTo(remoteArtist)
						&& (!(relaxLevel >= 1) || !artists[0].map(name => name.toASCII()).equalCaselessTo(remoteArtist.map(name => name.toASCII()))))
					return false;
				return titlesMatch(remoteTitle, relaxLevel, minSimilarity, minFullSimilarity);
			}

			function titlesMatch(remoteTitle, relaxLevel = 0, minSimilarity = undefined, minStrippedSimilarity = undefined) {
				if (!remoteTitle) return false;
				if (typeof remoteTitle == 'string') remoteTitle = remoteTitle.toLowerCase(); else return false;
				let localTitles = [release.album.toLowerCase(), album.toLowerCase()];
				// relax level 0: strict caseless equality
				if (localTitles[0] == remoteTitle) return true;
				if (!(relaxLevel >= 1)) return false;
				// relax level 1: strict caseless equality of stripped accents
				if (localTitles[0].toASCII() == remoteTitle.toASCII()) return true;
				if (!(relaxLevel >= 2) || onlineSource && !isUpload && !isAddFormat) return false;
				// relax level 2: fuzzy caseless equality
				if (!(minSimilarity > 0)) minSimilarity = 0.90;
				let similarity = jaroWrinkerSimilarity(localTitles[0], remoteTitle);
				if (minSimilarity < 1 && similarity >= minSimilarity) {
					if (prefs.diag_mode) console.debug('Fuzzy similarity accepted: "' +
						localTitles[0] + '" ≈ "' + remoteTitle + '" (' + similarity.toFixed(3) + ')');
					return true;
				}
				if (!(relaxLevel >= 3)) return false;
				// relax level 3: exact caseless equality with stripped all tailing brackets
				let strippedTitles = [localTitles[0], remoteTitle].map(title => title.replace(tailingBracketStripper, ''));
				if (strippedTitles[0] == strippedTitles[1]) return true;
				if (!(relaxLevel >= 4)) return false;
				// relax level 4: any mutual exact caseless start
				if (localTitles[0].startsWith(remoteTitle) || remoteTitle.startsWith(localTitles[0])
						|| localTitles[1].startsWith(remoteTitle) || remoteTitle.startsWith(localTitles[1])) return true;
				if (!(relaxLevel >= 5)) return false;
				// relax level 5: fuzzy caseless equality of any stripped variant
				if (!(minStrippedSimilarity > 0)) minStrippedSimilarity = minSimilarity + 0.05;
				if (minStrippedSimilarity < 1) {
					similarity = jaroWrinkerSimilarity(localTitles[1], remoteTitle);
					if (similarity >= minStrippedSimilarity) {
						if (prefs.diag_mode) console.debug('Fuzzy similarity accepted: "' +
							fullLocalTitle + '" ≈ "' + remoteTitle + '" (' + similarity.toFixed(3) + ')');
						return true;
					}
					similarity = jaroWrinkerSimilarity(strippedTitles[0], strippedTitles[1]);
					if (similarity >= minStrippedSimilarity) {
						if (prefs.diag_mode) console.debug('Fuzzy similarity accepted: "' +
							strippedTitles[0] + '" ≈ "' + strippedTitles[1] + '" (' + similarity.toFixed(3) + ')');
						return true;
					}
				}
				//if (!(relaxLevel >= 6)) return false;https://www.junodownload.com/products/dj-nu-mark-run-for-cover-explicit/5277841-02/?track_number=3
				// relax level 5: strict mutual titles match anywhere
				if (localTitles[0].includes(remoteTitle) || remoteTitle.includes(localTitles[0])
						|| localTitles[1].includes(remoteTitle) || remoteTitle.includes(localTitles[1])) return true;
				return false;
			}

			function trackComparer(a, b) {
				var cmp;
				if (release.totalDiscs > 1) {
					cmp = a.disc_number - b.disc_number;
					if (!isNaN(cmp) && cmp != 0) return cmp;
				} else {
					cmp = (a.disc_subtitle || '').localeCompare(b.disc_subtitle || '');
					//if (cmp != 0) return cmp;
				}
				cmp = parseInt(a.track_number) - parseInt(b.track_number);
				if (!isNaN(cmp)) return cmp;
				let m1 = vinyltrackParser.exec(a.track_number.toUpperCase()),
						m2 = vinyltrackParser.exec(b.track_number.toUpperCase());
				return m1 != null && m2 != null ?
					m1[1].localeCompare(m2[1]) || parseFloat(m1[2]) - parseFloat(m2[2]) :
				a.track_number.toUpperCase().localeCompare(b.track_number.toUpperCase());
			}

			function reqSelectFormats(...vals) {
				const allFormats = formItem('all_formats');
				if (allFormats != null && allFormats.checked) {
					allFormats.checked = false;
					allFormats.disabled = true;
					allFormats.nextElementSibling.style.opacity = 0.4;
					notifyChange(allFormats);
					for (let input of form.elements.namedItem('formats[]')) {
						input.disabled = false;
						input.nextElementSibling.style.opacity = null;
					}
				}
				for (let val of vals) ['MP3', 'FLAC', 'AAC', 'AC3', 'DTS', 'Vorbis', 'DSD'].forEach(function(fmt, ndx) {
					if (val.toLowerCase() == fmt.toLowerCase() && (ref = document.getElementById('format_' + ndx)) != null) {
						ref.checked = true;
						notifyChange(ref);
					}
				});
			}

			function reqSelectBitrates(...vals) {
				const allBitrates = formItem('all_bitrates');
				if (allBitrates != null && allBitrates.checked) {
					allBitrates.checked = false;
					allBitrates.disabled = true;
					allBitrates.nextElementSibling.style.opacity = 0.4;
					notifyChange(allBitrates);
					for (let input of form.elements.namedItem('bitrates[]')) {
						input.disabled = false;
						input.nextElementSibling.style.opacity = null;
					}
				}
				const bitrateSet = !isOPS ? [
					192, 'APS (VBR)', 'V2 (VBR)', 'V1 (VBR)', 256, 'APX (VBR)',
					'V0 (VBR)', 320, 'Lossless', '24bit Lossless', 'Other',
				] : [
					192, 'APS (VBR)', 'V2 (VBR)', 'V1 (VBR)', 256, 'APX (VBR)',
					'V0 (VBR)', 'q8.x (VBR)', 320, 'Lossless', '24bit Lossless', 'Other',
				];
				vals.forEach(function(val) {
					let ndx = 10;
					bitrateSet.forEach((it, _ndx) => { if (val.toString().toLowerCase() == it.toString().toLowerCase()) ndx = _ndx });
					if ((ref = document.getElementById('bitrate_' + ndx)) != null) {
						ref.checked = true;
						notifyChange(ref);
					}
				});
			}

			function reqSelectMedias(...vals) {
				const allMedia = formItem('all_media');
				if (allMedia != null && allMedia.checked) {
					allMedia.checked = false;
					notifyChange(allMedia);
					for (let input of form.elements.namedItem('media[]')) {
						input.disabled = false;
						input.nextElementSibling.style.opacity = null;
					}
				}
				const mediaSet = isOPS ? ['CD', 'DVD', 'Vinyl', 'Blu-Ray', 'Soundboard', 'SACD', 'DAT', 'Cassette', 'WEB']
					: isNWCD ? ['CD', 'DVD', 'Blu-Ray', 'Vinyl', 'Soundboard', 'SACD', 'DAT', 'Cassette', 'WEB', 'Unknown']
					: ['CD', 'DVD', 'Vinyl', 'Soundboard', 'SACD', 'DAT', 'Cassette', 'WEB', 'Blu-Ray'];
				vals.forEach(function(val) {
					mediaSet.forEach(function(med, ndx) {
						if (val == med && (ref = document.getElementById('media_' + ndx)) != null) {
							ref.checked = true;
							notifyChange(ref);
						}
					});
					if (val == 'CD') {
						if ((ref = document.getElementById('needlog')) != null) {
							ref.checked = true;
							notifyChange(ref);
							if ((ref = document.getElementById('minlogscore')) != null) ref.value = 100;
						}
						if ((ref = document.getElementById('needcue')) != null) ref.checked = true;
						//if ((ref = document.getElementById('needchecksum')) != null) ref.checked = true;
					}
				});
			}

			function setSiteDefaults() {
				function getOptions(name, defaults) {
					let options = { };
					for (let option of document.body.querySelectorAll(`div#content select[name="${name}"] > option[value]`))
						options[option.value] = option.label.trim();
					if (Object.keys(options).length > 0) localStorage.setItem('options_' + name, JSON.stringify(options));
					else if ('options_' + name in localStorage) try {
						options = JSON.parse(localStorage.getItem('options_' + name));
					} catch(e) { console.warn(e) }
					if (Object.keys(options).length <= 0 && defaults) options = defaults;
					return options;
				}

				artistTypes = getOptions('importance[]', {
					1: 'Main', 2: 'Guest', 4: 'Composer', 5: 'Conductor', 6: 'DJ / Compiler', 3: 'Remixer', 7: 'Producer',
					8: 'Arranger',
				});
				releaseTypes = getOptions('releasetype', {
					1: 'Album', 3: 'Soundtrack', 5: 'EP', 6: 'Anthology', 7: 'Compilation', 9: 'Single', 11: 'Live album',
					13: 'Remix', 14: 'Bootleg', 15: 'Interview', 16: 'Mixtape', 17: isOPS ? 'DJ Mix' : 'Demo',
					18: 'Concert Recording', 19: 'DJ Mix', 21: 'Unknown',
				});
			}

			function getReleaseTypeValue(str) {
				if (str && typeof str == 'string') for (let entry of Object.entries(releaseTypes))
					if (entry[1].toLowerCase() == str.toLowerCase()) return parseInt(entry[0]);
				return 0;
			}

			function stringifyReleaseType(releaseType) {
				return releaseType > 0 && releaseTypes[releaseType] || null;
			}

			function getArtistTypeValue(str) {
				if (str && typeof str == 'string') for (let entry of Object.entries(artistTypes))
					if (entry[1].toLowerCase() == str.toLowerCase()) return parseInt(entry[0]);
				return 0;
			}

			function getChanString(n) {
				if (!n) return null;
				const chanmap = [
					'mono',
					'stereo',
					'2.1',
					'4.0 surround sound',
					'5.0 surround sound',
					'5.1 surround sound',
					'7.0 surround sound',
					'7.1 surround sound',
				];
				return n >= 1 && n <= 8 ? chanmap[n - 1] : n + 'chn surround sound';
			}

			function fetchOnlineAdditions() {
				if (onlineSource) return Promise.reject('Not offline source');
				let url = sourceUrl || release.urls[0];
				if (!httpParser.test(url)) return Promise.reject('No valid URL to parse');
				if (url.toLowerCase().includes('highresaudio.com/'))
					return globalXHR(url).then(response => hraPdfBooklet(response) || Promise.reject('No PDF booklet'));
				else if (url.toLowerCase().includes('actmusic.com/')) return globalXHR(url.replace('actmusic.com/de', 'actmusic.com/en')).then(function(response) {
					if ((ref = response.document.body.querySelector('div.sh3 > h1.header_title > a.btn-arrow-right')) == null)
						return Promise.reject('Release full info not found');
					return globalXHR('https://www.actmusic.com' + ref.pathname).then(actPdfBooklet);
				}); else if (url.toLowerCase().includes('eclassical.com/'))
					return globalXHR(url).then(response => eclassicalBooklets(response) || Promise.reject('No PDF booklet'));
				else if (url.toLowerCase().includes('nativedsd.com/catalogue/albums/'))
					return globalXHR(url).then(response => nativeDSDBooklets(response) || Promise.reject('No PDF booklet'));
				else if (/\b(?:qobuz\.com)(?:\/.+)?\/album(?:\/.+)?\/(\w+)\b/i.test(url))
					return queryQobuzAPI('album/get', { album_id: RegExp.$1 })
						.then(response => qobuzBooklet(response) || Promise.reject('No PDF booklet'));

				return Promise.reject('No online source containing additions');
			}

			function processTrackArtists(track) {
				[
					'artist', 'featured_artist', 'performer', 'remixer', 'composer', 'conductor', 'compiler',
					'producer', 'arranger',
				].forEach(function(role) {
					const isPseudoArtist = artist => [/*0, */1, 4].some(index => pseudoArtistParsers[index].test(artist));
					if (track[role] && isPseudoArtist(track[role])) delete track[role];
					let arrPropName = role + 's';
					if (!Array.isArray(track[arrPropName])) return;
					if (track[arrPropName].length <= 0) delete track[arrPropName];
						else track[arrPropName] = track[arrPropName].filter(artist => !isPseudoArtist(artist));
				});
				if (!isVA && !track.artist && Array.isArray(track.artists) && track.artists.length > 0) {
					track.artist = joinArtists(track.artists);
					if (Array.isArray(track.featured_artists) && track.featured_artists.length > 0)
						track.artist += ' feat. ' + joinArtists(track.featured_artists);
				}
				if (!track.track_artist && Array.isArray(track.track_artists) && track.track_artists.length > 0) {
					track.track_artist = joinArtists(track.track_artists);
					if (Array.isArray(track.track_guests) && track.track_guests.length > 0)
						track.track_artist += ' feat. ' + joinArtists(track.track_guests);
				}
				['performer', 'remixer', 'composer', 'conductor', 'compiler', 'producer', 'arranger'].forEach(function(role) {
					let arrPropName = role + 's';
					if (!track[role] && Array.isArray(track[arrPropName]) && track[arrPropName].length > 0)
						track[role] = track[arrPropName].join(role == 'composer' ? ', ' : '; ');
				});
			}
		} // parseTracks

		function estimateMedia(mediaStr) {
			return typeof mediaStr == 'string' && [
				[/\b(?:BR?D|BR)\b/, 'Blu-Ray'],
				[/\b(?:Blu[\-\s]?Ray)\b/i, 'Blu-Ray'],
				[/\b(?:SA-?CD)\b/, 'SACD'],
				//[/\b(?:Hybrid)\b/i, 'SACD'],
				[/\b(?:(?:HD[\-\s]?)?DVD(?:\-?A)?)\b/, 'DVD'],
				[/\b(?:Vinyl)\b/i, 'Vinyl'],
				[/\b(?:[LS]P\b|(?:5|6|7|8|9|10|12)")/, 'Vinyl'],
				[/\b(?:Flexi-disc|Shellac)\b/i, 'Vinyl'],
				[/\b(?:(?:Micro)?Cassette)/i, 'Cassette'],
				[/\b(?:WEB|File|Download|Digital\s+(?:Media|Distribution))\b|^(?:Digital)$/i, 'WEB'],
				[/\b(?:AAC|AIFC|AIFF|ALAC|AMR|APE|DFF|DSD|FLAC|MP2|MP3|ogg-vorbis|Opus|SHN|WAV|WavPack|WMA|WMV)\b/i, 'WEB'],
				//[/\b(?:DAT)\b/, 'DAT'],
				[/\b(?:Soundboard)\b/i, 'Soundboard'],
				[/\b(?:(?:HD[\-\s]?)?CD|CD[IiRr])\b/, 'CD'],
				[/\b(?:Compact\s+Disc)\b/, 'CD'],
				[/\b(?:SD\s*card|slotMusic|Flash\s*Drive)\b/i, undefined],
				[/\b(?:DualDisc)\b/i, undefined],
				[/\b(?:MiniDisc)\b/i, undefined],
				[/\b(?:VCD)\b/, undefined],
				[/\b(?:SVCD)\b/, undefined],
				[/\b(?:Other)\b/, undefined],
			].reduce((media, def) => media || def[0].test(mediaStr) && def[1], false) || undefined;
		}

		function mediaMapper(media) {
			if (isOPS) switch(media) {
				case 'BD': return 'Blu-Ray';
			} else if (isNWCD) switch(media) {
				case 'Blu-ray': return 'Blu-Ray';
			}
			return media;
		}

		function hraPdfBooklet(response) {
			let ref = response.document.body.querySelector('form#pdfjs-form-w2[action]');
			if (ref == null) return undefined;
			ref = new URLSearchParams(ref.action.replace(/^.*\?/, ''));
			return 'https://ptpimg.me/ts0fy8.png'.bbImg().bbUrl(ref.get('file'));
		}

		function actPdfBooklet(response) {
			let link;
			for (let a of response.document.body.querySelectorAll('ul.linklist > li > a')) {
				if (!a.pathname.endsWith('.pdf')) continue;
				if (!link || a.textContent.toLowerCase().includes('english')) link = a.pathname;
			}
			return link ? 'https://ptpimg.me/ts0fy8.png'.bbImg().bbUrl('https://www.actmusic.com' + link) : undefined;
		}

		function eclassicalBooklets(response) {
			let origin = new URL(response.finalUrl).origin;
			return Array.prototype.filter.call(response.document.body.querySelectorAll('div.articleAttachmentsContainer > ul > li > a'),
				a => a.href.endsWith('.pdf')).map(a => origin + a.pathname + a.search)
				.map(url => 'https://ptpimg.me/ts0fy8.png'.bbImg().bbUrl(url)).join(' ') || undefined;
		}

		function nativeDSDBooklets(response) {
			return Array.prototype.filter.call(response.document.body.querySelectorAll('div.product-cover a.link'),
				a => a.href.endsWith('.pdf')).map(a => a.href)
				.map(url => 'https://ptpimg.me/ts0fy8.png'.bbImg().bbUrl(url)).join(' ') || undefined;
		}

		function qobuzBooklet(response) {
			return response.goodies ? response.goodies.filter(goodie => goodie.file_format_id == 21)
				.map(goodie => 'https://ptpimg.me/ts0fy8.png'.bbImg().bbUrl(goodie.original_url || goodie.url))
				.join(' ') || undefined : undefined;
		}

		function fetchOnline_Music(url, weak = false) {
			if (!httpParser.test(url)) return Promise.reject('Invalid URL');
			if (!(url instanceof URL)) url = new URL(url);
			const discParser = /^(?:CD|DIS[CK]\s+|VOLUME\s+|DISCO\s+|DISQUE\s+)(\d+)(?:\s+of\s+(\d+))?$/i,
						mainArtistIndexes = [[2, 3, 4], [5, 6]];
			const realArtistName = artist => artist && ![0, 1, 4].some(ndx => pseudoArtistParsers[ndx].test(artist));
			const qbGetArtistsOfRole = (artists, index, ...indexes) => artists[index]
				.filter(artist => !indexes.concat(10, 14).some(index2 =>
					index2 != index && artists[index2] && artists[index2].includesCaseless(artist)))
				.filter(realArtistName);
			let ref, artist, album, albumYear, releaseDate, channels, label, composer, bitdepth, samplerate = 44100,
					description, compiler, producer, totalTracks, discSubtitle, discNumber, trackNumber, totalDiscs,
					title, trackArtist, catalogue, encoding, format, bitrate, duration, country, media = 'WEB', imgUrl,
					matches, genres = [ ], trs, tracks = [ ], identifiers = { }, trackIdentifiers = { };
			if (url.hostname.endsWith('qobuz.com') && url.pathname.includes('/album/')) {
				identifiers.QOBUZ_ID = url.pathname.replace(/^.*\//, '');

				function getTrackArtists(performers, defaultPerformer) {
					const artists = Array(qobuzArtistLabels.length + 1);
					for (let ndx = 0; ndx <= qobuzArtistLabels.length; ++ndx) artists[ndx] = [ ];
					if (performers && !['©', '(C)', '(c)', '℗', '(P)', '(p)'].some(s => performers.startsWith(s)))
						for (let component of performers.split(/\s+-\s+/).filter(x => !/^(?:19|2\d)\d{2}\b/.test(x))) {
							let parts = component.split(', ').map(s => s.trim());
							// ========================================== EXPERIMENTAL ==========================================
							if (parts.length > 2) {
								const index = parts.findIndex((s, index) => index > 0 && qbGetCategoryIndex(s, true) >= 0);
								if (index > 1) parts.splice(0, index, parts.slice(0, index).join(', ')); else if (index < 0) {
									//parts = [parts.join(', ')];
									if (prefs.diag_mode) console.warn('Qobuz rolesless performer:', component);
								}
							}
							// ==================================================================================================
							if (parts.length > 0) parts[0] = parts[0].consolidateWhitespace(); else continue;
							if (parts.length > 1) for (let ndx of parts.slice(1).map(qbGetCategoryIndex))
								artists[ndx >= 0 ? ndx : 16].pushUniqueCaseless(parts[0]);
							else {
								artists[qobuzArtistLabels.length].pushUniqueCaseless(parts[0]);
								if (prefs.diag_mode) console.warn('Qobuz rolesless performer:', parts[0]);
							}
						}

					artists.mainArtists = qbGetArtistsOfRole(artists, 0);
					for (let ndxs of mainArtistIndexes) if (artists.mainArtists.length <= 0) for (let ndx of ndxs)
						Array.prototype.pushUniqueCaseless.apply(artists.mainArtists, artists[ndx].filter(realArtistName));
					if (defaultPerformer && realArtistName(defaultPerformer = defaultPerformer.consolidateWhitespace())
							&& !artists.mainArtists.includesCaseless(defaultPerformer))
						artists.mainArtists.unshift(defaultPerformer);

					artists.guests = qbGetArtistsOfRole(artists, 7, 'mainArtists');
					featArtistParsers.forEach(function(rx, index) {
						if (index < 1) return;
						const matches = rx.exec(title);
						if (matches == null) return;
						const guestArtists = splitAmpersands(matches[2])
							.map(artist => artist.consolidateWhitespace()).filter(realArtistName);
						if (index > 5 && !guestArtists.every(artist => artists.some(result => result.includesCaseless(artist))))
							return;
						Array.prototype.pushUniqueCaseless.apply(artists.guests, guestArtists);
						title = title.replace(rx, '');
					});

					//if (prefs.diag_mode) console.debug('Track artists:', artists);
					return artists;
				}

				return queryQobuzAPI('album/get', { album_id: identifiers.QOBUZ_ID }).then(function(response) {
					if (prefs.diag_mode) console.debug('Qobuz metadata loaded:', response);
					if (response.tracks_count > response.tracks.limit) throw 'Tracklist length exceeding batch size';
					//throw 'just testin\'!';
					if (response.upc) identifiers.UPC = response.upc;
					isVA = response.artist && vaParser.test(response.artist.name);
					switch (response.release_type || response.product_type) {
						case 'album': /*identifiers.RELEASETYPE = 'Album'; */break;
						//case 'single': identifiers.RELEASETYPE = 'Single'; break;
						case 'ep': case 'epmini': identifiers.RELEASETYPE = 'EP'; break;
						case 'compilation': identifiers.RELEASETYPE = 'Compilation'; break;
						default: console.info('Qobuz API: unhandled release type', response.release_type, response.product_type);
					}

					album = response.title = response.title.trim().consolidateWhitespace();
					if (response.version) {
						response.version = response.version.trim().consolidateWhitespace();
						const version = ' (' + response.version + ')', alc = album.toLowerCase();
						if (!alc.includes(version.toLowerCase()) && !alc.endsWith(' ' + response.version.toLowerCase()))
							album += version;
					}

					const albumArtists = [ ];
					for (let ndx = 0; ndx < qobuzArtistLabels.length; ++ndx) albumArtists[ndx] = [ ];
					if (response.artists) for (let artist of response.artists)
						for (let ndx of artist.roles.map(qbGetCategoryIndex))
							albumArtists[ndx >= 0 ? ndx : 16].pushUniqueCaseless(artist.name.consolidateWhitespace());

					albumArtists.mainArtists = qbGetArtistsOfRole(albumArtists, 0);
					for (let ndxs of mainArtistIndexes) if (albumArtists.mainArtists.length <= 0) for (let ndx of ndxs)
						Array.prototype.pushUniqueCaseless.apply(albumArtists.mainArtists, albumArtists[ndx].filter(realArtistName));
					if (response.artist && response.artist.name
							&& realArtistName(response.artist.name = response.artist.name.consolidateWhitespace())
							&& !albumArtists.mainArtists.includesCaseless(response.artist.name))
						albumArtists.mainArtists.unshift(response.artist.name);
					if (albumArtists.mainArtists.length <= 0)
						albumArtists.mainArtists = response.artists.map(albumArtist => albumArtist.name.consolidateWhitespace());

					if ((albumArtists.guests = qbGetArtistsOfRole(albumArtists, 7, 'mainArtists')).length > 0) {
						if (prefs.diag_mode) console.log('Featured artists present in album artists:',
							Array.from(albumArtists.guests), '(left out from album artist)');
						albumArtists.guests = [ ];
					}
					featArtistParsers.forEach(function(rx, index) {
						if (index < 1) return;
						const matches = rx.exec(album);
						if (matches == null) return;
						const guestArtists = splitAmpersands(matches[2]).map(artist => artist.consolidateWhitespace()).filter(realArtistName);
						if (index > 5 && !guestArtists.every(artist => response.artists.map(artist =>
								artist.name.consolidateWhitespace()).includes(artist))) return;
						Array.prototype.pushUniqueCaseless.apply(albumArtists.guests, guestArtists);
						album = album.replace(rx, '');
					});

					if (response.description) {
						description = html2php(domParser.parseFromString(response.description, 'text/html').body, url).collapseGaps();
						if (description) description = description.bbQuote();
					}
					if (ref = qobuzBooklet(response)) if (description) description += '\n' + ref; else description = ref;
					if (response.image) imgUrl = response.image.large.replace(/_\d{3}(?=\.\w+$)/, '_org');
					response.tracks.items.forEach(function(track, index) {
						trackIdentifiers = { TRACK_ID: track.id };
						if (track.isrc) trackIdentifiers.ISRC = track.isrc;
						if (track.parental_warning) trackIdentifiers.EXPLICIT = 1;
						title = track.title.trim().consolidateWhitespace();
						if (track.version) {
							track.version = track.version.trim().consolidateWhitespace();
							const version = ' (' + track.version + ')', tlc = title.toLowerCase();
							if (!tlc.includes(version.toLowerCase()) && !tlc.endsWith(' ' + track.version.toLowerCase()))
								title += version;
						}
						const personnel = getTrackArtists(track.performers/*, track.performer && track.performer.name*/);
						if (personnel.mainArtists.length <= 0 && isVA && track.performer && track.performer.name)
							personnel.mainArtists = [track.performer.name];
						if ((!track.performer || !track.performer.name) && response.artist && response.artist.name
								&& realArtistName(response.artist.name = response.artist.name.consolidateWhitespace())
								&& !personnel.mainArtists.includesCaseless(response.artist.name))
							personnel.mainArtists.unshift(response.artist.name);
						trackArtist = isVA || !artistsMatch([personnel.mainArtists, personnel.guests],
							[albumArtists.mainArtists, albumArtists.guests]);
						tracks.push({
							artist: isVA ? VA : albumArtists[1].length == 1 ? albumArtists[1]
								: response.artist ? response.artist.name : undefined,
							artists: !isVA && albumArtists.mainArtists.length > 0 ? albumArtists.mainArtists : undefined,
							featured_artists: !isVA && albumArtists.mainArtists.length > 0 && albumArtists.guests.length > 0 ?
								albumArtists.guests : undefined,
							album: album,
							album_year: extractYear(response.release_date_original) || undefined,
							release_date: response.release_date_download || response.release_date_stream || undefined,
							label: response.label.name,
							encoding: 'lossless',
							codec: 'FLAC',
							bitdepth: track.maximum_bit_depth || response.maximum_bit_depth || undefined,
							samplerate: track.maximum_sampling_rate * 1000 || response.maximum_sampling_rate * 1000 || undefined,
							channels: track.maximum_channel_count || response.maximum_channel_count || undefined,
							media: media,
							genre: response.genre.name,
							disc_number: track.media_number || 1,
							total_discs: response.media_count,
							disc_subtitle: track.work || undefined,
							track_number: track.track_number || index + 1,
							total_tracks: response.tracks_count || response.tracks.total,
							title: title,
							// track_artist: trackArtist/* ? personnel[1].length == 1 ? personnel[1][0]
							// 	:*/ && track.performer && track.performer.name.consolidateWhitespace() || undefined,
							track_artists: trackArtist && personnel.mainArtists.length > 0 ? personnel.mainArtists : undefined,
							track_guests: trackArtist && personnel.guests.length > 0 ? personnel.guests : undefined,
							composer: track.composer ? track.composer.name : response.composer ? response.composer.name : undefined,
							composers: personnel[9].length > 0 ? personnel[9] : undefined,
							conductors: personnel[10].length > 0 ? personnel[10] : undefined,
							remixers: personnel[11].length > 0 ? personnel[11] : undefined,
							//producers: personnel[12].length > 0 ? personnel[12] : undefined,
							arrangers: personnel[13].length > 0 ? personnel[13] : undefined,
							//performer: track.performer ? track.performer.name : undefined,
							performers: personnel[0].concat(personnel[qobuzArtistLabels.length], personnel.slice(2, 9))
								.flatten().filter(Boolean).distinctValues(),
							compilers: albumArtists[14].length > 0 ? albumArtists[14] : undefined,
							duration: track.duration,
							album_gain: track.audio_info ? track.audio_info.replaygain_album_gain : undefined,
							track_gain: track.audio_info ? track.audio_info.replaygain_track_gain : undefined,
							album_peak: track.audio_info ? track.audio_info.replaygain_album_peak : undefined,
							track_peak: track.audio_info ? track.audio_info.replaygain_track_peak : undefined,
							url: response.url,
							description: description || undefined,
							identifiers: mergeIds(),
							cover_url: imgUrl,
						});
					});
					return finalizeTracks();
				}).catch(reason => globalXHR(url).then(function(response) {
					console.info('Qobuz API method failed for the reason', reason);
					const error = new Error('Failed to parse Qobuz release page');
					if ((ref = response.document.body.querySelector('section.album-item[data-gtm]')) != null) try {
						let gtm = JSON.parse(ref.dataset.gtm);
						//if (gtm.shop.category) genres.push(gtm.shop.category);
						//if (gtm.shop.subCategory) genres.pushUniqueCaseless(gtm.shop.subCategory);
					} catch(e) { console.warn(e) }

					if ((ref = response.document.body.querySelector('div.album-meta > h1.album-meta__title')) != null)
						album = ref.title || ref.textContent;
					if (album) album = album.trim().consolidateWhitespace(); else throw 'Album title could not be extracted';

					if ((ref = response.document.body.querySelector('div.album-meta > h2')) != null)
						artist = ref.title || ref.textContent.trim();
					if (artist) artist = artist.consolidateWhitespace();
					let mainArtist = (ref = response.document.body.querySelector('div.album-meta > ul > li:nth-of-type(2) > a')) != null ?
						ref.title || ref.textContent.trim() : undefined;
					if (mainArtist) mainArtist = mainArtist.consolidateWhitespace();
					if (!artist && !(artist = mainArtist)) throw 'Album artist could not be extracted';
					isVA = vaParser.test(artist);
					const mainArtists = splitAmpersands(artist);
					let featArtists = [ ];
					featArtistParsers.slice(1).forEach(function(rx, index) {
						const matches = rx.exec(album);
						if (matches == null) return;
						const guestArtists = splitAmpersands(matches[2]).map(artist => artist.consolidateWhitespace()).filter(realArtistName);
						if (index > 4 && !guestArtists.every(artist => mainArtists.includesCaseless(artist))) return;
						Array.prototype.pushUniqueCaseless.apply(featArtists, guestArtists);
						album = album.replace(rx, '');
					});
					if ((featArtists = featArtists.filter(featArtist => !mainArtists.includesCaseless(featArtist))).length > 0) {
						if (!featTest.test(artist)) artist += ' feat. ' + joinArtists(featArtists);
						//if (mainArtist && !featTest.test(mainArtist)) mainArtist += ' feat. ' + joinArtists(featArtists);
					}

					if ((ref = response.document.body.querySelector('div.album-meta > ul > li:first-of-type')) != null)
						releaseDate = normalizeDate(ref.textContent, /\/([a-z]{2})-[a-z]{2}\//i.test(url.pathname) ? RegExp.$1 : 'fr');
					//ref = response.document.body.querySelector('p.album-about__copyright');
					//if (ref != null) albumYear = extractYear(ref.textContent);
					for (let it of response.document.body.querySelectorAll('section#about > ul > li')) {
						const matchLabel = lbl => it.textContent.trimLeft().startsWith(lbl);
						if (/\b(\d+)\s*(?:dis[ck]|disco|disque)/i.test(it.textContent)) totalDiscs = parseInt(RegExp.$1);
						if (/\b(\d+)\s*(?:track|pist[ae]|tracce|traccia)/i.test(it.textContent)) totalTracks = parseInt(RegExp.$1);
						if (['Label', 'Etichetta', 'Sello'].some(l => it.textContent.trimLeft().startsWith(l))) {
							label = it.firstElementChild.textContent.replace(/\s+/g, ' ').trim();
						} else if (['Composer', 'Compositeur', 'Komponist', 'Compositore', 'Compositor'].some(matchLabel)) {
							composer = it.firstElementChild.textContent.trim();
							if (pseudoArtistParsers.slice(0, 5).some(rx => rx.test(composer))) composer = undefined;
						} else if (['Genre', 'Genere', 'Género'].some(g => it.textContent.startsWith(g))
								&& it.childElementCount > 0 && genres.length <= 0) {
							genres = Array.from(it.querySelectorAll('a')).map(a => qbGenreToEnglish(a.textContent.trim()));
							// if (genres.length >= 1 && ['Pop/Rock'].includes(genres[0])) genres.shift();
							// if (genres.length >= 2 && ['Alternative & Indie'].includes(genres[genres.length - 1])) genres.shift();
							// if (genres.length >= 1 && ['Metal', 'Heavy Metal'].some(genre => genres.includes(genre))) {
							// 	while (genres.length > 1) genres.shift();
							// }
							while (genres.length > 1) genres.shift();
						}
					}
					for (let span of response.document.body.querySelectorAll('span.album-quality__info')) {
						if (/\b(\d+(?:[\,\.]\d+)?)\s*(?:kHz)\b/i.test(span.textContent))
							samplerate = Math.round(parseFloat(RegExp.$1.replace(',', '.')) * 1000);
						if (/\b(\d+)[\-\s]*(?:Bits?)\b/i.test(span.textContent)) bitdepth = parseInt(RegExp.$1);
						if (/\b(?:Stereo)\b/i.test(span.textContent)) channels = 2;
						else if (/\b(\d)\.(\d)\b/.test(span.textContent)) channels = parseInt(RegExp.$1) + parseInt(RegExp.$2);
					}
					getDescription(response, 'section#description > p', true);
					if ((ref = response.document.body.querySelector('a[title="Qobuzissime"]')) != null) {
						if (description) description += '\n';
						description += 'https://ptpimg.me/4z35uj.png'.bbImg()
							.bbUrl('https://www.qobuz.com' + ref.pathname).bbAlign('center');
					}
					if ((ref = response.document.body.querySelector('div.album-cover > img')) != null)
						imgUrl = ref.src.replace(/_\d{3}(?=\.\w+$)/, '_org');
					addTracks(response.document);
					if (totalTracks <= 50) return finalizeTracks();
					let params = new URLSearchParams({
						albumId: identifiers.QOBUZ_ID,
						offset: 50,
						limit: 999,
						store: /\/(\w{2}-\w{2})\/album\//i.test(response.finalUrl) ? RegExp.$1 : 'fr-fr',
					});
					return globalXHR('https://www.qobuz.com/v4/ajax/album/load-tracks?' + params)
						.then(response => { addTracks(response.document) }, function(reason) {
						console.error('globalXHR() failed:', reason);
						addMessage('failed to load all tracks for long album, only first 50 tracks were extracted from HTML, which will result in incmplete release description', 'notice');
					}).then(() => finalizeTracks());

					function addTracks(dom) {
						Array.prototype.push.apply(tracks, Array.from(dom.querySelectorAll('div.player__item > div.player__tracks > div.track > div.track__items')).map(function(div, index) {
							trackIdentifiers = { TRACK_ID: div.parentNode.dataset.track };
							title = (ref = [
								'div.track__item--name > span', 'div.track__item--name--track > span', 'span.track__item--name',
							].reduce((acc, sel) => acc || div.querySelector(sel), null)) != null ? ref.title || ref.textContent : undefined;
							if (title) title = title.trim().consolidateWhitespace(); else throw 'Track title missing';
							let trackPerformer = div.querySelector('div.track__item--artist.track__item--performer > span')
								|| div.querySelector('div.track__item--name[itemprop="performer"] > span');
							trackPerformer = trackPerformer != null && trackPerformer.textContent.trim().consolidateWhitespace()
								|| undefined;
							ref = div.parentNode.querySelector('p.track__info:first-of-type');
							const personnel = getTrackArtists(ref != null && ref.textContent.trim()/*, trackPerformer*/);
							if (personnel.mainArtists.length <= 0 && isVA && trackPerformer) personnel.mainArtists = [trackPerformer];
							if (!trackPerformer && mainArtist && realArtistName(mainArtist)
									&& !personnel.mainArtists.includesCaseless(mainArtist)) personnel.mainArtists.unshift(mainArtist);
							trackArtist = isVA || !artistsMatch([personnel.mainArtists, personnel.guests], artist);
							let trackGenres = [ ];
							if (div.parentNode.dataset.gtm) try {
								let gtm = JSON.parse(div.parentNode.dataset.gtm);
								if (gtm.product.id) trackIdentifiers.QOBUZ_ID = gtm.product.id;
								if (gtm.product.type && gtm.product.type.toLowerCase() != 'album')
									trackIdentifiers.RELEASETYPE = gtm.product.type;
								if (gtm.product.subCategory) trackGenres.pushUniqueCaseless(gtm.product.subCategory.replace(/-/g, ' '));
							} catch(e) { console.warn(e) }
							trackGenres = trackGenres.map(genre => qbGenreToEnglish(genre.replace(/-/g, ' ')));
							if ((ref = div.parentNode.parentNode.parentNode.querySelector('p.player__work:first-child')) != null) {
								discSubtitle = ref.textContent.replace(/\s+/g, ' ').trim();
								guessDiscNumber();
							}
							return {
								artist: isVA ? VA : artist,
								album: album,
								album_year: albumYear,
								release_date: releaseDate,
								label: label,
								encoding: 'lossless',
								codec: 'FLAC',
								bitdepth: bitdepth || undefined,
								samplerate: samplerate || undefined,
								channels: channels || undefined,
								media: media,
								genre: (genres.length > 0 ? genres : trackGenres).join('; '),
								disc_number: discNumber || 1,
								total_discs: totalDiscs,
								disc_subtitle: discSubtitle,
								track_number: (ref = div.querySelector('div.track__item--number > span')
									|| div.querySelector('span[itemprop="position"]')) != null ? parseInt(ref.textContent) : undefined,
								total_tracks: totalTracks,
								title: title,
								//track_artist: trackArtist && /*personnel[1].length == 1 ? personnel[1][0] : */trackPerformer || undefined,
								track_artists: trackArtist && personnel.mainArtists.length > 0 ? personnel.mainArtists : undefined,
								track_guests: trackArtist && personnel.mainArtists.length > 0 && personnel.guests.length > 0 ?
									personnel.guests : undefined,
								composer: composer || undefined,
								composers: personnel[9].length > 0 ? personnel[9] : undefined,
								conductors: personnel[10].length > 0 ? personnel[10] : undefined,
								remixers: personnel[11].length > 0 ? personnel[11] : undefined,
								//producers: personnel[12].length > 0 ? personnel[12] : undefined,
								arrangers: personnel[13].length > 0 ? personnel[13] : undefined,
								performer: trackPerformer || undefined,
								performers: personnel[0].concat(personnel[qobuzArtistLabels.length], personnel.slice(2, 9))
									.flatten().filter(Boolean).distinctValues(),
								duration: (ref = div.querySelector('span.track__item--duration')) != null ?
									timeStringToTime(ref.textContent) : undefined,
								url: response.finalUrl,
								description: description || undefined,
								identifiers: mergeIds(),
								cover_url: imgUrl,
							};
						}));
					}
				}));
			} else if (url.hostname.endsWith('highresaudio.com') && url.pathname.includes('/album/view/')) return globalXHR(url).then(function(response) {
				if (/\/album\/view\/(\w+)\//i.test(response.finalUrl)) {
					identifiers.HRA_ID = RegExp.$1;
// 					queryHraAPI('vault/album', { album_id: identifiers.HRA_ID }).then(function({response}) {
// 						if (prefs.diag_mode) console.debug('HRA metadata received:', response);
// 						// TODO
// 					});
				}
				if (/\b(?:ClassHraJWP)\("hratrackplayer"\)\.init\((\[.+\])\);/m.test(response.responseText)) try {
					var hraTrackPlayer = JSON.parse(RegExp.$1);
					if (prefs.diag_mode) console.debug('hraTrackPlayer:', hraTrackPlayer);
				} catch(e) { console.warn(e) }
				if ((ref = response.document.getElementById('h1-album-title')) != null) {
					if (/\b(?:Sorry,\s*this album is not published yet)\b/.test(ref.textContent)) return Promise.reject(ref.textContent.trim());
					album = ref.firstChild.textContent.trim();
				}
				if ((ref = response.document.body.querySelector('h1 > span.artist')) != null) artist = ref.textContent.trim();
				response.document.body.querySelectorAll('div.album-col-info-data > div > p').forEach(function(p) {
					var key = p.firstChild.textContent, value = p.lastChild.textContent.trim();
					if (/^(?:Album[\s\-]Release)\b/i.test(key)) albumYear = extractYear(value);
					else if (/^(?:HRA[\s\-]Release)\b/i.test(key)) releaseDate = normalizeDate(value, 'de');
					else if (/^(?:Label)\b/i.test(key)) label = value;
					else if (/^(?:Genre|Subgenre)\b/i.test(key)) genres.push(value);
					else if (/^(?:Artist)\b/i.test(key)) {
						/*artist = Array.from(p.getElementsByTagName('A')).map(a => a.textContent.trim());
						if (artist.length > 0) isVA = artist.length == 1 && vaParser.test(artist[0]); else */artist = value;
					} else if (/^(?:Composer)\b/i.test(key)) composer = value.split(/\s*,\s*/)
						.map(composer => composer.replace(tailingBracketStripper, ''));
				});
				isVA = vaParser.test(artist);
				samplerate = undefined;
				response.document.body.querySelectorAll('tbody > tr > td.col-format').forEach(function(td) {
					processFormat(/\b(FLAC)\s*(\d+(?:[\.\,]\d+)?)\b/, 24);
					processFormat(/\b(DSD)\b/, 1);

					function processFormat(rx, bd) {
						if (!rx.test(td.textContent)) return;
						if (format === undefined) format = RegExp.$1; else if (format != RegExp.$1) format = NaN;
						var sr = parseFloat(RegExp.$2.replace(',', '.')) * 1000;
						if (samplerate === undefined) samplerate = sr; else if (samplerate != sr) samplerate = NaN;
						if (bitdepth === undefined) bitdepth = bd; else if (bitdepth != bd) bitdepth = NaN;
					}
				});
				getDescription(response, 'div#albumtab-info > p', false);
				if (i = hraPdfBooklet(response)) if (description) description += '\n\n' + i; else description = i;
				url = (ref = response.document.querySelector('meta[property="og:url"][content]')) != null && ref.content;
				if ((ref = response.document.querySelector('meta[property="og:image"][content]')) != null) imgUrl = ref.content;
				totalTracks = response.document.body.querySelectorAll('ul.playlist > li.pltrack').length;
				response.document.body.querySelectorAll('ul.playlist > li').forEach(function(li, index) {
					if (li.classList.contains('plinfo')) {
						discSubtitle = li.textContent.trim().replace(/\s*:$/, '');
						guessDiscNumber();
					}
					if (li.classList.contains('pltrack')) {
						title = (ref = li.querySelector('span.title')) != null ?
							ref.textContent.trim().replace(/\s+/g, ' ') : undefined;
						if (title && discSubtitle && title.startsWith(discSubtitle))
							title = title.slice(discSubtitle.lrngth).replace(/^\s*[\:\-\,\;]\s*/, '') || discSubtitle;
						tracks.push({
							artist: isVA ? VA : typeof artist == 'string' ? artist : undefined,
							artists: !isVA && Array.isArray(artist) && artist.length > 0 ? artist : undefined,
							album: album,
							album_year: albumYear,
							release_date: releaseDate,
							label: label,
							encoding: 'lossless',
							codec: format || undefined,
							bitdepth: bitdepth || undefined,
							samplerate: samplerate || undefined,
							media: media,
							genre: genres.join('; '),
							disc_number: discNumber,
							disc_subtitle: discSubtitle || undefined,
							total_discs: totalDiscs,
							track_number: (ref = li.querySelector('span.track')) != null ?
							parseInt(ref.textContent) || ref.textContent.trim() : undefined,
							total_tracks: totalTracks,
							title: title,
							composers: Array.isArray(composer) && composer.length > 0 ? composer : undefined,
							duration: (ref = li.querySelector('span.time')) != null && timeStringToTime(ref.textContent) || undefined,
							url: url || response.finalUrl,
							description: description,
							cover_url: imgUrl,
							identifiers: mergeIds(),
						});
					}
				});
				if (tracks.length <= 0) throw 'No tracks found';
				return tracks;
			}); else if (url.hostname.endsWith('bandcamp.com')) return globalXHR(url).then(bcParser);
			else if (url.hostname.endsWith('prestomusic.com')) return globalXHR(url).then(function(response) {
				function getArtists(nodeList, _conductors = false) {
					var artists = [ ];
					nodeList.forEach(function(_artists) {
						_artists = _artists.textContent.trim();
						if (_artists.startsWith('Record')) return;
						Array.prototype.push.apply(artists, splitAmpersands(_artists.replace(bracketStripper, '').replace(/;\s*/g, ''))
							.filter(artist => artist.length > 0 && !/^[a-z]/.test(artist)));
					});
					return artists.filter(artist => artist.length > 0 && conductors.includesCaseless(artist) == _conductors);
				}

				identifiers.COMPOSEREMPHASIS = 1;
				if (/\/products\/(\d+)\b/i.test(url.pathname)) identifiers.PRESTOMUSIC_ID = parseInt(RegExp.$1);
				let conductors = [ ], performers = [ ], groupsAndArtists = [ ];
				composer = [ ];
				response.document.body.querySelectorAll('div#related > div > ul > li').forEach(li => {[
					['Composers', composer],
					['Artists', groupsAndArtists],
					['Groups & Artists', groupsAndArtists],
					['Groups', groupsAndArtists],
					['Ensembles', groupsAndArtists],
					['Conductors', conductors],
					['Performers', performers],
				].forEach(function(def) {
					try {
						if (li.parentNode.previousElementSibling.textContent.trim() != def[0]) return;
						def[1].pushUniqueCaseless(li.textContent.trim()
							.replace(tailingBracketStripper, '').replace(/^(.+?),\s+(.+)$/, '$2 $1'));
					} catch(e) { console.error(e) }
				}) });
				artist = getArtists(response.document.querySelectorAll('div.c-product-block__contributors > p'));
				isVA = artist.length <= 0 || artist.length == 1 && vaParser.test(artist[0]);
				if ((ref = response.document.querySelector('h1.c-product-block__title')) != null)
					album = ref.lastChild.wholeText.trim();
				response.document.querySelectorAll('div.c-product-block__metadata > ul > li').forEach(function(li) {
					if (li.firstChild.textContent.includes('Release Date')) {
						releaseDate = li.lastChild.wholeText;
						if (/\b(\d+)\w*\s+(\w+)\s+(\d{4})\b/.test(releaseDate)) releaseDate = RegExp.$2 + ' ' + RegExp.$1 + ' ' + RegExp.$3;
					} else if (li.firstChild.textContent.includes('Label'))
						label = labelSubstitutes.reduce((l, def) => l.replace(...def), li.lastChild.wholeText.trim());
					else if (li.firstChild.textContent.includes('Catalogue No')) catalogue = li.lastChild.wholeText.trim();
				});
				genres = undefined;
				if (/\/jazz\//i.test(response.finalUrl)) genres = 'Jazz';
				if (/\/classical\//i.test(response.finalUrl)) genres = 'Classical';
				getDescription(response, 'div#about > div > p', true);
				let personnel = [ ];
				response.document.querySelectorAll('div.c-product-block__contributors > p').forEach(function(p) {
					// TODO
				});
				let reviews = Array.from(response.document.querySelectorAll('div#reviews > div > div.c-product__product-review'))
					.map(div => html2php(div, response.finalUrl).trim()).join('\n\n');
				if (reviews) description += '\n\n' + reviews.bbHide('Reviews');
				if (personnel.length > 0) {
					if (description) description += '\n\n';
					description += personnel.join('\n');
				}
				if ((ref = response.document.querySelector('div.c-product-block__aside > a')) != null)
					imgUrl = ref.href.replace(/\?\d+$/, '');
				trackNumber = 0;
				response.document.querySelectorAll('div.c-tracklist div.c-tracklist__work').forEach(function(div) {
					trs = div.querySelectorAll(':scope > div.c-track__details > ul > li');
					trackArtist = getArtists(trs, false);
					let workConductors = getArtists(trs, true);

					function addTracks(selector) {
						Array.prototype.push.apply(tracks, Array.from(div.querySelectorAll(selector)).map(node => ({
							artist: isVA ? VA : undefined,
							artists: !isVA ? artist : undefined,
							album: album,
							release_date: releaseDate,
							label: label,
							catalog: catalogue,
							media: media,
							genre: genres,
							disc_number: discNumber,
							disc_subtitle: discSubtitle,
							track_number: ++trackNumber,
							title: (ref = node.querySelector('p.c-track__title')) != null ?
							ref.textContent.trim().replace(/\s+/g, ' ') : undefined,
							track_artists: trackArtist.length > 0 && (isVA || !trackArtist.equalCaselessTo(artist)) ?
								trackArtist : undefined,
							composers: composer.length > 0 ? composer : undefined,
							conductors: workConductors.length > 0 ? workConductors : undefined,
							performers: performers,
							duration: (ref = node.querySelector('div.c-track__duration')) != null ?
								timeStringToTime(ref.lastChild.textContent) : undefined,
							description: description.collapseGaps(),
							url: response.finalUrl,
							cover_url: imgUrl,
							identifiers: mergeIds(),
						})));
					}

					if (/*!div.classList.contains('has--tracks')*/div.querySelector('div.c-tracklist__initial-tracks') == null) {
						discNumber = discSubtitle = undefined;
						addTracks('div.c-track');
					} else {
						if ((ref = div.querySelector('div.c-track p.c-track__title')) != null) {
							discSubtitle = ref.textContent.trim().replace(/\s+/g, ' ');
							guessDiscNumber();
						} else {
							discNumber = discSubtitle = undefined;
							console.warn('Presto Music work title missing:', div);
						}
						addTracks('div.c-tracklist__initial-tracks > div.c-track, div.c-tracklist__remaining-tracks > div.c-track');
					}
				});
				return finalizeTracks();
			}); else if (url.hostname.endsWith('discogs.com') && /\/(release|master|artist|label|user)s?\/(?:view\/)?(\d+)\b/i.test(url.pathname)) {
				if (['artist', 'label', 'user'].includes(RegExp.$1))
					return Promise.reject('Discogs ' + RegExp.$1 + 's not parseable');
				if (RegExp.$1 == 'master') return Promise.reject('Discogs masters as source aren\'t supported, pick a specific release');
				return queryDiscogsAPI('releases/' + RegExp.$2).then(function(release) {
					function getArtists(root, anv = false) {
						if (!root || typeof root != 'object') throw 'getArtists: invalid root';
						const roleParsers = [
							/*  1 */ [/^(?:Feat(?:uring)?|Ft|F\.\/|With)\b/i, anv],
							/*  2 */ [/^(?:Remix(?:ed[\s\-]By|er)?)\b/i, anv],
							/*  3 */ [/^(?:(?:Written|Composed|Libretto|Music)[\s\-]By|Composer|(?:Composer)?Lyricist|Writer|Author)\b/i, false],
							/*  4 */ [/^(?:Conducted[\s\-]By|Conductor|(?:Chorus\s|Choir)Master)\b/i, anv],
							/*  5 */ [/^(?:Compiled[\s\-]By|Compiler)\b/i, anv],
							/*  6 */ [/^(?:Produced[\s\-]By|Producer)\b/i, anv],
							/*  7 */ [/^(?:(?:Mixed)[\s\-]By|Mixer)\b/i, anv],
							/*  8 */ [/^(?:(?:Arranged)[\s\-]By|Arranger)\b/i, anv],
							/*  9 */ [/^(?:Ensemble|Orchestra|Choir|Performer|Musician|(?:Backing\s)?Vocals|Solo\sVocal|Voice|(?:\w+\s)?Guitar|(?:\w+\s)?Bass|Piano|Drums|Percussion|Timpani|Shaker|Synthesizer|Synth|Keyboards|(?:\w+\s)?Saxophone|Trumpet|Banjo|Harmonica|Accordion|Harmonium|Organ|Violin|Viola|Cello|Clarinet|Trombone|Glockenspiel|Vibraphone|Fiddle|Cornet\Star|Tambourine|Loops|Mellotron|Tabla|Saw|Congas|Bongos|Flute|Harp|Tambura|Flute|Sarangi|Cabasa|Handclaps|Kalimba|Vocoder|Sounds|Whistling|Other)\b/i, anv],
							/* 10 */ [/^(?:(?:Written|Composed)[\s\-]By|Composer|Lyricist|Writer)\b/i, true],
						];
						let artists = [ ], index = 0;
						for (let ndx = 0; ndx <= roleParsers.length; ++ndx) artists[ndx] = [ ];
						if (Array.isArray(root.artists)) root.artists.forEach(function(artist) {
							artists[/^(?:conduct(?:s|ing))$/i.test(artist.join) ? 4 : index]
								.push((anv && artist.anv || artist.name).replace(...artistIndexRemover));
							if (/^(?:feat(?:uring)?|ft|with)\b/i.test(artist.join)) index = 1;
						});
						if (Array.isArray(root.extraartists)) roleParsers.forEach(function(def, index) {
							artists[index + 1].pushUniqueCaseless(...root.extraartists
								.filter(extraArtist => extraArtist.role.split(/\s*,\s+/).some(role => def[0].test(role)))
								.map(extraArtist => (def[1] && extraArtist.anv || extraArtist.name || '').replace(...artistIndexRemover)));
						});
						if (artists[0].length <= 0 && artists[1].length > 0) artists[0] = artist[0];
						return artists;
					}
					function interpolateBBCode(source) {
						if (!source || !(source = source.trim())) return Promise.resolve(source);
						const origin = 'https://www.discogs.com', entryTypes = { a: 'artist', r: 'release', m: 'master', l: 'label', u: 'user' };
						const nameNormalizer = name => name && name.replace(/[\x00-\x1f]+/g, '').trim().replace(/\s+/g, ' ').replace(/\s+\(\d+\)$/, '');
						return (function(body, replacer) {
							if (typeof body != 'string' || typeof replacer != 'function') throw 'Invalid argument';
							body = body.replace(/\[([armlu])=([^\[\]\r\n]+)\]/ig,
								(match, key, id) => !/^\d+$/.test(id) ? replacer(key, id, nameNormalizer(id)) : match);
							let lookupWorkers = [ ], match;
							const entryExtractor = /\[([armlu])=?(\d+)\]/ig;
							while ((match = entryExtractor.exec(body)) != null) {
								const en1 = { key: match[1].toLowerCase(), id: parseInt(match[2]) };
								if (!lookupWorkers.some(en2 => en2.key == en1.key && en2.id == en1.id)) lookupWorkers.push(en1);
							}
							return (lookupWorkers = lookupWorkers.map(entry => queryDiscogsAPI(`${entryTypes[entry.key]}s/${entry.id}`).then(result => ({
								key: entry.key,
								id: entry.id,
								resolvedId: result.id,
								name: (result.name ? nameNormalizer(result.name) : result.title.trim()),
							}), function(reason) {
								console.warn(`Discogs lookup for ${entry.key}${entry.id} failed:`, reason);
								return null;
							}))).length > 0 ? Promise.all(lookupWorkers).then(function(entries) {
								if ((entries = entries.filter(Boolean)).length > 0) return entries;
								return Promise.reject('No entries were resolved');
							}).then(entries => Object.assign.apply({ }, Object.keys(entryTypes).map(key => ({ [key]: (function() {
								const items = entries.filter(entry => entry.key == key).map(entry => ({ [entry.id]: entry.name }));
								return items.length > 0 ? Object.assign.apply({ }, items) : { };
							})() })))).then(lookupTable => body.replace(entryExtractor, function(match, key, id) {
								const name = lookupTable[key = key.toLowerCase()][id = parseInt(id)];
								if (!name) console.warn('Discogs item not resolved:', match);
								return replacer(key, id, name);
							})) : Promise.resolve(body);
						})(source, function(key, id, caption) {
							if (!key || !id) throw 'Invalid argument';
							const link = (caption = key + id) =>
								`[url=${encodeURI(`${origin}/${entryTypes[key]}/${id}`)}][plain]${caption}[/plain][/url]`;
							if (caption) switch (key = key.toLowerCase()) {
								case 'a': return `[artist]${nameNormalizer(caption)}[/artist]${link('')}`;
								// case 'l': return `[url=${document.location.origin}/torrents.php?${new URLSearchParams({
								// 		action: 'advanced',
								// 		remasterrecordlabel: nameNormalizer(caption),
								// 	}).toString()}]${nameNormalizer(caption)}[/url]${link('')}`;
								// case 'm': case 'r': return `[url=${document.location.origin}/torrents.php?${new URLSearchParams({
								// 		action: 'advanced',
								// 		groupname: nameNormalizer(caption),
								// 	}).toString()}]${nameNormalizer(caption)}[/url]${link('')}`;
							}
							return link(caption);
						}).catch(function(reason) {
							console.warn('dcResolveLinks:', reason);
							return source;
						}).then(source => [
							[/\[url=([^\[\]\r\n]+)\]([^\[\]\r\n]*)\[\/url\]/ig, function(m, url, caption) {
								try {
									url = new URL(url.trim(), origin);
									return `[url=${url.href}]${caption || url.href}[/url]`;
								} catch(e) { console.warn('Invalid Discogs link:', url) }
								return caption || url.trim();
							}], [/\[url\]([^\[\]\r\n]+)\[\/url\]/ig, function(m, url) {
								try {
									url = new URL(url.trim(), origin);
									return `[url]${url.href}[/url]`;
								} catch(e) { console.warn('Invalid Discogs link:', url) }
								return url.trim();
							}], [/\[img=([^\[\]\r\n]+)\]/ig, (m, url) => `[img]${url.trim()}[/img]`],
							[/\[t=?(\d+)\]/ig, '[url=' + origin + '/help/forums/topic?topic_id=$1]topic $1[/url]'],
							[/\[g=?([^\[\]\r\n]+)\]/ig, '[url=' + origin + '/help/guidelines/$1]guideline $1[/url]'],
							[/[ \t]+$/gm, ''], [/(?:\r?\n){2,}/g, '\n\n'],
						].reduce((str, substitution) => str.replace(...substitution), source));
					}


					if (prefs.diag_mode) console.debug('Discogs release', release.id, 'metadata received:', release);
					const artistIndexRemover = [/\s*\(\d+\)$/, ''];
					const editionTests = [
						/^(?:Re[/-]?master(?:ed)|Re[/-]?masterizado|Re[/-]?masterisée|Enhanced|Extended)\b/i,
						/^(?:Reissue|Repress|Promo|(?:Partially\s)?Mixed|Numbered|Misprint|Mispress|\w+\sPressing|Advance|Single\s(?:Sided)|Etched|Card\sBacked)$/i,
						/\b(?:Unofficial)\b/i,
						/\b(?:Edition|Release)$/i,
					];
					identifiers.DISCOGS_ID = release.id;
					let master = release.master_id ? queryDiscogsAPI('masters/' + release.master_id).then(function(master) {
						if (prefs.diag_mode) console.debug('Discogs master', master.id, 'metadata received:', master);
						return master;
					}) : Promise.resolve(null);
					artist = getArtists(release, true);
					isVA = artist[0].length <= 0 || vaParser.test(artist[0][0])
					label = [ ]; catalogue = [ ];
					release.labels.forEach(function(lbl) {
						if (lbl.entity_type != 1) return;
						if (lbl.name) label.pushUniqueCaseless(lbl.name.replace(...artistIndexRemover));
						if (lbl.catno && !/^(?:none)$/.test(lbl.catno)) catalogue.pushUniqueCaseless(lbl.catno);
					});
					description = '';
					// if (Array.isArray(release.companies) && release.companies.length > 0) {
					// 	description = '[b]Companies, etc.[/b]\n';
					// 	let type_names = new Set(release.companies.map(it => it.entity_type_name));
					// 	type_names.forEach(function(type_name) {
					// 		description += '\n' + type_name + ' – ' + release.companies
					// 			.filter(it => it.entity_type_name == type_name)
					// 			.map(function(it) {
					// 				let result = it.name.replace(...artistIndexRemover).bbUrl(discogsOrigin + '/label/' + it.id);
					// 				if (it.catno) result += ' – ' + it.catno;
					// 				return result;
					// 			}).join(', ');
					// 	});
					// }
					if (Array.isArray(release.extraartists) && release.extraartists.length > 0) {
						description += '\n\n[b]Credits[/b]\n';
						let roles = new Set(release.extraartists.map(it => it.role));
						roles.forEach(function(role) {
							description += '\n' + role + ' – ' + release.extraartists.filter(artist => artist.role == role).map(function(artist) {
								let result = (artist.anv || artist.name).replace(...artistIndexRemover).bbArtist() +
									'‎'.bbUrl(`${discogsOrigin}/artist/${artist.id}`);
								if (artist.tracks) result += ' (tracks: ' + artist.tracks + ')';
								return result;
							}).join(', ');
						});
					}
					if (description) description = interpolateBBCode(description);
					const releaseDescription = interpolateBBCode([
						'identifiers' in release && release.identifiers.length > 0 ?
							'[b]Barcode and Other Identifiers[/b]\n\n' + release.identifiers.map(function(identifier) {
								if (!identifier.value) return;
								let type = identifier.type;
								if (identifier.description) type += ' (' + identifier.description + ')';
								return type + ': ' + identifier.value;
							}).filter(Boolean).join('\n') : undefined,
						'notes' in release && release.notes.trim() ? '[b]Notes[/b]\n\n' + release.notes.trim() : undefined,
					].filter(Boolean).join('\n\n'));
					[
						['Single', 'Single', 'Maxi-Single', 'Maxi'],
						['EP', 'EP'],
						['Album', 'Album', 'LP', 'MiniAlbum'],
						//['Anthology', 'Compilation', 'Box Set'],
						['Compilation', 'Sampler'],
						['Mixtape', 'Mixtape'],
					].forEach(function(k) {
						if (release.formats.every(format => format.name == 'All Media' || Array.isArray(format.descriptions)
							&& k.slice(1).some(k => format.descriptions.includesCaseless(k)))) identifiers.RELEASETYPE = k[0];
					});
					const channelModes = [ ];
					[
						['mono', 'Mono'],
						['stereo', 'Stereo'],
						['Quadraphonic', '4.0'],
					].forEach(function(k) {
						release.formats.forEach(function(format) {
							if (!Array.isArray(format.descriptions)) return;
							if (k.slice(1).some(k => format.descriptions.includesCaseless(k))) channelModes.pushUnique(k[0]);
						});
					});
					for (let id of release.identifiers)
						identifiers[id.type.toUpperCase().replace(/\s*\/\s*/g, '-').replace(/\W+/g, '_')] = id.value;
					const editionDescriptors = [ ];
					media = new Set();
					release.formats.forEach(function(format) {
						if (editionTests.some(rx => rx.test(format.text))) editionDescriptors.push(format.text);
						if (Array.isArray(format.descriptions)) format.descriptions.forEach(function(descriptions) {
							if (editionTests.some(rx => rx.test(descriptions))) editionDescriptors.push(descriptions);
						});
						if (format.name == 'All Media') return;
						let _media = estimateMedia(format.name);
						if (_media) media.add(_media);
						if (!/\b(?:File)\b/.test(format.name)) return;
						if ([
							'FLAC', 'WAV', 'AIF', 'AIFF', 'AIFC', 'PCM', 'ALAC', 'APE', 'WavPack', 'DFF', 'DSD',
						].some(k => format.descriptions.includes(k))) {
							encoding = 'lossless'; format = 'FLAC';
						} else if (format.descriptions.includes('MP3')) {
							encoding = 'lossy'; format = 'MP3'; bitdepth = undefined;
							if (/\b(\d+)\s*kbps\b/i.test(format.text)) bitrate = parseInt(RegExp.$1);
						} else if (format.descriptions.includes('AAC')) {
							encoding = 'lossy'; format = 'AAC'; bitdepth = undefined;
							if (/(\d+)\s*kbps\b/i.test(format.text)) bitrate = parseInt(RegExp.$1);
						} else if (['AMR', 'MP2', 'ogg-vorbis', 'Opus', 'SHN', 'WMA'].some(k => formatformat.descriptions.includes(k)))
							encoding = 'lossy';
					});
					function trackCounter(root) {
						return Array.isArray(root) ? root.reduce(function(acc, track) {
							switch (track.type_) {
								case 'track': var count = Number(track.position != 'Video'); break;
								case 'index': count = trackCounter(track.sub_tracks); break;
							}
							return acc + (count || 0);
						}, 0) : 0;
					}
					totalTracks = trackCounter(release.tracklist);
					return Promise.all([master.catch(function(reason) {
						console.debug('Discogs master not received:', reason);
						if (prefs.messages_verbosity >= 1) addMessage(reason, 'notice');
						return null;
					}), description, releaseDescription]).then(function([master, description, releaseDescription]) {
						if (release.master_id > 0) {
							const masterUrl = 'Discogs'.bbUrl('https://www.discogs.com/master/' + release.master_id);
							if (description) description += '\n\n' + masterUrl; else description = masterUrl;
						}
						let tags = new TagManager;
						if (Array.isArray(release.genres)) tags.add(...release.genres);
						if (Array.isArray(release.styles)) tags.add(...release.styles);
						if (master) {
							if (Array.isArray(master.genres)) tags.add(...master.genres);
							if (Array.isArray(master.styles)) tags.add(...master.styles);
						}
						imgUrl = (master && master.images || [ ]).concat(release.images || [ ]).filter(image =>
							httpParser.test(image.resource_url || image.uri) && ['primary', 'front'].includes(image.type));
						return (imgUrl.length > 0 ? getDiscogsImageMax(imgUrl[0].resource_url || imgUrl[0].uri)
								.catch(reason => undefined) : Promise.resolve(undefined)).then(function(imgUrl) {
							let trackCounter = 0, discCounter = 0, _media;
							release.tracklist.forEach(function(track) {
								switch (track.type_.toLowerCase()) {
									case 'heading':
										discSubtitle = track.title;
										break;
									case 'track':
										if (track.position != 'Video') addTrack(track);
										break;
									case 'index':
										if (track.sub_tracks.every(subTrack => /^\s*[CDILMVX]+(?:[\:\.]| -)?\s+/.test(subTrack.title))
												|| track.sub_tracks.every(subTrack => /^\s*\d+(?:[\:\.]| -)?\s+/.test(subTrack.title)))
											track.sub_tracks.forEach(function(subTrack) {
												subTrack.title = subTrack.title.replace(/^\s*[CDILMVX\d]+(?:[\:\.]| -)?\s+/, '');
											});
										track.sub_tracks.filter(subTrack => subTrack.type_ == 'track' && subTrack.position != 'Video').map(function(subTrack, index) {
											if (subTrack.position) var position = subTrack.position;
											subTrack.title = (/*position || */convertToRoman(index + 1)).toString() + '. ' + subTrack.title.trim();
											if (track.title) subTrack.title = track.title + ': ' + subTrack.title;
											subTrack = Object.assign({}, track, subTrack);
											//delete subTrack.position;
											delete subTrack.sub_tracks;
											return subTrack;
										}).forEach(addTrack);
										break;
								}
							});
							return tracks;

							function addTrack(track) {
								if (track.type_ != 'track' || track.position == 'Video') return;
								trackIdentifiers = {};
								++trackCounter;
								//matches = /^(([A-Z]+)?(\d+)?)[\-\.](\S+)$/.exec(track.position);
								matches = /^(?:([A-Z]{2,}|MP[234]|M4A)[\ \-\.]?)?(?:(\d+)[\ \-\.])?([A-Z]?\d+(?:\.(?:[a-z]|\d+))?)$/i.exec(track.position);
								if (matches != null && (matches[1] || matches[2])) {
									const mediaId = (matches[1] || '') + (matches[2] || '');
									if (_media == undefined || mediaId != _media) ++discCounter;
									if (matches[1]) trackIdentifiers.VOL_MEDIA = matches[1] + (matches[2] || discCounter);
									if (matches[2]) discNumber = parseInt(matches[2]);
									trackNumber = matches[3];
									_media = mediaId;
								} else {
									if (_media == undefined || _media != '') ++discCounter;
									trackNumber = track.position || trackCounter;
									_media = '';
								}
								const trackArtists = getArtists(track, true);
								trackArtist = isVA || !artistsMatch(trackArtists, artist);
								let trackPerformers = trackArtists[0].concat(trackArtists[1]);
								if (Array.isArray(track.extraartists)) trackPerformers.pushUniqueCaseless(...track.extraartists
									.map(performer => (performer.anv || performer.name).replace(...artistIndexRemover)));
								tracks.push({
									artist: isVA ? VA : undefined,
									artists: !isVA ? artist[0] : undefined,
									featured_artists: !isVA && artist[1].length > 0 ? artist[1] : undefined,
									album: release.title,
									album_year: master ? master.year : undefined,
									release_date: release.released,
									label: label.join(' / ') || undefined,
									catalog: catalogue.join(' / ') || undefined,
									country: release.country,
									encoding: media.size == 1 ? encoding : undefined,
									codec: media.size == 1 ? format : undefined,
									bitrate: media.size == 1 ? bitrate : undefined,
									bitdepth: media.size == 1 ? bitdepth : undefined,
									channel_mode: channelModes.length == 1 ? channelModes[0] : undefined,
									media: media.size == 1 ? media.keys().next().value : undefined,
									genre: tags.toString(),
									disc_number: discCounter, //discNumber,
									total_discs: Math.max(release.format_quantity, 1),
									disc_subtitle: discSubtitle,
									edition_title: editionDescriptors.join(' / ') || undefined,
									series: release.series || undefined,
									track_number: trackNumber,
									total_tracks: totalTracks,
									title: track.title.trim(),
									track_artists: trackArtist ? trackArtists[0] : undefined,
									track_guests: trackArtist ? trackArtists[1] : undefined,
									composers: role(3, true),
									conductors: role(4, true),
									compilers: role(5, true),
									remixers: role(2),
									producers: role(6, true),
									mixers: role(7),
									arrangers: role(8, true),
									performers: role(9, true), //trackPerformers,
									duration: timeStringToTime(track.duration) || undefined,
									description: description,
									release_description: releaseDescription && releaseDescription.collapseGaps() || undefined,
									identifiers: mergeIds(),
									//url: release.uri,
									cover_url: imgUrl,
								});

								function role(index, defaultToAlbumArtist = false) {
									return trackArtists[index].length > 0 ? trackArtists[index]
										: defaultToAlbumArtist && artist[index].length > 0 ? artist[index] : undefined;
								}
							}
						});
					});
				});
			} else if (url.hostname.endsWith('supraphonline.cz')) {
				url.search = '';
				return globalXHR(url).then(function(response) {
					if (/\/album\/(\d+)\b/i.test(response.finalUrl)) identifiers.SUPRAPHONLINE_ID = parseInt(RegExp.$1);
					artist = Array.from(response.document.querySelectorAll('div.visible-lg-block > h2.album-artist > a'))
						.map(a => a.title || a.textContent.trim());
					isVA = (ref = response.document.querySelector('span[itemprop="byArtist"] > meta[itemprop="name"]')) != null ?
						vaParser.test(ref.content) : artist.length <= 0;
					if ((ref = response.document.querySelector('h1[itemprop="name"]')) != null) album = ref.firstChild.data.trim();
					if ((ref = response.document.querySelector('meta[itemprop="numTracks"]')) != null)
						totalTracks = parseInt(ref.content);
					genres = (ref = response.document.querySelector('meta[itemprop="genre"]')) != null ? ref.content : undefined;
					if ((ref = response.document.querySelector('li.album-version > div.selected > div')) != null) {
						if (/\b(?:MP3)\b/.test(ref.textContent)) {
							media = 'WEB'; encoding = 'lossy'; format = 'MP3';
						}
						if (/\b(?:FLAC)\b/.test(ref.textContent)) {
							media = 'WEB'; encoding = 'lossless'; format = 'FLAC'; bitdepth = 16;
						}
						if (/\b(?:Hi[\s\-]*Res)\b/.test(ref.textContent)) {
							media = 'WEB'; encoding = 'lossless'; format = 'FLAC'; bitdepth = 24;
						}
						if (/\b(?:CD)\b/.test(ref.textContent)) media = 'CD';
						if (/\b(?:LP)\b/.test(ref.textContent)) media = 'Vinyl';
					}
					const copyrightParser = /^(?:\([PC]\)|℗|©)$/i;
					response.document.querySelectorAll('ul.summary > li').forEach(function(li) {
						if (li.childElementCount <= 0) return;
						let key = li.firstElementChild.textContent, value = li.lastChild.textContent.trim();
						if (key.includes('Nosič')) media = value;
						if (key.includes('Datum vydání')) releaseDate = normalizeDate(value, 'cs');
						if (key.includes('První vydání')) albumYear = extractYear(value);
						if (key.includes('Žánr')) genres = translateGenre(value);
						if (key.includes('Vydavatel')) label = value;
						if (key.includes('Katalogové číslo')) catalogue = value;
						if (key.includes('Formát')) {
							if (/\b(?:FLAC|WAV|AIFF?)\b/.test(value)) { encoding = 'lossless'; format = 'FLAC' }
							if (/\b(\d+)[\-\s]?bits?\b/i.test(value)) bitdepth = parseInt(RegExp.$1);
							if (/\b([\d\.\,]+)[\-\s]?kHz\b/.test(value)) samplerate = parseFloat(RegExp.$1.replace(',', '.')) * 1000;
						}
						//if (key.includes('Celková stopáž')) totalTime = timeStringToTime(value);
						if (copyrightParser.test(key) && !albumYear) albumYear = extractYear(value);
					});
					const creators = ['autoři', 'interpreti', 'tělesa', 'digitalizace'];
					let artists = [ ], ndx;
					for (let i = 0; i < creators.length; ++i) artists[i] = {};
					response.document.querySelectorAll('ul.sidebar-artist > li').forEach(function(it) {
						if ((ref = it.querySelector('h3')) != null) {
							ndx = undefined;
							creators.forEach((it, _ndx) => { if (ref.textContent.includes(it)) ndx = _ndx });
						} else {
							if (typeof ndx != 'number') return;
							if (ndx == 2) var role = 'ensemble';
							else if ((ref = it.querySelector('span')) != null) role = translateRole(ref);
							if ((ref = it.querySelector('a')) != null) {
								if (!Array.isArray(artists[ndx][role])) artists[ndx][role] = [];
								artists[ndx][role].pushUnique([ref.textContent.trim(), url.origin + ref.pathname]);
							}
						}
					});
					getDescription(response, 'div[itemprop="description"] p', true);
					composer = [ ];
					let performers = [ ], conductor = [ ], DJs = [ ], albumGuests = [ ], volMedia;
					function dumpArtist(ndx, role) {
						if (!role || role == 'undefined') return;
						if (description.length > 0) description += '\n' ;
						if (!prefs.colorless_tracklist && prefs.tracklist_artist_color)
							description += '[color=' + prefs.tracklist_artist_color + ']';
						description += role;
						if (!prefs.colorless_tracklist && prefs.tracklist_artist_color) description += '[/color]';
						description += ' – ';
						//description += artists[ndx][role].map(artist => '[artist]' + artist[0] + '[/artist]').join(', ');
						description += artists[ndx][role].map(artist => artist[0].bbUrl(artist[1])).join(', ');
					}
					for (let i = 1; i < 3; ++i) Object.keys(artists[i]).forEach(function(role) { // performers
						let a = artists[i][role].map(a => a[0]);
						([
							'conductor', 'choirmaster', 'director',
						].includes(role) ? conductor : role == 'DJ' ? DJs : [
							'FeaturedArtist',
						].includes(role) ? albumGuests : artist).pushUnique(...a);
						if (i != 2) dumpArtist(i, role);
					});
					Object.keys(artists[0]).forEach(function(role) { // composers
						composer.pushUnique(...artists[0][role].map(it => it[0]).filter(it => ![
							pseudoArtistParsers[0],
							pseudoArtistParsers[1],
							pseudoArtistParsers[4],
						].some(rx => rx.test(it))));
						dumpArtist(0, role);
					});
					Object.keys(artists[3]).forEach(role => { dumpArtist(3, role) }); // ADC & mastering
					if ((ref = response.document.querySelector('div.sidebar div.sexycover > div.btn-group > button:last-of-type')) != null
							&& /^(?:coverzoom):(\S+)\$$/.test(ref.dataset.plugin)
							&& (ref = ref.parentNode.querySelector('script[type="data-plugin/' + RegExp.$1 + '"]')) != null)
						imgUrl = 'https://www.supraphonline.cz' + eval(ref.text);
					else if ((ref = response.document.querySelector('meta[itemprop="image"]')) != null)
						imgUrl = ref.content.replace(/\?.*$/, '');
					response.document.querySelectorAll('table.table-tracklist > tbody > tr').forEach(function(tr, index) {
						if (tr.classList.contains('cd-header') && (ref = tr.querySelector('td > h3')) != null
								&& /\b(?:(\S*?)\s*)?(\d+)\b/.test(ref.textContent)) {
							volMedia = RegExp.$1 ? RegExp.lastMatch : undefined;
							discNumber = parseInt(RegExp.$2) || undefined;
						}
						if (tr.classList.contains('song-header') && (ref = tr.querySelector('td')) != null)
							discSubtitle = ref.title || ref.textContent.trim();
						if (tr.classList.contains('track') && tr.id) {
							trackIdentifiers = {
								TRACK_ID: /^(?:track)-(\d+)$/i.test(tr.id) ? parseInt(RegExp.$1) : undefined,
							};
							if (volMedia) trackIdentifiers.VOL_MEDIA = volMedia;
							let track = {
								artist: isVA ? VA : undefined,
								artists: !isVA && artist.length > 0 ? artist : undefined,
								//featured_artists: albumGuests.length > 0 ? albumGuests : undefined,
								album: album,
								album_year: /*trackYear || */albumYear || undefined,
								release_date: releaseDate,
								label: label,
								catalog: catalogue,
								encoding: encoding,
								codec: format,
								bitdepth: bitdepth,
								samplerate: samplerate || undefined,
								media: media,
								genre: genres,
								disc_number: discNumber,
								total_discs: totalDiscs,
								disc_subtitle: discSubtitle,
								track_number: /^\s*(\d+)\.?\s*$/.test(tr.children[0].firstChild.textContent) ?
								parseInt(RegExp.$1) || RegExp.$1 : undefined,
								total_tracks: totalTracks,
								title: (ref = tr.querySelector('meta[itemprop="name"][content]')) != null ? ref.content
									: (ref = tr.querySelector('td > a.trackdetail')) != null ? ref.textContent.trim() : undefined,
								performers: performers.length > 0 ? performers : undefined,
								composers: composer.length > 0 ? composer : undefined,
								conductors: conductor.length > 0 ? conductor : undefined,
								compilers: DJs.length > 0 ? DJs : undefined,
								duration: durationFromMeta(tr),
								url: response.finalUrl,
								description: description,
								identifiers: mergeIds(),
								cover_url: imgUrl,
							};
							tracks.push((function() {
								let ref = tr.querySelector('td > a.trackdetail');
								if (ref == null) return Promise.reject('link not found');
								return globalXHR(url.origin + ref.pathname + ref.search).then(function(response) {
									let detail = response.document.querySelector('div[data-swap="trackdetail-' +
										track.identifiers.TRACK_ID + '"] > div > div.row');
									if (detail == null) return Promise.reject('element not found');
									detail.querySelectorAll('div[class]:nth-of-type(1) > ul > li').forEach(function(li) {
										let key = li.querySelector('span'), value = li.lastChild;
										if (key == null || value.nodeType != Node.TEXT_NODE) return;
										key = key.textContent.trim(); value = value.wholeText.trim();
										if (!key || !value) return;
										if (key.startsWith('Žánr')) track.genre = value;
										if (key.startsWith('Nahrávka dokončena')) track.rec_year = extractYear(value);
										if (key.startsWith('Místo nahrání')) track.venue = value;
										if (key.startsWith('Rok prvního vydání')) track.pub_year = extractYear(value);
										if (copyrightParser.test(key)) track.copyright = value;
									});
									let trackArtists = [];
									for (let i = 0; i < 9; ++i) trackArtists[i] = [ ];
									detail.querySelectorAll('div[class]:nth-of-type(2) > ul > li').forEach(function(li) {
										let role = li.querySelector('span');
										let artists = Array.from(li.getElementsByTagName('A')).map(a => a.textContent.trim()).filter(artist => ![
											pseudoArtistParsers[0],
											pseudoArtistParsers[1],
											pseudoArtistParsers[4],
										].some(rx => rx.test(artist)));
										if (role != null && artists.length > 0) role = translateRole(role); else return;
										if (artistClassParsers[2].some(rx => rx.test(role)))
											trackArtists[2].pushUnique(...artists);
										else if (artistClassParsers[3].some(rx => rx.test(role)))
											trackArtists[3].pushUnique(...artists);
										else if (artistClassParsers[5].some(rx => rx.test(role)))
											trackArtists[5].pushUnique(...artists);
										else if (artistClassParsers[6].some(rx => rx.test(role)))
											trackArtists[6].pushUnique(...artists);
										else if (artistClassParsers[8].some(rx => rx.test(role)))
											trackArtists[7].pushUnique(...artists);
										else if (role.toLowerCase() == 'performer' || !artistClassParsers[9].some(rx => rx.test(role))) {
											if (artistClassParsers[0].some(rx => rx.test(role)))
												trackArtists[0].pushUnique(...artists);
											else if (artistClassParsers[1].some(rx => rx.test(role)))
												trackArtists[1].pushUnique(...artists);
											else if (artistClassParsers[4].some(rx => rx.test(role)))
												trackArtists[4].pushUnique(...artists);
											else artists.forEach(_artist => {
												if (artist.includesCaseless(_artist)) trackArtists[0].pushUnique(_artist);
													else if (artistClassParsers[7].some(rx => rx.test(role))) trackArtists[1].pushUnique(_artist);
											});
											trackArtists[8].pushUnique(...artists.map(artist => artist + ' (' + role + ')'));
										}
									});
									if (trackArtists[1].length > 0 && trackArtists[0].length <= 0) {
										trackArtists[0] = trackArtists[1]; trackArtists[1] = [];
									}
									if (trackArtists[0].length > 0 && (isVA || !trackArtists[0].equalCaselessTo(artist)
											|| trackArtists[1].length > 0/*!trackArtists[1].equalCaselessTo(albumGuests)*/)) {
										track.track_artists = trackArtists[0];
										if (trackArtists[1].length > 0) track.track_guests = trackArtists[1];
									}
									[
										[3, 'composer'],
										[4, 'conductor'],
										[2, 'remixer'],
										[5, 'compiler'],
										//[6, 'producer'],
										[7, 'arranger'],
										[8, 'performer'],
									].forEach(def => { if (trackArtists[def[0]].length > 0) track[def[1] + 's'] = trackArtists[def[0]] })
									return track;
								});
							})().catch(function(reason) {
								console.error('Supraphonline parser failed to get track', index + 1, 'detail:', reason);
								return track;
							}));
						} // track
					});
					return Promise.all(tracks);

					function translateGenre(genre) {
						if (!genre || typeof genre != 'string') return undefined;
						[
							['Orchestrální hudba', 'Orchestral Music'],
							['Komorní hudba', 'Chamber Music'],
							['Vokální', 'Classical, Vocal'],
							['Klasická hudba', 'Classical'],
							['Melodram', 'Classical, Melodram'],
							['Symfonie', 'Symphony'],
							['Vánoční hudba', 'Christmas Music'],
							[/^(?:Alternativ(?:ní|a))$/i, 'Alternative'],
							['Dechová hudba', 'Brass Music'],
							['Elektronika', 'Electronic'],
							['Folklor', 'Folclore, World Music'],
							['Instrumentální hudba', 'Instrumental'],
							['Latinské rytmy', 'Latin'],
							['Meditační hudba', 'Meditative'],
							['Vojenská hudba', 'Military Music'],
							['Pro děti', 'Children'],
							['Pro dospělé', 'Adult'],
							['Mluvené slovo', 'Spoken Word'],
							['Audiokniha', 'audiobook'],
							['Humor', 'humour'],
							['Pohádka', 'Fairy-Tale'],
						].forEach(function(subst) {
							if (typeof subst[0] == 'string' && genre.toLowerCase() == subst[0].toLowerCase()
									|| subst[0] instanceof RegExp && subst[0].test(genre)) genre = subst[1];
						});
						return genre;
					}
					function translateRole(elem) {
						return elem instanceof HTMLElement ? [
							[/\b(?:klavír)\b/ig, 'piano'],
							[/\b(?:housle)\b/ig, 'violin'],
							[/\b(?:violoncello)\b/ig, 'cello'],
							[/\b(?:viola)\b/ig, 'alto'],
							[/\b(?:varhany)\b/ig, 'organ'],
							[/\b(?:cembalo)\b/ig, 'harpsichord'],
							[/\b(?:trubka)\b/ig, 'trumpet'],
							[/\b(?:soprán)\b/ig, 'soprano'],
							[/\b(?:alt)\b/ig, 'alto'],
							[/\b(?:baryton)\b/ig, 'baritone'],
							[/\b(?:bas)\b/ig, 'basso'],
							[/\b(?:akordeon)\b/ig, 'accordion'],
							[/\b(?:syntezátor)\b/ig, 'synthesizer'],
							[/\b(?:klávesové nástroje)\b/ig, 'keyboards'],
							[/\b(?:bicí)\b/ig, 'drums'],
							[/\b(?:kontrabas)\b/ig, 'double-bass'],
							[/\b(?:zpěv|vokál)\b/ig, 'vocals'],
							[/\b(?:baskytara)\b/ig, 'bass guitar'],
							[/\b(?:havajská kytara)\b/ig, 'steel guitar'],
							[/\b(?:akustická kytara)\b/ig, 'acoustic guitar'],
							[/\b(?:kytara)\b/ig, 'guitar'],
							[/\b(?:kytary)\b/ig, 'guitars'],
							[/(?:čte|četba)\b/ig, 'narration'],
							[/\b(?:vypravuje)\b/ig, 'narration'],
							[/\b(?:hudební těleso)\b/ig, 'ensemble'],
							[/\b(?:Umělec)\b/ig, 'Artist'],
							[/\b(?:improvizace)\b/ig, 'improvisation'],
							['český', 'czech'],
							['původní', 'original'],
							[/\b(?:text)\b/ig, 'lyrics'],
							[/\b(?:hudba)\b/ig, 'music'],
							['hudební', 'music'],
							[/\b(?:autor)\b/ig, 'author'],
							[/\b(?:překlad)\b/ig, 'translation'],
							['účinkuje', 'participating'],
							['hovoří a zpívá', 'speaks and sings'],
							['hovoří', 'spoken by'],
							['komentář', 'commentary'],
							[/\b(?:dirigent)\b/ig, 'conductor'],
							['řídí', 'director'],
							[/\b(?:sbormistr)\b/ig, 'choirmaster'],
							['programování', 'programming'],
							[/\b(?:produkce)\b/ig, 'produced by'],
							['nahrál', 'recorded by'],
							[/\b(?:digitální přepis)\b/ig, 'A/D transfer'],
						].reduce((r, def) => r.replace(...def), elem.textContent.trim().replace(/\s*:.*$/, '')) : undefined;
					}
				});
			} else if (url.hostname.endsWith('bontonland.cz')) return globalXHR(url).then(function(response) {
				ref = response.document.querySelector('div#detailheader > h1');
				if (ref != null && /^(.*?)\s*:\s*(.*)$/.test(ref.textContent.trim())) {
					artist = RegExp.$1;
					isVA = vaParser.test(artist);
					album = RegExp.$2;
				}
				media = 'CD';
				response.document.querySelectorAll('table > tbody > tr > td.nazevparametru').forEach(function(it) {
					if (it.textContent.includes('Datum vydání')) {
						releaseDate = normalizeDate(it.nextElementSibling.textContent, 'cs');
						albumYear = extractYear(it.nextElementSibling.textContent);
					} else if (it.textContent.includes('Nosič / počet')) {
						if (/^(.*?)\s*\/\s*(.*)$/.test(it.nextElementSibling.textContent)) {
							media = RegExp.$1;
							totalDiscs = RegExp.$2;
						}
					} else if (it.textContent.includes('Interpret')) artist = it.nextElementSibling.textContent.trim();
					else if (it.textContent.includes('EAN')) identifiers.EAN = it.nextElementSibling.textContent.trim();
				});
				getDescription(response, 'div#detailtabpopis > div[class^="pravy"] > div > p:not(:last-of-type)', true);
				if (description.startsWith('[quote]Tracklist:')) description = undefined;
				if ((ref = response.document.querySelector('a.detailzoom')) != null) imgUrl = ref.href;
				if ((ref = response.document.querySelector('img#lbImage')) != null) imgUrl = ref.src;
				if ((ref = response.document.querySelector('div#detailtabpopis > div[class^="pravy"] > div > ol')) != null) {
					return Array.from(ref.querySelectorAll('li')).map(function(track, ndx, arr) {
						title = track.innerText.trim();
						duration = undefined;
						if (/^(.*?)\s+\(((?:\d+:)?\d+:\d+)\)$/.test(title) || /^(.*?)\s+\(((?:\d+:)?\d+:\d+)\)$/.test(title)) {
							title = RegExp.$1;
							duration = timeStringToTime(RegExp.$2);
						}
						return {
							artist: isVA ? VA : artist,
							album: album,
							//album_year: extractYear(releaseDate),
							release_date: releaseDate,
							label: label,
							media: media,
							track_number: ndx + 1,
							total_tracks: arr.length,
							title: title,
							duration: duration,
							url: response.finalUrl.replace(/\?.*$/, ''),
							description: description,
							identifiers: mergeIds(),
							cover_url: imgUrl,
						};
					});
				} else if ((ref = response.document.querySelector('div#detailtabpopis > div[class^="pravy"] > div > p:last-of-type')) != null) {
					let trackList = ref.textContent.trim().split(/(?:\r?\n)+/).map(tr => tr.trim());
					trackNumber = 0;
					trackList.forEach(function(track) {
						if (!/^(?:(\d+)(?:\s*[\/\.\-\:\)])?\s+)?(.+?)(?:\s+((?:\d+:)?\d+:\d+))?$/.test(track)) return;
						++trackNumber;
						tracks.push({
							artist: isVA ? VA : artist,
							album: album,
							//album_year: extractYear(releaseDate),
							release_date: releaseDate,
							label: label,
							media: media,
							track_number: parseInt(RegExp.$1) || RegExp.$1 || trackNumber,
							total_tracks: trackList.length,
							title: RegExp.$2,
							duration: timeStringToTime(RegExp.$3) || undefined,
							url: response.finalUrl.replace(/\?.*$/, ''),
							description: description,
							identifiers: mergeIds(),
							cover_url: imgUrl,
						});
					});
					return tracks;
				} else throw 'Playlist could not be located';
			}); else if (url.hostname.endsWith('nativedsd.com')) {
				if (!url.pathname.startsWith('/catalogue/')) return Promise.reject('this page can\'t be extracted');
				return globalXHR(url).then(function(response) {
					identifiers.COMPOSEREMPHASIS = 1;
					identifiers.ORIGINALFORMAT = 'DSD';
					if ((ref = response.document.querySelector('div.product-intro-text > h3')) != null)
						artist = ref.textContent.trim();
					isVA = !artist || vaParser.test(artist);
					if ((ref = response.document.querySelector('div.product-intro-text > h1')) != null)
						album = ref.textContent.trim();
					let conductors, attributes = { };
					response.document.querySelectorAll('table.shop_attributes > tbody > tr').forEach(function(tr) {
						let key = tr.querySelector('th'), content = tr.querySelector('td > p');
						if (key == null || content == null) return;
						key = key.textContent.trim();
						switch (key.toLowerCase()) {
							case 'label':
								label = content.textContent.trim();
								break;
							case 'sku':
								catalogue = content.textContent.trim();
								break;
							case 'artists':
								artist = Array.from(content.getElementsByTagName('A')).map(a => a.textContent.trim());
								isVA = artist.length <= 0 || artist.length == 1 && vaParser.test(artist[0]);
								break;
							case 'composers':
								composer = Array.from(content.getElementsByTagName('A')).map(a => a.textContent.trim());
								break;
							case 'conductors':
								conductors = Array.from(content.getElementsByTagName('A')).map(a => a.textContent.trim());
								break;
							case 'producer':
								producer = content.textContent.trim();
								break;
							case 'genres':
								genres = Array.from(content.getElementsByTagName('A')).map(a => a.textContent.trim());
								break;
							case 'release date':
								releaseDate = content.textContent.trim();
								break;
							default:
								attributes[key] = content.textContent.trim();
						}
					});
					description = [];
					if ((ref = response.document.querySelector('div.product-single-content > div.entry')) != null)
						for (let child of ref.children) {
							if (child.tagName == 'DIV' && ['woocommerce-tabs', 'wc-tabs-wrapper']
									.some(className => child.classList.contains(className))) break;
							let p = html2php(child, response.finalUrl).trim();
							if (p) description.push(p);
						}
					description = description.join('\n\n').collapseGaps();
					if (Object.keys(attributes).length > 0) {
						if (description) description += '\n\n';
						description += Object.keys(attributes).map(key => '[b]' + key + ':[/b] ' + attributes[key]).join('\n');
					}
					if ((ref = response.document.querySelector('div.music-reviews-list')) != null) {
						if (description) description += '\n\n';
						description += html2php(ref, response.finalUrl).collapseGaps();
					}
					if (i = nativeDSDBooklets(response)) {
						if (description) description += '\n\n';
						description += i;
					}
					if ((ref = response.document.querySelector('meta[property="og:image"][content]')) != null)
						imgUrl = ref.content;
					trs = response.document.querySelectorAll('div#tracklist > div.nativedsd-player');
					return Array.from(trs).map((tr, index) => ({
						artist: isVA ? VA : typeof artist == 'string' ? artist : undefined,
						artists: !isVA && Array.isArray(artist) && artist.length > 0 ? artist : undefined,
						album: album,
						//album_year: albumYear,
						release_date: releaseDate,
						label: label,
						catalog: catalogue,
						format: 'DSD',
						//encoding: 'lossless',
						media: media,
						genre: genres.join('; '),
						disc_number: discNumber,
						total_discs: totalDiscs,
						disc_subtitle: discSubtitle,
						track_number: (ref = tr.querySelector('div.nativedsd-player-number')) != null ?
						parseInt(ref.textContent) || ref.textContent.trim() : undefined,
						total_tracks: trs.length,
						title: (ref = tr.querySelector('div.nativedsd-player-title')) != null ? ref.textContent.trim() : undefined,
						composers: Array.isArray(composer) && composer.length > 0 ? composer : undefined,
						conductors: Array.isArray(conductors) && conductors.length > 0 ? conductors : undefined,
						producer: producer,
						duration: (ref = tr.querySelector('div.nativedsd-player-duration')) != null ?
						timeStringToTime(ref.textContent) : undefined,
						url: (ref = response.document.querySelector('meta[property="og:url"][content]')) != null ?
						ref.content : response.finalUrl,
						description: description,
						identifiers: mergeIds(),
						cover_url: imgUrl,
					}));
				});
			}/* else if (url.hostname.endsWith('junodownload.com') && /\/([\d\-]+)\/?$/.test(url.pathname)) {
			let productKey = RegExp.$1;
			return globalXHR('https://www.junodownload.com/api/1.2/playlist/getplaylistdetails/?product_key='.concat(productKey), {
				responseType: 'xml',
			}).then(response => Array.from(response.document.querySelectorAll('playlist > trackList > track')).map(function(track, index, trackList) {
				artist = Array.from(track.querySelectorAll('extension > release_artists > artist > name'))
					.map(artist => artist.textContent.trim());
				isVA = artist.length == 1 && vaParser.test(artist[0]);
				trackArtist = Array.from(track.querySelectorAll('extension > artists > artist > name'))
					.map(artist => artist.textContent.trim());
				trackArtist = isVA || !trackArtist.equalCaselessTo(artist) ? joinArtists(trackArtist) : undefined;
				title = getValue('extension > track_title');
				if (getValue('extension > mix_title')) title += ' (' + getValue('extension > mix_title') + ')';
				return {
					artist: isVA ? VA : artist.join(', '),
					album: getValue('album'),
					release_date: getValue('extension > relDate'),
					label: getValue('extension > label > name'),
					catalog: getValue('extension > catNumber'),
					media: media,
					genre: getValue('extension > genre'),
					track_number: parseInt(getValue('trackNum')),
					total_tracks: trackList.length,
					title: getValue('extension > track_title'),
					track_artist: trackArtist,
					duration: parseInt(getValue('extension > length')) || undefined,
					description: getValue('extension > rating_comment'),
					identifiers: { JUNODOWNLOAD_ID: productKey },
					cover_url: getValue('image'),
				};

				function getValue(selector) {
					let node = track.querySelector(selector);
					return node != null ? node.textContent.trim() : undefined;
				}
			}));
			} */else if (url.hostname.endsWith('junodownload.com')) return globalXHR(url).then(function(response) {
				if (/'id':'([\d\-]+)'/.test(response.responseText) || /\/([\d\-]+)\/?$/.test(new URL(response.finalUrl).pathname)) {
					identifiers.JUNODOWNLOAD_ID = RegExp.$1;
					var metaData = globalXHR('https://www.junodownload.com/api/1.2/playlist/getplaylistdetails/?product_key=' +
						identifiers.JUNODOWNLOAD_ID, { responseType: 'xml' })
							.then(({responseXML}) => Array.from(responseXML.querySelectorAll('playlist > trackList > track')));
				} else metaData = Promise.reject('No Id');
				let productArtist;
				if ((ref = response.document.body.querySelector('h2.product-artist')) != null) {
					artist = Array.from(ref.getElementsByTagName('A'), a => a.textContent.trim().titleCase());
					productArtist = ref.textContent.trim().titleCase();
				} else if ((ref = response.document.body.querySelectorAll('div.breadcrumb_text > span:not([class])')).length == 4) {
					artist = Array.from(ref[ref.length - 1].querySelectorAll('a')).map(a => a.textContent.trim());
					productArtist = ref[ref.length - 1].textContent.trim();
				}
				isVA = artist.length <= 0 || artist.length == 1 && vaParser.test(artist[0]);
				if ((ref = response.document.body.querySelector('h2.product-title > a')) != null)
					album = ref.textContent.trim();
				if ((ref = response.document.body.querySelector('h3.product-label > a')) != null)
					label = ref.textContent.trim();
				if ((ref = response.document.body.querySelector('span[itemprop="datePublished"]')) != null)
					releaseDate = ref.firstChild.data.trim();
				for (let strong of response.document.body.querySelectorAll('div.mb-3 > strong')) {
					if (strong.textContent.startsWith('Genre:'))
						while ((strong = strong.nextElementSibling) != null && strong.tagName == 'A')
							genres.push(strong.textContent.trim());
					else if (strong.textContent.startsWith('Cat:'))
						if ((strong = strong.nextSibling) != null && strong.nodeType == Node.TEXT_NODE)
							catalogue = strong.textContent.trim();
				}
				getDescription(response, 'div[itemprop="review"]');
				if ((ref = response.document.querySelector('meta[property="og:image"][content]')) != null) imgUrl = ref.content;
				trs = response.document.querySelectorAll('div.product-tracklist > div[itemprop="track"]');
				return Array.from(trs).map(function(tr) {
					trackIdentifiers = { BPM: tr.children[2].textContent.trim() };
					trackNumber = undefined;
					tr.querySelector('div.track-title').childNodes.forEach(function(n) {
						if (trackNumber || n.nodeType != Node.TEXT_NODE) return;
						trackNumber = n.data.trim().replace(/\s*\..*$/, '');
					});
					trackArtist = (ref = tr.querySelector('meta[itemprop="byArtist"]')) != null ? ref.content : undefined;
					title = (ref = tr.querySelector('span[itemprop="name"]')) != null ? ref.textContent.trim() : undefined;
					if (title && trackArtist && title.startsWith(trackArtist + ' - ')) title = title.slice(trackArtist.length + 3);
					return {
						artist: isVA ? VA : productArtist,
						artists: !isVA ? artist : undefined,
						album: album,
						album_year: extractYear(releaseDate),
						release_date: releaseDate,
						label: label,
						catalog: catalogue,
						media: media,
						genre: genres.join('; '),
						disc_number: discNumber,
						total_discs: totalDiscs,
						disc_subtitle: discSubtitle,
						track_number: trackNumber,
						total_tracks: trs.length,
						title: title,
						track_artist: trackArtist && (isVA || trackArtist.toLowerCase() != productArtist.toLowerCase()) ? trackArtist : undefined,
						duration: durationFromMeta(tr),
						url: !identifiers.JUNODOWNLOAD_ID ? response.finalUrl : undefined,
						description: description,
						identifiers: mergeIds(),
						cover_url: imgUrl,
					};
				});
			}); else if (url.hostname.endsWith('hdtracks.com')) return loadHDtracksMetadata(url).then(function(album) {
				identifiers.HDTRACKS_ID = album.id || album.productId;
				if (album.upc) identifiers.UPC = album.upc;
				if (album.parentalWarning) switch (album.parentalWarning.toLowerCase()) {
					case 'noadviceavailable': identifiers.EXPLICIT = 0; break;
					case 'explicit': identifiers.EXPLICIT = 1; break;
					case 'explicitcontentedited': identifiers.EXPLICIT = 2; break;
				}
				isVA = album.artists.length <= 0 || vaParser.test(album.mainArtist);
				var guests = [ ], composers = [ ], producers = [ ];
				if (album.credits) album.credits.split(/\r?\n/).forEach(function(credit) {
					if (!/^(.*)\s*:\s*(.*)$/.test(credit)) return;
					let role = RegExp.$1, name = RegExp.$2;
					if (role == 'Artist' && name.toLowerCase() != album.mainArtist.toLowerCase()) guests.pushUniqueCaseless(name);
					else if (role == 'Composer') composers.pushUniqueCaseless(name);
					else if (/\b(?:Producer)$/.test(role)) producers.pushUniqueCaseless(name);
				});
				//let albumGuests = guests.length > 0 ? ' feat. ' + joinArtists(guests) : '';
				return Promise.all(album.trackIds.map((trackId, index) => loadHDtracksMetadata(trackId, 'track').catch(function(reason) {
					console.warn('Fetching details from HDtracks failed at least for one track:', reason);
					return album.tracks[index];
				}))).then(tracks => tracks.map(function(track) {
					trackIdentifiers = {
						ISRC: track.isrc,
						TRACK_ID: track.id,
						MD5: track.md5,
					};
					if (track.upc) trackIdentifiers.UPC = track.upc;
					var mainArtists = splitAmpersands(track.mainArtist), trackComposers = [ ], trackProducers = [ ], trackGuests = [ ];
					if (track.credits) track.credits.split(/\r?\n/).forEach(function(credit) {
						if (!/^(.*)\s*:\s*(.*)$/.test(credit)) return;
						let role = RegExp.$1, name = RegExp.$2;
						if (role == 'Artist' && !mainArtists.includesCaseless(name)) trackGuests.pushUniqueCaseless(name);
						else if (role == 'Composer') trackComposers.pushUniqueCaseless(name);
						else if (/\b(?:Producer)$/.test(role)) trackProducers.pushUniqueCaseless(name);
					});
					if (track.mainArtist && trackGuests.length > 0) track.mainArtist += ' feat. ' + joinArtists(trackGuests);
					return {
						artist: isVA ? VA : undefined,
						artists: !isVA ? album.artists : undefined,
						featured_artists: guests,
						album: album.name,
						release_date: track.release || album.release,
						album_year: album.originalRelease ? extractYear(album.originalRelease) : undefined,
						label: track.label || album.label,
						distributor: track.distributor || album.distributor,
						media: media,
						samplerate: track.rate || album.rate || undefined,
						bitdepth: track.resolution || album.resolution || undefined,
						genre: track.genre || album.genre,
						total_discs: album.discs,
						track_number: track.index,
						total_tracks: album.tracksCount, //album.tracks.length
						composers: trackComposers.length > 0 ? trackComposers : composers,
						//producers: trackProducers.length > 0 ? trackProducers : producers,
						title: track.name,
						track_artist: track.mainArtist && (isVA || !artistsMatch(track.mainArtist, album.mainArtist)) ?
						track.mainArtist : undefined,
						duration: track.duration,
						url: !identifiers.HDTRACKS_ID ? response.finalUrl : undefined,
						identifiers: mergeIds(),
						cover_url: /*track.cover || */album.cover,
					};
				}));
			}); else if (url.hostname.endsWith('deezer.com')) {
				let albumId = /\/album\/(\d+)\b/i.exec(url.pathname);
				if (albumId != null) albumId = parseInt(albumId[1]);
					else return Promise.reject('This resource is not supported, pick a real album');
				const deezerAPIv2Auth = getDeezerAPIv2Auth(), safeResolver = reason => null;
				return Promise.all([
					queryDeezerAPI('album', albumId),
					deezerAPIv2Auth.then(auth => queryDeezerAPIv2(auth, 'album.getData', { alb_id: albumId })).catch(safeResolver),
					deezerAPIv2Auth.then(auth => queryDeezerAPIv2(auth, 'song.getListByAlbum', { alb_id: albumId, nb: -1 })).catch(safeResolver),
				]).then(function(metadata) {
					if (prefs.diag_mode) console.debug('Deezer metadata loaded:', metadata);
					console.assert(metadata[2] == null || metadata[2].count == metadata[0].nb_tracks,
						'metadata[2] == null || metadata[2].count == metadata[0].nb_tracks');
					const emphasizeAllContributors = true;
					const lyricsWorkers = deezerAPIv2Auth.then(auth => Promise.all(metadata[0].tracks.data.map(track =>
							queryDeezerAPIv2(auth, 'song.getLyrics', { sng_id: track.id }).then(response =>
								Object.assign({ TRACK_ID: track.id }, response), reason => null)))).then(function(results) {
						let obj = { };
						for (let it of results) if (it && it.TRACK_ID && it.LYRICS_TEXT) obj[it.TRACK_ID] = it.LYRICS_TEXT.trim();
						return obj;
					});
					identifiers.DEEZER_ID = metadata[0].id;
					if (metadata[0].record_type && metadata[0].record_type != 'album')
						identifiers.RELEASETYPE = metadata[0].record_type;
					if (metadata[0].upc) identifiers.UPC = metadata[0].upc;
					// if (metadata[0].explicit_content_lyrics == 4) identifiers.EXPLICIT = 1;
					// 	else if (metadata[0].explicit_content_lyrics == 3) identifiers.EXPLICIT = 3;
					// 		else if (metadata[0].explicit_content_lyrics == 7) identifiers.EXPLICIT = 0;
					// 			else if (metadata[0].explicit_lyrics) identifiers.EXPLICIT = 1;

					function getArtists(root) {
						console.assert(root && typeof root == 'object', "root && typeof root == 'object'");
						let result = [ ]; for (let n = 0; n < 8; ++n) result[n] = [ ];
						if (root.contributors) for (let contributor of root.contributors)
							if (!vaParser.test(contributor.name)) switch (qbGetCategoryIndex(contributor.role)) {
								case 0: case 2: case 3: case 4: case 5: case 6: // main artist
									result[0].pushUniqueCaseless(contributor.name);
									break;
								case 7: result[1].pushUniqueCaseless(contributor.name); break; // guest
								case 11: result[2].pushUniqueCaseless(contributor.name); break; // remixer
								case 9: result[3].pushUniqueCaseless(contributor.name); break; // composer
								case 10: result[4].pushUniqueCaseless(contributor.name); break; // conductor
								case 14: result[5].pushUniqueCaseless(contributor.name); break; // compiler/DJ
								case 12: result[6].pushUniqueCaseless(contributor.name); break; // producer
							}
						return result;
					}

					artist = getArtists(metadata[0]);
					isVA = vaParser.test(metadata[0].artist.name);
					imgUrl = ['xl', 'big', 'medium', 'small'].reduce((acc, size) => acc || metadata[0]['cover_' + size], null);
					//let maxImgUrl = imgUrl ? getDeezerImageMax(imgUrl) : Promise.reject('No cover');
					imgUrl = imgUrl ? imgUrl.replace(...dzrImageMax) : undefined;
					return lyricsWorkers.catch(safeResolver).then(lyrics => metadata[0].tracks.data.map(function(track, ndx) {
						const trackV2 = metadata[2] && metadata[2].data && metadata[2].data[ndx] || undefined;
						trackIdentifiers = { TRACK_ID: track.id };
						if (trackV2 && trackV2.ISRC) trackIdentifiers.ISRC = trackV2.ISRC;
						//if (metadata[2] && metadata[2].data[ndx].MD5_ORIGIN)
						//	trackIdentifiers.MD5 = metadata[2].data[ndx].MD5_ORIGIN;
						if ('explicit_content_lyrics' in track) trackIdentifiers.EXPLICIT = Number(track.explicit_content_lyrics);
							else if ('explicit_lyrics' in track) trackIdentifiers.EXPLICIT = Number(track.explicit_lyrics);
						let trkContributors = [ ]; for (let n = 0; n < qobuzArtistLabels.length; ++n) trkContributors[n] = [ ];
						if (trackV2 && trackV2.SNG_CONTRIBUTORS) for (let role in trackV2.SNG_CONTRIBUTORS) {
							const roleIndex = qbGetCategoryIndex(role);
							if (roleIndex >= 0) trkContributors[roleIndex].pushUniqueCaseless(...trackV2.SNG_CONTRIBUTORS[role]);
						}
						trackArtist = getArtists(track);
						const getRole = (role, roleV2) => role >= 0 && trackArtist[role].length > 0 ? trackArtist[role]
							: roleV2 >= 0 && trkContributors[roleV2].length > 0 ? trkContributors[roleV2]
							: role >= 0 && artist[role].length > 0 ? artist[role] : undefined;
						const useTAs = trackArtist[0].length > 0 && artist[0].length > 0
							&& (isVA || !artistsMatch(trackArtist, artist));
						return {
							artist: isVA ? VA : emphasizeAllContributors && artist[0].length > 0 ?
								/*artist[0].join(', ')*/undefined : metadata[0].artist.name,
							artists: emphasizeAllContributors && !isVA && artist[0].length > 0 ? artist[0] : undefined,
							album: metadata[0].title,
							album_year: metadata[1] && extractYear(metadata[1].ORIGINAL_RELEASE_DATE) || undefined,
							release_date: trackV2 && trackV2.DIGITAL_RELEASE_DATE || metadata[0].release_date,
							label: metadata[0].label,
							media: media,
							genre: metadata[0].genres.data.map(it => it.name).join('; '),
							disc_number: trackV2 && parseInt(trackV2.DISK_NUMBER) || undefined,
							total_discs: metadata[1] && parseInt(metadata[1].NUMBER_DISK) || undefined,
							track_number: trackV2 && parseInt(trackV2.TRACK_NUMBER) || ndx + 1,
							total_tracks: metadata[0].nb_tracks,
							title: track.title,
							track_artist: track.artist && track.artist.name
								&& (isVA || !artistsMatch(track.artist.name, emphasizeAllContributors && artist[0].length > 0 ?
									artist : metadata[0].artist.name)) ? track.artist.name : undefined,
							track_artists: emphasizeAllContributors && useTAs ? trackArtist[0] : undefined,
							track_guests: emphasizeAllContributors && useTAs && trackArtist[1].length > 0 ? trackArtist[1] : undefined,
							remixers: getRole(2, 11),
							composers: getRole(3, 9),
							conductors: getRole(4, 10),
							compilers: getRole(5, 14),
							producers: getRole(6, 12),
							arrangers: getRole(undefined, 13),
							duration: track.duration,
							lyrics: lyrics ? lyrics[track.id] : undefined,
							filesize: trackV2 && parseInt(trackV2.FILESIZE_FLAC) || undefined,
							track_gain: trackV2 && 'GAIN' in trackV2 ? parseFloat(trackV2.GAIN) : undefined,
							url: !identifiers.DEEZER_ID ? deezerAlbumPrefix + metadata[0].id : undefined,
							identifiers: mergeIds(),
							cover_url: imgUrl,
						};
					}));
				});
			} else if (url.hostname.endsWith('spotify.com')) {
				return  /\/albums?\/(\w+)$/i.test(url.pathname) ? querySpotifyAPI('albums/' + RegExp.$1).then(function(release) {
					if (prefs.diag_mode) console.debug('Spotify metadata loaded:', release);
					identifiers.SPOTIFY_ID = release.id;
					identifiers.DURATION_PRECISION = 'ms';
					if (release.album_type && release.album_type != 'album') identifiers.RELEASETYPE = release.album_type;
					if (release.external_ids.upc) identifiers.UPC = release.external_ids.upc;
					artist = release.artists.map(artist => artist.name);
					isVA = release.artists.length <= 0 || release.artists.length == 1 && vaParser.test(release.artists[0].name);
					releaseDate = release.release_date_precision == 'year' ? extractYear(release.release_date)
						: release.release_date_precision == 'month' && /\b(\d{4}-\d{2})\b/.test(release.release_date) ? RegExp.$1
						: release.release_date;
					imgUrl = release.images.reduce((acc, image) => image.width * image.height > acc.width * acc.height ? image : acc);
					return (function() {
						if (release.tracks.items.length >= release.total_tracks) return Promise.resolve(release.tracks.items);
						let promises = [];
						for (let offset = release.tracks.offset + release.tracks.items.length; offset < release.total_tracks; offset += 50)
							promises.push(querySpotifyAPI(`albums/${release.id}/tracks`, { offset: offset, limit: 50 }).then(function(tracks) {
								if (prefs.diag_mode) console.debug('Additional Spotify tracks loaded:', tracks);
								return tracks.items;
							}));
						return Promise.all(promises).then(tracks => release.tracks.items.concat(...tracks));
					})().then(tracks => tracks.map(function(track, ndx) {
						console.assert(track.type == 'track', "track.type == 'track'", track);
						trackIdentifiers = { TRACK_ID: track.id };
						if ('explicit' in track) trackIdentifiers.EXPLICIT = Number(track.explicit);
						trackArtist = track.artists.map(artist => artist.name);
						return {
							artist: isVA ? VA : undefined,
							artists: !isVA ? artist : undefined,
							album: release.name,
							release_date: releaseDate,
							label: release.label,
							media: media,
							genre: release.genres.join('; ') || undefined,
							disc_number: track.disc_number,
							disc_subtitle: discSubtitle,
							track_number: track.track_number,
							total_tracks: release.total_tracks,
							title: track.name,
							track_artists: trackArtist.length > 0 && (isVA || !trackArtist.equalCaselessTo(artist)) ?
							trackArtist : undefined,
							duration: track.duration_ms / 1000,
							url: !identifiers.SPOTIFY_ID ? 'https://open.spotify.com/album/' + release.id : undefined,
							identifiers: mergeIds(),
							cover_url: imgUrl ? imgUrl.url : undefined,
						};
					}));
				}) : Promise.reject('This resource is not supported, pick a real album');
			} else if (url.hostname.endsWith('prostudiomasters.com')) return globalXHR(url).then(function(response) {
				if (/\/page\/(\d+)$/i.test(response.finalUrl)) identifiers.PROSTUDIOMASTERS_ID = RegExp.$1;
				if ((ref = response.document.querySelector('img.album-art')) != null) imgUrl = ref.currentSrc || ref.src;
				for (ref of response.document.getElementsByTagName('SCRIPT')) {
					var albumMeta = /^\s*(?:PSM\.album)\s*=\s*(\{.+\});\s*$/m.exec(ref.text);
					if (albumMeta != null) try {
						albumMeta = JSON.parse(albumMeta[1]);
						if (albumMeta.versions) try {
							let versions = Object.keys(albumMeta.versions),
									versionsCommonFormats = versions.filter(RegExp.prototype.test.bind(/^(?:flac|aif|wav|pcm|dsd)_/i));
							//if (versions.length > 1 && versionsCommonFormats.length > 0) versions = versionsCommonFormats;
							if (versions.length > 0) for (let key in albumMeta.versions[versions[0]]) if (!albumMeta[key]
									&& versions.every(version => albumMeta.versions[version][key] == albumMeta.versions[versions[0]][key]))
								albumMeta[key] = albumMeta.versions[versions[0]][key];
						} catch(e) { console.warn('PSM versions iteration failed:', e, albumMeta.versions) }
						if (prefs.diag_mode) console.debug('PSM metadata loaded:', albumMeta);
						break;
					} catch(e) {
						console.warn('ProStudioMasters: failed to parse PSM album:', e, albumMeta);
						albumMeta = undefined;
					}
				}
				if (albumMeta) try {
					const artistSplitter = /\s*;+\s*/;
					artist = albumMeta.ArtistName.split(artistSplitter);
					isVA = vaParser.test(albumMeta.ArtistName);
					if (albumMeta.id) identifiers.PROSTUDIOMASTERS_ID = parseInt(albumMeta.id) || albumMeta.id;
					if (albumMeta.UPC) identifiers.UPC = albumMeta.UPC;
					if (albumMeta.OriginalReleaseDate) releaseDate = albumMeta.OriginalReleaseDate;
					if (albumMeta.LabelName) label = albumMeta.LabelName;
					if (albumMeta.CatalogNumber) catalogue = albumMeta.CatalogNumber;
					if (albumMeta.ICPN) identifiers.ICPN = albumMeta.ICPN;
					if (!releaseDate && (/^[℗©]\s*(\d{4})\b/.test(albumMeta.PLine) || /^[℗©]\s*(\d{4})\b/.test(albumMeta.CLine)))
						releaseDate = RegExp.$1;
					if (albumMeta.GenreName) genres.push(albumMeta.GenreName);
					if (albumMeta.SubGenreName) genres.push(albumMeta.SubGenreName);
					if (albumMeta.genres) genres.push(albumMeta.genres);
					if (/\b(\d+(?:\.\d+)?)\s*kHz\s*\/\s*(\d+)[\-\s]?bit\s+(\w+)\b/i.test(albumMeta.recording_info)) {
						samplerate = parseFloat(RegExp.$1) * 1000 || undefined;
						bitdepth = parseInt(RegExp.$2) || undefined;
						format = RegExp.$3;
						if (['FLAC', 'AIFF', 'WAV', 'PCM', 'DSD'].includes(format)) encoding = 'lossless';
					}
					if (albumMeta.album_info) {
						description = html2php(domParser.parseFromString(albumMeta.album_info, 'text/html').body, response.finalUrl).trim();
						if (description && !quoteDetector.test(description)) description = description.bbQuote();
					}
					const audioTrackValidator = track => track.duration !== '0'; // && track.disc_number !== '99'; //&& track.TrackName != 'Digital Booklet';
					return albumMeta.tracks.filter(audioTrackValidator).map(function(track) {
						trackIdentifiers = { TRACK_ID: parseInt(track.id) || track.id };
						if ('ISRC' in track) trackIdentifiers.ISRC = track.ISRC;
						if ('ExplicitLyrics' in track) trackIdentifiers.EXPLICIT = Number(track.ExplicitLyrics);
						trackArtist = track.ArtistName.split(artistSplitter);
						if ('GroupingSeq' in track) trackIdentifiers.GROUPINGSEQ = parseInt(track.GroupingSeq);
						return {
							artist: isVA ? VA : undefined,
							artists: !isVA ? artist : undefined,
							album: albumMeta.AlbumName,
							genre: genres.join('; '),
							release_date: releaseDate,
							label: label,
							catalog: catalogue,
							codec: format,
							encoding: encoding,
							bitdepth: bitdepth,
							samplerate: samplerate,
							media: media,
							disc_number: parseInt(track.DiscSeq) || undefined,
							disc_subtitle: track.GroupingTitle,
							track_number: parseInt(track.TrackSeq) || undefined,
							total_tracks: albumMeta.tracks.filter(audioTrackValidator).length,
							title: track.TrackName,
							track_artists: trackArtist.length > 0 && (isVA || !trackArtist.equalTo(artist)) ? trackArtist : undefined,
							composers: track.composers ? track.composers.split(artistSplitter) : undefined,
							duration: parseInt(track.duration) || undefined,
							url: !identifiers.PROSTUDIOMASTERS_ID ? response.finalUrl : undefined,
							description: description,
							identifiers: mergeIds(),
							cover_url: imgUrl,
						};
					});
				} catch(e) { console.warn('On PSM meta extraction:', e) }
				console.warn('PSM: falling back to HTML parser');
				artist = Array.from(response.document.querySelectorAll('h2.ArtistName > a')).map(node => node.textContent.trim());
				isVA = artist.length <= 0 || artist.length == 1 && vaParser.test(artist[0]);
				if (isVA) artist = [];
				if ((ref = response.document.querySelector('h3.AlbumName')) != null) album = ref.textContent.trim();
				if ((ref = response.document.querySelector('div.pline')) != null
						&& /^(?:[℗©]\s*)+(\d{4})\s+(.+)/.test(ref.textContent.trim())) {
					releaseDate = RegExp.$1;
					label = RegExp.$2;
				}
				getDescription(response, 'div.album-info', true);
				trs = response.document.querySelectorAll('div.album-tracks > div.tracks > table > tbody > tr');
				totalTracks = Array.from(trs).filter(tr => tr.classList.contains('track-playable')).length;
				discNumber = 0;
				trs.forEach(function(tr) {
					if (tr.classList.contains('track-playable')) {
						trackArtist = samplerate = bitdepth = format = title = undefined; trackIdentifiers = {};
						if (ref = tr.getAttribute('data-track-id')) trackIdentifiers.TRACK_ID = ref;
						if ((ref = tr.querySelector('div.num')) != null) {
							trackNumber = ref.firstChild.textContent.trim();
							if (/^(\d+)\.(\d+)$/.test(trackNumber)) {
								discNumber = parseInt(RegExp.$1);
								trackNumber = parseInt(RegExp.$2);
							} else if ((trackNumber = parseInt(trackNumber) || trackNumber) == 1) ++discNumber;
						} else trackNumber = undefined;
						if ((ref = tr.querySelector('td.track-name > div.name')) != null) {
							title = ref.firstChild.textContent.trim();
							if ((ref = ref.querySelector(':scope small')) != null) trackArtist = ref.firstChild.textContent;
						};
						if ((ref = tr.querySelector('span.track-format')) != null && /^(\d+(?:[,\.]\d+)?)\s*([kMG]?Hz)(?:\s+(\d+)-bit)?\s*\|\s*(\S+)$/i.test(ref.textContent.trim())) {
							samplerate = parseFloat(RegExp.$1);
							['hz', 'khz', 'mhz', 'ghz'].forEach((unit, ndx) => {
								if (RegExp.$2.toLowerCase() == unit) samplerate *= 1000 ** ndx;
							});
							samplerate = Math.round(samplerate) || undefined;
							bitdepth = parseInt(RegExp.$3) || undefined;
							format = RegExp.$4;
						}
						tracks.push({
							artist: isVA ? VA : undefined,
							artists: !isVA ? artist : undefined,
							album: album,
							//album_year: extractYear(releaseDate),
							release_date: releaseDate,
							label: label,
							catalog: catalogue,
							codec: format,
							bitdepth: bitdepth,
							samplerate: samplerate,
							media: media,
							disc_number: discNumber,
							total_discs: totalDiscs,
							disc_subtitle: discSubtitle,
							track_number: trackNumber,
							total_tracks: totalTracks,
							title: title,
							track_artist: trackArtist && (isVA || !artistsMatch(trackArtist, [artist])) ? trackArtist : undefined,
							duration: (ref = tr.querySelector('td:last-of-type')) != null ? timeStringToTime(ref.firstChild.data) : undefined,
							url: !identifiers.PROSTUDIOMASTERS_ID ? response.finalUrl : undefined,
							description: description,
							identifiers: mergeIds(),
							cover_url: imgUrl,
						});
					} else if ((ref = tr.querySelector('div.grouping-title')) != null) {
						discSubtitle = ref.textContent.trim();
						guessDiscNumber();
					}
				});
				return tracks;
			}); else if (url.hostname.endsWith('7digital.com')) return globalXHR(url).then(function(response) {
				if ((ref = response.document.querySelector('table.release-track-list')) != null)
					identifiers['7DIGITAL_ID'] = parseInt(ref.dataset.releaseid) || ref.dataset.releaseid;
				artist = Array.from(response.document.querySelectorAll('h2.release-info-artist > span[itemprop="byArtist"] > meta[itemprop="name"]'))
					.map(node => node.content);
				isVA = artist.length <= 0 || artist.length == 1 && vaParser.test(artist[0]);
				if ((ref = response.document.querySelector('h1.release-info-title')) != null) album = ref.textContent.trim();
				if ((ref = response.document.querySelector('div.release-date-info > p')) != null) releaseDate = normalizeDate(ref.textContent);
				if ((ref = response.document.querySelector('div.release-label-info > p')) != null) label = ref.textContent.trim();
				response.document.querySelectorAll('dl.release-data > dt.release-data-label').forEach(function(dt) {
					if (/\b(?:Genres?):/.test(dt.textContent)) genres = Array.from(dt.nextElementSibling.querySelectorAll('a')).map(a => a.textContent.trim());
				});
				//getDescription(response, 'div.album-info', false);
				if ((ref = response.document.querySelector('img[itemprop="image"]')) != null) imgUrl = ref.src;
				totalTracks = response.document.querySelectorAll('table.release-track-list > tbody > tr.release-track').length;
				response.document.querySelectorAll('table.release-track-list').forEach(function(table) {
					discSubtitle = discNumber = undefined;
					if ((ref = table.querySelector('caption > h4.release-disc-info')) != null) {
						discSubtitle = ref.textContent.trim();
						guessDiscNumber();
					}
					table.querySelectorAll('tbody > tr.release-track').forEach(function(tr) {
						trackIdentifiers = {};
						if (tr.dataset.trackid) trackIdentifiers.TRACK_ID = parseInt(tr.dataset.trackid) || tr.dataset.trackid;
						tracks.push({
							artist: isVA ? VA : undefined,
							artists: !isVA ? artist : undefined,
							album: album,
							//album_year: extractYear(releaseDate),
							release_date: releaseDate,
							label: label,
							catalog: catalogue,
							media: media,
							genre: genres.join('; '),
							disc_number: discNumber,
							total_discs: totalDiscs,
							disc_subtitle: discSubtitle,
							track_number: (ref = tr.querySelector('td.release-track-preview > em.release-track-preview-text')) != null ?
							ref.textContent.trim() : undefined,
							total_tracks: totalTracks,
							title: (ref = tr.querySelector('td.release-track-name > meta[itemprop="name"]')) != null ? ref.content : undefined,
							duration: durationFromMeta(tr),
							url: (ref = response.document.querySelector('head > meta[property="og:url"]')) != null ?
							ref.content : response.finalUrl.replace(/\?.*$/, ''),
							description: description,
							identifiers: mergeIds(),
							cover_url: imgUrl,
						});
					});
				});
				return tracks;
			}); else if (url.hostname.endsWith('e-onkyo.com')) return globalXHR(url).then(function(response) {
				if (/\/album\/(\w+)\/?$/.test(response.finalUrl)) identifiers.EONKYO_ID = RegExp.$1;
				artist = Array.from(response.document.querySelectorAll('div.jacketDetailArea p.artistsName > a'))
					.map(node => node.textContent.trim());
				isVA = artist.length <= 0 || artist.length == 1 && vaParser.test(artist[0]);
				if ((ref = response.document.querySelector('div.jacketDetailArea p.packageTtl')) != null)
					album = ref.firstChild.wholeText.trim();
				if ((ref = response.document.querySelector('div.jacketDetailArea p.recordlabelName > a')) != null)
					label = ref.textContent.trim();
				if ((ref = response.document.querySelector('div.jacketDetailArea p.releaseDay > a')) != null)
					releaseDate = normalizeDate(ref.textContent, 'jp');
				if ((ref = response.document.querySelector('div.jacketDetailArea p.packageNoteDetail')) != null
						&& /^\s*(?:\(C\)|©)\s+(\d{4})\b/i.test(ref.lastChild.textContent)) albumYear = parseInt(RegExp.$1);
				//getDescription(response, 'div#credit', true);
				if (/\s+\(\s*(?:(\d+)[\-\s]*bit)?\s*\/?\s*(?:(\d+(?:\.\d+)?)\s*kHz)?\s*\)\s*$/i.test(album)) {
					album = RegExp.leftContext;
					bitdepth = parseInt(RegExp.$1) || undefined;
					samplerate = parseFloat(RegExp.$2) * 1000;
				}
				let formats = [];
				function enumFormats(elem) {
					if ((matches = /(\w+)\s+(\d+(?:\.\d+)?)\s*([kM]Hz)\s*\/\s*(\d+)[\s\-]?bits?\b/.exec(elem.textContent)) == null)
						return;
					formats.push([
						matches[1].toUpperCase(),
						parseFloat(matches[2].replace(',', '.')) * 10**(matches[3] == 'kHz' ? 3 : matches[3] == 'MHz' ? 6 : 0),
						parseInt(matches[4]),
					]);
				}
				response.document.querySelectorAll('div.purchaseInr > dl > dd > p.musicspec').forEach(enumFormats);
				if (formats.length <= 0) response.document.querySelectorAll('select#ddlFileTypeCD > option').forEach(enumFormats);
				getDescription(response, 'div#info > div.infoTxtArea', true);
				let credits = [];
				response.document.querySelectorAll('div#credit > p').forEach(function(p) {
					let trackNumber = parseInt(p.firstChild.wholeText);
					if (!(trackNumber > 0)) return;
					let artists = {};
					Array.from(p.getElementsByTagName('A')).map(a => a.textContent.trim()).forEach(function(artist) {
						if (/^(.+?)\s*\[([^\[\]]+)\]$/.test(artist)) {
							artist = RegExp.$1;
							var role = RegExp.$2;
						}
						if (/^(?:(?:Background\s+)?(?:Vocals?|Vocalist)|(?:\w+\s)?Guitar|Bass|Drums|Piano|Keyboards|Strings|Percussion|Violin|Viola|Cello|Mellotron|Synthesizer)\b/i.test(role))
							role = 'Performer';
						if (/^(?:Author|(?:Composer)?Lyricist|Writer)$/i.test(role)) role = 'Composer';
						if (/^(?:Executive\sProducer)$/i.test(role)) role = 'Producer';
						if (artists[role] == undefined) artists[role] = [];
						artists[role].pushUniqueCaseless(artist);
					});
					credits[trackNumber - 1] = artists;
				});
				if ((ref = response.document.querySelector('meta[property="og:image"][content]')) != null)
					imgUrl = ref.content.replace(/\/s\d+\//, '/s0/');
				trs = response.document.querySelectorAll('dl.musicList > dd.musicBox');
				tracks = Array.from(trs).map(function(tr, index) {
					trackNumber = (ref = tr.querySelector('div.musicListNo')) != null ? ref.textContent.trim() : index + 1;
					let trackPerformers = [ ];
					try {
						let trackArtists = credits[trackNumber - 1];
						trackArtist = trackArtists.MainArtist ? trackArtists.MainArtist : [ ];
						var trackGuests = trackArtists.FeaturedArtist ?
							trackArtists.FeaturedArtist.filter(artist => !trackArtist.includesCaseless(artist)) : [ ];
						producer = trackArtists.Producer ? trackArtists.Producer : [ ];
						composer = trackArtists.Composer ? trackArtists.Composer : [ ];
						trackPerformers = trackArtists.Performer ? trackArtists.Performer : [ ];
					} catch(e) { trackArtist = [ ]; trackGuests = [ ]; producer = [ ]; composer =  [ ] }
					if (!isVA && artistsMatch([trackArtist, trackGuests], [artist, [ ]])) { trackArtist = [ ]; trackGuests = [ ] }
					return {
						artist: isVA ? VA : undefined,
						artists: !isVA ? artist : undefined,
						album: album,
						album_year: albumYear,
						release_date: releaseDate,
						label: label,
						catalog: catalogue,
						encoding: 'lossless',
						codec: formats.length > 0 && formats.map(format => format[0]).homogeneous() ? formats[0][0] : undefined,
						samplerate: formats.length > 0 && formats.map(format => format[1]).homogeneous() ? formats[0][1] : undefined,
						bitdepth: formats.length > 0 && formats.map(format => format[2]).homogeneous() ? formats[0][2] : undefined,
						media: media,
						track_number: trackNumber,
						total_tracks: trs.length,
						title: (ref = tr.querySelector('div.musicTtl > span')) != null ? ref.title || ref.textContent.trim() : undefined,
						track_artists: trackArtist.length > 0 ? trackArtist : undefined,
						track_guests: trackGuests.length > 0 ? trackGuests : undefined,
						composers: composer.length > 0 ? composer : undefined,
						producers: producer.length > 0 ? producer : undefined,
						performers: trackPerformers.length > 0 ? trackPerformers : undefined,
						duration: (ref = tr.querySelector('div.musicTime')) != null ? timeStringToTime(ref.textContent.trim()) : undefined,
						url: !identifiers.EONKYO_ID ? response.finalUrl : undefined,
						description: description,
						identifiers: mergeIds(),
						cover_url: imgUrl,
					};
				});
				return finalizeTracks();
			}); else if (url.hostname.endsWith('store.acousticsounds.com')) return globalXHR(url).then(function(response) {
				if (/\/(\d+)\/$/.test(response.finalUrl)) identifiers.ACOUSTICSOUNDS_ID = RegExp.$1;
				artist = Array.from(response.document.querySelectorAll('div > h1 > a')).map(node => node.textContent.trim());
				isVA = artist.length <= 0 || artist.length == 1 && vaParser.test(artist[0]);
				if (isVA) artist = [];
				if ((ref = response.document.querySelector('div > h1')) != null) album = ref.lastChild.wholeText.trim().replace(/\s*-\s*/, '');
				response.document.querySelectorAll('div > p > table > tbody > tr > td:first-of-type').forEach(function(td) {
					if (/^(?:Label)\b/i.test(td.textContent)) label = td.nextElementSibling.textContent.trim();
					if (/^(?:Genre)\b/i.test(td.textContent)) genres[0] = td.nextElementSibling.textContent.trim();
					if (/^(?:Product\s+No)\b/i.test(td.textContent)) catalogue = td.nextElementSibling.textContent.trim();
					if (/^(?:Category)\b/i.test(td.textContent)) {
						if (/\b(\d+(?:\.\d+)?)\s*(?:kHz)\b/.test(td.nextElementSibling.textContent))
							samplerate = parseFloat(RegExp.$1) * 1000;
						if (/\b(\d+)[\s\-]?(?:bits?)\b/i.test(td.nextElementSibling.textContent))
							bitdepth = parseInt(RegExp.$1);
						if (/\b(FLAC|ALAC|WAV|DSD|AIFF)\b/i.test(td.nextElementSibling.textContent)) {
							format = RegExp.$1;
							encoding = 'lossless';
						}
					}
				});
				getDescription(response, 'div#description > p', true);
				if ((ref = response.document.querySelector('div#detail > link[rel="image_src"]')) != null)
					imgUrl = ref.href.replace(/\/medium\//i, '/xlarge/');
				trs = response.document.querySelectorAll('div#tracks > table > tbody > tr');
				return Array.from(trs).map(function(tr, index) {
					title = (ref = tr.querySelector('td[nowrap]')) != null ? ref.textContent.trim() : undefined;
					if ((matches = /^(\d+)(?:\s+\-|\.)\s+(.+)$/.exec(title)) != null) {
						trackNumber = matches[1];
						title = matches[2];
					} else trackNumber = undefined;
					return {
						artist: isVA ? VA : undefined,
						artists: !isVA ? artist : undefined,
						album: album,
						release_date: releaseDate,
						label: label,
						catalog: catalogue,
						encoding: encoding,
						codec: format,
						bitdepth: bitdepth,
						samplerate: samplerate || undefined,
						media: media,
						genre: genres.join('; '),
						track_number: trackNumber || index + 1,
						total_tracks: trs.length,
						title: title,
						url: !identifiers.ACOUSTICSOUNDS_ID ? response.finalUrl : undefined,
						description: description,
						identifiers: mergeIds(),
						cover_url: imgUrl,
					};
				});
			}); else if (url.hostname.endsWith('indies.eu')) return globalXHR(url).then(function(response) {
				if (/\/alba\/(\d+)\//.test(response.finalUrl)) identifiers.INDIESSCOPE_ID = parseInt(RegExp.$1);
				ref = response.document.querySelector(':root > body > div > div > div > h2');
				if (ref != null) artist = Array.from(ref.childNodes).map(node => node.textContent.trim());
				isVA = artist.length <= 0 || artist.length == 1 && vaParser.test(artist[0]);
				if ((ref = response.document.querySelector(':root > body > div > div > div > h1')) != null)
					album = ref.textContent.trim();
				if ((ref = response.document.querySelector('div.infoBox')) != null) {
					let ndx = 0;
					ref.childNodes.forEach(function(child) {
						if (child.tagName == 'BR') { ++ndx; return; }
						switch (ndx) {
							case 0:
								if (child.nodeType == Node.TEXT_NODE) {
									label = child.wholeText.trim();
									if (/^(.*)\s+\/\s+(\d{4})$/.test(label)) {
										label = RegExp.$1;
										releaseDate = RegExp.$2;
									}
								}
								break;
							case 1:
								if (child.nodeType == Node.ELEMENT_NODE) genres.push(child.textContent.trim());
								break;
							case 2:
								if (child.nodeType == Node.ELEMENT_NODE) catalogue = child.textContent.trim();
								break;
						}
					});
				}
				getDescription(response, 'div.popis > section', true);
				if ((ref = response.document.querySelector('div.obrazekDetail > img')) != null) imgUrl = ref.src;
				trs = response.document.querySelectorAll('table.skladby > tbody > tr');
				return Array.from(trs).map(function(tr) {
					title = undefined;
					if ((ref = tr.querySelector('td.nazev')) != null) {
						trackNumber = parseInt(ref.firstChild.wholeText);
						title = ref.querySelector('strong').textContent.trim();
					}
					return {
						artist: isVA ? VA : undefined,
						artists: !isVA ? artist : undefined,
						album: album,
						release_date: releaseDate,
						label: label,
						catalog: catalogue,
						codec: format,
						media: media,
						genre: genres.join('; '),
						track_number: trackNumber,
						total_tracks: trs.length,
						title: title,
						duration: (ref = tr.querySelector('td:nth-of-type(4)')) != null ? timeStringToTime(ref.textContent) : undefined,
						identifiers: !identifiers.INDIESSCOPE_ID ? response.finalUrl : undefined,
						description: description,
						identifiers: mergeIds(),
						cover_url: imgUrl,
					};
				});
			}); else if (url.hostname.endsWith('beatport.com')) {
				let releaseId = /^\/release\/\S+?\/(\d+)\b/i.test(url.pathname)
					|| /\/releases\/(\d+)\b/i.test(url.pathname) ? parseInt(RegExp.$1) : undefined;
				return (releaseId ? queryBeatportAPI('releases/' + releaseId) : Promise.reject('unknown URL scheme')).then(function(release) {
					if (prefs.diag_mode) console.debug('Beatport release metadata received:', release);
					identifiers.BEATPORT_ID = release.id;
					artist = release.artists.map(artist => artist.name);
					isVA = artist.length <= 0 || artist.length == 1 && vaParser.test(artist[0]);
					if (release.upc) identifiers.UPC = release.upc;
					if ('is_explicit' in release) identifiers.EXPLICIT = Number(release.is_explicit);

					function trackMapper(track, index) {
						trackIdentifiers = { TRACK_ID: track.id };
						if (track.isrc) trackIdentifiers.ISRC = track.isrc;
						if ('is_explicit' in track) trackIdentifiers.EXPLICIT = Number(track.is_explicit);
						if (track.bpm) trackIdentifiers.BPM = track.bpm;
						trackArtist = track.artists.map(artist => artist.name);
						if ((title = track.name) && track.mix_name && track.mix_name != 'Original Mix')
							title += ' (' + track.mix_name + ')';
						try { genres = [track.genre.name] } catch(e) { genres = [] }
						if (track.sub_genre) try { genres.push(track.sub_genre.name) } catch(e) { }
						return {
							artist: isVA ? VA : undefined,
							artists: artist.length > 0 ? artist : undefined,
							album: release.name,
							album_year: extractYear(release.new_release_date) || undefined,
							release_date: release.publish_date || track.publish_date || undefined,
							genre: genres.join('; ') || undefined,
							label: release.label.name,
							catalog: release.catalog_number || track.catalog_number || undefined,
							media: media,
							track_number: track.number || index + 1,
							total_tracks: release.track_count,
							title: title,
							track_artists: trackArtist.length > 0 && (isVA || !trackArtist.equalCaselessTo(artist)) ?
							trackArtist : undefined,
							remixers: track.remixers.length > 0 ? track.remixers.map(remixer => remixer.name)
								:/* release.remixers.length > 0 ? release.remixers.map(remixer => remixer.name) :*/ undefined,
							duration: track.length_ms > 0 ? track.length_ms / 1000 : undefined,
							description: release.desc || undefined,
							url: release.slug ? 'https://www.beatport.com/release/' + release.slug + '/' + release.id : url,
							cover_url: release.image.uri ?
								release.image.uri.replace(/\/image_size\/\d+x\d+\//i, '/image/') : undefined,
							identifiers: mergeIds(),
						};
					}

					return queryBeatportAPI('releases/' + release.id + '/tracks', { per_page: 9999 }).then(function(tracks) {
						if (prefs.diag_mode) console.debug('Beatport tracks metadata received:', tracks.results);
						return tracks.count == release.track_count ? tracks.results.map(trackMapper)
							: Promise.reject('Track counts inconsistency');
					}).catch(function(reason) {
						console.warn('Beatport release tracks failed:', reason);
						return Promise.all(release.tracks.map(track => queryBeatportAPI(track)))
							.then(tracks => tracks.map(trackMapper));
					});
				});
			} else if (url.hostname.endsWith('traxsource.com')) return globalXHR(url).then(function(response) {
				if (/\/title\/(\d+)(?=\/|$)/i.test(response.finalUrl)) identifiers.TRAXSOURCE_ID = RegExp.$1;
				artist = Array.from(response.document.querySelectorAll('h1.artists > a.com-artists'))
					.map(node => node.textContent.trim());
				if (artist.length <= 0 && (ref = response.document.querySelector('h1.artists')) != null)
					artist = [ref.textContent.trim()];
				isVA = artist.length <= 0 || artist.length == 1 && vaParser.test(artist[0]);
				if ((ref = response.document.querySelector('h1.title')) != null) album = ref.textContent.trim();
				if ((ref = response.document.querySelector('a.com-label')) != null) label = ref.textContent.trim();
				if ((ref = response.document.querySelector('div.cat-rdate')) != null && /^(.*)\s*\|\s*(.*)$/.test(ref.textContent.trim())) {
					catalogue = RegExp.$1;
					releaseDate = normalizeDate(RegExp.$2);
				}
				getDescription(response, 'div.desc', true);
				if ((ref = response.document.querySelector('meta[property="og:image"][content]')) != null) imgUrl = ref.content;
				trs = response.document.querySelectorAll('div.trklist > div.trk-row');
				return Array.from(trs).map(function(tr) {
					trackIdentifiers = {};
					title = (ref = tr.querySelector('div.title > a')) != null && ref.textContent.trim() || undefined;
					if (title && (ref = tr.querySelector('span.version')) != null) {
						if (ref.firstChild.nodeType == Node.TEXT_NODE
								&& (i = ref.firstChild.wholeText.trim()).length > 0) title += ' (' + i + ')';
					}
					trackArtist = Array.from(tr.querySelectorAll('div.artists a.com-artists')).map(a => a.textContent.trim());
					return {
						artist: isVA ? VA : undefined,
						artists: !isVA ? artist : undefined,
						album: album,
						release_date: releaseDate,
						label: label,
						catalog: catalogue,
						media: media,
						genre: Array.from(tr.querySelectorAll('div.genre > a')).map(a => a.textContent.trim()).join('; '),
						track_number: (ref = tr.querySelector('div.tnum')) != null ? ref.textContent.trim() : undefined,
						total_tracks: trs.length,
						title: title,
						track_artists: trackArtist.length > 0 && (isVA || !trackArtist.equalCaselessTo(artist)) ?
						trackArtist : undefined,
						remixers: Array.from(tr.querySelectorAll('div.artists a.com-remixers')).map(a => a.textContent.trim()),
						duration: (ref = tr.querySelector('span.duration')) != null ? timeStringToTime(ref.textContent) : undefined,
						url: !identifiers.TRAXSOURCE_ID ? response.finalUrl : undefined,
						description: description,
						identifiers: mergeIds(),
						cover_url: imgUrl,
					};
				});
			}); else if (url.hostname.endsWith('.apple.com')) return urlResolver(url).then(function(url) {
				let appleId = amEntityParser.exec(url);
				if (appleId != null) appleId = parseInt(appleId[2]); else throw 'invalid Apple Music link';
				const market = /\/([a-z]{2})\//.exec(url);
				return (appleId > 0 ? queryAppleAPI('albums/' + appleId, {
					'include': 'tracks,artists,record-labels',
					//'include[songs]': 'artists,composers',
					//'fields[artists]': "name,url",
					//'extend[albums]': 'editorialArtwork',
					//'art[url]": "f",
				}, market != null ? market[1] : undefined).then(response => response.data[0]) : Promise.reject('Apple id cannot be determined')).then(function(metadata) {
					if (prefs.diag_mode) console.debug('Apple Music metadata loaded:', metadata);
					//query.set('include', 'artists,albums');
					//Promise.all(album.relationships.tracks.data.map(track => globalXHR(config.MUSIC.BASE_URL + '/catalog/us/songs/' + track.id + '?' + query, { responseType: 'json', headers: {
					//	Referer: response.finalUrl,
					//	'Authorization': 'Bearer ' + config.MEDIA_API.token,
					//} }).then(({response}) => response))).then(tracks => { console.debug('Apple Music tracks received:', tracks) })
					//.catch(reason => { console.error(reason) });
					identifiers.APPLE_ID = parseInt(metadata.id) || metadata.id;
					isVA = vaParser.test(metadata.attributes.artistName);
					if (metadata.attributes.isSingle) identifiers.RELEASETYPE = 'Single';
					if (/\s+-\s+(?:Single)$/i.test(album = metadata.attributes.name)) {
						album = RegExp.leftContext;
						identifiers.RELEASETYPE = 'Single';
					} else if (/\s+-\s+(?:EP)$/.test(album)) {
						album = RegExp.leftContext;
						identifiers.RELEASETYPE = 'EP';
					} else if (/\s+(?:EP)$/.test(album)) identifiers.RELEASETYPE = 'EP';
					genres = metadata.attributes.genreNames.filter(genre => genre != 'Music');
					label = metadata.attributes.recordLabel;
					if (!label) label = metadata.attributes.copyright.replace(/^((?:[©℗]|\([PC]\))\s+)?(?:(\d{4})\s+)?/i, '');
					if (metadata.attributes.upc) identifiers.UPC = metadata.attributes.upc;
					//identifiers.EXPLICIT = Number(/^(?:explicit)$/i.test(metadata.attributes.contentRating));
					if ('isCompilation' in metadata.attributes) identifiers.COMPILATION = Number(metadata.attributes.isCompilation);
					if ('isMasteredForItunes' in metadata.attributes) identifiers.MASTERED_FOR_ITUNES = Number(metadata.attributes.isMasteredForItunes);
					//if (metadata.description) description = html2php(metadata.description, metadata.attributes.url).collapseGaps();
					if (metadata.attributes.editorialNotes)
						description = html2php(domParser.parseFromString(metadata.attributes.editorialNotes.standard
							|| metadata.attributes.editorialNotes.short, 'text/html').body, metadata.attributes.url).replace(/\n/g, '\n\n')
								.collapseGaps();
					if (description && !quoteDetector.test(description)) description = description.bbQuote();
					if (metadata.attributes.contentRating) switch (metadata.attributes.contentRating.toLowerCase()) {
						case 'notexplicit': identifiers.EXPLICIT = 0; break;
						case 'explicit': identifiers.EXPLICIT = 1; break;
						case 'cleaned': case 'clean': identifiers.EXPLICIT = 2; break;
					}
					if (!prefs.apple_use_release_cover && metadata.attributes.artwork) {
						let entry = addMessage(new HTML('<a href="' + metadata.attributes.artwork.realUrl +
							'" target="_blank" title="Left mouse click to set it as torrent group cover" style="' +
							hyperlinkStyle + '">alternate cover</a> available'), 'info');
						getRemoteFileSize(metadata.attributes.artwork.realUrl).then(function(size) {
							entry.append(' (' + metadata.attributes.artwork.width + '×' + metadata.attributes.artwork.height +
								'; ' + formattedSize(size) + ')');
						});
						let links = entry.getElementsByTagName('A');
						if (links.length > 0) links[0].onclick = function(evt) {
							if (evt.button != 0 || evt.ctrlKey || evt.shiftKey) return true;
							setCover(evt.target.href, true).then(result => { evt.target.style.color = null });
							return false;
						};
					}
					if (metadata.attributes.artwork) metadata.attributes.artwork.realUrl = metadata.attributes.artwork.url
						.replace('{w}', metadata.attributes.artwork.width).replace('{h}', metadata.attributes.artwork.height);
					return metadata.relationships.tracks.data.filter(track => track.type == 'songs').map(function(track) {
						trackIdentifiers = {
							TRACK_ID: parseInt(track.id),
							ISRC: track.attributes.isrc,
							HASLYRICS: Number(track.attributes.hasLyrics || false),
						};
						if (track.attributes.contentRating) switch (track.attributes.contentRating.toLowerCase()) {
							case 'notexplicit': trackIdentifiers.EXPLICIT = 0; break;
							case 'explicit': trackIdentifiers.EXPLICIT = 1; break;
							case 'cleaned': case 'clean': trackIdentifiers.EXPLICIT = 2; break;
						}
						let trackGenres = track.attributes.genreNames.filter(genre => genre != 'Music');
						return {
							artist: isVA ? VA : metadata.attributes.artistName,
							artists: metadata.relationships.artists.data.map(artist => artist.attributes.name),
							album: album,
							release_date: metadata.attributes.releaseDate,
							label: label,
							media: media,
							genre: (trackGenres.length > 0 ? trackGenres : genres).join('; '),
							disc_number: track.attributes.discNumber,
							disc_subtitle: track.attributes.workName,
							track_number: track.attributes.trackNumber,
							total_tracks: metadata.attributes.trackCount,
							title: track.attributes.name,
							track_artist: track.attributes.artistName
								&& (isVA || !artistsMatch(track.attributes.artistName, metadata.attributes.artistName)) ?
							track.attributes.artistName : undefined,
							composer: track.attributes.composerName,
							duration: track.attributes.durationInMillis / 1000 || undefined,
							description: description,
							url: !identifiers.APPLE_ID ? metadata.attributes.url : undefined,
							identifiers: mergeIds(),
							cover_url: prefs.apple_use_release_cover && metadata.attributes.artwork ?
								metadata.attributes.artwork.realUrl : undefined,
						};
					});
				});
			}); else if (url.hostname.endsWith('musicbrainz.org')) {
				const entities = [
					'aliases', 'annotation', 'artist-credits', 'artists', 'collections', 'discids', 'genres',
					'isrcs', 'labels', 'media', 'ratings', 'recordings', 'release-groups', 'tags', 'url-rels',
				];
				if ((identifiers.MBID = mbrRlsParser.exec(url)) != null) identifiers.MBID = identifiers.MBID[1];
				else return Promise.reject('Invalid MusicBrainz link - pick specific release');
				return queryMusicBrainzAPI('release/' + identifiers.MBID, { inc: entities.join('+') }).then(function(release) {
					if (release.error) return Promise.reject(release.error);
					if (prefs.diag_mode) console.debug('MusicBrainz release metadata received:', release);
					if (release.id) identifiers.MBID = release.id;
					if (release.barcode) identifiers.BARCODE = release.barcode;
					if (release.asin) identifiers.ASIN = release.asin;
					if ('primary-type' in release['release-group'])
						identifiers.RELEASETYPE = release['release-group']['primary-type'];
					if (!['Single', 'EP'].includes(identifiers.RELEASETYPE)) {
						const hasSecondaryType = secondaryType => 'secondary-types' in release['release-group']
							&& release['release-group']['secondary-types'].includes(secondaryType);
						if (hasSecondaryType('Compilation')) identifiers.RELEASETYPE = 'Compilation';
						if (hasSecondaryType('Live')) identifiers.RELEASETYPE = 'Live Album';
						if (hasSecondaryType('Remix')) identifiers.RELEASETYPE = 'Remix';
						if (hasSecondaryType('Soundtrack')) identifiers.RELEASETYPE = 'Soundtrack';
						if (hasSecondaryType('DJ-mix')) identifiers.RELEASETYPE = 'DJ Mix';
						if (hasSecondaryType('Mixtape/Street')) identifiers.RELEASETYPE = 'Mixtape';
						if (hasSecondaryType('Interview')) identifiers.RELEASETYPE = 'Interview';
						if (hasSecondaryType('Demo')) identifiers.RELEASETYPE = 'Demo';
					}
					if (release['text-representation']) identifiers.LANGUAGE = release['text-representation'].language;
					artist = Array.isArray(release['artist-credit']) ? release['artist-credit'].map(artist => artist.name) : [];
					isVA = artist.length <= 0 || artist.length == 1 && vaParser.test(artist[0]);
					if (Array.isArray(release.genres)) genres = release.genres.map(genre => genre.name);
					if (Array.isArray(release.tags)) Array.prototype.push.apply(genres, release.tags.map(tag => tag.name));
					if (genres.length <= 0) {
						if (Array.isArray(release['release-group'].genres)) {
							Array.prototype.push.apply(genres, release['release-group'].genres.map(tag => tag.name));
						}
						if (Array.isArray(release['release-group'].tags)) {
							Array.prototype.push.apply(genres, release['release-group'].tags.map(tag => tag.name));
						}
					}
					label = release['label-info'].map(label => label.label && label.label.name).filter(Boolean);
					catalogue = release['label-info'].map(label => label['catalog-number']);
					if (release['release-group'].status && !/^(?:Official)$/i.test(release['release-group'].status))
						addMessage('Not an official release (' + release['release-group'].status + ')', 'warning');
					if (release['release-group']) description = 'MusicBrainz'.bbUrl('https://musicbrainz.org/release-group/' + release['release-group'].id);
					release.media.forEach(function(medium, mediaNdx) {
						medium.tracks.forEach(function(track, trackNdx) {
							trackIdentifiers = { TRACK_ID: track.id };
							if (Array.isArray(track['artist-credit'])) {
								trackArtist = track['artist-credit'].map(artist => artist.name);
								trackArtist = trackArtist.length > 0 && (isVA || !trackArtist.equalCaselessTo(artist));
							} else trackArtist = false;
							tracks.push({
								artist: isVA ? VA : undefined,
								artists: !isVA ? artist : undefined,
								album: /*release['release-group'].title || */release.title,
								album_year: extractYear(release['release-group']['first-release-date']),
								release_date: release.date,
								genre: genres.join('; '),
								label: label.filter(label => label).join(' / '),
								catalog: catalogue.filter(catno => catno).join(' / '),
								media: medium.format,
								disc_number: medium.position,
								disc_subtitle: medium.title,
								total_discs: release.media.length,
								track_number: track.number,
								title: track.title,
								track_artist: trackArtist ?
								track['artist-credit'].map(artist => artist.name + artist.joinphrase).join('') : undefined,
								duration: track.length != null ? track.length / 1000 : undefined,
								//country: release.country,
								description: description,
								identifiers: mergeIds(),
							});
						});
					});
					return tracks;
				});
			} else if (url.hostname.endsWith('vgmdb.net')) return globalXHR(url).then(function(response) {
				function addVolume(root) {
					if (!(root instanceof HTMLTableElement)) throw 'Assertion failed (addVolume)';
					let subtitle;
					root.querySelectorAll('tbody > tr').forEach(function(tr) {
						if ((ref = tr.querySelector('td[colspan="3"] > span.label')) != null)
							subtitle = ref.textContent.trim();
						else if (tr.classList.contains('rolebit')) tracks.push({
							artist: isVA ? VA : undefined,
							artists: !isVA ? mainArtist : undefined,
							album: album,
							//album_year: extractYear(releaseDate),
							release_date: releaseDate,
							label: Array.isArray(label) && label.length > 0 ? label.join(' / ') : undefined,
							catalog: catalogue,
							media: media,
							genre: genres.join('; '),
							disc_number: discNumber,
							//total_discs: totalDiscs,
							disc_subtitle: discSubtitle ? subtitle ? discSubtitle + ': ' + subtitle
								: discSubtitle : subtitle || undefined,
							track_number: (ref = tr.querySelector('span.label')) != null ? parseInt(ref.innerText) : undefined,
							//total_tracks: trs.length,
							title: tr.children[1].innerText.trim(),
							//track_artist: joinArtists(trackArtist),
							composers: artists['composer'],
							lyricists: artists['lyricist'],
							conductors: artists['conductor'],
							producers: artists['music producer'],
							arrangers: artists['arranger'],
							duration: (ref = tr.querySelector('span.time')) != null ? timeStringToTime(ref.innerText) : undefined,
							url: !identifiers.VGMDB_ID ? response.finalUrl : undefined,
							description: description || undefined,
							identifiers: mergeIds(),
							cover_url: imgUrl,
						});
					});
				}

				const slashStripper = [/\/\s*/, ''];
				function getMultiLangName(node, className) {
					if (!(node instanceof Node)) throw 'Assertion failed: parameter is not valid (getMultiLangName)';
					className = className ? '.' + className : '';
					let span = node.querySelector('span' + className + '[lang="en"]'), value;
					if (span != null) {
						value = span.lastChild.wholeText.trim();
						if ((span = node.querySelector('span' + className + '[lang="ja"]')
								|| node.querySelector('span' + className + ':not([lang="en"])')) != null) {
							let value2 = span.lastChild.wholeText.trim();
							if (value2.toLowerCase() != value.toLowerCase()) value += ' (' + value2 + ')';
						}
					} else if ((span = node.querySelector('span' + className + ':first-of-type')) != null)
						return span.lastChild.wholeText.trim();
					else return node.textContent.trim();
					return value;
				}
				function getEnOr1stLang(node, className) {
					if (!(node instanceof Node)) throw 'Assertion failed: parameter is not valid (getEnOr1stLang)';
					className = className ? '.' + className : '';
					let span = node.querySelector('span' + className + '[lang="en"]')
						|| node.querySelector('span' + className + ':first-of-type')
					return span != null ? span.lastChild.wholeText.trim() : undefined;
				}
				function getArtists(node) {
					if (node.children.length <= 0) return splitArtists(node.textContent.trim());
					let artists = [ ], artist, div = document.createElement('div');
					function commitItem() {
						if (div.childNodes.length <= 0) return;
						if (artist = getMultiLangName(div, 'artistname')) artists.push(artist);
						while (div.childNodes.length > 0) div.removeChild(div.firstChild);
					}
					node.childNodes.forEach(function(node) {
						if (node.tagName != 'SPAN') commitItem();
						switch (node.tagName) {
							case 'A': if (artist = getMultiLangName(node, 'artistname')) artists.push(artist); break;
							case 'SPAN': div.append(node.cloneNode(true)); break;
							case '#text': artists.pushUniqueCaseless(...node.wholeText.trim().split(/\s*,\s*/)
								.filter(text => text && !['(', '[', ']', ')'].includes(text))); break;
						}
					});
					commitItem();
					return artists;
				}

				if (/\/album\/(\d+)(?=\/|$)/i.test(response.finalUrl)) identifiers.VGMDB_ID = RegExp.$1;
				album = getMultiLangName(response.document.querySelector('div#innermain > h1'), 'albumtitle');
				label = [ ];
				let artists = { }, manufacturer = [ ], distributor = [ ], publishFormat = [ ];
				[
					'Artist', 'Performer', 'Vocals', 'Cast', 'Composer', 'Lyricist', 'Conductor',
					'Music producer', 'Producer', 'Executive Producer', 'Arranger', 'Director',
					'Personality', 'Music',
				].forEach(category => { artists[category.toLowerCase()] = [ ] });
				// Head table
				for (let span of response.document.body.querySelectorAll('div#rightfloat table#album_infobit_large > tbody > tr > td > span.label')) {
					let key, value = span.parentElement.nextElementSibling;
					if (value != null) key = span.textContent.trim(); else continue;
					console.assert(value.tagName == 'TD', "value.tagName == 'TD'", value);
					const labelMappings = {
						'Composed By': 'Composer',
						'Performed By': 'Performer',
						'Conducted By': 'Conductor',
						'Produced By': 'Producer',
						'Arranged By': 'Arranger',
					};
					switch (key.toLowerCase()) {
						case 'catalog number':
							while (value.firstChild != null) value = value.firstChild;
							if (value.nodeType == Node.TEXT_NODE) catalogue = value.wholeText.trim().replace(/\s*\([^\(\)]+\)$/, '');
							break;
						case 'release date':
							if (value.firstElementChild != null) releaseDate = value.firstElementChild.innerText.trim();
							break;
						case 'publisher': case 'published by':
							if (label) break;
						case 'label':
							label = Array.from(value.getElementsByTagName('A')).map(a => getEnOr1stLang(a, 'productname'));
							break;
						case 'manufacturer':
							manufacturer = Array.from(value.getElementsByTagName('A')).map(a => getEnOr1stLang(a, 'productname'));
							break;
						case 'distributor':
							distributor = Array.from(value.getElementsByTagName('A')).map(a => getEnOr1stLang(a, 'productname'));
							break;
						case 'barcode':
							identifiers.BARCODE = value.textContent.trim();
							break;
						case 'media format':
							media = value.textContent.trim();
							break;
						case 'publish format':
							Array.prototype.push.apply(publishFormat, value.textContent.trim().split(/\s*,\s*/));
							break;
						case 'classification':
							genres = value.textContent.trim().split(/\s*,\*/);
							break;
						default: for (let label in labelMappings) if (key.toLowerCase() == label.toLowerCase())
							getArtists(value).forEach(function(artist) {
								const index = labelMappings[label].toLowerCase();
								if (Array.isArray(artists[index])) artists[index].pushUniqueCaseless(artist);
							});
					}
				}
				genres.pushUniqueCaseless('Soundtrack');
				Array.prototype.push.apply(label, manufacturer.filter(val => !label.includes(val)));
				const doujinRelease = publishFormat.includesCaseless('Doujin') || publishFormat.includesCaseless('Doujin/Indie');
				if (doujinRelease) genres.pushUniqueCaseless('Doujin');
				// Right column
				response.document.querySelectorAll('td#rightcolumn .label').forEach(function(label) {
					switch (label.textContent.trim().toLowerCase()) {
						case 'category': genres.pushUniqueCaseless(label.parentElement.lastChild.textContent.trim()); break;
					}
				});
				let credits = '';
				// Credits table
				for (let span of response.document.querySelectorAll('div#collapse_credits table > tbody > tr > td > span.label')) {
					let key = span.querySelector('span[lang="en"]') || span.querySelector('span:first-of-type'),
							value = span.parentElement.nextElementSibling;
					if (key != null && value != null) key = key.textContent.trim(); else continue;
					console.assert(value.tagName == 'TD', "value.tagName == 'TD'", value);
					credits += `\n[b]${key}[/b]: ${html2php(value, response.finalUrl)}`;
					let ar = artists[[
						[/\b(?:Performed|Performance)\b/i, 'Performer'],
						[/\b(?:Composed|Composition)\b/i, 'Composer'],
						[/\b(?:Arranged|Arrangement)\b/i, 'Arranger'],
					].reduce((acc, subst) => acc.replace(...subst), key).toLowerCase()];
					if (Array.isArray(ar)) getArtists(value).forEach(artist => { ar.pushUniqueCaseless(artist) });
				}
				isVA = /*artists['performer'].length <= 0
					|| */artists['performer'].length == 1 && vaParser.test(artists['performer'][0]);
				getDescription(response, 'div#notes', false);
				if (credits) description = '[b]Credits:[/b]\n' + credits + (description ? (function() {
					if (description.length > 300) description = '[hide=Notes]' + description + '[/hide]';
						else description = '[b]Notes:[/b]\n\n' + description;
					return '\n\n' + description;
				})() : '');
				if ((ref = response.document.querySelector('div#coverart')) != null
						&& /\burl\s*\(\"(.*)"\)/i.test(ref.style['background-image'])) imgUrl = RegExp.$1;
				let mainArtist = ['artist', 'performer', 'vocals', 'cast', 'music', 'composer']
					.reduce((acc, role) => Array.isArray(acc) && acc.length > 0 ? acc : artists[role], undefined);
				if (!Array.isArray(mainArtist) || mainArtist.length <= 0) {
					mainArtist = undefined;
					addMessage(new HTML('VGMdb: can not extract anything as main artist (<a href="' + response.finalUrl +
						'" target="_blank" style="' + hyperlinkStyle + '">' + identifiers.VGMDB_ID + '</a>)'), 'notice');
					console.warn('VGMdb: can not extract anything as main artist', artists);
				}
				for (let node of response.document.querySelectorAll('div#tracklist > span > span > b')) {
					discSubtitle = node.innerText.trim();
					guessDiscNumber();
					node = node.parentElement;
					while (node != null && node.tagName != 'TABLE') node = node.nextElementSibling;
					if (node != null) addVolume(node);
				}
				const tl = Array.from(response.document.querySelectorAll('ul#tlnav > li > a'), a => a.innerText.trim());
				if (tl.length <= 1) return tracks;
				if ((i = tracks.length / tl.length) != Math.floor(i)) {
					console.warn('VGMdb: unexpected tracklist length:', i, tracks);
					return tracks;
				}
				const findIndex = lang => tl.findIndex(RegExp.prototype.test.bind(new RegExp('^(?:' + lang + ')\\b', 'i')));
				let enIndex = findIndex('English');
				if (enIndex < 0) enIndex = findIndex('Romaji');
				if (enIndex < 0) return tracks.slice(0, i);
				let jpIndex = findIndex('Japanese');
				if (jpIndex < 0) jpIndex = findIndex('Kanji');
				if (jpIndex < 0) jpIndex = enIndex > 0 ? 0 : 1;
				return tracks.slice(enIndex * i, (enIndex + 1) * i).map(function(track, ndx) {
					const rx = /^(.+?)(?:\s+\(([^\(\)]+)\))?$/;
					if (!track.title) track.title = tracks[jpIndex * i + ndx].title;
					else if ((jpTitle = tracks[jpIndex * i + ndx].title) != track.title) {
						track.title += ' (';
						var enTitle = rx.exec(track.title), jpTitle = rx.exec(jpTitle);
						if (jpTitle[1] != enTitle[1]) {
							track.title += jpTitle[1];
							if (jpTitle[2] && jpTitle[2] != enTitle[2]) track.title += ' (' + jpTitle[2] + ')';
						} else track.title += jpTitle[2];
						track.title += ')';
					}
					return track;
				});
			}); else if (url.hostname.endsWith('tidal.com')) {
				function getArtists(root, type) {
					if (!root || !Array.isArray(root.artists)) return [ ];
					type = qbRoleNormalizer(type || 'MAIN');
					return root.artists.filter(artist => qbRoleNormalizer(artist.type || 'MAIN') == type)
						.map(artist => artist.name.consolidateWhitespace());
				}

				if ((matches = /\/album\/(\d+)\b/i.exec(url.pathname) || /\b(?:albumId)=(\d+)\b/i.exec(url.search)) == null)
					return Promise.reject('Fetching from this page is not supported');
				return Promise.all([
					tidalAccess.requestAPI('albums/' + matches[1]),
					tidalAccess.requestAPI('albums/' + matches[1] + '/credits').catch(reason => ({ })),
					tidalAccess.requestAPI('albums/' + matches[1] + '/review').catch(reason => ({ })),
					tidalAccess.requestAPI('albums/' + matches[1] + '/tracks', { limit: 9999 }),
					tidalAccess.requestAPI('albums/' + matches[1] + '/items/credits', { limit: 100 }),
					tidalAccess.requestAPI('pages/album', { albumId: matches[1] }),
				]).then(function(metadata) {
					function findModule(type) {
						for (let row of metadata[5].rows) {
							let result = row.modules.find(module => module.type == type);
							if (result != undefined) return result;
						}
						return null;
					}

					if (prefs.diag_mode) console.debug('Tidal metadata loaded:', metadata);
					identifiers.TIDAL_ID = metadata[0].id;
					isVA = vaParser.test(metadata[0].artist.name);
					if ((artist = getArtists(metadata[0], 'MAIN')).length <= 0)
						artist = [metadata[0].artist.name.consolidateWhitespace()];
					const albumGuests = getArtists(metadata[0], 'FEATURED').concat(getArtists(metadata[0], 'FEATURED ARTIST'));
					if (metadata[0].type && metadata[0].type.toUpperCase() != 'ALBUM') identifiers.RELEASETYPE = metadata[0].type;
					if ('explicit' in metadata[0]) identifiers.EXPLICIT = Number(metadata[0].explicit);
					if (metadata[0].upc) identifiers.UPC = metadata[0].upc;
					if (/^(?:(?:\([PC]\)|©|℗)\s+)?(?:(\d{4})\s+)?(.*)/.test(metadata[0].copyright)) {
						//if (RegExp.$1) albumYear = parseInt(RegExp.$1);
						label = RegExp.$2;
					}
					const albumHeader = findModule('ALBUM_HEADER');
					if (albumHeader != null) description = albumHeader.description;
					if (metadata[2]/*albumHeader.review*/.text) {
						if (description) description += '\n\n';
						if (!metadata[2]/*albumHeader.review*/.source) description += '[b]Album Review[/b]\n\n';
						description += '[quote';
						if (metadata[2]/*albumHeader.review*/.source)
							description += '=Album review from ' + metadata[2]/*albumHeader.review*/.source;
						description += ']' + metadata[2]/*albumHeader.review*/.text + '[/quote]';
						description = description
							.replace(/\[wimpLink\s+artistId="(\d+)"\]/g, '[url=https://tidal.com/artist/$1]')
							.replace(/\[wimpLink\s+albumId="(\d+)"\]/g, '[url=https://tidal.com/album/$1]')
							.replace(/\[\/wimpLink\]/g, '[/url]');
					}
					if (Array.isArray(metadata[1]/*albumHeader.credits.items*/) && metadata[1]/*albumHeader.credits.items*/.length > 0) {
						let ac = '';
						metadata[1]/*albumHeader.credits.items*/.forEach(function(credit) {
							if (credit.type && qbRoleNormalizer(credit.type) == qbRoleNormalizer('Primary Artist')) return;
							// if (/^Record label$/i.test(credit.type)) {
							// 	label = credit.contributors.map(contributor => contributor.name).join(' / ');
							// 	return;
							// }
							ac += '\n' + credit.type + ' – ' + joinArtists(credit.contributors.map(contributor =>
								contributor.id ? contributor.name.bbUrl('https://tidal.com/artist/' + contributor.id)
									: contributor.name));
						});
						if (ac.length > 0) {
							if (description) {
								if (!metadata[2]/*albumHeader.review*/.text) description += '\n';
								description += '\n';
							}
							description += '[b]Additional Credits[/b]\n' + ac;
						}
					}
					if (metadata[0].cover) imgUrl = 'https://resources.tidal.com/images/' +
						metadata[0].cover.replace(/-/g, '/') + '/1280x1280.jpg';
					let albumItems = findModule('ALBUM_ITEMS'), channels;
					for (let ndx = 0; ndx < metadata[0].numberOfTracks; ++ndx)
						if (metadata[3].items[ndx] && metadata[4].items[ndx])
							metadata[3].items[ndx].credits = metadata[4].items[ndx].credits;
					return metadata[3].items.map(function(track, index) {
						trackIdentifiers = { TRACK_ID: track.id };
						if ('explicit' in track) trackIdentifiers.EXPLICIT = Number(track.explicit);
						if ('isrc' in track) trackIdentifiers.ISRC = track.isrc;
						title = track.title;
						if (track.version) title += ' (' + track.version + ')';

						const personnel = [ ];
						for (let ndx = 0; ndx < qobuzArtistLabels.length; ++ndx) personnel[ndx] = [ ];
						// if (track.credits) for (let credit of track.credits)
						// 	qobuzArtistLabels.forEach(function(roles, index) {
						// 		if (roles.some(role => qbRoleNormalizer(role) == qbRoleNormalizer(credit.type)))
						// 			personnel[index].pushUniqueCaseless(...credit.contributors.map(contributor => contributor.name));
						// 	});
						if (track.credits) for (let credit of track.credits) {
							const ndx = qbGetCategoryIndex(credit.type);
							personnel[ndx >= 0 ? ndx : 16].pushUniqueCaseless(...credit.contributors
								.map(contributor => contributor.name.consolidateWhitespace()));
						}

						personnel.mainArtists = qbGetArtistsOfRole(personnel, 0);
						for (let ndxs of mainArtistIndexes) if (personnel.mainArtists.length <= 0) for (let ndx of ndxs)
							Array.prototype.pushUniqueCaseless.apply(personnel.mainArtists, personnel[ndx].filter(realArtistName));
						if ((trackArtist = getArtists(track, 'MAIN')).length > 0) {
							for (let artist of trackArtist.reverse())
								if (realArtistName(artist) && !personnel.mainArtists.includesCaseless(artist))
									personnel.mainArtists.unshift(artist);
						} else if (realArtistName(track.artist.name = track.artist.name.consolidateWhitespace())
								&& !personnel.mainArtists.includesCaseless(track.artist.name))
							personnel.mainArtists.unshift(track.artist.name);

						personnel.guests = qbGetArtistsOfRole(personnel, 7, 'mainArtists');
						if ((trackArtist = getArtists(track, 'FEATURED').concat(getArtists(track, 'FEATURED ARTIST'))).length > 0)
							for (let artist of trackArtist.reverse())
								if (realArtistName(artist) && !personnel.guests.includesCaseless(artist)) personnel.guests.unshift(artist);
						featArtistParsers.forEach(function(rx, index) {
							if (index <= 0) return;
							const matches = rx.exec(title);
							if (matches == null) return;
							const guestArtists = splitAmpersands(matches[2]).map(artist => artist.consolidateWhitespace()).filter(realArtistName);
							if (index > 5 && !guestArtists.every(artist => personnel.some(result => result.includesCaseless(artist)))) return;
							Array.prototype.pushUniqueCaseless.apply(personnel.guests, guestArtists);
							title = title.replace(rx, '');
						});

						personnel.remixers = qbGetArtistsOfRole(personnel, 11, 'mainArtists');
						if (personnel.remixers.length <= 0) personnel.remixers = getArtists(track, 'REMIXER');

						//if (prefs.diag_mode) console.debug('Tidal track', index + 1, personnel);
						trackArtist = personnel.mainArtists.length > 0 && !isVA && artistsMatch([getArtists(track, 'MAIN'),
							getArtists(track, 'FEATURED').concat(getArtists(track, 'FEATURED ARTIST'))], [artist, albumGuests]);
						channels = undefined;
						track.audioModes.forEach(function(audioMode) {
							switch (audioMode.toLowerCase()) {
								case 'stereo': channels = 2; break;
								default: if (/\b(\d+)\.(\d+)\b/.test(audioMode)) channels = parseInt(RegExp.$1) + parseInt(RegExp.$2);
							}
						});
						return {
							artist: isVA ? VA : undefined,
							artists: !isVA && artist.length > 0 ? artist : undefined,
							featured_artists: artist.length > 0 && albumGuests.length > 0 ? albumGuests : undefined,
							album: metadata[0].title,
							album_year: albumYear,
							release_date: metadata[0].releaseDate,
							label: label,
							media: media,
							disc_number: track.volumeNumber,
							total_discs: metadata[0].numberOfVolumes,
							//disc_subtitle: discSubtitle,
							track_number: track.trackNumber,
							total_tracks: metadata[0].numberOfTracks,
							title: title,
							track_artists: trackArtist && personnel.mainArtists.length > 0 ? personnel.mainArtists : undefined,
							track_guests: trackArtist && personnel.mainArtists.length > 0 && personnel.guests.length > 0 ?
								personnel.guests : undefined,
							composers: personnel[9].length > 0 ? personnel[9] : undefined,
							conductors: personnel[10].length > 0 ? personnel[10] : undefined,
							remixers: personnel.remixers.length > 0 ? personnel.remixers : undefined,
							//producers: personnel[12].length > 0 ? personnel[12] : undefined,
							arrangers: personnel[13].length > 0 ? personnel[13] : undefined,
							// performers: personnel[0].concat(personnel[qobuzArtistLabels.length], personnel.slice(2, 9))
							// 	.flatten().distinctValues(),
							encoding: ['HI_RES', 'LOSSLESS'].includes(track.audioQuality) ? 'lossless' : undefined,
							duration: track.duration,
							channels: channels,
							track_gain: 'replayGain' in track ? track.replayGain : undefined,
							track_peak: 'peak' in track ? track.peak : undefined,
							description: description,
							url: !identifiers.TIDAL_ID && metadata[0].url || undefined,
							identifiers: mergeIds(),
							cover_url: imgUrl,
						};
					});
				});
			} else if (url.hostname.endsWith('ototoy.jp')) return globalXHR(url).then(function(response) {
				if (/\/p\/(\d+)(?=\/|\?|$)/i.test(response.finalUrl)) identifiers.OTOTOY_ID = parseInt(RegExp.$1);
				artist = Array.from(response.document.querySelectorAll('span.album-artist > *'))
					.map(node => node.textContent.trim());
				isVA = artist.length <= 0 || artist.length == 1 && vaParser.test(artist[0]);
				if ((ref = response.document.querySelector('h1.album-title')) != null) album = ref.textContent.trim();
				if ((ref = response.document.querySelector('p.hqd-logo > span')) != null && (matches = /^(?:Audio\s+Format)\s*:\s*(.+)$/i.exec(ref.textContent.trim())) != null) {
					if (/\b(\d+)[\s\-]?bit\s*\b/i.test(matches[1])) bitdepth = parseInt(RegExp.$1);
					if (/\b(\d+(?:\.\d+)?)\s*kHz\b/i.test(matches[1])) samplerate = parseFloat(RegExp.$1) * 1000;
				}
				if (bitdepth >= 16) encoding = 'lossless';
				if ((ref = response.document.querySelector('p.hqd-logo > a.lossless, p.hqd-logo > a.highres')) != null)
					encoding = 'lossless';
				if ((ref = response.document.querySelector('p.release-day')) != null && /\b(\d{4})-(\d{2})-(\d{2})\b/.test(ref.textContent))
					releaseDate = RegExp.lastMatch;
				label = Array.from(response.document.querySelectorAll('p.label-name > a')).map(a => a.textContent.trim()).join(' / ');
				if ((ref = response.document.querySelector('p.catalog-id')) != null && /\b(?:Catalog\s+number):\s*(.*)$/i.test(ref.textContent.trim()))
					catalogue = RegExp.$1;
				genres = Array.from(response.document.querySelectorAll('ul.tag-cloud > li > a.oty-btn-tag'))
					.map(a => a.textContent.trim()).filter(genre => genre.length > 0);
				getDescription(response, 'div.album-addendum > div.addendum-box', false);
				if ((ref = response.document.querySelector('div#jacket-full-wrapper > img')) != null)
					imgUrl = ref.dataset.src || ref.src;
				trs = response.document.querySelectorAll('table#tracklist > tbody > tr[class]');
				return Array.from(trs).map(function(tr, ndx) {
					trackIdentifiers = {};
					title = (ref = tr.querySelector('td.item > span[id^="title-"]')) != null ? ref.textContent.trim() : undefined;
					if (ref != null && /^title-(\d+)$/.test(ref.id)) trackIdentifiers.TRACK_ID = parseInt(RegExp.$1);
					trackArtist = Array.from(tr.querySelectorAll('td.item > span > a.artist')).map(a => a.textContent.trim());
					return {
						artist: isVA ? VA : undefined,
						artists: !isVA ? artist : undefined,
						album: album,
						album_year: extractYear(releaseDate),
						release_date: releaseDate,
						label: label,
						catalog: catalogue,
						media: media,
						genre: genres.join('; '),
						disc_number: discNumber,
						track_number: ndx + 1,
						total_tracks: trs.length,
						samplerate: samplerate || undefined,
						bitdepth: bitdepth,
						encoding: encoding,
						title: title,
						track_artists: trackArtist.length > 0 && (isVA || !trackArtist.equalCaselessTo(artist)) ?
						trackArtist : undefined,
						duration: (ref = tr.querySelector(':scope > td.item:nth-of-type(3)')) != null ? timeStringToTime(ref.textContent) : undefined,
						description: description,
						url: !identifiers.OTOTOY_ID ? response.finalUrl : undefined,
						cover_url: imgUrl,
						identifiers: mergeIds(),
					};
				});
			}); else if (url.hostname.endsWith('music.yandex.ru') && (/\/album\/(\d+)\b/i.test(url.pathname)
					|| /\b(?:album)=(\d+)\b/i.test(url.search))) return globalXHR('https://music.yandex.ru/handlers/album.jsx?album=' + RegExp.$1, { responseType: 'json' }).then(function({response}) {
				if (prefs.diag_mode) console.debug('Yandex Music metadata received:', response);
				if (response.metaType && response.metaType != 'music') throw 'Not a music release';
				identifiers.YANDEX_ID = response.id;
				if (response.type) identifiers.RELEASETYPE = response.type;
				artist = response.artists.filter(artist => !artist.composer).map(artist => artist.name);
				composer = response.artists.filter(artist => artist.composer).map(artist => artist.name);
				isVA = response.artists.length <= 0
					|| response.artists.length == 1 && response.artists.some(artist => artist.various);
				album = response.title;
				if (response.version) album += ' (' + response.version + ')';
				response.volumes.forEach(function(volume, discNumber) {
					Array.prototype.push.apply(tracks, volume.filter(track => track.type == 'music').map(function(track, trackNumber) {
						trackIdentifiers = { TRACK_ID: parseInt(/*track.realId || */track.id) };
						title = track.title;
						if (track.version) title += ' (' + track.version + ')';
						trackArtist = track.artists.filter(artist => !artist.composer).map(artist => artist.name);
						let trackComposer = track.artists.filter(artist => artist.composer).map(artist => artist.name);
						return {
							artist: isVA ? VA : undefined,
							artists: !isVA ? artist : undefined,
							album: album,
							album_year: response.year,
							release_date: response.releaseDate.replace(/T.*$/, ''),
							label: response.labels.map(label => label.name).join(' / '),
							media: media,
							genre: response.genre,
							track_number: trackNumber + 1,
							total_tracks: response.trackCount,
							composers: trackComposer.length > 0 ? trackComposer : composer,
							disc_number: discNumber + 1,
							total_discs: response.volumes.length,
							title: title,
							track_artists: trackArtist.length > 0 && (isVA || !trackArtist.equalCaselessTo(artist)) ?
							trackArtist : undefined,
							duration: track.durationMs / 1000,
							track_gain: track.normalization ? track.normalization.gain : undefined,
							track_peak: track.normalization ? track.normalization.peak : undefined,
							cover_url: 'https://' + response.coverUri.replace('/%%', '/m1000x1000'),
							identifiers: mergeIds(),
						};
					}));
				});
				return tracks;
			}); else if (url.hostname.endsWith('mora.jp') ) return loadMoraMetadata(url).then(function(packageMeta) {
				if (prefs.diag_mode) console.debug('Mora.jp metadata loaded:', packageMeta);
				if ([7].includes(packageMeta.mediaType)) throw 'Not music release (' + packageMeta.mediaType + ')';
				artist = fmtKanaProp(packageMeta, 'artistName');
				isVA = vaParser.test(artist);
				album = fmtKanaProp(packageMeta, 'title');
				if (packageMeta.distPartNo) catalogue = packageMeta.distPartNo.replace(/_\S+$/, '');
				if (packageMeta.cdPartNo && packageMeta.cdPartNo != packageMeta.distPartNo && packageMeta.cdPartNo != catalogue)
					catalogue = packageMeta.cdPartNo + ' / ' + catalogue; // packageMeta.packageId
				if (packageMeta.bitPerSample) bitdepth = parseInt(packageMeta.bitPerSample);
				if (packageMeta.samplingFreq) samplerate = parseInt(packageMeta.samplingFreq);
				if (packageMeta.channelConf) channels = parseInt(packageMeta.channelConf);
				if (packageMeta.materialNo) identifiers.MORA_ID = parseInt(packageMeta.materialNo);
				if (packageMeta.msin) identifiers.MSIN = packageMeta.msin;
				if (packageMeta.distPartNo) identifiers.DISTPARTNO = packageMeta.distPartNo;
				if (packageMeta.fullsizeimage) imgUrl = packageMeta.packageUrl + packageMeta.fullsizeimage;
				return packageMeta.trackList.map(function(track) {
					trackIdentifiers = { TACK_ID: track.musicId, MSIN: track.msin, DISTPARTNO: track.distPartNo };
					if (track.labelId) trackIdentifiers.LABEL_ID = track.labelId;
					trackArtist = fmtKanaProp(track, 'artistName');
					composer = fmtKanaProp(track, 'composer');
					var trackLyricist = fmtKanaProp(track, 'lyrics');
					if (trackLyricist) if (composer) composer += ' / ' + trackLyricist; else composer = trackLyricist;
					switch (track.mediaFormatNo) {
						case 10: format = 'AAC'; encoding = 'lossy'; var codecProfile = 'AAC-LC'; bitrate = 320; break;
							//case 11: format = 'FLAC'; encoding = 'lossless'; codecProfile = undefined; bitrate = undefined; break;
						case 12: format = 'FLAC'; encoding = 'lossless'; codecProfile = undefined; bitrate = undefined; break;
						case 13: format = 'DSD'; encoding = 'lossless'; codecProfile = undefined; bitrate = undefined; break;
						default: format = undefined; encoding = undefined; codecProfile = undefined; bitrate = undefined;
					}
					return {
						artist: isVA ? VA : artist,
						album: album,
						//album_year: extractYear(releaseDate),
						release_date: packageMeta.dispStartDate || packageMeta.dispStartDateStr || packageMeta.startDate,
						label: packageMeta.labelcompanyname || packageMeta.displayLabelname || packageMeta.labelname,
						catalog: catalogue,
						media: media,
						genre: genres.join('; '),
						codec: format,
						codec_profile: codecProfile,
						encoding: encoding,
						bitrate: /*track.bitPerSample * 1000 || */bitrate,
						bitdepth: parseInt(track.bitPerSample) || bitdepth,
						samplerate: parseInt(track.samplingFreq) || samplerate,
						channels: parseInt(track.channelConf) || channels,
						track_number: track.trackNo,
						total_tracks: packageMeta.trackList.length,
						composer: composer,
						producer: fmtKanaProp(track, 'producer'),
						arranger: fmtKanaProp(track, 'arranger'),
						title: fmtKanaProp(track, 'title'),
						track_artist: trackArtist && (isVA || !artistsMatch(trackArtist, artist)) ? trackArtist : undefined,
						duration: track.duration,
						description: packageMeta.metaDescription,
						url: packageMeta.webUrl,
						cover_url: imgUrl,
						identifiers: mergeIds(),
						master: packageMeta.master,
					};
				});

				function fmtKanaProp(obj, propName) {
					let result = (obj[propName] || '').trim(), kana = (obj[propName + 'Kana'] || '').trim();
					if (kana && prefs.use_kana) if (result) result += ' (' + kana + ')'; else result = kana;
					return result || undefined;
				}
			}); else if (url.hostname.endsWith('allmusic.com') && url.pathname.startsWith('/album/')) {
				const idExtractor = (url, entity) => url && entity
					&& (entity = new RegExp(`\\bm${entity}\\d{10}\\b`, 'i').exec(url)) != null ? entity[0] : undefined;
				const allMusicId = idExtractor(url.pathname, 'r') || idExtractor(url.pathname, 'w');
				if (allMusicId) return (function getReleaseMeta(allMusicId) {
					if (!allMusicId) throw 'Invalid argument';
					const origin = 'https://www.allmusic.com';
					const idExtractor = (url, entity) => url && entity
						&& (entity = new RegExp(`\\bm${entity}\\d{10}\\b`, 'i').exec(url)) != null ? entity[0] : undefined;
					return globalXHR(origin + '/album/release/' + allMusicId).then(function(response) {
						function coverResolver(element) {
							if (element instanceof HTMLImageElement) try {
								if (!(element = new URL(element.src)).pathname.includes('/images/no_image/')) {
									element.searchParams.set('f', 0);
									return element.href;
								}
							} catch(e) { console.warn(e) }
						}
						function trackListingAdapter(body) {
							if (!(body instanceof HTMLBodyElement)) return null;
							const media = Array.from(body.querySelectorAll('div#trackListing div.disc'), function(disc) {
								const medium = {
									title: textResolver(disc.querySelector(':scope > h3')),
									tracks: Array.from(disc.querySelectorAll(':scope > div.track'), track => ({
										trackNum: textResolver(track.querySelector('div.trackNum')),
										title: textResolver(track.querySelector('div.title > a:first-of-type')),
										artists: Array.from(track.querySelectorAll('div.performer > a'), artistMapper),
										featArtists: Array.from(track.querySelectorAll('span.featuring > a'), artistMapper),
										composers: Array.from(track.querySelectorAll('div.composer > a'), artistMapper),
										duration: textResolver(track.querySelector('div.duration')),
									})),
								};
								if (medium.title && !(medium.title = medium.title.replace(/^Disc\s+\d+(?:\s*[:\-])?\s*/, '')))
									medium.title = undefined;
								return medium.tracks.length > 0 ? medium : null;
							});
							return media.filter(Boolean).length > 0 ? media : null;
						}
						function creditsAdapter(body) {
							if (!(body instanceof HTMLBodyElement)) return null;
							const credits = { artists: [ ], featArtists: [ ], extraArtists: { } };
							body.querySelectorAll('table.creditsTable > tbody > tr').forEach(function(tr) {
								const artists = Array.from(tr.querySelectorAll('td.singleCredit > span > a'), artistMapper);
								if (artists.length <= 0) return;
								let artistCredits = textResolver(tr.querySelector('span.artistCredits')) || 'Primary Artist';
								artistCredits = artistCredits.split(',').map(artist => artist.trim()/*.toLowerCase()*/);
								for (let artistCredit of artistCredits) switch (artistCredit) {
									case 'Primary Artist': Array.prototype.push.apply(credits.artists, artists); break;
									case 'Featured Artist': Array.prototype.push.apply(credits.featArtists, artists); break;
									default:
										if (!(artistCredit in credits.extraArtists)) credits.extraArtists[artistCredit] = [ ];
										Array.prototype.push.apply(credits.extraArtists[artistCredit], artists);
								}
							});
							return credits;
						}
						function urlResolver(elem) {
							if (elem instanceof HTMLElement) try { return new URL(elem.getAttribute('href'), origin).href }
								catch(e) { console.warn(e) }
						}

						const ajaxAdapter = url => globalXHR(url, { headers: { Referer: response.finalUrl } })
								.then(({document}) => document ? document.body : null, function(reason) {
							console.warn(reason);
							return null;
						});
						const reviewAdapter = body => body instanceof HTMLBodyElement ?
							body.querySelector('div#review') : null;
						const textResolver = elem => elem instanceof Element ? elem.textContent.trim() : undefined;
						const artistMapper = elem => elem instanceof Element ? {
							id: idExtractor(elem.href, 'n'),
							name: textResolver(elem),
							url: urlResolver(elem),
						} : undefined;
						const body = response.document.body, release = {
							id: idExtractor(response.finalUrl, 'r'),
							title: textResolver(body.querySelector('h1#releaseTitle')),
							artists: Array.from(body.querySelectorAll('div#releaseHeadline > h2 > a'), artistMapper),
							date: textResolver(body.querySelector('div#basicInfoMeta > div.releaseDate > span')),
							format: textResolver(body.querySelector('div#basicInfoMeta > div.format > span')),
							labels: Array.from(body.querySelectorAll('div#basicInfoMeta > div.label a'), artistMapper),
							catalogNumber: textResolver(body.querySelector('div#basicInfoMeta > div.catalogNumber > span')),
							genres: Array.from(body.querySelectorAll('div#basicInfoMeta > div.genre a'), textResolver),
							styles: Array.from(body.querySelectorAll('div#basicInfoMeta > div.styles a'), textResolver),
							releaseTypes: textResolver(body.querySelector('div#basicInfoMeta > div.releaseInfo > div')),
							recordingDate: textResolver(body.querySelector('div.recording-date > div')),
							recordingLocations: Array.from(body.querySelectorAll('div#basicInfoMeta > div.recordingLocation > div:not([id])'), textResolver),
							cover: coverResolver(body.querySelector('div#releaseCover img')),
							url: response.finalUrl,
						};
						let mainAlbum = body.querySelector('div#mainAlbumMeta a');
						if (mainAlbum != null) mainAlbum = urlResolver(mainAlbum);
						mainAlbum = mainAlbum ? Promise.all([
							globalXHR(mainAlbum).then(response => ({
								id: idExtractor(response.finalUrl, 'w'),
								url: response.finalUrl,
								title: textResolver(response.document.body.querySelector('h1#albumTitle')),
								artists: Array.from(response.document.body.querySelectorAll('h2#albumArtists > a'), artistMapper),
								date: textResolver(response.document.body.querySelector('div#basicInfoMeta > div.release-date > span')),
								genres: Array.from(response.document.body.querySelectorAll('div#basicInfoMeta > div.genre a'), textResolver),
								styles: Array.from(response.document.body.querySelectorAll('div#basicInfoMeta > div.styles a'), textResolver),
								recordingDate: textResolver(response.document.body.querySelector('div.recording-date > div')),
								recordingLocations: Array.from(response.document.body.querySelectorAll('div#basicInfoMeta > div.recording-location > div:not([id])'), textResolver),
								cover: coverResolver(response.document.body.querySelector('div#albumCover img')),
							})).catch(function(reason) {
								console.warn(reason);
								return null;
							}),
							ajaxAdapter(mainAlbum + '/trackListingAjax').then(trackListingAdapter),
							ajaxAdapter(mainAlbum + '/creditsAjax').then(creditsAdapter),
							ajaxAdapter(mainAlbum + '/reviewAjax').then(reviewAdapter),
						]).then(([mainAlbum, media, artistCredits, review]) => mainAlbum && Object.assign(mainAlbum, {
							media: media,
							artistCredits: artistCredits,
							review: review,
						})) : Promise.resolve(null);
						let [trackListingAjax, creditsAjax, reviewAjax] = ['trackListingAjax', 'creditsAjax', 'reviewAjax']
							.map(ajax => ajaxAdapter(response.finalUrl + '/' + ajax));
						trackListingAjax = trackListingAjax.then(trackListingAdapter);
						creditsAjax = creditsAjax.then(creditsAdapter);
						reviewAjax = reviewAjax.then(reviewAdapter);
						if (release.releaseTypes && (release.releaseTypes = release.releaseTypes.split(/\r?\n/)
								.map(releaseType => releaseType.trim()).filter(Boolean)).length <= 0)
							release.releaseTypes = undefined;
						return Promise.all([release, mainAlbum, trackListingAjax, creditsAjax, reviewAjax]);
					}).then(([release, mainAlbum, media, artistCredits, review]) => Object.freeze(Object.assign(release, {
						mainAlbum: Object.freeze(mainAlbum),
						media: Object.freeze(media),
						artistCredits: Object.freeze(artistCredits),
						review: Object.freeze(review),
					})));
				})(allMusicId).then(function(release) {
					function addReleaseInfo(propName, label) {
						if (release.mainAlbum != null && release.mainAlbum[propName] || release[propName])
							releaseInfo.push(`[b]${label}:[/b] ${release.mainAlbum != null && release.mainAlbum[propName] || release[propName]}`);
					}

					if (prefs.diag_mode) console.debug('AllMusic release metadata:', release);
					media = release.media || release.mainAlbum != null && release.mainAlbum.media;
					if (media == null) return Promise.reject('No tracks found');
					let artistCredits = release.artistCredits, recordingLocations;
					if (artistCredits == null || Object.keys(artistCredits.extraArtists).length <= 0)
						artistCredits = release.mainAlbum && release.mainAlbum.artistCredits;
					const review = release.mainAlbum && release.mainAlbum.review || release.review;
					if (release.id) identifiers.ALLMUSIC_ID = release.id;
					const nameResolver = entry => entry.name, releaseInfo = [ ];
					isVA = release.artists.length <= 0 || release.artists.length == 1
						&& vaParser.test(nameResolver(release.artists[0]));
					if (release.releaseTypes) identifiers.RELEASETYPE = release.releaseTypes[0];
					description = [ ];
					if (review != null) description.push('[quote]' + html2php(review, release.url).trim() + '[/quote]');
					addReleaseInfo('recordingDate', 'Recording date');
					if ((recordingLocations = release.recordingLocations).length > 0 || release.mainAlbum != null
							&& (recordingLocations = release.mainAlbum.recordingLocations).length > 0)
						releaseInfo.push('[b]Recording locations:[/b] ' + recordingLocations.join('; '));
					if (releaseInfo.length > 0) description.push(releaseInfo.join('\n'));
					if (artistCredits != null && Object.keys(artistCredits.extraArtists).length > 0) {
						artistCredits = Object.keys(artistCredits.extraArtists).map(credit =>
								`[b]${credit}:[/b] ${release.artistCredits.extraArtists[credit].map(artist =>
									`[artist]${artist.name}[/artist]`).join(', ')}`);
						description.push(artistCredits.length > 20 ? '[hide=Artist credits]' + artistCredits.join('\n') +
							'[/hide]' : '[b][u]Artist credits[/u][/b]\n\n' + artistCredits.join('\n'));
					}
					if (release.mainAlbum != null) description.push(`[url=${release.mainAlbum.url}]AllMusic[/url]`);
					return Array.prototype.concat.apply([ ], media.map((medium, mediaIndex) => medium.tracks.map(function(track, trackIndex) {
						const sameArtists = propName => propName && [track, release].every((entity1, ndx, array) =>
							array.every(entity2 => (entity2[propName] || [ ]).every(ra => (entity1[propName] || [ ])
								.some(ta => ((...artists) => artists && artists.length > 0 && (prop => artists.every(artist1 =>
									artists.every(artist2 => artist2[prop] == artist1[prop])))
										(artists.every(artist => artist.id) ? 'id' : 'name'))(ta, ra)))));
						const useTA = isVA || !['artists', 'featArtists'].every(sameArtists);
						return {
							artist: isVA ? VA : undefined,
							artists: !isVA ? release.artists.map(nameResolver) : undefined,
							album: release.title,
							release_date: normalizeDate(release.date) || undefined,
							album_year: release.mainAlbum != null && release.mainAlbum.date
								&& extractYear(release.mainAlbum.date) || undefined,
							genre: (release.mainAlbum != null ? release.mainAlbum.genres : [ ]).concat(release.genres,
								(release.mainAlbum != null ? release.mainAlbum.styles : [ ]), release.styles).join('; ') || undefined,
							label: release.labels.map(nameResolver).join(' / ') || undefined,
							catalog: release.catalogNumber,
							media: release.format,
							disc_number: mediaIndex + 1,
							disc_subtitle: medium.title,
							total_discs: media.length,
							track_number: track.trackNum,
							total_tracks: media.reduce((tt, medium) => tt + medium.tracks.length, 0),
							title: track.title,
							track_artists: useTA ? track.artists.map(nameResolver) : undefined,
							track_guests: useTA ? track.featArtists.map(nameResolver) : undefined,
							composers: track.composers && track.composers.length > 0 ? track.composers.map(nameResolver)
								: release.artistCredits != null && 'Composer' in release.artistCredits ?
									release.artistCredits.Composer.map(nameResolver) : undefined,
							duration: timeStringToTime(track.duration) || undefined,
							description: description.join('\n\n') || undefined,
							url: !identifiers.ALLMUSIC_ID ? release.url : undefined,
							cover_url: release.cover || release.mainAlbum != null && release.mainAlbum.cover || undefined,
							identifiers: mergeIds(),
						};
					})));
				}); else throw 'Not a valid AllMusic release url';
			} else if (url.hostname.endsWith('bleep.com')) return globalXHR(url).then(function(response) {
				if (/\/release\/(\d+)/i.test(response.finalUrl)) identifiers.BLEEP_ID = parseInt(RegExp.$1);
				artist = Array.from(response.document.querySelectorAll('div.product-details dl > dd.artist > a'))
					.map(a => a.title || a.textContent.trim());
				isVA = artist.length <= 0 || artist.length == 1 && vaParser.test(artist[0]);
				if ((ref = response.document.querySelector('div.product-details dl > dd.release-title')) != null)
					album = ref.textContent.trim();
				label = Array.from(response.document.querySelectorAll('div.product-details dl > dd.label > a'))
					.map(a => a.title || a.textContent.trim()).join(' / ');
				if ((ref = response.document.querySelector('div.product-details dl > dd.catalogue-number')) != null)
					catalogue = ref.textContent.trim();
				if ((ref = response.document.querySelector('div.product-details dl > dd.product-release-date')) != null)
					releaseDate = normalizeDate(ref.textContent.trim());
				genres = Array.from(response.document.querySelectorAll('ul.tag-list > li > a.tag'))
					.map(a => a.textContent.trim()).filter(genre => !genre.startsWith('Album of'));
				getDescription(response, 'article[itemprop="description"]', false);
				imgUrl = response.document.body.querySelector('div.overlay-images li.current > img')
					|| response.document.querySelector('img[itemprop="image"]');
				if (imgUrl != null) imgUrl = imgUrl.src;
					else imgUrl = (imgUrl = response.document.head.querySelector('meta[property="og:image"][content]')) != null ?
						imgUrl.content : undefined;
				imgUrl = imgUrl && imgUrl.replace(/\/r\/[a-z]\//i, '/r/') || undefined;
				trs = response.document.querySelectorAll('ol.track-list > li.track');
				return Array.from(trs).map(function(tr, ndx) {
					trackIdentifiers = {};
					trackArtist = Array.from(tr.querySelectorAll('span.track-artist > a[itemprop="byArtist"]'))
						.map(a => a.title || a.textContent.trim());
					return {
						artist: isVA ? VA : undefined,
						artists: !isVA ? artist : undefined,
						album: album,
						release_date: releaseDate,
						label: label,
						catalog: catalogue,
						genre: genres.join('; '),
						media: media,
						track_number: (ref = tr.querySelector('span.track-number')) != null ? parseInt(ref.textContent) : undefined,
						total_tracks: trs.length,
						title: (ref = tr.querySelector('span.track-name span[itemprop="name"]')) != null ?
						ref.textContent.trim() : undefined,
						track_artists: trackArtist.length > 0 && (isVA || !trackArtist.equalCaselessTo(artist)) ?
						trackArtist : undefined,
						duration: (ref = tr.querySelector('span.track-duration')) != null ?
						timeStringToTime(ref.textContent) : undefined,
						description: description,
						url: !identifiers.BLEEP_ID ? response.finalUrl : undefined,
						cover_url: imgUrl,
						identifiers: mergeIds(),
					};
				});
			}); else if (url.hostname.endsWith('boomkat.com') && url.pathname.startsWith('/products/')) return globalXHR(url).then(function(response) {
				artist = Array.from(response.document.querySelectorAll('div#right_content > h1.detail--artists > a'))
					.map(a => a.textContent.trim());
				isVA = artist.length <= 0 || artist.length == 1 && vaParser.test(artist[0]);
				if ((ref = response.document.querySelector('div#right_content > h2.detail_album')) != null) album = ref.textContent.trim();
				genres = Array.from(response.document.querySelectorAll('div#right_content > div.product-note > span:last-of-type'))
					.map(a => a.textContent.trim().replace(/^(?:Genre)\s*:\s*/i, ''));
				getDescription(response, response.document.querySelector('div.show-for-medium-up > div.product-review'), true);
				if ((ref = response.document.querySelector('img[itemprop="image"]')) != null)
					imgUrl = ref.src.replace(/\/(?:large)\//i, '/original/');
				var m = /#v\d+/.exec(url);
				if (m == null) return Promise.reject('Use tab link for specific medium');
				if ((ref = response.document.querySelector('li.tab-title > a[href="' + m[0] + '"]')) != null) {
					releaseDate = ref.dataset.releaseDate;
					label = ref.dataset.label;
					catalogue = ref.dataset.catalogueNumber;
					switch (ref.textContent.trim()) {
						case 'FLAC': media = 'WEB'; encoding = 'lossless'; format = 'FLAC'; bitdepth = 16; break;
						case 'WAV': media = 'WEB'; encoding = 'lossless'; format = 'WAV'; bitdepth = 16; break;
						case 'MP3': media = 'WEB'; encoding = 'lossy'; format = 'MP3'; break;
						case 'CD': media = 'CD'; break;
						case 'Cassette': media = 'Cassette'; break;
						default:
							if (/(?:LP)$/.test(ref.textContent)) media = 'Vinyl'; break;
					}
				}
				if (media == 'WEB' && (ref = response.document.querySelector('div' + m[0] + ' p.product-extra-info')) != null
						&& /\b(\d+)\s+bit\s+audio\b/i.test(ref.textContent)) bitdepth = parseInt(RegExp.$1);
				if ((ref = response.document.querySelector('div > div.tabs-content > div' + m[0] + ' div.product-listing')) == null)
					return Promise.reject('Invalid page structure');
				return globalXHR('https://boomkat.com/tracklist/' + ref.dataset.releaseFormatId).then(function({document}) {
					trs = document.querySelectorAll('div.table.tracklist > div.track');
					return Array.from(trs).map(function(div, ndx) {
						trackIdentifiers = {
							//BOOMKAT_ID: parseInt(tr.dataset.audioPlayerRelease),
							//MEDIA_ID: parseInt(tr.dataset.audioPlayerReleaseFormat),
							//TRACK_ID: parseInt(tr.dataset.audioPlayerTrack),
						};
						trackArtist = div.dataset.artist;
						if ((ref = div.querySelector('span.title')) != null) {
							title = /^(?:(\d+)\.\s*)?(.*)$/.exec(ref.textContent.trim());
							trackNumber = parseInt(title[1]) || ndx + 1;
							title = title[2];
						} else title = trackNumber = undefined;
						return {
							artist: isVA ? VA : undefined,
							artists: !isVA ? artist : undefined,
							album: album,
							release_date: releaseDate,
							label: label,
							catalog: catalogue,
							genre: genres.join('; '),
							media: media,
							encoding: encoding,
							codec: format,
							bitdepth: bitdepth,
							samplerate: samplerate,
							track_number: trackNumber,
							total_tracks: trs.length,
							title: title,
							track_artist: trackArtist && (isVA || !artistsMatch(trackArtist, [artist])) ? trackArtist : undefined,
							duration: (ref = div.querySelector('span.time')) != null ? timeStringToTime(ref.textContent) : undefined,
							description: description,
							url: !trackIdentifiers.BOOMKAT_ID ? response.finalUrl : undefined,
							cover_url: imgUrl,
							identifiers: mergeIds(),
						};
					});
				});
			}); else if (url.hostname.endsWith('ecmrecords.com') && /^\/(?:catalogue|shop)\/(\d+)\b/i.test(url.pathname)) {
				const appLink = 'https://www.ecmrecords.com/app';
				let serial = parseInt(RegExp.$1), referer = 'https://www.ecmrecords.com/catalogue/' + serial;
				return Promise.all([
					globalXHR(`${appLink}/core/server_load.php?r=default&page=catalogue&serial=${serial}`, {
						responseType: 'json',
						headers: { Referer: referer },
					}).then(({response}) => response.items[0]),
					globalXHR(`${appLink}/ajax/get_related_artists.php?serial=${serial}&targetvar=related_artists_and_products`, {
						responseType: 'json',
						headers: { Referer: referer },
					}).then(({response}) => response.related_artists),
					globalXHR(`${appLink}/ajax/get_related_tracks.php?serial=${serial}&targetvar=parse_tracks`, {
						responseType: 'json',
						headers: { Referer: referer },
					}).then(({response}) => response),
				]).then(function(metaData) {
					if (prefs.diag_mode) console.debug('ECM metadata loaded:', metaData);
					identifiers.ECM_ID = metaData[0].serial;
					if (metaData[0].barcode) identifiers.BARCODE = metaData[0].barcode; else {
						i = metaData[0].multi_barcodes.toString().split('^');
						if (i.homogeneous()) identifiers.BARCODE = i[0];
					}
					artist = metaData[1].map(relArtist => relArtist.name);
					isVA = vaParser.test(metaData[0].main_artist);
					i = metaData[0].multi_articlecodes.toString().split('^');
					releaseDate = metaData[0].date_release || metaData[0].date_release_digital || metaData[0].date_release_presale
						|| metaData[0].date_release_expected || metaData[0].date_release_usa || metaData[0].date_release_uk
						|| metaData[0].date_release_jap || metaData[0].date_release_fr || metaData[0].date_release_de
						|| metaData[0].date_release_other; // ambiguity
					if (i.homogeneous()) catalogue = i[0];
					if (metaData[0].description) {
						description = html2php(domParser.parseFromString(metaData[0].description, 'text/html').body, referer);
						if (!quoteDetector.test(description)) description = description.bbQuote();
					} else description = '';
					if (metaData[0].extra_data) try {
					} catch(e) { console.debug(e) }
					if (Array.isArray(metaData[0].related_press)) metaData[0].related_press.forEach(function(article) {
						if (description) description += '\n';
						let by = (article.writer + ' / ' + article.magazine).replace(/^ \/ $|^ \/|\/ $/g, '');
						if (by) by = '\n\nby ' + by;
						description += (html2php(domParser.parseFromString(article.description, 'text/html').body, referer) + by)
							.bbHide(article.title) + '\n';
					});
					if (metaData[1].length > 0) {
						if (description) description += '\n';
						description += '[b]Personnel:[/b]\n' + metaData[1]
							.map(relArtist => relArtist.name.bbUrl('https://www.ecmrecords.com/' + relArtist.link) +
								': ' + (relArtist.instrument || relArtist.role)).join('\n');
					}
					return metaData[2].map(function(track, index) {
						trackIdentifiers = { TRACK_ID: track.serial };
						trackArtist = track.participants;
						if (trackArtist && !isVA && artistsMatch(trackArtist, metaData[0].main_artist)) trackArtist = undefined;
						return {
							artist: isVA ? VA : metaData[0].main_artist,
							album: metaData[0].title,
							release_date: releaseDate ? normalizeDate(releaseDate) : undefined,
							label: 'ECM Records',
							catalog: catalogue || `${metaData[0].prefix} ${metaData[0].suffix}`,
							genre: genres.join('; '),
							track_number: parseInt(track.track_nr) || index + 1,
							disc_number: parseInt(track.cd_nr) || undefined,
							disc_subtitle: track.movement ? track.title : undefined,
							composer: track.composer,
							track_artist: trackArtist,
							performers: !isVA ? artist : undefined,
							title: track.movement || track.title,
							duration: timeStringToTime(track.duration) || undefined,
							description: description.collapseGaps(),
							url: !trackIdentifiers.ECM_ID ? referer : undefined,
							cover_url: metaData[0].image_01_full,
							identifiers: mergeIds(),
						};
					});
				});
			} else if (url.hostname.endsWith('actmusic.com')) return globalXHR(url.href.replace('actmusic.com/de/', 'actmusic.com/en/')).then(function(response) {
				let enLink;
				response.document.querySelectorAll('li > a.metanav_languageSwitch')
					.forEach(a => { if (a.textContent.trim() == 'EN') enLink = 'https://www.actmusic.com' + a.pathname });
				return enLink ? globalXHR(enLink) : response;
			}).then(function(response) {
				if ((ref = response.document.querySelector('h1.album-detail_artisthead')) != null)
					artist = ref.textContent.trim();
				isVA = vaParser.test(artist);
				if ((ref = response.document.querySelector('h2.album-detail_albumhead')) != null)
					album = ref.textContent.trim().replace(/ - (?:CD|LP|Vinyl)$/, '');
				response.document.querySelectorAll('ul.release-format-info > li').forEach(function(li) {
					try {
						var key = li.querySelector('span.release-format-info_label').textContent.trim().replace(/\s*:\s*$/, ''),
								value = li.querySelector('span.release-format-info_value').textContent.trim();
					} catch(e) {
						console.debug(e);
						return;
					}
					switch (key.toLowerCase()) {
						case 'format': media = value; break;
						case 'cat no.': catalogue = value; break;
						case 'barcode': identifiers.BARCODE = value; break;
						case 'release': case 'german release': releaseDate = normalizeDate(value, 'de'); break;
						case 'genre': genres = value.split(/\s*,\s*/); break;
					}
				});
				if ((ref = response.document.querySelector('div.album_cover_image')) != null
						|| /^url\([\'\"](.+)[\'\"]\)$/.test(ref.style.backgroundImage)) imgUrl = RegExp.$1;
				trs = response.document.querySelectorAll('ol.tracklist > li');
				return (function() {
					if ((ref = response.document.querySelector('div.sh3 > h1.header_title > a.btn-arrow-right')) == null) {
						getDescription(response, 'div.col-infos', false);
						return Promise.resolve(description);
					}
					return globalXHR('https://www.actmusic.com' + ref.pathname).then(function(response) {
						description = [
							html2php(response.document.querySelector('div.c-bio-wrap > div.c-bio-text'), response.finalUrl),
							html2php(response.document.querySelector('div.c-bio-wrap > div.c-bio-sidebar'), response.finalUrl),
						].filter(description => Boolean(description)).join('\n\n').collapseGaps();
						let pdf = actPdfBooklet(response);
						if (pdf) description += '\n\n' + pdf;
						return description;
					});
				})().then(description => Array.from(trs).map((tr, ndx) => ({
					artist: isVA ? VA : artist,
					album: album,
					release_date: releaseDate,
					label: 'ACT Music',
					catalog: catalogue,
					genre: genres.join('; '),
					media: media,
					track_number: (ref = tr.querySelector('span.tracklist_tracknumber')) != null ?
					parseInt(ref.textContent) : undefined,
					total_tracks: trs.length,
					title: (ref = tr.querySelector('span.tracklist_tracktitle')) != null ? ref.textContent.trim() : undefined,
					composer: (ref = tr.querySelector('span.tracklist_credits')) != null
						&& /^\s*\(\s*(.+?)\s*\)\s*$/.test(ref.textContent) ? RegExp.$1 : undefined,
					duration: (ref = tr.querySelector('span.tracklist_trackduration')) != null ?
					timeStringToTime(ref.textContent) : undefined,
					description: description,
					url: response.finalUrl,
					cover_url: imgUrl,
					identifiers: mergeIds(),
				})));
			}); else if (url.hostname.endsWith('jpc.de') && url.pathname.startsWith('/jpcng/')) {
				let params = new URLSearchParams(url.search);
				params.set('lang', 'en');
				url.search = params;
				return globalXHR(url).then(function(response) {
					if ((ref = response.document.querySelector('div.box.by > a')) != null) artist = ref.textContent.trim();
					isVA = vaParser.test(artist);
					if ((ref = response.document.querySelector('div.box.title')) != null) album = ref.textContent.trim();
					if ((ref = response.document.querySelector('div.box.medium > em')) != null) media = ref.textContent.trim();
					response.document.querySelectorAll('div.box.detailinfo > ul > li > b').forEach(function(b) {
						switch (b.textContent.trim().toLowerCase()) {
							case 'label:': label = b.nextElementSibling.textContent.trim(); break;
							case 'bestellnummer:': case 'order number:': catalogue = b.nextElementSibling.textContent.trim(); break;
							case 'erscheinungstermin:': case 'release date:': releaseDate = normalizeDate(b.nextSibling.textContent, 'de'); break;
						}
					});
					getDescription(response, 'div.box.textlink > div[data-pd="j"]', true);
					if (description && (ref = response.document.querySelector('div.rear-image > a.mfp-image')) != null)
						description += '\n\n' + ref.href.replace(/\/w\d+\//i, '/w9999/').bbImg();
					if ((ref = response.document.querySelector('meta[property="og:image"][content]')) != null)
						imgUrl = ref.content.replace(/\/w\d+\//i, '/w9999/');
					trs = response.document.querySelectorAll('div.playlist > ol > li[itemprop="track"]');
					response.document.querySelectorAll('div.playlist').forEach(function(playlist, discNumber, nl) {
						discSubtitle = (ref = playlist.querySelector(':scope > h4')) != null ? ref.textContent.trim() : undefined;
						Array.prototype.push.apply(tracks, Array.from(playlist.querySelectorAll('ol > li[itemprop="track"]')).map((tr, ndx) => ({
							artist: isVA ? VA : artist,
							album: album,
							release_date: releaseDate,
							label: label,
							catalog: catalogue,
							media: media,
							disc_number: discNumber + 1,
							total_discs: nl.length,
							disc_subtitle: discSubtitle,
							track_number: (ref = tr.querySelector('strong')) != null ? parseInt(ref.textContent) : ndx + 1,
							total_tracks: trs.length,
							title: (ref = tr.querySelector('small[itemprop="name"]')) != null ? ref.textContent.trim() : undefined,
							description: description,
							url: response.finalUrl,
							cover_url: imgUrl,
							identifiers: mergeIds(),
						})));
					});
					return tracks;
				});
			} else if (url.hostname.endsWith('pias.com') && url.pathname.startsWith('/release/')) return globalXHR(url).then(function(response) {
				if (/\/release\/(\d+)\b/i.test(url.pathname)) identifiers.PIAS_ID = parseInt(RegExp.$1);
				artist = Array.from(response.document.querySelectorAll('div.product-details > div.product-info > dl > dd.artist > a'))
					.map(a => a.title || a.textContent.trim());
				isVA = artist.length <= 0 || artist.length == 1 && vaParser.test(artist[0]);
				if ((ref = response.document.querySelector('div.product-details > div.product-info > dl > dd.release-title')) != null)
					album = ref.textContent.trim();
				label = Array.from(response.document.querySelectorAll('div.product-details > div.product-info > dl > dd.label > a'))
					.map(a => a.title || a.textContent.trim()).join(' / ');
				if ((ref = response.document.querySelector('div.product-details > div.product-info > dl > dd.catalogue-number')) != null)
					catalogue = ref.textContent.trim();
				if ((ref = response.document.querySelector('div.product-details > div.product-info > dl > dd.product-release-date')) != null)
					releaseDate = normalizeDate(ref.textContent, 'be');
				//getDescription(response, 'div.box.textlink > div[data-pd="j"]', true);
				description = imageHosts.rehostImages(Array.from(response.document.querySelectorAll('ul.product-image-list  > li.product-image-item > a > img.product-image'))
					.map(img => img.src.replace(/\/[bl]\//i, '/'))).catch(reason => [])
					.then(results => results.map(result => (typeof result == 'string' ? result
						: typeof result == 'object' && result.original ? result.original : null).bbImg()).join('\n'));
				if ((ref = response.document.querySelector('meta[property="og:image"][content]')) != null)
					imgUrl = ref.content.replace(/\/[sbl]\//i, '/');
				else if ((ref = response.document.querySelector('img[itemprop="image"]')) != null)
					imgUrl = ref.src.replace(/\/[sbl]\//i, '/');
				trs = response.document.querySelectorAll('ol.track-list > li.track');
				return description.then(description => Array.from(trs).map(function(li, index) {
					trackIdentifiers = { TRACK_ID: li.dataset.id };
					return {
						artist: isVA ? VA : undefined,
						artists: !isVA ? artist : undefined,
						album: album,
						release_date: releaseDate,
						label: label,
						catalog: catalogue,
						media: media,
						//disc_number: discNumber + 1,
						//total_discs: nl.length,
						//disc_subtitle: discSubtitle,
						track_number: (ref = li.querySelector('span.track-number')) != null ? parseInt(ref.textContent) : ndx + 1,
						total_tracks: trs.length,
						title: (ref = li.querySelector('span[itemprop="name"]')) != null ?
						ref.title || ref.textContent.trim() : undefined,
						duration: (ref = li.querySelector('span.track-duration')) != null ?
						timeStringToTime(ref.textContent) : undefined,
						description: description || undefined,
						url: !identifiers.PIAS_ID ? response.finalUrl : undefined,
						cover_url: imgUrl,
						identifiers: mergeIds(),
					};
				}));
			}); else if (url.hostname.endsWith('hearnow.com')) return globalXHR(url).then(function(response) {
				artist = (ref = response.document.querySelector('div.artist_name > a.artist_page_link')) != null ?
					ref.textContent.trim() : undefined;
				isVA = vaParser.test(artist);
				if ((ref = response.document.querySelector('div.album_name_large')) != null)
					album = ref.textContent.trim();
				if ((ref = response.document.querySelector('div.release_date')) != null)
					releaseDate = normalizeDate(ref.textContent.trim().replace(/^Released\s+/i, ''));
				if ((ref = response.document.querySelector('div.album_cover > img.album_cover_image')) != null) imgUrl = ref.src;
				trs = response.document.querySelectorAll('section#tracks > ul.playlinks > li');
				return Array.from(trs).map(function(li, ndx) {
					trackIdentifiers = { ISRC: li.dataset.isrc };
					trackArtist = (ref = li.querySelector('div.track_artist_name')) != null ? ref.textContent.trim() : undefined;
					return {
						artist: isVA ? VA : artist,
						album: album,
						release_date: releaseDate,
						media: media,
						track_number: parseInt(li.dataset.tracknumber) || ndx + 1,
						total_tracks: trs.length,
						title: (ref = li.querySelector('div.track_name')) != null ? ref.textContent.trim() : undefined,
						track_artist: trackArtist && (isVA || !artistsMatch(trackArtist, artist)) ? trackArtist : undefined,
						duration: (ref = li.querySelector('div.track_duration')) != null ?
						timeStringToTime(ref.textContent) : undefined,
						url: response.finalUrl,
						cover_url: imgUrl,
						identifiers: mergeIds(),
					};
				});
			}); else if (url.hostname.endsWith('dominomusic.com') && url.pathname.startsWith('/releases/')) return globalXHR(url, { responseType: 'text' }).then(function(response) {
				if (!/\b(?:selected):\s*(\d+)\b/m.test(response.responseText)) throw 'Invalid page format';
				identifiers.DOMINO_ID = parseInt(RegExp.$1);
				if (!/\b(?:data):\s*({"releases":.*?}),$/m.test(response.responseText)) throw 'Invalid page format';
				let release = JSON.parse(RegExp.$1).releases.filter(release => release.id == identifiers.DOMINO_ID);
				if (release.length <= 0) throw 'Assertion failed: release not found';
				identifiers.RELEASETYPE = release[0].release_type;
				isVA = vaParser.test(release[0].artist);
				description = html2php(domParser.parseFromString(release[0].description, 'text/html').body, response.finalUrl)
					.collapseGaps();
				if (Array.isArray(release[0].images))
					imgUrl = Object.keys(release[0].images[0])
						.reduce((acc, key) => release[0].images[0][key].width * release[0].images[0][key].height
							> release[0].images[0][acc].width * release[0].images[0][acc].height ? key : acc);
				var isLP = /\b(?:LP)\b/.test(release[0].format);
				release[0].tracklisting.tracks.forEach(function(volume, volNdx) {
					Array.prototype.push.apply(tracks, volume.tracklisting.map(track => ({
						artist: isVA ? VA : release[0].artist,
						album: release[0].title,
						release_date: release[0].released_at.replace(/^(\d+)\w+\b/, '$1'),
						label: 'Domino Recording',
						catalog: release[0].sku,
						media: release[0].format,
						disc_number: !isLP ? volNdx + 1 : Math.round((volNdx + 1) / 2),
						disc_subtitle: volume.title || undefined,
						total_discs: isLP ? release[0].tracklisting.tracks.length : Math.ceil(release[0].tracklisting.tracks.length),
						track_number: track.number,
						total_tracks: release[0].tracklisting.tracks.reduce((acc, volume) => acc + volume.tracklisting.length, 0),
						title: track.title,
						url: response.finalUrl,
						description: description,
						cover_url: imgUrl ? release[0].images[0][imgUrl].url : undefined,
						identifiers: mergeIds(),
					})));
				});
				return tracks;
			}); else if (url.hostname.endsWith('kompakt.fm')) return globalXHR(url).then(function(response) {
				if ((ref = response.document.querySelector('div.player-data > ul.release > li.id')) != null)
					identifiers.KOMPAKT_ID = ref.textContent.trim();
				if ((ref = response.document.querySelector('div.player-data > ul.release > li.artist')) != null)
					artist = ref.textContent.trim();
				isVA = (ref = response.document.querySelector('div.player-data > ul.release > li.various-artists')) != null ?
					eval(ref.textContent) : vaParser.test(artist);
				if ((ref = response.document.querySelector('div.player-data > ul.release > li.title')) != null)
					album = ref.textContent;
				response.document.querySelectorAll('div.mt-3 > div > div.mt-2').forEach(function(div) {
					let key = div.querySelector(':scope > span:nth-of-type(1)'),
							value = div.querySelector(':scope > span:nth-of-type(2)');
					if (key == null || value == null) return;
					key = key.textContent.trim(); value = value.textContent.trim();
					switch(key.replace(/\s*:\s*$/, '').toLowerCase()) {
						case 'label': label = value; break;
						case 'release date': releaseDate = value; break;
						case 'cat no': catalogue = value; break;
						case 'barcode': identifiers.BARCODE = value; break;
					}
				});
				getDescription(response, 'div.toggable-level-1 > div.container-fluid > div.mt-3', true);
				if ((ref = response.document.querySelector('meta[property="og:image"][content]')) != null) imgUrl = ref.content;
				trs = response.document.querySelectorAll('div.player-data > ul.tracks > li.track');
				return Array.from(trs).map(function(li, ndx) {
					trackIdentifiers = {
						TRACK_ID: (ref = li.querySelector('span.position')) != null ? ref.textContent : undefined,
					};
					trackArtist = (ref = li.querySelector('li.artist')) != null ? ref.textContent : undefined;
					return {
						artist: isVA ? VA : artist,
						album: album,
						release_date: releaseDate,
						label: label,
						catalog: catalogue,
						media: media,
						track_number: (ref = li.querySelector('li.position')) != null && parseInt(ref.textContent) || ndx + 1,
						total_tracks: trs.length,
						title: (ref = li.querySelector('li.title')) != null ? ref.textContent : undefined,
						track_artist: trackArtist && (isVA || !artistsMatch(trackArtist, artist)) ? trackArtist : undefined,
						duration: (ref = li.querySelector('li.duration')) != null ? timeStringToTime(ref.textContent) : undefined,
						url: (ref = response.document.querySelector('meta[property="og:url"][content]')) != null ?
						ref.content : response.finalUrl,
						description: description,
						cover_url: imgUrl,
						identifiers: mergeIds(),
					};
				});
			}); else if (url.hostname.endsWith('eclassical.com')) return globalXHR(url).then(function(response) {
				if ((ref = response.document.querySelector('h1.articleName')) != null) album = ref.textContent;
				artist = []; composer = []; genres = ['Classical']; label = [];
				var conductors = [];
				iterArtprop('div#articlePageContents', function(title, value) {
					switch (title.toLowerCase()) {
						case 'composers':
							Array.prototype.push.apply(composer, Array.from(value.querySelectorAll('div > a'))
								.map(a => a.textContent.trim().replace(/^(.+?),\s+(.+)$/, '$2 $1')));
							break;
						case 'performers':
							Array.prototype.push.apply(artist, Array.from(value.querySelectorAll('div > a'))
								.map(a => a.textContent.trim().replace(/^(.+?),\s+(.+)$/, '$2 $1')));
							break;
						case 'orchestras / ensembles': case 'orchestras': case 'ensembles':
							Array.prototype.push.apply(artist, Array.from(value.querySelectorAll('div > a'))
								.map(a => a.textContent.trim()));
							break;
						case 'conductors':
							Array.prototype.push.apply(conductors, Array.from(value.querySelectorAll('div > a'))
								.map(a => a.textContent.trim().replace(/^(.+?),\s+(.+)$/, '$2 $1')));
							break;
						case 'genres':
						case 'instruments':
						case 'periods':
							Array.prototype.push.apply(genres, Array.from(value.querySelectorAll('div > a'))
								.map(a => a.textContent.trim()));
							break;
						case 'label':
							Array.prototype.push.apply(label, Array.from(value.querySelectorAll('div > a'))
								.map(a => a.textContent.trim()));
							break;
						case 'catalogue number':
							catalogue = value.textContent.trim();
							break;
						case 'release date':
							releaseDate = value.textContent.trim();
							break;
						case 'discs':
							totalDiscs = parseInt(value.textContent) || 1;
							break;
						case 'original sample rate': case 'orig. sample rate': case 'sample rate':
							if (/\b(\d+)(?:\s*(?:Hz)\b)/.test(value.textContent)) samplerate = parseInt(RegExp.$1);
							break;
					}
				});
				isVA = artist.length == 1 && vaParser.test(artist[0]);
				getDescription(response, 'div#articleText', false);
				iterArtprop('div[id$="album-castlist"]', function(title, value, index) {
					if (description) description += index <= 0 ? '\n\n' : '\n'
					if (index <= 0) description += '[b]Cast:[/b]\n';
					description += title + ' - ' + joinTextChilds(value, '; ', t => t.replace(/^(.+?),\s+(.+)$/, '$2 $1'));
				});
				if (ref = eclassicalBooklets(response)) if (description) description += '\n\n' + ref; else description = ref;
				if ((ref = response.document.querySelector('div#articleImage > a')) != null) imgUrl = ref.href;
				totalTracks = response.document.querySelectorAll('table.tracklistTable > tbody > tr.trackRow').length;
				var workTitle, workComposers = [];
				response.document.querySelectorAll('table.tracklistTable > tbody > tr').forEach(function(tr, ndx) {
					if (tr.classList.contains('tracklistDiscNumberRow') && (ref = tr.querySelector('div.tracklistDiscHeader')) != null) {
						discSubtitle = ref.textContent.trim();
						guessDiscNumber();
					}
					if (tr.classList.contains('tracklistRowDivider')) {
						workComposers = [];
						workTitle = undefined;
					}
					if (tr.classList.contains('tracklistRowVerkComposerName'))
						workComposers = Array.from(tr.querySelectorAll('td > span.tracklistComposerVerkName'))
							.map(span => span.textContent.trim().replace(/^(?:Composer)\s*:\s*/i, '').replace(/^(.+?),\s+(.+)$/, '$2 $1'));
					if (tr.classList.contains('tracklistRowVerkName')
							&& (ref = tr.querySelector('span.tracklistVerkName')) != null) workTitle = joinTextChilds(ref);
					if (tr.classList.contains('trackRow')) {
						discSubtitle = workTitle || '';
						if (discSubtitle && workComposers.length > 0 && !workComposers.equalCaselessTo(composer))
							discSubtitle = workComposers.join(', ') + ': ' + discSubtitle;
						if ((title = joinTextChilds(tr.querySelector('td.trackName > a')))
								&& title.startsWith(workTitle))
							title = title.slice(workTitle.length).replace(/^\s*[\:\-\,\;]\s*/, '') || workTitle;
						tracks.push({
							artist: isVA ? VA : undefined,
							artists: !isVA ? artist : undefined,
							album: album,
							release_date: releaseDate,
							genre: genres.join('; '),
							label: label.join(' / ') || undefined,
							catalog: catalogue,
							media: media,
							samplerate: samplerate,
							disc_subtitle: discSubtitle || undefined,
							disc_number: discNumber,
							total_discs: totalDiscs,
							track_number: (ref = tr.querySelector('td.trackNumber')) != null ? parseInt(ref.textContent) : undefined,
							total_tracks: totalTracks,
							title: title,
							composers: workComposers.length > 0 ? workComposers : composer,
							conductors: conductors,
							duration: (ref = tr.querySelector('td.trackLength')) != null ? timeStringToTime(ref.textContent) : undefined,
							description: description,
							url: response.finalUrl,
							cover_url: imgUrl,
							identifiers: identifiers,
						});
					}
				});
				return tracks;

				function joinTextChilds(node, junction = undefined, transform = undefined) {
					if (!(node instanceof Node)) return undefined;
					return Array.from(node.childNodes).filter(childNode => childNode.nodeType == Node.TEXT_NODE)
						.map(childNode => (transform || (t => t))(childNode.wholeText.trim())).join(junction || ' ') || undefined;
				}

				function iterArtprop(root, callback) {
					if (typeof callback != 'function') return;
					response.document.querySelectorAll(root + '> div.artprop > table > tbody > tr').forEach(function(tr, index) {
						let title = tr.querySelector('td.property_title'), value = tr.querySelector('td.property_value');
						if (title != null && value != null) callback(title.textContent.trim(), value, index);
						else console.warn('Unexpected artprop structure:', tr);
					});
				}
			}); else if (url.hostname.endsWith('qq.com') && /\/album(?:Detail)?\/(\w+)/i.test(url.pathname)) return globalXHR(url).then(function({document}) {
				for (let script of document.body.querySelectorAll(':scope > script'))
					if ((script = /\b__INITIAL_DATA__\s*=\s*({.+})/.exec(script.text)) != null)
						try { var initialData = eval('(' + script[1] + ')') } catch(e) { console.warn(e) }
				if (!initialData) throw 'Assertion failed: __INITIAL_DATA__ not triggered';
				if (prefs.diag_mode) console.log('QQ音乐 __INITIAL_DATA__ successfully extracted:', initialData);
				identifiers.QQMUSIC_ID = initialData.detail.albumMid;
				artist = initialData.detail.singer.filter(singer => singer.role == 'singer').map(singer => singer.name);
				isVA = artist.length <= 0 || artist.length == 1 && vaParser.test(artist[0]);
				if (initialData.detail.picurl) {
					if (!httpParser.test(imgUrl = initialData.detail.picurl)) imgUrl = url.protocol + imgUrl;
					imgUrl = imgUrl.replace(/\/(T\d+)?(R\d+x\d+)?(M\w+?)(_\d+)?\.(\w+(?:\.\w+)*)(\?.*)?$/, '/$1$3.$5');
				}
				if (initialData.detail.albumType) switch (initialData.detail.albumType) {
					case '录音室专辑': break; // studio album
					case '演唱会': identifiers.RELEASETYPE = 'Live Album'; break;
					case '天娱传媒': identifiers.RELEASETYPE = 'Tianyu'; break; // WTF is this
					case 'Single': case 'EP': default: identifiers.RELEASETYPE = initialData.detail.albumType;
				}
				return initialData.songList.map(function(song, index) {
					trackIdentifiers = { TRACK_ID: song.mid };
					title = song.title;
					if (song.subtitle) title += ' (' + song.subtitle + ')';
					return {
						artist: isVA ? VA : undefined,
						artists: !isVA ? artist : undefined,
						album: initialData.detail.albumName || initialData.detail.title,
						release_date: initialData.detail.ctime ? normalizeDate(initialData.detail.ctime) : undefined,
						genre: initialData.detail.genre,
						label: initialData.detail.company,
						language: initialData.detail.language,
						media: 'WEB',
						track_number: index + 1,
						total_tracks: initialData.songList.length,
						title: title,
						track_artists: song.singer.filter(singer => singer.role == 'singer').map(singer => singer.name),
						composers: song.singer.filter(singer => singer.role == 'composer').map(singer => singer.name),
						duration: song.interval || timeStringToTime(song.playTime),
						cover_url: imgUrl,
						description: initialData.detail.description ? '[quote]' + initialData.detail.description + '[/quote]' : undefined,
						track_gain: song.volume ? song.volume.gain : undefined,
						track_peak: song.volume ? song.volume.peak : undefined,
						identifiers: mergeIds(),
					};
				});
			}); else if (url.hostname.endsWith('muziekweb.nl') && url.pathname.includes('/Link/')) return globalXHR(url).then(function(response) {
				if (/\/Link\/(\w+)\b/i.test(url.pathname)) identifiers.MUZIEKWEB_ID = RegExp.$1;
				artist = Array.from(response.document.querySelectorAll('ul.cat-performers > li[itemprop="byArtist"] > a > span'))
					.map(span => span.textContent.trim());
				isVA = artist.length <= 0 || artist.length == 1 && vaParser.test(artist[0]);
				if ((ref = response.document.querySelector('h1.cat-albumtitle')) != null) album = ref.textContent.trim();
				if ((ref = response.document.querySelector('span[itemprop="catalogNumber"]')) != null)
					catalogue = ref.textContent.trim();
				if ((ref = response.document.querySelector('span[itemprop="recordLabel"]')) != null)
					label = ref.textContent.trim();
				genres = Array.from(response.document.querySelectorAll('ul.cat-genres span[itemprop="genre"]'))
					.map(span => span.textContent.trim());
				if ((ref = response.document.querySelector('div.cat-albumrelease > meta[itemprop="datePublished"][content]')) != null)
					releaseDate = ref.content;
				if ((ref = response.document.querySelector('span[itemprop="musicReleaseFormat"]')) != null) {
					if (/\b(?:compact\s+disc)/i.test(ref.textContent)) media = 'CD';
				}
				getDescription(response, 'div#album-info div.cat-article-text', true);
// 				if (!description && (ref = response.document.querySelector('meta[property="og:description"]')) != null)
// 					description = ref.content;
				if ((ref = response.document.querySelector('meta[property="og:image"][content]')) != null)
					imgUrl = ref.content.replace(/\/COVER\/\w+\b/i, '/COVER/SUPERLARGE');
				trs = response.document.querySelectorAll('ul.cat-tracklist > li[itemprop="itemListElement"] > div.cat-track-item');
				return Array.from(trs).map(function(div, index) {
					trackIdentifiers = {
						TRACK_ID: (ref = div.querySelector('div.cat-track-playbuttons > div[id]')) != null ? ref.id : undefined,
					};
					trackArtist = Array.from(div.querySelectorAll('span[itemprop="byArtist"] meta[itemprop="name"][content]'))
						.map(meta => meta.content);
					return {
						artist: isVA ? VA : undefined,
						artists: !isVA ? artist : undefined,
						album: album,
						release_date: releaseDate,
						genre: genres.join('; '),
						label: label,
						catalog: catalogue,
						media: media,
						track_number: (ref = div.querySelector('div.cat-track-number')) != null
							&& (parseInt(ref.textContent) || ref.textContent.trim()) || index + 1,
						total_tracks: trs.length,
						title: (ref = div.querySelector('div.cat-track[title]')) != null ? ref.title
							: (ref = div.querySelector('div.cat-track-title')) != null ? ref.textContent.trim() : undefined,
						track_artists: isVA || !trackArtist.equalCaselessTo(artist) ? trackArtist : undefined,
						duration: (ref = div.querySelector('div.cat-track-playtime')) != null ?
							timeStringToTime(ref.textContent) : undefined,
						description: description,
						url: identifiers.MUZIEKWEB_ID ? undefined
							: (ref = response.document.querySelector('meta[property="og:url"]')) != null ?
						ref.content : response.finalUrl,
						cover_url: imgUrl,
						identifiers: mergeIds(),
					};
				});
			}); else if (url.hostname.endsWith('beatsource.com')) {
				let releaseId = /^\/release\/\S+?\/(\d+)\b/i.test(url.pathname)
					|| /\/releases\/(\d+)\b/i.test(url.pathname) ? parseInt(RegExp.$1) : undefined;
				return (releaseId ? queryBeatsourceAPI('releases/' + releaseId) : Promise.reject('unknown URL scheme')).then(function(release) {
					if (prefs.diag_mode) console.debug('Beatsource release metadata received:', release);
					identifiers.BEATSOURCE_ID = release.id;
					artist = release.artists.map(artist => artist.name);
					isVA = artist.length <= 0 || artist.length == 1 && vaParser.test(artist[0]);
					if (release.upc) identifiers.UPC = release.upc;
					if ('is_explicit' in release) identifiers.EXPLICIT = Number(release.is_explicit);

					function trackMapper(track, index) {
						trackIdentifiers = { TRACK_ID: track.id };
						if (track.isrc) trackIdentifiers.ISRC = track.isrc;
						if ('is_explicit' in track) trackIdentifiers.EXPLICIT = Number(track.is_explicit);
						if (track.bpm) trackIdentifiers.BPM = track.bpm;
						trackArtist = track.artists.map(artist => artist.name);
						if ((title = track.name) && track.mix_name && track.mix_name != 'Original Mix')
							title += ' (' + track.mix_name + ')';
						try { genres = [track.genre.name] } catch(e) { genres = [] }
						if (track.sub_genre) try { genres.push(track.sub_genre.name) } catch(e) { }
						return {
							artist: isVA ? VA : undefined,
							artists: artist.length > 0 ? artist : undefined,
							album: release.name,
							album_year: extractYear(release.new_release_date) || undefined,
							release_date: release.publish_date || track.publish_date || undefined,
							genre: genres.join('; ') || undefined,
							label: release.label.name,
							catalog: release.catalog_number || track.catalog_number || undefined,
							media: media,
							track_number: track.number || index + 1,
							total_tracks: release.track_count,
							title: title,
							track_artists: trackArtist.length > 0 && (isVA || !trackArtist.equalCaselessTo(artist)) ?
							trackArtist : undefined,
							remixers: track.remixers.length > 0 ? track.remixers.map(remixer => remixer.name)
								:/* release.remixers.length > 0 ? release.remixers.map(remixer => remixer.name) :*/ undefined,
							duration: track.length_ms > 0 ? track.length_ms / 1000 : undefined,
							description: release.desc || undefined,
							url: release.slug ? `https://www.beatsource.com/release/${release.slug}/${release.id}` : url,
							cover_url: release.image.uri ? release.image.uri.replace(/\/image_size\/\d+x\d+\//i, '/') : undefined,
							identifiers: mergeIds(),
						};
					}

					return queryBeatsourceAPI('releases/' + release.id + '/tracks', { per_page: 9999 }).then(function(tracks) {
						if (prefs.diag_mode) console.debug('Beatsource tracks metadata received:', tracks.results);
						return tracks.count == release.track_count ? tracks.results.map(trackMapper)
							: Promise.reject('Track counts inconsistency');
					}).catch(function(reason) {
						console.warn('Beatsource release tracks failed:', reason);
						return Promise.all(release.tracks.map(track => queryBeatsourceAPI(track)))
							.then(tracks => tracks.map(trackMapper));
					});
				});
			} else if (url.hostname == 'music.163.com' && (matches = /\/(?:album)\b.*\b(?:id)=(\d+)\b/i.exec(url.href)) != null) return Promise.all([
				globalXHR('https://music.163.com/album?id=' + matches[1]),
				queryNeteaseAPI('album/' + matches[1]), queryNeteaseAPI('v1/album/' + matches[1]),
			]).then(function(responses) {
				if (prefs.diag_mode) console.debug('NetEase metadata loaded:', responses[1].album, responses[2]);
				identifiers.NETEASE_ID = responses[1].album.id;
				let featArtists = [];
				artist = responses[1].album.artists.map(function(artist) {
					featArtistParsers.forEach(function(rx) {
						if (!rx.test(artist.name)) return;
						featArtists.pushUniqueCaseless(...splitAmpersands(RegExp.$1));
						artist.name = artist.name.replace(rx, '');
					});
					return artist.name;
				});
				isVA = artist.length <= 0 || artist.length == 1 && vaParser.test(artist[0]);
				if ((ref = responses[0].document.querySelector('meta[property="music:release_date"][content]')) != null)
					releaseDate = ref.content;
				if (!(description = responses[2].album.description || responses[1].album.description)
						&& (ref = responses[0].document.querySelector('meta[property="og:description"][content]')) != null)
					description = ref.content.trim();
				if (description && !quoteDetector.test(description)) description = description.bbQuote();
				return finalizeTracks(responses[1].album.songs.map(function(track, index) {
					trackIdentifiers = { TRACK_ID: track.id };
					let trackGuests = [];
					trackArtist = track.artists.map(function(artist) {
						featArtistParsers.forEach(function(rx) {
							if (!rx.test(artist.name)) return;
							trackGuests.pushUniqueCaseless(...splitAmpersands(RegExp.$1));
							artist.name = artist.name.replace(rx, '');
						});
						return artist.name;
					});
					let useTA = isVA || !artistsMatch([artist, featArtists], [trackArtist, trackGuests])
					imgUrl = /*responses[2].album.picUrl || */responses[1].album.picUrl || track.album.picUrl;
					return {
						artist: isVA ? VA : undefined,
						artists: !isVA ? artist : undefined,
						featured_artists: featArtists.length > 0 ? featArtists : undefined,
						album: responses[1].album.name, //track.album.name
						release_date: releaseDate,
						media: media,
						label: responses[1].album.company || undefined,
						disc_number: parseInt(track.disc) || undefined,
						track_number: track.no || index + 1,
						total_tracks: responses[1].album.size,
						title: track.name,
						track_artists: useTA && trackArtist.length > 0 ? trackArtist : undefined,
						track_guests: useTA && trackGuests.length > 0 ? trackGuests : undefined,
						duration: track.duration / 1000 || undefined,
						description: description || undefined,
						url: !identifiers.NETEASE_ID && (ref = responses[0].document.querySelector('meta[property="og:url"]')) != null ?
							ref.content : undefined,
						cover_url: imgUrl ? imgUrl.replace(/\?.*$/, '').replace(/\b(?:p[123])(?=\.music\.\d+\.net\b)/i, 'p4')
							: undefined,
						identifiers: mergeIds(),
					};
				}));
			}); else if (url.hostname.endsWith('extrememusic.com') && /^\/albums\/(\d+)\b/i.test(url.pathname)) {
				let albumId = parseInt(RegExp.$1);
				return globalXHR('https://www.extrememusic.com/env', {
					responseType: 'json',
					headers: { Referer: url.href },
				}).then(({response}) => globalXHR('https://napi.extrememusic.com/albums/' + albumId, {
					responseType: 'json',
					headers: {
						'X-API-Auth': response.token,
						'X-Site-Id': 4,
					},
				})).then(function({response}) {
					var albumMeta = response.album;
					identifiers.EXTREMEMUSIC_ID = albumMeta.id;
					isVA = vaParser.test(albumMeta.artist);
					return response.tracks.map(function(track, index) {
						trackIdentifiers = {
							TYRACK_ID: track.id,
							BPM: track.bpm || undefined,
						};
						if (track.codes) track.codes.forEach(code => { trackIdentifiers[code.name] = code.value });
						let trackGenres = track.genre.map(genre => genre.label);
						if (track.subgenre) Array.prototype.push.apply(trackGenres, track.subgenre.map(genre => genre.label));
						if (track.keywords) Array.prototype.push.apply(trackGenres, track.keywords.map(keyword => keyword.label));
						let trackSound = response.track_sounds.find(track_sound => track_sound.id == track.default_track_sound_id);
						if (trackSound && 'explicit_lyrics' in trackSound) trackIdentifiers.EXPLICIT = Number(trackSound.explicit_lyrics);
						return {
							artist: isVA ? VA : albumMeta.artist,
							album: albumMeta.title,
							genre: trackGenres.join('; '),
							catalog: albumMeta.album_no,
							media: media,
							track_number: index + 1,
							total_tracks: albumMeta.track_count,
							title: track.title,
							composers: track.composers ? track.composers.map(composer => composer.name) : undefined,
							duration: trackSound && trackSound.duration,
							description: albumMeta.description || undefined,
							url: !albumMeta.id ? url.href : undefined,
							cover_url: albumMeta.image_large_url || undefined,
							identifiers: mergeIds(),
						};
					});
				});
			} else if (url.hostname.endsWith('rateyourmusic.com') && url.pathname.startsWith('/release/album/')) return globalXHR(url).then(function(response) {
				artist = Array.from(response.document.querySelectorAll('table.album_info span[itemprop="byArtist"] > a'))
					.map(span => span.textContent.trim());
				isVA = artist.length <= 0 || artist.length == 1 && vaParser.test(artist[0]);
				if ((ref = response.document.querySelector('div.album_title')) != null) album = ref.firstChild.wholeText.trim();
				response.document.querySelectorAll('table.album_info > tbody > tr').forEach(function(tr) {
					let key = tr.querySelector(':scope > th.info_hdr'), value = tr.querySelector(':scope > td');
					if (key != null && value != null) key = key.textContent.trim(); else return;
					switch (key.toLowerCase()) {
						case 'type':
							identifiers.RELEASETYPE = ref.textContent.trim(); break;
						case 'released':
							releaseDate = new Date(value.textContent).toUTCDateString(); break;
						case 'genres':
							genres = Array.from(value.querySelectorAll('meta[itemprop="genre"]')).map(meta => meta.content); break;
						case 'language':
							var language = value.textContent.trim(); break;
						case 'issue details': {
							let ids = value.textContent.trim().split(/\s*\/\s*/);
							label = ids.shift();
							catalogue = ids.shift();
							break;
						}
					}
				});
				if ((ref = response.document.querySelector('meta[property="og:image"][content]')) != null) imgUrl = ref.content;
				trs = response.document.querySelectorAll('ul#tracks > li.track > div[itemprop="track"]');
				return Array.from(trs).map(function(div, index) {
					trackArtist = Array.from(div.querySelectorAll('span[itemprop="byArtist"] meta[itemprop="name"][content]'))
						.map(meta => meta.content);
					return {
						artist: isVA ? VA : undefined,
						artists: !isVA ? artist : undefined,
						album: album,
						release_date: releaseDate,
						genre: genres.join('; '),
						label: label,
						catalog: catalogue,
						//media: media,
						track_number: (ref = div.querySelector('span.tracklist_num')) != null ?
							parseInt(ref.textContent) || ref.textContent.trim() : index + 1,
						total_tracks: trs.length,
						title: (ref = div.querySelector('span.tracklist_title > span[itemprop="name"]')) != null ?
							ref.textContent.trim() : undefined,
						//track_artists: isVA || !trackArtist.equalCaselessTo(artist) ? trackArtist : undefined,
						duration: (ref = div.querySelector('span.tracklist_title > span.tracklist_duration')) != null ?
							parseInt(ref.dataset.inseconds) || timeStringToTime(ref.textContent) : undefined,
						//description: description,
						url: (ref = response.document.querySelector('meta[property="og:url"]')) != null ?
							ref.content : response.finalUrl,
						cover_url: imgUrl,
						identifiers: mergeIds(),
					};
				});
			}); else if (url.hostname.endsWith('recochoku.jp') && url.pathname.startsWith('/album/')) return globalXHR(url).then(function(response) {
				if (/^\/(?:album)\/(\w+)\b/.test(url.pathname)) identifiers.RECOCHOKU_ID = RegExp.$1;
				artist = Array.from(response.document.querySelectorAll('div.c-product-main-detail__artist > a'))
					.map(a => a.textContent.trim());
				isVA = artist.length <= 0 || artist.length == 1 && vaParser.test(artist[0]);
				if ((ref = response.document.querySelector('h1.c-product-main-detail__title')) != null)
					album = ref.textContent.trim();
				if ((ref = response.document.querySelector('meta[property="og:image"][content]')) != null) {
					imgUrl = new URL(ref.content);
					let params = new URLSearchParams(imgUrl.search);
					params.set('FFw', 999999999);
					params.set('FFh', 999999999);
					params.delete('h');
					params.delete('option');
					imgUrl.search = params;
				}
				trs = response.document.querySelectorAll('div#albumList > div.album-track-list > div.album-track-list__item');
				return Array.from(trs).map(function(div, index) {
					trackIdentifiers = { };
					if ((ref = div.querySelector('div.album-track-list__audition > button')) != null) {
						trackIdentifiers.TRACK_ID = ref.dataset.idTrack;
						trackIdentifiers.ALBUM_ID = ref.dataset.idAlbum;
						trackIdentifiers.MUSIC_ID = ref.dataset.idMusic;
					}
					title = ref != null ? ref.dataset.titleMusic : undefined;
					return {
						artist: isVA ? VA : undefined,
						artists: !isVA ? artist : undefined,
						album: album,
						media: media,
						track_number: (ref = div.querySelector('span.album-track-list__number')) != null && parseInt(ref.textContent)
							|| index + 1,
						total_tracks: trs.length,
						title: title || ((ref = div.querySelector('span.album-track-list__title-inner')) != null ?
							ref.textContent.trim() : undefined),
						duration: (ref = div.querySelector('div.album-track-list__spec')) != null ?
							timeStringToTime(ref.textContent) : undefined,
						url: !identifiers.RECOCHOKU_ID ? (ref = response.document.querySelector('meta[property="og:url"]')) != null ?
							ref.content : response.finalUrl : undefined,
						cover_url: imgUrl,
						identifiers: mergeIds(),
					};
				});
			}); else if (url.hostname == 'music.youtube.com') {
				if ((identifiers.YTM_ID = /^\/(?:browse)\/(\w+)\b/.exec(url.pathname)) != null)
					identifiers.YTM_ID = identifiers.YTM_ID[1];
						else return Promise.reject('This is not YouTube Music release page link');
				return getYTMcfg(url).then(ytcfg => globalXHR('https://music.youtube.com/youtubei/v1/browse?' + new URLSearchParams({
					alt: 'json',
					key: ytcfg.INNERTUBE_API_KEY,
				}).toString(), {
					responseType: 'json',
					headers: { Referer: 'https://music.youtube.com/' },
				}, Object.assign({
					browseId: identifiers.YTM_ID,
					browseEndpointContextSupportedConfigs: {
						browseEndpointContextMusicConfig: { pageType: 'MUSIC_PAGE_TYPE_ALBUM' },
					},
				}, getYTMrequestContext(ytcfg)))).then(function({response}) {
					let payloads = [ ];
					for (let mutation of response.frameworkUpdates.entityBatchUpdate.mutations) {
						if (mutation.payload) payloads.push(...Object.keys(mutation.payload).map(key => [key, mutation.payload[key]]));
					}
					if (prefs.diag_mode) console.debug('YTM payloads:', payloads);
					return payloads;
				}).then(function(payloads) {
					const musicAlbumRelease = payloads.find(payload => payload[0] == 'musicAlbumRelease');
					if (musicAlbumRelease == undefined) throw 'YTM album info missing (mutations)';
					identifiers.DURATION_PRECISION = 'ms';
					artist = payloads.filter(payload => payload[0] == 'musicArtist').map(musicArtist => musicArtist[1].name);
					if (artist.length <= 0) artist = [musicAlbumRelease[1].artistDisplayName];
					const artists = new Map(payloads.filter(payload => payload[0] == 'musicArtist')
						.map(musicArtist => [musicArtist[1].id, musicArtist[1].name]));
					if (prefs.diag_mode) console.debug('YTM album artists:', artists);
					isVA = vaParser.test(musicAlbumRelease[1].artistDisplayName);
					if ('explicitType' in musicAlbumRelease[1].contentRating)
						identifiers.EXPLICIT = Number(musicAlbumRelease[1].contentRating.explicitType == 'MUSIC_ENTITY_EXPLICIT_TYPE_EXPLICIT');
					if (musicAlbumRelease[1].releaseDate) releaseDate =
						musicAlbumRelease[1].releaseDate.year.toString().padStart(4, '0') + '-' +
						musicAlbumRelease[1].releaseDate.month.toString().padStart(2, '0') + '-' +
						musicAlbumRelease[1].releaseDate.day.toString().padStart(2, '0');
					switch (musicAlbumRelease[1].releaseType) {
						//case 'MUSIC_RELEASE_TYPE_ALBUM': identifiers.RELEASETYPE = 'Album'; break;
						case 'MUSIC_RELEASE_TYPE_SINGLE': identifiers.RELEASETYPE = 'Single'; break;
						case 'MUSIC_RELEASE_TYPE_EP': identifiers.RELEASETYPE = 'EP'; break;
					}
					if (Array.isArray(musicAlbumRelease[1].thumbnailDetails.thumbnails))
						imgUrl = musicAlbumRelease[1].thumbnailDetails.thumbnails[0].url.replace(/(?:=[swh]\d+.*)?$/, '=s0');
					return payloads.filter(payload => payload[0] == 'musicTrack').map(function(musicTrack, index) {
						trackIdentifiers = { TRACK_ID: musicTrack[1].id };
						if ('explicitType' in musicTrack[1].contentRating)
							trackIdentifiers.EXPLICIT = Number(musicTrack[1].contentRating.explicitType == 'MUSIC_ENTITY_EXPLICIT_TYPE_EXPLICIT');
						musicTrack[1].artists.forEach(function(artist) {
							if (!artists.has(artist)) console.warn('YouTube Music album artists index missing id', artist);
						});
						return {
							artist: isVA ? VA : musicAlbumRelease[1].artistDisplayName,
							album: musicAlbumRelease[1].title,
							release_date: releaseDate,
							media: media,
							track_number: parseInt(musicTrack[1].albumTrackIndex) || index + 1,
							total_tracks: parseInt(musicAlbumRelease[1].trackCount) || undefined,
							title: musicTrack[1].title,
							track_artists: musicTrack[1].artists.length > 0
									&& (isVA || !musicTrack[1].artists.equalTo(Object.keys(artists))) ?
								musicTrack[1].artists.map(artist => artists.get(artist)/* || artist*/) : undefined,
							duration: parseInt(musicTrack[1].lengthMs) / 1000 || undefined,
							cover_url: imgUrl,
							identifiers: mergeIds(),
						};
					});
				});
			} else if (/^(?:\w+\.)?amazon(?:\.\w+)+$/.test(url.hostname)) return getAmazonCfg(url)
					.then(amazonCfg => globalXHR(amazonCfg.urlBase + 'api/showHome', {
				responseType: 'json',
				headers: amazonCfg.headers,
			}, { deeplink: JSON.stringify({
				interface: 'DeeplinkInterface.v1_0.DeeplinkClientInformation',
				deeplink: '/' + url.pathname.split('/').filter(Boolean).slice(-2).join('/'),
			}) })).then(({response}) => (response = response.methods.find(method =>
					method.interface.endsWith('CreateAndBindTemplateMethod'))) ? response.template
						: Promise.reject('Method not found')).then(function(album) {
				if (prefs.diag_mode) console.debug('Amazon Music album meta loaded:', album);
				if ((identifiers.AMAZON_ID = url.pathname.split('/').filter(Boolean)).length >= 2)
					identifiers.AMAZON_ID = identifiers.AMAZON_ID.pop(); else delete identifiers.AMAZON_ID;
				artist = album.headerPrimaryText || album.headerSecondaryText;
				releaseDate = normalizeDate(album.headerTertiaryText.replace(/^.*•\s*/, ''));
				return album.widgets[0].items.map((item, index) => ({
					artist: vaParser.test(artist) ? VA : artist.trim(),
					album: album.headerText.text.trim(),
					release_date: releaseDate,
					media: media,
					track_number: index + 1,
					total_tracks: album.widgets[0].items.length,
					title: item.primaryText.trim(),
					duration: timeStringToTime(item.secondaryText3),
					cover_url: album.headerImage,
					identifiers: Object.assign({ TRACK_ID: item.primaryLink.deeplink.replace(/^.*\//, '') }, identifiers),
				}));
			}); else if (url.hostname.endsWith('kuwo.cn') && url.pathname.startsWith('/album_detail/')) return globalXHR(url).then(function(response) {
				if (/^\/(?:album_detail)\/(\d+)\b/i.test(url.pathname)) identifiers.KUWO_ID = parseInt(RegExp.$1);
				artist = Array.from(response.document.querySelectorAll('p.artist_name > span'))
					.map(span => span.textContent.trim());
				isVA = artist.length <= 0 || artist.length == 1 && vaParser.test(artist[0]);
				if ((ref = response.document.querySelector('p.song_name')) != null) album = ref.textContent.trim();
					else throw 'Kuwo CN: invalid page structure (title missing)';
				response.document.querySelectorAll('p.song_info > span.tip').forEach(function(span) {
					for (var key = span; key = key.previousElementSibling; key != null)
						if (!key.className && key.style.display != 'none') break;
					if (key != null) key = key.textContent.trim().replace(/\s*[:：].*$/, ''); else return;
					switch (key) {
						case '发行时间': releaseDate = span.textContent.trim(); break;
					}
				});
				response.document.querySelectorAll('body > script').forEach(function(script) {
					if (!/\b(?:__NUXT__)\b/.test(script.text)) return;
					if (!description && /\b(?:albuminfo):\s*"(.+?)"/.test(script.text)) description = RegExp.$1;
					if (!imgUrl && /\b(?:pic):"(.+?)"/.test(script.text))
						imgUrl = eval('"' + RegExp.$1 + '"').replace(/(\/albumcover)\/\d+\//i, '$1/0/');
				});
				if (!description && (ref = response.document.querySelector('p.intr_txt')) != null)
					description = ref.firstChild.textContent.trim().replace(/\.{3,}$/, '');
				if (description) {
					if (!quoteDetector.test(description)) description = description.bbQuote();
				} else description = undefined;
				trs = response.document.querySelectorAll('ul.album_list > li.song_item');
				return Array.from(trs).map(function(li, index) {
					trackIdentifiers = { };
					if ((ref = li.querySelector('div.song_name > a.name')) != null) {
						title = ref.title || ref.textContent.trim();
						if (/^\/play_detail\/(\d+)\b/.test(ref.pathname)) trackIdentifiers.TRACK_ID = parseInt(RegExp.$1);
					} else title = undefined;
					trackArtist = (ref = li.querySelector('div.song_artist > span')) != null ?
						ref.title || ref.textContent.trim() : undefined;
					return {
						artist: isVA ? VA : undefined,
						artists: !isVA ? artist : undefined,
						album: album,
						release_date: releaseDate,
						media: media,
						track_number: (ref = li.querySelector('div.rank_num > span')) != null && parseInt(ref.textContent)
							|| index + 1,
						total_tracks: trs.length,
						title: title,
						track_artist: trackArtist && (isVA || !artistsMatch(trackArtist, [artist])) ? trackArtist : undefined,
						duration: (ref = li.querySelector('div.song_time > span')) != null ?
							timeStringToTime(ref.textContent) : undefined,
						description: description,
						url: !identifiers.KUWO_ID ? response.finalUrl : undefined,
						cover_url: imgUrl,
						identifiers: mergeIds(),
					};
				});
			}); else if (url.hostname.endsWith('melon.com') && url.pathname.startsWith('/album/')) return globalXHR(url).then(function(response) {
				if (/\b(?:albumId)=(\d+)\b/.test(url.search)) identifiers.MELON_ID = parseInt(RegExp.$1);
					else console.warn('Melon: failed to extract album id from URL', url);
				artist = Array.from(response.document.querySelectorAll('div.info > div.artist > a.artist_name'))
					.map(a => a.title || a.textContent.trim());
				isVA = artist.length <= 0 || artist.length == 1 && vaParser.test(artist[0]);
				if ((ref = response.document.querySelector('div.info > div.song_name')) != null)
					album = ref.lastChild.textContent.trim();
						else throw 'Melon: invalid page structure (title missing)';
				let agency, tags = new TagManager;
				response.document.querySelectorAll('div.meta > dl.list > dt').forEach(function(dt) {
					let dd = dt.nextElementSibling;
					if (dd != null && dd.tagName == 'DD') dd = dd.textContent.trim(); else return;
					switch (dt = dt.textContent.trim()) {
						case '발매일': releaseDate = normalizeDate(dd); break;
						case '장르': tags.add(dd); break;
						case '발매사': label = dd; break;
						case '기획사': agency = dd; break;
					}
				});
				getDescription(response, 'div.cont_albuminfo', true);
				if ((ref = response.document.querySelector('head > meta[property="og:image"][content]')) != null)
					imgUrl = ref.content.replace(/\?.*$/, '').replace(/(?:_\d+)?(?=\.\w+$)/, '_1000');
				trs = response.document.querySelectorAll('div.d_song_list > table > tbody > tr');
				return Array.from(trs).map(function(tr, index) {
					trackIdentifiers = { };
					if ((ref = tr.querySelector('input.input_check')) != null) trackIdentifiers.TRACK_ID = parseInt(ref.value);
					trackArtist = Array.from(tr.querySelectorAll('div.ellipsis > a')).map(a => /*a.title || */a.textContent.trim());
					return {
						artist: isVA ? VA : undefined,
						artists: !isVA ? artist : undefined,
						album: album,
						release_date: releaseDate,
						label: label,
						agency: agency,
						genre: tags.toString(),
						media: media,
						track_number: (ref = tr.querySelector('span.rank')) != null && parseInt(ref.textContent) || index + 1,
						total_tracks: trs.length,
						title: (ref = tr.querySelector('div.ellipsis > span > a')) != null ?
							ref.title || ref.textContent.trim() : undefined,
						track_artists: trackArtist.length > 0 && (isVA || !artistsMatch([trackArtist], [artist])) ?
							trackArtist : undefined,
						//duration: undefined,
						description: description,
						url: !identifiers.MELON_ID ? response.finalUrl : undefined,
						cover_url: imgUrl,
						identifiers: mergeIds(),
					};
				});
			}); else if (url.hostname.endsWith('genie.co.kr') && url.pathname.startsWith('/detail/albumInfo')) return globalXHR(url).then(function(response) {
				if (/\b(?:axnm)=(\d+)\b/.test(url.search)) identifiers.GENIE_ID = parseInt(RegExp.$1);
					else console.warn('Genie: failed to extract album id from URL', url);
				if ((ref = response.document.querySelector('div#wrap-body > script[type="application/ld+json"]')) != null) try {
					var albumInfo = JSON.parse(ref.text);
				} catch(e) { console.warn('Genie:', e) }
				if ((ref = response.document.querySelector('div.info-zone > h2.name')) != null) album = ref.textContent.trim();
					else throw 'Melon: invalid page structure (title missing)';
				let tags = new TagManager, agency;
				response.document.querySelectorAll('div.info-zone > ul > li').forEach(function(li) {
					let attr = li.querySelector('span.attr > img'), value = li.querySelector('span.value');
					if (attr != null && value != null) switch (attr.alt) {
						case '아티스트':
							artist = Array.from(value.getElementsByTagName('A')).map(a => a.textContent.trim());
							break;
						case '장르/스타일': tags.add(value.textContent); break;
						case '발매사': label = value.textContent.trim(); break;
						case '기획사': agency = value.textContent.trim(); break;
						case '발매일': releaseDate = normalizeDate(value.textContent); break;
					} else console.warn('Genie - invalid meta info node', cli);
				});
				if (artist.length <= 0) artist = Array.from(response.document.querySelectorAll('h2.page-top-this > a'))
					.map(a => a.textContent.trim());
				isVA = artist.length <= 0 || artist.length == 1 && vaParser.test(artist[0]);
				getDescription(response, 'div.desc-cont', true);
				if ((ref = response.document.querySelector('head > meta[property="og:image"][content]')) != null)
					imgUrl = ref.content;
				trs = response.document.querySelectorAll('table > tbody > tr[songid]');
				return Promise.all(Array.from(trs).map(function(tr, index) {
					trackIdentifiers = { TRACK_ID: parseInt(tr.getAttribute('songid')) };
					return globalXHR('https://www.genie.co.kr/Includes/Commons/Module/jRelationArtistList', { responseType: 'json' },
							new URLSearchParams({ xgnm: trackIdentifiers.TRACK_ID })).then(function({response}) {
						// '작사' - lyricists
						// '편곡' - arrangers
						// '메인' - mainArtists
						// '작곡' - composers
						let artistList = { };
						for (let item of response.DataSet.DATA)
							artistList[item.key] = Array.from(domParser.parseFromString(item.value, 'text/html').body.getElementsByTagName('A'))
								.map(a => a.title || a.textContent.trim());
						return artistList;
					}).catch(reason => ({ })).then(function(artistList) {
						trackArtist = Array.from(tr.querySelectorAll('td.info > a.artist')).map(a => a.title || a.textContent.trim());
						if (artistList['메인'] && artistList['메인'].length > 0) trackArtist = artistList['메인'];
						return {
							artist: isVA ? VA : undefined,
							artists: !isVA ? artist : undefined,
							album: album,
							release_date: releaseDate,
							label: label,
							agency: agency,
							genre: tags.toString(),
							media: media,
							track_number: (ref = tr.querySelector('td.number')) != null && parseInt(ref.textContent) || index + 1,
							total_tracks: trs.length,
							title: (ref = tr.querySelector('td.info > a.title')) != null ?
								ref.title || ref.textContent.trim() : undefined,
							track_artists: trackArtist.length > 0 && (isVA || !artistsMatch([trackArtist, artistList['Featuring']], [artist])) ?
								trackArtist : undefined,
							track_guests: artistList['Featuring'] && artistList['Featuring'].length > 0 ?
								artistList['Featuring'] : undefined,
							composers: artistList['작곡'] && artistList['작곡'].length > 0 ? artistList['작곡'] : undefined,
							arrangers: artistList['편곡'] && artistList['편곡'].length > 0 ? artistList['편곡'] : undefined,
							//duration: undefined,
							description: description,
							url: !identifiers.GENIE_ID ? response.finalUrl : undefined,
							cover_url: imgUrl,
							identifiers: mergeIds(),
						};
					});
				}));
			}); else if (url.hostname.endsWith('music-flo.com')
					&& (identifiers.FLO_WEB_ID = /^\/detail\/album\/(\w+)\b/i.exec(url.pathname)) != null) {
				identifiers.FLO_WEB_ID = identifiers.FLO_WEB_ID[1].toLowerCase();
				identifiers.FLO_ID = parseInt(Array.from(identifiers.FLO_WEB_ID).map(function(c, ndx) {
					const pos = 'danielzohy'.indexOf(c);
					if (pos >= 0) return pos.toString();
					console.warn('FLO: unexpected character', c, 'in album id', identifiers.FLO_WEB_ID);
				}).filter(Boolean).join(''));
				const baseUrl = 'https://www.music-flo.com/api/meta/v1', params = { responseType: 'json' };
				return Promise.all([
					globalXHR(baseUrl + '/album/' + identifiers.FLO_ID, params).then(({response}) => response.data),
					globalXHR(baseUrl + '/album/' + identifiers.FLO_ID + '/track', params).then(({response}) => response.data.list),
				]).then(function(albumMeta) {
					if (prefs.diag_mode) console.debug('FLO metadata loaded:', albumMeta);
					artist = Array.isArray(albumMeta[0].artistList) ? albumMeta[0].artistList.map(artist => artist.name) : [ ];
					isVA = artist.length <= 0 || artist.length == 1 && vaParser.test(artist[0]);
					if (albumMeta[0].releaseYmd) releaseDate = normalizeDate(albumMeta[0].releaseYmd) || undefined;
					if (Array.isArray(albumMeta[0].imgList))
						imgUrl = albumMeta[0].imgList.reduce((acc, img) => img.url.replace(/\?.*$/, ''));
					switch (albumMeta[0].albumType) {
						//case 'RL': identifiers.RELEASETYPE = 'Album'; break;
						case 'SL': identifiers.RELEASETYPE = 'Single'; break;
						case 'EP': identifiers.RELEASETYPE = 'EP'; break;
						case 'OS': identifiers.RELEASETYPE = 'Soundtrack'; break;
						case 'CP': identifiers.RELEASETYPE = 'Compilation'; break;
					}
					if (!Array.isArray(albumMeta[1]) || albumMeta[1].length <= 0)
						return Promise.reject('No tracks found');
					const totalDiscs = albumMeta[1].reduce(function(acc, track) {
						const discNo = parseInt(track.diskId);
						return discNo > acc ? discNo : acc;
					}, 1);
					return Promise.all(albumMeta[1].map(track => globalXHR(baseUrl + '/track/' + track.id, params)
							.then(({response}) => response.data))).then(function(tracks) {
						if (prefs.diag_mode) console.debug('FLO tracks details loaded:', tracks);
						return tracks.map(function(track, index) {
							trackIdentifiers = { TRACK_ID: track.id };
							trackArtist = track.artistList.map(artist => artist.name);
							composer = [ ]; producer = [ ];
							let lyricists = [ ], arrangers = [ ];
							for (let trackArtist of track.trackArtistList) switch (trackArtist.roleCd) {
								//case 'ARTIST_ROLE_TYPE.VOCAL.1': // Vocal
								//case 'ARTIST_ROLE_TYPE.VOCAL.2':
								case 'ARTIST_ROLE_TYPE.CREATOR.1': lyricists.pushUniqueCaseless(trackArtist.name); break;
								case 'ARTIST_ROLE_TYPE.CREATOR.2': composer.pushUniqueCaseless(trackArtist.name); break;
								case 'ARTIST_ROLE_TYPE.CREATOR.3': arrangers.pushUniqueCaseless(trackArtist.name); break;
								case 'ARTIST_ROLE_TYPE.STUDIO.1': producer.pushUniqueCaseless(trackArtist.name); break;
								//case 'ARTIST_ROLE_TYPE.STUDIO.2': // Engineer
								//case 'ARTIST_ROLE_TYPE.STUDIO.3':
								//case 'ARTIST_ROLE_TYPE.STUDIO.4':
								//case 'ARTIST_ROLE_TYPE.STUDIO.5': // Mix
								//case 'ARTIST_ROLE_TYPE.STUDIO.6': // Mastering
							}
							switch (track.adultAuthYn) {
								case 'N': trackIdentifiers.EXPLICIT = 0; break;
								case 'Y': trackIdentifiers.EXPLICIT = 1; break;
							}
							let genre = albumMeta[0].genreStyle;
							if (track.freeYn == 'Y') genre = genre ? genre + ', freely.available' : 'freely.available';
							switch (track.svcFlacYn) {
								case 'Y': encoding = 'lossless'; format = 'FLAC'; break;
							}
							return {
								artist: isVA ? VA : undefined,
								artists: !isVA ? artist : undefined,
								album: albumMeta[0].title,
								release_date: releaseDate,
								label: albumMeta[0].albumLabelList ?
									albumMeta[0].albumLabelList.map(albumLabel => albumLabel.labelNm).join(' / ') : undefined,
								agency: albumMeta[0].agencyNm,
								genre: genre,
								media: media,
								//encoding: encoding,
								//codec: format,
								track_number: parseInt(track.trackNo) || track.trackNo || index + 1,
								total_tracks: albumMeta[1].length,
								disc_number: parseInt(track.diskId) || track.diskId || undefined,
								total_discs: totalDiscs,
								title: track.name,
								track_artists: trackArtist.length > 0 && (isVA || !trackArtist.equalCaselessTo(artist)) ?
									trackArtist : undefined,
								composers: composer.length > 0 ? composer : undefined,
								arrangers: arrangers.length > 0 ? arrangers : undefined,
								producers: producer.length > 0 ? producer : undefined,
								duration: timeStringToTime(track.playTime) || undefined,
								description: albumMeta[0].albumDesc,
								lyrics: track.lyrics,
								url: !identifiers.FLO_WEB_ID ? response.finalUrl : undefined,
								cover_url: imgUrl,
								identifiers: mergeIds(),
							};
						});
					});
				});
			} else if (url.hostname.endsWith('kugou.com') && url.pathname.includes('/album/')) return globalXHR(url).then(function(response) {
				if (/\/(\d+)\.html?$/i.test(url.pathname)) identifiers.KUGOU_ID = parseInt(RegExp.$1);
				response.document.querySelectorAll('p.detail > span').forEach(function(span) {
					let value = span.nextSibling;
					if (value != null) switch (span.textContent.trim().replace(/\s*：$/, '')) {
						case '专辑名': album = value.textContent.trim(); break;
						case '歌手': artist = value.textContent.trim(); break;
						case '发行时间': releaseDate = normalizeDate(value.textContent); break;
					}
				});
				isVA = !artist || vaParser.test(artist);
				if (!album) throw 'Album title missing';
				getDescription(response, 'div.intro > div > div > p', true);
				if ((ref = response.document.querySelector('div.pic > img')
						|| response.document.querySelector('img.loadPic')) != null) imgUrl = ref.getAttribute('_src') || ref.src;
				trs = response.document.querySelectorAll('ul.songList > li');
				return Array.from(trs).map(function(li, index) {
					trackIdentifiers = { };
					title = (ref = li.querySelector(':scope > a[title]')) != null ? ref.title
						: (ref = li.querySelector('span.text')) != null ? ref.textContent.trim() : undefined;
					if (/^(.+?)\s+-\s+(.+)$/.test(title)) {
						trackArtist = RegExp.$1;
						title = RegExp.$2;
					} else trackArtist = undefined;
					return {
						artist: isVA ? VA : artist,
						album: album,
						release_date: releaseDate,
						media: media,
						track_number: (ref = li.querySelector('span.num1')) != null && parseInt(ref.textContent) || index + 1,
						total_tracks: trs.length,
						title: title,
						track_artist: trackArtist && (isVA || trackArtist != artist) ? trackArtist : undefined,
						duration: undefined,
						description: description,
						url: !identifiers.KUGOU_ID ? response.finalUrl : undefined,
						cover_url: imgUrl,
						identifiers: mergeIds(),
					};
				});
			}); else if (url.hostname == 'music.bugs.co.kr' && url.pathname.startsWith('/album/')) return globalXHR(url).then(function(response) {
				identifiers.BUGS_ID = /^\/album\/(\d+)\b/i.exec(url.pathname);
				if (identifiers.BUGS_ID != null) identifiers.BUGS_ID = identifiers.BUGS_ID[1]; else delete identifiers.BUGS_ID;
				if ((ref = response.document.querySelector('head > script[type="application/ld+json"]')) != null) try {
					var albumMeta = JSON.parse(ref.text);
				} catch (d) {
					albumMeta = undefined;
					console.warn(e);
				}
				if (albumMeta && albumMeta.name) album = albumMeta.name;
					else if ((ref = response.document.querySelector('header.pgTitle h1')) != null)
						album = ref.title || ref.textContent.trim;
							else throw 'Bugs KR: invalid page structure (title missing)';
				let tags = new TagManager;
				response.document.querySelectorAll('div.basicInfo table.info > tbody > tr').forEach(function(tr) {
					let key = tr.querySelector(':scope > th[scope="row"]'), value =  tr.querySelector(':scope > td:last-of-type');
					if (key != null && value != null) switch (key.textContent.trim().replace(/\s*[:：].*$/, '')) {
						case '아티스트':
							artist = Array.from(value.getElementsByTagName('A')).map(a => a.title || a.textContent.trim());
							if (artist.length <= 0) artist = value.title || value.textContent.trim();
							break;
						case '앨범 종류':
							switch (value.textContent.trim()) {
								//case '정규': identifiers.RELEASETYPE = 'Album'; break;
								case '싱글': identifiers.RELEASETYPE = 'Single'; break;
								case 'EP(미니)': identifiers.RELEASETYPE = 'EP'; break;
								case 'OST': identifiers.RELEASETYPE = 'Soundtrack'; break;
								case '컴필레이션': identifiers.RELEASETYPE = 'Compilation'; break;
								//case '리마스터': // remaster
							}
							break;
						case '발매일': releaseDate = normalizeDate(value.textContent); break;
						case '장르': case '스타일':
							tags.add(...Array.from(value.getElementsByTagName('A')).map(a => a.title || a.textContent.trim()));
							break;
						case '유통사': label = value.textContent.trim();
						case '고음질': break; // audio formats
					} else console.warn('Bugs: unexpected row', tr);
				});
				isVA = Array.isArray(artist) && (artist.length <= 0 || artist.length == 1 && vaParser.test(artist[0]))
					|| typeof(artist) == 'string' && vaParser.test(artist);
				getDescription(response, 'p#albumContents', true);
				if (!description && albumMeta && albumMeta.description) description = albumMeta.description.bbQuote();
				if ((ref = response.document.querySelector('meta[property="og:image"][content]')) != null)
					imgUrl = ref.content.replace(/(\/album\/images)\/\w+\//i, '$1/original/');
				trs = response.document.querySelectorAll('table.trackList > tbody > tr[trackid]');
				return Array.from(trs).map(function(tr, index) {
					trackIdentifiers = { TRACK_ID: parseInt(tr.getAttribute('trackid')) || undefined };
					trackArtist = Array.from(tr.querySelectorAll('p.artist > a')).map(a => a.title || a.textContent.trim());
					return {
						artist: isVA ? VA : typeof(artist) == 'string' ? artist : undefined,
						artists: !isVA && Array.isArray(artist) && artist.length > 0 ? artist : undefined,
						album: album,
						release_date: releaseDate,
						label: label,
						genre: tags.toString(),
						media: media,
						track_number: (ref = tr.querySelector('p.trackIndex > em')) != null && parseInt(ref.textContent) || index + 1,
						total_tracks: trs.length,
						title: (ref = tr.querySelector('th > p.title > a')) != null ?
							ref.title || ref.textContent.trim() : undefined,
						track_artists: trackArtist.length > 0 && (isVA || !artist
							|| Array.isArray(artist) && !trackArtist.equalCaselessTo(artist)
							|| typeof(artist) == 'string' && !artistsMatch([trackArtist], artist)) ? trackArtist : undefined,
						description: description,
						url: !identifiers.BUGS_ID ? response.finalUrl : undefined,
						cover_url: imgUrl,
						identifiers: mergeIds(),
					};
				});
			}); else if (url.hostname.endsWith('joox.com')) {
				if (url.pathname.includes('/album/')) {
					identifiers.JOOX_ID = /\/album\/([^\/\?\#]+)/i.exec(url.pathname);
					if (identifiers.JOOX_ID != null) identifiers.JOOX_ID = identifiers.JOOX_ID[1];
						else return Promise.reject('JOOX: invalid URL');
					return globalXHR('https://api-jooxtt.sanook.com/page/albumDetail?' + new URLSearchParams({
						id: identifiers.JOOX_ID,
						num: 999,
						lang: 'en',
						country: 'intl',
						device: 'desktop',
					}).toString(), { responseType: 'json' }).then(function(response) {
						if (response.response.albumTracks.status_code != 0) return Promise.reject(response.response.albumTracks.error);
						if (prefs.diag_mode) console.debug('JOOX metadata loaded:', response.response);
						artist = Array.isArray(response.response.albumTracks.artist_list) ?
							response.response.albumTracks.artist_list.map(artist => artist.name) : [ ];
						isVA = artist.length <= 0 || artist.length == 1 && vaParser.test(artist[0]);
						releaseDate = normalizeDate(response.response.albumTracks.publish_date
							|| response.response.albumTracks.release_date) || undefined;
						if (response.response.albumTracks.images)
							imgUrl = response.response.albumTracks.images.reduceRight((acc, img) => img.url.replace(/\/(\d+)$/, '/0'), undefined);
						return Promise.all(response.response.albumTracks.tracks.items.map(function(track) {
							if (!track.lrc_exist/* && !track.qrc_exist*/) return Promise.resolve(track);
							return globalXHR('https://api-jooxtt.sanook.com/page/single?' + new URLSearchParams({
								id: track.id,
								num: 10,
								country: 'intl',
								lang: 'en',
								regionURI: 'intl-en',
								device: 'desktop',
							}).toString(), { responseType: 'json' })
									.then(({response}) => Object.assign(response.single, { play_duration: track.play_duration })).catch(function(reason) {
								console.warn('JOOX single detail request:', reason);
								return track;
							});
						})).then(tracks => tracks.map(function(track, index) {
							trackIdentifiers = { TRACK_ID: track.id };
							if (track.artist_list) trackArtist = track.artist_list.map(artist => artist.name);
							if (track.language) trackIdentifiers.LANGUAGE = track.language;
							return {
								artist: isVA ? VA : undefined,
								artists: !isVA ? artist : undefined,
								album: response.response.albumTracks.name,
								release_date: releaseDate,
								genre: track.genre,
								media: media,
								track_number: index + 1,
								total_tracks: response.response.albumTracks.tracks.total_count,
								title: track.name,
								track_artists: Array.isArray(trackArtist) && trackArtist.length > 0
									&& (isVA || !trackArtist.equalCaselessTo(artist)) ? trackArtist : undefined,
								duration: track.play_duration || undefined,
								description: response.response.albumTracks.description || undefined,
								lyrics: track.lrc_content ? atob(track.lrc_content) : undefined,
								url: !identifiers.JOOX_ID ? response.finalUrl : undefined,
								cover_url: imgUrl,
								identifiers: mergeIds(),
							};
						}));
					});
				} else if (url.pathname.includes('/single/')) {
					identifiers.JOOX_SINGLE_ID = /\/single\/([^\/\?\#]+)/i.exec(url.pathname);
					if (identifiers.JOOX_SINGLE_ID != null) identifiers.JOOX_SINGLE_ID = identifiers.JOOX_SINGLE_ID[1];
						else return Promise.reject('JOOX: invalid URL');
					return globalXHR('https://api-jooxtt.sanook.com/page/single?' + new URLSearchParams({
						id: identifiers.JOOX_SINGLE_ID,
						num: 10,
						country: 'intl',
						lang: 'en',
						regionURI: 'intl-en',
						device: 'desktop',
					}).toString(), { responseType: 'json' }).then(function(response) {
						if (response.response.single.status_code != 0) return Promise.reject(response.response.single.error);
						if (prefs.diag_mode) console.debug('JOOX metadata loaded:', response.response);
						identifiers.RELEASETYPE = 'Single';
						trackIdentifiers = { TRACK_ID: response.response.single.id };
						return [{
							artists: response.response.single.artist_list.map(artist => artist.name),
							album: response.response.single.album_name,
							release_date: normalizeDate(response.response.single.publish_date || response.response.single.public_time/*?*/
								|| response.response.single.release_time) || undefined,
							genre: response.response.single.genre,
							media: media,
							track_number: 1,
							total_tracks: 1,
							title: response.response.single.name,
							duration: response.response.single.play_duration || undefined,
							lyrics: response.response.single.lrc_content ? atob(response.response.single.lrc_content) : undefined,
							url: !identifiers.JOOX_SINGLE_ID ? response.finalUrl : undefined,
							cover_url: response.response.single.images ? response.response.single.images
								.reduceRight((acc, img) => img.url.replace(/\/(\d+)$/, '/0'), undefined) : undefined,
							identifiers: mergeIds(),
						}];
					});
				} else return Promise.reject('JOOX: invalid URL');
			} else if (url.hostname.endsWith('soundcloud.com')) return globalXHR(url).then(function({document}) {
				for (let script of document.body.getElementsByTagName('SCRIPT'))
					if (/\b(?:_*sc_hydration)\s*=\s*(\[.+\]);$/.test(script.text))
						try { var __sc_hydration = JSON.parse(RegExp.$1) } catch(e) { __sc_hydration = eval(RegExp.$1) }
				if (!__sc_hydration) throw 'SoundCloud metadata not found in page';
				let playlist = __sc_hydration.find(elem => elem.hydratable == 'playlist');
				if (playlist) playlist = playlist.data; else throw 'SoundCloud playlist not found in page';
				if (!playlist.is_album) throw 'SoundCloud playlist not an album';
				if (!Array.isArray(playlist.tracks) || playlist.tracks.length <= 0) throw 'SoundCloud playlist empty';
				if (prefs.diag_mode) console.log('SoundCloud playlist metadata extracted:', playlist);
				identifiers = {
					SOUNDCLOUD_ID: playlist.id,
					ARTIST_ID: playlist.user_id,
					DURATION_PRECISION: 'ms',
				};
				if (playlist.set_type) switch (playlist.set_type.toLowerCase()) {
					case 'ep': identifiers.RELEASETYPE = 'EP'; break;
					case 'single': identifiers.RELEASETYPE = 'Single'; break;
				}
				isVA = !playlist.user || vaParser.test(playlist.user.username);
				return finalizeTracks(playlist.tracks.filter(track => track.kind == 'track').map((track, index, tracks) => ({
					artist: isVA ? VA : playlist.user && playlist.user.username || undefined,
					album: track.publisher_metadata && track.publisher_metadata.album_title || playlist.title,
					release_date: playlist.release_date,
					genre: track.genre || playlist.genre || undefined,
					tags: track.tag_list || playlist.tag_list || undefined,
					media: media,
					label: track.label_name || playlist.label_name || undefined,
					track_number: index + 1,
					total_tracks: playlist.track_count,
					title: track.publisher_metadata && track.publisher_metadata.release_title || track.title,
					track_artist: (trackArtist = track.publisher_metadata && track.publisher_metadata.artist
						|| track.user && track.user.username) && (trackArtist != playlist.user.username || isVA) ?
							trackArtist : undefined,
					duration: (track.full_duration || track.duration) / 1000 || undefined,
					description: track.description || playlist.description || undefined,
					url: playlist.permalink_url || 'https://soundcloud.com' + playlist.url,
					cover_url: playlist.artwork_url ? playlist.artwork_url.replace(/-\w+(?=\.\w+$)/, '-original') : undefined,
					identifiers: Object.assign({
						TRACK_ID: track.id,
						EXPLICIT: track.publisher_metadata && 'explicit' in track.publisher_metadata ?
							Number(track.publisher_metadata.explicit) : undefined,
						BARCODE: track.publisher_metadata && track.publisher_metadata.upc_or_ean,
						ISRC: track.publisher_metadata && track.publisher_metadata.isrc,
						TRACK_AUTH: track.track_authorization,
					}, identifiers),
				})));
			}); else return globalXHR(url).then(function(response) {
				let elem = response.document.querySelector('head > meta[name="generator"][content]');
				if (elem != null && elem.content.toLowerCase() == 'bandcamp') return bcParser(response);
				if (!weak) uaData.value = '';
				return Promise.reject('can not extract anything from ' + url);
			});

			function bcParser(response) {
				function safeParse(serialized) {
					if (serialized) try { return JSON.parse(serialized) } catch (e) { console.warn('BC meta invalid: %s', e, serialized) }
					return null;
				}
				const spamFilter = description => description && (description.length >= 180
					&& !/\b(?:Buy|Bookings?|(?:Pre)?Orders?|Sales|Purchases?|Store|Tickets|sold out|please visit|available (?:at|on|here)|Physical (?:album|copy|media)|\d+\s+copies|Take a look|Download|Track\s?list(?:ing)?|(?:facebook|soundcloud|bandcamp|twitter|myspace|instagram|residentadvisor|youtube)\.com)\b/im.test(description)
					|| confirm('Release about supposedly contains spammy content, insert anyway?\n\nAbout excerpt:\n\n' + (maxLength =>
						description.length > maxLength ? description.slice(0, maxLength) + '...' : description)(1500)));

				if (!url.pathname.startsWith('/album/') && !url.pathname.startsWith('/track/'))
					console.warn('Nonstandard Bandcamp path:', url);
				const stripText = text => text ? [
					[/\r\n/gm, '\n'], [/[^\S\n]+$/gm, ''], [/\n{3,}/gm, '\n\n'],
				].reduce((text, subst) => text.replace(...subst), text.trim()) : '';
				artist = Array.from(response.document.querySelectorAll('div#name-section > h3 > span > a'))
					.map(a => a.textContent.trim());
				isVA = artist.length <= 0 || artist.length == 1 && vaParser.test(artist[0]);
				if ((ref = response.document.querySelector('span.back-link-text')) != null)
					label = ref.lastChild.textContent.trim();
				else if ((ref = response.document.querySelector('p#band-name-location > span.title')) != null)
					label = ref.textContent.trim();
				let tags = new TagManager;
				response.document.querySelectorAll('div.tralbumData.tralbum-tags > a.tag').forEach(function(tag) {
					tag = tag.textContent.trim();
					if (!artist.some(artist => tag.toLowerCase() == artist.toLowerCase())) tags.add(tag);
				});
				if ((ref = response.document.querySelector('div#tralbumArt > a.popupImage')) != null) ref = ref.href;
					else if ((ref = response.document.querySelector('meta[property="og:image"]')) != null) ref = ref.conent;
				if (ref) imgUrl = ref.replace(/_\d+(?=\.\w+$)/, '_0');
				// let playerData = (ref = response.document.querySelector('meta[property="og:video"][content]')) != null ?
				// 	globalXHR(ref.content, { responseType: 'text' }).then(function(response) {
				// 		if (!/^\s*(var\s+playerdata\s*=\s*(\{.+\});)\s*$/m.test(response.responseText))
				// 			return Promise.reject('External metadata not found');
				// 		try { return JSON.parse(RegExp.$2) } catch(e) {
				// 			try {
				// 				eval(RegExp.$1);
				// 				return playerdata;
				// 			} catch(e) { return Promise.reject('All methods to decode playerdata failed:' + e) }
				// 		}
				// 	}) : Promise.reject('Player data missing');
				// if (prefs.diag_mode) playerData.then(playerdata => { console.debug('Bandcamp playerdata loaded:', playerdata) })
				// playerData.catch(reason => { console.warn('Bandcamp playerdata load failed:', reason) });
				const releaseMeta = (ref = response.document.head.querySelector(':scope > script[type="application/ld+json"]')) && safeParse(ref.text);
				if (prefs.diag_mode) console.debug('Bandcamp JSON meta loaded:', releaseMeta);
				const tralbum = (ref = response.document.head.querySelector('script[data-tralbum]')) && safeParse(ref.dataset.tralbum);
				description = [ ];
				if (tralbum) {
					if (Array.isArray(tralbum.packages) && tralbum.packages.length > 0) for (let key in tralbum.packages[0])
						if (!tralbum.current[key] && tralbum.packages.every(pkg => pkg[key] == tralbum.packages[0][key]))
							tralbum.current[key] = tralbum.packages[0][key];
					if (prefs.diag_mode) console.debug('Bandcamp tralbum data loaded:', tralbum);
					if (!tralbum.trackinfo || tralbum.trackinfo.length <= 0) throw 'No tracks found';
					identifiers.BANDCAMP_ID = tralbum.current.album_id || tralbum.current.id || tralbum.id;
					identifiers.RELEASETYPE = tralbum.current.type || tralbum.item_type;
					if (identifiers.RELEASETYPE && identifiers.RELEASETYPE.toLowerCase() == 'album') delete identifiers.RELEASETYPE;
					if (tralbum.current.upc) identifiers.UPC = tralbum.current.upc;
					if (tralbum.current.artist || tralbum.artist) isVA = vaParser.test(tralbum.current.artist || tralbum.artist);
					if (releaseMeta != null && Array.isArray(releaseMeta.keywords)) tags = new TagManager(...releaseMeta.keywords);
					if (tralbum.current.minimum_price <= 0) tags.add('freely.available');
					if ((ref = releaseMeta != null && releaseMeta.description || tralbum.current.about)
							&& ![ ].some(rx => rx.test(ref)) && spamFilter(ref))
						description.push('[quote][plain]' + stripText(ref) + '[/plain][/quote]');
					if ((ref = releaseMeta != null && releaseMeta.creditText || tralbum.current.credits)
							&& ![/^\s*released\b.{0,20}\s*$/i].some(rx => rx.test(ref)))
						description.push('[hide=Credits][plain]' + stripText(ref) + '[plain][/hide]');
					if (releaseMeta != null && releaseMeta.image) imgUrl = releaseMeta.image.replace(/_\d+(?=\.\w+$)/, '_0');
					description = description.join('\n');
					return tralbum.trackinfo.map(function(track, index) {
						trackIdentifiers = {
							TRACK_ID: track.track_id,
							//HASLYRICS: Number(track.has_lyrics) || 0,
						};
						return {
							artist: isVA ? VA : releaseMeta != null && releaseMeta.byArtist ? releaseMeta.byArtist.name
								: tralbum.current.artist || tralbum.artist || joinArtists(artist),
							album: releaseMeta != null && releaseMeta.name ? releaseMeta.name : tralbum.current.title,
							release_date: releaseMeta != null && releaseMeta.datePublished ? releaseMeta.datePublished
								: tralbum.current.release_date || tralbum.album_release_date,
							label: releaseMeta != null && releaseMeta.publisher ? releaseMeta.publisher.name
								: label || tralbum.current.label || undefined,
							catalog: tralbum.current.sku || undefined,
							genre: tags.toString(),
							duration: track.duration || undefined,
							lyrics: track.lyrics || undefined,
							title: track.title,
							track_number: (tralbum.initial_track_num || 0) + (track.track_num || index + 1),
							total_tracks: releaseMeta != null && releaseMeta.numTracks ? releaseMeta.numTracks : tralbum.trackinfo.length,
							media: 'WEB',
							cover_url: imgUrl,
							description: description || undefined,
							url: releaseMeta != null && releaseMeta.mainEntityOfPage ? releaseMeta.mainEntityOfPage : tralbum.url || response.finalUrl,
							identifiers: mergeIds(),
						};
					});
				}
				console.warn('Bandcamp: falling back to HTML parser');
				if ((ref = response.document.querySelector('div#name-section > h2.trackTitle')) != null)
					album = ref.textContent.trim();
				ref = response.document.querySelector('div.tralbum-credits');
				if (ref != null && /\b(?:release[ds])\s+(.*?\b\d{4})\b/i.test(ref.textContent)) releaseDate = RegExp.$1;
				if ((ref = response.document.querySelector('li.buyItem span.buyItemExtra ')) != null
						&& ref.textContent.includes('name your price')) tags.add('freely.available');
				if ((ref = response.document.body.querySelector('div.tralbumData.tralbum-about')) != null
						&& (ref = html2php(ref, response.finalUrl).trim())
					 	&& ![ ].some(rx => rx.test(ref)) && spamFilter(ref))
					description.push('[quote][plain]' + ref + '[/plain][/quote]');
				if ((ref = response.document.body.querySelector('div.tralbumData.tralbum-credits')) != null
						&& (ref = html2php(ref, response.finalUrl).trim())
					 	&& ![/^\s*released\b.{0,20}\s*$/i].some(rx => rx.test(ref)))
					description.push('[hide=Credits][plain]' + ref + '[/plain][/hide]');
				description = description.join('\n');
				if ((ref = response.document.querySelector('input.email-im-link-text[type="text"]')) != null)
					var shareLink = ref.value.replace(/^(?:http)\b/i, 'https');
				return Array.from(trs = response.document.querySelectorAll('table#track_table > tbody > tr.track_row_view'), tr => ({
					artist: isVA ? VA : undefined,
					artists: !isVA ? artist : undefined,
					album: album,
					//album_year: extractYear(releaseDate),
					release_date: releaseDate,
					label: label,
					media: media,
					genre: tags.toString(),
					disc_number: discNumber,
					total_discs: totalDiscs,
					track_number: (ref = tr.querySelector('div.track_number')) != null ?
						parseInt(ref.textContent) || ref.textContent.replace(/\..*$/, '') : undefined,
					total_tracks: trs.length,
					title: (ref = tr.querySelector('div.title span.track-title, div.title span[itemprop="name"]')) != null ?
						ref.textContent.trim().replace(/\s+/g, ' ') : undefined,
					duration: durationFromMeta(tr) || (ref = tr.querySelector('span.time')) != null
						&& timeStringToTime(ref.textContent) || undefined,
					url: shareLink || response.finalUrl,
					description: description,
					identifiers: mergeIds(),
					cover_url: imgUrl,
				}));
			}

			function mergeIds() {
				let r = Object.assign({}, identifiers, trackIdentifiers);
				trackIdentifiers = {};
				return r;
			}

			function getDescription(response, selectorOrNode, quote = false) {
				function addFromNode(node) {
					const p = html2php(node, response.finalUrl).trim();
					if (p) description.push(p);
				}

				description = [ ];
				if (selectorOrNode instanceof HTMLElement) addFromNode(selectorOrNode);
					else if (typeof selectorOrNode == 'string')
						response.document.querySelectorAll(selectorOrNode).forEach(addFromNode);
				description = description.join('\n\n').collapseGaps();
				if (quote && description && !quoteDetector.test(description)) description = description.bbQuote();
			}

			function durationFromMeta(elem) {
				if (!(elem instanceof HTMLElement)) return undefined;
				let meta = elem.querySelector('meta[itemprop="duration"][content]');
				if (meta == null) return undefined;
				let m = /^PT?(?:(?:(\d+)H)?(\d+)M)?(\d+)S$/i.exec(meta.content);
				if (m != null) return (parseInt(RegExp.$1) || 0) * 60**2 + (parseInt(RegExp.$2) || 0) * 60 + (parseInt(RegExp.$3) || 0);
				m = timeStringToTime(meta.content);
				return m != null ? m : undefined;
			}

			function guessDiscNumber() {
				if (discParser.test(discSubtitle)) {
					discSubtitle = undefined;
					discNumber = parseInt(RegExp.$1);
				}
			}

			function finalizeTracks(_tracks = tracks) {
				if (!isVA && _tracks.every(track => Array.isArray(track.track_artists) ?
						track.track_artists.equalCaselessTo(_tracks[0].track_artists) && (Array.isArray(track.track_guests) ?
							track.track_guests.equalCaselessTo(_tracks[0].track_guests) : !Array.isArray(_tracks[0].track_guests))
						: track.track_artist && track.track_artist == _tracks[0].track_artist)) _tracks.forEach(function(track, ndx) {
					const deleteProperties = (...propNames) => { for (let prop of propNames) if (prop in track) delete track[prop] }
					track.artists = _tracks[0].track_artists;
					track.featured_artists = _tracks[0].track_guests;
					track.artist = _tracks[0].track_artist;
					deleteProperties('track_artist', 'track_guests', 'track_artists');
				});
				return _tracks;
			}
		} // fetchOnline_Music

		function stringifyArtists(artists) {
			if (Array.isArray(artists)) try {
				if (artists[0].length <= 0) return null;
				let result = joinArtists(artists[0]);
				if (artists[1].length > 0) result += ' feat. ' + joinArtists(artists[1]);
				return result;
			} catch(e) { console.error('stringifyArtists(…):', e) }
			return null;
		}

		function strip(art) {
			return [
				/\s+(?:aka|AKA)\.?\s+(.*)$/g,
				tailingBracketStripper,
			].reduce((acc, rx, ndx) => ndx != 1 || rx.test(acc) && !notMonospaced(RegExp.$1) ? acc.replace(rx, '') : acc, art);
		}

		function getSiteArtist(artist, asynchronous = false) {
			//if (isOPS) return undefined;
			if (!artist || notSiteArtistsCache.includesCaseless(artist)) return null;
			const cacheKey = Object.keys(siteArtistsCache).find(it => it.toLowerCase() == artist.toLowerCase());
			if (cacheKey) return siteArtistsCache[cacheKey];
			if ('ajaxTimeFrame' in window.localStorage) try {
				var apiTimeFrame = JSON.parse(window.localStorage.getItem('ajaxTimeFrame'));
			} catch(e) { apiTimeFrame = { } } else apiTimeFrame = { };
			if (!('expiresAt' in apiTimeFrame) || apiTimeFrame.expiresAt > 0 && Date.now() >= apiTimeFrame.expiresAt) apiTimeFrame = {
				expiresAt: null,
				requestCounter: 1,
			}; else ++apiTimeFrame.requestCounter;
			window.localStorage.setItem('ajaxTimeFrame', JSON.stringify(apiTimeFrame));
			if (apiTimeFrame.requestCounter > gazelleApiQuota) {
				console.debug('getSiteArtist() request exceeding AJAX API time frame: /ajax.php?action=artist&artistname="' +
					artist + '" (' + apiTimeFrame.requestCounter + ')');
				if (prefs.messages_verbosity >= 2) addMessage('AJAX API request exceeding time frame: artistname="' +
					artist + '" (' + apiTimeFrame.requestCounter + ')', 'notice');
				++ajaxRejects;
				return undefined;
			}
			const xhr = new XMLHttpRequest;
			const url = '/ajax.php?' + new URLSearchParams({ action: 'artist', artistname: artist });
			try {
				xhr.open('GET', url, asynchronous);
				if (ajaxApiKey) xhr.setRequestHeader('Authorization', ajaxApiKey);
				xhr.send();
				if (!((apiTimeFrame = JSON.parse(window.localStorage.getItem('ajaxTimeFrame'))).expiresAt > 0)) {
					apiTimeFrame.expiresAt = Date.now();
					window.localStorage.setItem('ajaxTimeFrame', JSON.stringify(apiTimeFrame));
				}
				if (xhr.status == 404) {
					notSiteArtistsCache.pushUniqueCaseless(artist);
					return null;
				}
				if (xhr.readyState != XMLHttpRequest.DONE || xhr.status < 200 || xhr.status >= 400) {
					console.warn('getSiteArtist("' + artist + '") error:', xhr, 'url:', document.location.origin + url);
					return undefined; // error
				}
				const response = JSON.parse(xhr.responseText);
				if (response.status != 'success') {
					notSiteArtistsCache.pushUniqueCaseless(artist);
					return null;
				}
				for (let key of ['torrentgroup', 'requests']) delete response.response[key];
				siteArtistsCache[artist] = response.response;
				if (prefs.diag_mode) console.log('getSiteArtist("' + artist + '") success:', siteArtistsCache[artist]);
				return (siteArtistsCache[artist]);
			} catch(e) {
				console.error('UA::getSiteArtist("' + artist + '"):', e, xhr, url);
				return undefined;
			}
		}

		function splitArtists(str, parsers = multiArtistParsers) {
			if (!str) return [ ];
			let result = [str];
			if (Array.isArray(parsers)) for (let parser of parsers) for (let i = result.length; i > 0; --i) {
				let j = result[i - 1].split(parser).map(strip);
				if (j.length > 1 && j.every(twoOrMore) //&& !j.some(artist => pseudoArtistParsers.some(rx => rx.test(artist)))
						&& !getSiteArtist(result[i - 1])) result.splice(i - 1, 1, ...j);
			}
			return result;
		}

		function splitAmpersands(artists) {
			if (typeof artists == 'string') var result = splitArtists(artists);
				else if (Array.isArray(artists)) result = Array.from(artists); else return [ ];
			for (let ampersandParser of ampersandParsers) for (let i = result.length; i > 0; --i) {
				let j = result[i - 1].split(ampersandParser).map(strip);
				if (j.length <= 1 || getSiteArtist(result[i - 1]) || !j.every(looksLikeTrueName)) continue;
				result.splice(i - 1, 1, ...j.filter(artist =>
					!result.includesCaseless(artist) && !pseudoArtistParsers.some(rx => rx.test(artist))));
			}
			return result;
		}

		function getArtists(trackArtist) {
			if (!trackArtist || typeof trackArtist != 'string') trackArtist = '';
			otherArtistsParsers.forEach(it => { if (it[0].test(trackArtist)) trackArtist = RegExp.$1 });
			let result = [[ ], [ ]];
			featArtistParsers.forEach(function(rx, ndx) {
				let matches = rx.exec(trackArtist);
				if (matches == null || ndx >= 7 && !looksLikeTrueName(matches[1], 1)) return;
				splitAmpersands(matches[1]).forEach(artist => { result[1].pushUniqueCaseless(artist) });
				trackArtist = trackArtist.replace(rx, '');
			});
			splitAmpersands(trackArtist).forEach(artist => { result[0].pushUniqueCaseless(artist) });
			return result;
		}

		function artistsMatch(artist1, artist2) {
			if (!artist1 && !artist2) return true;
			if (!artist1 || !artist2) return false;
			if (typeof artist1 == 'string' && typeof artist2 == 'string'
					&& artist1.toLowerCase() == artist2.toLowerCase()) return true;
			if (Array.isArray(artist1)) {
				var _artist1 = getStringVariants(artist1);
				try { if (_artist1.some(artist => artist == artist2.toLowerCase())) return true } catch(e) { }
			}
			if (Array.isArray(artist2)) {
				var _artist2 = getStringVariants(artist2);
				try { if (_artist2.some(artist => artist == artist1.toLowerCase())) return true } catch(e) { }
			}
			if (_artist1 && _artist2 && _artist1.some(artist => _artist2.includes(artist))) return true;
			if (typeof artist1 == 'string') artist1 = getArtists(artist1);
			if (typeof artist2 == 'string') artist2 = getArtists(artist2);
			if (!Array.isArray(artist1) || !Array.isArray(artist2)) {
				console.warn('artistsMatch: assertion failed', artist1, artist2);
				return false;
			}
			return Array.isArray(artist1[0]) && Array.isArray(artist2[0]) && artist1[0].equalCaselessTo(artist2[0])
				&& ((!Array.isArray(artist1[1]) || artist1[1].length <= 0) && (!Array.isArray(artist2[1]) || artist2[1].length <= 0)
					|| Array.isArray(artist1[1]) && artist1[1].equalCaselessTo(artist2[1]));
		}

		function getStringVariants(arr) {
			if (!Array.isArray(arr)) return null;
			let result = [arr[0].join(', '), joinArtists(arr[0])];
			if (Array.isArray(arr[1]) && arr[1].length > 0) {
				result[0] += ' feat. ' + arr[1].join(', ');
				result[1] += ' feat. ' + joinArtists(arr[1]);
				result = result.concat(result.map(a => a.replace(' feat. ', ' ft. ')))
					.concat(result.map(a => a.replace(' feat. ', ' featuring ')))
					.concat(result.map(a => a.replace(' feat. ', ' with ')))
					.concat(result.map(a => a.replace(' feat. ', ' avec ')));
			}
			return result.map(a => a.toLowerCase());
		}

		function queryGenericAPI(hostName, endPoint, params = undefined, headers = undefined) {
			return endPoint ? new Promise(function(resolve, reject) {
				let url = new URL(endPoint, httpParser.test(endPoint) ? undefined : 'https://' + hostName),
						query = new URLSearchParams(params);
				if (Array.from(query).length > 0) url.search = query;
				if (!headers || typeof headers != 'object') headers = { };
				Object.assign(headers, {
					'Accept': 'application/json',
					'X-Requested-With': 'XMLHttpRequest',
				});
				//if (prefs.diag_mode) console.debug('queryGenericAPI(...) requesting URL', url.href);
				queryInternal();

				function queryInternal() {
					GM_xmlhttpRequest({ method: 'GET', url: url, responseType: 'json', headers: headers,
						onload: function(response) {
							//if (prefs.diag_mode) console.debug('queryGenericAPI', domain, key, params, headers, response);
							if (response.status < 200 || response.status >= 400) return reject(defaultErrorHandler(response));
							try {
								if (['OK', 'ok', 'success'].some(status => status == response.response.status))
									return resolve(response.response);
								if (response.response.status == 'error'
										|| response.response.code != undefined && response.response.message)
									return reject('API error ' + (response.response.code >= 0 ? response.response.code
										: response.response.status) + ' (' + response.response.message + ')');
							} catch(e) { console.warn('queryGenericAPI:', e, response.responseText) }
							resolve(response.response);
						},
						onerror: response => { reject(defaultErrorHandler(response)) },
						ontimeout: response => { reject(defaultTimeoutHandler(response)) },
					});
				}
			}) : Promise.reject('endpoint missing');
		}
		function queryItunesAPI(endPoint, params) {
			return endPoint ? queryGenericAPI('itunes.apple.com', endPoint, params) : Promise.reject('No API endpoint');
		}
		function queryDeezerAPI(endPoint, params) {
			return endPoint ? new Promise(function(resolve, reject) {
				const t0 = Date.now(), safeTimeFrame = 5000 + GM_getValue('deezer_quota_reserve', 500);
				let dzUrl = 'https://api.deezer.com/' + endPoint, retryCounter = 0, quotaCounter = 0;
				if (params && typeof params == 'object') try {
					params = new URLSearchParams(params);
					dzUrl += '?' + params.toString();
				} catch(e) { console.error(e, params) } else if (params != undefined) dzUrl += '/' + params.toString();
				//console.debug('Deezer query URL:', url);
				requestInternal();

				function requestInternal() {
					const requestStart = Date.now();
					if (!dzApiTimeFrame.timeLock || requestStart > dzApiTimeFrame.timeLock) {
						dzApiTimeFrame.timeLock = requestStart + safeTimeFrame;
						dzApiTimeFrame.requestCounter = 1;
					} else ++dzApiTimeFrame.requestCounter;
					const queueSnapshot = {
						requestStart: requestStart,
						timeLock: dzApiTimeFrame.timeLock,
						position: dzApiTimeFrame.requestCounter,
						frameLength: safeTimeFrame,
					};
					if (dzApiTimeFrame.requestCounter <= 50) GM_xmlhttpRequest({
						method: 'GET',
						url: dzUrl,
						responseType: 'json',
						headers: {
							'Accept': 'application/json',
							'Accept-Language': 'en-US, en',
							'X-Requested-With': 'XMLHttpRequest',
						},
						onload: function(response) {
							if (response.status < 200 || response.status >= 400) return reject(defaultErrorHandler(response));
							if (!response.response.error) {
								let dt = Date.now() - t0;
								resolve(response.response);
								if (retryCounter > 0) console.debug('Deezer API request fulfilled after',
									retryCounter, 'retries and', quotaCounter, 'postponements in', dt, 'ms');
							} else if (response.response.error.code == 4) {
								setTimeout(requestInternal, 100);
								console.warn('Deezer API semaphore failed:', queueSnapshot, dzApiTimeFrame, ++retryCounter);
							} else reject(response.response.error.message);
						},
						onerror: response => { reject(defaultErrorHandler(response)) },
						ontimeout: response => { reject(defaultTimeoutHandler(response)) },
					}); else {
						setTimeout(requestInternal, dzApiTimeFrame.timeLock - requestStart);
						++quotaCounter;
					}
				}
			}) : Promise.reject('No API endpoint');
		}
		function queryDiscogsAPI(endPoint, params) {
			return endPoint ?
				setSession().then(auth => queryGenericAPI('api.discogs.com', endPoint, params, { 'Authorization': auth }))
					: Promise.reject('No API endpoint');

			function setSession() {
				if (prefs.discogs_token) return Promise.resolve('Discogs token="' + prefs.discogs_token + '"');
				return Promise.resolve('Discogs key="' + prefs.discogs_key + '", secret="' + prefs.discogs_secret + '"');
				// const oauthNonce = randomString(64), userAgent = 'Upload-Assistant.js/1.0';
				// // https://www.discogs.com/developers#page:authentication,header:authentication-discogs-auth-flow
				// return globalXHR('https://api.discogs.com/oauth/request_token', { method: 'HEAD', headers: {
				// 	'Content-Type': 'application/x-www-form-urlencoded',
				// 	'Authorization': 'OAuth oauth_consumer_key="' + prefs.discogs_key + '", oauth_nonce="' + oauthNonce + '", ' +
				// 	'oauth_signature="' + prefs.discogs_secret + '&", oauth_signature_method="PLAINTEXT", ' +
				// 	'oauth_timestamp="' + Date.now() + '"',
				// 	'User-Agent': userAgent,
				// } }).then(function(response) {
				// 	if (!/^(?:oauth_token)\s*=\s*(\S+)\b/im.text(response.responseHeaders)) return Promise.reject('invalid header');
				// 	let accessToken = RegExp.$1;
				// 	if (!/^(?:oauth_token_secret)\s*=\s*(\S+)\b/im.text(response.responseHeaders))
				// 		return Promise.reject('invalid header');
				// 	let accessTokenSecret = RegExp.$1;
				// 	return new Promise(function(resolve, reject) {
				// 		GM_openInTab('https://discogs.com/oauth/authorize?oauth_token=' + accessToken, {
				// 			active: true,
				// 			insert: true,
				// 			setParent: true,
				// 		}).onclose = function() {
				// 			// TODO: get verifier code
				// 			resolve(oauth_verifier);
				// 		};
				// 	}).then(oauth_verifier => globalXHR('https://api.discogs.com/oauth/access_token', {method: 'POST', headers: {
				// 		'Content-Type': 'application/x-www-form-urlencoded',
				// 		'Authorization': 'OAuth oauth_consumer_key="' + prefs.discogs_key + '", oauth_nonce="' + oauthNonce + '", ' +
				// 		'oauth_token="' + accessToken + '", oauth_signature="' + prefs.discogs_secret + '&", ' +
				// 		'oauth_signature_method="PLAINTEXT", oauth_timestamp="' + Date.now() + '", ' +
				// 		'oauth_verifier="' + oauth_verifier + '"',
				// 		'User-Agent': userAgent,
				// 	} })).then(function(response) {
				// 		if (!/^(?:oauth_token)\s*=\s*(\S+)\b/im.text(response.responseHeaders)) return Promise.reject('invalid header');
				// 		accessToken = RegExp.$1;
				// 		if (!/^(?:oauth_token_secret)\s*=\s*(\S+)\b/im.text(response.responseHeaders))
				// 			return Promise.reject('invalid header');
				// 		accessTokenSecret = RegExp.$1;
				// 		return 'oauth_token="' + accessToken + '", oauth_token_secret="' + accessTokenSecret + '"';
				// 	});
				// });
			}
		}
		function queryMusicBrainzAPI(endPoint, params) {
			return endPoint ? queryGenericAPI('musicbrainz.org', 'ws/2/' + endPoint + '/', Object.assign({ fmt: 'json' }, params))
				: Promise.reject('No API endpoint');
		}
		function querySpotifyAPI(endPoint, params) {
			const isTokenValid = accessToken => typeof accessToken == 'object' && accessToken.token_type
				&& accessToken.access_token && accessToken.expires_at >= Date.now() + oAuth2timeReserve * 1000;
			function setOAuth2Token() {
				try { var accessToken = JSON.parse(window.localStorage.spotifyAccessToken) } catch(e) { }
				if (isTokenValid(accessToken)) {
					if (prefs.diag_mode) console.debug('Re-using Spotify access token:', accessToken,
						'expires at', new Date(accessToken.expires_at).toTimeString(),
						'(' + makeTimeString((accessToken.expires_at - Date.now()) / 1000) + ')');
					return Promise.resolve(accessToken);
				}
				if (!prefs.spotify_clientid || !prefs.spotify_clientsecret)
					return Promise.reject('Spotify credentials not configured');
				const data = new URLSearchParams({
					'grant_type': 'client_credentials',
				});
				const timeStamp = Date.now();
				return globalXHR('https://accounts.spotify.com/api/token', { responseType: 'json', headers: {
					Authorization: 'Basic ' + btoa(prefs.spotify_clientid + ':' + prefs.spotify_clientsecret),
				} }, data).then(function({response}) {
					accessToken = response;
					if (!accessToken.timestamp) accessToken.timestamp = timeStamp;
					if (!accessToken.expires_at) accessToken.expires_at = accessToken.timestamp +
						(accessToken.expires_in_ms || accessToken.expires_in * 1000);
					if (!isTokenValid(accessToken)) {
						console.warn('Received invalid Spotify token:', accessToken);
						return Promise.reject('invalid token received');
					}
					window.localStorage.spotifyAccessToken = JSON.stringify(accessToken);
					if (prefs.diag_mode) console.debug('Spotify access token successfully set:', accessToken,
						makeTimeString((Date.now() - accessToken.timestamp) / 1000, true));
					return accessToken;
				});
			}

			return endPoint ? setOAuth2Token().then(credentials => queryGenericAPI('api.spotify.com', 'v1/' + endPoint, params, {
				Authorization: credentials.token_type + ' ' + credentials.access_token,
			})) : Promise.reject('No API endpoint');
		}
		function queryLastFmAPI(method, params) {
			return method ? prefs.lastfm_api_key ? queryGenericAPI('ws.audioscrobbler.com', '2.0/', Object.assign({
				method: method,
				api_key: prefs.lastfm_api_key,
				format: 'json',
			}, params || { })) : Promise.reject('Last.fm API key not configured') : Promise.reject('No API method');
		}
		function setBsOAuth2Token() {
			const isTokenValid = accessToken => accessToken && accessToken.token_type
				&& accessToken.access_token && accessToken.expires_at >= Date.now() + oAuth2timeReserve * 1000;
			if ('beatsourceAccessToken' in localStorage) try {
				var accessToken = JSON.parse(localStorage.getItem('beatsourceAccessToken'));
				if (!isTokenValid(accessToken)) throw 'token validator failed';
				if (prefs.diag_mode) console.debug('Re-using cached Beatsource access token:', accessToken,
					'expires at', new Date(accessToken.expires_at).toTimeString(),
					'(+' + ((accessToken.expires_at - Date.now()) / 1000 / 60).toFixed(2) + 'm)');
				return Promise.resolve(accessToken);
			} catch(e) {
				//console.warn('Invalid BeatSource cached access token:', e, localStorage.beatsourceAccessToken);
				localStorage.removeItem('beatsourceAccessToken');
			}
			const root = 'https://www.beatsource.com/', timeStamp = Date.now();
			return globalXHR(root).then(function(response) {
				let accessToken = response.document.getElementById('__NEXT_DATA__');
				if (accessToken != null) try {
					accessToken = JSON.parse(accessToken.text);
					return Object.assign(accessToken.props.rootStore.authStore.user, {
						apiHost: accessToken.runtimeConfig.API_HOST,
						clientId: accessToken.runtimeConfig.API_CLIENT_ID,
						recurlyPublicKey: accessToken.runtimeConfig.RECURLY_PUBLIC_KEY,
					});
				} catch(e) { console.warn(e) }
				if ((accessToken = /\b(?:btsrcSession)=([^\s\;]+)/m.exec(response.responseHeaders)) != null) try {
					accessToken = JSON.parse(decodeURIComponent(accessToken[1]));
					let sessionId = /\b(?:sessionId)=([^\s\;]+)/m.exec(response.responseHeaders);
					if (sessionId != null) try { accessToken.sessionId = decodeURIComponent(sessionId[1]) }
						catch(e) { console.warn(e) }
					return accessToken;
				} catch(e) { console.warn(e) }
				return Promise.reject('BeatSource OAuth2 access token could not be extracted');
			}).then(function(accessToken) {
				if (!isTokenValid(accessToken)) {
					console.warn('Received invalid Beatsource token:', accessToken);
					return Promise.reject('invalid token received');
				}
				try { localStorage.setItem('beatsourceAccessToken', JSON.stringify(accessToken)) } catch(e) { console.warn(e) }
				if (prefs.diag_mode) console.debug('Beatsource access token successfully set:',
					accessToken, (Date.now() - accessToken.timestamp) / 1000);
				return accessToken;
			});
		}
		function queryBeatsourceAPI(endPoint, params) {
			if (!endPoint) return Promise.reject('No API endpoint');
			if (!httpParser.test(endPoint)) {
				endPoint = 'v4/catalog/' + endPoint;
				if (!endPoint.endsWith('/')) endPoint += '/';
			}
			return setBsOAuth2Token().then(token => queryGenericAPI(token.apiHost || 'api.beatsource.com', endPoint, params, {
				'Authorization': token.token_type + ' ' + token.access_token,
			}));
		}
		function queryBeatportAPI(endPoint, params) {
			if (!endPoint) return Promise.reject('No API endpoint');
			if (!httpParser.test(endPoint)) {
				endPoint = 'v4/catalog/' + endPoint;
				if (!endPoint.endsWith('/')) endPoint += '/';
			}
			return (function setAccessToken() {
				const isTokenValid = accessToken => accessToken && accessToken.token_type
					&& accessToken.access_token && accessToken.expires_at >= Date.now() + 30 * 1000;
				return bpAccessToken instanceof Promise ? bpAccessToken.then(accessToken =>
						isTokenValid(accessToken) ? accessToken : Promise.reject('expired or otherwise invalid')).catch(function(reason) {
					bpAccessToken = null;
					console.info('Discarding Beatsource access token:', reason);
					return setAccessToken();
				}) : (bpAccessToken = (function() {
					if ('beatportAccessToken' in localStorage) try {
						const accessToken = JSON.parse(localStorage.getItem('beatportAccessToken'));
						if (!isTokenValid(accessToken)) throw 'Expired or otherwise invalid';
						console.info('Re-using cached Beatport access token:', accessToken,
							'expires at', new Date(accessToken.expires_at).toTimeString(),
							'(+' + ((accessToken.expires_at - Date.now()) / 1000 / 60).toFixed(2) + 'm)');
						return Promise.resolve(accessToken);
					} catch(e) { localStorage.removeItem('beatportAccessToken') }
					const timeStamp = Date.now(), urlBase = 'https://www.beatport.com/api/auth';
					return globalXHR(urlBase + '/session', { responseType: 'json' }).then(function(response) {
						const getCookie = (responseHeaders, cookie) =>
							(cookie = new RegExp(`^(?:set-cookie):\\s*${cookie}=(.+)$`, 'im')
								.exec(responseHeaders)) && cookie[1].split(';').map(val => val.trim());
						let cookie = getCookie(response.responseHeaders, '__Secure-next-auth\\.session-token');
						if (cookie != null) return response.response;
						const postData = { };
						if ((cookie = getCookie(response.responseHeaders, '__Host-next-auth\\.csrf-token')) != null)
							postData.csrfToken = cookie[0].split('|')[0];
						else return Promise.reject('Cookie not received');
						if ((cookie = getCookie(response.responseHeaders, '__Secure-next-auth\\.callback-url')) != null)
							postData.callbackUrl = cookie[0];
						else return Promise.reject('Cookie not received');
						return globalXHR(urlBase + '/callback/anonymous', {
							data: new URLSearchParams(Object.assign(postData, { json: true })),
						}).then(({responseHeaders}) =>
							(cookie = getCookie(responseHeaders, '__Secure-next-auth\\.session-token')) != null ?
								cookie[0] : Promise.reject('Cookie not received'))
						.then(token => globalXHR(urlBase + '/session', {
							responseType: 'json',
							cookie: '__Secure-next-auth.session-token=' + token,
						})).then(({response}) => response);
					}).then(function({token}) {
						if (!(token = {
							token_type: token.tokenType,
							access_token: token.accessToken,
							timestamp: timeStamp,
							expires_in: token.expiresIn,
							expires_at: token.accessTokenExpires,
						}).expires_at) token.expires_at = token.timestamp + (token.expires_in_ms || token.expires_in * 1000);
						if (!isTokenValid(token)) {
							console.warn('Received invalid Beatport token:', token);
							return Promise.reject('invalid token received');
						}
						try { localStorage.setItem('beatportAccessToken', JSON.stringify(token)) } catch(e) { console.warn(e) }
						console.log('Beatport access token successfully set:',
							token, `(+${(Date.now() - token.timestamp) / 1000}s)`);
						return token;
					});
				})().catch(setBsOAuth2Token));
			})().then(accessToken => queryGenericAPI('api.beatport.com', endPoint, params, {
				'Authorization': accessToken.token_type + ' ' + accessToken.access_token,
			}));
		}
		function queryNeteaseAPI(endPoint, params) {
			return endPoint ? queryGenericAPI('music.163.com', 'api/' + endPoint, params)
				.then(result => result.code == 200 ? result : Promise.reject(result.msg)) : Promise.reject('No API endpoint');
		}
		function queryBandcampAPI(endPoint, params) {
			return endPoint ? queryGenericAPI('bandcamp.com', 'api/' + endPoint, params) : Promise.reject('No API endpoint');
		}
		function queryQobuzAPI(endPoint, params) {
			function getUser(useCache = true) {
				let uid = GM_getValue('userid'), password = GM_getValue('password');
				if ('qobuzUserInfo' in localStorage) try {
					const userInfo = JSON.parse(localStorage.getItem('qobuzUserInfo'));
					if (uid && userInfo.user.login.toLowerCase() != uid.toLowerCase()) throw 'User credentials changed';
					if (!userInfo.user_auth_token) throw 'User info incomplete';
					if (useCache) {
						console.log('Qobuz user info re-used:', userInfo);
						return Promise.resolve(userInfo);
					}
				} catch(e) { localStorage.removeItem('qobuzUserInfo') }
				if (uid === undefined) GM_setValue('userid', '');
				if (password === undefined) GM_setValue('password', '');
				if (!uid || !password) return Promise.reject('insufficient user credentials');
				return apiRequest.then(apiRequest => localXHR(apiRequest.baseUrl + apiRequest.baseMethod + 'user/login', {
					responseType: 'json',
					headers: { 'X-App-Id': apiRequest.appId }
				}, new URLSearchParams({ email: uid, password: password }))).then(function(response) {
					console.log('Qobuz login successfull:', response);
					if (!response.user_auth_token) throw 'User info incomplete';
					localStorage.setItem('qobuzUserInfo', JSON.stringify(response));
					return response;
				});
			}

			for (let storage of [sessionStorage, localStorage]) if ('qobuzAPIs' in storage) storage.removeItem('qobuzAPIs');
			const apiRequest = (function() {
				function getFromStorage(storage = sessionStorage) {
					if (!(storage instanceof Storage)) throw 'Invalid argument';
					if ('qobuzAPI' in storage) try {
						const qobuzAPI = JSON.parse(storage.getItem('qobuzAPI'));
						if (!['baseMethod', 'baseUrl', 'appId'].every(key => key in qobuzAPI)) throw 'Invalid cached record';
						return Promise.resolve(qobuzAPI);
					} catch(e) { storage.removeItem('qobuzAPI') }
				}

				return getFromStorage(sessionStorage) || globalXHR('https://play.qobuz.com/login').then(function({document}) {
					const script = document.querySelector('script[src$="/bundle.js"]');
					if (script == null) return Promise.reject('Invalid document structure');
					const url = new URL(script.src);
					url.hostname = 'play.qobuz.com';
					return globalXHR(url, { responseType: 'text' });
				}).then(function({responseText}) {
					let match = /\bqobuzApi=(\{.+?\})/.exec(responseText);
					if (match != null) var qobuzAPI = eval('(' + match[1] + ')'); else throw 'Unexpected response';
					match = /\bproduction:\s*\{\s*api:\s*\{\s*appId:\s*"(\S+?)"/.exec(responseText);
					if (match != null) qobuzAPI.appId = match[1]; else throw 'Unexpected response';
					sessionStorage.setItem('qobuzAPI', match = JSON.stringify(qobuzAPI));
					localStorage.setItem('qobuzAPI', match);
					return qobuzAPI;
				}).catch(function(reason) {
					console.warn('Qobuz API extraction failed, trying to reuse last cached object:', reason);
					return getFromStorage(localStorage) || Promise.reject(reason);
				});
			})();
			return endPoint ? apiRequest.then(qobuzAPI => getUser(true).then(function(user) {
				let url = new URL(qobuzAPI.baseMethod + endPoint, qobuzAPI.baseUrl);
				if (params && typeof params == 'object') url.search = new URLSearchParams(params);
				return localXHR(url, {
					responseType: 'json',
					headers: { 'X-App-Id': qobuzAPI.appId, 'X-User-Auth-Token': user.user_auth_token },
				});
			})) : Promise.reject('API endpoint missing');
		}

		function queryHraAPI(endPoint, params) {
			const baseUrl = 'https://streaming.highresaudio.com:8182/vault3/';

			function getUserData(useCache = true) {
				if (window.sessionStorage.hraUserData) try {
					let userData = JSON.parse(window.sessionStorage.hraUserData);
					if (!userData.session_id) throw 'User data incomplete';
					if (useCache) {
						if (prefs.diag_mode) console.log('HRA user data re-used:', userData);
						return Promise.resolve(userData);
					}
				} catch(e) { delete window.sessionStorage.hraUserData }
				if (!prefs.hra_userid || !prefs.hra_userpassword) return Promise.reject('Insufficient user credentials');
				return globalXHR(baseUrl + 'user/login?' + new URLSearchParams({
					username: prefs.hra_userid,
					password: prefs.hra_userpassword,
				}).toString(), { responseType: 'json' }).then(function({response}) {
					if (prefs.diag_mode) console.debug('HRA login successfull:', response);
					if (!response.session_id) throw 'Login info invalid';
					window.sessionStorage.hraUserData = JSON.stringify(response);
					return response;
				});
			}

			return endPoint ? getUserData(true).then(function(sessionInfo) {
				let url = new URL(baseUrl + endPoint);
				url.search = new URLSearchParams(Object.assign(params || { }, { userData: JSON.stringify(sessionInfo) }));
				return globalXHR(url, { responseType: 'json' }).then(({response}) => response.status_code == '200' ? response
					: Promise.reject('API error: ' + (response.status_code ?
							response.status_code + ' (' + response.text + ')' : response.status)));
			}) : Promise.reject('No API endpoint');
		}

		function searchAppleMusic(matchLayout = false) {
			function search(title) {
				let searchTerm = '"' + title + '"';
				//searchTerm = '"' + (isVA ? VA : release.artist) + '" ' + searchTerm;
				if (!isVA) searchTerm = '"' + release.artist + '" ' + searchTerm;
				return queryAppleAPI('search', {
					'term': searchTerm,
					'types': 'albums',
					'limit': 50,
					//'include[albums]': 'artists',
					//'extend': 'artistBio,bornOrFormed,isGroup,origin,type,collectionType',
					//'fields[albums]': 'artistName,artistUrl,artwork,contentRating,editorialArtwork,name,playParams,releaseDate,url',
					//'omit[resource]', 'relationships,views,meta,autos',
				}).then(response => response.results).then(function(results) {
					if (!results || !results.album || !results.album.data || results.album.data.length <= 0)
						return Promise.reject('Apple Music: no matches');
					if (prefs.diag_mode) console.debug('Apple Music search results:', results.album);
					const matchers = [
						function(collection) {
							if (matchLayout && (collection.attributes.trackCount > 0 && collection.attributes.trackCount != tracks.length
									|| (collection.attributes.releaseDate && releaseYear > 0 && extractYear(collection.attributes.releaseDate) != releaseYear)))
								return false;
							let isSingle = collection.attributes.name.endsWith(' - Single');
							if (isSingle) collection.attributes.name = collection.attributes.name.slice(0, -9);
							let isEP = collection.attributes.name.endsWith(' - EP');
							if (isEP) collection.attributes.name = collection.attributes.name.slice(0, -5);
							isSingle = isSingle || collection.attributes.isSingle;
							isEP = !isSingle && (isEP || collection.attributes.collectionType == 'EP');
							return (releaseType == getReleaseTypeValue('Single')) == isSingle
								&& (!isEP || releaseType == getReleaseTypeValue('EP'))
								&& (releasesMatch(collection.attributes.artistName, collection.attributes.name, i)
								|| collection.attributes.censoredName && releasesMatch(collection.attributes.artistName, collection.attributes.censoredName, i));
						},
						collection => collection.explicitness == 'explicit'/*
							|| collection.explicitness != 'cleaned'*/,
					];
					if (!matchLayout) Array.prototype.push.apply(matchers, [
						collection => extractYear(collection.attributes.releaseDate) == releaseYear,
						collection => collection.attributes.trackCount == tracks.length,
					]);
					for (var i = 0; i <= maxFuzzyLevel; ++i) {
						var f = results.album.data.filter(matchers[0]);
						for (let j = 1; j < matchers.length; ++j)
							if (f.length > 1 && f.some(matchers[j])) f = f.filter(matchers[j]);
						if (f.length > 1) return Promise.reject('Apple Music: ambiguity');
						if (f.length == 1) break;
					}
					if (i > maxFuzzyLevel) return Promise.reject('Apple Music: no matches');
					if (prefs.diag_mode && i >= 2) console.debug('Apple Music fuzzy match:', release, '≈', f[0]);
					return f[0];
				});
			}

			return search(release.album).catch(reason => !tailingBracketStripper.test(release.album)
				|| !reason.endsWith('no matches') ? Promise.reject(reason)
					: search(release.album.replace(tailingBracketStripper, '')));
		}
		function loadHDtracksMetadata(urlOrId, entity = undefined) {
			if (!urlOrId) return Promise.reject('invalid argument');
			if (/^\w+$/.test(urlOrId)) var id = RegExp.lastMatch.toString();
			if (!id || !entity) try {
				if (!(urlOrId instanceof URL)) urlOrId = new URL(urlOrId);
				if (['hdtracks.com', 'www.hdtracks.com'].some(hostname => urlOrId.hostname == hostname)
						&& /^#\/(\w+)\/(\w+)\b/i.test(urlOrId.hash)) { entity = RegExp.$1; id = RegExp.$2 }
			} catch(e) { console.warn(e) }
			if (!id || !entity) return Promise.reject('invalid argument');
			return setSession().then(function(session) {
				urlOrId = 'https://hdtracks.azurewebsites.net/api/v1/' + entity + '/' + id;
				if (Object.keys(session).length > 0) urlOrId += '&' + new URLSearchParams(session);
				return fetch(urlOrId).then(response => response.json()).catch(function(reason) {
					console.warn('fetch(…) failed:', reason);
					return globalXHR(urlOrId, { responseType: 'json', fetch: true }).then(({response}) => response);
				}).then(function(result) {
					if (result.status.toLowerCase() != 'ok') return Promise.reject(result.status);
					if (prefs.diag_mode) console.debug('HDtracks', entity, 'info loaded:', result);
					return result;
				});
			});

			function setSession() {
				return Promise.resolve({
					//token: 123456789,
				});
			}
		}
		function loadMoraMetadata(webUrl) {
			return /^(?:https?):\/\/(?:\w+\.)*mora\.jp\/package\//i.test(webUrl) ? globalXHR(webUrl).then(function(response) {
				let appArguments = response.document.querySelector('meta[name="msApplication-Arguments"][content]');
				if (appArguments == null) return Promise.reject('Mora.jp: unexpected page format');
				appArguments = JSON.parse(appArguments.content);
				let materialNo = appArguments.materialNo.toString().padStart(10, '0'), offset = 0;
				let packageUrl = 'https://cf.mora.jp/contents/' + [
					appArguments.type, appArguments.mountPoint, appArguments.labelId,
				].concat([4, 3, 3].map(length => materialNo.slice(offset, offset += length))).join('/') + '/';
				return globalXHR(packageUrl + 'packageMeta.jsonp', { responseType: 'text' }).then(function({responseText}) {
					let result = /^\s*\w+\(\s*(\{[\S\s]+\})\s*\);\s*$/.exec(responseText);
					if (result == null) return Promise.reject('Mora.jp: Unexpected package meta format');
					result = Object.assign(JSON.parse(result[1]), {
						mountPoint: appArguments.mountPoint,
						webUrl: response.finalUrl.replace(/[\?\#].*$/, ''),
					});
					if (httpParser.test(result.packageUrl) && result.packageUrl != packageUrl)
						result.packageUrl += 'packageMeta.jsonp';
					return result;
				});
			}) : Promise.reject('Not mora.jp site URL');
		}
		function parseLastFm(album) {
			if (typeof album != 'object') return Promise.reject('invalid object')
			let identifiers = {}, description = [];
			if (album.id) identifiers.LASTFM_ID = album.id;
			if (album.mbid) identifiers.MBID = album.mbid;
			if (album.wiki && album.wiki.summary) description.push(album.wiki.summary);
			if (album.wiki && album.wiki.content) description.push(album.wiki.content);
			description = description.join('\n\n');
			let genres = album.tags.tag.map(tag => tag.name);
			let imgUrl = ['mega', 'extralarge', '', 'large', 'medium', 'small'].reduce(function(acc, size) {
				return acc || album.image.find(image => image.size == size && httpParser.test(image['#text']));
			}, undefined);
			if (imgUrl) imgUrl = imgUrl['#text'].replace(/\/\d+(?:x\d+|s)\//i, '/');
			return album.tracks.track.map((track, ndx) => ({
				artist: album.artist,
				album: album.name,
				genre: genres.join('; ') || undefined,
				title: track.name,
				track_number: ndx + 1,
				track_artist: !artistsMatch(track.artist.name, album.artist) ? track.artist.name : undefined,
				duration: parseFloat(track.duration) || undefined,
				url: album.url,
				description: description || undefined,
				identifiers: identifiers,
				cover_url: imgUrl,
			}));
		}
		function getYTMcfg() {
			if ('ytcfg' in sessionStorage) try { return Promise.resolve(JSON.parse(sessionStorage.ytcfg)) }
				catch(e) { console.warn('Invalid ytcfg format:', e) }
			return globalXHR('https://music.youtube.com/').then(function(response) {
				for (let script of response.document.querySelectorAll('head > script[nonce]')) {
					let ytcfg = /^\s*\b(?:ytcfg\.set)\s*\(\s*(\{.+\})\s*\);/m.exec(script.text);
					if (ytcfg != null) try {
						ytcfg = JSON.parse(ytcfg[1]);
						if (prefs.diag_mode) console.debug('YouTube Music config extracted:', ytcfg);
						if (ytcfg.INNERTUBE_API_KEY) {
							sessionStorage.ytcfg = JSON.stringify(ytcfg);
							return ytcfg;
						}
						console.warn('YouTube Music API key missing:', ytcfg);
					} catch(e) { console.warn('Error parsing ytcfg:', ytcfg[1]) }
				}
				return Promise.reject('unable to extract YouTube config ot the config is invalid');
			});
		}
		function getYTMrequestContext(ytcfg = getYTMcfg()) {
			return ytcfg && typeof ytcfg == 'object' ? {
				context: {
					activePlayers: { }, capabilities: { },
					client: Object.assign({
						experimentIds: [ ], experimentsToken: "",
						locationInfo: {
							locationPermissionAuthorizationStatus: "LOCATION_PERMISSION_AUTHORIZATION_STATUS_UNSUPPORTED",
						},
						musicAppInfo: {
							musicActivityMasterSwitch: "MUSIC_ACTIVITY_MASTER_SWITCH_INDETERMINATE",
							musicLocationMasterSwitch: "MUSIC_LOCATION_MASTER_SWITCH_INDETERMINATE",
							pwaInstallabilityStatus: "PWA_INSTALLABILITY_STATUS_UNKNOWN",
						},
						utcOffsetMinutes: -new Date().getTimezoneOffset(),
					}, ytcfg.INNERTUBE_CONTEXT.client, { hl: 'en' }),
					request: {
						internalExperimentFlags: [
							{ key: "force_music_enable_outertube_search", value: "true" }
						],
					},
					user: { enableSafetyMode: false },
				},
			} : null;
		}

		function getMusicBrainzCovers(mbid) {
			return searchInternal('release', mbid).then(covers => covers || searchMaster(), searchMaster);

			function searchInternal(entity, mbid) {
				return new Promise((resolve, reject) => GM_xmlhttpRequest({
					method: 'GET',
					url: 'https://coverartarchive.org/' + entity + '/' + mbid,
					responseType: 'json',
					onload: function(response) {
						if (response.status == 404) return resolve(null);
						if (response.status < 200 || response.status >= 400) return reject(defaultErrorHandler(response));
						var images = response.response.images
						.filter(image => httpParser.test(image.image) && image.isfront
							|| Array.isArray(image.types) && image.types.includesCaseless('Front'))
						.map(image => image.image);
						resolve(images.length > 0 ? [response.response.release, images] : null);
					},
					onerror: error => reject(defaultErrorHandler(error)),
					ontimeout: timeout => reject(defaultTimeoutHandler(timeout)),
				}));
			}
			function searchMaster() {
				return queryMusicBrainzAPI('release/' + mbid, { inc: 'release-groups' })
					.then(release => searchInternal('release-group', release['release-group'].id));
			}
		}

		function tidalRlsParser(url) {
			return /^(?:https?):\/\/(?:\w+\.)*tidal\.com\//i.test(url)
				&& (/\/album\/(\d+)\b/i.test(url) || /\b(?:albumId)=(\d+)\b/i.test(url));
		}

		function queryDeezerAPIv2(auth, method, params) {
			if (!auth || !method || !auth.cookies) return Promise.reject('Invalid arguments');
			const urlParams = new URLSearchParams(Object.assign({
				method: method,
				api_version: '1.0',
				api_token: auth.csrfToken || '',
				lang: 'us',
			}, params));
			if (auth.cid) urlParams.set('cid', auth.cid);
			let headers = { 'Referer': 'https://www.deezer.com/', 'Accept-Language': 'en-US,en' };
			if (auth.userId) headers['x-deezer-user'] = auth.userId;
			return globalXHR('https://www.deezer.com/ajax/gw-light.php?' + urlParams.toString(), {
				//method: 'POST',
				responseType: 'json',
				headers: headers,
				cookie: auth.cookies.join('; '),
			}).then(function({response}) {
				if (!response.error || Object.keys(response.error).length <= 0) return response.results;
				// if (Object.keys(response.error).some(key => response.error[key] == 'Invalid CSRF token'))
				// 	return getDeezerAPIv2Auth(false).then(auth => queryDeezerAPIv2(auth, method, params));
				return Promise.reject(response.error);
			});
		}
		function getDeezerAPIv2Auth(useCache = true) {
			const getCookies = () => prefs.deezer_arl ? Promise.resolve(['arl=' + prefs.deezer_arl])
				: Promise.reject('ARL token not configured');
			const getAuth = (useCache = true) => getCookies(useCache).then(function(cookies) {
				const arlRx = /^(?:arl)=(\w*)/i, auth = {
					cookies: cookies,
					cid: Math.floor(Math.random() * 1E+9),
				};
				if (useCache && 'deezerUserData' in window.sessionStorage) try {
					const userData = JSON.parse(window.sessionStorage.deezerUserData);
					if (!cookies || !userData || !userData.checkForm) throw 'Invalid cached user data';
					//if (Date.now() > (userData.SERVER_TIMESTAMP + ??? * 60 - 30) * 1000) throw 'User data expired';
					if (prefs.diag_mode) console.log('Using cached Deezer user for ARL', userData);
					return Promise.resolve(Object.assign(auth, {
						userId: userData.USER.USER_ID,
						csrfToken: userData.checkForm,
						userToken: userData.USER_TOKEN,
						playerToken: userData.PLAYER_TOKEN,
					}));
				} catch(e) { delete window.sessionStorage.deezerUserData }
				return cookies && cookies.some(RegExp.prototype.test.bind(arlRx)) ?
						queryDeezerAPIv2(auth, 'deezer.getUserData', { input: 3 }).then(function(response) {
					if (!response.checkForm) return Promise.reject('No CSRF token returned');
					if (prefs.diag_mode) console.log('Caching Deezer userdata for ARL', response);
					window.sessionStorage.deezerUserData = JSON.stringify(response);
					return Object.assign(auth, {
						userId: response.USER.USER_ID,
						csrfToken: response.checkForm,
						userToken: response.USER_TOKEN,
						playerToken: response.PLAYER_TOKEN,
					});
				}) : Promise.reject('Cookies missing or incomplete');
			});

			return getAuth(useCache).catch(function(reason) {
				if (reason == 'ARL token not configured') return Promise.reject(reason);
				if (prefs.diag_mode) {
					console.log('Deezer auth failed:', reason);
					addMessage('Deezer auth failed: ' + JSON.stringify(reason), 'warning');
				}
				if (typeof reason != 'object' || Object.keys(reason).length <= 0) return Promise.reject(reason);
				if ('deezerUserData' in window.sessionStorage) delete window.sessionStorage.deezerUserData;
				return getAuth(false);
			});
		}
	} // fillFromText_Music

	function setReqDefaultBounty() {
		if (!isRequestNew) return;
		let amount = prefs.request_default_bounty;
		if (!(amount >= 100)) return;
		const amountBox = document.getElementById('amount_box'), unit = formItem('unit');
		if (amountBox == null || amountBox.disabled || unit == null || unit.disabled) return;
		const isMB = prefs.request_default_bounty < 2**10;
		amountBox.value = isMB ? amount : amount / 2**10;
		notifyChange(amountBox) //Calculate();
		unit.value = isMB ? 'mb' : 'gb';
	}

	function setTitle(title) {
		if (!title) return false;
		const elem = formItem('title');
		if (!elementWritable(elem)) return false;
		elem.value = title;
		return true;
	}
	function setTags(tags) {
		if (!tags || tags.length <= 0) return false;
		const elem = formItem('tags');
		if (!elementWritable(elem)) return false;
		elem.value = tags.toStringSorted();
		return true;
	}
	function setYear(year) {
		if (!(year > 1900)) return false;
		const elem = formItem('year');
		if (!elementWritable(elem)) return false;
		elem.value = year;
		return true;
	}
	function setDescription(description) {
		if (!description) return false;
		let elem = formItem('desc') || formItem('album_desc') || formItem('description') || formItem('body');
		if (elementWritable(elem)) {
			elem.value = description.collapseGaps();
			return true;
		} else if ((elem = formItem('body')) != null && !elem.disabled) {
			if (overwrite || elem.value.length <= 0) elem.value = description.collapseGaps();
				else elem.value += '\n\n' + description.collapseGaps();
			return true;
		} else return false;
	}
	function setOCLC(oclc) {
		if (!(oclc > 0)) return false;
		const elem = formItem('oclc');
		if (!elementWritable(elem)) return false;
		elem.value = oclc;
		return true;
	}

	function findOCLC(url, title) {
		if (httpParser.test(url)) globalXHR(url).then(function({document}) {
			let oclc = document.body.querySelector('tr#details-oclcno > td:last-of-type');
			if (oclc != null) setOCLC(oclc.textContent.trim());
			let searchResults = Array.from(document.body.querySelectorAll('table.table-results > tbody > tr.menuElem')).map(function(tr) {
				let item = {
					name: tr.querySelector('div.name'),
					author: tr.querySelector('div.author'),
					type: tr.querySelector('div.type'),
					language: tr.querySelector('div.type.language'),
					publisher: tr.querySelector('div.publisher'),
					coverArt: tr.querySelector('td.coverart img'),
					url: tr.querySelector('div.name > a'),
				};
				const noPrefix = str => str.replace(/^.*:\s+/, '');
				item.name = item.name != null ? item.name.textContent.trim() : undefined;
				item.author = item.author != null ? noPrefix(item.author.textContent.trim()) : undefined;
				item.type = item.type != null ? noPrefix(item.type.textContent.trim()) : undefined;
				item.language = item.language != null ? noPrefix(item.language.textContent.trim()) : undefined;
				item.publisher = item.publisher != null ? noPrefix(item.publisher.textContent.trim()) : undefined;
				item.coverArt = item.coverArt != null ? item.coverArt.src.replace(/\?.*$/, '').replace(/_\d+\.(\w+)$/, '_140.$1') : undefined;
				item.url = item.url != null ? 'https://www.worldcat.org' + item.url.pathname.replace(/\#.*$/, '') : undefined;
				return item;
			});
			if (prefs.diag_mode && searchResults.length > 0) console.log('WorldCat search results:', searchResults);
			if (searchResults.length == 1) findOCLC(searchResults[0].url);
			if (searchResults.length <= 1 || !title) return;
			if ((searchResults = searchResults.filter(function(item) {
				let remoteTitle = item.name;
				if (remoteTitle) remoteTitle = remoteTitle.toLowerCase(); else return false;
				let localTitle = title.toLowerCase();
				// strict caseless equality
				if (localTitle == remoteTitle) return true;
				// strict caseless equality of stripped accents
				if (localTitle.toASCII() == remoteTitle.toASCII()) return true;
				// fuzzy caseless equality
				let similarity = jaroWrinkerSimilarity(localTitle, remoteTitle);
				if (similarity >= 0.90) {
					if (prefs.diag_mode) console.debug('Fuzzy similarity accepted: "' +
						localTitle + '" ≈ "' + remoteTitle + '" (' + similarity.toFixed(3) + ')');
					return true;
				}
				// exact caseless equality with stripped all tailing brackets
				let strippedTitles = [localTitle, remoteTitle].map(title => title.replace(tailingBracketStripper, ''));
				if (strippedTitles[0] == strippedTitles[1]) return true;
				// any mutual exact caseless start
				if (localTitle.startsWith(remoteTitle) || remoteTitle.startsWith(localTitle)) return true;
				// fuzzy caseless equality of any stripped variant
				similarity = jaroWrinkerSimilarity(strippedTitles[0], strippedTitles[1]);
				if (similarity >= 0.95) {
					if (prefs.diag_mode) console.debug('Fuzzy similarity accepted: "' +
						strippedTitles[0] + '" ≈ "' + strippedTitles[1] + '" (' + similarity.toFixed(3) + ')');
					return true;
				}
				// relax level 5: strict mutual titles match anywhere
				if (localTitle.includes(remoteTitle) || remoteTitle.includes(localTitle)) return true;
				return false;
			})).length == 1) findOCLC(searchResults[0].url);
		});
	}

	function preview(n) {
		if (!prefs.auto_preview) return;
		let btn = document.querySelector('input.button_preview_' + n + '[type="button"][value="Preview"]');
		if (btn != null) btn.click();
	}

	function fillFromText_Apps(weak = false) {
		clearTfMessages();
		if (!httpParser.test(uaData.value)) {
			addMessage('only valid URL for this category', 'critical');
			return false;
		} else sourceUrl = RegExp.$1;
		let ref, title, description, tags = new TagManager;
		if (/^https?:\/\/(?:softarchive|sanet)\./i.test(sourceUrl)) return globalXHR(sourceUrl).then(function(response) {
			i = response.document.body.querySelector('h1.item_title > span');
			title = i == null ? undefined : i.textContent
				.replace(/\s+\((?:x|ia|em)(?:64)\)/ig, ' (64-bit)')
				.replace(/\s+\(x(?:86|32)\)/ig, ' (32-bit)')
				.replace(/\s+(?:Build)\s+(\d+)\b/g, ' build $1')
				.replace(/\s+(?:Multilingual|Multi(?:-|\s)*lang(?:uage)?)\b/g, ' multilingual');
			if ((ref = response.document.body.querySelector('article > section.descr > div.center > figure img[data-src]')) != null)
				setCover(ref.dataset.src);
			else if ((ref = response.document.body.querySelector('article > section.descr > div.center a.mfp-image')) != null)
				setCover(ref.href);
			ref = response.document.body.querySelector('section.descr > div.release-info');
			let releaseInfo = ref != null && ref.textContent.trim();
			if ((ref = response.document.body.querySelector('a.cat:last-of-type > span')) != null) {
				if (ref.textContent.toLowerCase() == 'windows') {
					tags.add('apps.windows');
					if (/\b(?:(?:x|ia|em)64)\b/i.test(releaseInfo) || /\(64[-\s]*bit\)/i.test(title)) tags.add('win64');
					if (/\b(?:x86|x32)\b/i.test(releaseInfo) || /\(32[-\s]*bit\)/i.test(title)) tags.add('win32');
				}
				if (ref.textContent.toLowerCase() == 'macos') tags.add('apps.mac');
				if (ref.textContent.toLowerCase() == 'linux' || ref.textContent.toLowerCase() == 'unix') tags.add('apps.linux');
				if (ref.textContent.toLowerCase() == 'android') tags.add('apps.android');
				if (ref.textContent.toLowerCase() == 'ios') tags.add('apps.ios');
			}
			setTags(tags);
			if (title && !/\((\d+)-?bit\)/i.test(title)) {
				if (tags.includes('win64') && !tags.includes('win32')) title += ' (64-bit)';
				if (tags.includes('win32') && !tags.includes('win64')) title += ' (32-bit)';
			}
			setTitle(title);
			description = html2php(response.document.body.querySelector('section.descr'), response.finalUrl).trim();
			if (/\s*^[ \t]*(?:\[i\]\[\/i\])?Homepage\s*$.*/im.test(description)) description = RegExp.leftContext;
			description = description.split(/[ \t]*\r?\n/).slice(6).map(line => line.trim()).join('\n')
				.replace(/^File size: .*$\s*/igm, '')
				.replace(/^[ \t]*(?:\[i\]\[\/i\])?Screenshots:?\s*/igm, '')
				.replace(/^[ \t]*(?:\[i\]\[\/i\])?(\[b\]Release\s+Notes:?\[\/b\])(?:[ \t]*\r?\n)+/igm, '$1\n')
				.replace(/\[hr\]/ig, '\n');
			let internalTags = Array.from(response.document.body.querySelectorAll('ul.item_tags_list > li > a[rel="tag"]'),
				a => a.textContent.toLowerCase().trim());
			if (/\b(?:Languages?)\s*:\s*(.*?)\s*(?:$|\|)/i.exec(releaseInfo) != null)
				description += '\n\n[b]Languages:[/b]\n' + RegExp.$1;
			if ((ref = response.document.body.querySelector('div.txtleft a[rel="external nofollow noopener"]')) != null)
				description += '\n\n[b]Product page:[/b]\n' +
					removeRedirect(ref.pathname.toLowerCase().startsWith('/confirm/url/') && httpParser.test(ref.textContent) ?
						ref.textContent.trim() : ref.href).bbUrl();
			setDescription(description);
		}); else if (!weak) {
			addMessage('this domain not supported', 'critical');
			uaData.value = '';
		}
		return Promise.reject('this domain not supported');
	} // fillFromText_Apps

	function fillFromText_Ebooks(weak = false) {
		function joinAuthors(nodeList) {
			if (nodeList) try {
				if (!Array.isArray(nodeList)) nodeList = Array.from(nodeList, node => node.textContent.trim());
				if (nodeList.length > 0) return nodeList.map(node => node.replace(/\s+/g, ' ')).distinctValues().join(' & ');
			} catch(e) { console.warn(e) }
			return null;
		}

		clearTfMessages();
		if ((sourceUrl = httpParser.exec(uaData.value)) != null) sourceUrl = new URL(sourceUrl[1]); else {
			addMessage('only URL accepted for this category', 'critical');
			return Promise.reject('only URL accepted for this category');
		}
		const params = new URLSearchParams(sourceUrl.search);
		let ref, title, year, image, tags = new TagManager, description;
		if (sourceUrl.hostname.endsWith('goodreads.com')) return globalXHR(sourceUrl).then(function(response) {
			function addDetail(label, value, extraSpace = false, divisor = ' ') {
				if (!label || !value) return;
				if (description) description += '\n'.repeat(extraSpace ? 2 : 1); else description = '';
				description += `[b]${label}:[/b]${divisor}${value}`;
			}
			const imageMax = image => image && image.replace(/\._\w+_\./g, '.').replace(/\?.*$/, '');
			let reactMeta = response.document.querySelector('script#__NEXT_DATA__[type="application/json"]'), titleAuthors;
			if (reactMeta != null) try { // try with React
				reactMeta = JSON.parse(reactMeta.text);
				const getNode = node => node && '__ref' in node ? reactMeta.props.pageProps.apolloState[node.__ref] : null;
				let book = /^(\d+)\b/.exec(reactMeta.query.book_id);
				if (book != null) book = parseInt(book[1]); else throw 'Unexpected metadata format';
				book = reactMeta.props.pageProps.apolloState.ROOT_QUERY[`getBookByLegacyId({"legacyId":"${book}"})`];
				if (book) book = getNode(book); else throw 'Unexpected metadata format';
				const work = 'work' in book ? getNode(book.work) : null;
				const series = 'bookSeries' in book && book.bookSeries.length > 0 ?
					book.bookSeries.map(edge => getNode(edge.series)) : null;
				const shelving = 'viewerShelving' in book ? getNode(book.viewerShelving) : null;
				// Title
				if (book.title) {
					title = book.titleComplete || book.title;
					if (series && !book.titleComplete) title = series[0].title + ': ' + title;
					if ('primaryContributorEdge' in book) {
						const contribName = contribEdge => getNode(contribEdge.node).name;
						titleAuthors = [contribName(book.primaryContributorEdge)];
						if ('secondaryContributorEdges' in book) Array.prototype.push.apply(titleAuthors,
							book.secondaryContributorEdges.filter(edge => edge.role == 'Author').map(contribName));
					}
					if (titleAuthors) title = joinAuthors(titleAuthors) + ' – ' + title;
					if ((year = new Date(book.details.publicationTime).getUTCFullYear()) > 0) title += ' (' + year + ')';
					setTitle(title);
				}
				// Tags
				if ((tags = new TagManager(...book.bookGenres.map(genre => genre.genre.name))).length > 0) setTags(tags);
				// Image
				if (!(image = book.imageUrl) && (image = [
					'div.BookCover__image img', 'div.editionCover > img', 'img#coverImage',
				].reduce((elem, selector) => elem || response.document.body.querySelector(selector), null)) != null)
					image = image.src;
				if (!image && (image = response.document.head.querySelector('meta[property="og:image"][content]')) != null)
					image = ref.content;
				if (image && !['/nophoto/', '/books/1570622405l/50809027', '/images/no-cover.png'].some(pattern =>
						image.includes(pattern))) setCover(imageMax(image));
				// Description
				if (book.description) {
					description = html2php(domParser.parseFromString(book.description, 'text/html'), response.finalUrl)
						.collapseGaps();
					if (description) if (quoteDetector.test(description)) description += '\n';
						else description = description.bbQuote();
				}
				if (work != null && 'details' in work) for (let key in work.details) {
					let value = work.details[key];
					if (value) switch (key) {
						case 'publicationTime':
							value = new Date(value).getUTCFullYear();
							break;
						case 'awardsWon':
							value = value.map(function(award) {
								title = award.name.bbUrl(award.webUrl);
								if (award.category) title += ' for ' + award.category;
								if ((year = new Date(award.awardedAt).getUTCFullYear()) > 1900) title += ' (' + year + ')';
								return title;
							}).join(', ');
							break;
						case 'originalTitle':
							if (['titleComplete', 'title'].map(key => book[key]).includes(value)) continue;
							break;
						case 'characters':
						case 'places':
							value = value.map(entry => entry.name.bbUrl(entry.webUrl)).join(', ');
							break;
					} else continue;
					addDetail({
						'publicationTime': 'First publish year', 'originalTitle': 'Original title',
						'awardsWon': 'Literary awards', 'characters' : 'Characters', 'places' : 'Setting',
					}[key], value);
				}
				if ('details' in book) {
					addDetail('Published', [
						!isNaN(year = new Date(book.details.publicationTime)) > 0 && year.toUTCDateString(),
						book.details.publisher,
					].filter(Boolean).join(', '));
					addDetail('Format', [
						book.details.numPages > 0 && book.details.numPages + ' pages',
						book.details.format,
					].filter(Boolean).join(', '));
					for (let key in book.details) {
						let value = book.details[key], worldCat;
						if (value) switch (key) {
							case 'isbn': case 'isbn13': case 'isbn10':
								worldCat = 'https://www.worldcat.org/isbn/' + value.replace(/\D+/g, '');
								value = value.bbUrl(worldCat);
								findOCLC(worldCat);
								break;
							case 'issn':
								worldCat = 'https://www.worldcat.org/issn/' + value;
								value = value.bbUrl(worldCat);
								findOCLC(worldCat);
								break;
							case 'asin':
								value = value.bbUrl('https://www.amazon.com/gp/product/' + value);
								break;
							case 'oclc':
								worldCat = 'https://www.worldcat.org/oclc/' + value;
								value = value.bbUrl(worldCat);
								findOCLC(worldCat);
								break;
							case 'publicationTime':
								if (book.details.publisher) continue;
								if (isNaN(value = new Date(value))) continue; else value = value.toUTCDateString();
								break;
							case 'language':
								value = value.name;
								break;
							case 'publisher':
								if ((isRequestNew || isRequestEdit)
										&& elementWritable(ref = formItem('recordlabel') || formItem('record_label')))
									ref.value = value;
								if (book.details.publicationTime) continue; else break;
							case '__typename': case 'format': case 'numPages': case 'publisher':
								continue;
						} else continue;
						addDetail({
							'asin': 'ASIN', 'isbn': 'ISBN', 'isbn13': 'ISBN13', 'isbn10': 'ISBN10', 'issn': 'ISSN',
							'language': 'Language', 'publicationTime': 'Published', 'publisher': 'Publisher',
						}[key] || key, value);
					}
				}
				if (series != null) addDetail('Series', series.map(entry => entry.title.bbUrl(entry.webUrl)).join(', '));
				if ('secondaryContributorEdges' in book) for (let edge of book.secondaryContributorEdges) {
					if (edge.role == 'Author') continue;
					const contributor = getNode(edge.node);
					addDetail(edge.role, contributor.name.bbUrl(contributor.webUrl));
				}
				if (work != null && 'stats' in work)
					addDetail('Average rating', `${Math.round(work.stats.averageRating * 20)}% (${work.stats.ratingsCount})`);
				if ('links({})' in book) {
					const xtrnLinks = [ ], addLink = node => { if (node) xtrnLinks.push(node.name.bbUrl(node.url)) };
					if ('primaryAffiliateLink' in book['links({})']) addLink(book['links({})'].primaryAffiliateLink);
					for (key of ['secondaryAffiliateLinks', 'libraryLinks']) if (key in book['links({})'])
						book['links({})'][key].forEach(addLink);
					if (xtrnLinks.length > 0) addDetail('External links', xtrnLinks.join(', '));
				}
				addDetail('More info and reviews', (book.webUrl || response.finalUrl).bbUrl(), true, '\n');
				if ('primaryContributorEdge' in book) {
					const primaryAuthor = getNode(book.primaryContributorEdge.node);
					if (primaryAuthor != null) {
						if (description) description += '\n\n'; else description = '';
						description += ('About ' + (primaryAuthor.name || 'the author')).bbUrl(primaryAuthor.webUrl).bbBold();
						if (primaryAuthor.description) {
							const aboutAuyhor = html2php(domParser.parseFromString(primaryAuthor.description, 'text/html'), response.finalUrl)
								.collapseGaps();
							description += '\n' + (/*quoteDetector.test(aboutAuyhor) ? aboutAuyhor.bbQuote() : */aboutAuyhor);
						}
					}
				}
				if (description) setDescription(description);
				if (isRequestNew) setReqDefaultBounty();
			} catch(e) { console.warn(e) } else { // old HTML scraper
				let authors = response.document.body
							.querySelectorAll('div#bookAuthors > span[itemprop="author"] a.authorName > span[itemprop="name"]'),
						firstPubYear;
				response.document.body.querySelectorAll('div#details > div.row').forEach(function(div) {
					if (!year && /\b(?:Published|Expected)\b/i.test(div.textContent)) year = extractYear(div.textContent);
					if (!firstPubYear && /\(first\s+published\s+(.+?)\)/i.test(div.textContent)) firstPubYear = extractYear(RegExp.$1);
				});

				// Title
				if ((ref = response.document.body.querySelector('h1#bookTitle')) != null) {
					title = ref.textContent.trim().replace(/\s+/g, ' ');
					if ((ref = response.document.body.querySelector('h2#bookSeries')) != null
							&& (i = ref.textContent.trim().replace(/\s+/g, ' ').replace(/^\((.*)\)$/, '$1').trim()))
						title = i + ': ' + title;
					titleAuthors = Array.from(authors);
					const taFiltered = titleAuthors.filter(span =>
						span.parentElement.parentElement.querySelector('span.role') == null);
					if (taFiltered.length > 0) titleAuthors = taFiltered;
					if (titleAuthors.length > 0) title = joinAuthors(titleAuthors) + ' – ' + title;
					if (year > 0/* || firstPubYear > 0*/) title += ' (' + (/*firstPubYear || */year) + ')';
					setTitle(title);
				}
				// Tags
				tags = new TagManager(...Array.from(response.document.body.querySelectorAll('div.elementList > div.left'),
					tag => tag.textContent.trim()));
				if (tags.length > 0) setTags(tags);
				// Image
				if ((image = [
					'div.editionCover > img', 'img#coverImage', 'div.BookCover__image img',
				].reduce((elem, selector) => elem || response.document.body.querySelector(selector), null)) != null)
					image = image.src;
				if (!image && (image = response.document.head.querySelector('meta[property="og:image"][content]')) != null)
					image = ref.content;
				if (image && !['/nophoto/', '/books/1570622405l/50809027', '/images/no-cover.png'].some(pattern =>
						image.includes(pattern))) setCover(imageMax(image));
				// Description body
				const strip = (str, joiner = undefined) => str.replace(/[\r\n]+/, ' ')
					.replace(/\s*\[url(?:=\S+?)?\]\s*\.{3,}(?:less|more)\s*\[\/url\]\s*/g, joiner || ' ')
					.replace(/\s*\.{3,}(?:less|more)\s*/g, joiner || ' ').replace(/\s{2,}/g, ' ').trim();
				if ((ref = response.document.body.querySelector('div#description > span:last-of-type')) != null) {
					description = html2php(ref, response.finalUrl).collapseGaps();
					if (description) if (quoteDetector.test(description)) description += '\n';
						else description = description.bbQuote();
				} else description = '';
				response.document.body.querySelectorAll('div#details > div.row')
					.forEach(div => { description += '\n' + strip(div.textContent) });
				if (description) description += '\n';
				authors.forEach(function(span) {
					let role = span.parentElement.parentElement.querySelector('span.role');
					if (role != null) role = role.textContent.trim().replace(/\s+/g, ' '); else return;
					if (/^\((.+)\)$/.test(role)) role = RegExp.$1;
					addDetail(role, span.textContent.trim().replace(/\s+/g, ' ')
						.bbUrl('https://www.goodreads.com' + span.parentNode.pathname));
				});
				if (description) description += '\n';
				response.document.body.querySelectorAll('div#bookDataBox > div.clearFloats').forEach(function(detail) {
					let key = detail.querySelector('div.infoBoxRowTitle'), value = detail.querySelector('div.infoBoxRowItem');
					if (key != null && value != null) key = key.textContent.trim(); else {
						console.warn('Goodreads assertion failed:', detail);
						return;
					}
					let val = strip(value.textContent);
					if (key == 'ISBN' && (/\b(\d{13})\b/.test(val) || /\b(\d{10})\b/.test(val) || /^(\d+(?:[\d\-\s]*\d)?)$/.test(val))) {
						let wc = 'https://www.worldcat.org/isbn/' + RegExp.$1.replace(/[\-\s]+/g, '');
						val = val.bbUrl(wc);
						findOCLC(wc);
					} else if (key == 'ISSN' && (/\b(\d+-\d+)\b/.test(val))) {
						let wc = 'https://www.worldcat.org/issn/' + RegExp.$1;
						val = val.bbUrl(wc);
						findOCLC(wc);
					} else if (key == 'ASIN' && /^(\w{8,12})$/.test(val))
						val = val.bbUrl('https://www.amazon.com/gp/product/' + RegExp.$1);
					else if ((key == 'OCLC' || key.includes('WorldCat')) && /^(\d+)$/.test(val)) {
						val = val.bbUrl('https://www.worldcat.org/oclc/' + RegExp.$1);
						setOCLC(RegExp.$1);
					} else val = strip(html2php(value, response.finalUrl), ', ');
					addDetail(key, val);
				});
				if ((ref = response.document.querySelector('meta[itemprop="ratingCount"]')) != null && parseInt(ref.content) > 0
						&& (ref = response.document.body.querySelector('span[itemprop="ratingValue"]')) != null)
					addDetail('Rating', Math.round(parseFloat(ref.firstChild.textContent) * 20) + '%');
				sourceUrl = response.document.querySelector('meta[property="og:url"][content]');
				if (sourceUrl != null) sourceUrl = sourceUrl.content; else {
					sourceUrl = new URL(response.finalUrl);
					sourceUrl = sourceUrl.origin + sourceUrl.pathname;
				}
				if (sourceUrl) addDetail('More info and reviews', sourceUrl.bbUrl(), true, '\n');
				response.document.body.querySelectorAll('div.clearFloats.bigBox').forEach(function(bigBox) {
					if (bigBox.id == 'aboutAuthor' && (ref = bigBox.querySelector('h2 > a')) != null) {
						description += '\n\n' + ref.textContent.trim().bbUrl('https://www.goodreads.com' + ref.pathname).bbBold();
						//if ((ref = bigBox.querySelector('div.bigBoxBody a > div[style*="background-image"]')) != null)
						if ((ref = bigBox.querySelector('div.bookAuthorProfile__about > span[id]:last-of-type')) != null)
							description += '\n' + html2php(ref, response.finalUrl).trim().replace(/^\[i\]Librarian\s+Note:.*?\[\/i\]\s+/i, '');
					// } else if ((ref = bigBox.querySelector('h2 > a[href^="/trivia/"]')) != null) {
					// 	description += '\n\n' + ref.textContent.trim().bbUrl('https://www.goodreads.com' + ref.pathname).bbBold();
					// 	if ((ref = bigBox.querySelector('div.bigBoxContent > div.mediumText')) != null
					// 			&& !/^\s*(?:No trivia)\b/.test(ref.textContent)) description += '\n' + ref.firstChild.textContent.trim();
					// } else if ((ref = bigBox.querySelector('h2 > a[href^="/work/quotes/"]')) != null) {
					// 	description += '\n\n' + ref.textContent.trim().bbUrl(ref.href).bbBold();
					// 	bigBox.querySelectorAll('div.bigBoxContent > div.stacked > span.readable').forEach(function(quote) {
					// 		description += '\n' + ref.firstChild.textContent.trim();
					// 	});
					}
				});
				setDescription(description);
			}
		}); else if (sourceUrl.hostname.startsWith('books.google.')) {
			let id = params.get('id');
			if (!sourceUrl.pathname == '/books' || !id) return Promise.reject('Not valid Google Books release link');
			sourceUrl.hostname = 'books.google.com';
			sourceUrl.search = new URLSearchParams({ id: id, hl: 'en' });
			return globalXHR(sourceUrl).then(function(response) {
				if ((ref = response.document.querySelector('td#bookinfo > div.bookinfo_sectionwrap > div:nth-of-type(2)')) != null)
					year = extractYear(ref.textContent);
				if ((ref = response.document.querySelector('td#bookinfo > h1.booktitle > span.fn')) != null) {
					title = ref.textContent.trim();
					if ((ref = ref.parentNode.querySelector('span.subtitle')) != null && ref.textContent.trim().length > 0)
						title += ': ' + ref.textContent.trim();
					ref = response.document.querySelectorAll('td#bookinfo > div.bookinfo_sectionwrap > div:first-of-type > a.secondary');
					if (ref.length > 0) title = joinAuthors(ref) + ' – ' + title;
					if (year > 0) title += ' (' + year + ')';
					setTitle(title);
				}
				//setYear(year);
				if ((ref = response.document.querySelector('meta[property="og:image"][content]')) != null)
					setCover(ref.content + '=s0');
				description = (ref = response.document.querySelector('div#synopsistext')) != null ?
					html2php(ref, response.finalUrl).trim() : '';
				if (description && !quoteDetector.test(description)) description = description.bbQuote();
				response.document.querySelectorAll('table#metadata_content_table > tbody > tr.metadata_row').forEach(function(tr) {
					let key = tr.querySelector('td.metadata_label'), value = tr.querySelector('td.metadata_value');
					if (key != null && value != null) { key = key.textContent.trim(); value = value.textContent.trim() } else {
						console.warn('Google Books assertion failed:', tr);
						return;
					}
					if (key.toLowerCase() == 'subjects') {
						tr.querySelectorAll('td.metadata_value span[itemprop="title"]')
							.forEach(span => { tags.add(span.textContent.trim()) });
						return;
					}
					if (key.toLowerCase() == 'isbn' && (/\b(\d{13})\b/.test(value) || /\b(\d{10})\b/.test(value)
							|| /^(\d+(?:[\d\-\s]*\d)?)$/.test(value))) {
						let wc = 'https://www.worldcat.org/isbn/' + RegExp.$1.replace(/[\-\s]+/g, '');
						value = value.bbUrl(wc);
						findOCLC(wc);
					}
					if (value) description += `\n[b]${key}:[/b] ${value}`;
				});
				setTags(tags);
				if ((ref = response.document.querySelector('td#bookinfo > div.bookinfo_sectionwrap span.rating > span.value-title[title]')) != null)
					description += `\n[b]Rating:[/b] ${Math.round(parseFloat(ref.title) * 20)}%`;
				if ((ref = response.document.querySelector('meta[property="og:url"][content]')) != null)
					description += '\n\n[b]More info and reviews:[/b]\n' + ref.content.bbUrl();
				if ((ref = response.document.querySelector('div#about_author')) != null)
					description += '\n\n[b]About the author:[/b]\n' + html2php(ref, response.finalUrl).trim();
				setDescription(description);
			});
			if (isRequestNew) setReqDefaultBounty();
		} else if (sourceUrl.hostname.endsWith('openlibrary.org') && /\/(books|works)\/(OL\w+)\b/i.test(sourceUrl.pathname))
				return RegExp.$1.toLowerCase() != 'works' ? globalXHR(`https://openlibrary.org/${RegExp.$1}/${RegExp.$2}.json`, { responseType: 'json' })
			.then(({response}) => Promise.all(Array.isArray(response.works) ? response.works.map(work =>
				globalXHR('https://openlibrary.org' + work.key + '.json', { responseType: 'json' })
					.then(({response}) => response)) : [ ]).then(function(works) {
			let edition = response;
			if (!Array.isArray(edition.subjects)) edition.subjects = [ ];
			for (let work of works) {
				if (Array.isArray(work.subjects) && work.subjects.length > 0)
					edition.subjects.pushUniqueCaseless(work.subjects);
				for (let key in work) if (!edition[key] || Array.isArray(edition[key]) && edition[key].length <= 0
						&& Array.isArray(work[key]) && work[key].length > 0 || typeof edition[key] == 'object'
						&& Object.keys(edition[key]).length <= 0 && typeof work[key] == 'object' && Object.keys(work[key]).length > 0)
					edition[key] = work[key];
			}
			['publisher', 'subject_place', 'subject_time', 'language', 'lc_classification'].forEach(function(key) {
				if (Array.isArray(edition[key])) {
					if (edition[key].length > 0) {
						if (!Array.isArray(edition[key + 's'])) edition[key + 's'] = [ ];
						edition[key + 's'].pushUniqueCaseless(...edition[key]);
					}
					delete edition[key];
				}
			});
			return edition;
		})).then(function(book) {
			if (prefs.diag_mode) console.debug('OpenLibrary metadata received:', book);
			book.authors = Array.isArray(book.authors) ? book.authors.map(author =>
				globalXHR('https://openlibrary.org' + (author.key || author.author.key) + '.json', { responseType: 'json' })
					.then(({response}) => response)) : [ ];
			book.languages = Array.isArray(book.languages) ? book.languages.map(language =>
				globalXHR('https://openlibrary.org' + language.key + '.json', { responseType: 'json' })
					.then(({response}) => response)) : [ ];
			year = extractYear(book.publish_date);
			Promise.all(book.authors).then(function(authors) {
				title = book.title;
				if (book.subtitle) title += ': ' + book.subtitle;
				if (authors.length > 0) title = authors.map(author => author.name || author.personal_name)
					.distinctValues().join(' & ') + ' – ' + title;
				if (year > 0) title += ' (' + year + ')';
				setTitle(title);
			});
			//setYear(year);
			if (book.subjects && book.subjects.length > 0) {
				tags.add(...book.subjects);
				setTags(tags);
			}
			if (book.covers && book.covers.length > 0)
				setCover('http://covers.openlibrary.org/b/id/' + book.covers[0] + /*'-L' + */'.jpg');
			Promise.all(book.languages).then(function(languages) {
				if (book.description) {
					if (typeof book.description == 'object') switch (book.description.type.toLowerCase()) {
						case '/type/text':
							description = book.description.value;
							break;
						case '/type/html':
							description = html2php(domParser.parseFromString(book.description.value, 'text/html'),
								'https://openlibrary.org' + book.key);
							break;
					} else if (typeof book.description == 'string') description = book.description;
				}
				description = description ? description.trim() : '';
				if (description && !quoteDetector.test(description)) description = description.bbQuote();
				if (book.publishers && book.publishers.length > 0)
					description += '\n[b]' + (book.publishers.length > 1 ? 'Publishers' : 'Publisher') + ':[/b] ' +
						book.publishers.join(', ');
				if (book.publish_date)
					description += '\n[b]Publish date:[/b] ' + book.publish_date;
				if (book.publish_country)
					description += '\n[b]Publish country:[/b] ' + book.publish_country;
				if (book.isbn_13 && book.isbn_13.length > 0 || book.isbn_10 && book.isbn_10.length > 0) {
					let isbn = (book.isbn_13 || [ ]).concat((book.isbn_10 || [ ])),
							wc = 'https://www.worldcat.org/isbn/' + (book.isbn_13 || [ ]).concat((book.isbn_10 || [ ]))[0];
					description += '\n[b]ISBN:[/b] ' + isbn.join(', ').bbUrl(wc);
					if (!book.oclc_numbers || book.oclc_numbers.length <= 0) findOCLC(wc);
				}
				if (languages.length > 0)
					description += '\n[b]Languages:[/b] ' + languages.map(language => language.name).join(', ');
				if (book.subject_places && book.subject_places.length > 0)
					description += '\n[b]Subject places:[/b] ' + book.subject_places.join(', ');
				if (book.subject_times && book.subject_times.length > 0)
					description += '\n[b]Subject times:[/b] ' + book.subject_times.join(', ');
				if (book.number_of_pages)
					description += '\n[b]Number of pages:[/b] ' + book.number_of_pages;
				if (book.pagination)
					description += '\n[b]Pagination:[/b] ' + book.pagination;
				if (book.lccn && book.lccn.length > 0)
					description += '\n[b]LCCN:[/b] ' + book.lccn.join(', ');
				if (book.lc_classifications && book.lc_classifications.length > 0)
					description += '\n[b]LC Control Number:[/b] ' + book.lc_classifications.join(', ');
				if (book.identifiers) for (let id in book.identifiers) switch (id.toLowerCase()) {
					case 'goodreads':
						description += '\n[b]Goodreads:[/b] ' +
							book.identifiers[id].bbUrl('https://www.goodreads.com/book/show/' + book.identifiers[id]);
						break;
					case 'librarything':
						description += '\n[b]Library Thing:[/b] ' +
							book.identifiers[id].bbUrl('https://www.librarything.com/work/' + book.identifiers[id]);
						break;
				}
				if (book.source_records) for (let sr of book.source_records) {
					if ((sr = /^(\w+):(\w+)$/.exec(sr)) == null) continue;
					switch (sr[1].toLowerCase()) {
						case 'amazon':
							description += '\n[b]Amazon:[/b] ' + sr[2].bbUrl('https://www.amazon.com/gp/product/' + sr[2]);
							break;
						case 'ia':
							description += '\n[b]Internet Archive:[/b] ' + sr[2].bbUrl('https://archive.org/details/' + sr[2]);
							break;
					}
				}
				if (book.oclc_numbers) book.oclc_numbers.forEach(function(oclc, index) {
					description += '\n[b]WorldCat:[/b] ' + oclc.bbUrl('https://www.worldcat.org/oclc/' + oclc + '?tab=details');
					if (index == 0) setOCLC(oclc);
				});
				if (book.physical_format)
					description += '\n[b]Physical format:[/b] ' + book.physical_format;
				if (book.weight)
					description += '\n[b]Weight:[/b] ' + book.weight;
				description += '\n\n[b]More info and reviews:[/b]\n' + ('https://openlibrary.org' + book.key).bbUrl();
				setDescription(description);
				if (isRequestNew) setReqDefaultBounty();
			});
		}) : globalXHR(sourceUrl, { headers: { 'Accept-Language': 'en-US, en' } }).then(function(response) {
			if ((ref = response.document.querySelector('strong[itemprop="datePublished"]')) != null)
				year = extractYear(ref.textContent);
			if ((ref = response.document.querySelector('div.editionAbout h1.work-title')) != null) {
				title = ref.textContent.trim();
				if ((ref = response.document.querySelector('div.editionAbout h2.work-subtitle')) != null
						&& ref.textContent.trim()) title += ': ' + ref.textContent.trim();
				ref = response.document.querySelectorAll('div.editionAbout h2.edition-byline > a[itemprop="author"]');
				if (ref.length > 0) title = joinAuthors(ref) + ' – ' + title;
				if (year > 0) title += ' (' + year + ')';
				setTitle(title);
			}
			//setYear(year);
			response.document.querySelectorAll('div.section.link-box > div > span > a').forEach(function(a) {
				if (!a.pathname.startsWith('/subjects/') || a.pathname.includes(':')) return;
				tags.add(a.textContent.trim());
			});
			if (tags.length <= 0) response.document.querySelectorAll('div.subjects span > a').forEach(function(a) {
				if (!a.pathname.startsWith('/subjects/') || a.pathname.includes(':')) return;
				tags.add(a.textContent.trim());
			});
			setTags(tags);
			if ((ref = response.document.querySelector('meta[property="og:image"][content]')) != null) setCover(ref.content);
			description = '';
			response.document.querySelectorAll('div.work-description > p')
				.forEach(p => { description += '\n\n' + html2php(p, response.finalUrl).trim() });
			if (!description) response.document.querySelectorAll('div.book-description-content > p')
				.forEach(p => { description += '\n\n' + html2php(p, response.finalUrl).trim() });
			if (!description) response.document.querySelectorAll('div.editionAbout > p')
				.forEach(p => { description += '\n\n' + html2php(p, response.finalUrl).trim() });
			if (description.includes('This edition doesn\'t have a description yet.')) description = '';
			if (description) description = description.collapseGaps();
			if (description && !quoteDetector.test(description)) description = description.bbQuote();
			response.document.querySelectorAll('div.editionAbout > div.section').forEach(function(div) {
				if (div.classList.length > 1) return;
				description += '\n\n' + html2php(div, response.finalUrl);
			});
			response.document.querySelectorAll('div.tab-section > div.section > h6').forEach(function(h6) {
				i = h6.parentNode.querySelectorAll('span > a');
				if (i.length > 0) description += '\n\n[b]' + h6.textContent.trim() + ':[/b] ' + Array.from(i)
					.map(a => a.textContent.trim().bbUrl('https://openlibrary.org' + a.pathname)).join(', ');
			});
			if ((ref = response.document.querySelector('div.editionAbout h4.publisher')) != null)
				description = html2php(ref, response.finalUrl).trim() + description;
			if ((ref = response.document.querySelector('span[itemprop="ratingValue"]')) != null)
				description += `\n\n[b]Rating:[/b] ${Math.round(parseFloat(ref.textContent) * 20)}%`;
			description += '\n';
			let worldCat;
			response.document.querySelectorAll('div.section > dl.meta > dt').forEach(function(dt) {
				if (dt.nextElementSibling == null || dt.nextElementSibling.tagName != 'DD') return;
				let desc = html2php(dt.nextElementSibling, response.finalUrl).trim();
				if (desc) description += '\n[b]' + dt.textContent.trim() + '[/b]: ' + desc;
				if ((ref = dt.nextElementSibling.querySelector('a')) != null
						&& ref.href.startsWith('https://www.worldcat.org')) worldCat = ref.href;
			});
			if ((ref = response.document.querySelector('meta[property="og:url"][content]')) != null)
				description += '\n\n[b]More info and reviews:[/b]\n' + ref.content.bbUrl();
			setDescription(description);
			if (!worldCat) response.document.querySelectorAll('div.section > dl.meta > dd[itemprop="isbn"]').forEach(function(dd) {
				if (/\b(\d{13})\b/.test(dd.textContent) || /\b(\d{10})\b/.test(dd.textContent)
						|| /^(\d+(?:[\d\-\s]*\d)?)$/.test(dd.textContent.trim()))
					worldCat = 'https://www.worldcat.org/isbn/' + RegExp.$1.replace(/[\-\s]+/g, '');
			});
			if (worldCat) findOCLC(worldCat);
		}); else if (sourceUrl.hostname == 'play.google.com') {
			let id = params.get('id');
			if (!sourceUrl.pathname.startsWith('/store/books/details') || !id)
				return Promise.reject('Not valid Google Play Books release link');
			sourceUrl.search = new URLSearchParams({ id: id, hl: 'en' });
			return globalXHR(sourceUrl).then(function(response) {
				let metaData;
				response.document.querySelectorAll('script[type="application/ld+json"]').forEach(function(script) {
					if (!metaData) try {
						metaData = JSON.parse(script.text);
						if (metaData['@type'] != 'Book') metaData = undefined;
					} catch(e) { }
				});
				if (!metaData) throw 'Invalid document format';
				if (prefs.diag_mode) console.debug('Google Play Books metadata loaded:', metaData);
				let initDataCallback;
				loadGoogleMetadata(response).forEach(function(pattern) {
					if (initDataCallback || !Array.isArray(pattern) || pattern.length != 1 || !Array.isArray(pattern[0])
							|| pattern[0].length != 22) return;
					initDataCallback = pattern[0];
				});
				if (!initDataCallback) throw 'Invalid document format';
				if (prefs.diag_mode) console.debug('Google Play Books metadata loaded:', initDataCallback);
				setTitle(`${initDataCallback[8][1][4]} – ${initDataCallback[0][0]} (${extractYear(initDataCallback[8][3][1])})`);
				//setYear(year);
				if (httpParser.test(initDataCallback[8][4][3][2])) setCover(initDataCallback[8][4][3][2] + '=s0');
					else if ((ref = response.document.querySelector('meta[property="og:image"][content]')) != null)
						setCover(ref.content + '=s0');
				if (metaData.workExample && metaData.workExample.isbn)
					findOCLC('https://www.worldcat.org/isbn/' + metaData.workExample.isbn);
				description = initDataCallback[8][0][1] ?
					html2php(domParser.parseFromString(initDataCallback[8][0][1], 'text/html').body, response.finalUrl).trim() : '';
				if (description) description = description.trim();
				if (description && !quoteDetector.test(description)) description = description.bbQuote();
				description += '\n' + initDataCallback[2].map(function(elem) {
					let value;
					if (elem[0] == 'ISBN' && (/\b(\d{13})\b/.test(elem[1][0][0][1]) || /\b(\d{10})\b/.test(elem[1][0][0][1])
							|| /^(\d+(?:[\d\-\s]*\d)?)$/.test(elem[1][0][0][1])))
						value = elem[1][0][0][1].bbUrl('https://www.worldcat.org/isbn/' + RegExp.$1.replace(/[\-\s]+/g, ''));
					else value = elem[1].map(el => html2php(domParser.parseFromString(el[0][1], 'text/html').body,
						response.finalUrl).trim()).join(', ');
					if (elem[0] == 'Genres') elem[1]
						.forEach(el => { tags.add(...domParser.parseFromString(el[0][1], 'text/html').body.textContent.trim().split(/\s*\/\s*/)) });
					return `\n[b]${elem[0]}:[/b] ${value}`;
				}).join('');
				setTags(tags);
				if (metaData.aggregateRating && metaData.aggregateRating.ratingValue)
					description += `\n[b]Rating:[/b] ${Math.round(parseFloat(metaData.aggregateRating.ratingValue) * 20)}%`;
				if (initDataCallback[8][1][0] && initDataCallback[8][1][0][1]) description += '\n\n[b]About the author:[/b]\n' +
					html2php(domParser.parseFromString(initDataCallback[8][1][0][1], 'text/html').body, response.finalUrl).trim();
				setDescription(description);
				if (isRequestNew) setReqDefaultBounty();
			});
		} else if (sourceUrl.hostname.endsWith('martinus.cz') || sourceUrl.hostname.endsWith('martinus.sk')) return globalXHR(sourceUrl).then(function(response) {
			function get_detail(x, y) {
				let ref = response.document.querySelector('section#details > div > div > div:first-of-type > div:nth-child(' +
					x + ') > dl:nth-child(' + y + ') > dd');
				return ref != null ? ref.textContent.trim() : null;
			}

			year = response.document.querySelector('div.bar.mb-medium > div:nth-child(1) > dl > dd > span');
			year = year != null && extractYear(year.textContent) || undefined;
			if ((ref = response.document.querySelector('article > h1')) != null) {
				title = ref.textContent.trim();
				ref = response.document.querySelectorAll('article > ul > li > a');
				if (ref.length > 0) title = joinAuthors(ref) + ' – ' + title;
				if (year > 0) title += ' (' + year + ')';
				setTitle(title);
			}
			//setYear(year);
			response.document.querySelectorAll('dd > ul > li > a').forEach(x => { tags.add(x.textContent.trim()) });
			setTags(tags);
			const imgMax = imgUrl => imgUrl ?
				imgUrl.replace(/\/_\w+\//, '/_xl/').replace(/\/[a-z]*(\d+\.\w+)(?:\?.*)?$/i, '/xl$1') : undefined;
			if ((i = response.document.querySelector('a.mj-product-preview > img')) != null) setCover(imgMax(i.src));
				else if ((i = response.document.querySelector('head > meta[property="og:image"][content]')) != null)
					setCover(imgMax(i.content));
			ref = response.document.querySelector('section#description > div');
			if (ref != null) {
				description = html2php(ref, response.finalUrl).replace(/^\s*\[img\].*?\[\/img\]\s*/i, '').trim();
				if (description && !quoteDetector.test(description)) description = description.bbQuote();
			} else description = '';
			const translation_map = [
				[/\b(?:originál)/i, 'Original title'],
				[/\b(?:datum|dátum|rok)\b/i, 'Release date'],
				[/\b(?:katalog|katalóg)/i, 'Catalogue #'],
				[/\b(?:stran|strán)\b/i, 'Page count'],
				[/\bjazyk/i, 'Language'],
				[/\b(?:nakladatel|vydavatel)/i, 'Publisher'],
				[/\b(?:doporuč|ODPORÚČ)/i, 'Age rating'],
			];
			response.document.querySelectorAll('section#details > div > div > div:first-of-type > div > dl').forEach(function(detail) {
				let key = detail.children[0].textContent.trim(), value = detail.children[1].textContent.trim();
				if (/\b(?:rozm)/i.test(key) || /\b(?:vazba|vázba)\b/i.test(key)) return;
				translation_map.forEach(k => { if (k[0].test(key)) key = k[1] });
				if (/\b(?:ISBN)\b/i.test(key)
						&& (/\b(\d{13})\b/.test(value) || /\b(\d{10})\b/.test(value) || /^(\d+(?:[\d\-\s]*\d)?)$/.test(value))) {
					let wc = 'https://www.worldcat.org/isbn/' + RegExp.$1.replace(/[\-\s]+/g, '');
					value = value.bbUrl(wc);
					findOCLC(wc);
				} else if (/\b(?:ISBN)\b/i.test(key))
					val = detail.children[1].textContent.trim().bbUrl('https://www.goodreads.com/search/search?q=' +
						detail.children[1].textContent.trim() + '&search_type=books');
				if (value) description += `\n[b]${key}:[/b] ${value}`;
			});
			description += '\n\n[b]More info and reviews:[/b]\n' + response.finalUrl.bbUrl();
			setDescription(description);
			if (isRequestNew) setReqDefaultBounty();
		}); else if (sourceUrl.hostname.endsWith('databazeknih.cz')) {
			params.set('show', 'alldesc');
			sourceUrl.search = params;
			return globalXHR(sourceUrl).then(function(response) {
				if ((ref = response.document.querySelector('span[itemprop="datePublished"]')) != null)
					year = extractYear(ref.textContent);
				if ((ref = response.document.querySelector('h1[itemprop="name"]')) != null) {
					title = ref.textContent.trim();
					ref = response.document.querySelectorAll('span[itemprop="author"] > a');
					if (ref.length > 0) title = joinAuthors(ref) + ' – ' + title;
					if (year > 0) title += ' (' + year + ')';
					setTitle(title);
				}
				//setYear(year);
				if ((ref = response.document.querySelector('div#icover_mid > a')) != null)
					imageUrlResolver('https://www.databazeknih.cz' + ref.pathname).then(setCover);
				else {
					const imageMax = imageUrl => httpParser.test(imageUrl) ? verifyImageUrl([
						[/\/\d+\/([a-z]+)(?=_)/, 'big'], [/\?.*$/, ''],
					].reduce((acc, def) => acc.replace(...def), imageUrl)).catch(reason => imageUrl) : Promise.reject('invalid url');
					if ((ref = response.document.querySelector('div#lbImage')) != null
							&& (i = /\b(?:url)\("(.*)"\)/i.exec(ref.style.backgroundImage)) != null) imageMax(i[1]).then(setCover);
					else if ((ref = response.document.querySelector('img.kniha_img')) != null) imageMax(ref.src).then(setCover);
				}
				response.document.querySelectorAll('h5[itemprop="genre"] > a')
					.forEach(tag => { tags.add(tag.textContent.trim()) });
				response.document.querySelectorAll('a.tag').forEach(tag => { tags.add(tag.textContent.trim()) });
				setTags(tags);
				description = '';
				response.document.querySelectorAll('p[itemprop="description"] > span')
					.forEach(span => { description += span.textContent });
				if (description) description = description.trim();
				if (description && !quoteDetector.test(description)) description = description.bbQuote();
				const translation_map = [
					[/\b(?:Orig)/i, 'Original title'],
					[/\b(?:Série)\b/i, 'Series'],
					[/\b(?:Vydáno)\b/i, 'Released'],
					[/\b(?:Počet stran)\b/i, 'Page count'],
					[/\b(?:Jazyk)\b/i, 'Language'],
					[/\b(?:Překlad)/i, 'Translation'],
					[/\b(?:Autoři obálky)\b/i, 'Cover authors'],
					[/\b(?:Ilustrace\/foto)\b/i, 'Illustration/photo'],
				];
				function binfoExtractor(tr) {
					if (tr.id == 'abinfo') return;
					console.assert(!tr.id, 'tr.id');
					let key = tr.children[0].textContent.trim(), value = html2php(tr.children[1], response.finalUrl).trim();
					if (['Žánr', 'Vazba knihy'].includes(key)) return;
					translation_map.forEach(k => { if (k[0].test(key)) key = k[1] });
					if (/\b(?:ISBN)\b/i.test(key) && (/\b(\d{13})\b/.test(tr.children[1].textContent)
							|| /\b(\d{10})\b/.test(tr.children[1].textContent)
							|| /^(\d+(?:[\d\-\s]*\d)?)$/.test(tr.children[1].textContent.trim()))) {
						let wc = 'https://www.worldcat.org/isbn/' + RegExp.$1.replace(/[\-\s]+/g, '');
						value = tr.children[1].textContent.trim().bbUrl(wc);
						findOCLC(wc);
					}
					if (value) description += `\n[b]${key}:[/b] ${value}`;
				}
				function finalizeDesc() {
					if ((ref = response.document.querySelector('div[class^="hodnoceni_"]')) != null)
						description += '\n[b]Rating:[/b] ' + ref.textContent.trim();
					sourceUrl = new URL(response.finalUrl);
					description += '\n\n[b]More info:[/b]\n' + (sourceUrl.origin + sourceUrl.pathname).bbUrl();
					setDescription(description);
				}
				response.document.querySelectorAll('table.bdetail tr').forEach(binfoExtractor);
				if ((ref = response.document.querySelector('tr#abinfo[bid]')) != null)
					globalXHR('https://www.databazeknih.cz/books/book-detail-more-info-ajax.php?bid=' + ref.getAttribute('bid'), {
						responseType: 'text',
					}).then(function({responseText}) {
						domParser.parseFromString('<table><tbody>' + responseText + '</tbody></table>', 'text/html')
							.querySelectorAll('body > table > tbody > tr').forEach(binfoExtractor);
					}).catch(reason => { console.warn('failed to load extended info for Databáze knih', 'warning') }).then(finalizeDesc);
				else finalizeDesc();
				if (isRequestNew) setReqDefaultBounty();
			});
		} else if ((sourceUrl.hostname.endsWith('alza.cz') || sourceUrl.hostname.endsWith('alza.sk'))
				&& sourceUrl.pathname.startsWith('/media/')) return globalXHR(sourceUrl).then(function(response) {
			let meta = response.document.querySelector('div.detail-page > script[type="application/ld+json"]');
			if (meta != null) try {
				meta = JSON.parse(meta.text);
				if (prefs.diag_mode) console.debug('Alza metadata extracted:', meta);
			} catch(e) { meta = null }
			let descAnnotation = response.document.querySelector('div#descAnnotation');
			descAnnotation = descAnnotation && globalXHR('https://www.alza.cz/media/Services/EShopService.svc/GetCommodityDetailLegend', {
				responseType: 'json',
			}, { code: descAnnotation.dataset.code, id: -1, showParentLegend: false });
			year = response.document.querySelector('div#mediaDetailText div.media-details > div.row > span.value');
			year = year != null && extractYear(year.firstChild.textContent) || undefined;
			if ((meta || (ref = response.document.querySelector('div#mediaDetailText h1[itemprop="name"]'))) != null) {
				title = meta != null ? meta.name : ref.textContent.trim();
				ref = response.document.querySelectorAll('div#mediaDetailText div.media-details > div.row50 > span.value > a');
				if (ref.length > 0) title = joinAuthors(ref) + ' – ' + title;
				if (year > 0) title += ' (' + year + ')';
				setTitle(title);
			}
			//setYear(year);
			//response.document.querySelectorAll('dd > ul > li > a').forEach(x => { tags.add(x.textContent.trim()) });
			//setTags(tags);
			const imageMax = imgSrc => imgSrc.replace(/([\?\&])fd=(?:f\d+)\b\&?/i, '$1');
			if (meta != null && httpParser.test(meta.image)) setCover(imageMax(meta.image));
				else if ((ref = response.document.querySelector('meta[property="og:image"][content]')) != null)
					setCover(imageMax(ref.content));
			let allPar = { };
			const propTranslations = {
				'Autor': 'Author',
				'Jazyk': 'Language',
				'Počet stran': 'Page count',
				'Série': 'Series',
				'Díl série': 'Episode №',
				'Nakladatel': 'Publisher',
				'Rok vydání': 'Publish year',
				'Druh ochrany': 'Protection',
				'Dostupný formát': 'Format(s) available',
			};
			const propTranslation = propName => Object.keys(propTranslations)
				.reduce((acc, key) => acc.toLowerCase() == key.toLowerCase() ? propTranslations[key] : acc, propName);
			response.document.querySelectorAll('div.allpar div.groupValues > div.row').forEach(function(div) {
				const key = div.querySelector('div.name'), value = div.querySelector('span.value');
				if (key == null || value == null) console.warn('Alza allpar table unexpected row structure:', div);
					else allPar[propTranslation(key.firstChild.textContent.trim())] = html2php(value, meta.offers.url).trim();
			});
			if (meta != null) {
				if (meta.brand) allPar['Publisher'] = meta.brand;
				if (meta.sku) allPar['SKU'] = meta.sku;
				if (meta.mpn) {
					let wc = 'https://www.worldcat.org/isbn/' + meta.mpn.replace(/[\-\s]+/g, '');
					allPar['ISBN'] = meta.mpn.bbUrl(wc);
					findOCLC(wc);
				}
				if (meta.gtin13) {
					let wc = 'https://www.worldcat.org/isbn/' + meta.gtin13.replace(/[\-\s]+/g, '');
					allPar['GTIN13'] = meta.gtin13.bbUrl(wc);
					findOCLC(wc);
				}
				if (meta.aggregateRating && meta.aggregateRating.ratingCount > 0)
					allPar['Rating'] = Math.round(meta.aggregateRating.ratingValue * 20).toString() + '%';
			}
			function finDesc() {
				if (description == undefined) description = '';
// 				if ((ref = response.document.querySelector('div#mediaDetailText div.media-details > div.row > span.value')) != null)
// 					description += '\n' + ref.textContent.trim() + '\n';
				for (let key in allPar) description += '\n[b]' + key + ':[/b] ' + allPar[key];
				description += '\n\n[b]More info and reviews:[/b]\n' + (meta != null ? meta.offers.url : sourceUrl).bbUrl();
				setDescription(description);
			}
			if (descAnnotation != null) descAnnotation.then(function({response}) {
				description = html2php(domParser.parseFromString(response.d.Value, 'text/html').body, meta.offers.url)
					.trim().replace(/\s*\[img\].*?\[\/img\]/ig, '');
				if (description && !quoteDetector.test(description)) description = description.bbQuote();
				finDesc();
			}).catch(function(reason) {
				console.warn('Alza: failed to read book detail', reason);
				finDesc();
			}); else finDesc();
			if (isRequestNew) setReqDefaultBounty();
		}); else if (sourceUrl.hostname.endsWith('librarything.com') && sourceUrl.pathname.startsWith('/work/')) return globalXHR(sourceUrl).then(function(response) {
			if ((ref = response.document.querySelector('div.headsummary > h1')) != null) {
				title += ref.textContent.trim();
				ref = response.document.querySelectorAll('div.headsummary > h2 > a');
				if (ref.length > 0) title = joinAuthors(ref) + ' – ' + title;
				setTitle(title);
			}
			//setYear(year);
			if ((ref = response.document.querySelector('head > meta[property="og:image"][content]')) != null)
				setCover(ref.content.replace(/(?:\.\d+)*(?:\._\w+_)*(?=\.\w+$)/, ''));
			description = '';
			response.document.querySelectorAll('table.fwikiContainerTable > tbody > tr').forEach(function(tr) {
			});
			description += '\n\n[b]More info:[/b] ' + response.finalUrl.bbUrl();
			setDescription(description);
			if (isRequestNew) setReqDefaultBounty();
		}); else if (sourceUrl.hostname.endsWith('boomkat.com') && sourceUrl.pathname.startsWith('/products/')) return globalXHR(sourceUrl).then(function(response) {
			ref = Array.from(response.document.querySelectorAll('ul.product-page-tabs > li.tab-title > a'))
				.filter(a => a.textContent.trim() == 'Book');
			if (ref.length <= 0) return Promise.reject('This doesn\'t appear as a book');
			let releaseDate = ref[0].dataset.releaseDate,
					publisher = ref[0].dataset.label,
					catalogue = ref[0].dataset.catalogueNumber;
			year = extractYear(releaseDate);
			if ((ref = response.document.querySelector('div#right_content > h2.detail_album')) != null) {
				title = ref.textContent.trim();
				ref = response.document.querySelectorAll('div#right_content > h1.detail--artists > a');
				if (ref.length > 0) title = joinAuthors(ref) + ' – ' + title;
				if (year > 0) title += ' (' + year + ')';
				setTitle(title);
			}
			//setYear(year);
			if ((ref = response.document.querySelector('img[itemprop="image"]')) != null)
				setCover(ref.src.replace(/\/large\//i, '/original/'));
			description = (ref = response.document.querySelector('div' + i[0].hash + ' p.product-extra-info')) != null ?
				ref.textContent.trim() + '\n\n' : '';
			if (releaseDate) description += '[b]Release date:[/b] ' + releaseDate + '\n';
			if (publisher) description += '[b]Publisher:[/b] ' + publisher + '\n';
			if (catalogue) description += '[b]Catalogue №:[/b] ' + catalogue + '\n';
			if ((ref = response.document.querySelector('div.show-for-medium-up > div.product-review')) != null) {
				if (description.length > 0) description += '\n';
				description += html2php(ref).trim();
				if (description && !quoteDetector.test(description)) description = description.bbQuote();
			}
			setDescription(description);
			if (isRequestNew) setReqDefaultBounty();
		}); else if (!weak) {
			addMessage('domain not supported', 'critical');
			uaData.value = '';
		}
		return Promise.reject('domain not supported');
	} // fillFromText_Ebooks

	function setCover(url, forced = overwrite, input = null) {
		if (!url) return Promise.reject('No cover provided');
			else if (!httpParser.test(url)) return Promise.reject('Invalid URL');
		if (!(input instanceof HTMLInputElement)) input = findImageInput();
		if (input == null || input.disabled || !forced && input.value.length > 0) {
			//console.warn('setting image not possible:', input, input.disabled, input.value);
			return Promise.reject('setting image not possible');
		}
		console.time('Image URL Resolver/Rehoster');
		return verifyImageUrl(url).then(function(imageUrl) {
			if (!isNWCD) input.value = imageUrl;
			let size = getRemoteFileSize(imageUrl);
			coverPreview(input, imageUrl, size);
			checkImageSize(imageUrl, input, size).then(function(imageUrl) {
				if (!prefs.auto_rehost_cover && !isNWCD) return;
				input.disabled = true;
				return safeRehostSingleImage(imageUrl).then(function(imageUrl) {
					if (imageUrl == null) throw 'invalid image';
					input.value = imageUrl;
				});
			}).catch(function(reason) {
				if (!isNWCD) input.value = imageUrl;
				addMessage(reason + ' (not rehosted)', 'warning');
			}).then(function() {
				input.disabled = false;
				console.timeEnd('Image URL Resolver/Rehoster');
			});
			return imageUrl;
		});
	}

	function elementWritable(elem) {
		return elem != null && !elem.disabled && (overwrite || elem.value == '' || !isRED && elem.value == '---');
	}

	function loadGoogleMetadata(response) {
		const initDataParsers = [
			/^\s*(?:AF_initDataCallback)\s*\(\s*\{\s*key:\s*'ds:(\d+)'.*\b(?:data):\s*function\(\)\s*{\s*return\s*([\S\s]+)\}\s*\}\s*\);/,
			/^\s*(?:AF_initDataCallback)\s*\(\s*(\{[\S\s]+\})\s*\)\s*;\s*$/,
		];
		let dss = [ ];
		response.document.querySelectorAll('script[nonce]').forEach(function(script) {
			let AF_initDataCallback = initDataParsers[1].exec(script.text);
			if (AF_initDataCallback != null) try {
				AF_initDataCallback = eval('(' + AF_initDataCallback[1] + ')');
				if (!Array.isArray(AF_initDataCallback.data)) throw 'unexpected data format';
				if (!/^(?:ds):(\d+)$/.test(AF_initDataCallback.key)) throw 'key not present';
				if (!dss[RegExp.$1]) dss[RegExp.$1] = AF_initDataCallback.data;
			} catch(e) { }
			if ((AF_initDataCallback = initDataParsers[0].exec(script.text)) != null) try {
				if (!dss[AF_initDataCallback[1]]) dss[AF_initDataCallback[1]] = eval(AF_initDataCallback[2]);
			} catch(e) { }
		});
		return dss;
	}

	function getFriendlyTime(timeStr) {
		let now = Date.now(), timeStamp = timeStr.split(/\D+/).map(a => parseInt(a)); --timeStamp[1];
		timeStamp = Date.UTC(...timeStamp);
		if (isNaN(timeStamp)) {
			console.error('Date string could not be converted to UTC time:', timeStr);
			return '[invalid time]';
		}
		let offset = Math.round((now - timeStamp) / 1000);
		if (offset < 60) timeStamp = offset.toString() + ' seconds ago';
		else if (offset < 60 * 60) timeStamp = Math.round(offset / 60).toString() + ' minutes ago';
		else if (offset < 12 * 60**2) timeStamp = Math.round(offset / 60**2).toString() + ' hours ago';
		else {
			timeStamp = new Date(timeStamp);
			timeStamp = new Date(now).getDateValue() != timeStamp.getDateValue() ?
				'on ' + timeStamp.toDateString() : 'at ' + timeStamp.toTimeString();
		}
		if (timeStamp.startsWith('1 ')) timeStamp = timeStamp.replace('s ago', ' ago');
		return timeStamp;
	}
	function getGroupRef(torrent) {
		return '<a href="/torrents.php?id=' + torrent.groupId +
			'" target="_blank" style="' + hyperlinkStyle + '">' + torrent.groupName + '</a>';
	}
	function getTorrentRef(torrent) {
		return '<a href="/torrents.php?id=' + torrent.groupId + '&torrentid=' + torrent.id +
			'" target="_blank" style="' + hyperlinkStyle + '">' + torrent.id + '</a>';
	}
	function getRequestRef(request) {
		return '<a href="/requests.php?action=view&id=' + request.requestId +
			'" target="_blank" style="' + hyperlinkStyle + '">' + (request.title || request.requestId) + '</a>';
	}
	function getUserRef(torrent) {
		return '<a href="/users.php?id=' + torrent.userId + '" target="_blank" style="' +
			hyperlinkStyle + '">' + torrent.username + '</a>';
	}
	function getRequestInfo(request) {
		var totalBounty = request.totalBounty || request.bounty;
		if (!(totalBounty > 0)) {
			console.warn('Failed to get request bounty:', request);
			return '???';
		}
		const voteGlyph = '<img src="https://ptpimg.me/3s2w7o.png" style="height: 8px; margin-right: 3px;" />'
		if (totalBounty >= 2**30) totalBounty = (Math.round(totalBounty * 10 / 2**30) / 10).toString() + ' GiB';
			else totalBounty = Math.round(totalBounty / 2**20).toString() + ' MiB';
		return `(${voteGlyph}${request.voteCount} / ${totalBounty})`;
	}

	function lookupNonMusicRelations() {
		if (!prefs.find_relations || isSelectedCategory('Music')) return;
		let title = document.getElementById('title') || document.querySelector('input[name="title"]');
		if (title == null || !title.value) return;
		const similarityThreshold = 0.70;
		const titleStrippers = [
			[bracketStripper, ''],
			[/[\‐\-\−\—\–\:\|\/\<\>]+/g, ' '],
			[/[\"]+/g, ''],
			[/\s{2,}/g, ' '],
		];
		const altTitleStrippers = [
			[/^(?:[^\‐\-\−\—\–]+?)\s+[\‐\-\−\—\–]\s+/, ''],
			//[/^(?:[^:]+?):\s+/, ''],
		];
		function getAltSearchTerm() {
			return title.title ? titleStrippers.reduce((r, def) => r.replace(...def), title.title)
			: altTitleStrippers.concat(titleStrippers).reduce((r, def) => r.replace(...def), title.value);
		};
		let searchTerm = titleStrippers.reduce((m, substDef) => m.replace(...substDef), title.value);
		// Find existing torrents
		function searchTorrents(searchTerm) {
			return queryAjaxAPI('browse', {
				//groupname: title.value,
				searchstr: searchTerm,
				//order_by: 'time',
				//order_way: 'desc',
				['filter_cat[' + (category != null ? category.selectedIndex + 1 : '') + ']']: 1,
			});
		}
		searchTorrents(searchTerm).then(function(response) {
			function printResults(results) {
				results.forEach(function(torrent) {
					if (reportedDupes.has(torrent.id)) return;
					let time = new Date(parseInt(torrent.groupTime) * 1000);
					time = !isNaN(time) ? time.toISOString() : torrent.groupTime;
					if (isUpload) reportedDupes.set(torrent.id,
						addMessage(new HTML('possible dupe to torrent ' + getGroupRef(torrent) + ' ' + getFriendlyTime(time)), 'warning'));
					else if (isRequestNew) reportedDupes.set(torrent.id,
						addMessage(new HTML('requested release possibly already on site: ' +
							getGroupRef(torrent) + ' ' + getFriendlyTime(time)), 'notice'));
				});
			}
			if (response.results.length > 0) return printResults(response.results);
			else if (!title.title && !altTitleStrippers.reduce((r, rx) => r || rx[0].test(title.value), false)) return;
			let altSearchTerm = getAltSearchTerm();
			return searchTorrents(altSearchTerm).then(({results}) => { printResults(results.filter(function(torrent) {
				let torrentTitle = titleStrippers.reduce((r, substDef) => r.replace(...substDef), torrent.groupName);
				let similarity = jaroWrinkerSimilarity(torrentTitle, altSearchTerm);
				if (prefs.diag_mode) console.debug(`similarity("${torrentTitle}", "${altSearchTerm}") =`, similarity);
				return similarity >= similarityThreshold;
			})) });
		}).catch(reason => { console.error('searchTorrents:', reason) });
		// Find open requests
		function searchRequests(searchTerm) {
			return queryAjaxAPI('requests', {
				search: searchTerm,
				showall: 'on',
				['filter_cat[' + (category != null ? category.selectedIndex + 1 : '') + ']']: 1,
			});
		}
		searchRequests(searchTerm).then(function(response) {
			function printResults(results) {
				results.forEach(function(request) {
					if (reportedRequests.has(request.requestId)) return;
					if (category != null && request.categoryId != category.selectedIndex + 1) return;
					if (isUpload) reportedRequests.set(request.requestId, addMessage(new HTML('open request ' +
						getRequestRef(request) + ' ' + getRequestInfo(request) + ' possibly fillable by this release'), 'info'));
					else if (isRequestNew) reportedRequests.set(request.requestId,
						addMessage(new HTML('release possibly already requested: ' + getRequestRef(request)), 'info'));
				});
			}
			if (response.results.length > 0) return printResults(response.results);
				else if (!title.title && !altTitleStrippers.reduce((r, rx) => r || rx[0].test(title.value), false)) return;
			let altSearchTerm = getAltSearchTerm();
			return searchRequests(altSearchTerm).then(({results}) => { printResults(results.filter(function(request) {
				let requestTitle = titleStrippers.reduce((r, substDef) => r.replace(...substDef), request.title);
				let similarity = jaroWrinkerSimilarity(requestTitle, altSearchTerm);
				if (prefs.diag_mode) console.debug(`similarity("${requestTitle}", "${altSearchTerm}") =`, similarity);
				return similarity >= similarityThreshold;
			})) });
		}).catch(reason => { console.error('searchRequests:', reason) });
		// 	if (prefs.relations_check_interval > 0 && typeof relationsCheckTimer != 'number')
		// 	  relationsCheckTimer = setInterval(lookupNonMusicRelations, prefs.relations_check_interval * 1000);
	}
} // fillFromText

function joinArtists(arr, decorator = artist => artist) {
	if (!Array.isArray(arr)) return null;
	if (arr.some(artist => artist.includes('&'))) return arr.map(decorator).join(', ');
	if (arr.length < 3) return arr.map(decorator).join(' & ');
	return arr.slice(0, -1).map(decorator).join(', ') + ' & ' + decorator(arr.slice(-1).pop());
}

function notifyChange(elem) {
	console.assert(elem instanceof HTMLElement);
	if (elem instanceof HTMLElement) try {
		if (typeof elem.onchange == 'function') elem.onchange(); else elem.dispatchEvent(new Event('change'));
	} catch (e) { console.warn(elem, 'change()', e) }
}

function getDeezerImageMax(imageUrl) {
	if (!httpParser.test(imageUrl)) return Promise.reject('invalid image URL');
	const dzrImgResParser = /\/(\d+x\d+)(?:\-\d+)*\.(\w+)$/;
	let ext = dzrImgResParser.exec(imageUrl);
	if (ext != null) ext = prefs.deezer_get_png_cover ? 'png' : ext[2]; else {
		console.warn('Unscalable Deezer image, returning unchanged:', imageUrl);
		return Promise.resolve(imageUrl);
	}
	const urlByResolution = resolution => imageUrl.replace(dzrImgResParser, '/' + resolution + 'x' + resolution) +
		(/^j(?:pe?g|fif)$/i.test(ext) ? `-000000-${parseInt(prefs.deezer_jpeg_quality) || 100}-0-0.${ext}` : '.' + ext);
	const deezerHighestResolution = Math.max(parseInt(prefs.deezer_highest_resolution) || 0, 500);
	const defaultMax = (res = deezerHighestResolution) => verifyImageUrl(urlByResolution(res)).catch(reason => imageUrl);
	const resolutions = [/*1200, */1400, 1425, 1440, 1500, 1600, 1800, 1920].filter(size => size <= deezerHighestResolution);
	return Math.max(...resolutions) > 1400 ? Promise.all(resolutions.map(res => new Promise(function(resolve, reject) {
		let img = document.createElement('img');
		img.onload = load => { resolve(load.target.naturalWidth * load.target.naturalHeight) };
		img.onerror = (message, source, lineno, colno, error) => { reject(message) };
		img.src = imageUrl.replace(dzrImgResParser, '/' + res + 'x' + res + '.png');
	}).catch(reason => -Infinity))).then(function(pixTotals) {
		if (prefs.diag_mode) {
			let t = { };
			for (let index = 0; index < pixTotals.length; ++index) {
				let res = Math.sqrt(pixTotals[index]);
				t[resolutions[index]] = res == resolutions[index] ? '✓' : res;
			}
			console.debug('Deezer image explorer results:', t);
		}
		let maxArea = Math.max(...pixTotals);
		if (maxArea <= 0) {
			console.warn('Deezer: no max variant returns valid image', pixTotals, imageUrl);
			return Promise.reject('all size variants failed to load'); //defaultMax()
		}
		return urlByResolution(resolutions[pixTotals.indexOf(maxArea)]);
	}) : defaultMax(deezerHighestResolution);
}
function getDiscogsImageMax(imageUrl) {
	if (!httpParser.test(imageUrl)) return Promise.reject('invalid image URL');
	if (imageUrl.endsWith('/images/spacer.gif')) return Promise.reject('Dummy image (placeholder)');
	const matches = [
		/^(?:https?):\/\/(?:(?:img|i)\.discogs\.com)\/.+\/([\w\%\-]+\.\w+)\b(?:\.\w+)*$/i,
	].map(rx => rx.exec(imageUrl));
	if (matches[0] != null) return verifyImageUrl(discogsOrigin + '/image/' + matches[0][1]).catch(reason => imageUrl);
	return Promise.resolve(imageUrl);
}

function hideEmptyMessages() {
	const uaMessages = document.body.querySelector('table#upload-assistant tr.ua-messages');
	if (uaMessages != null && uaMessages.querySelectorAll('div.ua-message').length <= 0)
		uaMessages.style.visibility = 'collapse';
}

function addMessage(content, cls = 'warning') {
	console.assert(content && cls, 'content && cls');
	if (!content || !cls) return null;
	switch (cls = cls.toLowerCase()) {
		case 'info': var prefix = 'Info'; break;
		case 'notice': prefix = 'Notice'; break;
		case 'warning': prefix = 'Warning'; break;
		case 'error': case 'fatal': cls = 'critical';
		case 'critical': case 'critical-lite': prefix = 'FATAL'; break;
		default:
			console.warn('addMessage(…) invalid param:', cls);
			return null;
	}
	let tr = document.body.querySelector('table#upload-assistant tr.ua-messages'), td;
	if (tr == null) {
		console.assert(tr == null, "tr == null");
		const tbody = document.querySelector('table#upload-assistant > tbody');
		console.assert(tbody != null, 'addMessage(…): querySelector(\'table#upload-assistant > tbody\') returns NULL');
		if (tbody == null) return null;
		tr = document.createElement('tr');
		tr.className = 'ua-messages';
		tr.style.transition = 'visibility 5s';
		tr.append(td = Object.assign(document.createElement('td'), {
			colSpan: 2,
			style: 'padding: 10pt; text-align: left; background-color: DarkSlateGray; font: 8pt "Noto Sans", sans-serif;',
		}));
		tbody.append(tr);
	} else {
		tr.style.visibility = 'visible';
		td = tr.cells[0];
		console.assert(td, tr);
	}
	const div = document.createElement('div');
	div.classList.add('ua-message', 'ua-' + cls);
	if (content instanceof HTMLElement) div.append(prefix, ': ', content);
	else div[content instanceof HTML ? 'innerHTML' : 'textContent'] = prefix + ': ' + content;
	td.append(div);
	return div;
}

if (typeof createDropDownOptions == 'function') unsafeWindow.createDropDownOptions = function(array) {
	// return [['0', '---']].concat(array.map(e => [e, e]))
	// 	.map(e => `<option value="${e[0]}">${e[1]}</option>`).join('');
	let s = '<option value="0">---</option>';
	for (let i of array) s += ("<option value=\"" + i + "\">" + i + "</option>");
	return s;
};

function html2php(node, docUrl) {
	docUrl = httpParser.test(docUrl) ? new URL(docUrl).origin : null;
	const realUrl = a => a.origin == document.location.origin && docUrl ? docUrl + a.pathname + a.search + a.hash : a.href;
	return parseFromNode(node);

	function parseFromNode(node, tagChain = []) {
		if (!(node instanceof Node)) return null;
		switch (node.nodeType) {
			case Node.ELEMENT_NODE: {
				let tags = [ ], _tags = [ ], text = [ ];
				for (let i = 0; i < 5; ++i) text[i] = '';
				switch (node.tagName) {
					case 'P':
						text[0] = '\n'; text[4] = '\n';
						break;
					case 'DIV':
						text[0] = '\n\n'; text[4] = '\n\n';
						break;
					case 'DT':
						//text[4] = '\n';
						addTag('b'); text[3] = ':';
						break;
					case 'DD':
						//if (isRED) addTag('pad=0|0|0|30'); else text[0] = '     ';
						text[1] = '\t'; text[4] = '\n';
						break;
					case 'LABEL':
						addTag('b');
						text[0] = '\n\n';
						break;
					case 'BR':
						return '\n';
					case 'HR':
						return isRED ? '[hr]' : '\n';
					case 'B': case 'STRONG':
						addTag('b');
						break;
					case 'I': case 'EM': case 'DFN': case 'CITE': case 'VAR':
						addTag('i');
						break;
					case 'U': case 'INS':
						addTag('u');
						break;
					case 'DEL':
						addTag('s');
						break;
					case 'CODE': case 'SAMP': case 'KBD':
						addTag('code');
						text[2] = node.textContent;
						break;
					case 'PRE':
						addTag('pre');
						text[2] = node.textContent;
						break;
					case 'BLOCKQUOTE': case 'QUOTE':
						addTag('quote');
						break;
					case 'Q':
						text[1] = '"'; text[3] = '"';
						break;
					case 'H1':
						addTag('size=5'); addTag('b');
						text[0] = '\n\n'; text[4] = '\n\n';
						break;
					case 'H2':
						addTag('size=4'); addTag('b');
						text[0] = '\n\n'; text[4] = '\n\n';
						break;
					case 'H3':
						addTag('size=3'); addTag('b');
						text[0] = '\n\n'; text[4] = '\n\n';
						break;
					case 'H4': case 'H5': case 'H6':
						addTag('b');
						text[0] = '\n\n'; text[4] = '\n\n';
						break;
					case 'SMALL':
						addTag('size=1');
						break;
					case 'OL': case 'UL':
						_tags.push(node.tagName.toLowerCase());
						break;
					case 'DL':
						_tags.push(node.tagName.toLowerCase());
						break;
					case 'LI':
						switch (tagChain.reverse().find(tag => /^[ou]l$/.test(tag))) {
							case 'ol': text[0] = '[#] '; text[4] = '\n'; break;
							case 'ul': text[0] = '[*] '; text[4] = '\n'; break;
							default: return '';
						}
						break;
					case 'TR':
						text[4] = '\n';
						break;
					case 'TD':
						text[1] = '\t';
						break;
					case 'A': {
						if (/^https?:$/i.test(node.protocol)) addTag('url=' + removeRedirect(realUrl(node)));
						break;
					}
					case 'IMG':
						addTag('img');
						text[2] = node.dataset.src || node.src;
						break;
					case 'DETAILS': {
						let summary = node.querySelector('summary');
						summary = summary != null ? '=' + summary.textContent.trim() : '';
						addTag('hide' + summary);
						break;
					}
					case 'AUDIO': case 'BASE': case 'BUTTON': case 'CANVAS': case 'COL': case 'COLGROUP': case 'DATALIST':
					case 'DIALOG': case 'EMBED': case 'FIELDSET': case 'FORM': case 'HEAD': case 'INPUT': case 'LEGEND':
					case 'LINK': case 'MAP': case 'META': case 'METER': case 'NOSCRIPT': case 'OBJECT': case 'OPTGROUP':
					case 'OPTION': case 'PARAM': case 'PROGRESS': case 'SELECT': case 'SOURCE': case 'STYLE': case 'SUMMARY':
					case 'SVG': case 'TEMPLATE': case 'TEXTAREA': case 'TITLE': case 'TRACK': case 'VIDEO':
						return '';
				}
				if (['left', 'center', 'right'].some(al => node.style.textAlign.toLowerCase() == al)) {
					addTag('align=' + node.style.textAlign.toLowerCase());
				}
				if (node.style.fontWeight >= 700) addTag('b');
				switch (node.style.fontStyle.toLowerCase()) {
					case 'italic': addTag('i'); break;
				}
				switch (node.style.textDecorationLine.toLowerCase()) {
					case 'underline': addTag('u'); break;
					case 'line-through': addTag('s'); break;
				}
				if (node.style.color) {
					ctxt.fillStyle = node.style.color;
					if (ctxt.fillStyle != '#000000' && /^#(?:[a-f0-8]{2}){3,4}$/i.test(ctxt.fillStyle)) {
						addTag('color=' + ctxt.fillStyle);
					}
				}
				if (!text[2]) node.childNodes.forEach(function(node) {
					var childContent = parseFromNode(node, tagChain.concat(tags.concat(_tags).map(tag => tag.replace(/=.*$/, ''))));
					text[2] += childContent;
				});
				if (node.tagName == 'A' && text[2].trim().length <= 0) {
					if (/^(?:https?):$/i.test(node.protocol)) {
						text[2] = removeRedirect(realUrl(node));
						tags.splice(-1, 1, 'url');
					} else text[2] = node.href.slice(node.protocol.length);
				}
				return text[0] + (text[1] || text[2] || text[3] ? tags.map(tag => '[' + tag + ']').join('').concat(text[1],
					text[2], text[3], tags.reverse().map(tag => '[/' + tag.replace(/=.*$/, '') + ']').join('')) : '') + text[4];

				function addTag(tag) {
					if (tagChain.concat(tags.map(tag => tag.replace(/=.*$/, ''))).includesCaseless(tag.replace(/=.*$/, ''))) return;
					tags.push(tag);
				}
			}
			case Node.TEXT_NODE:
				return node.wholeText.replace(/\s+/g, ' ');
			case Node.DOCUMENT_NODE:
				return parseFromNode(node.body);
		}
		return '';
	}
}

function coverPreview(input, imgUrl, size) {
	if (!prefs.auto_preview_cover) return;

	function cleanUp(target) {
		if (!(target instanceof HTMLElement)) return;
		target.style.opacity = 0;
		target.hTimer = setTimeout(target => { target.remove() }, 1000, target);
	}

	let div, img = document.getElementById('cover-preview');
	if (img != null) {
		if (img.parentNode.hTimer) {
			clearTimeout(img.parentNode.hTimer);
			delete img.parentNode.hTimer;
		}
		if (!httpParser.test(imgUrl)) {
			if (img.parentNode.parentNode != null) img.parentNode.remove();
			return;
		}
	} else {
		if (!httpParser.test(imgUrl)) return;
		if (input instanceof HTMLElement && input.parentNode.previousElementSibling != null) {
			div = document.createElement('div');
			div.style = 'margin-top: 10px; float: right; width: 90%;';
			img = document.createElement('img');
			img.style.width = '100%';
		} else {
			div = document.createElement('div');
			div.style = 'position: fixed; bottom: 20px; right: 20px; border: thin solid silver; ' +
				'background-color: #8888; padding: 10px; opacity: 0; transition: opacity 1s ease-in-out; z-index: 999999999;';
			div.ondblclick = evt => { cleanUp(evt.currentTarget) };
			img = document.createElement('img');
			img.style.width = '225px';
		}
		img.id = 'cover-preview';
		img.onerror = function(evt) {
			if (evt.currentTarget.parentNode.parentNode != null) evt.currentTarget.parentNode.remove();
			console.warn('Image source cannot be loaded:', evt, imgUrl);
		};
		div.append(img);
	}
	img.onload = input instanceof HTMLElement && input.parentNode.previousElementSibling != null ? function(evt) {
		if (evt.currentTarget.parentNode.parentNode == null) {
			input.parentNode.previousElementSibling.append(document.createElement('br'));
			input.parentNode.previousElementSibling.append(evt.currentTarget.parentNode);
		}
		fillCoverInfo(evt.currentTarget);
	} : function(evt) {
		if (evt.currentTarget.parentNode.parentNode == null) document.body.append(evt.currentTarget.parentNode);
		setTimeout(div => { div.style.opacity = 1 }, 0, evt.currentTarget.parentNode);
		evt.currentTarget.parentNode.hTimer = setTimeout(cleanUp, 12000, evt.currentTarget.parentNode);
		fillCoverInfo(evt.currentTarget);
	};
	img.src = imgUrl;

	function fillCoverInfo(target) {
		console.assert(target instanceof HTMLImageElement, 'target instanceof HTMLImageElement');
		let coverSize = document.getElementById('cover-size');
		if (coverSize == null) {
			coverSize = document.createElement('div');
			coverSize.id = 'cover-size';
			coverSize.style = 'width: 100%; color: white; background-color: #4b5a65; text-align: center; font: 8.5pt Verdana, Tahoma, sans-serif;';
			if (isRequestNew || isRequestEdit) coverSize.style.fontSize = '7.5pt';
			target.parentNode.append(coverSize);
		}
		if (!target.naturalWidth || !target.naturalHeight) {  // invalid image
			coverSize.remove();
			return;
		}
		const resolution = target.naturalWidth + '×' + target.naturalHeight;
		(size instanceof Promise ? size : size > 0 ? Promise.resolve(size) : getRemoteFileSize(this.src)).then(size => {
			if (size > prefs.image_size_warning * 2**10)
				coverSize.innerHTML = resolution + ' (<strong style="color: #ff4c4c;">' + formattedSize(size) + '</strong>)';
			else coverSize.innerText = resolution + ' (' + formattedSize(size) + ')';
		}, reason => { coverSize.textContent = resolution });
	}
}

function reInParenthesis(expr) { return new RegExp('\\s+\\([^\\(\\)]*' + expr + '[^\\(\\)]*\\)$', 'i') }
function reInBrackets(expr) { return new RegExp('\\s+\\[[^\\[\\]]*' + expr + '[^\\[\\]]*\\]$', 'i') }

function notMonospaced(str) {
	if (!str || typeof str != 'string') return false;
	return /[\u0080-\u009F]/.test(str)
	// 	|| /[\u0000-\u001F]/.test(str) // Control character
	// 	|| /[\u0020-\u007F]/.test(str) // Basic Latin
	// 	|| /[\u0080-\u00FF]/.test(str) // Latin-1 Supplement
	// 	|| /[\u0100-\u017F]/.test(str) // Latin Extended-A
	// 	|| /[\u0180-\u024F]/.test(str) // Latin Extended-B
	// 	|| /[\u0250-\u02AF]/.test(str) // IPA Extensions
	|| /[\u02B0-\u02FF]/.test(str) // Spacing Modifier Letters
	|| /[\u0300-\u036F]/.test(str) // Combining Diacritical Marks
	|| /[\u0370-\u03FF]/.test(str) // Greek and Coptic
	|| /[\u0400-\u04FF]/.test(str) // Cyrillic
	|| /[\u0500-\u052F]/.test(str) // Cyrillic Supplement
	|| /[\u0530-\u058F]/.test(str) // Armenian
	|| /[\u0590-\u05FF]/.test(str) // Hebrew
	|| /[\u0600-\u06FF]/.test(str) // Arabic
	|| /[\u0700-\u074F]/.test(str) // Syriac
	|| /[\u0750-\u077F]/.test(str) // Arabic Supplement
	|| /[\u0780-\u07BF]/.test(str) // Thaana
	|| /[\u07C0-\u07FF]/.test(str) // NKo
	|| /[\u0800-\u083F]/.test(str) // Samaritan
	|| /[\u0840-\u085F]/.test(str) // Mandaic
	|| /[\u0860-\u086F]/.test(str) // Syriac Supplement
	|| /[\u08A0-\u08FF]/.test(str) // Arabic Extended-A
	|| /[\u0900-\u097F]/.test(str) // Devanagari
	|| /[\u0980-\u09FF]/.test(str) // Bengali
	|| /[\u0A00-\u0A7F]/.test(str) // Gurmukhi
	|| /[\u0A80-\u0AFF]/.test(str) // Gujarati
	|| /[\u0B00-\u0B7F]/.test(str) // Oriya
	|| /[\u0B80-\u0BFF]/.test(str) // Tamil
	|| /[\u0C00-\u0C7F]/.test(str) // Telugu
	|| /[\u0C80-\u0CFF]/.test(str) // Kannada
	|| /[\u0D00-\u0D7F]/.test(str) // Malayalam
	|| /[\u0D80-\u0DFF]/.test(str) // Sinhala
	|| /[\u0E00-\u0E7F]/.test(str) // Thai
	|| /[\u0E80-\u0EFF]/.test(str) // Lao
	|| /[\u0F00-\u0FFF]/.test(str) // Tibetan
	|| /[\u1000-\u109F]/.test(str) // Myanmar
	|| /[\u10A0-\u10FF]/.test(str) // Georgian
	|| /[\u1100-\u11FF]/.test(str) // Hangul Jamo
	|| /[\u1200-\u137F]/.test(str) // Ethiopic
	|| /[\u1380-\u139F]/.test(str) // Ethiopic Supplement
	|| /[\u13A0-\u13FF]/.test(str) // Cherokee
	|| /[\u1400-\u167F]/.test(str) // Unified Canadian Aboriginal Syllabics
	|| /[\u1680-\u169F]/.test(str) // Ogham
	|| /[\u16A0-\u16FF]/.test(str) // Runic
	|| /[\u1700-\u171F]/.test(str) // Tagalog
	|| /[\u1720-\u173F]/.test(str) // Hanunoo
	|| /[\u1740-\u175F]/.test(str) // Buhid
	|| /[\u1760-\u177F]/.test(str) // Tagbanwa
	|| /[\u1780-\u17FF]/.test(str) // Khmer
	|| /[\u1800-\u18AF]/.test(str) // Mongolian
	|| /[\u18B0-\u18FF]/.test(str) // Unified Canadian Aboriginal Syllabics Extended
	|| /[\u1900-\u194F]/.test(str) // Limbu
	|| /[\u1950-\u197F]/.test(str) // Tai Le
	|| /[\u1980-\u19DF]/.test(str) // New Tai Lue
	|| /[\u19E0-\u19FF]/.test(str) // Khmer Symbols
	|| /[\u1A00-\u1A1F]/.test(str) // Buginese
	|| /[\u1A20-\u1AAF]/.test(str) // Tai Tham
	|| /[\u1AB0-\u1AFF]/.test(str) // Combining Diacritical Marks Extended
	|| /[\u1B00-\u1B7F]/.test(str) // Balinese
	|| /[\u1B80-\u1BBF]/.test(str) // Sundanese
	|| /[\u1BC0-\u1BFF]/.test(str) // Batak
	|| /[\u1C00-\u1C4F]/.test(str) // Lepcha
	|| /[\u1C50-\u1C7F]/.test(str) // Ol Chiki
	|| /[\u1C80-\u1C8F]/.test(str) // Cyrillic Extended C
	|| /[\u1CC0-\u1CCF]/.test(str) // Sundanese Supplement
	|| /[\u1CD0-\u1CFF]/.test(str) // Vedic Extensions
	|| /[\u1D00-\u1D7F]/.test(str) // Phonetic Extensions
	|| /[\u1D80-\u1DBF]/.test(str) // Phonetic Extensions Supplement
	|| /[\u1DC0-\u1DFF]/.test(str) // Combining Diacritical Marks Supplement
	// 	|| /[\u1E00-\u1EFF]/.test(str) // Latin Extended Additional
	|| /[\u1F00-\u1FFF]/.test(str) // Greek Extended
	|| /[\u200B-\u200F\u2028\u2029\u203B\u202A-\u202E\u2060-\u206F]/.test(str)
	//|| /[\u2000-\u206F]/.test(str) // General Punctuation
	|| /[\u2070-\u209F]/.test(str) // Superscripts and Subscripts
	// 	|| /[\u20A0-\u20CF]/.test(str) // Currency Symbols
	|| /[\u20D0-\u20FF]/.test(str) // Combining Diacritical Marks for Symbols
	// 	|| /[\u2100-\u214F]/.test(str) // Letterlike Symbols
	|| /[\u2150-\u218F]/.test(str) // Number Forms
	// 	|| /[\u2190-\u21FF]/.test(str) // Arrows
	|| /[\u2200-\u22FF]/.test(str) // Mathematical Operators
	|| /[\u2300-\u23FF]/.test(str) // Miscellaneous Technical
	|| /[\u2400-\u243F]/.test(str) // Control Pictures
	// 	|| /[\u2440-\u245F]/.test(str) // Optical Character Recognition
	|| /[\u2460-\u24FF]/.test(str) // Enclosed Alphanumerics
	|| /[\u2500-\u257F]/.test(str) // Box Drawing
	// 	|| /[\u2580-\u259F]/.test(str) // Block Elements
	|| /[\u25A0-\u25FF]/.test(str) // Geometric Shapes
	|| /[\u2600-\u26FF]/.test(str) // Miscellaneous Symbols
	|| /[\u2700-\u27BF]/.test(str) // Dingbats
	|| /[\u27C0-\u27EF]/.test(str) // Miscellaneous Mathematical Symbols-A
	|| /[\u27F0-\u27FF]/.test(str) // Supplemental Arrows-A
	|| /[\u2800-\u28FF]/.test(str) // Braille Patterns
	|| /[\u2900-\u297F]/.test(str) // Supplemental Arrows-B
	// 	|| /[\u2980-\u29FF]/.test(str) // Miscellaneous Mathematical Symbols-B
	// 	|| /[\u2A00-\u2AFF]/.test(str) // Supplemental Mathematical Operators
	|| /[\u2B00-\u2BFF]/.test(str) // Miscellaneous Symbols and Arrows
	|| /[\u2C00-\u2C5F]/.test(str) // Glagolitic
	// 	|| /[\u2C60-\u2C7F]/.test(str) // Latin Extended-C
	|| /[\u2C80-\u2CFF]/.test(str) // Coptic
	|| /[\u2D00-\u2D2F]/.test(str) // Georgian Supplement
	|| /[\u2D30-\u2D7F]/.test(str) // Tifinagh
	|| /[\u2D80-\u2DDF]/.test(str) // Ethiopic Extended
	|| /[\u2DE0-\u2DFF]/.test(str) // Cyrillic Extended-A
	|| /[\u2E00-\u2E7F]/.test(str) // Supplemental Punctuation
	|| /[\u2E80-\u2EFF]/.test(str) // CJK Radicals Supplement
	|| /[\u2F00-\u2FDF]/.test(str) // Kangxi Radicals
	|| /[\u2FF0-\u2FFF]/.test(str) // Ideographic Description Characters
	|| /[\u3000-\u303F]/.test(str) // CJK Symbols and Punctuation
	|| /[\u3040-\u309F]/.test(str) // Hiragana
	|| /[\u30A0-\u30FF]/.test(str) // Katakana
	|| /[\u3100-\u312F]/.test(str) // Bopomofo
	|| /[\u3130-\u318F]/.test(str) // Hangul Compatibility Jamo
	|| /[\u3190-\u319F]/.test(str) // Kanbun
	|| /[\u31A0-\u31BF]/.test(str) // Bopomofo Extended
	|| /[\u31C0-\u31EF]/.test(str) // CJK Strokes
	|| /[\u31F0-\u31FF]/.test(str) // Katakana Phonetic Extensions
	|| /[\u3200-\u32FF]/.test(str) // Enclosed CJK Letters and Months
	|| /[\u3300-\u33FF]/.test(str) // CJK Compatibility
	|| /[\u3400-\u4DBF]/.test(str) // CJK Unified Ideographs Extension A
	|| /[\u4DC0-\u4DFF]/.test(str) // Yijing Hexagram Symbols
	|| /[\u4E00-\u9FFF]/.test(str) // CJK Unified Ideographs
	// 	|| /[\uA000-\uA48F]/.test(str) // Yi Syllables
	// 	|| /[\uA490-\uA4CF]/.test(str) // Yi Radicals
	|| /[\uA4D0-\uA4FF]/.test(str) // Lisu
	|| /[\uA500-\uA63F]/.test(str) // Vai
	|| /[\uA640-\uA69F]/.test(str) // Cyrillic Extended-B
	|| /[\uA6A0-\uA6FF]/.test(str) // Bamum
	|| /[\uA700-\uA71F]/.test(str) // Modifier Tone Letters
	|| /[\uA720-\uA7FF]/.test(str) // Latin Extended-D
	|| /[\uA800-\uA82F]/.test(str) // Syloti Nagri
	|| /[\uA830-\uA83F]/.test(str) // Common Indic Number Forms
	|| /[\uA840-\uA87F]/.test(str) // Phags-pa
	|| /[\uA880-\uA8DF]/.test(str) // Saurashtra
	|| /[\uA8E0-\uA8FF]/.test(str) // Devanagari Extended
	|| /[\uA900-\uA92F]/.test(str) // Kayah Li
	|| /[\uA930-\uA95F]/.test(str) // Rejang
	|| /[\uA960-\uA97F]/.test(str) // Hangul Jamo Extended-A
	|| /[\uA980-\uA9DF]/.test(str) // Javanese
	|| /[\uA9E0-\uA9FF]/.test(str) // Myanmar Extended-B
	|| /[\uAA00-\uAA5F]/.test(str) // Cham
	|| /[\uAA60-\uAA7F]/.test(str) // Myanmar Extended-A
	|| /[\uAA80-\uAADF]/.test(str) // Tai Viet
	|| /[\uAAE0-\uAAFF]/.test(str) // Meetei Mayek Extensions
	|| /[\uAB00-\uAB2F]/.test(str) // Ethiopic Extended-A
	// 	|| /[\uAB30-\uAB6F]/.test(str) // Latin Extended-E
	|| /[\uAB70-\uABBF]/.test(str) // Cherokee Supplement
	|| /[\uABC0-\uABFF]/.test(str) // Meetei Mayek
	|| /[\uAC00-\uD7AF]/.test(str) // Hangul Syllables
	|| /[\uD7B0-\uD7FF]/.test(str) // Hangul Jamo Extended-B
	|| /[\uD800-\uDB7F]/.test(str) // High Surrogates
	// 	|| /[\uDB80-\uDBFF]/.test(str) // High Private Use Surrogates
	|| /[\uDC00-\uDFFF]/.test(str) // Low Surrogates
	|| /[\uE000-\uF8FF]/.test(str) // Private Use Area
	|| /[\uF900-\uFAFF]/.test(str) // CJK Compatibility Ideographs
	|| /[\uFB00-\uFB4F]/.test(str) // Alphabetic Presentation Forms
	|| /[\uFB50-\uFDFF]/.test(str) // Arabic Presentation Forms-A
	|| /[\uFE00-\uFE0F]/.test(str) // Variation Selectors
	|| /[\uFE10-\uFE1F]/.test(str) // Vertical Forms
	|| /[\uFE20-\uFE2F]/.test(str) // Combining Half Marks
	|| /[\uFE30-\uFE4F]/.test(str) // CJK Compatibility Forms
	|| /[\uFE50-\uFE6F]/.test(str) // Small Form Variants
	|| /[\uFE70-\uFEFF]/.test(str) // Arabic Presentation Forms-B
	|| /[\uFF00-\uFFEF]/.test(str) // Halfwidth and Fullwidth Forms
	|| /[\uFFF0-\uFFFF]/.test(str) // Specials
	// 	|| /[\u10000-\uFFFFF]/.test(str) // Others
	|| str.includes('⇅');
}

function getSizeFromString(str, returnAs = undefined) {
	if (typeof str != 'string') return 0;
	let matches = /\b(\d+(?:\.\d+)?)\s*([KMGTPEZY]?)I?B\b/.exec(str.replace(',', '.').toUpperCase());
	if (matches == null) return 0;
	const prefixes = Array.from('KMGTPEZY');
	let size = parseFloat(matches[1]);
	let fromIndex = prefixes.indexOf(matches[2]);
	let toIndex = /^([KMGTPEZY]?)(?:i?B)?$/i.test(returnAs) ? prefixes.indexOf(RegExp.$1.toUpperCase()) : 1;
	let result = size * Math.pow(2, (fromIndex - toIndex) * 10);
	return toIndex >= 0 ? result : Math.round(result);
}

function makeTimeString(duration, forceSign = false) {
	let t = Math.abs(Math.round(duration));
	let H = Math.floor(t / 60 ** 2);
	let M = Math.floor(t / 60 % 60);
	let S = t % 60;
	return (duration < 0 ? '-' : duration > 0 && forceSign ? '+' : '') +
		(H > 0 ? H + ':' + M.toString().padStart(2, '0') : M.toString()) + ':' + S.toString().padStart(2, '0');
}

function timeStringToTime(str) {
	if (!/(-\s*)?\b(\d+(?::\d{2})*(?:\.\d+)?)\b/.test(str)) return null;
	let t = 0, a = RegExp.$2.split(':');
	while (a.length > 0) t = t * 60 + parseFloat(a.shift());
	return RegExp.$1 ? -t : t;
}

function extractYear(expr) {
	if (typeof expr == 'number') return Math.round(expr);
	if (typeof expr != 'string') return null;
	let y = /\b(\d{4})\b/.exec(expr);
	y = parseInt(y != null ? y[1] : !isNaN(y = new Date(expr)) ? y.getUTCFullYear() : expr);
	return y >= 1900 ? y : null;
}

function normalizeDate(str, countryCode = undefined) {
	if (!str || typeof str != 'string') return null;
	let match;
	function formatOutput(yearIndex, montHindex, dayIndex) {
		let year = parseInt(match[yearIndex]), month = parseInt(match[montHindex]), day = parseInt(match[dayIndex]);
		if (year < 30) year += 2000; else if (year < 100) year += 1900;
		if (year < 1000 || year > 9999 || month < 1 || month > 12 || day < 0 || day > 31) return null;
		return year.toString() + '-' + month.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0');
	}
	if ((match = /\b(\d{4})-(\d{1,2})-(\d{1,2})\b/.exec(str)) != null) return formatOutput(1, 2, 3); // US, SE
	if ((match = /\b(\d{4})\/(\d{1,2})\/(\d{1,2})\b/.exec(str)) != null) return formatOutput(1, 2, 3);
	if ((match = /\b(\d{1,2})\/(\d{1,2})\/(\d{2})\b/.exec(str)) != null
			&& (parseInt(match[1]) > 12 || /\b(?:be|it|au|nz)\b/i.test(countryCode))) return formatOutput(3, 2, 1); // BE, IT, AU, NZ
	if ((match = /\b(\d{1,2})\/(\d{1,2})\/(\d{2})\b/.exec(str)) != null) return formatOutput(3, 1, 2); // US, MO
	if ((match = /\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/.exec(str)) != null) return formatOutput(3, 2, 1); // UK, IE, FR, ES, FI, DK
	if ((match = /\b(\d{1,2})-(\d{1,2})-((?:\d{2}|\d{4}))\b/.exec(str)) != null) return formatOutput(3, 2, 1); // NL
	if ((match = /\b(\d{1,2})\. *(\d{1,2})\. *(\d{4})\b/.exec(str)) != null) return formatOutput(3, 2, 1); // CZ, DE
	if ((match = /\b(\d{1,2})\. *(\d{1,2})\. *(\d{2})\b/.exec(str)) != null) return formatOutput(3, 2, 1); // AT, CH, DE, LU
	if ((match = /\b(\d{4})\. *(\d{1,2})\. *(\d{1,2})\b/.exec(str)) != null) return formatOutput(1, 2, 3); // JP, KR
	if ((match = /\b(\d{4})(\d{2})(\d{2})\b/.exec(str)) != null) return formatOutput(1, 2, 3);
	if (!isNaN(match = new Date(str))) return match.getUTCFullYear() + '-' +
		(match.getMonth() + 1).toString().padStart(2, '0') + '-' + match.getDate().toString().padStart(2, '0');
	return extractYear(str);
}

function safeText(unsafeText) {
	const div = document.createElement('div');
	div.innerText = unsafeText || '';
	return div.innerHTML;
}

function decodeHTML(html) {
	const textArea = document.createElement("textarea");
	textArea.innerHTML = html;
	return textArea.value;
}

function convertToRoman(num) {
	const roman = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
	let str = '';
	for (let l of Object.keys(roman)) {
		let q = Math.floor(num / roman[l]);
		num -= q * roman[l];
		str += l.repeat(q);
	}
	return str;
}

const safeRehostSingleImage = imageUrl => imageHosts.rehostImages([imageUrl]).then(singleImageGetter, function(reason) {
	if (isRED && imageUrl.includes('.img2go.com/dl/')) {
		const logElem = addMessage('attempting to store downsized image to one of fallback hosts...', 'info');
		return forcedRehost(imageUrl).then(function(imageURL) {
			if (logElem) logElem.textContent += 'success';
			return imageURL;
		});
	}
	return Promise.reject(reason);
});

function inputDataHandler(evt, data) {
	const input = evt.currentTarget;
	console.assert(input instanceof HTMLInputElement, 'input instanceof HTMLInputElement');

	function rehoster(imageUrl) {
		if (!prefs.auto_rehost_cover && !isNWCD) return Promise.resolve(imageUrl);
		input.disabled = true;
		return safeRehostSingleImage(imageUrl).then(function(imageUrl) {
			if (imageUrl == null) throw 'invalid image';
			input.value = imageUrl;
		}).catch(function(reason) {
			if (!isNWCD) input.value = imageUrl;
			Promise.resolve(reason).then(msg => { alert(msg + ' (not rehosted)') });
		}).then(() => { input.disabled = false });
	}

	if (!data) return true;
	if (data.files.length > 0) {
		if (data.files[0].type && !data.files[0].type.startsWith('image/')) return true;
		input.disabled = true;
		if (input.hTimer) {
			clearTimeout(input.hTimer);
			delete input.hTimer;
		}
		input.style.color = 'white';
		input.style.backgroundColor = 'darkred';
		let progressBar = { };
		function progressHandler(worker, param = null) {
			if (param && typeof param == 'object') {
				if (param.readyState > 1 || progressBar.current != undefined && worker !== progressBar.current
						|| Date.now() < progressBar.lastUpdate + 100) return;
				let pct = Math.floor(Math.min(param.done * 100 / param.total, 100));
				if (pct <= progressBar.lastPct) return;
				input.value = 'Uploading... [' + (progressBar.lastPct = pct) + '%]';
				progressBar.lastUpdate = Date.now();
			} else if (param == null) {
				progressBar = { current: worker };
				input.value = 'Uploading...';
			}
		}
		let file = data.files[0];
		checkImageSize(file, input, progressHandler).catch(reason => file).then(function(result) {
			if (httpParser.test(result)) return rehoster(result);
			if (result instanceof File) return imageHosts.uploadImages([result], progressHandler).then(singleImageGetter).then(function(imgUrl) {
				input.value = imgUrl;
				coverPreview(input, imgUrl, file.size);
			});
			console.warn('invalid checkImageSize result:', result);
			return Promise.reject('invalid upload result');
		}).then(function() {
			input.style.backgroundColor = '#008000';
			input.hTimer = setTimeout(function() {
				input.style.backgroundColor = null;
				input.style.color = null;
				delete input.hTimer;
			}, 10000);
		}, function(reason) {
			inputClear(evt);
			input.style.backgroundColor = null;
			input.style.color = null;
			Promise.resolve(reason).then(msg => { alert(msg) });
		}).then(() => { input.disabled = false });
		return false;
	} else if (data.items.length > 0) {
		let links = data.getData('text/uri-list');
		if (links) links = links.split(/\r?\n/); else {
			links = data.getData('text/x-moz-url');
			if (links) links = links.split(/\r?\n/).filter((item, ndx) => ndx % 2 == 0);
				else if (links = data.getData('text/plain')) links = links.split(/\r?\n/);
		}
		if (!Array.isArray(links) || links.length <= 0) return true;
		input.disabled = true;
		console.time('Image URL Rehoster');
		imageUrlResolver(links[0], {
			altKey: evt.altKey,
			ctrlKey: evt.ctrlKey,
			shiftKey: evt.shiftKey,
		}).then(verifyImageUrl).then(function(imageUrl) {
			if (!isNWCD) input.value = imageUrl;
			const size = getRemoteFileSize(imageUrl);
			coverPreview(input, imageUrl, size);
			return checkImageSize(imageUrl, input, size).then(rehoster).then(() => { console.timeEnd('Image URL Rehoster') });
		}).catch(reason => { Promise.resolve(reason).then(alert) }).then(() => { input.disabled = false });
		return false;
	}
	return true;
}

function textAreaDropHandler(evt) {
	if (!evt.dataTransfer || evt.shiftKey) return true;
	const textArea = evt.currentTarget;
	console.assert(textArea instanceof HTMLTextAreaElement, 'textArea instanceof HTMLTextAreaElement');
	if (evt.dataTransfer.files.length > 0) {
		let images = [ ];
		Array.from(evt.dataTransfer.files).forEach(function(file) {
			switch (file.type) {
				case '':
					if (!['log'/*, 'nfo'*/].some(ext => file.name.toLowerCase().endsWith('.' + ext))) break;
				case 'text/plain':
					//case 'text/nfo': // malformed encoding
				case 'text/log':
					textArea.disabled = true;
					file.getText(file.name.toLowerCase().endsWith('.nfo') ? 'ibm850' : 'utf-8').then(function(text) {
						let isDR = file.name.endsWith('foo_dr.txt') && /^(?:Official DR value):\s*(?:DR(\d+))\b/m.test(text)
							|| file.name.endsWith('_log.txt') && /^(?:Official EP\/Album DR): (\d+)\b/m.test(text);
						if (isDR) var DR = parseInt(RegExp.$1);
						let tag = isDR || file.name.toLowerCase().endsWith('.nfo') ? 'pre' : 'code';
						let php = ('[' + tag + ']' + text + '[/' + tag + ']').bbHide(isDR ? 'DR' + RegExp.$1 : file.name);
						if (textArea.value.length <= 0) textArea.value = php; else if (evt.ctrlKey) {
							textArea.value = textArea.value.slice(0, evt.rangeOffset) +
								php + textArea.value.slice(evt.rangeOffset);
						} else if (isDR && /\[hide=DR\d*\]\[pre\]\[\/pre\]/i.test(textArea.value)) {
							textArea.value = RegExp.leftContext + php.slice(0, -7) + RegExp.rightContext;
						} else if (isDR && /\[hide=DR(\d*)\]((?:\[pre\](foobar2000[\s\S]+?)^\[\/pre\]\s*)+)(?:\[pre\]\[\/pre\])?/im.test(evt.target.value)) {
							php = '[hide=DR';
							if (parseInt(RegExp.$1) == DR) php += RegExp.$1;
							textArea.value = `${RegExp.leftContext}${php}]${RegExp.$2.trim()}\n${text.bbPre()}${RegExp.rightContext}`;
						} else if (!isDR && /\[hide\](?:\[code\]\[\/code\])?\[\/hide\]/i.test(textArea.value)) {
							textArea.value = RegExp.leftContext + php + RegExp.rightContext;
						} else if (!isDR && /(\[hide=[^\]]+\])(?:\[code\]\[\/code\])?(\[\/hide\])/i.test(textArea.value)) {
							textArea.value = `${RegExp.leftContext}${RegExp.$1}${text.bbCode()}${RegExp.$2}${RegExp.rightContext}`;
						} else textArea.value += '\n\n' + php;
					}).catch(function(e) { alert(e) }).then(function() {
						if (!textArea.style.background) textArea.disabled = false;
					});
					break;
				default:
					if (file.type && file.type.startsWith('image/')) images.push(file);
			}
		});
		if (images.length > 0) {
			textArea.disabled = true;
			if (!isNWCD) var progressBar = new ULProgressBar(textArea, images.map(image => image.size));
			imageHosts.uploadImages(images, ULProgressBar.prototype.update.bind(progressBar))
				.then(urlHandler.bind({ tag: 'img' }))
				.catch(reason => { Promise.resolve(reason).then(msg => { alert(msg) }) })
				.then(function() {
					ULProgressBar.prototype.cleanUp.call(progressBar);
					textArea.disabled = false;
				});
		}
		evt.stopPropagation();
		return false;
	} else if (evt.dataTransfer.items.length > 0) {
		let content = evt.dataTransfer.getData('text/uri-list');
		if (content) content = content.split(/\r?\n/); else {
			content = evt.dataTransfer.getData('text/x-moz-url');
			if (content) content = content.split(/\r?\n/).filter((item, ndx) => ndx % 2 == 0);
		};
		if (Array.isArray(content) && content.length > 0) {
			console.time('Image URL Resolver');
			Promise.all(content.map(url => imageUrlResolver(url, { ctrlKey: !evt.ctrlKey }))).then(function(resolved) {
				let resolvedUrls = resolved.flatten();
				if (prefs.auto_rehost_cover || isNWCD) {
					textArea.disabled = true;
					if (resolvedUrls.length > 1 && !isNWCD) {
						progressBar = new RHProgressBar(textArea, resolvedUrls.length);
						progressBar.update(0, false);
					}
					imageHosts.rehostImages(resolvedUrls, progressBar ? (param = true) => progressBar.update(0, param) : null).catch(function(reason) {
						addMessage(reason + ' (not rehosted)', 'warning');
						RHProgressBar.prototype.update.call(progressBar, -1, false);
						return verifyImageUrls(resolvedUrls);
					}).then(results => { urlHandler.bind({ tag: 'img' })(results, arrayGrouping(resolved).flatten()) })
					.catch(reason => { Promise.resolve(reason).then(msg => { alert(msg) }) }).then(function() {
						RHProgressBar.prototype.cleanUp.call(progressBar);
						textArea.disabled = false;
						console.timeEnd('Image URL Resolver');
					});
				} else urlHandler.bind({ tag: 'img' })(resolvedUrls, arrayGrouping(resolved).flatten());
			}).catch(function(e) {
				let as = domParser.parseFromString(evt.dataTransfer.getData('text/html'), 'text/html').body.querySelectorAll('a');
				Promise.all(content.map(urlResolver))
					.then(resolved => urlHandler.bind({ tag: 'url', titles: Array.from(as).map(a => a.textContent.trim()) })(resolved.flatten()));
			});
		} else if (content = evt.dataTransfer.getData('text/html')) {
			insert(html2php(domParser.parseFromString(content, 'text/html')).collapseGaps());
		} else if (content = evt.dataTransfer.getData('text/plain')) {
			insert(content);
		}
		evt.stopPropagation();
		return false;
	}
	return true;

	function urlHandler(results, groups = undefined) {
		if (typeof this.tag != 'string' || this.tag.length <= 0) throw 'Invalid argument';
		const tagName = this.tag.toLowerCase(), rx = new RegExp('\\[' + tagName + '\\]\\[\\/' + tagName + '\\]', 'i');
		let phpBB = '';
		results.forEach((result, index) => {
			if (tagName == 'img') {
				var thumb = evt.altKey && !textArea.noPhpBB && typeof result == 'object'
					&& httpParser.test(result.original) && httpParser.test(result.thumb);
				if (typeof result == 'object' && result.original) var url = result.original;
					else if (typeof result == 'string') url = result;
						else throw 'Invalid result format';
			} else if (result.length > 0 && httpParser.test(result)) url = result; else return;
			if (thumb) var _phpBB = ('[' + tagName + ']' + result.thumb + '[/' + tagName + ']').bbUrl(url); else {
				_phpBB = '[' + tagName;
				_phpBB += Array.isArray(this.titles) && this.titles[index] ? '=' + url + ']' + this.titles[index] : ']' + url;
				_phpBB += '[/' + tagName + ']';
			}
			if (rx.test(textArea.value)) textArea.value = RegExp.leftContext + _phpBB + RegExp.rightContext; else {
				if (index > 0) phpBB += isGroupBoundary(groups, index) ? thumb ? '\n' : '\n\n' : thumb ? ' ' : '\n';
				phpBB += textArea.noPhpBB ? url : _phpBB;
			}
		});
		insert(phpBB);
	}

	function insert(phpBB) {
		if (typeof phpBB != 'string' || phpBB.length <= 0) return;
		if (textArea.value.trimRight().length <= 0) textArea.value = phpBB; else if (evt.ctrlKey) {
			textArea.value = textArea.value.slice(0, evt.rangeOffset) + phpBB + textArea.value.slice(evt.rangeOffset);
		} else textArea.value = textArea.value.trimRight() + /*ndx <= 0 ? '\n\n' : */'\n\n' + phpBB;
	}
}

function textAreaPasteHandler(evt) {
	if (!evt.clipboardData) return true;
	const textArea = evt.currentTarget;
	console.assert(textArea instanceof HTMLTextAreaElement, 'textArea instanceof HTMLTextAreaElement');
	if (evt.clipboardData.files.length > 0) {
		let images = Array.from(evt.clipboardData.files).filter(file => file.type && file.type.startsWith('image/'));
		if (images.length <= 0) return true;
		textArea.disabled = true;
		if (!isNWCD) var progressBar = new ULProgressBar(textArea, images.map(image => image.size));
		imageHosts.uploadImages(images, ULProgressBar.prototype.update.bind(progressBar)).then(function(results) {
			let phpBB = '';
			results.forEach(function(result, index) {
				let thumb = evt.altKey && !textArea.noPhpBB && typeof result == 'object'
				&& httpParser.test(result.original) && httpParser.test(result.thumb);
				if (typeof result == 'object' && result.original) var imgUrl = result.original;
					else if (typeof result == 'string') imgUrl = result;
						else throw 'Invalid result format';
				if (index > 0) phpBB += thumb ? ' ' : '\n';
				phpBB += textArea.noPhpBB ? imgUrl : !thumb ? imgUrl.bbImg() : result.thumb.bbImg().bbUrl(imgUrl);
			});
			insert(phpBB);
		}).catch(reason => { Promise.resolve(reason).then(msg => { alert(msg) }) }).then(function() {
			ULProgressBar.prototype.cleanUp.call(progressBar);
			textArea.disabled = false;
		});
		evt.stopPropagation();
		return false;
	} else if (evt.clipboardData.items.length > 0) {
		let content = evt.clipboardData.getData('text/html');
		if (!content) return true;
		insert(html2php(domParser.parseFromString(content, 'text/html')).collapseGaps());
		return false;
	}
	return true;

	function insert(phpBB) {
		if (typeof phpBB != 'string' || phpBB.length <= 0) return;
		let selStart = textArea.selectionStart;
		textArea.value = textArea.value.slice(0, selStart) + phpBB + textArea.value.slice(textArea.selectionEnd);
		textArea.setSelectionRange(selStart + phpBB.length, selStart + phpBB.length);
	}
}

function arrayGrouping(arr) {
	return Array.isArray(arr) ? arr.map(function(elem) {
		if (!Array.isArray(elem)) return 1;
		return elem.every(elem => !Array.isArray(elem)) ? elem.length : arrayGrouping(elem);
	}) : null;
}
function isGroupBoundary(groups, index) {
	return index > 0 && Array.isArray(groups)
	&& groups.some((len, ndx, arr) => index == arr.slice(0, ndx).reduce((acc, len) => acc + len, 0));
}

function uaInsert(evt) {
	evt.currentTarget.style.backgroundColor = null;
	if ((!evt.clipboardData || evt.clipboardData.items.length <= 0)
			&& (!evt.dataTransfer || evt.dataTransfer.items.length <= 0)) return;
	evt.currentTarget.value = '';
	if (prefs.autfill_delay > 0) {
		if (autoFill) clearTimeout(autoFill);
		autoFill = setTimeout(fillFromText, prefs.autfill_delay, evt);
	}
}

// Firefox accepts dropped playlist in malformed form, try to detect and correct it
function fixFirefoxDropBug(evt) {
	if (evt.target == null || evt.target.value.length <= 0) return;
	const tl = (Math.sqrt(4 * evt.target.value.split('\n').length - 3) + 1) / 2;
	if (tl < 2 || tl != Math.floor(tl) || evt.target.value.length % tl != 0) return;
	const l = evt.target.value.length / tl, s = evt.target.value.slice(0, l);
	for (let i = 1; i < tl; ++i) if (evt.target.value.slice(i * l, (i + 1) * l) != s) return;
	evt.target.value = s;
}

function clear0(evt) { if (evt.target.value.length > 0) evt.target.value = '' } // TODO: filterout unrelated content
function clear1(evt) { if (evt.buttons == 4) clear0(evt) }
function voidDragHandler1(evt) {
	return !evt.dataTransfer.types.includes('Files') || evt.target.tagName == 'TEXTAREA'
		|| evt.target.tagName == 'INPUT' && evt.target.type == 'file'
}

function removeRedirect(uri) {
	return typeof uri != 'string' ? null : [
		'www.anonymz.com/?', 'www.anonymz.com?',
		'anonymz.com/?', 'anonymz.com?',
		'anonym.to/?', 'anonym.to?',
		'dereferer.me/?',
		'reho.st/',
	].reduce(function(acc, it) {
		if (acc.toLowerCase().startsWith('https://' + it)) return acc.slice(it.length + 8);
		if (acc.toLowerCase().startsWith('http://' + it)) return acc.slice(it.length + 7);
		return acc;
	}, uri);
}

function imageUrlResolver(url, modifiers = { }) {
	return urlResolver(url).then(url => verifyImageUrl(url).catch(function(reason) {
		if (/^HTTP error (\d+)\b/.test(reason) && [
			401, 402, 404, 407, 408, 410, 451,
			502, 503, 504, 511,
		].includes(parseInt(RegExp.$1)) || /\b(?:timeout|timed out)\b/.test(reason)) return Promise.reject(reason);
		const notFound = Promise.reject('No title image for this URL');
		function getFromMeta(document) {
			const meta = document instanceof Document ? [
				'meta[property="og:image:secure_url"][content]',
				'meta[property="og:image"][content]',
				'meta[property="image"][content]',
				'meta[name="og:image"][content]',
				'meta[name="image"][content]',
				'meta[itemprop="og:image"][content]',
				'meta[itemprop="image"][content]',
			].reduce((elem, selector) => elem || document.querySelector(selector), null) : null;
			return meta != null && httpParser.test(meta.content) ? meta.content : undefined;
		}

		try { url = new URL(url) } catch(e) { return Promise.reject(e) }
		if (url.hostname.endsWith('pinterest.com'))
			return pinterestResolver(url);
		else if (url.hostname.endsWith('free-picload.com')) {
			if (url.pathname.startsWith('/album/')) return cheveretoGalleryResolver('free-picload.com', url);
		} else if (url.hostname.endsWith('bandcamp.com')) return globalXHR(url).then(function({document}) {
			let ref = document.querySelector('div#tralbumArt > a.popupImage');
			ref = ref != null ? ref.href : getFromMeta(document);
			return ref ? Promise.resolve(ref.replace(/_\d+(?=\.\w+$)/, '_0')) : notFound;
		}); else if (url.hostname.endsWith('7digital.com') && url.pathname.startsWith('/artist/'))
			return globalXHR(url).then(function({document}) {
				let img = document.querySelector('img[itemprop="image"]');
				return img != null ? img.src : notFound;
			});
		else if (url.hostname.endsWith('geekpic.net')) return globalXHR(url).then(function({document}) {
			let a = document.querySelector('div.img-upload > a.mb');
			return a != null ? a.href : notFound;
		}); else if (url.hostname.endsWith('qq.com') && /\/album(?:Detail)?\/(\w+)/i.test(url.pathname)) return globalXHR(url).then(function({document}) {
			for (let script of document.body.querySelectorAll(':scope > script'))
				if ((script = /\b__INITIAL_DATA__\s*=\s*({.+})/.exec(script.text)) != null)
					try { var initialData = eval('(' + script[1] + ')') } catch(e) { console.warn(e) }
			if (!initialData) throw 'Assertion failed: __INITIAL_DATA__ not triggered';
			if (initialData = initialData.detail.picurl) {
				if (!httpParser.test(initialData)) initialData = url.protocol + initialData;
				return initialData.replace(/\/(T\d+)?(R\d+x\d+)?(M\w+?)(_\d+)?\.(\w+(?:\.\w+)*)(\?.*)?$/, '/$1$3.$5');
			} else return notFound;
		}); else if (url.hostname.startsWith('books.google.') && url.pathname.startsWith('/books')) return globalXHR(url).then(function({document}) {
			let meta = getFromMeta(document);
			return meta != null ? meta.replace(/\b(?:zoom=1)\b/, 'zoom=0') : notFound;
		}); else if (/^(?:\w+\.)?amazon(?:\.\w+)+$/.test(url.hostname)) return getAmazonCfg(url).then(function(amazonCfg) {
			return globalXHR(amazonCfg.urlBase + 'api/showHome', { responseType: 'json', headers: amazonCfg.headers }, {
				deeplink: JSON.stringify({
					interface: 'DeeplinkInterface.v1_0.DeeplinkClientInformation',
					deeplink: '/' + url.pathname.split('/').filter(Boolean).slice(-2).join('/'),
				}),
			}).then(function({response}) {
				if (prefs.diag_mode) console.debug('Amazon response:', response);
				const method = response.methods.find(method => method.interface.endsWith('CreateAndBindTemplateMethod'));
				return method && method.template && method.template.headerImage || notFound;
			});
		}).catch(reason => globalXHR(url).then(function(response) {
			const getFullImage = imageUrl => httpParser.test(imageUrl)
				&& (imageUrl = imageUrl.replace(/\._\w+(?:_\w+)*_\./, '.'), !['31CTP6oiIBL.jpg', '31zMd62JpyL.jpg']
				.some(path => imageUrl.endsWith('/images/I/' + path))) ? imageUrl : Promise.reject('Dummy image (placeholder)');
			const getImgOrigin = colorImage => getFullImage(colorImage.hiRes || colorImage.large || colorImage.thumb);
			let obj = /^\s*(?:var\s+obj\s*=\s*jQuery\.parseJSON)\('(\{.+\})'\);/m.exec(response.responseText);
			if (obj != null) {
				try { obj = JSON.parse(obj[1]) } catch(e) { try { obj = eval('(' + obj[1] + ')') } catch(e) { obj = { } } }
				let variants = Object.keys(obj.colorImages);
				if (variants.length > 0) return Promise.all(variants.map(key =>
					Promise.all(obj.colorImages[key].map(getImgOrigin))));
			}
			let colorImages = /^\s*'colorImages':\s*(\{.+\}),?$/m.exec(response.responseText);
			if (colorImages != null) {
				try { colorImages = JSON.parse(colorImages[1].replace(/'/g, '"')) }
				catch(e) { try { colorImages = eval('(' + colorImages[1] + ')') } catch(e) { colorImages = { } } }
				if (Array.isArray(colorImages.initial) && colorImages.initial.length > 0)
					return Promise.all(colorImages.initial.map(getImgOrigin));
			}
			let img = ['div#ppd-left img', 'img#igImage', 'img#imgBlkFront']
				.reduce((acc, sel) => acc || response.document.querySelector(sel), null);
			if (img == null) return notFound;
			if (img.dataset.aDynamicImage) try {
				let imgUrl = Object.keys(JSON.parse(img.dataset.aDynamicImage))[0];
				if (httpParser.test(imgUrl)) return getFullImage(imgUrl);
			} catch(e) { }
			return getFullImage(img.src);
		})); else switch (url.hostname) {
			// general image hostings
			case 'www.imgur.com': case 'imgur.com': {
				let shareId = /^\/(?:(a)\/)?(\w+)\b/.exec(url.pathname);
				return shareId != null ? imageHostHandlers.imgur.setSession().then(clientId => globalXHR('https://api.imgur.com/post/v1/' + (shareId[1] == 'a' ? 'albums' : 'media') + '/' + shareId[2] + '?' + new URLSearchParams({
					client_id: clientId,
					include: 'media',
				}).toString(), { responseType: 'json' }).then(({response}) => response.media.map(media => media.url))).catch(reason => globalXHR(url, { responseType: 'text' }).then(function({responseText}) {
					let image = /^\s*(?:image)\s*:\s*(\{.+\}),\s*$/m.exec(responseText);
					if (image != null) try {
						return JSON.parse(image[1]).album_images.images.map(image => 'https://i.imgur.com/' + image.hash + image.ext);
					} catch(e) { console.warn(e) }
					return notFound;
				})) : globalXHR(url).then(function({document}) {
					let link = document.querySelector('link[rel="image_src"]');
					return link != null ? link.href : notFound;
				});
			}
			case 'pixhost.to':
				if (url.pathname.startsWith('/gallery/')) return globalXHR(url).then(({document}) =>
					Promise.all(Array.from(document.querySelectorAll('div.images > a')).map(a => imageUrlResolver(a.href, modifiers))));
				if (url.pathname.startsWith('/show/')) return globalXHR(url)
					.then(({document}) => document.querySelector('img#image').src);
				break;
			case 'malzo.com':
				if (url.pathname.startsWith('/al/')) return cheveretoGalleryResolver('malzo.com', url); else break;
			case 'imgbb.com': case 'ibb.co':
				if (url.pathname.startsWith('/album/')) return cheveretoGalleryResolver('imgbb.com', url); else break;
			case 'jerking.empornium.ph':
				if (url.pathname.startsWith('/album/')) return cheveretoGalleryResolver('jerking.empornium.ph', url); else break;
			case 'imgbox.com':
				if (url.pathname.startsWith('/g/')) return globalXHR(url).then(({document}) =>
					Promise.all(Array.from(document.querySelectorAll('div#gallery-view-content > a'))
						.map(a => imageUrlResolver('https://imgbox.com' + a.pathname, modifiers))));
				break;
			case 'postimage.org': case 'postimg.cc':
				if (url.pathname.startsWith('/gallery/'))
					return PostImage.resultsHandler(url).then(results => results.map(result => result.original));
				return globalXHR(url).then(function({document}) {
					const elem = document.body.querySelector('a#download');
					return elem != null ? elem.href : getFromMeta(document.head) || notFound;
				});
			case 'www.imagevenue.com': case 'imagevenue.com':
				return globalXHR(url, { headers: { Referer: 'http://www.imagevenue.com/' } }).then(function({document}) {
					let images = Array.from(document.querySelectorAll('div.card img')).map(function(img) {
						return img.src.includes('://cdn-images') ? Promise.resolve(img.src)
							: imageUrlResolver(img.parentNode.href, modifiers);
					});
					return images.length > 1 ? Promise.all(images) : images.length == 1 ? images[0] : notFound;
				});
			case 'www.imageshack.us': case 'imageshack.us':
				return globalXHR(url).then(({document}) => document.querySelector('a#share-dl').href);
			case 'www.flickr.com': case 'flickr.com':
				if (url.pathname.startsWith('/photos/')) return globalXHR(url, { responseType: 'text' }).then(function({responseText}) {
					if (/\b(?:modelExport)\s*:\s*(\{.+\}),/.test(responseText)) try {
						let urls = JSON.parse(RegExp.$1).main['photo-models'].map(function(photoModel) {
							let sizes = Object.keys(photoModel.sizes).sort((a, b) => photoModel.sizes[b].width *
								photoModel.sizes[b].height - photoModel.sizes[a].width * photoModel.sizes[a].height);
							return sizes.length > 0 ? 'https:'.concat(photoModel.sizes[sizes[0]].url) : null;
						});
						if (urls.length == 1) return urls[0]; else if (urls.length > 1) return urls;
					} catch(e) { console.warn(e) }
					return notFound;
				}); else break;
			case 'photos.google.com':
				return googlePhotosResolver(url);
			case 'www.500px.com': case 'web.500px.com': case '500px.com':
				if (/^\/photo\/(\d+)\b/i.test(url.pathname))
					return _500pxUrlHandler('photos?ids='.concat(RegExp.$1));
				else if (/\/galleries\/([\w\%\-]+)/i.test(url.pathname)) {
					let galleryId = RegExp.$1;
					return globalXHR(url, { rsponseType: 'text' }).then(function({responseText}) {
						if (!/\b(?:App\.CuratorId)\s*=\s*"(\d+)"/.test(responseText)) return Promise.reject('Unexpected page structure');
						return _500pxUrlHandler('users/' + RegExp.$1 + '/galleries/' + galleryId + '/items?sort=position&sort_direction=asc&rpp=999');
					});
				} else break;
			case 'www.pxhere.com': case 'pxhere.com':
				if (url.pathname.includes('/photo/')) return globalXHR(url).then(({document}) =>
					JSON.parse(document.querySelector('div.hub-media-content > script[type="application/ld+json"]').text).contentUrl);
						else if (url.pathname.includes('/collection/')) return pxhereCollectionResolver(url);
				break;
			case 'www.unsplash.com': case 'unsplash.com':
				if (url.pathname.startsWith('/photos/')) return globalXHR(url.origin + url.pathname + '/download', { method: 'HEAD' })
					.then(response => response.finalUrl.replace(/\?.*$/, ''));
						else if (url.pathname.includes('/collections/')) return unsplashCollectionResolver(url);
				break;
			case 'www.pexels.com': case 'pexels.com':
				if (url.pathname.startsWith('/photo/')) return globalXHR(url)
					.then(({document}) => document.querySelector('meta[property="og:image"][content]').content.replace(/\?.*$/, ''));
						else if (url.pathname.startsWith('/collections/')) return pexelsCollectionResolver(url);
				break;
			case 'www.piwigo.org': case 'piwigo.org':
				/*if (url.pathname.includes('/picture/')) */return globalXHR(url, { responseType: 'text' }).then(function({responseText}) {
					if (/^(?:RVAS)\s*=\s*(\{[\S\s]+?\})$/m.test(responseText)) try {
						let derivatives = eval('(' + RegExp.$1 + ')').derivatives.sort((a, b) => b.w * b.h - a.w * a.h);
						return derivatives.length > 0 ? 'https://piwigo.org/demo/'.concat(derivatives[0].url) : notFound;
					} catch(e) { console.warn(e) }
					return Promise.reject('Unexpected page structure');
				});
			case 'www.freeimages.com': case 'freeimages.com':
				if (url.pathname.startsWith('/photo/')) return globalXHR(url).then(function({document}) {
					let types = Array.from(document.querySelectorAll('ul.download-type > li > span.reso'))
						.sort((a, b) => eval(b.textContent.replace('x', '*')) - eval(a.textContent.replace('x', '*')));
					return types.length > 0 ? url.origin.concat(types[0].parentNode.querySelector('a').pathname) : notFound;
				}); else break;
			case 'redacted.ch': case 'redacted.sh':
				if (url.pathname == '/image.php') return globalXHR(url, { method: 'HEAD' }).then(({finalUrl}) => finalUrl);
					else break;
			case 'demo.cloudimg.io': {
				if (!/\b(https?:\/\/\S+)$/.test(url.pathname.concat(url.search, url.hash))) break;
				let resolved = RegExp.$1;
				if (/\b(?:https?):\/\/(?:\w+\.)*discogs\.com\//i.test(resolved)) break;
				return imageUrlResolver(resolved, modifiers);
			}
			case 'www.pimpandhost.com': case 'pimpandhost.com':
				if (url.pathname.startsWith('/image/')) return globalXHR(url).then(function(response) {
					let elem = resopnse.document.querySelector('div.main-image-wrapper');
					if (elem != null && elem.dataset.src) return 'https:'.concat(elem.dataset.src);
					elem = resopnse.document.querySelector('div.img-wrapper > a > img');
					return elem != null ? 'https:'.concat(elem.src) : notFound;
				}); else break;
			case 'www.screencast.com': case 'screencast.com':
				return globalXHR(url).then(function({document}) {
					let ref = document.querySelectorAll('ul#containerContent > li a.media-link');
					if (ref.length <= 0) return getFromMeta(document) || notFound;
					return Promise.all(Array.from(ref).map(a => imageUrlResolver('https://www.screencast.com' + a.href, modifiers)));
				});
			case 'abload.de':
				if (url.pathname.startsWith('/image.php')) return globalXHR(url).then(function({document}) {
					let elem = document.querySelector('img#image');
					if (elem == null) return notFound;
					let src = new URL(elem.src);
					return imageHostHandlers.abload.origin + src.pathname + src.search;
				}); else break;
			case 'fastpic.ru':
				if (url.pathname.startsWith('/view/'))
					return globalXHR(url).then(({document}) => imageUrlResolver(document.querySelector('a.img-a').href, modifiers));
				else if (url.pathname.startsWith('/fullview/')) return globalXHR(url).then(function(response) {
					let node = response.document.getElementById('image');
					if (node != null) return node.src;
					return /\bvar\s+loading_img\s*=\s*'(\S+?)';/.test(response.responseText) ? RegExp.$1 : notFound;
				}); else break;
			case 'www.radikal.ru': case 'radikal.ru': case 'a.radikal.ru':
				return globalXHR(url).then(({document}) => document.querySelector('div.mainBlock img').src);
			case 'imageban.ru': case 'ibn.im':
				return globalXHR(url).then(({document}) => document.querySelector('a[download]').href);
			case 'slow.pics':
				if (url.pathname.startsWith('/c/')) return globalXHR(url).then(function({document}) {
					let nodes = document.querySelectorAll('img.card-img-top');
					if (nodes.length > 1) return Array.from(nodes).map(img => img.src);
						else if (nodes.length > 0) return nodes[0].src;
					nodes = document.querySelectorAll('a#comparisons + div.dropdown-menu > a.dropdown-item');
					if (nodes.length > 0) return Promise.all(Array.from(nodes).map(a => globalXHR(url.origin + a.pathname)
						.then(({document}) => Array.from(document.querySelectorAll('div#preload-images > img')).map(img => img.src))))
							.then(imgUrls => imgUrls.flatten());
					return notFound;
				}); else break;
			case 'www.casimages.com': case 'casimages.com':
				if (url.pathname.startsWith('/i/')) return globalXHR(url).then(function({document}) {
					let elem = document.querySelector('div.logo > a');
					if (elem != null) return elem.href;
					elem = document.querySelector('div.logo img');
					return elem != null ? elem.src : notFound;
				}); else break;
			case 'www.getapic.me': case 'getapic.me':
				return globalXHR(url, { responseType: 'json' }).then(function({response}) {
					if (!response.result.success) return Promise.reject(response.result.errors);
					if (Array.isArray(response.result.data.images))
						return response.result.data.images.map(image => image.url);
					return response.result.data.image ? response.result.data.image.url : notFound;
				});
			case 'sm.ms':
				if (url.pathname.startsWith('/image/')) return globalXHR(url).then(function({document}) {
					let img = document.querySelector('img.image');
					return img != null ? img.src || img.parentElement.href : notFound;
				}); else break;
			case 'www.kizunaai.com': case 'kizunaai.com':
				//if (!url.pathname.includes('/music/')) break;
				return globalXHR(url).then(function({document}) {
					let img = document.querySelector('div.post-body span > img');
					return img != null ? img.src.replace(/-\d+x\d+(?=\.\w+$)/, '') : notFound;
				});
			case 'play.google.com':
				if (url.pathname.startsWith('/store/')) return globalXHR(url).then(function({document}) {
					let meta = getFromMeta(document);
					return meta != null ? meta.replace(/(?:=[swh]\d+.*)?$/, '=s0') : notFound;
				}); else break;
			// music-related
			case 'www.discogs.com': case 'discogs.com':
			case 'www.discogs.com': case 'discogs.com':
				return globalXHR(url, { anonymous: true }).then(({document}) => (function() {
					if (url.pathname.includes('/master/')) return Promise.reject('This is master');
					if (modifiers.ctrlKey) return Promise.reject('Master release inquiry avoided (force release gallery)');
					const master = document.body.querySelector('section#release-actions a.link_1ctor[href^="/master/"]')
						|| document.body.querySelector('a[href^="/master/"]');
					if (master == null) return Promise.reject('No master release for this page');
					return imageUrlResolver(discogsOrigin + master.pathname, modifiers);
				})().catch(function(reason) {
					const ids = /\/(artist|master|release|label)s?\/(?:view\/)?(\d+)\b/i.exec(url.pathname);
					return ids != null ? getDiscogsImages(ids[1], ids[2]).catch(function(reason) {
						let gallery = document.querySelector('div.image_gallery_large, div.image_gallery');
						if (gallery != null) try {
							gallery = JSON.parse(gallery.dataset.images).map(image => image.full || image.thumb)
								.filter(RegExp.prototype.test.bind(httpParser));
							if (gallery.length <= 0) throw 'empty imagem list';
							return Promise.all(gallery.map(getDiscogsImageMax)).catch(function(reason) {
								console.error('One of getDiscogsImageMax workers rejected:', reason, gallery);
								return gallery;
							});
						} catch(e) { console.warn('Invalid Discogs image gallery:', gallery, '(' + e + ')') } else {
							console.warn('Missing Discogs image gallery record for', url.href);
						}
						return (gallery = getFromMeta(document)) ? getDiscogsImageMax(gallery) : notFound;
					}) : Promise.reject('Unsupported entity');
				}));
			case 'www.musicbrainz.org': case 'beta.musicbrainz.org': case 'musicbrainz.org':
				if (url.pathname.startsWith('/release/')) {
					if (/^\/release\/([\w\-]+)(?=\/|$)/i.test(url.pathname)) url.pathname = '/release/' + RegExp.$1 + '/cover-art';
						else console.warn('Unexpected MusicBrainz release url path:', url.pathname);
				} else if (!url.pathname.startsWith('/release-group/')) break;
				return globalXHR(url).then(({document}) => (function() {
					if (url.pathname.startsWith('/release-group/')) return Promise.reject('this is release group');
					if (modifiers.ctrlKey) return Promise.reject('release group inquiry avoided (force release gallery)');
					let releaseGroup = document.querySelector('p.subheader > span.small > a');
					if (releaseGroup == null) return Promise.reject('no release group for this page');
					return imageUrlResolver('https://musicbrainz.org' + releaseGroup.pathname, modifiers);
				})().catch(function(reason) {
					let elem = document.querySelector('head > script[type="application/ld+json"]');
					if (elem != null) try {
						if (Array.isArray(elem = JSON.parse(elem.text).image)) {
							if (elem.length > 0) return elem.map(image => 'https:' + image.contentUrl);
						} else if (elem && elem.contentUrl) return 'https:' + elem.contentUrl;
					} catch(e) { console.warn('MusicBrainz: invalid meta record', elem) }
					elem = document.querySelectorAll('div#content > div.artwork-cont span.cover-art-image > img');
					if (elem.length > 0) return Array.from(elem).map(img => img.src.replace(/-\d+(?=(?:\.\w+)+$)/, ''));
					return (elem = document.querySelector('a.artwork-image')) != null ? elem.href
						: (elem = document.querySelector('div.cover-art > img')) != null ? elem.src : notFound;
				}));
			case 'www.allmusic.com': case 'allmusic.com':
				return globalXHR(url).then(function({document}) {
					function imageResolver(document) {
						function imageMax(imageUrl) {
							if (imageUrl) try {
								imageUrl = new URL(imageUrl);
								imageUrl.searchParams.set('f', 0);
								return imageUrl.href;
							} catch(e) { console.warn(e) }
						}

						const galleryExtractor = /\b(?:imageGallery) *= *(\[.+\]);?\s*$/;
						let imageGallery = Array.prototype.find.call(document.body.getElementsByTagName('script'),
							script => galleryExtractor.test(script.text));
						if (imageGallery) try {
							imageGallery = galleryExtractor.exec(imageGallery.text);
							console.assert(imageGallery != null);
							imageGallery = eval(imageGallery[1]).map(image => imageMax(image.url));
							if (imageGallery.length > 0) return imageGallery;
						} catch(e) { console.warn(e) }
						return imageMax(getFromMeta(document)) || notFound;
					}

					const mainAlbum = document.querySelector('div#mainAlbumMeta a');
					if (mainAlbum == null || !modifiers.ctrlKey) return imageResolver(document);
					return globalXHR(mainAlbum).then(({document}) =>
						imageResolver(document)).catch(reason => imageResolver(document));
				});
			case 'music.apple.com': case 'itunes.apple.com': {
				const appleId = amEntityParser.exec(url);
				const market = /\/([a-z]{2})\//.exec(url.pathname);
				if (appleId != null) return queryAppleAPI(appleId[1] + 's/' + parseInt(appleId[2]), undefined, market != null ? market[1] : undefined).then(function(response) {
					const artwork = response.data[0].attributes.artwork;
					return artwork ? artwork.url.replace('{w}', artwork.width).replace('{h}', artwork.height) : notFound;
				}); else break;
			}
			case 'www.deezer.com': case 'deezer.com':
				if (dzrEntityParser.test(url)) return verifyImageUrl('https://api.deezer.com/' + RegExp.$1 + '/' + RegExp.$2 + '/image').catch(function(reason) {
					console.warn('Deezer API image retrieval failed:', reason, url);
					return globalXHR(url).then(({document}) => getFromMeta(document) || notFound);
				}).then(imageUrl => !modifiers.ctrlKey ? getDeezerImageMax(imageUrl)
					: verifyImageUrl(imageUrl.replace(...dzrImageMax)).catch(reason => imageUrl)); else break;
			case 'www.qobuz.com': case 'qobuz.com':
				if (url.pathname.includes('/album/')) return globalXHR(url).then(function({document}) {
					let img = document.querySelector('div.album-cover > img');
					if (img == null) return getFromMeta(document) || notFound;
					return verifyImageUrl(img.src.replace(/_\d{3}(?=\.\w+$)/, '_org'))
						.catch(reason => verifyImageUrl(img.src.replace(/_\d{3}(?=\.\w+$)/, '_max'))).catch(reason => img.src);
				}); else break;
			case 'www.boomkat.com': case 'boomkat.com':
				if (url.pathname.startsWith('/products/')) return globalXHR(url).then(function({document}) {
					let img = document.querySelector('img[itemprop="image"]');
					if (img == null) return notFound;
					return verifyImageUrl(img.src.replace(/\/large\//i, '/original/')).catch(reason => img.src);
				}); else break;
			case 'www.bleep.com': case 'bleep.com':
				if (url.pathname.startsWith('/release/')) return globalXHR(url).then(function({document}) {
					let image = getFromMeta(document);
					if (!image && (image = document.body.querySelector('a.main-product-image > img')) != null) image = image.src;
					return image ? verifyImageUrl(image.replace(/\/r\/[a-z]\//i, '/r/')).catch(reason => image) : notFound;
				}); else break;
			case 'www.soundcloud.com': case 'soundcloud.com':
				return globalXHR(url).then(function({document}) {
					const meta = getFromMeta(document);
					return meta ? verifyImageUrl(meta.replace(/-\w+(?=\.\w+$)/, '-original')).catch(reason => meta) : notFound;
				});
			case 'www.prestomusic.com': case 'prestomusic.com':
				if (url.pathname.includes('/products/')) return globalXHR(url).then(({document}) =>
					verifyImageUrl(document.querySelector('div.c-product-block__aside > a').href.replace(/\?\d+$/))); else break;
			case 'www.bontonland.cz':case 'bontonland.cz':
				return globalXHR(url).then(({document}) => document.querySelector('a.detailzoom').href);
			case 'www.prostudiomasters.com': case 'prostudiomasters.com':
				if (url.pathname.includes('/album/')) return globalXHR(url).then(function({document}) {
					let a = document.querySelector('img.album-art');
					return verifyImageUrl(a.currentSrc).catch(reason => a.src);
				}); else break;
			case 'www.e-onkyo.com': case 'e-onkyo.com':
				if (url.pathname.includes('/album/')) return globalXHR(url).then(function({document}) {
					let meta = getFromMeta(document);
					return meta ? meta.replace(/\/s\d+\//, '/s0/') : notFound;
				}); else break;
			case 'store.acousticsounds.com':
				return globalXHR(url).then(function({document}) {
					let link = document.querySelector('div#detail > link[rel="image_src"]');
					return verifyImageUrl(link.href.replace(/\/medium\//i, '/xlarge/')).catch(reason => link.href);
				});
			case 'www.indies.eu': case 'indies.eu':
				if (url.pathname.includes('/alba/')) return globalXHR(url)
					.then(({document}) => verifyImageUrl(document.querySelector('div.obrazekDetail > img').src)); else break;
			case 'www.beatport.com': case 'classic.beatport.com': case 'pro.beatport.com': case 'beatport.com':
				if (url.pathname.startsWith('/release/')) return globalXHR(url).then(function({document}) {
					let elem = getFromMeta(document);
					if (!elem && (elem = document.body.querySelector('div > img.interior-release-chart-artwork')) != null)
						elem = elem.src;
					if (!elem && (elem = document.body.querySelector('div.artwork')) != null && elem.dataset.modalArtwork) // BP Classic
						elem = 'https:' + elem.dataset.modalArtwork;
					return elem || notFound;
				}).then(imgUrl => verifyImageUrl(imgUrl.replace(/\/image_size\/\d+x\d+\//i, '/image/'))); else break;
			case 'www.beatsource.com': case 'beatsource.com':
				if (url.pathname.startsWith('/release/')) return globalXHR(url).then(function({document}) {
					let imgUrl = getFromMeta(document);
					return imgUrl ? imgUrl.replace(/\/image_size\/\d+x\d+\//i, '/') : notFound;
				}); else break;
			case 'www.supraphonline.cz': case 'supraphonline.cz':
				if (!url.pathname.includes('/album/')) break;
				return globalXHR(url).then(function({document}) {
					let imageUrl = document.querySelector('div.sidebar div.sexycover > div.btn-group > button:last-of-type');
					if (imageUrl != null && /^(?:coverzoom):(\S+)\$$/.test(imageUrl.dataset.plugin)
							&& (imageUrl = imageUrl.parentNode.querySelector('script[type="data-plugin/' + RegExp.$1 + '"]')) != null)
						return 'https://www.supraphonline.cz' + eval(imageUrl.text);
					return (imageUrl = getFromMeta(document)) ? imageUrl.replace(/\?.*$/, '') : notFound;
				});
			case 'vgmdb.net':
				if (url.pathname.includes('/album/')) return globalXHR(url).then(function({document}) {
					let div = document.querySelector('div#coverart');
					return verifyImageUrl(/\b(?:url)\s*\(\"(.*)"\)/i.test(div.style['background-image']) && RegExp.$1).catch(reason => notFound);
				}); else break;
			case 'www.ototoy.jp': case 'ototoy.jp':
				return globalXHR(url).then(function({document}) {
					let img = document.querySelector('div#jacket-full-wrapper > img'); // img[alt="album jacket"]
					return img != null ? img.dataset.src || img.src : notFound;
				});
			case 'music.yandex.ru':
				if (url.pathname.includes('/album/')) return globalXHR(url).then(function({document}) {
					let script = document.querySelector('script.light-data');
					return verifyImageUrl(JSON.parse(script.text).image).catch(reason => notFound);
				}); else break;
			//case 'www.mora.jp': case 'mora.jp':
			//	if (!url.pathname.includes('/package/')) break;
			//	return loadMoraMetadata(url).then(packageMeta => packageMeta.packageUrl + packageMeta.fullsizeimage);
			case 'www.pias.com': case 'store.pias.com': case 'pias.com':
				return globalXHR(url).then(function({document}) {
					let node = getFromMeta(document);
					if (node) return verifyImage(node.replace(/\/[sbl]\//i, '/')).catch(reason => node);
					node = document.querySelector('img[itemprop="image"]');
					return node != null ? verifyImage(node.src.replace(/\/[sbl]\//i, '/')).catch(reason => node.src) : notFound;
				});
			case 'www.eclassical.com': case 'eclassical.com':
				return globalXHR(url).then(function({document}) {
					let a = document.querySelector('div#articleImage > a');
					return a != null ? a.href : notFound;
				});
			case 'www.hdtracks.com': case 'hdtracks.com':
				if (!/\/album\/(\w+)\b/.test(url)) break;
				return fetch('https://hdtracks.azurewebsites.net/api/v1/album/' + RegExp.$1).then(response => response.json())
					.then(result => result.status.toLowerCase() == 'ok' ? result.cover : Promise.reject(result.status));
			case 'www.muziekweb.nl': case 'muziekweb.nl':
				if (/\/Link\/(\w+)\b/i.test(url)) return globalXHR(url).then(function({document}) {
					let meta = getFromMeta(document)
					return meta ? meta.replace(/\/COVER\/\w+\b/i, '/COVER/SUPERLARGE') : notFound;
				}); else break;
			case 'www.deejay.de': case 'deejay.de':
				return globalXHR(url).then(function({document}) {
					let elem = document.querySelector('div#gallery > a') || document.querySelector('div.cover a');
					if (elem != null) return 'https://www.deejay.de' + elem.pathname;
					return (elem = getFromMeta(document)) ? elem : notFound;
				}).then(imgUrl => verifyImageUrl(imgUrl.replace(/\/images\/\w+\//i, '/images/xxl/')).catch(() => imgUrl));
			case 'music.163.com':
				if (!/\/(?:album)\b.*\b(?:id)=(\d+)\b/i.test(url.href)) break;
				return globalXHR('https://music.163.com/api/album/' + RegExp.$1, { responseType: 'json' })
					.then(({response}) => response.album.picUrl ?
						response.album.picUrl.replace(/\?.*$/, '').replace(/\b(?:p[123])(?=\.music\.\d+\.net\b)/i, 'p4') : notFound);
			case 'www.tidal.com': case 'listen.tidal.com': case 'tidal.com':
				if (!(/\/album\/(\d+)(?:\/|$)/i.test(url.pathname) && !/\b(?:albumId)=(\d+)\b/i.test(url.search))) break;
				return tidalAccess.requestAPI('albums/' + RegExp.$1).then(album => album.cover ?
					'https://resources.tidal.com/images/' + album.cover.replace(/-/g, '/') + '/1280x1280.jpg' : notFound);
			case 'www.extrememusic.com': case 'extrememusic.com':
				if (url.pathname.startsWith('/albums/')) return globalXHR(url).then(function({document}) {
					let meta = getFromMeta(document);
					return meta ? meta.replace(/\/album\/\w+\//i, '/album/600/') : notFound;
				}); else break;
			case 'www.recochoku.jp': case 'recochoku.jp':
				if (url.pathname.startsWith('/album/')) return globalXHR(url).then(function({document}) {
					let imgUrl = getFromMeta(document);
					if (!imgUrl) return notFound;
					imgUrl = new URL(imgUrl);
					let params = new URLSearchParams(imgUrl.search);
					params.set('FFw', 999999999); params.set('FFh', 999999999);
					params.delete('h'); params.delete('option');
					imgUrl.search = params;
					return imgUrl;
				}); else break;
			case 'www.elusivedisc.com': case 'elusivedisc.com':
				return globalXHR(url).then(function({document}) {
					let img = document.querySelector('figure > img.zoomImg');
					if (img != null) return img.src;
					img = document.querySelector('section.productView-images > figure');
					return img != null && img.dataset.zoomImage || notFound;
				});
			case 'music.youtube.com':
				return globalXHR(url).then(function({document}) {
					for (let script of document.querySelectorAll('body > script[nonce]')) {
						let data = /\b(?:initialData\.push)\s*\(\s*\{\s*(?:path):\s*('\\\/browse'),\s*(?:params):\s*(.+?)\s*,\s*(?:data):\s*('.+?')\s*\}\s*\);/.exec(script.text);
						if (data != null) try {
							const imgMax = [/(?:=[swh]\d+.*)?$/, '=s0'];
							data = JSON.parse(eval(data[3]));
							if ('frameworkUpdates' in data) try {
								data = data.frameworkUpdates.entityBatchUpdate.mutations
									.find(mutation => mutation.payload && 'musicAlbumRelease' in mutation.payload);
								if (data != undefined && 'thumbnailDetails' in data.payload.musicAlbumRelease)
									return data.payload.musicAlbumRelease.thumbnailDetails.thumbnails[0].url.replace(...imgMax);
							} catch(e) { console.warn(e) }
							if ('header' in data) try {
								data = data.header.musicImmersiveHeaderRenderer.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails;
								if (data) return data[0].url.replace(...imgMax);
							} catch(e) { console.warn(e) }
						} catch(e) { console.warn(e) }
					}
					return notFound;
				});
			case 'www.kuwo.cn': case 'kuwo.cn':
				if (url.pathname.startsWith('/album_detail/')) return globalXHR(url).then(function({document}) {
					for (let script of document.querySelectorAll('body > script')) {
						if (!/\b(?:__NUXT__)\b/.test(script.text)) continue;
						if (/\b(?:pic):"(.+?)"/.test(script.text))
							return eval('"' + RegExp.$1 + '"').replace(/(\/albumcover)\/\d+\//i, '$1/0/');
					}
					return notFound;
				}); else break;
			case 'www.melon.com': case 'melon.com':
				/*if (url.pathname.startsWith('/album/')) */return globalXHR(url).then(function({document}) {
					let imgUrl = getFromMeta(document);
					if (imgUrl) imgUrl = imgUrl.replace(/\?.*$/, ''); else return notFound;
					return verifyImageUrl(imgUrl.replace(/(?:_\d+)?(?=\.\w+$)/, '_1000')).catch(reason => imgUrl);
				});// else break;
			case 'music.bugs.co.kr':
				if (url.pathname.startsWith('/album/')) return globalXHR(url).then(function({document}) {
					let imgUrl = getFromMeta(document);
					return imgUrl ? imgUrl.replace(/(\/album\/images)\/\w+\//i, '$1/original/') : notFound;
				}); else break;
			case 'www.joox.com': case 'joox.com':
				if (/\/album\/([^\/\?\#]+)/i.test(url.pathname))
					return globalXHR('https://api-jooxtt.sanook.com/page/albumDetail?' + new URLSearchParams({
						id: RegExp.$1,
						lang: 'en',
						country: 'intl',
						device: 'desktop',
					}).toString(), { responseType: 'json' }).then(({response}) => response.albumTracks.images
						&& response.albumTracks.images.reduceRight((acc, img) => img.url.replace(/\/(\d+)$/, '/0'), undefined) || notFound);
				else break;
			case 'mixcloud.com': case 'www.mixcloud.com': {
				const folders = url.pathname.split('/').filter(Boolean);
				if (folders.length <= 0) break;
				const query = folders.length > 1 ? `
query cloudcastQuery($lookup: CloudcastLookup!) {
  cloudcast: cloudcastLookup(lookup: $lookup) {
    owner { ...CloudcastBaseSidebar_user }
    ...CloudcastHeadTags_cloudcast
  }
}
fragment CloudcastBaseSidebar_user on User { ...UserLiveCard_user }
fragment CloudcastHeadTags_cloudcast on Cloudcast { picture { urlRoot } }
fragment UserLiveCard_user on User { liveStream { streamStatus id } }
` : `
query userQuery($lookup: UserLookup! $bannerContentKey: String!) {
  user: userLookup(lookup: $lookup) { ...UserHeadTags_user }
  viewer { ...UserDashboardBanner_viewer_1HzGx id }
}
fragment UserDashboardBanner_viewer_1HzGx on Viewer { showHideableContent(contentKey: $bannerContentKey) }
fragment UserHeadTags_user on User { picture { urlRoot } }
`;
				return mixcloudQuery(query, {
					lookup: { username: folders[0], slug: folders[1] },
					bannerContentKey: 'DASHBOARD_BANNER_PROFILE',
				}).then(function(data) {
					let imgUrl = 'cloudcast' in data ? data.cloudcast.picture.urlRoot
						: 'user' in data ? data.user.picture.urlRoot : null;
					return imgUrl ? 'https://thumbnailer.mixcloud.com/unsafe/' + imgUrl : notFound;
				});
			}
			case 'www.metal-archives.com': case 'metal-archives.com':
				if (url.pathname.startsWith('/albums/')) return globalXHR(url).then(function({document}) {
					const cover = document.getElementById('cover');
					return cover != null ? cover.href.replace(/\?\S*$/, '') : getFromMeta(document) || notFound;
				}); else break;
			case 'www.rateyourmusic.com': case 'rateyourmusic.com':
				if (url.pathname.startsWith('/release/')) return globalXHR(url).then(function({document}) {
					let cover = document.querySelector('div.page_release_art_frame img');
					return cover != null ? cover.src : notFound;
				}); else break;
			// books-related
			case 'www.goodreads.com': case 'goodreads.com':
				if (url.pathname.includes('/show/')) return globalXHR(url).then(function({document}) {
					let img = ['div.BookCover__image img', 'div.editionCover > img', 'img#coverImage']
						.reduce((elem, selector) => elem || document.body.querySelector(selector), null);
					img = img != null ? img.src : getFromMeta(document);
					return img && !['/nophoto/', '/books/1570622405l/50809027', '/images/no-cover.png'].some(pattern =>
						img.includes(pattern)) ? img.replace(/\._\w+_\./g, '.').replace(/\?.*$/, '') : notFound;
				}); else break;
			case 'www.databazeknih.cz': case 'databazeknih.cz':
				if (url.pathname.startsWith('/knihy/')) return globalXHR(url).then(function({document}) {
					let elem = document.querySelector('div#icover_mid > a');
					if (elem != null) return imageUrlResolver('https://www.databazeknih.cz' + elem.pathname, modifiers);
					const imageMax = imageUrl => httpParser.test(imageUrl) ? verifyImageUrl([
						[/\/\d+\/([a-z]+)(?=_)/, 'big'], [/\?.*$/, ''],
					].reduce((acc, def) => acc.replace(...def), imageUrl)).catch(reason => imageUrl) : Promise.reject('invalid url');
					if ((elem = document.querySelector('div#lbImage')) != null
							&& (elem = /\b(?:url)\("(.*)"\)/i.exec(elem.style.backgroundImage)) != null) return imageMax(elem[1]);
					return (elem = document.querySelector('img.kniha_img')) != null ? imageMax(elem.src) : notFound;
				}); else if (url.pathname.startsWith('/obalka-knihy/')) return globalXHR(url).then(function({document}) {
					let elem = document.querySelector('img.book_cover_big');
					return elem != null ? elem.src.replace(/\?.*/, '') : notFound;
				}); else break;
			case 'www.alza.cz': case 'alza.cz': case 'www.alza.sk': case 'alza.sk':
				return globalXHR(url).then(function({document}) {
					const imageMax = imgSrc => imgSrc.replace(/([\?\&])fd=(?:f\d+)\b\&?/i, '$1');
					let meta = document.querySelectorAll('div#galleryPreview a.lightBoxImage');
					if (meta.length > 0) return Array.from(meta)
						.map(a => imageMax(a.dataset.original || a.href || a.dataset.bigimage));
					meta = document.querySelector('div.detail-page > script[type="application/ld+json"]');
					if (meta != null) try { meta = JSON.parse(meta.text) } catch(e) { meta = null }
					if (meta != null && httpParser.test(meta.image)) return imageMax(meta.image);
					return (meta = getFromMeta(document)) ? imageMax(meta) : notFound;
				});
		}
		return globalXHR(url, { headers: { Referer: url.origin } }).then(function({document}) {
			if (url.pathname.startsWith('/album/')
					&& document.querySelector('div#tabbed-content-group > div.content-listing > div.pad-content-listing') != null)
				return cheveretoGalleryResolver(url.hostname, url);
			let elem = document.querySelector('head > meta[name="generator"][content]');
			if (elem != null && elem.content.toLowerCase() == 'bandcamp') {
				elem = document.querySelector('div#tralbumArt > a.popupImage');
				elem = elem != null ? elem.href : getFromMeta(document);
				return httpParser.test(elem) ? elem.replace(/_\d+(?=\.\w+$)/, '_0') : notFound;
			}
			return getFromMeta(document) || notFound;
		});
	}));
}

PTPimg.prototype.setSession = function() {
	return this.apiKey ? Promise.resolve(this.apiKey) : globalXHR(this.origin).then(({document}) => {
		const apiKey = document.getElementById('api_key') || document.querySelector('input[name="api_key"]');
		if (apiKey == null) {
			let counter = GM_getValue('ptpimg_reminder_read', 0);
			if (counter < 3) {
				alert(`
PTPimg API key could not be captured. Please login to ${this.origin}/ and redo the action.

If you don\'t have PTPimg account at your disposal and not using the script on OPS,
consider to set "auto_rehost_cover" config entry to false.

Local images uploading is still available to fallback image hosts.
`);
				GM_setValue('ptpimg_reminder_read', ++counter);
			}
			return Promise.reject('API key not configured');
		} else if (!(this.apiKey = apiKey.value)) return Promise.reject('assertion failed: empty PTPimg API key');
		GM_setValue('ptpimg_api_key', this.apiKey);
		addMessage(`Your PTPimg API key ${this.apiKey} was successfully configured`, 'info');
		return this.apiKey;
	});
}

var imageHosts = new ImageHostManager(
	// fail messages callback
	message => { addMessage(message, 'warning') },
	// upload image hosts
	isNWCD ? ['NWCD'] : isDIC ? ['PTPimg', 'PixHost', 'ImgBox', 'PostImage', 'Imgur']
		: ['PTPimg', 'ImgBB', 'PixHost', 'ImgBox', 'PostImage', 'Imgur'],
	// rehost image hosts
	isRED ? ['PTPimg'/*, 'Imgur'*/] : isNWCD ? ['NWCD'] : isDIC ? ['PTPimg', 'PixHost', 'PostImage']
		: ['PTPimg', 'ImgBB', 'PixHost', 'PostImage'],
);

function checkImageSize(image, elem, param) {
	if (!(elem instanceof HTMLElement)) elem = null;
	if (elem != null) elem.disabled = true;
	return (image instanceof File ? Promise.resolve(image.size) : param > 0 ? Promise.resolve(param)
			: param instanceof Promise ? param : getRemoteFileSize(image)).then(function(size) {
		if (!(prefs.image_size_reduce_threshold > 0) || size <= prefs.image_size_reduce_threshold * 2**10) {
			if (prefs.image_size_warning > 0 && size > prefs.image_size_warning * 2**10)
				addMessage('immoderate cover size (' + formattedSize(size) + ')', 'notice');
			return image;
		}
		//if (!prefs.auto_rehost_cover && !isNWCD) return Promise.reject('no hosts to upload result');
		const msgElem = addMessage('excessive cover size, downsizing...', 'info');
		return reduceImageSize(image, GM_getValue('image_reduce_maxheight', 2000),
				GM_getValue('image_reduce_jpegquality', 90), typeof param == 'function' ? param : null).then(function(output) {
			if (elem != null) {
				if (!isNWCD) elem.value = output.uri;
				if (image instanceof File) coverPreview(elem, output.uri, output.size);
			}
			Promise.resolve(output.size).then(reducedSize => {
				const epilogue = ' reduced by ' + Math.round((size - reducedSize) * 100 / size) + '% (' +
					Math.ceil(size / 2**10) + ' → ' + Math.ceil(reducedSize / 2**10) + ' KiB)';
				if (msgElem instanceof HTMLElement) msgElem.textContent += 'done. Size' + epilogue;
					else addMessage('cover size' + epilogue, 'info');
				if (reducedSize > prefs.image_size_reduce_threshold * 2**10
						|| prefs.image_size_warning > 0 && reducedSize > prefs.image_size_warning * 2**10)
					addMessage('downsized cover still above limit, consider to adjust image_reduce_maxheight and/or image_reduce_jpegquality to lower values', 'notice');
			});
			return prefs.auto_rehost_cover || isNWCD ? output.uri : forcedRehost(output.uri);
		});
	}).catch(function(reason) {
		addMessage('failed to get image size, optimize the image, or upload it to fallback host: ' +
			reason + ', size reduction was not performed', 'warning');
		return image;
	}).then(function(finalResult) {
		if (elem != null) {
			if (httpParser.test(finalResult)) {
				if (!isNWCD && finalResult != elem.value) elem.value = finalResult;
			} else elem.value = '';
			elem.disabled = false;
		}
		return finalResult;
	});
}

function countTorrentStats(torrent) {
	if (!torrent || typeof torrent != 'object') throw 'validateTorrentFile(…) assertion failed: the parameter is not valid';
	const dirs = { haveLog: new Set, haveCue: new Set },
				sliceToString = slice => Array.isArray(slice) ? decodeURIComponent(escape(slice.join('/') || '')) : undefined;
	if (Array.isArray(torrent.info.files)) for (let path of torrent.info.files.map(file => file.path)) {
		const fullPath = sliceToString(path), fileName = sliceToString(path.slice(-1)),
					dirName = sliceToString(path.slice(0, -1));
		if (fileName.toLowerCase().endsWith('.log')) dirs.haveLog.add(dirName);
		if (fileName.toLowerCase().endsWith('.cue')) dirs.haveCue.add(dirName);
	}
	torrentStats.foldersWithLog = dirs.haveLog.size;
	torrentStats.foldersWithCue = dirs.haveCue.size;
	torrentStats.foldersWithLogCue = Array.from(dirs.haveLog.values()).filter(dirName => dirs.haveCue.has(dirName)).length;
}

function validateTorrentFile(torrent) {
	if (!torrent || typeof torrent != 'object') throw 'validateTorrentFile(…) assertion failed: the parameter is not valid';
	const decodeFsString = pathStr => decodeURIComponent(escape(pathStr)),
				rootFolderName = decodeFsString(torrent.info.name),
				sliceToString = slice => Array.isArray(slice) ? decodeFsString(slice.join('/') || '') : undefined,
				isMusicUpload = isSelectedCategory('Music');
	let rootImageCount = 0, torrentSDtatus = 0;
	const setStatus = status => { if (torrentSDtatus < status) torrentSDtatus = status };
	if (rootFolderName.trueLength() + 1 >= maxPathLen) {
		tfMessages.push(addMessage(new HTML('Root folder name "' + rootFolderName + '" exceeding filepath length limit (' +
			rootFolderName.trueLength() + ' char(s))'), 'critical'));
		setStatus(3);
	}
	if (hyphenCoupling.test(rootFolderName)) {
		tfMessages.push(addMessage('torrent folder hyphen coupling ("' + rootFolderName + '")', 'notice'));
		setStatus(1);
	}
	if (Array.isArray(torrent.info.files)) for (let path of torrent.info.files.map(file => file.path)) {
		const fullPath = sliceToString(path), fileName = sliceToString(path.slice(-1)),
					dirName = sliceToString(path.slice(0, -1));
		if (/\s{2,}/.test(fullPath)) {
			tfMessages.push(addMessage('excessive whitespace in file path: ' + fullPath, 'warning'));
			setStatus(2);
		}
		if (path.some(RegExp.prototype.test.bind(/^\s+|\s+$/))) {
			tfMessages.push(addMessage('leading/tailing whitespace in path component: ' + fullPath, 'warning'));
			setStatus(2);
		}
		const totalLen = rootFolderName.trueLength() + 1 + fullPath.trueLength();
		if (rootFolderName.trueLength() + 1 < maxPathLen && totalLen > maxPathLen) {
			const norm = fullPath.normalize('NFC'), ll = Math.max(maxPathLen - 1 - rootFolderName.trueLength(), 0);
			const elems = ['SPAN', 'SPAN', 'SPAN'].map(Document.prototype.createElement.bind(document));
			elems[0].append('file "');
			elems[2].className = 'cutpart';
			elems[2].style = 'color: red; font-weight: 900;';
			elems[2].append(norm.slice(ll));
			if (ll > 0) {
				elems[1].className = 'filename';
				elems[1].style = 'color: #FF6060;';
				elems[1].append(norm.slice(0, ll));
				elems[1].append(elems[2]);
				elems[0].append(elems[1]);
			} else elems[0].append(elems[2]);
			elems[0].append('" exceeding filepath length limit by ', (totalLen - maxPathLen).toString(),
				' ', totalLen - maxPathLen > 1 ? 'chars' : 'char');
			tfMessages.push(addMessage(elems[0], 'critical-lite'));
			setStatus(3);
		}
		if (/(?:\.(?:torrent|\!ut|\!qb|url|lnk|tmp|bak)|^Thumbs\.db)$/i.test(fileName)) {
			tfMessages.push(addMessage(new HTML('garbage file "' + safeText(fullPath).bold() + '"'), 'warning'));
			setStatus(2);
		}
		if (!isMusicUpload) return torrentSDtatus;
		if (path.length < 2 && imageExtensions.some(ext => fileName.toLowerCase().endsWith('.' + ext))) {
			++rootImageCount;
			if (!/^(?:cover|artworks?|sleeve|artist|(?:front|back|rear)(?: cover)?)\.\w+$/i.test(fileName) && isMusicUpload) {
				tfMessages.push(addMessage('nonstandard cover image name: ' + fileName, 'notice'));
				setStatus(1);
			}
		}
		if (/^(?:(?:MediaInfo|errors)\.txt|(?:Lossless Audio Checker|results|auCDtect|audiochecker)\.log)$/i.test(fileName)) {
			tfMessages.push(addMessage('auxiliary text file in torrent: ' + fullPath, 'notice'));
			setStatus(1);
		}
		if (/^(?:thumb\.jpg)$/i.test(fileName)) {
			tfMessages.push(addMessage('thumb.jpg in torrent', 'notice'));
			setStatus(1);
		}
		if (/^(?:DR\d+\.txt)$/i.test(fileName)) {
			tfMessages.push(addMessage(`Nonstandard DR report in torrent (${fileName})`, 'notice'));
			setStatus(1);
		}
		if ([
			'm3u', 'm3u8', 'pls', 'fpl', 'wpl', 'asx', 'b4s', 'bpl', 'm4u', 'ram', 'plp',
			'kpl', 'plist', 'xml', 'rmp', 'xspf', 'smi', 'smil', 'wax', 'wvx', 'wmx', 'pla',
		].some(ext => fileName.toLowerCase().endsWith('.' + ext))) {
			tfMessages.push(addMessage('disposable playlist found: ' + fullPath, 'notice'));
			setStatus(1);
		}
		if (hyphenCoupling.test(fullPath)) {
			tfMessages.push(addMessage('file path hyphen coupling ("' + fullPath + '")', 'notice'));
			setStatus(1);
		}
	}
	if (isMusicUpload) {
		if (rootImageCount > 1) {
			tfMessages.push(addMessage('More images (' + rootImageCount + ') in root folder', 'notice'));
			setStatus(1);
		}
		if (rootImageCount <= 0) {
			tfMessages.push(addMessage('No cover image in root folder', 'notice'));
			setStatus(1);
		}
	}
	return torrentSDtatus;
}

function autoFillFromTorrent(torrent) {
	if (!torrent || typeof torrent != 'object')
		throw 'autoFillFromTorrent(…) assertion failed: the parameter is not valid';
	if (autoFill || category == null || uaData == null || uaData.value.length > 0) return;
	const decodeFsString = pathStr => decodeURIComponent(escape(pathStr)),
				bracketStripper = [/\s+(?:\([^\(\)]+\)|\[[^\[\]]+\]|\{[^\{\}]+\})/g, ''],
				wsTrimmer = [/[\s\-]+$/, ''], spaceCollapser = [/\s+/g, ' '],
				editionExtractor = /\s+\((([^\(\)]+),\s*#(\d+))\)/;
	let name = decodeFsString(torrent.info.name).replace(/(?:\.\w*)+$/, '').replace(/[\s_]+/g, ' '),
			edition = editionExtractor.exec(name);
	//name = name.replace(...bracketStripper).replace(...wsTrimmer);
	//if (edition != null) name += ' (' + edition[2] + ', #' + edition[3] + ')';
	function testEmpty(sel) {
		const elem = document.querySelector(sel);
		return elem != null && elem.value.length <= 0;
	}

	// E-Books + Audiobooks
	if (isSelectedCategory('E-Books', 'Audiobooks')) {
		const resultsHandler = (resourceName, results, formattedTitle,
				greediness = prefs.auto_fill_by_torrent_name_greediness,
				minSimilariry = prefs.auto_fill_by_torrent_name_min_similarity) => {
			if (!resourceName || !Array.isArray(results) || typeof formattedTitle != 'function') {
				console.trace();
				throw 'Assertion failed: one or more parameters are invalid (resultsHandler)';
			}
			if (results.length <= 0) return Promise.reject(resourceName + ': no matches');
			function similarity(result) {
				const n = name.toLowerCase(), ns = name.replace(...bracketStripper).replace(...wsTrimmer).toLowerCase();
				let results = [ ];
				for (let format = 0; format < 3; ++format) {
					let ft = formattedTitle(result, format);
					if (!ft) continue;
					results.push(jaroWrinkerSimilarity(n, ft.toLowerCase()),
						jaroWrinkerSimilarity(ns, ft.replace(...bracketStripper).replace(...wsTrimmer).toLowerCase()));
					const orderLess = title => title.split(/\s+/).sort().join(' ');
					results.push(jaroWrinkerSimilarity(orderLess(n), orderLess(ft.toLowerCase())),
						jaroWrinkerSimilarity(orderLess(ns), orderLess(ft.replace(...bracketStripper).replace(...wsTrimmer).toLowerCase())));
				}
				//if (prefs.diag_mode) console.debug(result, results);
				return Math.max(...results);
			}
			const matcher = result => similarity(result) >= (minSimilariry || 0.90);
			if (prefs.diag_mode) {
				console.table(results.map(result => ({
					formattedTitle: formattedTitle(result),
					similarity: similarity(result),
				})));
			}
			if (greediness >= 3) {
				if (results.length > 1) results.sort((a, b) => similarity(b) - similarity(a));
			} else {
				if (results.length > 1 && results.some(matcher)) results = results.filter(matcher);
				if (greediness <= 0 && results.length > 1) return Promise.reject(resourceName, ': ambiguity');
				if (greediness <= 1 && !matcher(results[0])) return Promise.reject(resourceName + ': no matches');
			}
			if (!matcher(results[0])) {
				if (prefs.diag_mode) tfMessages.push(addMessage(resourceName + ': the best match lowly similar to torrent name (' +
					(Math.round(similarity(results[0]) * 100) / 100) + ')', 'notice'));
				console.warn(resourceName + ': the best match lowly similar to torrent name',
					similarity(results[0]), results[0], name);
			} else if (prefs.diag_mode) console.info(resourceName + ': result score ', similarity(results[0]));
			return Promise.resolve(results[0]);
		};
		const martinusLookup = domain => globalXHR('https://www.' + domain + '/?' + new URLSearchParams({
			'uMod': 'list',
			'uTyp': 'search',
			'uQ': name.replace(...bracketStripper).replace(...wsTrimmer).toASCII(),
		})).then(({document}) => Array.from(document.querySelectorAll('div[class$="results"] > div.product-item')).map(function(div) {
			let item = {
				title: div.querySelector('h2 > a'),
				authors: Array.from(div.querySelectorAll('ul > li > a'))
					.map(span => span.textContent.trim().replace(...spaceCollapser)).distinctValues(),
				cover: div.querySelector('a > div > img'),
			};
			if (item.title != null) {
				item.url = new URL(item.title);
				item.id = parseInt(item.url.searchParams.get('uItem')) || undefined;
			}
			item.title = item.title != null ? item.title.textContent.trim().replace(...spaceCollapser) : undefined;
			item.cover = item.cover != null ? item.cover.src.replace(/\/_\w+\//, '/_xl/')
				.replace(/\/[a-z]*(\d+\.\w+)(?:\?.*)?$/i, '/xl$1') : undefined;
			console.assert(item.url && item.title, div);
			return item;
		})).then(results => resultsHandler('Martinus', results, function(result, format = 1) {
			let bookTitle = result.title;
			edition = editionExtractor.exec(result.title);
			//if (edition != null) bookTitle += ' (' + edition[2] + ', #' + edition[3] + ')';
			if (Array.isArray(result.authors) && result.authors.length > 0) switch (format) {
				case 1: return result.authors.join(' & ') + ' - ' + bookTitle;
				case 2: return bookTitle + ' - ' + result.authors.join(' & ');
			}
			return bookTitle;
		}, 1));

		const lookupWorkers = {
			'goodreads': () => globalXHR('https://www.goodreads.com/search?' + new URLSearchParams({
				'utf8': '✓',
				'q': name.replace(...bracketStripper).replace(...wsTrimmer).toASCII(),
				'search_type': 'books',
				'search[field]': 'on',
			})).then(({document}) => Array.from(document.querySelectorAll('table.tableList > tbody > tr')).map(function(tr) {
				let item = {
					title: tr.querySelector('a.bookTitle > span[itemprop="name"]'),
					authors: Array.from(tr.querySelectorAll('span[itemprop="author"] a > span[itemprop="name"]')),
					cover: tr.querySelector('img.bookCover'),
				};
				const mainAuthors = item.authors.filter(span => span.parentNode.parentNode.querySelector('span.role') == null);
				item.authors = (mainAuthors.length > 0 ? mainAuthors : item.authors)
					.map(span => span.textContent.trim().replace(...spaceCollapser)).distinctValues(),
				item.url = item.title != null ? 'https://www.goodreads.com' + item.title.parentElement.pathname : undefined;
				item.title = item.title != null ? item.title.textContent.trim().replace(...spaceCollapser) : undefined;
				item.cover = item.cover != null ? item.cover.src.replace(/\._\w+_\./g, '.').replace(/\?.*/, '') : undefined;
				console.assert(item.url && item.title, tr);
				return item;
			})).then(results => resultsHandler('Goodreads', results, function(result, format = 1) {
				let bookTitle = result.title;
				edition = editionExtractor.exec(result.title);
				//if (edition != null) bookTitle += ' (' + edition[2] + ', #' + edition[3] + ')';
				if (Array.isArray(result.authors) && result.authors.length > 0) switch (format) {
					case 1: return result.authors.join(' & ') + ' - ' + bookTitle;
					case 2: return bookTitle + ' - ' + result.authors.join(' & ');
				}
				return bookTitle;
			}).then(result => result.url)),
			'openlibrary': () => globalXHR('https://openlibrary.org/search.json?' + new URLSearchParams({
				q: name.replace(...bracketStripper).replace(...wsTrimmer).toASCII(),
				mode: 'everything',
			}), { responseType: 'json' }).then(({response}) => response.numFound <= 0 ? Promise.reject('Open Library: no matches')
					: resultsHandler('Open Library', response.docs, function(result, format = 1) {
				let bookTitle = result.title;
				edition = editionExtractor.exec(result.title);
				//if (edition != null) bookTitle += ' (' + edition[2] + ', #' + edition[3] + ')';
				if (result.author_name.length > 0) switch (format) {
					case 1: return result.author_name.distinctValues().join(' & ') + ' - ' + bookTitle;
					case 2: return bookTitle + ' - ' + result.author_name.distinctValues().join(' & ');
				}
				return bookTitle;
			}).then(result => 'https://openlibrary.org' + result.key)),
			'googlebooks': () => globalXHR('https://www.google.com/search?' + new URLSearchParams({
				tbm: 'bks',
				q: name.replace(...bracketStripper).replace(...wsTrimmer).toASCII(),
				hl: 'en',
			})).then(({document}) => Array.from(document.querySelectorAll('div#search > div > div[id] > div[data-hveid]')).map(function(div) {
				let item = {
					title: div.querySelector('a > h3 > span'),
					author: div.querySelector('div > div > a > span'),
					year: div.querySelector('div > div > span'),
				};
				if (item.title != null) {
					item.url = new URL(item.title.parentElement.parentElement);
					item.url.hostname = 'books.google.com';
					item.url.search = 'id=' + item.url.searchParams.get('id') + '&hl=en';
				}
				item.title = item.title != null ? item.title.textContent.trim() : undefined;
				item.author = item.author != null ? item.author.textContent.trim() : undefined;
				item.year = item.year != null ? parseInt(item.year.textContent) : undefined;
				if (!item.url || !item.title) {
					console.warn('Google Books: search result element', item, div);
					throw 'Assertion failed: invalid search result element';
				}
				console.assert(item.url && item.title, div);
				return item;
			})).then(results => resultsHandler('Google Books', results, function(result, format = 1) {
				let bookTitle = result.title;
				edition = editionExtractor.exec(result.title);
				//if (edition != null) bookTitle += ' (' + edition[2] + ', #' + edition[3] + ')';
				if (result.author) switch (format) {
					case 1: return result.author + ' - ' + bookTitle;
					case 2: return bookTitle + ' - ' + result.author;
				}
				return bookTitle;
			}).then(result => result.url)),
			'martinus': () => martinusLookup('martinus.cz').catch(() => martinusLookup('martinus.sk'))
				.then(result => result.url),
			'librarything': () => globalXHR('https://www.librarything.com/ajax_newsearch.php?' + new URLSearchParams({
				search: name.replace(...bracketStripper).replace(...wsTrimmer).toASCII(),
				searchtype: 'newwork_titles',
				randomnumber: Math.round(Math.random() * 10**9),
			}).toString(), { responseType: 'json' }).then(({response}) =>
					Array.from(domParser.parseFromString(atob(response.text), 'text/html')
						.querySelectorAll('div#ajaxcontent > table > tbody > tr')).map(function(tr) {
				let item = {
					title: tr.querySelector('p.item > a:first-of-type'),
					author: tr.querySelector('p.item > a:last-of-type'),
					cover: tr.querySelector('a > img'),
				};
				if (item.title != null) {
					item.url = new URL(item.title);
					item.url.hostname = 'www.librarything.com';
					item.id = /\/(work)\/(\d+)\b/i.exec(item.url.pathname);
					item.id = item.id != null ? parseInt(item.id[2]) : undefined;
				}
				item.title = item.title != null ? item.title.textContent.trim() : undefined;
				item.author = item.author != null ? item.author.textContent.trim() : undefined;
				item.cover = item.cover != null ? item.cover.src : undefined;
				console.assert(item.url && item.title, tr);
				return item;
			})).then(results => resultsHandler('LibraryThing', results, function(result, format = 1) {
				let bookTitle = result.title;
				edition = editionExtractor.exec(result.title);
				//if (edition != null) bookTitle += ' (' + edition[2] + ', #' + edition[3] + ')';
				if (result.author) switch (format) {
					case 1: return result.author + ' - ' + bookTitle;
					case 2: return bookTitle + ' - ' + result.author;
				}
				return bookTitle;
			}).then(result => result.url)),
		};
		let lookupSequence = Object.keys(lookupWorkers);
		function lookup(index = 0) {
			if (!(index >= 0 && index < lookupSequence.length)) return Promise.reject('index out of bounds');
			const callback = lookupWorkers[lookupSequence[index]];
			return typeof callback == 'function' ? callback().catch(reason => lookup(index + 1)) : lookup(index + 1);
		}

		if (!testEmpty('input[name="title"]') || !testEmpty('textarea[name="desc"]')) return;
		let nameDecomposed = name.split(/\s*[\‐\-\−\—\–]\s*/);
		if (nameDecomposed.length == 2) {
			let authDecomposed = nameDecomposed[0].split(/\s*,\s+/);
			if (authDecomposed.length == 2) {
				let wordCounts = authDecomposed.map(n => n.split(/\s+/)
					.filter((word, index) => index < 1 || !/^[A-Z]\.$/.test(word)).length);
				if (wordCounts.every(wc => wc == 1)) name = authDecomposed.reverse().join(' ') + ' - ' + nameDecomposed[1];
			}
		}
		if (prefs.diag_mode) console.debug('autoFillFromTorrent torrent name / search title:',
			name, '/', name.replace(...bracketStripper).replace(...wsTrimmer));
		lookup().then(function(url) {
			uaData.value = url;
			fillFromText();
		});
	} // ebooks
}

function defaultErrorHandler(response) {
	console.error('HTTP error:', response);
	let reason = 'HTTP error ' + response.status;
	if (response.status == 0) reason += '/' + response.readyState;
	let statusText = response.statusText;
	if (response.response) try { if (typeof response.response.error == 'string') statusText = response.response.error } catch(e) { }
	if (statusText) reason += ' (' + statusText + ')';
	if (prefs.messages_verbosity >= 2) addMessage(reason, 'notice');
	return reason;
}
function defaultTimeoutHandler(response) {
	console.error('HTTP timeout:', response);
	let reason = 'HTTP timeout';
	if (response.timeout) reason += ' (' + response.timeout + ')';
	if (prefs.messages_verbosity >= 2) addMessage(reason, 'notice');
	return reason;
}
