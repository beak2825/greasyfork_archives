// ==UserScript==
// @name          커스텀 스크롤바
// @namespace     커스텀 스크롤바
// @match         *://*/*
// @version       0.2
// @description   스크롤바가 바뀝니다
// @icon          data:image/jpeg;base64,AAABAAEAAAAAAAEAIACmUAAAFgAAAIlQTkcNChoKAAAADUlIRFIAAAEAAAABAAgGAAAAXHKoZgAAUG1JREFUeNrtvXe8XFd1Nvysfc7M3Crp6kq2LLk3yb2BA8GYapPQSzCm5KV8mM4rQggQQiAGkvDCL8SmmGJIgAQCBlNMCRbdAWNwNy6Se5Ft2aq3Tjl7r/X9scvZ514ZjQDPHSv78W80986cOXPmjtfaa6/1rGcBCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJvQEt9AUkPDSuuOEG7LM4o/+5MxvZ0sK4htq3bdQiAQQgKAKUIkAkvIYIIFKAe0gYKESgWeyTgDueIAruTECuCBn5/yEYgIBA7jQCRQQCIARkCqgpbM5Jbzxoidp62rHHFcLbQKq20H+yhN1EcgB9hkJP4s/+ZT3e+KTlw/dOyvGzGs8sOHsMgw4wopYyaEC5b02RdQJwhkvwP3tDB1gAIwIj1qRLWIcgzgFkipCT8xHeoVB05x4zYt0DQaYV8X0ZyfX1jH+4uM4/esrho/duntZ88iH7LPSfMaFLJAfQJxBhnPfDDThwfHD4lq36KbMme2XB2SltTePNQqhTMDqFQaEZzHYFJwLIr87WShG+Ur/Kw63nNmywK7qPDtyxBIAUrAMor8h7g0o0IQRkmUI9V6jVM9RqhEZOncEa37yoLl8fH8QXXvqYC+687q4zcewB+y30nzVhF0gOoA9w86btOGzvJTjvx7cdtbWJv27q7AVtjUWttsHUrMbErMb0TIFmqwPdMWDDc1ZpZVf+SohvnxPxv4q34xDKu3+srStAkbJhv0jsSuwrBYCwdRR5hkajhsHBOkaG61gyWsfikRxDDWVqZK4azs3H1izPv3H3tvbM655yWHldCX2H9M0sML55+e147qP2wtnf3Hja9rb6sEZ+bLujaWKqgx2TbUxMdTA93UF7toWi2QR32hA2EGF3BrIrORGIMtgNQPScSDBgCY8jPO/3+vb1qvq0eOM31viJQCpDlmXIGnXUBocwODyAxYsHsHTxAMaXNDA6XEOjhulBZT67YkjeP9GUbW9/5hhILV/oP3XCTpAcwALiv35xC8583Dje9MV7Tp/lxrks2Zpmq8DEZAvbtjcxOdHE7NQ0zMykSHt6morZLVw0NxrdmYRwiN9FCEIKRAoEBSJruH5/b52EAMLucb++u2eJ7A0K4pN9ACACYQ1mBoGhslyI8kxlaiVnA8uosWhZNrS43hgdxcjiYYyPDWH50gEsXdxAra7aiovzVwyZ926ZMds+8tJjUiTQh8gX+gL+t+Kq27fghIPG8db//O1p21r5uQysaTbb2LGjie3bpjG1bQKdqe2s2pO3NHj6ohpaP6ibqZvrxf3brrr0q+0u3kIe4vE/yAqXLN2flh7ypMXb9ejY8KLlp3Jnx4uaM4sf05lZtqjdXIxmq0CzbTC2ZKBRq2Vn3TPFctLKgb//yPc3TCz03zxhPpJLXgBMz8xi7Revwz6L60fdNpF9qSP14zotje0TTWzbMoWpzZthdty3Y5hmP79kgM9724sPve2m2prx6ZY6LFN0JEGtZAGBlF3ZfSVQ/FovEJFCQKzIr/RCBBJFkgOSAeXKD8AmFgUQEbDY9AC5QqCQSxgKAPB2QG4ZVvq24w8YuP2f/+Gz9Una62nTMvp2MzR+8tDYmBobH8Xy5SNYsmQAmUJrNG+/+yN/sd85P9owY579qJQY7CckB7AAOO+712HVIjQuuLZ1TlMGX6cZmJhsYeuWaUxu2gSz/e5bxtTE+592/OILePXj99XZ0MvqAwPPq9UbB+VKDStSGTmjlMpCb3+Pv1QigKw1R0m98mciCtsFH/azhE1AON7/RAATScdo/SC3W5dmpnX+s45f9LNXv+3L+25ujryZRpa9Ymj58mXjey3B+LJhDA83kEln474j+swbNk7/8ptv+1MMNVLg2S/IFvoC/rdhtqNx1ievgKo1/mzzbP5uI9lgs1Vgx0QTE5u3gbffc+ey2tQb3//W075znT7ghbM0+rFsYPiFSuX7GEajMKK0ERSGUbBAG0AbRuEfMwL7vLtn+7jm6mPhOc3oGEHHCAptjynYHq8Z9hi25zVGYJiJGblQvhh54+gO6qdffefM4FFHrPrFxR991XcGVv3pDiPqqchqtSzPUatlIKJFWuvhM05a9N+X3769+M5/fGKhv4YEhxQB9Bjnfe9arBg2jS9f0fzCjAy9SIQwNd3G1s1TmL3/zukx3vS2T/3ViZ8775qRs1q1Re8fGBgazxWgFKAIIKUcAcjxABRQXdsfGoQowRcIPxS9cmerfvz6siQYEoxKodPhdmt68vx98un3nP/Jb3Rq4/t/ub5032cvXbkXli0fxehwDUo6W1YMdp63aUf7Fxe+4wlQKSHYF1B/+CkSuoWI4IfXbML3rp04eqKFx7MAhdZotQp0ZqYxnHUufOrq/Iv/eln91B168N1CtfGiKNDqaLQ6Bu2C0XH3bc3oaEGnYHS0QUczCnfr+Oc0u+ftfbswaBfGPlaUx7S1sefwx2q20UBRnrPwrykEnY6gUwhaHcZMU6OtpdFRg6+5a7r+zh9+6TXtvQZa50tzx2Rzto1WS9vXMy3b3pQXfeMtB6pvXXrbQn8VCQ5pM9ZDrH9wCt+6ahKnHTV6apMaKwdya2StVgFpT9+/ZEB/anj1nwxN35+9k+r1lbpgsCIoJSBlV32lCEQCpQhZiAL8uk4RlVdK1h9JSOLNW+893TcEA/4Hdx9CgTJPIGJ/ZhEwCwwDLFRvSePV//ytTT9//okDP/3K9cVP263Wc1pt63RqOWGyI09++5c27tvRfPdCfxcJFikC6CEuumQ9/vMVS/KplpysWcEYu6oWrQ5q6PziVcdsu2L9ps6zWNWfABG7t9cMrRlG2327dr9rzegYeyu0pQj74wv3uHY/F1oq0YFf8QttUBTxcdVjC21QGIOOMfZ93Ht1Cvf6wp5Da4Oi0DDIl07r/NUHnHCiGR1Q/y5FZ7rV1ugUDGMEsx0cdOeW5jFX3LYdTZE//A+a8AcjRQA9xIa7tmI9m3FtsqOUwCbVDINNwcM1/vGr3/Fq87X33Hg6D6i6aGOJPYogQlDCICYopaBIYERAQlC+JyCs3lFix5XzRCI+v/8nHGQZfpXGH1RP4F/jewmEBeyjAAZM9Lum2ikX3zBxzKKs9T9b2+31RafzKF3UoTOgXfDghO4c98tLH/ze5h3dUBkSHm4kB9BDPLijhaFGvlwbWl6H7dTT2kB0e2ogN9e/4p+uHG/r4aMztrRdUoASAouCEpsIJE/JFQKx2MQg+cZdAsiWASlq+LFhu98ZiGsBkNA/QBDEOblKStGfRwB2vzBLdRtgOOwUhNSy2Y489qe/WXv5wcd8/mouikdpY6C1gjYCQ3Kk/M8Z2c9vnjYL/X0kJAfQU3QKxtCAWiWQJeUKKhDd2aG5tbFd0P6FwUoYhhIFAluKLxgiBHYRAAhQbj/PCij5/L7/r6QAQxgggIXCKh31BUbRQ7z6l12CEqIAjvb/kQNggTAHZ2EYNNPhg3HXl5AdY+41WoONgNl2Mc509Njnv3NVNk1jyQH0AZID6CGmmgUypZThBtWcDQoDSkQWDea63SqWFwWPkBFkYJAoKGVAQhClQERgsUk/FgokH3IrPxARfKx7sA8rAFCYnZzEjs0PIK83sGjZXqjVcxs3EFVDf/tg+bNLKPrGIhGxrcHOETC7YxgotCAzOFiaj1cnvGwdJrmwPQjOWTRbBlffcC9kqLPQX0cCkgPoKbRhaLcShlUUAhFGI1OYmu1Ai4YyDECBFPu1HSRsV3+4XIDbt8cNNp7VZ8m/Xi8AUCDseOBe3Hn1r6W94wEtKldjB6zJ9jv6BOSNesgJRLl/zM8G+CqAu2d37eyow+4xrRmm4AyylXIYGx3YRASEGdoYTM60oNBa6K8jAckB9BTWGLygB8IqK8wQtvVyA2NLa2SFPsDOoL16j5LSUN0/FO/aJRQAQ9lw2/33YeN1l8t4vfXjvQ5b9ukHt02tfGDjhjfeJTh83yOPR1avA+LyAK4HoEoxDqd2P/oowOcBXGKQBYYZZDTQadsjpSw52rZlhVwpz2BKWGCkb6GHUETISEVhetmAQwLnHBjMBizsbjbTzt7AjMAYwGhAG9ifja3FG2NLh2wYxtiy4Lb778M91/5GVozwupc970/etHHzxNev+f6HP7r/3kNvnrnvlvV3XX8lmrNNW2J0dF97Dv9eNsln2F6bcc+x8RUAhD2+YYbRBroogOnZMvMonqOgoFTu+AuJCdgPSA6gh8gzhTxTLpS3EAFIBIrY7pW9A2BnhN7o3OrKziA5GKJ3CKXBagNoDWy79x5svPqXsmLErHvB045b+8FPfW/Db//7w/jYf3wXv77w/ev2Ha+tnb7nxvX3Xn8FWrPNyODLEqV1JJEzYIEJN++YuHQUWoONBnThIgQOKYVQ1iQAyQH0BZID6CECf98rcUVRNokEIh6zFeHxBu5Xfp5ngH5FdjdmG4obxuSme7Dpt7+S5QPFuuc85Zi17zv3wg0PXPZhZPwA3vySx+ITX/wOLv/WP63bd3xg7ezG9evvv+lqFJ0ORMie2xu9dyz+PaPrYOaQ3fc/SxAOHHCrfyxT5rgCYq89YeGRcgA9BIV2HLi9u/UCvqefA70WYCU2MmCbnRMSEImT7ZKg6+fPaHv7rZDn1IP34oHrfyUrFmHdc08/ce2HPv3tDc895UD87fu/ML7uJ5e/ap/lY1f/94Xn/OjLF/4IV3/vw+tOeubb12584LZz789qa/Y+/BjU6nXrSMChIjBHT9jeu1JgSGiyzfYrImCw4SjIZcnQRwQkBkCqAvYDUgTQQwQRLr81Do8T8ixzS7+T7mIJBmPr99WV1m4HGGyMjQTY5gumNz+ALeuvkn1Gad3zTztx7Yc/8c0Nz3v8oTjy8P2X/uCSm/5h42T9A9fdOfmx017w1tNf8oKn4gsXXIwrv/uhdQeuGF7b3nTz+vtvugbtVhtGfFRhwMa4n8t6vv9doihAnASxCAPcDsQjwAmNwEcIdu5AwsIjOYBewyv3eC4OEZQC8ty7B6oQbpgj45co1GaOjM8a/+zEBLbcfK2sXEzrXvD0k9ae+4WLNzz7CYfiwH2XL/3Kd3999v0z2VlLj3hMPV951Jrf3rnj3Cc9582nv/yMp+GCi36CX3/zA+sOXTm0Vj946/oHb74OutMpjVwELFw6mjgp6LYdYZX3oUKrZT+PUi4KcCVBNkjG3z9IDqCHsCE+gR0xRoSCyRPEsfwo8O/L0FrmrLZciQSsURpMbroHg5i+8bRTDn/rBz/9/Q3PPvVQHHfsYUu/8aNrz35gtnHW2KEnNob3ORhLDz0O9VVHr7nxvva5p7/o7aef8ewn45vf+xl++fUPrFuxJPtI68E79ezENgikuupzVKXwEYjLDYQIwJX6oLxIKQDEWwSGohyUtGj6AskB9BDsVlJ7L5ZeK56SSyBVknFiym0ZBUSJvnnOwMCYArniB/7kiGV3/91ZT8HJxx229ILvX3325s7oWWNrHtMYXLYvtDbQDIwdfCwG9j9hzfX3NM99xkvfdfrznvFELDnyTOwzPrxdZZmUzmpOws/s/He/pbGfQwF5vSz1V6eRVCYNJSwsUhKwh7BZ8nJvH5Q8A3fPE3zEsuc8+4Z8wsAz/TlKJsLq+FGGgSXLMbntrhPO+cJP3rpy2eIrb7pr2/Pub468bMnq4xuN0aUw7BJvAjAUxg48GhN5Y801d9947mOesfZfHnvs/ttv3zT7BrVo31ptaDGMiUoV5C+j1AmQqKfA8w/tdZMtY/jrA6Kyn40E0jagP5AcQA9hQ2cDEbs0lubjyEAV+r2Edl7/qEjUpBPa/YLqL4bG9gIdeOzYho0b3nPL5gmDgeX52JqjVDY0CqN11eYI0Aws2X81ZgcG1tx1z42fvHOixbWxVbXxA9cAKrMTiPz7s4R5AxDPRozTmKUcKZECGrWy6hF9LnHlSzGpDNgPSA6gp4hNvnxMRGCMQVZTZZUgmFdULvDMQaI5Pf0AYFBoweCyVRgcW5Zxp50hq0Mjhy40QsdgfClsUHQMBpetwtDYeG6MhqoNQosCG22PLwUEo07CaHAIwtgRWJlyZ9isoDIF4lCodD6NIFBztIsTFgrJAfQQtkGnbNIpBboE2hhQw7HkqsT7gLDeiosAhMIZIAQmY1d6CIjq4IIh6Ph3Dnv0cDJiCBjtFgOk7Gs6Gp62GxzNPJT9CKVTctcVRpG5XIAbOxb6HgTQhkApAOgLJAfQQxCFPr14Mldor1UkZVpgJ5bny+olCUiqWwi4+X/C8xyHbxamIP4nkftBlI9wj/mhozvpD4wbhSi6ZnF1fiUGGGm451VgPvrX2igh5QD6AckB9BCuOuZyaKU8JynC+NhQvV1TkEljmC3rLyTgHF+gEnBLdR224XgcqqO0/EgBKJhdrAqEqlHb13KpFFpxGuV1lD1+PrVPEKOhULSAo4Wy3zrFEj981F2nRJ8tYUGRHEBPQaWZuSQfAVAqQ1bLiYvWrabA/VLTh8Qaf44LbF8WzDxW7i0t3dq0hCNjP1LaaantX4nFK0ZZrvfkl3CKHUWlOTj8zkUByvQNQJ5nGanQzuzOSUrZcqdKOYB+QOIB9BB+Aq/PAwBiB31kOaZaYvYbbd2TmdZNptMGaw3WxnUCerZfqcDjGbUcMwKNqXQSBvFOz9ZjBosJvAHLznPHGYnajrnCOPSNRr45KdCUff3fcwUMQzrNGej2pXTsBzudjm6XE4nt58+UQp4R8uQA+gIpAughxO+AxY/udj3yWYY8z/Ev33+wc9Lhi3/enM2fgYERyxEmsmM9qVxHJVqdAUswihsMgjgYRc1H/rUSh+/zLjBsMirZfpRJPD97IGwIKOL66wJ5MXPTynG5trE4h7CBIOoSBADKkIW9UMJCI30LPQS7VROwIXB5U8hrGZ756GVYtUi+rdrbry/asxCtIcZEK7y92ccM2Njee2HtVv857EAT0XZZg7mI7k3Z6OOPEYaIEyMJTUDl+9jj7L1hdw2+EYgBFE29dKC48Nsffe397VkDFrTENzc5XQDb+6CSIEifIDmAHqLsALSJMfLtvEoBlGGv5WO46Lw33zKqZj6E5o6tRncC9VeM2BWVDcQYsHcOWkM0A8ZK8oqxx3opIXEOI4T9xr2eY+fhw33jjmfAq/3692QNMYW710BwQq5TsNOURVnrB8fuP/T5Z/3f8zG212JsmzF3CFHHagIiahoqKdAJC4vkAHoIIp8N93RZP3TDro7aCJ716n/GKYeoC4Zl6r3Smt5qiiKo7LAzPjYFxOhgzPZmV2Zh49qJ3eNsjRzueG+4MAbg8rViCvczl+eMHACMdjpkpSPwEYK0p2XATKzbb7F+2799bf2m97/2iRgabKAQ1VJKlVVGt7Xw6kYJC4/kAHoIUgJnDwB8679xIhkAhPCdz/4tbt+KzqP3l/PH86m/z9s77uV2U0xR2KSg1mCtw30Zpjvj5dKA2RiwLsP4+DFxjwdHod3jRpfOxK3u/jl7Lvd80Qa3Z6BaO1qjvP3rhyxur/3ZtTs2XPiPJ+H4ow6DyjNkeWaz/oiFRA10YWCKJAjSD0hJwB7CSnQj5ODE6WkrImssmfXHF//7O/HGd3+q85LDG+d/67KtV2+Zab+i1cn/TCNbBagcRK53wCX2yO2pXfsdSVmjl3hQKKzKkISkHkVTwt3w0J1szSUkGBl21oCIks5Eg/QVS4fpq2v2Hbzwhjtntt/+tadjn32OBgBkeW6Hl4S2YHJyZ4xCGCQpAugHJAfQQ3gqsNfI9/tgpRSynECq/Do+8YHXQaZv1hf94iuXPfGQxpXX3D1z6GyBxza1HFjPs4OVkrEg10UZRFn9f0FZYoQwhFwTUdy95yW+PEsvkId2MhtI+QYfAYkxncLcrsC3Dzbkmn3Hsmsv+uy7Ji5Z9+94wtNej30u/Jvw+kwpKDhdAOWoxW6OgJgyGZqwsEgOoMeQOBnmU4IZoVbLAVX9OmjkcADApUAB4Cbd+eVNWW01vvqV72cPbmtl7DT4AsXXy4uTH+PFYCH3XuS6+Hz0gDBo1Nfz/TQhhjjnYEN4RQpZrrBkpCZHH75YT0425QmnvRhXA6DP/d1OP6dSChkysB1eGNjNv4PpnLAASA6gh/Ay214XIFBxlUJey0Hqd6vk5PXHhVOhz1U1S96CjyC8WEgGyvPEA+gTJAewAAiBtqsIZFmOWp4Das+RySrpwWWkAwIyBdQygmSJB9APSA6glxCCsEu+hTycJcZk2Z7HjgtiJlJSgYkIuRLwnuPrHtFIDqCHKPf9UvIB/JBPVSbc9gTYHAQFXUMP+5Hd3MOEBceeteT0OYj8VN+yFTg0+MdDQ/YYzOkuDJLoqR24X5AcQA+RKSAL9u9Lc6XQp+xRqfHSoXkhk6B27DoOExYeaQvQU0gQ8wybgXhE0J7kAMhNO6jMFLPbAe2HAyUsOFIE0EOojJBlcWtvufZznC3fA1D6NCo7lb0IilDaAfQJkgPoIWKFr1IXwOn3iQpy4XsC/MYmuDkvZiJc0UNMWFjsOf/HPQJgJwKhJAEF+e9yBNieBAq0YwrMRBGB4ZQD7BekHEAvEYyfI6KMXQzZj9bdQ2C3OdH6UvKCkCkFTmtPXyB9Cz1FKZ/lyTEhW76nrYgUq/54JqDNfyjXIJSw8EgOoIfwHbWBHEOudTdaHfcUVFKaUv1wBEbiAfUH0hagh2AhmNB2W7boMjkWwB7kAEJ+Q+Z+LoFS2R7V9/BIRooAegjPBIwFMmwLr+cC7EkeoNIL6OQJnNior34kLDiSA+ghlHMAivywTDdZhwAo2qOUcud+kqBLJMZVA5ID6AekLUAP4ckwkUqmg53g88fGp//nShw8PE2XNFeNPKBrY/VafS+V5csBcKGL+wZZbztsWLa97oRtzQe2DmPFssP/+J8Z0TQhsrMCM0Uwe1jn4yMVyQH0EKWGfmVcZ/jvjzEye3byejz5p/vi2SumRq8tspOvbNWfKrX8MWjk+7cztZhAIwCEarKjKTxxvTG3vvmy4Z/VdOu/v3zdXTffPiXF3/3pviD6Y/2v4Rt/FBRloLyGesPA1NP/ev2A9C30EMZod6NSg89vB/CHZQBEBO++9H58cr001ixqPfWmYuSswYH6Ext5vkgREYNgUM4KVYQVOdEKIqwujPmziVbjzT/c0fruKHfOw9TNN3z7hnvwnKP2+/2vJ1yX+8EOQYTKcuQqs6PHExYcKQ7rIVg86y/u/ItEN39Pm9g0NQv68AYYgwN+MdH44I589ItSH3oOU764qYWmOoypDmOmzZjtCGY6gum2YKrNmGoxCqOyWn1w/2Jg0evvkJGvnPGrsZc9MIP6+35x7x/waUslYnsnZUKwcp+wkEgOoIcgeClu8g9Eyf/fzyA2z7bw2K9vwTv/ZMnqG5qNT3Vqw/83z2pL2wUw0QImO4TpgjBbAE0NtPytAGYLYLoAJjqCyTajEEW1gaGjd9RGz/nW5oGzhljX3/rj39cJUFA8Cu3AjgBlxAmPJiw40hagp5DKj+E3kt+rQUZE8IaL78VLD1QHXD+dn2MGhp6WE1G7MJFasJcj39lo0XLYuHiNAhDq9cZ4m+nsS6cFbzpYf+awKx8oXn/S3rt1bd74gyKA93QkTo14ob+LBCBFAD2F5QEgGHuVKLv7WYAP/mITThrD8HWT9bc3s8HTFYE6haBTCDoaaGtBuxC0taBTAG0NdAzQjm4dI2hroF0gHGs0o1bLxydp4L2fuUU94/UXE35465bdujap5P8pfFCRMIMkoQ+QIoAeQmXKTspRGcpGWYkksro3i6vun8aJf3Ufzjxj+AU7VOP/DBCpdodhQEFbgMKIcEc79psPPzjEwfOQQoTg5AlNVlu+qVl/x18dP3vNF67jO+NpRLvEXHqzl0ETVwlJHqAvkBxAD5ErhVypMB5bHDtOnPntjibgp3+zFX/1svqK30zWXivD+Ui7cKIiBHA84YfinYU1YAJsFj6MDZubniubd9qon3zTZPtlPzhz1Qf+7KrfJwoor0PEzi3UBntc6/MjFckB9BC+0m/3x+XsPnZ8eenS/m/a0cIR59yLJxyQ/dlErfaoYQGMdms4lTlFqr55WP1pTqQxV4mIpNyWFJSp+1v15/zll+/47LdvpE278WHLUWg+EcgM0RqmbWBUX881+V+DlAPoISpjsaJfRNzq3WVc/J+XbcbHH9tqPNjMnt7hrN7uAJ2CUGiC1grGTfPWhlAYgjYErQFtAK2BwtibDvcEre2tMDZP0HF5gcIQpk129F3T2eMu2chYv7W7awxdjnG7s+sB0KaAMcVCfx0JSBFAT1GdkxM1zPpJwV1GAFfePYu6ylc1TX5iJoROwXaGn5KQ9RfElQW/w482GcH1lxk5n7Cz6kRw6j2CQmhg8yxOfOBXSy+88mkzXX7WKMcARIwgBUZci0hYSCQH0EMoJ4hBvvXX9wVEslm7wn23XYk//yYw2lAHGclWkLGTQ0kJlKKwvfBTf4m88c+ZDBwcjp9VPle6294zA8KEllarP/z8m/Lf3LJSd/NZLdmpOgMRlS1BcgD9gLQF6CHYGIgxYDZOFgyICTPdZNjvVYfh2vsYYHWQYTVoDBDftJHyd7bhvWFEN3E3wBiCNmK3Bu54E79e29wCM8BMe92mR4ba7e5C99D4JJEAIClQliPLcmRZ0gPoB6QIoIcodIHC5GDjRnTDagOIEIS5q9FgWmrAgwx1AK0SJsVsxwQrpzZEBJBC2WbgVn0AYYsR+xm/Eof5BGKrA+K0+5kBMFAnWpnXh5ZQlk1281l916N1BAwRLweWo5Zl0KkbsC+QHEAvEZJ/cR+A24NTd3MBDBQgCroQiBDYlJsHpezen5grEQVRRMihchsQJx3FJyRdm74wAEN2C2AUhJF1CiHqsnxX5jh9ctN5JGUnJHHaAfQFkgPoJR4izPf6ud04AGZrTEFfkG1Nn13iT5H9nciVFX2936/+UpYKrYG6hKFb/X0kEM7NZMuUxm4HqFsGj6jAb6g+LjasSEygvkByAD2EF/6OZ2N6IRAiyxLcFdjY3vpQ7BdroMqdnKOx40LxG3gKLoU3D/9Keeen9pR7eDfLz1UEdke5pIxNyinI9i05vHvCwiI5gB5CoIBw8yG4o9eWHN3fCRYDv4QT2xHcVBm2G00eDj95CTKUVQGJVXv9PUV7d6lEATYf4KsKXYAiHnA0DNXGOQYiiQjUD0gOoIdQTgw0rPSeihtKZbs2LjGA4/uGsJ0qZH6bGyhdSTWqkNgmw2O+FFiq+BKXkYovCVZCl11dp0iYeOgeCRUBUllX0U7Cw4/kAHqIXClkSllR0IgF6OWz0UWCTZjn0XxFyNJrJGz0Xagfl/rL1tyQbgxvx2VuMjD2KKz+cPMLZTccQOhw9tsLdzNGoFmBu+U9JzysSA6gh3BJ8DnJQLt6M4ut5e3yJGGzbrfSzu5Z/I67PG+1ueghUoyB/BP9XhEvBTyDMLQyd/NZwy16kTBENIzTRkxYeCQH0EMol+jzbDjPiAtttl0QgWyUz0CYJOyXWJ/dL8VGyyQfhQpgeZJo6x/OHiUHo8SgFxdRlAHUJYHHJxoJZQeiqwD84QqICX8sJAfQS4SVP2biWGPgbsNrduPEme12QEpacQj53a+kpLq/d3sH8rV+RGbojFzcoBKXniwv3bcMd223VWpz6AcQhtYdsOmKUZzwMCM5gB6CIFA7syBPme2CHSPeel3Tj933M2LBr5DoZ5Sbcftk1Oq7s5PDMQEpHBvGmIdsYHd7gEqj0xzCEWsG6zQYpB+QHEBPYQBw1Sjnr5O/E35PrTzZB3DlO4QIwC/6ZckP4X6uEoDlCUV7gjgQ8Qw++HPvHg8g7n8M08+IQJR1td1JePiRHEAPQXOTfy5p5+2zG6PgUEvfibsQCks8VYT36CGSdxSMPQzxdBFAoO+6KMBetwJ12z9G0fuG7YlYwlOWgSiVAfsB6VvoIQRRyW/OJKAuc4CIl+jSaFEh89jn4BKMMe+3DO/nZv0rgsV+tXalSR+wKJfQ6waWMswlsQhlTkEpAXVT8Uh42JEigB5CG4Y27LrjSlkQgMO+fVcgQtRKPL+4F8uBl9pgwaKrR0elPl878EEAuKwABBMmAVF3e/eKHqC/kSVBZYrAKQLoCyQH0EMYI84BzGHHlH2zuzwHQYAlOQrNtjHfkwhdMxB5mm9wBFJu5b1aUHA+fgswx/v4Dr5AVirp+133AgHlub3egVJQKrPdgFnKAfQDkhvuIQwLjLHNNZ4BaFHOCNwVWo0BjC/OMdmRbSF5FxJ1FEJtzwSM/UsZ7vvnQidSxNevJgT9z76Jj7tM3pfNRM5BOdUjkN0CJCZwfyB9DT2FbQSyjTaebF9KcnezvX7G4SPIM0AbOGkeKvNsczODcyoNMcNPogP8436egG1LIFTTlQKW7hl81dYBqmwllJNGT1h4pG+hp7A6ebFBAtaEFWWWadcFhG1LUdjrI44dyCXtomkAoQQXn2XuC52MkO8F8LqF9gwhYuhWuTguAoSeB3kIR5WwYEgOoIdgFjsVB0Dctitzfvpd+OG12zDZZAxkGKrU7QNxp9zbSygxqlKa23fouNR+KAPCnysoidjH53mOLh2AUpb6TCraStjIx2gNbVI7cD8gOYAegkBQThk37IkBwIfXsusNthDQ2mwwXKNRilbkUmBEwgoeE3l8XkCYolU4GlQY2H7V6CG++pBb2I1PHP4NU4gYhQGMSUzAfkCqAvQQWQaoTEI/QJmYEzCXdN7fBSICCiBTlIGj1d9RACvRRBj/5fx8yO+FGmE1zI9Nv8IdCO/e1TWG14er8aSicl5hkgXvDyQH0EMoEmQxmSYM7XD77S4WRcvEMxBkc7gEZPX+Qh2AInmAOM4v37qiTSpkexGipqJ51AQJm4pdI9h8RFqKnkzm3x9IDqCHUEEQZO7OKwrFdwXnKMLeXEqjtX0GKCsLEip+lTOT5wgEIpA9D0U1w1ImvEwbKJTn7upCQyMRgjMQlihSSVhoJAfQQyg/Jw80b5/NXSYBremoeHdt4Yy9qhRUPhlIgZXkXvmWwRmgNPwQxbsfuqQqhNNK5XiXm2ADI0iCIH2C5AB6CBZv6FWUmoBdJAEFAKlqLV8EQoJSE6h0D2XV33cDSuVcfhfC7n6nzYkhEqCuHQAFLbLY4UiXbi6hV0gOoIew0TU5Ln/VuqxaThcnobittywlVrp04/5/IAiBeCOM45DKSh/OVbbvklcuFgHEuDzDbn3iaA9iJyFlbnZBwsIjOYAeQqDAUHYupxMBCRny3ZEE82t8bFuV90EpChJXBirzAOISnf2nQtDxjqqyZKtSO2CXH9YlDKPSJpFClmWo5RlUnmYD9gOSA+ghmH0fgO0IBPKHqLk/NBRlKDUBy/16JYcoEuXqYkGPOTMDxOcUZU5FwD/vE4wSqMDdJgEpmkZkH6Cgh5jXciA5gL5AIgL1EMwGhnVFY7/cx3dnWAwGxDgn4LP1VZXPMnnnau+Bb+Cz/RQfVCYC4YlEFIhCUaUS5VG7RqWniDz3odQlTHXA/kCKAHoIFrGKPl6gEwipcglJs12cY2dB/1ymbkUZFC4cd2W4eW/htwJR/X8Og9Ceiqz0eLcZPM9BoHD2cIGKKdQxEhYWKQLoITKlkJFy+33L1PM0Wep2XJ4AUCpuJI66CucO/EA1KkC5mJc3n+SDmwtIUS+/fwXBjh91gwi6gcSvtZEIc0RdXugvIwFAigB6CiLbBx8y8Chr70TcVT4gUIZ3ktCLl/dQ95eqsVV0QqOjJcwrrD5KUTJQWHZDy3MO3bfsNoJmTr0AfYLkAHoJcft31/ZrbSJay7uxLgUESTCfRwjLuT9HHHDPuwjM9wCqYvkVHcG4l5jUbpF4y52I5SnYlmADbTS0Lhbue0gISFuAHkJlCipzLbKVer50nRcrc+dzY3ua//tDbCtk7j4h7iislALLG82n9v1OBCnwsPLDMQElSkImLDRSBNBDKLK9AD6C96u48G5MBgJZSqFE53AIziQEFS4acMlACZuPwPKxe/7I0KV6stI50JzHd4n4pOTeS5ywKHWtLpzw8CI5gB6C/JJc4ehb4zfcJUlWOKzsQfmnUqIT1xPgQ/2gyQPPAoxbkT0/oNobEM0O88SAamNAF58V7v0kvD8RQZGCygxUEgXtCyQH0EMwA2wcO04YkCzE3ZaL300zkNXsrszqK4sApQQXUdkGTAAkLrxFwzrnIWohlDiM9491a7hxh6OjHzuFIAWd9p59guQAeghj7E1MSQQKqzCzm7+9i3M4Y6yE6lKG2THzLyzgTNEWwL+IUCkdAnOiAIvQS7C7e/Y5KYqS/2PrDSptAfoCyQH0Eq7ODqJy8GZkGN1YmcQKP6Cyv86H8oSyYSdW/fAhfEwScgcRynKkeNWeuYSBcMIuP2rFA5SVCRZAi8B0O2Ag4WFFisR6CK+qG4fe5IxSEXW3KrpjSFGZB5CSyRf1/MzxJzvR+/cPzDPyuYyEKOnYpd36TH8gOIZCAMHoxAPoF6QIoIcQ1wzks/hxTV66bLTJvAMAQpOO/f2hXhuF/RL9HkUHZVWQqk4kbFPsa3h39gEUBxtSedvgrBIWHCkC6CHEzQUod91Wiz+YdLdGIVwJ7cv+/irr3j9frvBzmXnzHyupxf78kayIdN8OHI0ZiT0MiKw2otqtMeMJDxdSBNBLKLKhe+j9L9tz41Xyd4FcBSHkEKJOv0ACLIkAc14tzoDnsgfmRAnxjUpHIyzouhcAqjx3nJwkATwRKmHBkRxArxF3/e2OyF54edm15yFStflS5KPyQ7UnYO5jUSkguIiIJwBg9/QAKqRhl2YMU0ZV2gH0CZID6CGI3GgNQnUVpDKA3xVKs4rkwEKY7Rp6AuEHwSHYAZ1Vlm84wM8LnONY5hYMiGJPs4vPGo4v31DcbEEWBeEUAfQDkgPoIcj20wCKqok3/2QXDkARwaoBuTp+4AD4E1JFt492su+XyjuVLcTekcwbFxafq8vQnWB1BEmk8k4sgAaQBoP1B5ID6CFUmJdXNgOLq72zdLe62vFhPh8/h/izE9Hena3qoUXA/V4OECmvai7sWLPuy4DzL6K81jAZOWHBkaoAPURogqkM3/QGt3PDm38S2clKHsX5OynWzwv7pfpcGdnP0SoWF20IQumy28C9bFSK4gdSUCrDbhYUEx5GpAighyC3+tvZeECYB1atlO3qLJibL6Cw/JdNPTQn0LfvX80PhAKfdyixE4iSgeU2fjeYQHMYRzbtYYVB8ywDsrT29APSt9BD+H48V1PzLUClOXexvAqz0+8oG31C1a5S3Ztb7kOg+ZYZ/pLkM/dCqSIK4p/YnarFfGdB8N2ACplKqsD9gBQB9BKBCuy7AVW0Ae/OtLyyr12aKdT1KQq1gbnBPEWTelBJ7EWXFp4gVJ2H36DsnpqvgsyrTZach7QJ6A8kB9BDcKDYRgswYKfkkIKoXQdkpJwVehsNYh9zbDMq+ZXNPjSvBdhvAXx4v1O1HnuR6F63CLbhyVc2vCS4+GYjA5JUB+gHJAfQQ5QdwH7UVnmTbjttiByZZqdFfSe8AcwTCN3JT4FJENf7Kr0AQGXhn9dItBsfHC7hyQZsnC5CwoIjOYAewhgDYwyEEU3jBWzt3jUJ7QoVqq5YZq4q5/15akCFfutf5ysIcYQflwBdSOKdkycZlbmL7iFS8guCcCkQEpWpF7A/kBxAD2GMhjHaLeBuWg5ZUg+zQFQXPACyxmm3E4Ko3uaiAyn1BipqYVIeg7IN2U//8eYe1AHCVsVz+sVKkndJBPK5DhbPdSBQcFNIPIA+QXIAvcQco43ngZouIwAFAMZy8sWtrL6Dn/wRsXGFGt7Os/3WyKly6PzjxK3au1EGdElKu/cHfA4AYGSUmID9guQAeggigSKbkbe8Ore6use6GZlNpABl7xUR2Mf9JG41l5JhLDER2Ofdq70ElkJQzg8EUB0mUpkU0n3Lcqn66zIIzvkxMwpm6G62OwkPO5ID6CHsRDxCOcCjXHm7nZVHAMDWfXitfp/0k7n7frj9vOvNK2XH5giQlZSCeXv3+YnBLq+TSuZjUAYWgTBDFwZGpRigH5AcQA+hyPYCQGVAvBcOBJ0uugG5LPtVS3tRB2B5dETHLZ+Xys9ujXbVibhMWZ5GAGIoRV3nAKCo7DsIr/ES6FYhOWHhkRxAD5HnClluh4NQqKuVswKoi2Ygv4+uTuqQEAFUT1HtEgxkn0hWjPx+oUojdP+WJKOSrdhd6K5QxjfkRUHctcybTJSwYEgOoIcIzUCqzMSH9VR1HV1j3j4eQGnkcfONzI/zAVeDk0ggQCo+QOa9G0X5hO6pwJHeUTgPgZBlAKVegL5AcgA9hl+Qw+y8ym68S+OSOLEWtfRKfBapLupUJv3KyT9UKnYF66/G/+UOvuq8urxQlMYPRwqMFQwTFhrJASwIqo2yFt0MB0dI+JWU3ThLL2X2XcRVFZwBzou4o+Mql1W2KZf26+VGqeswpQz/UW10Jtrpp09YGKQ4rJeIZgJUqmvRv7sCiQBGg8Chm09k/svDNJ851N7qsZEWQfT8vGuMmYddE3hURZbM3tkoIsuBLM0G7AukCKCHIBWIf44LUHbqUZk1+93noDlWHa/6lURfeAXmuxipbBdKok7UXlB2KkVJwC5FSxBe6vKQ5TUoEOpEKJL99wWSA+ghDLOV9OL5wb/qUm+voiMKIJB443FgIaMXJwtj81cV+i9QrvplZ2CZG4iz9t3nKeduTdz+X1lVIKKkB9APSA6gh2h3NNodDWMAxQYi1gjI9/NLN8Vxu6xabUFnZ+z2+yIRv8gZPfmUYJnOs7/7Y2Lj9/fRZOE4QbgbECgw+T4ArigWwEdCCQuO5AB6CBYGs5XGJmErDBLF4t1QgX3onyuq0HfFGX/cvOOeqIhxeMcQ0nNzcwdh5Y8jAE9Wcm3IXYDAZcuzP7F/xv0NEhYeyQ/3EIoUlCMBVTX3rbJPV3IA3AFGGMaY7cJ2O+Hbiym08lb7+S3XKJYR97RcxKmEKOk3hwLMgBJjBnMjA/muL/Ln196JVktjsJYNWumDWJ+IwEJddT4nPPxIDqCHIKfZH8t5wrfNsrHttrs6h5nBQfsKZmbbt8MUbTECYnuDVQwHGCB/E4CYQAY29+CPMVJd3d1xyr8mdh6Wv39fxs0dqss+vvvu2IK9lg4cRoR6vNVgMTAMmOQB+gLJAfQUfrfva+oCod0T3Dj1UYdj5YjG+ABvynRnyjqA0tjhnAFFq3eoFvjJxH46ccVReCcQCYJ6Z6ENFBd3P3f15pklI/VdXqMCAbNt5BkNRLQEiDHgooOio2EKvdBfRgKSA+gpShacKucBCIMgUAroQhIQAHDwOGHVcOv2AW7eqorCbgMEECPBqP1qXw4RdXp8Uq7wxASwIxUxhe5C8a91zkTpNoZV88qnf/AQ89gjhnd9gSLu/6xY9MB5I2EolVSB+wXJAfQQeUbIc3KGHtXiFSHPcmRZdznZxx05in//+8dtW5S3v18zHcmEofzKbthKh0f3vt/IGjxclOAei5yCsDjjd4YvAjKMhrTvWzHcueSE46Zx8gG7XrnjUiUFWaKyJKnyDCr1AvQF0rfQQygiKwjiKLW2vB7JZHWJ1z5vNR71ul9j+VBxYUOad6IwIGNAxhm+kfLG9h5GSlliZ+zwSUQjEMP2GHdPhkGaoYoORlXzO889Zvq6xx5ex34HHbrL67NlReUkzGEFT6Ln2fMhEhYcyQH0ErFUdsSrt2pg0nVpjIjwrJPq+NzLZzYsyWa+hE6LRQvIGTRpt4oHZ8D2xpFTiFZ7Yf8cu22EbdjnwqCmp+/de3Dm8x//+ZLixY9f3NX1ifus4WdPSiLlmomi8mfCgiI5gB6iZOxaRlyFDbObZJv3vPoE/J/PDphDls58bpgnfsPtNlj7kN+ELQAZnpP8m/8zcbnyuxQ9uDCgzkxnaT75mXeevuPyZ5/AePxjDuv2k0Y8Arj8g3UApHLbJZCYQH2B9C30EsIg4iDQ5YOBsuTevRMgIrzy1Azf+mB2537DO95d72xbz60mRGvA2C2BYpt0E7eil+G9N/oyb2AfY5AxQKcAZiYwhs0XnbBq+hPn/GjIfPgtJ+/+540+n08IEinkym6FEhYeyQH0EIFsI7GOb1wn273zveqMx+Dd507gkk9c+uNltc1ra60t66U5A9GFiwTKbD5Cco/Dz8r97rP9ZAyk6ACzO3gJNv/g+BVT777osvbWf31VPWo46uJzOmOP6b/euSkiZHmGrNuSR8LDikQF7iHC3ntu/248QWs38YG1T8Ps7Lfx2y9cve7RrzzmTfdOtT/QMktOlsaIUqgDioO0l6cBhz26T86Jyw0UbeSdHTsWqR2fP25l85wLPt6566pfLcHRx+3m6u9zGaXHQ2gPjigGCQuP5AB6CBYJgzL8dGAfC1SaZXYTH/nb5+CAvb+GKz5/4o9PPevXt987Wbxptt15SaFH9pa8TqQyCJUyoLYFmCDkJMSMRmZa7UFMXbXX0MQnTlo1ceEDk42WzNwDomfu/uckuM8HeDnyKvsRv1eDUcIfH8kB9BJzSPeVqD+SCf99sPZVL4TI3+DFf/OEOx518JZ3XnVH52ubpqefM9OuP7HNtUM1skUC1Kz9MwgwRNSqKXmgkbWvHGu0vn/QeOsH3/iXz2761vefh+c947mgj/2+n9P+I8JuItBcRaKdKJgkLAiSA1gQ+O66qD3X0YL/EBB9GMCHAaD4wEf+47JjD5369WfXrRzbuKN+8GST9gdwWMEySMSSEe7Nie4YH5E7jtlv+t5Pv+9F7ctn3gyiCwBc8Addh+U5MaKCpx9oAGGNdlFAp7kAfYHkAHoIIdsJN7cdsOwH+OPh3W/9S7hTbnO3Kx7q2EsBAGei1gXLtyvEny+eCcAGWms72Sw1A/UFkgPoOWT+779HBaCvoeLtjLgZhv5zctr+9xFSLaaH8MM851YAfL/MHvNlSCk9YsP/OQlOSkzAfsEe8//cIwNVjT5xqyMByHZXcr+f4fj/lfHH3h2obLd7HxIePqQtQI8hUS3cawDGP+8ZEEBJhelMrhegHFGanEA/IDmAniPaD0dMQKbuhoM+IhBrgs/5TAJBUWhIlgRB+gFpC9BDsLAlAkWSewSpRsl7BErmX7X1udQjTKKg/YEUAfQQ7PT/rDKOf9RzARX2FH/sW54re31XCbDjwSmNB+8T7Bn/xz1CUM4ERsmOIS8USntMYjzMEY61DyLaU5iSnLDgSBFALxFLdUvUiKMsY35PyQGI7ITrAOcGiNDIFUye1p5+QHIAPQQHQgxgk4F7hsHPRTloNCY42RmGighZpoCkCdgXSA6gh6AwXUfcLD8JvUHM6Hbydt/DE5tt0pPc1CJXBqQMWZ4DWVIF7gckB9BDWDlsZeXAUBqKdQjxaJ5HNoyj/BqOmY92/LEff9bdGLSEhxvJAfQQmcqgsgwKyu8CXGu8hFkdewZ8gbM6F7BUBfJjzhMWGskB9BDktfCUu8WL4J60IJITBfVdgeTrHxRmBSQ6cH8gOYAeQsTq4UvQA+jeDJi3g2gJfn7NzdmGjTuy6WYBKIWMCGzsJN6sltnxQiIwWkMLg4hsSM5UdiCInUyUKVh1XhE78U9sNYLZEnazLLO0ZWZADBQR9hofkhMOHtWTs0ZOPfbInV5rJtbBZa7c56sbAitB3tEFTGIC9gWSA+ghjBFop8sfDD+QZjBXNgc33r0ZR+y3DB+56Lrxd37pjhPaJjtZZfmRhNExS633g0bc+Tql2pZIrLtnw3Fy9GMfnCu2uQgOFQkJwTvghoqCABL7PgRs2wZz4xa+XYSvffdXf3vZ8asat26dLorXPO3IUNsnEkAp95py3w8RsGG0WhqM5AD6AckB9BCGBcZYMQxyXYAEXxojiONliQj++nOX4UdX3zd8/k/ufkHLZGcJ6scJZSNiQOSM0YfTyofZUu6zS9m9uBXX0nKJuDKxJz4WJNEMQ/+qcqS5TVkqaFZ6R9vc96P1za+P1flTAG75zU334+Qj9oFSFBSPKF79/RRkYx1BwsIjOYAeIkwFdq3AFtaSFSkIFEQexEs/9HOMj6ilv7p15u+lVn+1IoyIFBAuwqoe9tLO+GMDtYP+KC7B27u5WgTYSerBRRSxRHHVSbjahVAOpfYXUW/ZNmOe/PpPX/H2T772UT+84JKb7QucgQdRYCqdnj1nygH0A5ID6CEq2r+eKANYAoBrDnzFh36L/ZbUx66735zNeXZWrcMNonaIFIK6r88hun/KgZxzMotSlhulfGv7rETn8U1Jc8pzQdffk3tQ3WIIlBLQ8c2WfPSNn/z1m857wy9//OsbXwQYY7kNzEDmphP7rQWpVAbsEyQH0EMoRVCKyuy4SwYyMwptMDiY4+9euH/2xn+/7U3TZvA1GZu69sk0JTa0JsJcG/f79LgBp/xXXHLPQyoeoMxFSFDvKfn7LiMQpMzJsRndY0IQd2ZNtGbj9uIDf/OZk2/7zA9uvhNao1NoMJObiEShIJDXCJwlB9APSA6gh8izDLU8syuge0yEUegCzTZjUiu85yu3HjfZzl6jldS50DBKIQuOQ1Xt04G8M0E0kpuqxCJrxOGXyNgjZ0Fl9V4opixLaOe1q3+k6+d+BwEdxsnr7229/KJ/eOrZn/vkT6CLDtjkyKI5AJYOvOewHh/pSA6gh1DKBczKTcp1iTtjDNptg29+6S485eVHP6tlavtSJmAyUOLKckpBkbiUgUsf7iwSAKrGLWVa8CGJhnOdiRAk2vhHth7UfOc6BTv0BKqt+S9e9v6L/q2+YvQeU2gwW9oTRRJhKgMkRQB9geQAegiO9/1u7y6wdfyiYPmbd6wZ/vkd+olFJshgw2YWtuU0to4jHipaOoF49NfOOUWlRm+sSFhuEeID7eSg6utDLT9qaBIphU5FBAYC0+FDN20vTu5o3GO0ZnDu+X+hF0ApgPcYAcRHNpID6CEMMzQzRNxQDHIjwkWwz1ijvmWyWNls0wFocGDSERFYKZASK6YL5R53JTa7ZDt/wJWxW2EGoH2zSsQgUroCv8qXT3vufnhlWV6U0gmEhCB7sQ9GUcjAVEefKJe+/RuP/T+fnKP/T4H6LA8ZjiT0EskB9BBGG5jCgI2ypBw3LptAmJ7tdApFB5giX4rMQJRzAErZCb5ELgnIAClrnuT77K1xW6PiUnrLPmnVhnzYEMhGVGbmnUPyVYHSfZSTC0O60L2GI0fg25yZGVozSPFRwIMNRZQD5Dof/UxABgzSdNA+QXIAPYTXyhSJuv+cPbZb2nSybJiNGhDNkIxsyO9aaUkRWFRI1LHT2qeQvINb+dmus/ECDwmlt7DSu6x/PK14PidAoRIXiB9nKlXjjyIAYxitTlEDpgtmR0COJgWJCApmmKQJ1hdIDqCHCEp5ZPX/rNGyGxtuULARNmxr5+T3+86AxJF9lE/2RUSdkM23jkVMAWENymrBiInEOoAoWRggsK8xBiqrOcdBthJAsZyXFzSNxD1dRUDY9jkwWycATIQw335O5ziY0WprgBIVuB+QHEAPkakMGSnnAAC7TDOEDbTREFW3j7h+euJg8XbPT1KG0/Ge3tfYQWhvfwCTd90I3ZxAffFyLNr/SOTDS0J0AHecuO2HkEJz892YvPsGSHsWjSV7Y9G+q5ENjEB2QtiptjFzZfW3joxDRCFcbkVsYtFuH4zREJOGg/YDkgPoIbKMkOUqrOoiAhgnB8TeGZT7aSscImEP7sv9gfrvm3tIIJShmNyKHTf9hkfU1E2LR/J7Hty84agtM5P7LT3yFOSDIwAbeHMklUGIMPPg7Zi85bJ2Xe/4MQnf0Zre/Iyi1TxwbPXJoLxRhu6oVgcEHOYbsLtm6wDcMaYz59PHnARLKEpYeCRhth6iyuEhm3Tzq6VIyIuF2QEhzLa5M3ZTddkZXXwTY9DcvBENNG98+lNOfMk1P/v0s0970glnjdDU+m23XIHOzASYGWyMDdeLAtMbb8bMbZe3D1zeOP+VL3ryyzfd8PU3HbDf8n8201t1Z2bSTjOO3s8Y65iYjbsXe00y95oJaEaKRxVjJ0g1tZCwgEgOoIegkBFHlKm3Bm4MB4P3liQVoyqNX9gaog+52RiwKcCmDSjz4NIR3P7Bj325+MK5b7v4CY89cu2w2bp++4bLUEzvsI6k0Ji6dwNm7ryifcDy+vmveslT3zvV0lsWHf4XWLlibFtWq4nVKfQGz479V+7zmQXgctWPqX0iAArtHBwqfQ+KCJntL1zoryMByQH0FKUGIMp9NOxe2jAHQykfL7fu1gBL47erOZc/C6OxZG90UD/xl1ff/oqXPvvx9W997xJ84SNr151y4kFrh/SW9dtvuRydic2Y2ngTmndf0z5on6HzX/6iJ733plvu2faJ87+BV59x6upb7tr6WjW6V602uAhstFvt3S3s+b0zQillFkocdgIS2h0Im7KPwO1dSBHyTFll4IQFR/oWeghmhhFjV/GyR8/t+W1STOat/H6KcPScW/mNW42FBYYF+aJlGNzv2CUb7mv/wyvf9rGzjjxsRf3C7/4MX/r429c9/uQ1a4cxsX77hl+hvWl9+8CVi89/1Yuf9t5b77h/23kf/yre+Mpnrf7OT68/dwJLnjK631EwlIENl4k+5pDgK8N9qVwvu9YgFkanORtNQZKQu3AsgnniJwkLg+QAegjjQmdxG2cScT07bFtrxYTuutAiXDEyn2Vnl2EvtwoQgWaF+rKDkK88dvyGu6fOfv3ffuqsIw9ZWf/aRT/Flz/xjnWnnnzk2rEhufSgVUs/+fIXPvW916+/e9tH/+mTeMmZT1z935fccO5UvvfpIwedQIYa4Rqt/UrIRbAP+0NYL8FJBZtmATo2CRicQBT5ACkF0C9IDqCHEBcyh/KfvwUiTmQkVDoJ/8Kw0gYGX0QmEksaKrRBben+yFceO379XZNnv+4dHz1r9QF717/0tYvxj+/4yx+edNTK5zzxTw79u89/5bvbzvvnj+PFr3jW6ksuv/XcKRo7feSAY4lpAMw68BPCe7OfayjzohRItKC72Qf1Rh4GgVdACPJiCQuP5AB6ibCxL0N/b0VsODT7lK28roPPs/XY8wPmlt38cwJihtYajfH9UFtx5PgNd+44+w3v+uhZRxy6sv69iy+RC//tfVv++jXPnb36x5fg+X/5zNWXXHHbua3GitNHDjyOCuRgU5RRBez7SSD7eI4CQhcgokjEX5/N99UjebI5CkjRbwkLi+QAeoqIFQPHr4tIMxSag/zaybA9dtW9NKJwO+QQ/MhtYYANio5GY/xADKw6dnz9xumz3/iuj5910jGH1D9+/lexcv9n4YxXn7n6ihs3ndsZWnn66EEnkMkGXNIuMviwypO7zJIBGHj9sSlTdJerMPrMf05x05HtFiZRgfsBiQjUQ0RBftSe68J/BWSZVdK1Et1RR59T46m27O1sDeXoeECzoLH8EEBl47fef+PZa9/7udpTTjnmW09/4Wl7X3rtfe8rRg44bWTfI8lQbU534Pzzl10EZWMQ7ewaCFaafKARtRI4nUFmkCcOJCJQXyA5gB7CquJG4TVKZR4ihSzPyTMEfQ9erOJTtur5FmDH1xcqHckcwyoYqI8fBJU3xu+4/5Z//Mr3r3tLsyMDPLrf8uF9jyANFTmbOAfhnE4pNQpLJd5ZCO/cg+tszBQB9QxKqdCnICEKAAT5HjsY9ZGG5AB6CAJDEYcBoSA7LxB5DaI0KaAtIlpEGhwJdVib9wZpz2R9gd9/R2O4KkZsfywMo7ZkFRaNjA11Jrcc0KgNQI2Mo2MIgImag2KHgzmRQJm7iB1X+eGo+uNww/YbKCcpHpoIJIwJT1h4JAfQQ4wM5BgdrjNNavF74CzPwFkDU61Zau2Yvkebke1QMlyW2SzIG3xlRfZGFGkAxNI/Urb+FgVDqQHkS/cHs6BdaHdA2e1f2WE4vQB7KncfSng7S+K5VzOjlkkT2aO5rS8TUnlp7CJQECxdNAJdH1noryMBKQnYUww2FDLie8G8XZxSbp5nUPXGiKoP7zU+LDuU6O0cknFRrZ99CF0m0cpbWYuvknPK6oGwHRfWbrVRdNrla137MXP5Pr7kJxInBX0ikqP34nCdPsEH1lDgDUTvkKbOBrN6DVmmnPaAwVCdzJ8/4XicdMxhC/11JCA5gJ5ixdIhjDb4PiXFRtvzD1CeQ9UGlmqqn/DdTx68NZP29VK04UYIOWMracAVg4+Ms2TslQIdiF7jS4mhNh+qCuW9MFcdjCce8Zzn4kw+i+0yZAMxGtDN1nCur/rkZ46oIW8cndUaoEzZmIE1MjK3PP/pp3SOXbP/Qn8dCUgOoKd43AmH4L0vO3JiqCY3CxsIAypTyBuDqsDAKcDhajhrr5POTIe1BrEBxIT6OioRgTe+qJ2YQ8tg3D7oFHtteZDZG258nAlGHs4TvZ4CCSB6nfG/e+M34HYTNT1166oldNl/XdY5lLPGsVmtZrcZLCAxRZ7x5SOnvBePPmavhf46EpAcQE/xsmc8Ckc+8+tmZFD9XIk2VjmHkNfr0Kr+1Me94mdH7DNSfC8vpq4w7VmwtsIZYowLwU0wWuLSeBFtCbyhimvblXBzfQNmDrffGIjxhswlF8BEq75/zm8FuDR+YW1fqwtQe0ovypv/9dVz33B/i7MzVH1gP5VltnHIMOqK79tn6cA1J61ehsGUBOwLJAfQQyxdNITTn3E4Vo7Vf1GnzkajO9DaQGUKKm+sfHCaTrv4ytHNywY7n1Cdia2m04TowhqlsUM1xTDEOwatw3Mw0UqsDUSb4AisMTtHEu/7w+8Gohmi3TH+3rB93DkNsF35hb1TsO8ruoC0pzEk0+sO27v22We89rxDZzr5mXljkIjIXU8Hw3Vc9oJT973jSY8+ZKG/igSH5AB6jGc+4Qi86y+Pu3Uo1z+Qzix0pw02BrWBBuUDw284ZrU86f97yvKvDdLMe6U9uZV1xxm/X9FL4xNngPamgwOIw3IYAxLvIMqQvVzxOSTvwD7i0PZ8pnCP28esA4nPxYDRkPY0BsyOG1ctkX849pDxqXsn5C0mHzg8yxSYDUxRIDPN1tJhfOPVH/x1+80vPnWhv4YEh2yhL+B/Gy74z8/gya//Eu8z1tg6Md15umE1qlSGRqOOWq2+tCj0yfdv0zc9+TD+xl2bmxOF4ROM0KhtuLEJN+Wy8xSvxBxvEUz1xtFj4GgbYUDueGJj5xVE5yP/u9coFAnvQSKA0aBi2gzwxM/2G8Nfv+Y5q6/64k8efG0zW/xX9ZFFDSOCTrsN3ZrBorz5mycfv9eHjj1s+cwZp5+40F9DgkPaiC0A3vEvX8fRB47W/t+Xrzt3a2vg9bXhpRgaHcXI8CBMu4li8sH1ywaaa1/8J9lPPnPx5lPun8CZBQZPIJUdB1INABGdttJcgMDKi4iDtFPuQFTJdy3JvrUX8ZGOzAPK3FlsMlKJ0TmKWwdU68vLR4rPHnXoih1X3WnOmlWL3zOwZNm4UIbZ2TZaM1NQncnp1Svrb1z36bO/eM36K3H8mlUL/RUkOCQHsAAQEfzpiz+Iww5YftSvbtzypWkePa4+shQjixZhZKQB02mjObntzoaZOmfVos7n9dhRE1f+/IdjwwP5c0H4UzFmH2MkWHpps2UDbmDqzZsJRpHj8M852rFb7csR5Jbwo1QOqAwKQJ7BkKLbB2p07diQ+tm7/mL5neesM0dsns3fpmuLXziwaGyElcLsdBOz05MwM9t4r2H9qdef8ai33/Pg1MwH3vy8hf7zJ0RIDmCBcM1N9+C4Nfviz88697Tr75r5qK6PrWmMLsXwolEsGh1CRsDsxESrmNr607qeuKDBkz8+db9t933wrcPmil9szbZsnYEIoQWDji6cfp8CM1l9QQNQrpBlBJECbAAlCh2tURSF289nIDJ2O68IKCw5SeoZFDSkmBBAQ3gxtBQYyAmHH7QST33Df/FL3/hPg7dvy46cNYPP5trImY2RsUPrQ8OqUxhMT8+gOT2FYnqLjGSzF//psfu87r7NU3et++xbEwW4z5C+jQXER/7tIvzVK5+FE57/gdMfmFLnSmNsTW1kDIMjo1iyaBjDgzVwp43p7dvasxNbbzet6fW6aG2A6TQzEhuZhxkBEqYGx6v4XMpuOT40ig7gkoGwbb9kB32KMaxFRDKyrYgsBGS1TPLBxuDw6En5wOhJA6NLxgeHRxSTwtRMCzNT02hOT0BPb5UhNbvuqIMWr/3OVy/ZcMf1n8NBq8YX+k+eMAfJASww3nPOV3H22jPwmDP/+fQHJtW5LRpdowZGUB8awcjIMBYN1zFQU2BdoGi30el0oDu2NKhUqa5DzgnETbpS+ScaIhrGiYWZYtHe3+30KxqErnefCFmWo95ooDEwiFq9Dg2F6ZbG1FQTzZkZdGYnIc1tvLjWXHfkQUvf8o3v/nrD9T/8fzj68P0W+k+dsBMkB9AHuOgnl+NZT3oUXvK2zzz+utu2v2d7M3sC5yO1rDGEeqOBgQF7q9dzpxmgrPErQkbxaLB4xY91+7wfiLv4BHbScGWAcNRu7ETLwuy/cpKwHQJq0O5oNNsarWYbndYsuD2Fusxu22sEXzzl2H3OOec95901MfljLF40utB/4oSHQHIAfYJmawaDAyfhHR96z4pfXrfxVfdt7fxls8gOlayRq9oAstoAVF6DyjKQyqCUmyw8f8wfwkof1LtKLT+KHIZVFKCoeuCiBPc7UB31RQAQZMk1TFHAFG2YThO5dCZHBvinB68YOf/5TzniR3dvmmi/7y1npD1/nyN9O32Gb//ol3j00Qeod/3rdw++/pYHTp+YLp7TLOhojXyZUK0OlQMqd332O/v6quU+AUrSkN3gQxFZmS+3/Hshj6iYEA0urToACRwCLSS6U8/MpkYNP1mxdPDCxxyz7yUfOv/iqfb6z6NRbyz0nzKhCyQH0Kd44MEHsdfy5XjXB78w8str7tx/x3RxTGHk2DzPV3cKGdTG7sut0bqefpHqNyoUZg6IKSXHCeSUhQGlMmR5BpByMYAbSw64QSAmOAAFoJ5naNTz7YbNjYON/IZD9x/f8ISTD719/W33d/71PWelFf8RhvRtPUJgjIZSGW7acEvt6us20D0bH0Cz1YExDG00jDAy2PyAEQOj7TSfojDotA2ECHktgzF2H1+YAqwNsixHXleo5RmICLVMYXBwAEMDDTBsSdFAoFSGwXqOww7eDyefdJTZd9VKAyRln4SEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhD8c/z8RI3kX/DRowQAAAABJRU5ErkJggg==
// @author        mickey90427 <mickey90427@naver.com>
// @license       MIT
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/539594/%EC%BB%A4%EC%8A%A4%ED%85%80%20%EC%8A%A4%ED%81%AC%EB%A1%A4%EB%B0%94.user.js
// @updateURL https://update.greasyfork.org/scripts/539594/%EC%BB%A4%EC%8A%A4%ED%85%80%20%EC%8A%A4%ED%81%AC%EB%A1%A4%EB%B0%94.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        /*===== 🌟 기본 스크롤바 제거 =====*/
        * {
            scrollbar-width: none; /* Firefox */
        }
        *::-webkit-scrollbar {
            display: none; /* Chrome, Safari */
        }

        /*===== 🚀 커스텀 스크롤바 컨테이너 (트랙) =====*/
        #custom-scrollbar-track {
            content: "";
            position: fixed;
            top: 0;
            right: 0;
            height: 100vh;
            width: 15px;
            background: rgba(0, 0, 0, 0.1);
            z-index: 9999;
            pointer-events: auto;
            cursor: pointer;
            opacity: 1;
            transition: opacity 0.3s ease-out;
        }

        #custom-scrollbar-track.hidden,
        #custom-scrollbar-handle.hidden {
            opacity: 0 !important;
            pointer-events: none !important;
        }

        /*===== 🔥 애니메이션 그라데이션 핸들 =====*/
        #custom-scrollbar-handle {
            content: "";
            position: fixed;
            top: 0; /* JS에서 transform으로 제어하므로 초기값은 0 또는 제거 가능 */
            right: 0;
            height: 20%; /* 핸들 높이 */
            width: 15px;
            background: linear-gradient(
                45deg,
                #ff00cc,
                #3333ff,
                #00ccff,
                #ff00cc
            );
            background-size: 400% 400%;
            z-index: 10000;
            border-radius: 8px;
            pointer-events: auto;
            animation: scrollbarGradient 5s ease infinite;
            opacity: 0.8;
            box-shadow: 0 0 10px rgba(255, 0, 204, 0.7);
            /* 성능 개선: top 대신 transform 사용 */
            transition: transform 0.1s ease-out, opacity 0.3s ease-out;
            cursor: grab;
        }

        #custom-scrollbar-handle.dragging {
            cursor: grabbing;
            transition: none; /* 드래그 중에는 transition 비활성화 */
        }

        @keyframes scrollbarGradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    `);

    // 스크롤 트랙 및 핸들 DOM 요소 생성
    const scrollTrack = document.createElement('div');
    scrollTrack.id = 'custom-scrollbar-track';
    document.body.appendChild(scrollTrack);

    const scrollHandle = document.createElement('div');
    scrollHandle.id = 'custom-scrollbar-handle';
    document.body.appendChild(scrollHandle);

    let isDragging = false;
    let startY;
    let startHandleTop; // 핸들의 현재 transform.translateY 값 (픽셀 단위)
    let rafScheduled = false; // requestAnimationFrame 중복 호출 방지

    // 스크롤바 가시성 및 핸들 위치 업데이트 함수
    function updateScrollbarVisibilityAndPosition() {
        const docHeight = document.documentElement.scrollHeight;
        const viewportHeight = window.innerHeight;

        const needsScroll = docHeight > viewportHeight;

        if (needsScroll) {
            scrollTrack.classList.remove('hidden');
            scrollHandle.classList.remove('hidden');

            const scrollY = window.scrollY;
            const scrollableHeight = docHeight - viewportHeight;

            let scrollPercent = 0;
            if (scrollableHeight > 0) {
                scrollPercent = scrollY / scrollableHeight;
            }

            const handleHeight = scrollHandle.offsetHeight;
            const handleMovableRange = viewportHeight - handleHeight;

            const newHandleTop = scrollPercent * handleMovableRange;
            // 성능 개선: top 대신 transform 사용
            scrollHandle.style.transform = `translateY(${newHandleTop}px)`;

        } else {
            scrollTrack.classList.add('hidden');
            scrollHandle.classList.add('hidden');
        }
        rafScheduled = false; // requestAnimationFrame 완료
    }

    // 초기 설정 및 이벤트 리스너에서 requestAnimationFrame 스케줄링
    function scheduleUpdate() {
        if (!rafScheduled) {
            rafScheduled = true;
            requestAnimationFrame(updateScrollbarVisibilityAndPosition);
        }
    }

    // 초기 설정
    scheduleUpdate();

    // === 이벤트 리스너 ===
    document.addEventListener('scroll', scheduleUpdate);
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('load', scheduleUpdate); // 모든 이미지 등 로드 완료 후

    // MutationObserver를 사용하여 DOM 변경 감지 및 디바운싱 적용
    let mutationUpdateTimer;
    const observer = new MutationObserver(function(mutations) {
        clearTimeout(mutationUpdateTimer); // 기존 타이머 초기화
        mutationUpdateTimer = setTimeout(scheduleUpdate, 100); // 100ms 지연 후 업데이트 스케줄
    });

    // body 요소와 그 하위 요소들의 변경을 감지하도록 설정
    const config = { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] }; // attributeFilter 추가
    observer.observe(document.body, config);


    // 1. 스크롤바 트랙(빈 공간) 클릭 시 이동
    scrollTrack.addEventListener('click', function(e) {
        if (scrollTrack.classList.contains('hidden') || isDragging || e.target === scrollHandle) {
            return;
        }

        const clickY = e.clientY;
        const handleHeight = scrollHandle.offsetHeight;
        const viewportHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        const scrollableHeight = docHeight - viewportHeight;

        if (scrollableHeight <= 0) return;

        let targetHandleTop = clickY - (handleHeight / 2);
        targetHandleTop = Math.max(0, Math.min(targetHandleTop, viewportHeight - handleHeight));

        const newScrollPercent = targetHandleTop / (viewportHeight - handleHeight);
        const newScrollY = newScrollPercent * scrollableHeight;

        window.scrollTo({
            top: newScrollY,
            behavior: 'smooth'
        });
    });

    // 2. 스크롤바 핸들 드래그하여 이동
    scrollHandle.addEventListener('mousedown', function(e) {
        if (scrollHandle.classList.contains('hidden')) {
            return;
        }
        isDragging = true;
        scrollHandle.classList.add('dragging');
        startY = e.clientY;
        // 핸들의 현재 transform 값 파싱
        const currentTransform = getComputedStyle(scrollHandle).transform;
        const matrix = new DOMMatrixReadOnly(currentTransform);
        startHandleTop = matrix.m42; // translateY 값
        e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;

        const deltaY = e.clientY - startY;
        let newHandleTop = startHandleTop + deltaY;

        const viewportHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        const scrollableHeight = docHeight - viewportHeight;

        if (scrollableHeight <= 0) {
            isDragging = false;
            scrollHandle.classList.remove('dragging');
            return;
        }

        const handleHeight = scrollHandle.offsetHeight;
        let clampedHandleTop = Math.max(0, Math.min(newHandleTop, viewportHeight - handleHeight));

        const newScrollPercent = clampedHandleTop / (viewportHeight - handleHeight);
        const newScrollY = newScrollPercent * scrollableHeight;

        // 드래그 중에도 requestAnimationFrame을 사용하여 부드러운 스크롤
        if (!rafScheduled) {
            rafScheduled = true;
            requestAnimationFrame(() => {
                window.scrollTo(0, newScrollY);
                rafScheduled = false; // requestAnimationFrame 완료
            });
        }
    });

    document.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            scrollHandle.classList.remove('dragging');
        }
    });

    document.addEventListener('mouseleave', function() {
        if (isDragging) {
            isDragging = false;
            scrollHandle.classList.remove('dragging');
        }
    });

})();