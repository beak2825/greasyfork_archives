// ==UserScript==
// @name           Mental's Host Checker for planetsuzy.org
// @version        71.92
// @namespace      mental
// @description    Marks allowed & banned image & file hosts on planetsuzy.org
// @author			mental
// @license			GPL-3.0+; http://www.gnu.org/licenses/gpl-3.0.txt
// @include        http://planetsuzy.org/*
// @include        http://*.planetsuzy.org/*
// @grant          none
// @connect *
// @icon            data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4gxYSUNDX1BST0ZJTEUAAQEAAAxITGlubwIQAABtbnRyUkdCIFhZWiAHzgACAAkABgAxAABhY3NwTVNGVAAAAABJRUMgc1JHQgAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLUhQICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFjcHJ0AAABUAAAADNkZXNjAAABhAAAAGx3dHB0AAAB8AAAABRia3B0AAACBAAAABRyWFlaAAACGAAAABRnWFlaAAACLAAAABRiWFlaAAACQAAAABRkbW5kAAACVAAAAHBkbWRkAAACxAAAAIh2dWVkAAADTAAAAIZ2aWV3AAAD1AAAACRsdW1pAAAD+AAAABRtZWFzAAAEDAAAACR0ZWNoAAAEMAAAAAxyVFJDAAAEPAAACAxnVFJDAAAEPAAACAxiVFJDAAAEPAAACAx0ZXh0AAAAAENvcHlyaWdodCAoYykgMTk5OCBIZXdsZXR0LVBhY2thcmQgQ29tcGFueQAAZGVzYwAAAAAAAAASc1JHQiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAABJzUkdCIElFQzYxOTY2LTIuMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWFlaIAAAAAAAAPNRAAEAAAABFsxYWVogAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z2Rlc2MAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5jaAAAAAAAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5jaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkZXNjAAAAAAAAAC5JRUMgNjE5NjYtMi4xIERlZmF1bHQgUkdCIGNvbG91ciBzcGFjZSAtIHNSR0IAAAAAAAAAAAAAAC5JRUMgNjE5NjYtMi4xIERlZmF1bHQgUkdCIGNvbG91ciBzcGFjZSAtIHNSR0IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZGVzYwAAAAAAAAAsUmVmZXJlbmNlIFZpZXdpbmcgQ29uZGl0aW9uIGluIElFQzYxOTY2LTIuMQAAAAAAAAAAAAAALFJlZmVyZW5jZSBWaWV3aW5nIENvbmRpdGlvbiBpbiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHZpZXcAAAAAABOk/gAUXy4AEM8UAAPtzAAEEwsAA1yeAAAAAVhZWiAAAAAAAEwJVgBQAAAAVx/nbWVhcwAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAo8AAAACc2lnIAAAAABDUlQgY3VydgAAAAAAAAQAAAAABQAKAA8AFAAZAB4AIwAoAC0AMgA3ADsAQABFAEoATwBUAFkAXgBjAGgAbQByAHcAfACBAIYAiwCQAJUAmgCfAKQAqQCuALIAtwC8AMEAxgDLANAA1QDbAOAA5QDrAPAA9gD7AQEBBwENARMBGQEfASUBKwEyATgBPgFFAUwBUgFZAWABZwFuAXUBfAGDAYsBkgGaAaEBqQGxAbkBwQHJAdEB2QHhAekB8gH6AgMCDAIUAh0CJgIvAjgCQQJLAlQCXQJnAnECegKEAo4CmAKiAqwCtgLBAssC1QLgAusC9QMAAwsDFgMhAy0DOANDA08DWgNmA3IDfgOKA5YDogOuA7oDxwPTA+AD7AP5BAYEEwQgBC0EOwRIBFUEYwRxBH4EjASaBKgEtgTEBNME4QTwBP4FDQUcBSsFOgVJBVgFZwV3BYYFlgWmBbUFxQXVBeUF9gYGBhYGJwY3BkgGWQZqBnsGjAadBq8GwAbRBuMG9QcHBxkHKwc9B08HYQd0B4YHmQesB78H0gflB/gICwgfCDIIRghaCG4IggiWCKoIvgjSCOcI+wkQCSUJOglPCWQJeQmPCaQJugnPCeUJ+woRCicKPQpUCmoKgQqYCq4KxQrcCvMLCwsiCzkLUQtpC4ALmAuwC8gL4Qv5DBIMKgxDDFwMdQyODKcMwAzZDPMNDQ0mDUANWg10DY4NqQ3DDd4N+A4TDi4OSQ5kDn8Omw62DtIO7g8JDyUPQQ9eD3oPlg+zD88P7BAJECYQQxBhEH4QmxC5ENcQ9RETETERTxFtEYwRqhHJEegSBxImEkUSZBKEEqMSwxLjEwMTIxNDE2MTgxOkE8UT5RQGFCcUSRRqFIsUrRTOFPAVEhU0FVYVeBWbFb0V4BYDFiYWSRZsFo8WshbWFvoXHRdBF2UXiReuF9IX9xgbGEAYZRiKGK8Y1Rj6GSAZRRlrGZEZtxndGgQaKhpRGncanhrFGuwbFBs7G2MbihuyG9ocAhwqHFIcexyjHMwc9R0eHUcdcB2ZHcMd7B4WHkAeah6UHr4e6R8THz4faR+UH78f6iAVIEEgbCCYIMQg8CEcIUghdSGhIc4h+yInIlUigiKvIt0jCiM4I2YjlCPCI/AkHyRNJHwkqyTaJQklOCVoJZclxyX3JicmVyaHJrcm6CcYJ0kneierJ9woDSg/KHEooijUKQYpOClrKZ0p0CoCKjUqaCqbKs8rAis2K2krnSvRLAUsOSxuLKIs1y0MLUEtdi2rLeEuFi5MLoIuty7uLyQvWi+RL8cv/jA1MGwwpDDbMRIxSjGCMbox8jIqMmMymzLUMw0zRjN/M7gz8TQrNGU0njTYNRM1TTWHNcI1/TY3NnI2rjbpNyQ3YDecN9c4FDhQOIw4yDkFOUI5fzm8Ofk6Njp0OrI67zstO2s7qjvoPCc8ZTykPOM9Ij1hPaE94D4gPmA+oD7gPyE/YT+iP+JAI0BkQKZA50EpQWpBrEHuQjBCckK1QvdDOkN9Q8BEA0RHRIpEzkUSRVVFmkXeRiJGZ0arRvBHNUd7R8BIBUhLSJFI10kdSWNJqUnwSjdKfUrESwxLU0uaS+JMKkxyTLpNAk1KTZNN3E4lTm5Ot08AT0lPk0/dUCdQcVC7UQZRUFGbUeZSMVJ8UsdTE1NfU6pT9lRCVI9U21UoVXVVwlYPVlxWqVb3V0RXklfgWC9YfVjLWRpZaVm4WgdaVlqmWvVbRVuVW+VcNVyGXNZdJ114XcleGl5sXr1fD19hX7NgBWBXYKpg/GFPYaJh9WJJYpxi8GNDY5dj62RAZJRk6WU9ZZJl52Y9ZpJm6Gc9Z5Nn6Wg/aJZo7GlDaZpp8WpIap9q92tPa6dr/2xXbK9tCG1gbbluEm5rbsRvHm94b9FwK3CGcOBxOnGVcfByS3KmcwFzXXO4dBR0cHTMdSh1hXXhdj52m3b4d1Z3s3gReG54zHkqeYl553pGeqV7BHtje8J8IXyBfOF9QX2hfgF+Yn7CfyN/hH/lgEeAqIEKgWuBzYIwgpKC9INXg7qEHYSAhOOFR4Wrhg6GcobXhzuHn4gEiGmIzokziZmJ/opkisqLMIuWi/yMY4zKjTGNmI3/jmaOzo82j56QBpBukNaRP5GokhGSepLjk02TtpQglIqU9JVflcmWNJaflwqXdZfgmEyYuJkkmZCZ/JpomtWbQpuvnByciZz3nWSd0p5Anq6fHZ+Ln/qgaaDYoUehtqImopajBqN2o+akVqTHpTilqaYapoum/adup+CoUqjEqTepqaocqo+rAqt1q+msXKzQrUStuK4trqGvFq+LsACwdbDqsWCx1rJLssKzOLOutCW0nLUTtYq2AbZ5tvC3aLfguFm40blKucK6O7q1uy67p7whvJu9Fb2Pvgq+hL7/v3q/9cBwwOzBZ8Hjwl/C28NYw9TEUcTOxUvFyMZGxsPHQce/yD3IvMk6ybnKOMq3yzbLtsw1zLXNNc21zjbOts83z7jQOdC60TzRvtI/0sHTRNPG1EnUy9VO1dHWVdbY11zX4Nhk2OjZbNnx2nba+9uA3AXcit0Q3ZbeHN6i3ynfr+A24L3hROHM4lPi2+Nj4+vkc+T85YTmDeaW5x/nqegy6LzpRunQ6lvq5etw6/vshu0R7ZzuKO6070DvzPBY8OXxcvH/8ozzGfOn9DT0wvVQ9d72bfb794r4Gfio+Tj5x/pX+uf7d/wH/Jj9Kf26/kv+3P9t////2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQICAQECAQEBAgICAgICAgICAQICAgICAgICAgL/2wBDAQEBAQEBAQEBAQECAQEBAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgL/wAARCABcAFwDAREAAhEBAxEB/8QAHQAAAgIDAQEBAAAAAAAAAAAABgcICQMEBQoCAf/EADsQAAEEAQMDAgUCBAQEBwAAAAIBAwQFBgcREgATIQgxCRQiMkEVURYjQmEXJGKBNFKRoQoZM0NxorH/xAAdAQACAwEBAQEBAAAAAAAAAAAFBgQHCAMJAgEA/8QARREAAQMCBAMFBAYIBQIHAAAAAgEDBAUSAAYRIhMhMgcxQUJSCBRRYhUjYXFygjOBkZKhsbLBJKLR4fBDUxYXGCXC8fL/2gAMAwEAAhEDEQA/APOTrbh1lc58zaSrS9o8ex67snqukGymidZh1bdwqquuMhaB9HI1nfZTajIR2TxL5ODy+0g6s7P5w2axlKW3A93y3DkNssxUHhyGKW0cdpKhJ8yLLddV1RL04z7k+pSxptfjA577Wag2anI8rstQkHwWvUjDIWL8xYkJ6bMMgXtRnrvOVPk43rRm20w5b5rOZdfZsKOTLUnV7nahTB7O2wgjfJE3+pdCdjuWMnVz6Qrk9pp6Rk2uVI2SeH6swetJqS653bGd1y9yJiou1Cs16JMosNqQbYVakQA+q6xPXhOsh85Fby+bHfyD05hhsTVOVWZFZzM2tcKszlRW5EialC9kKrdS40ardmHxcUpMdteW5CrK/wBQF0m0RMqwsp9pOdwkNlXc5R63IhxyTinGgMkZslw+/SSgGYL5gMcFa9XqylbyXlp1tUp+X3IDMhweROSg0F1RPy23iBfaOJLejj0zvZDqXRYJfZDe0UHKY2m9La2cJufazgmjXLXOEzCbloTrgr2xUk+pSc3USHwlq9n6Jk6Pm2Y3BV1xmk0R8w6BN8oRrYHyWhvT1YQMwTpGbK3lOkrPSG3VqxKiNuFz92ZdmCGpD4kt6iPzLi9TNfg+VVJmuBY/Q6wXJUuQZPY1V/Y3VbbwXKiohxpyPW8hp2epx4BvwhVh1V3fYeB4AZ34IPp3b47JgVaTOoTLb0VhXm9CFbzUwFppC9X1pD9i/hxoLMnsv0+DVsoQ6TXpzzdclG1KVbDFmO3DdfKw/C90AAU8hcvDHZkfB4xXG6wry91cy6xhFU0m40OM3dmceyyWZXQ4jTvy9kQtBEdsCGQZkP8ANittCCfMtdcf/UDPkyAjQ8siL/EeIkJ6wtA4heXv2ImGdj2SMqtNlIqmb5bIsruG9pkgUQO54yMFv4hlanpwR5N8HfS+PH+TodUNQTshyG3abtH6C6bp51Tj9ZMOZFbklbOs1tq9PiGcWI849KdjPMyzBqORMjFh9vdWNW1kUVtsQZb1Tj3XcV0RCwS6lS7eWO5+yLlV6I7IiZsmiVofpTjqVxroYAINgZCp2JcJWeUhIt2OBL+Dtg6R3pMDWu/NylmZLNyWNOiWMFuNQY28rUudHmuzkF6CqSGT7zTRkKQ3mxaU2j4SWO3ycswAfy22TLyMgyo2qZPPDqIKXp3lgRVvZQy9HpRqznGWzKAQeM3CaOMjK3uPDYoqYmHnW62wfjbgM0q+FFhGoen2BZbN1tyumkZjHs7V0AxfIZNfVwKqYlbIZes25AM2MkZkmGAtRe66qTAeeNlrkPRTMPbXUaLW6zTm6C3KbpYtNKAEIq489Y6K6dVoNCf7pYVOzL2cKbnHINGzfUszOxZc4eMbLJAob33mgtAxKwbGhW7u8FEuWDWT8GugP9O/T9br4P8AJtlZJNqLGPwmHBmTXSbe/Vy+brwJqO03LaRtmSRGgNtK0fQhn2gZzqyFPLQkYkdn1qc7bAHFhl7IWXFNtEzJOba26gXDPiqBWnZcNoDaoWhps0L14HtQ/hJ4vpbprqbmdxrDlOQWWJ49On0kSlqrKFBO0jv2LEdrIrl2xcj4zXuFX7i/LRW3UkKIcVZVSmUbtvmVqt0WmNUBuLGnvChmZIqoH1RmLXqIyPp+XC1m72YqFlvJ+Y8zt5lmyH6XDdkx2lNptsnGrTtULLnSMXRC1pQMbLiJRtHFQuOYxbHBcIp1pv8ANOfbYWCoidpnZEUHti9/f8p56v6RLgKQKkVOlPKnxXGPYYvq2a8Retfj8E+OK8vibadZHieRWuatjkUOBdvuY01PNccqqi2fs1brQoKuNHiLc5NCixnWZcmQ++3Wx5j3Bll2QPNrz29oVt4ZyTiNXHakrbet7aC6y0yHBZ4Yb9AUCMhP6u5Om4hxq3sMfZkRH4zlji01HnkUgd1AzI7j4plw7jHYQoN5oW4tB0xOrRTAMS0l0qwmtmW2OUmR3OMNZDdzc2nxaGrO1bYcebkZBLeeDsw37aVFhNKBKbsciJnn2V6+qNnqjj2Q0HIeWKs3BzVnonIE9+QRNe4ssajUpLwDyIjjGjLCqhXaiSYVhgSalniuZvqsR+o5eyaZHEBhrX3iRerMWOyHmseETPS3y3YrV0X1f1ftfXNl+J6v0NHQZfd1juDya7Ho29RkVpk+X423jFyj4vOt3cL9Ntpk2FMEuJwHl4IEfg02rUSrzYnanlyLLRgosgzpRBH0GMUQoLrKWEmtwbB5ESiJLoIh3Ybc05cgSMiOVKDKdJ8X/pBwnuTwuhe480XmB0nytMdfBLe4cehDT2olad5TWZXVwmX5lXNhy2GngfbbP5R8XWxcKOQmTf0eURU8D9PuXW9ZwsT6fLjgoi3IZRu5NBVQtIOoea2AS2+nwxk+FKeiVSkVQ21P6LlNSbPMpNGDlg+lSMUW71DiwuD8QHWSHMtLV3HqORbzb6VeV1p2bU58B2XECvejlNeticOH+noLbLQ7JH+VZ4eGwDqrHeyfLrzceOM5wIwtjHUBALVsLicQi03GZ+fvxpqH7UeZGxrIv0Fioe/POm1cVvuaHwyBoB8vIVuVLbrzUualj5tPX9qXZVEmhscGwx+DJmLYVsZ+tmCkW3VqIJWMNWrNs2ZiMwGRHtkoCImvbJT5Byb7KaJT5MKYFTfZfFRDTbqZWlcHzXgRXF9mDZ+1JmWfHqJtZTZeZbZRCJQN5sG7rB45dKbzK2/x0VOnBFA+IVnFQMuZG0vw2XfW0/v39vIrn22ruKjM3tMWEBuYiSWWHbCR8uyRCLSluTrnEBCPJ7IKK85w1q0htpkERkLQQmSFbSVTUed692IDPtU5gBiK1Kyyw4hOOXaOEJgJneBCvePSPzYDsv8AW5meVU8mCzgGPU9nZY5kWM2dvCjWQSZEXJBeWVLJpbY2FmC485wcFlom0kOfeqpxKUrszpNPmC+dVdlRmX48kGjFkUE45adaDqQlcWzp224hZt9pSqZlpU6mN5dCntVaNLimY2qTQSAG4r7b9EINbLiHcuNPSr1g5hpnjuK4y1jNZaV+O0NnSR2Z8J6fFZasLBbRXEjSpOxGFkEeSPHbtvQ2TXuiJB1+1zs9pNckTJpyCZfnGy4SouiiTIcLTXq5p1eq5fVhRyR26ZjyZScu0JqjA9TaHCejABukKzHldWQw8Sp4NFclpeB2jhmMfEBzg4NkxLwmsfku1VbT078mDHlSIUOrhyokWI1KJ0UjR22JkgOXB1wmdmR47CqCC7JqIUhh2PViZFsjMw+bXpH8yYsdj2uMyNoMmRlSMT7ZEbQhxf0zvJ4jIV3Clgn9qimNXW/1Wxskw29xaqGDfSNVcK/g2fIlY/NC6oQKtZt7iqC3imKNRCeZbV0nhJp2RFFpl5BQwdlUTs+gU6o0mY4rrLtPlm5HANCB4yt3L8LRttL9mNZ9sObOz3NvspVHOORc0RZGYW3o0aZSPeQCQIT1YZkvNRnB4pJFM9UMCts107sV10GmgJDd/llssk1TcURVRWmdlJN/fq2JFRITFFcTuTzaeK+GPKBhtxAVEXlr/ZMPX4yfo9wjOdQMqvWTjxqzQDR7SKw1iyebLbjUlViWJS5t+xh2J06tEFddS0TTOQYsCsqystRhiPvvMuQWm/Oer1qPU6/Jk1YicgiyqncRKrQPSeK4Dd3SSiIh6tCtG3G0qfRn6VS4zUQU98lGIiICI8SxkUAi0t9Rur8112K3tffQzqHhHoCT1G676c4TY3GT3OJW0BvVXGMtyyPTVlxTnQ6baW4Jp/htpEezHNZNbIbjpHdlMRAsrJx513vN8kJMZfo9NoR12pMQpOa5jouEDquk5EjCiMxozbYDab7hWlIA1G4tLSKxcKTk+YlZptJprj8HLEW8eO0aN+9yyIXnpPFJFEWgsVAxRn6aNLtVqT1LQcb1DjZH6XWpmpEDQQcywbH6Oz/wV1aymlqrnG6VunzSdcNwaCVWO1cWybjTWnI0nLAEHm+chp4NHJFnU+ZJAafGGULKmG3gG6VhkArrYbNwkfPxJfhh5zFIhLl59xiONe4Mf3smXjt95ZE7LzULFM9bjS627Tnr3F6zvT/oXrRimI3OH63ZAGoGSY1mdxXY3qEsCsrZWb4NIYrp2PWthVUcVtmttmnZNhCkMI2hAdanl4CB49b5Km5jp0KqU3MTyyHabMdaiydRIXoaiJsmq+q24cZTzExSp01mdR4pwWpDIG5HX/pSLivAO/laKF+bDhuNOgpqqwtZDDaMwIrkk90cRfoTi2K7Aq7E6oj48/V01Tsxtw4cyS6uoRmbtEK24Q5jz+ZPNgbAy+9U50KC2X1kx4QEl+JqKc/sHXAvlOB5limWaf4dX49IsW9Vauu/W7mZMxaEzj0NTkZHXtVyvbSa6yK+xqLEejkL7Utt4GSeaeVlHshU/t9qmZa8dVjWx4eXak8w8BlsCIsYj4ordvM+EYoXlu+3HtT2Ceyj2Ss+z92vxsxVUJWZa1TeEYOi5c9JAQNgWybaPRAedBwyHRdGVtRRuVDhNKSVNuw2W6qngXfqVFJNxThv9yF/frYEHMTVQhxJ8Y72JjQPNkS9QOi2bSEXy7vzEWPFOZQnoMyZCkqpSobhxztutJY5k3tuTW1bU0u56YcBejDVj+DK/PGMOfl49YVM697kY2XJcWnhONIs6VCU+6LbrR91sBFXVabMyDZCXoIOf6ENQcphSrZjbgxyEukXV1W4fL5iH82Ci5NrSQmqicVfdZAq9t8oB4ftTCpa0ledMG2Y3dcJREG2W3HXHCJF4iAACq4q+NkRN16OHWVAEN8UtFdFW8R/CvP5cAvozVVbbBXjLy7ulS7h+Fvy4zDpS4ibLHDfzuKiSLyTwSKmyLvunsvX0tbuW1tU4enXqJbV8LvHHYqYaGYmai54ovzdX9ONtvSpfCIwO67JsiFv77p7J9u6/wDfqOVYBOd136y8uPv6LVNb3CG5NwpyFbem63q588FVTpaQRSTsqn80vdEFf/TbT228+3v1CkVlq9LgQ107/wBa4IxaYSNrqvO5f5JhpaR4lTeub1KjX3Aysm0vsssY9cmvcG6iOMw7Omeknp96B9BbKC8nIKhzEcGe1Ju4MhBOQ7Fo2ZbYstxwTEAwmn6wbiqpNPKEl1F52gqWxm18OkFcX43btumNchMeCkGBNpxmQ92aJVtvtG110e5dpkbSqJd13mHE/vXHgVrkeN0lVTY5jFnT6b0ORZxidbaE/R4/iOTUdDYw3cqsLph1WquBBobaY6L7LPzsFpuScD/Mm10+ttU0qVU65IhJUK7BP/DXmo2m8JALyekw5rf1IW4VuxWeYQnvyKdRo4p7mIqStAI2CQjr3+m3vTpt2484f/k+2+Rem/F9GKq2snM0pKLPvUxdZJcQna68yH1B6kahYDZac5Db3ltLkTosqtw6suDeiOm68MetZWXJ7xgZqFey7XwyjTKVTEGoTiYekyXtdbpMl5kWxu8ygOt/mLzc8S49VjhXJzshsW2WW24gBoNnDbaPiiI91pGev9OPRHpvotGLTv8Aik639Wy+ttJ0t24BDZinUUFIH6qERpxe27JelvPPN7DzQmVAXU4cSu6VXZMKVTqXNlaNDFjsnoX/AFy0G7bu5CJftuwmUyhi/TJM2MKyJEd189//AGQC78xJt+/Can6KPXNfkjtnTmsGJQ5DfyYEiI+1xdhU8m5r4kg14oy4SHDlMGnIHe2A/wBXU3MtbaWjy4kV0XHnmzRCLcOgCoWknm5pux95UprDeYKdOkmbLUd9k1FQ8SdAv3dMQg0g1glZ9rZj+qeOVERzB8Ca02wG9zF27QVj5dkrFZZWWngY6bS/OMCeSUtq7PbNttlyCEbk4ZmLflBNkT4Lr9LKYUN2UDzvu4GXQoOKJqut2qWr+UrcexjMJqPl+czGeNxJCO80uAVQSaNLkTkX6XzelMWuaKaQaf5zTxsvng3N7N3ZlUQkAGoysV13dqEZ9psESYw887FcNTRV2ZQRXipdehnZ3m+oy+zPJhNGrn+BBl0/EibIguH4chTpx5gdp2UYtN7TM3sOCKmkonxTwTjNMvf1mf8AT04mlhmQwbCK9hsqEwkaPBk1YRgBAZSKvJo4/AERAb+XXiiJ7J48dTa1T+E59KtP7iMTIvG7luXESi1Vs2yorwI8w42TQDomwNdT/EuIsacaWY7p1rJaORYzj0OkjyGqeTOACNpywe89tzig9xiCJMCSbFxdJS+ot+nWp1GRVsvMI4SC++Iaii7i05X/AC3f2whQYDFOrrhCxxG2VPS8dykq/D5Rtwm9TtO3LPPMnyGJQP1NLeXc2VXgUBzaQo9tuXJbaZbXsi7LF57YuPh7fo3QZyR6XEhk97zKjil+7puJUFPyog4E1uIr02RKGNwY8g+X2W9X+bAYxgFMHhx94i8pujHZFfHlfDS+N0T/AG6KnOMQtQOZLdgULCKtvUGO7CwCtRou24qj3F23Rsl+0E/KIqfvsqb+eor05xS14f8AzVcTo0JeGui6c/7Jiu/4dPr89HOgekeQ5bqjrhiNJq7rrnd/qXn+H01NmV/Mwmta+XwvSfTBHajGXg+TxrSnG8Vr2mwcUWz+YIdlM+qNoC0tylcaSQNz5xk4oJzNG9qMgv4Q2omg4tSuvSW6oUa1RhwE93DUl0Vy5TeMdLeoyJdfmxInUv4lPpl1gyXDdLanWCpLRx9+Rm+s+UPUeXsuXVVUz4szF9FYEB2gGVIlXt21FlXRdrsN0NS9DNwls+Cd5zkerVyNQoAKTUdsH5xjyQA7mWV+dw7tvfb9+OMQvo+hu1+Un1kpSZiNL1ncn1rv4E7kX5fNiR2Nevr0uZxbWE+NqditbJjhJrnQzZh7EWrRoDMEnQ37tlluZAcFeTaq4DvHiJsh7dP4U1Eji0Je7iS3ebpHTb+q3lhJWqsuyHHHm92ijaXmIhtu/wAu7DNwn1d+nGlpbKo/x10YlVsgZRyY8rU7D2gA5DXbeQWX7YO0wab8kRNlXrjUaOEx5uTw1ZcbVN/MtfH+OCFLqjseO/HHV5twV2+nUVFf2a8v464X2r/r59JsbFbCsb150oO1uoH8NGximVUeRZFOSya/Tmwr6+plOFNmtRnHEjiSi0J8O4bTImYRPotuGj8qU6pRhEyJCEuW0jO37xuXBSPJlVOVDhw0FuURgAX+c0UbBUhQdtu1PHHl19O+ZZhiusNDhGL3Dz+nmpmo8LKDrJ1wzIrcLo8EyG7nvybKM00YyMqaocfw2FKcafGMwch9silvB/LwxnvLMBqsOTmWk95ZDi3aaHY82qNNlzLkiHcY2oWPVTJWZJFUyWMd6CrjsUCZJ665CNltriEPJOt1FEO9NE9W7F6OlHr40d0V0N00udTsvu8el5dHyfIsSiphGYvjlFQxfPR2DpbVmmKDNRuG9WrJQZKLGKcCPCB8QLVPYk7SqjkiFRoU8JUmkk63IEE/Ramdv5dE248/vaHpdapfaRVarMp5w4lWGMccjLcYjGaE7vzaabe7EeMq+KdhljnEfM8c1HyPG0qphS6WpqsdyF2GCqhAf6uw/ABq5deAiF0XgJtALg0CCO/WgAo9LdhOwpdpNuJovJbk/DjMch2vjLSdGL3NWy2GhbS+Uhw6sY+MZoRZTXX9QI2Wwp7qK+5c4villKhvObIu51E54HonPZPsedBF/pEftHu5YZaZ/wDbZCOgygjuBUK3wQd3l/DgszVKm86jtTY/xDi/pQNLV5fC3bg5uPi9ekW3gR4DsrVKazG74oS6dPxVVJBNmouOLeCrg8gHbdU64xctTkddJtUbVywtpc7R118Pgq/74nvVEHGm2XAVzh3eKbtfN+9gND4oXpGkEvbd1NDffZtrT0dhAfdUFcgVVRPyq7/82/RYaLUrUVC5Fy3fwwJckxwu1ZUVLdy9OCyr+I96U5kYnWpepaCLpNrz0+NC5CDar4S38fcif7dfh0GsaoqCi6/f8Vx2j1GEjaopqui/2TCt1R+A76cdGdM9QtW8v1rzuHj+neHZTqBlRwYOKsvhV43WTb2dFrY4USo5LcajKywJOKRvSAD6lLZaT/8AFFGpcV6Q3RRFqOJHdaiESgmo8y8qJdy/Ni+P/L+XMdFkqmCSCMSuJbkFFPfz+K7eeOdpf/4fSBkemenmQ5hrhkWHZzkeKU2T5dhv6LDmxset76M3azseKY24y5Ikwm5TMJx/bibteRNgjXAEhZTzS3S4D8mRSFkT6s8T8k7rVudT6prkhpYyGiJz6tV264IV/JSVGbGaGpgzHpbCMxw02gA/pTt8SMtS+wVw89OfgXel7TWznWGsWpGR6ntza2dDrceZj/osWNNNw+3ZC7HdJ6TIaYPtgCuACGIuny/pbHc4VGcAtQKakfhqhnqV1w91vcNuFscm0SC4Tk+e3KVxLRER6Sw7MP8AhSfD3xGHDh3eOScqkpIsClHkTsKK3KGxjwWlji0W6RGGWYLa7tFursgz57miJCl5lr1xKJNsiXzXc/4f7YmxMt5eEEEr3ND+Fvf5fN3W4C/Ub8NT0LYtpTYZXprp3UY1e4LHn5JFmwcmkpPtAiQLCW6ESW5aJ258RGxlgZIjas1ptmqAqKivmLNVaSnuunNaJuODqmzpzdEmlG3qw65Vy9l4qpHhjBMTkOR0Zkf9t73gVTy+YLt32Y87VJUYRX5rNo8MzKsuJd1pkXzU5t2arOPTpGP2uT32LMzX214zEhwK+A0SKLbrlg6COk9zdPCknNNXqEaVWapIBp+pPAjQFcCgAiPGQu+4QasAO71Y9So+R6VBAaDS2T+jKKBqZ3DrIInEBpy1O6+510txenFg3wy9O9LfWdEucA9ScKxlUmm2OPZNiESPaRa9urK8lwMdmRa4bGEXy1Y9jkOhdRtoGnhchiZL4Ilub2e63Py5mPM1Ppz4MhKiNOuofNCdB4lC0uWq2Gmv4cZg9rfLFIq1AydW5sYiIZbzIGHgyTIaIf4FaLT1a+XF2On3w5fhxacwhiVmkeLZTNhoBu3GcZAWTWEwn31RhuU7Om9rgJOGPFtptOPEfq+lU1I/mfMslVL6RbZ4i6aCI8sYnYoOUYl3+AOQ4oiQXLcBfemm23zYLsz+G98PDPorrdxovguOPOpJnSLHE7+RjE1tyX/xEpybVWoly7i7Dz3EF9kTz1FYznmKIpK3VEkIyvmFC0+3wwRcyllCXaUiCkNXkToPl8vV03YVFJ8Kb4b2BWf6jHjjIlux3EZj5hqCxlcNhpxUI5MeuunHGm3RD6QeIFIE+wkJOXXY+0vMTgqJS443d5IOhf1bcRj7O8ntmtouCiDbpdr/AKYc2Pej70N1lFLpFp8FymNZQrKsdftq/G5qtRpwONqgrAgtDHVsHOIOhxNEFNz389DZHaVVBeRVqoNiJgegl6R0t+4vH+eJMbIGW22VAGVc4ieOnLCAs/hOejS9sZtnT5EmOw5L/JKiqvX66DFc7bfJGYp3n07ioEqpsi8vCdMrPa5OFoBMmiIU01V1EXl9icsAj7KaWTrpg6oC4V1vDTlqicurEDviA+pr1M6x+mzVLSzSrFNQNQMrzi2wWqKijYM1j1K7jFdqNjF1lbQW958lHZinQ084HBJ9SfB42h5c+PWVQqtcqUSQkirMijwmJBxQW4bC2ingX24utGoLMxsG4LhKJIW8DACtW7mS9/3dV2i+GLLpPq01ByKLTsyXqyiVulqmLY6xxtq0n2ny7RWL8mUYf5Zs5KuikdhRFtEUe47vy6khWMySWYsf6VbbGO2CGLac3TtFdVLp009OOrrFNEnZCwl4xKRXbVsD06eP/Pvxru6y3Vg1wdvm46cVaUnZrJEDaHyNW1FUcQ1TwpI6i/SPLz0STM9QiRCF2uI2miIWi2n1eHqwBWmRZT4uBT0kG0tw3jamuEtfPMT5TsxMkekq4R9tCsEARRxd3HGx7qkqkqluqr5T3/qXpfqGeU1IGZ5panWVyDp6v+fwwQi5cRNDOMjYktyjp48/LisD1y623FfNwz064ndNJK1GZsHtRbedbAzDxnBCr5xGtlIkPdqLBOLGnTp6uKiHWVJRz5NTlRUitZuqkiMkRtznKUb3PO0zaWpIXcIlpp9640H2P5EpKrVs71OKTzFDEAgx9Pq5M5S2CodRWXLquKrtNvSlmFljd3mWlNzNiUtrJZw9mBKl2U3JskdyGxsApnKlttlz9QnLXtSHZSuK00wLLZb8eEd2rkqI1iY/GOAkhWXRFnTvW/bp96iO4unGzKnIhZMpNPkVGdw5MmEkmUZ7gBG0Ei3fC89ADvxb76XfT9K9P+qLmBv2RSZsvR2huLKWEkx3vnbR4LNmEYH/AMHGchuRQLdEVGQP/wB36rOoMJyi5xcZvVlHIAncK23PcQLx9WgjyH7sY27RM1Jnrs7jVPRLI9cksiFuz3dWQ4G3ymSEZ3fbiccuuvmnTSJIdlivJFWW2j/JBUfoF1FQjH8fUS+U6tc8+yoriRTbRxG/OqEvlxmN7KbchvjNOKPIhQLkG24tw4CX4GZNq81Fs58cHkcalMhIeFlxl5zk4z2zVUQEX+lPCJsoryHqZHzXH1sL6sXEI10G3q+/AqRl2aooqjpw7RTndyHuxnrMMmmAnKlPCZJxVVeNVUUXZBNSJFIeO226beC6WqnmkGny4DKOBoP5sHIVBkOsgT/Vrg0j0UyK0KMzXlba8CPeMAUSRELkKnsobIO6bKioW3HoCeYGnzJHIyfWYPrSCZtQFTXS3BjVUz5xeZOKSk4u5KiOKuwNp9you22222+ybddxqEDRdIoimvdcePgY0kdU4evPwwm8kvq2is5Td5YVdJXq0zJCytrSLBYF6ZaLAZZcblKHBonnIqC8hqCG7wc7e7au13BqMZpxgHzT65StvQdEL4L02mQ9PfixWqHNrEJ+VSmPeigqJOst6mQAQEXFG7qT/XHzZR4kWC9PsLKFXQmmu8c2RYxIcYGUBHEcSW8+I8FaXkhIWyj7fd06u8B6IYyJIwGkS24Ds5KngvhhajQ5iygRiC4ZknJCbMuZeW23q+zESdTteYON1zsvT+rfzGU3KJqZZW0i0osXjQ2gJx+TFs34SldPkSCIDHBWURTdJ7igC7XtUcoKATMaQ5In+Qkd4pW63KunIdE82Lgyp2c5pq7yOVGElJgcO4SNobyK4UTlt2ldt54r01h9V+ttvPTGMQ1Vw7Ebq5FuFSYxQLSVk2XNmIwA1kXIsp7z7sxz5lke6jkNBV4e1xc4h0NiTI7bjLpslMZiuDqhulaqa89dv7MW9RuzbLEDgO1QDqclu4tei38SeYfUmKdtQdSc0zLViY5c293kjLl27VWuR2EoprVtIi2MWNatOzlcL5lTkwhb3ElbGLVsMCv0OotrSqUy5Qa09GhIy7VGiNse8gaCwws6upC5/DW3FrUmHChJANuO17sJXAgAKNt9KX2dJHu3fmLHqt+HM7j736J84jDcHD8OVyJHcMVEbiyKJCCU02ScVNuOBJ3E2JOQ8V6q/sxWDCzBIn1JUtjtkQXcxvM7BIvSQXFilvainVN2gwadCuZCpSBRUDdsaErt3fYS6KQ9O0cSC1WiFW+pDRjM659tusyyJlWmlmrZqAJIktrkVQTiIqCIuSYZKKeFQo//AC9WFV50UszUObHkg43PI2C59Pcafv8Am+bFA5TbST2dZ9pMkVKRT/dqk3cmm5q2M4v3qJitqfbu5YkCCzog8EJHgbReSlsXBE2XfffdNty/Pv8A9OjvHUQIAdEhc6uVy3IpeGK0VkdT4jZcQu8btNN3pxrT5hqCuEAIioPPiIKSovso/lN/qT89QJMh4g1d3WLp3W24lsMpqug8Nfvu1+GOSLnIhIXPC8txJF9+SJtsifn3/wB/6uobZgtycND5f/WOpI5oOjui6/3xutNqRqnLw4ngVJfCfhN/+u3X037u4rdwJePfjq4ySIi8VdAXBXXRnhYVAcLj3F2+rf8AoD91Tb/ZNuijLLNuqNpoXP8AgmIB+8KSqJ6IuK1vVpjGq1nNirBwzDtRK6tv49rVwbt5+pkwq75tsbetcnxWlckx5lYjkeQynJt3kDp8HozDzdL1OZSHac81PVYot7rxErjMSuEh0Hld0/rxdvZvUK9QswtVOnOtORnCJt5m1NDZMCC0ruX1Yr95L0oWIc4x6aPVjKYhXMXGMKxGewhPQ2Fp3riK00g84zSnJuCV9GgURV76nzRtCNd/HS8dQpbzQiMmS/EG0uoiIELmvVai7rtLixdJ9pLTEp0zyrTm3nFLS00BzqW0hHSwV7vNgdxOfqk16nNN8J9Vl7gWX4Jjrcm1LG8CermqR+ym2H6VTDk7zEUTspcSXMbmSYcoC+gWWeboN7dHZtPp8XKJVimtPA488Td7oIBkCjcSASEXI026qSWl8MRaFnt3N+ZanQ4jLTT1PhhJPR03VcNXAa0QUTZwU3Knm78XVZBj/o+vY09yyoserGHW1Gay9asPSB7TfFBNVhJz2+pBTbdE9uq2KpMuOIUZh5lktqt8a67l3eHmwyMsZsiCEVx0JRaql9hc03csVGZhoV6WNSsq1SxbCMXiFDqrSFNrLeufWDcQLqxroRdpg2i/nxzWK2bbchokU5Z8R+vrbvYUAVrI1lXbJ6TBkvNAbqWlwSQC4W7vERLRF7sWHTAdepBx320F/wARTyrcFvLq5244Pof1ZqMCv9X8fzGzOMzjWQQ8HorZUTtXMWotLtqQbDLTi7OmMauVwF2MSLhsYkJDVFZyO7QatOGmSm3mJ0h7YRJcI8lQU1+csZ37eq7DORRGJJqTkVuTsArtLjQBI7e7cKimtpcsPb14epnOabSrDn/TrgmWZbqvF1V08uMdl/wjdpSY5AYsn495fTH3qp5qwjNV8kxcjihGrUo3U5K0gFOSgkyAzaq4EWDTVWR8ymCbdLblxTXZ5XqPJr8mkuK77vXIkiCd+gtpfZYal8pBql3p+3Ez9OdZsl1FF6Szhc/H64iNx+XeR51a1GfA2nGodWxPjhJuW1iv8vmu0w024yrRtEXLgq0+ryHBI1Xca7R7924k3Jy9OOuaMtwaPJZhMSxnOim9xOky9X72GvIlSQRHnH+4shwkMVHj9gt8UTyu6bLt58/9umMJch5ojd3DqS/hQRHUsKDkdppxQQ07v82M7MoyUV5InjdF87f/ACij/f8A28dfwylQrdMRCYXkuvTgoiPCSghODuqeyKiqv5FNv3/t/p6+DmiDgIramuO6toScy5YOK4mPl1VXNlVxVX2T+kP79GI05eEKF3jy8fBExGJlFJVBdBXBYWGwbuIciyYZMXjeRtFAURtUNd/uRFHfb3/ceqBrNGn1RGW9VFltOZD3Fuw506rt0lyS6wVxuLd1dyf/ABwMZJi4NVhNwkRsF4tEO6D/AC0IVFwC32Ed/dUTz488eXX9Eoj0WK9z5EuhiXeQ2+XH67V/epHEJsHC06rtxYq81n9HmFWdtZZbSxbmgvHJDcp6HUsRJlZKcfkNjJmuVExkkab/AJnNwY7jQGpc0FoxExkzs+1im00aLNgtSqc2i2XdScv+FhhyVRmIuZYuZqROKm1AUcQxErheEkS5pz5S8t3jjaxD0NJkxC/lGoOd2tU6LYvMRX3cdAxLij5JOKdJkC6hfagEqihcUUvvStCz2wCmDNIb4qpt7tq+rGiJmaKtwgQZQNn8R5lb8MOd/wBK+k+nkijpMa0+oGKB2K6c+S/XfqEqynw3O8k26tZfN24szM9+9JceeVB+slEUTq9ezXOlZdpMgHai5HYbMz0Hb3oCf5URf3cDaRNOX76K1J/3s+ZoKqO35fh+L1Y7+mGl1LQZu4FfXw24ZzX7d5RgRmUAxeE40dplttAbZB8m9kBBT6SL/V0CCsyJWcyaWe7IEXVcFT7h/wD1/bFY59p7BQZcl0OM42hNIS7jVCIl1IvNzLqw6dZb9LexpaaMb6vxI7rrxg64qCyew9ntouyiTyIqeyojZJ/V055vrqVlyLTQNWTbEtVQuRJbuT9eKrytTBpbb02UyhI8SCmvK1NfKXq9OAGniPstqw2Aghr5MlFTTx9Sp+Nt/wB19+uOW2I8eATZqhE4V3PqDb5vhj4zJOclzkfBlWWXB2B6R8ol9vjjovsqjjLfc59s3C4L7DuKIpEqp9PIvx0Zm1ONGBiMyHMltX7i82F+JCfkK46ZLrrjPxQEFd+K7oieETdPyhIhKvQgpLhOeNpePl5YIHFRsR1Lcqbhx0orn3EiKRIiIO2/BVTfb8oqpt1KB8mkA0Mbdd12OFhaIiiqapg2rJDiRyQhTw6vHczRePBvbdERfO+/U9mZsXUFXmuPhYzqKqD3ftw4HrlHoZsQTXkr7qDx3QvqVV4eyqh8iNf2T/69PVMygrkdu9lCQkW38WEGpVwUdIm3lFNeePqprpsjiMpUeF9U5NlyUyFEQSRB9l3RfdE2+v7R6jScjg6LnK21S1HHeNmMmQ1Arl024wWOF1Mow+a7rZBzFpoUbcVEJE2Vs3B5AiimyLuu3+pekSudn8GeCge0xD+2HOjZwnw1ZINNy4z19JU0zZvPK8UKMBG40ZNdo1XbgJKiCpqpKKbb7EpIil1Ukjs9plPM5pIpIylxIvjbixms4Tp6e5qqCbnJC9OAbLXxu2xmGAswYyqDERlEFGt1+j7dkN0lXjum39ugkWuSooyW22kZYJdunmHD1QnEpySCCSrrzwDqpeA+b7MAFOysS2WZ2OPJl5sBHZSUOKlwRV2VXOfFd/Cb/jbqNQpEyPWgqC/WOlfoP4u7X8OI9ekxqjAdiGS2kQka+bRCxoDjs16VJuJ8N35uQRIIKoCEZn6habRxS28Cvvv45fuvTbSfpV+TJmyxQn315p5QG7bp9/mwoVd6mCEWLGJfdoyLoXmUvNd+Hy4/Ha12AyL5/LshzVNuSHyEVRVRV2RE3Vdt9/bpjalOxhVHFQVJS/dwvPNNyD2JcoW244DqsOy0dD6RIUQiROImW6eeKJ4T8b/nqO9UGnjuAriLl+zHZmA62CoQoKrzx9utto4iESbbIqJvsvldvffwn7ddAdkOqKAqigr/ADx8cJsNCcS5dMZmnTDdRFOIqnhF8/hFXZV/H7fnowwDgK5xiuDERw2DQUEeeCSvmbsF9q/zFTdUU/YQ9lQk8dMTDUYm0XiLrrge4uhaaLyTDyroUcd/oVU725IpFsSq4q7r58LsiJ428IifhNrso0yQkGIl+qKifyLFPz4bBPSNQ5XF/PBZG/kS92907ZNoCbrsidvf2Rfff8+/TlAbbfjPm4CKWhfywvTE4EhoG1VA1Hl4YPJkGK+3HNxkSI4/JS9lReSEnFU/ZfbfdeqTr77jD76NrogXafvYs2ix2n2gVwdVWz+en8sAF9IRIjkZY0Ym1cIF5tkSrxNlAJd3NlNOW/tt4TdFTx1SuZK1MNpxhUBG+XcPPrHx1xZNCp8f3ltzRb9fjheZAy1HpIystgPMVIvpRd+LbvFF3T2Rd9vz9S+dvHVSpzc1Taqad2LBROG03oqrdyXX4YC6cBeaF1wUUleQf7Im/FNvz7Inuq77Jvvsmx6iNiqqSpzC7TA+ouEjxNougmvP93/bHZlOE40O+yCJoiAiKo/SqIiqhqu6/wD6qeemaO+4rZohW2KuipyX9uF2U0AuOaJ4YW+UPG4LUYlTto4JePCkR8k5F523TZNvG39uh8ozM0EjVUBU05/HvwSiMti024gpdoXPAcRqAOqPjtA2opuXuRiG6+f2Xfxt5FN908dTYTQG4lya+P8At92OMsyElRF01RMYifNezvsqkiqqrvv528eF9vH56bI7YC2hImi7sAjMlcJFXVFTG8r7goLabIJApF4Xcl3H3Xf+/v7/AN+pa9A/h/1x8IiITWiadWCCq8Rl/O7pL587fQ2myb+yeOpbHQv3/wBkxweBL15r3Jj/2Q==
// @homepage        http://usa.x10host.com/mybb
// @downloadURL https://update.greasyfork.org/scripts/2025/Mental%27s%20Host%20Checker%20for%20planetsuzyorg.user.js
// @updateURL https://update.greasyfork.org/scripts/2025/Mental%27s%20Host%20Checker%20for%20planetsuzyorg.meta.js
// ==/UserScript==

(function() { 
'use strict';

if (window.self !== window.top) { return; } // end execution if in a frame

// List Of Allowed Image Hosts & Links
var imgHosts = [
  '.fscache.com',
  'depic.me',
  'dodaj.rs',
  'dpic.me',
  'egafd.com',
  'filesor.com', //this is part of pimpandhost links
  'gfycat.com',
  'iafd.com',
  'image-bugs.com',
  'imagetwist.com',
  'imageupper.com',
  'imagevenue.com',
  'imdb.com',
  'imgbox.com',
  'imgcredit.xyz',
  'imagebam.com',
  'photosex.biz',
  'pics-hosting.com',
  'pics-sharing.net',
  'picstate.com',
  'picstate.top',
  'picszone.net',
  'pimpandhost.com',
  'pixelup.net',
  'pixhost.to',
  'pixroute.com',
  'postimage.org',
  'postimages.org',
  'postimg.cc',
  'pixxxels.cc',
  'postimg.io',
  'postxxximage.org',
  'static.keep2share.cc',
  'turboimagehost.com',
  'turboimg.net',
  'uploadhouse.com',
  'www.usa.x10host.com/',
  'winimg.com', 

];

// List Of Allowed File Hosts
var fileHosts = [ 
  '1f.al',
  'd=planetsuzy.org', //file.al with planet suzy marker
  '1fichier.com',
  'filespace.com',
  'Babepedia',
  'clicknupload.',
  'clickndownload.',
  'CloudZilla.to',
  'depositfiles.com',
  'depositfiles.org',
  'depositstorage.com',
  'www.usa.x10host.com/',
  'dfiles.eu',
  'dfiles.ru',
  'fboom.me',
  'addons.mozilla.org',
  'chrome.google.com',
  'addons.opera.com',
  'microsoftedge.microsoft.com',
  'fileboom.me',
  'filedrive.com',
  'filefactory.com',
  'filefox.cc',
  'FileJoker.net',
  'fritchy.com',
  'fp.io',
  'gfycat.com',
  'Hitfile.net',
  'hil.to',
  'hitf.to',
  'hitf.cc',
  'htfl.net',
  'k2s.cc',
  'keep2s.cc',
  'keep2share.cc',
  'keep2share.com',
  'mega.co',
  'mega.nz',
  'Neodrive.co',
  'planetsuzy.org',
  'ps.fscache.com',
  'rapidgator.net',
  'rg.to',
  'sendurl.me',
  'solidfiles.com',
  'tezfiles.com',
  'usa.x10host.com',
  'wikipedia.org',
  
];

// redirect image hosts
var redirect_hosts = [
  'phun.imagetwist.com',
  '1f1.de',
  'http://2.ly',
  'sarumann.net',
  'anonym.to',
  '7.ly',
  '9m.no',
  '9ui.co',
  'l2nk.com',
  '24Uploading.com',
  '37v.net',
  '2009.lt',
  '888.xirkle.com',
  'abload.de',
  'adultsimage.com',
  'http://ah.pe',
  'amzga.me',
  'anon.to',
  'anon.click',
  'anonpics.com',
  'apog.co',
  'binimage.org',
  'bisi.pl',
  'bitsy.in',
  'http://blogspot.com',
  'brtsn.de',
  'buspic.com',
  'bziu.pl',
  'c00.co',
  'casimages.com',
  'casinimages.com',
  'clk.im',
  'cloudimg.net',
  'crd.ht',
  'cr.ma',
  'cut.cc',
  'cutt.us',
  'damimage.com',
  'derpy.me',
  'dimtus.com',
  'directupload.net',
  'dodatki.net',
  'doshort.com', 
  'dryu.gu.ma',
  'http://dum.ps',
  'dumparump.com',
  'dumppix.com',
  'easyimghost.com',
  'ericsony.com',
  'f7tw.gu.ma',
  'famouscelebritiespictures.com',
  'fapoff.com',
  'fapomatic.com',
  'fastpic.ru',
  'filefap.com', 
  'fileshared.net',
  'fireimg.net',
  'firsturl.net',
  'fiurl.de',
  'flyt.it',
  'fotoupload.ru',
  'free-image-hosting.com',
  'freeimage.us',
  'freeimagehosting.net',
  'galleries.bz',
  'gasica77pornpp.com',
  'www.gg.gg',
  'girlscanner.com',
  'gokoimage.com',
  'greenpiccs.com',
  'gu.nu',
  'hizliresim.com',
  'hnng.moe',
  'hollywoodsluts.ddns.net',
  'hostimage.ru',
  'hostingfailov.com',
  'hostingpics.net',
  'hostmypixxx.org',
  'hosturimage.com',
  'hotchyx.com',
  'hotimg.com',
  'hqpictures.org',
  'hts.io', 
  'hybridupload.com',
  'ieej.lv',
  'ilnk.us',
  'image2share.net',
  'image2you.ru',
  'image-boom.com',
  'image-hoster.de',
  'imageban.net',
  'imageban.ru',
  'imagebanana.com',
  'imagebax.com',
  'imagebin.org',
  'imagebunk.com',
  'imagecarry.com',
  'imagecherry.com',
  'imagecorn.com',
  'imagecurl.org',
  'imagedax.net',
  'imagedunk.com',
  'imageeer.com',
  'imagefast.org',
  'imagefolks.com',
  'imagehaven.net',
  'imageheli.com',
  'imagehousing.com',
  'imagejumbo.com',
  'imageleon.com',
  'imagelink.cz',
  'imagelook.org',
  'imagenimage.com',
  'imagenpic.com',
  'imagepicsa.com',
  'imagepix.org',
  'imageporter.com',
  'imagesadda.com',
  'imagescream.com',
  'imageshost.ru',
  'imageshack.com',
  'imageshimage.com',
  'imagesion.com', 
  'imagesious.com',
  'imagesist.com',
  'imagesplace.net',
  'imagespot.org',
  'imageswitch.com',
  'imageteam.org',
  'imagewaste.com',
  'imagik.fr',
  'imgadult.com',
  'imgah.com',
  'imgbabes.com',
  'imgbar.net',
  'imgbd.net',
  'imgcandy.net',
  'imgchili.com',
  'imgchili.net',
  'imgcloud.co',
  'imgcorn.com',
  'imgdino.com',
  'imgdollar.com',
  'imgearn.net',
  'imgearner.com',
  'imgelite.com',
  'imgempire.com',
  'imgfap.net',
  'imgfest.com',
  'imgflare.com',
  'imggoo.com',
  'imghaven.com',
  'imgheat.com',
  'imghosting.cz',
  'imgim.com',
  'imgimg.de',
  'imgko.com',
  'imgmad.com',
  'imgmaster.net',
  'imgmega.com',
  'imgmoney.com',
  'imgnext.com',
  'imgoutlet.com', 
  'imgpapa.com',
  'imgpaying.com',
  'imgphun.com',
  'imgpo.st',
  'imgpony.com',
  'imgrat.com',
  'imgrex.com',
  'imgrill.com',
  'imgserve.net',
  'imgshow.com',
  'imgspice.com',
  'imgspice.net',
  'imgsure.com',
  'imgtab.net', 
  'imgtiger.com',
  'imgtrex.com',
  'imgtrick.com',
  'imgur.com',
  'http://img.yt',
  'https://is.gd',
  'iturl.nl',
  'ity.im',
  'jdem.cz',
  'jin.ni',
  'kepfeltoltes.hu', 
  'kiwi.com',
  'koinko.in',
  'korta.nu',
  'kortlink.dk',
  'lc-s.co',
  'http://li.ro',
  'linkbucks.com',
  'linkon.cz',
  'llk.dk',
  'lookscool.org',
  'lostpic.net',
  'lstu.fr',
  'm17.ca',
  'mcaf.ee',
  'megaurl.pl', 
  'min.qa',
  'miniuri.com',
  'minus.com',
  'miragepics.com',
  'moneyplatform.biz',
  'my.rs',
  'nfgn.com',
  'nubr.co',
  'nudeimagehost.com',
  'nudeshare.com',
  'ouo.press',
  'paidimg.com',
  'passpix.com',
  'ph.dog',
  'photobucket.com',
  'photoearn.com',
  'phototo.org',
  'pic2profit.com',
  'pic4you.ru',
  'pic5you.ru',
  'pic-upload.de',
  'picage.ru',
  'picbucks.com',
  'piccash.net',
  'piclambo.net',
  'piclead.com',
  'picleet.com',
  'picload.org',
  'picp2.com',
  'picsee.net',
  'picshick.com',
  'picsious.com',
  'picthost.net',
  'pictr.com',
  'picturedip.com',
  'picturelol.com',
  'pictures.se',
  'picturesion.com',
  'picturescream.com',
  'pixhost.biz',
  'pixhub.eu',
  'pixic.ru',
  'pixpal.net',
  'pixtreat.com',
  'pixup.us',
  'polr.me',
  'pornzonee.com',
  'posteram.ru',
  'premiumpics.net',
  'pvv.pl',
  'pys.me',
  'pzy.be',
  'http://q.gs',
  'qrrro.com',
  'radikal.ru',
  'riz.cz',
  'sexfetishforum.com',
  'sexyimg.com',
  'http://sh.st',
  'shortiurl.com',
  'shotimg.net',
  'shotimg.org',
  'shotpix.com',
  'skyrock.net',
  'sleekpix.com',
  'slink.ga',
  'snip.li',
  'spetson.com',
  'storeimgs.net',
  'subirimagenes.com',
  'subirporno.com',
  'svit.pl',
  'swagirl.com',
  'sxpics.nl',
  'http://t.im',
  't5m.co',
  'teenvideomegathread.com',
  'theurl.co',
  'threepicture.com',
  'thumbhost.eu',
  'tinyuploads.com',
  'tldr.ly',
  'tnabucks.com',
  'trzyw.pl',
  'tuspic.net',
  'twixar.me',
  'tyn.ee',
  'uang.in',
  'u.to',
  'ucinacz.pl',
  'ujeb.se',
  'ultraimg.com',
  'unblocksites.co',
  'up4.upppic.com',
  'uploadbox.com',
  'uploadedimg.com',
  'uploadyourimages.org',
  'upix.me',
  'uppix.net',
  'uppurl.com',
  'url.ie',
  'url-s.xyz',
  'urladda.com',
  'urly.fi',
  'uss.cm',
  'utm.io',
  'utn.pl',
  'vavvi.com',
  'videowood.tv',
  'viewcube.org',
  'vplan.com',
  'waa.ai',
  'wayupload.com',
  'wewpic.com',
  'winimg.com',
  'wow.hr',
  'wowz.org',
  'xlocker.net',
  'xxxupload.org',
  'xy2z.net',
  'yankoimages.net',
  'yep.it',
  'youwatch.org',
  'zii.im',
  'zip.er.cz',
  'zooomimg.com',
  'kurza.link',
  'wowcheckthis.com',
  'cwaniak.info',
   //SPAMMER REDIRECTS
'x8.lv',
'turl.no',
'urly.fi',
'anon.to',
'anon.click',
'greenpiccs.com',
'1f1.de',
'dum.ps',
'i.skyrock.net', 
'm17.ca', 
'gg.gg',
'9ui.co',
'dodatki.net',
'my.rs',
'imgoutlet.com',
'pornzonee.com',
'utn.pl',
'bziu.pl',
'slink.ga',
'firsturl.net',
'fiurl.de',
'wow.hr',
'bisi.pl',
'megaurl.pl',
'pvv.pl',
'u.to',
'cutt.us',
'ujeb.se',
'riz.cz',
'linkon.cz',
'jdem.cz',
'zip.er.cz',
'ilnk.us',
'lc-s.co',
'doshort.com',
'snip.li', 
'9m.no', 
'lstu.fr',
'picturelol.com',
'urly.fi',
'anon.to',
'anon.click',
'nubr.co',
'theurl.co',
'svit.pl',
'pic4you.ru',
'waa.ai',
'polr.me',
'hnng.moe',
'2009.lt', 
'mcaf.ee',
'derpy.me',
'888.xirkle.com',
'ity.im', 
'iturl.nl',
'ouo.press',
'clk.im',
'shortiurl.com',
't5m.co',
'7.ly',
'ph.dog',
'uss.cm',
'q.gs',
'lc.cx',
'hec.su',
'dodatki.net',
'my.rs',
'img.yt',
'imgoutlet.com',
'bitsy.in',
'firsturl.net',
'url.wow.hr',
'slink.ga',
'bziu.pl',
'utn.pl', 
'bisi.pl',
'pvv.pl',
'gg.gg',
'u.to',
'cutt.us',
'megaurl.pl',
'www.linkon.cz',
'www.riz.cz',
'urly.fi',
'snip.li',
'nubr.co',
'svit.pl',
'jdem.cz',
'2009.lt', 
'polr.me',
'mcaf.ee',
'888.xirkle.com',
'tinyurl.hu',
'clk.im',
'shortiurl.com',
'derpy.me',
'url-s.xyz',
't.im',
'uang.in',
'jin.ni',
'utm.io',
'cut.cc',
'wowz.org',
'xy2z.net',
'ieej.lv',
'ipt.pw',
'l2nk.com',
'c00.co',
'min.qa',
'korta.nu',
'flyt.it',
'gu.nu',
'trzyw.pl',
'uppurl.com',
'tyn.ee',
'apog.co',
'cr.ma',
'url.ie',
'nfgn.com',
'zii.im',
'ucinacz.pl',
'koinko.in',
'miniuri.com',
'pys.me',
'twixar.me',
'hts.io',
'yep.it',
'brtsn.de',
'smal.sh', 
'ipt.pw',
'min.qa',
'c00.co',
'www.uppurl.com',
'flyt.it',
'xy2z.net',
'ucinacz.pl',
'0fs.me',
'mee.onl',
'su0.in',
'brwsr.io',
'izip.us',
'link.limo',
'bit.lc',
'dl-protect.com',
'qps.ru',
'fave.co',
'urlshortener4u.com',
'lynk.my',
'shrinkee.com',
'addq.in',
'rmo.li',
'su0.ru',
'imnot.lgbt',
'shurl.link',
'link.luke.sx',
'm-tg.co',
'cutyour.link',
'whatthelink.com',
'surl.im',
'zip.net',
'viaurl.com',
'tnurl.net',
'9jamkt.com',
'2020.xyz',
'4you.xyz',
'4fun.xyz',
'kom.xyz',
'al.ly',
'livenews.top', 
'onlineshopping.xyz',
'6h2.xyz',
'otong.in',
'sura.pw',
'minurl.link',
'1url.top',
'1url.link',
'lihat.us',
'1url.bid',
'imgrock.net',
'1url.pro',
'pixsense.net',
'loadus.net',
'dailyfiles.net',
'rapidu.net',
'www.reddit.com',
'milfmoney',
's007.co',
'7rl.in',
'url-ink.com',
'slender.link',
'2.ly',
'kxk.me',
'xoplax.link',
'twixar.com', 
'ndga.me',
'tinylink.link',
'tomq.al',
'nutshellurl.com',
'b2web.co',
'bty.link', 
'urlshortener.top',
'ajm.ooo',
'jiz.as',
'my2url.com',
'http://v.ht',
'nurl.in',
'rurl.us',
'linksave.in',
'frtyd.com', 
'tiwi.io',
'migre.me',
'urlcut.org',
'yotafiles.com',
'marinad.es',
'short.urls', 
's.coop',
'vzturl.com',
'midfi.us',
'gomo.bi',
'301.fm',
'krat.im',
'1su.nl',
'cort.as',
'x8.lv',
'yurlink.com',
'gotol.ink',
'ilink.li',
'visualscope.com',
'qr.net',
'go.al',
'chod.sk',
'tiny.ph',
'a7laqalb.info',
'tnij.org',
'tnij.us',
'tiny.ph',
'sprawny.pl',
'shorturl',
's-go.com',
'trimit.io',
'cut.yt',
'yd6.pl',
'http://w.tl',
't2po.com',
'martino.pl',
'ioi.lv',
'ocn.pt', 
'http://t.in.com',
'slink.co',
'http://2.gp',
'http://ogw.ru',
'huit.re', 
];

// List Of Mirror File Hosts
var mirHosts = [
'rapidgator.net',
'rg.to',
];

var Allowed = new RegExp (imgHosts.join('|').replace(/[*.]/g,'\\$&'), 'i');
var AllowedFile = new RegExp (fileHosts.join('|').replace(/[*.]/g,'\\$&'), 'i');
var hostredirect = new RegExp (redirect_hosts.join('|').replace(/[*.]/g,'\\$&'), 'i');
var hostmirror = new RegExp (mirHosts.join('|').replace(/[*.]/g,'\\$&'), 'i');

// set image border size, type, & color here
var allowedImgStyle = 'border: 5px solid #008000;';
var bannedImgStyle = 'border: 4px solid #FF0000;';

// set file border, background, size, type & color here
var allowedUrlStyle = 'border: 3px solid #008000;';
var bannedUrlStyle = 'border: 3px solid #FF0000;';
var redirectStyle = 'background-color: #FF0000; border: 3px solid #FF0000;';
var mirrorStyle = 'background-color: #DEB887; border: 3px solid #008000;';

var imgArray =[];
var hostArray = [];
var pat = /([^./]+\.[^./]+)|(\*+)(?=\/)/;
var local = location.hostname;
var localb = "ps.fscache.com";

// check all the images in the Post (not including the signature)
var img = document.querySelectorAll('[id^="post_message"] img');

for (var i = 0, len = img.length; i < len; i++) {
  
  var dom = img[i].src.match(pat)[0];
  if (local.indexOf(dom) !== -1) { continue; } // disregards links/Images from local domain
  
  
  if (localb.indexOf(dom) !== -1) { continue; } // disregards ps.fscache.com
  
  imgArray[dom] = 1; // cache for notice display
  
  img[i].setAttribute('title', img[i].src); // set the src to title for mouse-over display

  // set a style for allowed/unallowed Image hosts
  if (Allowed.test(img[i].src)<=0) {
    img[i].setAttribute('style', bannedImgStyle); //images not on the allowed list will get a red border
  }
  else if (Allowed.test(img[i].src)) {
    img[i].setAttribute('style', allowedImgStyle); //images on the allowed list will get a green border
  } 
}

//Mark url links
var urls = document.querySelectorAll('[id^="post_message"] a');

for (var i = 0, len = urls.length; i < len; i++) {

  var dom = urls[i].href.match(pat)[0];
  if (local.indexOf(dom) !== -1) { continue; } // disregards links/Images from local domain
  
  hostArray[dom] = 1; // cache for notice display
  
  if (AllowedFile.test(urls[i].href)<=0) {
    urls[i].setAttribute('style', bannedUrlStyle); // puts a red box around links on banned hosts
    }
  if (AllowedFile.test(urls[i].href)) {
    urls[i].setAttribute('style', allowedUrlStyle);  // puts a green box around links on allowed hosts
    }
  if (Allowed.test(urls[i].href)) {
    urls[i].setAttribute('style', allowedUrlStyle);  // puts a green underline on pics on allowed hosts
    }
  if (hostmirror.test(urls[i].href)) {
    urls[i].setAttribute('style', mirrorStyle);  // puts a shaded background on hosts that require mirror links
    
  } 
}

    //check for redirected images
var urls = document.querySelectorAll('[id^="post_message"] a');

for (var i = 0, len = urls.length; i < len; i++) {
  
  if (hostredirect.test(urls[i].href)) {
    urls[i].setAttribute('style', redirectStyle); // puts red underline under images redirecting to a banned image host

  } 
}

// mark URLs inside CODE tags
var pre = document.getElementsByTagName('pre');

if (pre[0]) {

  for (var i = 0, len = pre.length; i < len; i++) {
  
  hostArray[dom] = 1; // cache for notice display

    // replace HTML links with text links in pre tags
    var a = pre[i].getElementsByTagName('a');
    if (a[0]) { 
      
      for (var n = 0, len = a.length; n < len; n++) {
    
        console.log(a[0].href);
        a[n].parentNode.replaceChild(document.createTextNode(a[n].href), a[n]);
      }
    }
    
    
    // mark text links in pre tags
    pre[i].innerHTML = pre[i].innerHTML.replace(/https?:\/\/\S+/gi, function(m) { 
      if (AllowedFile.test(m)<=0) {
        return '<span style="' + bannedUrlStyle + '">' + m + '</span>'; //puts a red box around links on banned hosts that are posted inside code tags
      }
      if (hostmirror.test(m)) {
          return '<span style="' + mirrorStyle + '">' + m + '</span>';  // puts a shaded background on hosts that require mirror links that are posted inside code tags
        }
      else if (AllowedFile.test(m)) {
        return '<span style="' + allowedUrlStyle + '">' + m + '</span>';  //puts a green box around links on allowed hosts that are posted inside code tags
      }
      return m;
    });
  }
}

var td = document.querySelector('td.alt1:only-child[width="100%"]');
if (!td) { return; }

// adds a list of all image and file hosts used on the page at the top of the page
var span = document.createElement('span');
span.setAttribute('style', 'color: #008;');
span.innerHTML = '<br />' +
  '<b>Image & File Host Links Used On This Page:</b> ' + (Object.keys(hostArray).join(' | ') || 'n/a');
td.appendChild(span);

})();


var allowed_hosts = new  Array("fscache.com");
var images = document.getElementsByTagName('img');
var images_count = images.length;
var thumbnail;
allowed_hosts_count = allowed_hosts.length;
for(i = 0; i < images_count; i++){
	image = images[i];

	thumbnail = false; 

		var image_container = image.parentNode;
		
		if (image_container.localName == 'a')
		{ 
			thumbnail = true;
		for(j = 0; j < allowed_hosts_count; j++)
				if(image_container.href.indexOf(allowed_hosts[j]) >= 0) { 

				}
		} 

	if (thumbnail == false)
	{
		var toplevelnode = image.parentNode;
		var cur_id="";
		while (true)
		{
			cur_id=toplevelnode.id;
			if (cur_id.length>0)
			if (cur_id.indexOf('post_message_')>=0)
			{
				if(image.src.indexOf(allowed_hosts[0]) == -1)
				image.style.border = "thick solid purple"; 
				break; 
			} 
			if (toplevelnode.localName == 'body' || cur_id.indexOf('posts')>=0) break;
			toplevelnode = toplevelnode.parentNode; 
		}
	}
}
/*
**********UPDATES**********
Mental's Host Checker for planetsuzy.org
version 71.91
April 07, 2024
added pixxxels.cc to allowed image hosts list

Mental's Host Checker for planetsuzy.org
version 71.89
January 04, 2024
added anonym.to to banned hosts

Mental's Host Checker for planetsuzy.org
version 71.88
December 02, 2023
added clickndownload to allowed hosts

Mental's Host Checker for planetsuzy.org
version 71.87
set all clicknupload as allowed.

Mental's Host Checker for planetsuzy.org
version 71.86
added picstate.top to allowed image hosts

Mental's Host Checker for planetsuzy.org
version 71.85
Removed zippyshare.com from allowed hosts

Mental's Host Checker for planetsuzy.org
version 71.84
Removed from list of Allowed Image Hosts
pixxxels.cc
imagezilla.net

Mental's Host Checker for planetsuzy.org
version 71.83
December 04, 2022
removed from allowed hosts
ul.to
uploaded.net
uploaded.to

Mental's Host Checker for planetsuzy.org
version 71.82
June 19, 2022
added solidfiles.com to allowed file host list

Mental's Host Checker for planetsuzy.org
version 71.81
June 14, 2022
removed solidfiles.com from allowed file host list

Mental's Host Checker for planetsuzy.org
version 71.80
February 12, 2022
added to allowed hosts list
clicknupload.club
clicknupload.to

Mental's Host Checker for planetsuzy.org
version 71.79
November 08, 2021
added phun.imagetwist.com to banned image hosts

Mental's Host Checker for planetsuzy.org
version 71.76
october 27, 2021
removed uptobox.com from allowed hosts

Mental's Host Checker for planetsuzy.org
version 71.77
July 13, 2021
added to allowed hosts list sendurl.me

Mental's Host Checker for planetsuzy.org
version 71.76
July 10, 2021
added to allowed hosts list
clicknupload.cc
hitf.cc

Mental's Host Checker for planetsuzy.org
version 71.75
January 17, 2021
added to allowed hosts list
clicknupload.com
clicknupload.co
clicknupload.org
clicknupload.link
clicknupload.me

Mental's Host Checker for planetsuzy.org
version 71.74
January 17, 2021
added clicknupload.com/co to allowed file hosts list

Mental's Host Checker for planetsuzy.org
version 71.72
May 15, 2020
added sarumann.net to redirect hosts

Mental's Host Checker for planetsuzy.org
Version 71.71
March 09, 2020
fixed file.al to show links without the planet suzy marker as a banned host

Mental's Host Checker for planetsuzy.org
Version 71.70
February 28, 2020
added hitf.to to allowed file hosts.

Mental's Host Checker for planetsuzy.org
Version 71.67
November 03, 2019
removed from allowed file hosts
oload.stream & openload.co

Mental's Host Checker for planetsuzy.org
Version 71.66

file.al Added to Allowed File Hosts List


Mental's Host Checker for planetsuzy.org
Version 71.65
Removed from Allowed File Hosts List
datafile.com 
upstore.net
upsto.re

Mental's Host Checker for planetsuzy.org
March 09, 2019
version 71.64
removed file.al from allowed file hosts.

Mental's Host Checker for planetsuzy.org
January 27, 2019
version 71.62

Removed from Allowed File Hosts List
srfiles, suprafiles, sfiles


Added to Allowed File Hosts List
filespace.com

Mental's Host Checker for planetsuzy.org
December 12, 2018
version 71.61
removed nitroflare.com from allowed file hosts
added uptobox.com to allowed file hosts

Mental's Host Checker for planetsuzy.org
November 17, 2018
version 71.59
Added to Allowed File Hosts List
sfiles.me 

Mental's Host Checker for planetsuzy.org
version 71.58
removed suprafiles.org, suprafiles.me from allowed hosts list
added srfiles.com to allowed hosts

Mental's Host Checker for planetsuzy.org
version 71.53
May 05, 2018
added suprafiles.org to allowed image hosts

Mental's Host Checker for planetsuzy.org
version  71.51
March 31, 2018
removed pixxxels.org from allowed image hosts
added pixxxels.cc to allowed image hosts

Mental's Host Checker for planetsuzy.org
version 71.50
removed pixhost.org from allowed image hosts
added pixhost.to to allowed image hosts

Mental's Host Checker for planetsuzy.org
version 71.48
February 14, 2018
added picpie.org to allowed image hosts


Mental's Host Checker for planetsuzy.org
version 71.42
November 12, 2017
added static.keep2share.cc to allowed image hosts

Mental's Host Checker for planetsuzy.org
version 71.46
January 09, 2018
added to allowed file hosts
crazyshare.cc
suprafiles.net
*/