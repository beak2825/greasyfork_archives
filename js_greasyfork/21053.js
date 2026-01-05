// ==UserScript==
// @name       Aliexpress Google reminder
// @namespace  https://greasyfork.org/ru/scripts/21053-aliexpress-google-reminder
// @version    0.20.4.0
// @description  Add a Google Calendar reminder link to Aliexpress order lefttime
// @include    /^https:\/\/trade\.aliexpress\.(ru|com)\/(order_list|orderList|order_detail).*$/
// @include    /^https:\/\/(.*\.)*aliexpress\.(ru|com)\/(wishlist|item|store|shopcart)\/.*$/
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAABHNCSVQICAgIfAhkiAAAAGJ6VFh0UmF3IHByb2ZpbGUgdHlwZSBBUFAxAAB4nFXIsQ2AMAwAwd5TeIR3HBwyDkIBRUKAsn9BAQ1XnuztbKOveo9r60cTVVVVz5JrrmkBZl4GbhgJKF8t/ExEDQ8rHgYgD0i2FMl6UPBzAAAgAElEQVR4nO3dd3wd1Z338c/vzNyi4m6DLVOWTsAyGGxKnIROGj1AQmCTsBt4SEg22WezKbtJnmyWTXllk2yyS0LKJgQIBEIJHYNNdcHGxsgypju4yVWWLVnSLTNznj9GAmNkW9K9d+aW3/v10sugMr+je+98Nefcc84IFcKCs2Gqc5bFHifIPtYyTkQmWmvHA2OBUUACkTpA4m2tUmXBYm0vkBfotNAuIlustRtEaLeB3WhFnpvc6s+Ou6GDVbYn9ppj3BOcIDgW5HiEM8XKOISUgbQjYNnpw4b/wtv/KqXePsEFEOn7t+/Dt+BbMkAWse1YZoNd4hvzwv4t3qK42rwnZRVYW46gKZ8wnw1ELjDIAQnDOACft0NJA0mp4nkrwAScvs/lA9oD7Gpj7V8S+eC341+hLcYmvkNZBFZbs/maiFxgRE5yJUz+wEIQd8OUqkEGMAKO9F+F2WettX9pag1+GHfbYgusdVPck43YqyxcbERGmL4HR6+glCofQhhcgYXA2i6Eu60vv5n8ojcvrvZEqq05cbwQfM0iH0waRnp6JaVURTCAK5CzdBEEsxDnB02t+SVRtiHSwFrf7NyCyCUJIalBpVRl6g+uvCWHtX+e1OpfEVXtSAJrfbPzfQv/kDRSn9dun1JVQYCEQC6wPQI/n9TqfyOKmiWz7mhmiuPc4CBTLHpFpVQ1MvRNk8Aut75/zeQXKdn4linVgddOca4T485xRab4aFgpVa0CwqlHrsgUMe6ctVOc60pVq+hXWJuOYqLnOPenHZmeDbT7p1QtESBlIOPbxa7vn7vPCjYU8/hFvcJqm+Jc4DnusoSR6RkNK6VqjgUyASSMTPccd1nbFOeCYh6/aIG1vtn8o4jc5hgm5DWplKppeQuOYYKI3La+2fxjsY5blC7h+mbn50bkizqwrpTaWf+AfGDtf09q9f+h0OMVHFhtzc7v0458RserlFID2Wlc68amVv/KQo81bOumOre6IpcFOrdKKbUHQrg+0bP2tsnL/E8O9zjDHsNqa3ZuTmhYKaUGwRKuR0yIXNbW7Nw83OMMK7DapjrXpx25QhcrK6UGyxJucJB25Iq2Kc71wznGkANr3VTzFVfk8zpmpZQaKgtkA3Ad+fz6KeafhvrzQxrDapviXCgit4qQ1ncDlVLDZQBrySD28knL/LsH+3ODDqzVR9CUSLrLjGGcr5dWSqkCOQJBQHs+5009YJC7mg66S+gmnXsdDSulVJH44eTScW7SuXewPzOowGqb4lyXdmS6p2GllCoiLxyEn942yAXTe+0SbpzCe31xHxchpXmllCq2vhDKBuKdMbllz1vT7PUKyzfOrxJGw0opVRoWcISUWOeGvX3vHgNrfbPzPQeZoouZlVKl5FlwkCnrm53v7en79tglbGt2uo1IvU5hUEqVmgECa3uaWv2GPX3PgNZPdf6YNBpWSqloBEDSSP36qc4fd/c9A15htTUnjkfsfIGk9gaVUlERwEIOK+8d6BZiA19hWf/rSdGwUkpFywJJIYn1vz7Q198VWOumuCcj5mydc6WUioNnATFnr5vinrzr194VWCL2qqRhpI5dKaXiEI5lMdKIvWrXrw3UJbxYr66UUnHywq2rLt718+8IrA3N5qtGZIReXSml4hQARmREW7P52s6ff0dgBSIXmUhuXq+UUntmBETkwp0/91Y8rTmGySnctbqLqFKqHAjhFjRZvP32b2Ed7HSFZaz5rCMaVkqp8tC3xhBjzWf7P/d2l9DK+brXlVKqnPgWDHJe//8bgA3HuCcY5IBAA0spVUYCC1g5cMMx7gnQF1ieH0xLGsbpu4NKqXLSNydrnPWDadAXWI7ICXpxpZQqRxZA5O0rLAtn6PiVUqoc9c1cOAPeGnSX0ZpXSqlyFGaTjLaQMG1TnLME3QJZKVWeLCBCam2zc6bB2BlGSGtgKaXKkQWMkHaxxxlB9nF0OY5Sqow5ACITjLWM06srpVQ5s4C1jDMidqIGllKqnIXjWHaiwcp4DSylVDkLr7BkgrEw1mpiKaXKmLUgMNYAOgdLKVXWbPgx0oDUa2AppcqdQNJFcONuiFJK7UnfesL0bu/8rJRSZUY0sJRSFUMDSylVMTSwlFIVQwNLKVUxNLCUUhVDA0spVTE0sJRSFUMDSylVMSpzlnvew24mvAdQMQjhI5EC0iAJwDFonitVXiovsPIe7gnnMurr3wPjhMu4CyIQ+AQdm/BeW0520dPklz1HsG41Uh+AU3kPkVLVStqmupW19tn3MBMPYcKf5mLGTyxJiWDbFnqfnk3Xty8j2A4yQkCcktRSSg1e5fV5HAd/+Rvk31xZshJm9HgazvsE+y7qpe5T12I7LVivZPWUUoNTeYGFQD1knnyg9JWSacb82//Q+C8/xHYB1i95TaXU7lVgYIGkIfvM7Mjqjbz6q9T/3Zew2yur96xUtanIwMIBf/ULeCtXRFZy9Lf+C+eQ/SGvXUOl4lKZgWUcbEee3KuvRFp29Pdv7turVUNLqThUZmAhkIDsvOi6hQCpE08hcfJHIBdpWaVUnwoNrL5xrLt+EXndhss/h+2IvKxSigoOLIyL3wb5V5ZFWjbZfDzm4EbwtVuoVNQqN7AAGQWZRXMjremMGUfi+HOx+UjLKqWo8MAiBbmWJRBEOD8qkSTRPE3HsZSKQUUHlqQg/+Tv8DvaI62bPvkU7PZISyqlqPDAwrgEa8Bb+WqkZZNHH4cZg05vUCpilb8VQSNknnyQ1Iz3RVfTcUme9hGy9zwEDRpaqjJJA5CsrAiorNYOQJKQXbwQbBDpbRYbv/TvJE+/GNyKfwhVDRLjkHn8QfJP3FpRoVU5Ld0dF4KVz5J/4yUShx4dWdlU83Gkmo+LrJ5SxZZ58Ka4mzBklT2GBWAcgo295N94Pe6WKFUxgo4t5B6ZBQmJuylDUvmBhUAaMo/8Ke6GKFUxMnMfDc/+CtuYsgoCK5zekL1XA0upwcrMexoa4m7F0FVFYGEMNgv5F5fE3RKlyp6/eQP5pU+FN1upMNURWBhwIbNsadwNUarseWtX4S9/GdzK6g5C1QQWkIbcM7PA10V+Su1J74O3QRrC+9tVlqoJLElC7sk7Cbq7426KUmUtO/dxJB13K4anagIL42I3Q/4l7RYqtTv5l5YStLVC5fUGgWoKLICRkHn6sbhboVTZyi57IVy4L5U5Z7yqAkuSkGt5Htur3UKlBpK55zdIfdytGL6qCixc8FfMwlu/Nu6WKFV2bE8XuccWQKJyT/vKbflAjEuwAfKvvRR3S5QqO5n5syFJpJsEFFvltnx3RkDmvj/E3Qqlyk5m/ryKnN2+s6oLLElA7vlnwdM9jJXqF2zfSn7uvUgq7pYUpuoCCwO2YwO55bpMR6l+3trVeC2vV+Ts9p1VX2CJi+2F7IvL426JUmUj8+idfd3BypvdvrPqCyxA6iH76O1xN0Op8hD4ZBYuqPjuIFTDjqMDSUBu9hxsphdJ10VWtvPXPya3YgWi2yarwchnGXH1l0kefWxpy7zxEsHr86ribK+CX2EA4oLnkV3yDOmZZ0dW1qRcsn/4HTIhspKqUvlgxo3G+dq/lbxUbkUrwcYsMrbyT/fK/w12pxGyC+ZGGljp086lM/1lJG0qeq6LKj2b8UjMOBOn6cCS1+q99WdIY8nLRKJqz6pwmc6z2O6uyGqa0WNxp08FP4ispqpQ3ZA+87zS18n2kJu3ECpws76BVG1gkQBv0WP4HVsjK2lGjiYx42xsNrKSqhJZD2mA1Iz3l7xUZuFT4RuDFbZ3++5Ub2CJi90B2SVzIy2bmjYNMpGWVJUmB4lTLsSZsG/JS2WenRcux6nw6Qz9qjewABog+8SDkZZMn3QqdlukJVWFsRlInfA+JFXad7BtpofcrJsqdrO+gVR1YEkC8itasTu2R1bTTGjCnVoHvt7CXg3Mbof0+84oeR1v1Uq8ljUVP7t9Z1UdWDgQrFlOLuLdG1Ln/QO2N9KSqlL4Hs7BkDjymJKX6p1zH4yAaukOQrUHlrjYHsgtfS7SsqmTTwMLWH23UL2T7YW6y75Z+kK5DNlFC6qqOwjVHliANEDm/v+NtGbykMMw48dqYKl3sj4i4fhVqeXXvonf8kDVzbSs+sAi4ZB7uAXy0c01cPY7GDP5UPAjK6kqgbUwaiTJY6aXvFR++VKCTYCprsSq/sBCkDGQmTsr0qrpUz+I1ekNaic2B8npH8CMGlfyWj13/AoZWfIykauBwALqINvSEmnJ1Ac+ClkIB7OUArqh7ty/LXmZoH0j+RWLqq47CDUSWJKG3PxHIr2bjjtpMs6hTeBrv1ABgYfZB5JTppW8VHbZYuy23qpcz1p9v9FAXEP+mfn42zoiK+lMbMI99kxsPrKSqpzlwT3+Itz9Dyp5qezcJ8IzWwOrQokBB7LzorzJqiF5rC7TUSGbgdSJJ4NT4n5aEJC588dIdNvARao2AgugHrILo11XmD7pVIhuswhVtix0QfrUj5a8Um7FEvw1VN27g/1qJrAkAd5LLxBs3RRZTffQozD7AYEu06lpno877YBIuoOZZx5HRpW8TGxqJrBwwF/xPPk1qyIrKYkkyY9erdMbapzthdS5VyOp0k47tz1dZOfNrrrZ7TurncASFxtAbtFTkZZNzXg/5EGnN9QqCx6kps8oeSVv00a8hbOrZrO+gdROYBHeTSfz0K2R1kwedXQ4H8bq9Iaa1Pe8p088teSlsgufDBfdS3WOX0GNBRYu5F9cStAR3ThW4shpmDF1oMsKa5LNQurDHwU3WfJamYfvqpq923entgJLDOQhu3RRpGVTp1+q2ybXJAu9UHfRZ0teyV+7Eu/VF6pydvvOaiuwMCCQa3k+0qqpMy4C3R+r9gQ+pmkMycPfU/JS2VdfJmjbAE51n9LV/dsNQOogO+vmSHcETRxyGGZfdHpDrfHAOfwk3IOOKHmpzEO39e3dXt2ndHX/dgNxXfLzX8ff1BZZycSBh+C850OgeVVTbA/UnXZWJLUyN91S1dMZ+tVeYAEyCjJzI1ym4yZJTGnG5qIrqWJm/XA6wykfKXmp3OKnw1kzVfzuYL+aDCzSkH1habQlTz4NdkRaUsXJsyROnIG7z8SSl+p9dn7f3u3VryYDS5KQf+4x/M3rI6uZPOYkZAw6jlUjbAaSp56HNJZ2nYzt2UF21q1Vu9h5VzUZWDgGf8Wr+BujCyypryd5yoV9s95VtbPbIX3yB0pex1u/Fm9RK7i1cSrXxm+5KzHgQjbCbZMlmSIx/f26rrAWBB5mEqRmlD6wMrPvhTqolVO5Nn7LAUgdZB5/KNKa6WOnQXSbnqqY2C5o+Pz3S18o8MnMf6ZmuoNQw4GFC/6bL+KvXRlZyeSMU8OpDXr7r+oVeMjYJPXnXlryUvmVr+Ave7DqZ7fvrHYDSwzBlg5yr70Sadnkh2dCXgOrWtluqDv/Gtz9Dy55rVzLYoItVO1mfQOp6cBCILfw6UjLps/5NFa7hdXJ9zCjofHvvhxJud67flP1i513VbuBRbjdTO/tP4i0ZvLoY5ARgNXpDdUmaIMR37opkp1Fgy0byD03t6r3vhpITQcWxsV/g0jHsRKHHIHZb4reFbrK2B6P9KUX0HDeZZHUyzw3NxwPFSeSeuWitgOLvmU6C6PbhVQaR+EefpReYFWTnIdphDHX/bL0d8Xpk336sb7BdomkXrmo+cAiDdkli4lyC+P06efoMp0qYbMe0ljHuNtbMeNLvwwHwPb2kLn91zU1naFfzQeWpCA/9y6CbVsjq5k6bmb4YtPLrMplfWy3h9N0IOP+uIjE4VMiK52dPxvbQ00sdt5VzQcWjoP/8ka8tasjK2nGjMGdNlO3m6lUvoftsiROOIXxtz8baVgB9M59Amrs3cF+GlgINED2yQciq2hGjsE9dqZuN1MRbHgl7HnYHg/b5iEpGPXTm5lwyxycCdF0A/sF7RvJL5iFpCItWzZq75pyAJKGzML5jPhCdDXTM06g93qgoTjHs9s87LbiHEv1seGQgYwH57CpuMecQt1pZ1J3+nmxNSn3+it4L7yE7Ftb7w7208CC8CarK5firXoN98DDIimZOuFUyEDfzmsFHctu8xj54z9Q94EPYj3dDqKoRBDHIOk0ZuSYuFtD7wO39nUHa+vdwX4aWACOQ7BmI/nVqyILLDN6HO6Jh+Kvfh3cAp+GJORbFtB48aeK0zhVlmz3drJPPVITWyHvjo5hASCQgszDt0VaNX3OZ8N3ewokScjOfxLbvb3wg6my1fv0HII1q6r+zjh7Uru/+S4kDdmHfxdpzeTUY8OJyoXeFdoBu/ZlcstfKEq7VHnq/t8f9l1d1e5pW7u/+a5ECDaDt/KlyEom3zMVRqTAFjhpVVxsHjLzHy9Ow1TZyS1bRG72IkjW9iiOBlY/ccCBzNLnIitpxk/COai5KOsKpQF6f//dwg+kyo/v0XnDj5B9425I/DSwdpaC3IInIIhuv6q6D15SlHEsjIu/GvKvtBThYKqc9D7xELm/3Imk9XTVR2AnkoLcEzdiM8VIkMFJnnRa+B+FjmMBMhoy86JbyK1KL+jYQtfPvoOMBj1d9RF4J+Pi/xXyK1+OrKQ7cRLOYYdBUPjia0mHN9awOb3TRbXY/tNv4y1fConaHrvqp4G1CxkNmTnRLdNx9t0Pd+r7irNMJynkHn4If/PGIhxMxa37LzfT+4tfIiP1NO2nj8QuJAm55cvAi26hX+rY4yBbhAOJAwnIPPVwEQ6m4pR9fgGd3/gUMgn0NH2bPhK7SoDXOgdv/drISqZmnoXtLM6xpA4yz+j0hkqWW76EjmvPCVff1NANJgZDA2tXxiVY1Un+jVcjK+k27Y97zL7gF2G/mSR4LzyOt+q1wo+lIpdrWUj7x6Zjt2/VcasBaGANpBEyj9wRWTlJ15M8/fLi3BXaOARr28mtaC3CwVSUeh74E1suPCm8sYSG1YA0sAYgKchFuM87QPKY46Eow2YC9dD7lxuLcTAVgWDrZrZ998ts//JlSAOR7QtfiTSwBmIg2LSS/IrnIyuZnjajL7AKn7QqScg9eX+k88nU8PQ+di+bPjSZnt//DOrRMau90MAaiLjYHZB9cXlkJZ0DDsNMBvwizLI3BpuFzLw5hR9LFZ3t7qTnkbvZ9OEj6fj0BdiePDLSrck92odKA2t30pB96v5oS55zbXHGsTDgQnbhM8U4mCqCoLOD/Gsr6Pzv77L5E6ez7ZqP4a96BZngaBdwCKRtqhvd/a0qifWgEyat9MFEk+u9TzxCx6c+jIx1KHhHSd/DjEiy79xuPSEiZrO9BFs24K16nfyqleTfWEl+wYN4z78I6fCO47gGvV4YOn0l74642B0e2SXPkJpxSiQlEwcdjNlvPHbHlsLHMhyXoCvHuoZEcSalqsFLAHXhnDiS4YekQPbRkCqUBtaejIDsovmRBZb7N4fjHHwc3vOPhi/0Qjku5ogiHEepMqFxvweSglzLc9hsb2Q1k8dO09t/KbUbGlh7koD8/HsIOqK7K3T6tHNBt2ZXakAaWHtiXGw75JZFtwupe9BhmEMSEOhtoZXalQbW3jRC5smHIivnjBpN4sRLtVuo1AA0sPZCkpBrXQpRbYrnJklOPV7f2VNqABpYe+NA8NfF5F6JbjFx+qT3F227GaWqiQbW3oiL7YLcS9Et00lMmY4ZRTh5VSn1Fg2sQZB6yNz/h0hrJj90Pla7hUq9gwbWYCQdsndFu91M6qxLILrpX0pVBA2sQRGkEbLPRrf7QerwIxDtFir1DhpYg9UA2ZYXIiuXOHIqZp/Di3JXaKWqhQbWIEkacvMfxWajm96QaJ6GzUdTTqlKoIE1WAnIPf4oQee2yErWfeQT0BVZOaXKngbWYIkLPuSWzI2sZOLwozET0GU6SvXRwBqKBsjMfzKycs6EfXGmnAGaV0oBGlhDIgnIL1tC0BnN7g3SMJLEsSfoukKl+mhgDYUL/ivP4q1dHVnJ9AkzoTuyckqVNQ2soRAX2x1u6heV5HEzw2dJ52MppVskD5U0QOaBm2m87KpI6pmGRhIzTyS/YCGkNLRqkguS1lMV9K45Qxd4EMDEhR1I4+hISvbMeZjs4mcRV1+0NUcMwdZNZP78cw0tNLCGzvrYbsvYmx4jPfPMuFujakDmmVls/fiHkAkaWDqGNVTiQAC55cvibomqEdlFT0Fd3K0oDxpYwyB1kH3oRgh0oZ8qvdyKF5FE3K0oDxpYw5Ew5Oe2EmyL7m46qjb561cT/PVFfXusjwbWsBhIQ/bZx+NuiKpy+TdX4v/1DTB6qoIG1vDVQWbRs3G3QlW5zMN3gAOInqqggTVskoL80mcIOrbE3RRVrbwsvbf+EtEB97doYA2XA/6yJfibN8XdElWlemc/EK4jNU7cTSkbGljDJS7Wh+zCJ+JuiapGNqD7T79F6gEk7taUDQ2sAkgD9M66J+5mqCqUeXoW2XsfgZS+PbgzDaxCOOC/+QrB5ra4W6KqiO3pouvXP8ZMjLsl5UcDqxAG7Ia15F57Oe6WqCqy49Zfk587B5I6drUrDaxC9I9jLYpu22RV3bJL5tH1H18Jb/GmY1fvooufC+V5mPHj2fepzXG3RFU4783X2HL+4VgfcHTsaiB6hVUo18VbvIWgfWPcLVEVLP/6S7Rf9SGCLBpWe6CBVQQyGjILdJmOGp7e2ffSfvFRBGtWIvqu4B5pYBVDHWSXLI67FarCeG++Rsc3P0fH5ReEO2BrWO2VPkJFICnIP/sgtve7SF1D3M1R5crLE/TswFv9V7pv/y3Z2XcRbNyETDTotcPg6KB7UVjI+KSv/CZmxCiw+pCqnYhge3YQrFtJvvUp/JbVMCb8Q6fjVUOjgVU0FtvtQxB3O1RZEsKbSSTQkCqAPnJFI0jDYB/OAGwAlvDj7UP0fWgXoaJY7+3nsf9f2elf0dOsWPSRjJL1sD1AEG6zTN1oJNkAxoXAx+a7IdOB3RGABOHCV6NPUXmykPOxPSBpoC6BpMeBkwy/7GexmS3Q62OzXvh8Jx10Mmhh9GyIQs7DbgdJQv1VXyE5YyaJ/Q/EnXwgMnLsW99md2zDX7+G/No1ZJ+bT+bW/yBo85CxQEpf7GUh8LDdwHZInnES6UuuIXHQQbiTD8TZpwmcvs3X/Tz+xnV461aRX7mSzJ03kJuzKBy70j9Ew6ZjWKUUeNgtkDjlFBo+eTV1H7oISaYH//Nenswzj7Ljpl+Qm/UQMgbQexPGw3rY3vBqqv4z36Th0itx9z94SIfwVr1O9x2/p+cP38Pm+q7MtLs4JBpYpZL1kIY6Gr70Ixov/jRS3zj8Y+WzdD/wZ3b817/gt61B6vVFHqm+rnzqzAsZ9dXv4x58REGHy698mc7v/zPZJx4Ir7Y0tAZNA6sEbJeHe+RRjPnxH0m859iiHddb+1c6vvZ35J95EhmjXcRIBB52DYy8/gYaL/8/RTywpeumX9D1pS8g+6FdxEHSwCoqi+30SZ11LuP+5w4YSvdvCLb+09+SufsWZITRmxOUkudBD4y7ez7JaSeXpERuyTy2nPu+cJxSpzvslb7ai8j2+iTfeyrjrv9zycIKYOyPbqTu438fvpuI/r0pCd9DEjDm5lklCyuA5PEzGXvrg+HFcuCVrE610MAqlpyHc/DRjPnZbZBIlbaWcRj9rZ+SmHkWNqN3ny6+ANsBI/7fzaTfd3bJq6VP/QgjvvU7bEdYW+2eBlYx2LDrMOYH/4szPpp9baVhBGN/+Bskg/5lLjLbFVB/1RdpuPCKyGo2XnoldZ+5pu+qWe2OBlYR2C6o/8fvkDz2xEjrOk0HMuJ7vwznBWnXsDgCD0nBqK/8e+SlR33lunDpjv4B2i0NrEL1XV2N+PTnYynfcNEVmH3Hg69dw8JZbDc0fuUnSOOoyKub0eNo+PIP9Q/QHmhgFch2Q/0X/y9mzIRY6ktdIw1X/St2eyzlq0vgI2NH03D+J2JrQsNFlyONYVvUu2lgFcKG3Yf6cy6NtRl1Z5yDmZjWrkSBbAbSp5+PGT8ptjY4+0wmddrHsdnYmlDWNLAK4YM5YCrJ5uNibYZ7wMG4x58L+VibUfm6oe686Abad6fugk9Dd9ytKE8aWAWweUgc3fz2gte4iCF51NHYXLzNqGiBh2kC98BD4m4JiYMOxeyLXjEPQAOrEFlITntv3K0AIHH0NMjE3YoK5oNz6CmY0aPjbglmzFjMwe8FHcZ6Fw2sQmTBPaiwhbDF4u5/COi4x/D5YPY5ABPDu4O7MiNGYcbvp3NIB6CBVQiP2N4d3JUZORqrY1jDZi3hVIZyWJtpXKSuQW8NMIAyeHYqmAXcmMev+iVS+he5EBYwTtyteJuT0KlYA9DAKoQLtrMj7lYAEHR1hLOk1fAI2N4dcbeij8X27kB096B30cAqRAK8tjfjbgUAwaY2SMbdisolDtitG7GZ+OcT2J5u7PYtenYOQB+SQqTAe7kl7lYA4L32IpRuR5vq54C/9mWCzm1xt4Rg+1aCtlehjHqo5UIDqwCSguxz8+JuBgDZlqVQ4l1tqpox+C+/jr9lS9wtwdu8Cf+1N8HR03NX+ogUwoHgzeV4q16LtRnBlg14rQt1DKsQYsCFzBMPxN0Sso/fDwnQ0/Pd9BEphHEINm8n89yCWJuRfWk53vJWcPXpLITUQ++DtxPv23OW3vtuCe9jqN5FX+EFEaQBun/6hVhbseOG65AG0KezQA74r7aSmTs7tib0Pvkw/qqV4OhbhAPRV3ihXBf/jS56HvpzLOWzzz5BfuFT+g5hMYiLJKDrJ/8ST30bsOO/vokkCd+2VO+igVUEMg52/OzbBB0RD9j6eTp/9I1w7ErvbVccSZf83MX0PHRH5KV77ruN/IKlkNTncnc0sIrBdfFeeZntP/lOpGU7f/tT8gsW6gu8yGQf6PzWJ/FWvx5ZTW/lK3T+21VBMsEAAAgDSURBVBVIeaz0KlsaWEUiowy9N11P5w0/iKRe9323suPfv4aM17GOonNcgh0+W79wCcG29pKXCzo2037thQQ96L0J90IDq2gMMgp2fO8bdN99U0kr9T52L53/ejkyGh3rKBFJu3gvv0D75y7A9pZu9rvt2UH7338Ef+VLSErDam80sIpJXGQ0bL/20+y45RclKdE76246rrggfOdd/xqXlNQ55BfNZcuVHyLYsqHox/c3rmPLZ84m37IYSetzORgaWMUmLjJB6Pyna2m/+nz8tlVFOWzQvpGOb36OrR//GLIvGlaREKTRJf/8XDadOamo7wT33H8bm87aj/wLC5BGfS4HS9qmurqJRYnYXg+pg8Yv/ZT6j16Cs+/kIR8j6NhM72P30/WTrxK0tyP1DuF9zVWkfA/bC8nTz2Xkl75D8j3D2Brby5Nb0ULnz75D7okHkXr0D88QaWCVWuBht4Fz6N+QOuNj1J//cRKHNyOJxMD7LwU+1g/wXn+RnkfuITvnPrznX0DGAo6GVaysh82AWEic/Qnqz/gg6TPOxzSO2M1zY8H3Cbq20zvnPjKzHyE3+w6sCdeh6lSUodPAioofvtjtVjCTIDH9DNwjp2PGT0IaRmB7uwm2bMB/vYX8kgfxV4KMJVyi4eoLu6xYD7LhPSnJgHvSe3CPOgnnwCMxI0eDhaBrG/5fX8JbMR9v4atQR3i/wSQaVAXQwIpD4IEX3nUHn3CnUAEcwkmgCcDoi7oyBOAF4XPp8faNIxzA7Xs+Xb0yLhY9K+JgXEgSLsFQFc6Aa/SiKSL6LqFSqmJoYCmlKoYGllKqYmhgKaUqhgaWUqpiaGAppSqGBpZSqlJYg8WLuxVKKbUnAoi1GQO2R+fgKqXKnYWcAbZpYCmlypmEH50G6BBNLKVUGRMBC1uNiN2seaWUKmcCiNjNxlrZoIGllCpnAlgrG4wI7RpYSqlyFl5h0W4sdpOvO2IppcqYD2DtZkMgzwWWjF5lKaXKkQCBJQPyvAC0NbvbjDAqiLlhSim1KwMElu2TWr0JfUtzrM7FUkqVpTCb7DaBvOn7xBxHE0spVYYcCTMK+hY/+9Yu0rxSSpUjAbB2EfQFluuYpbmAdt26QSlVTgyQC2gXxyzt/38mtniLAuxqo5dZSqkyYsJtGlZNbPHevsICQOy9Oo6llConjkCAva///98KrECC3/pWb/eolCoPAvgBpCX4bf/n3gqs/VtY51u7UK+ylFLlwBHwsQvHtbCu/3PvGGe31t4T6DIdpVQZsDbMpJ0/967rqbZmp9OIjNBZ70qpuISz221XU6s/ctfPv4PAna52C5VSMXLDyaJ37vr5dwVWYOU3uSDcilQppaLWN/eqM7Dym4G+9g6Tl3sLsMGjepWllIqDK4AEj01e7i3Y9WsDX0iJ84O8JaeZpZSKkgA5Sw7rfH+grw8YWE2t+SVg70xoYimlIpQQEOxdYQa92x4jqa3Z6TYi9fqOoVKq1PreGexpavUb9vQ9uyXwc73IUkpFQcJ3Bn++x+/Z20HapjqtrsgUTyeUKqVKxBXwrV0+aZnfvKfv2+vsBSv+Nb4lq1daSqlSEMC3ZAPxr9nb9+41sCa3MM8G9j9TOjFLKVUCKQM2sP85uYV5e/veQV84tTU7z7lGpmvXUClVLK5AENjFE1v9GYP5/kFfN/kZ/wI/oF13c1BKFYMj4Ae0e73+hYP9mUEH1v6vsQ6xVwcBGe0dKqUKYYAgIIPYq/d7nbVD+blBm7TMvzsg+LYR3ehPKTU8Qrj1cUDw7UnL/LuH+rND1jbV+UXayOeyAeiQllJqsIRwkD0T2F80LfOvHc7PD0tbs3Oza+QK32poKaX2TgjHrbzA3tLU6v/tcI8xbOumOre6IpcFGlpKqT3o7wZ61t42eZn/yeEep6Dx88nL/E/6gb0xZXRMSyk1sP5uYBDYGwsJKygwsACaWv0rM5693pEiHEwpVVUMYTcw69nrJ7X6VxbjeAVrWu5/IW+Dfw4gq/O0lFLQf09Bsnkb/POk5f4XinHMosZL2xTnQkR+lTBMyOugllI1KyGQD9iMtf+nabl/z95/YnCKfj20+Ugm5RPOfWlHpuu0B6Vqy1vTFny7OJH3z5vwMuuLffySaJviXCdGvuIIKV1/qFT1C7eIIWsD++Om5f6/lqJGSUec1h3DTAmcXzlGjrYWdOdSpaqPIdx8zw/si4h/TdMy5paqViRD5OubnR9Y+GLSSH1e52wpVRWEcKwqF9gegf+e1Op/PYqakVnf7NyCyCUJIenpFZdSFak/qPKWHNb+eVKrf0VUtSOdOjWp1b/CWnlvzg/uDCydSZ27pVTFMEBSwEJXzg/uslbeG2VYQYwT1NdNcU82Yq+ycLERGWHCATvtLipVRvrX/1kLgbVdVrgb5LdNy7ySjVPtrT2xa2s2X0PkQlfkRKcvuALtMioVC0O47q//XPStXWitvaepNfhh3G0ri8Dq134MkzPWfBYr5xvkgIRhHIBPmPAWvQJTqpik/0PA6ftcPqA9wK6G4L60sb8Z18K6GJv4DmUVWDtbc4x7ghMEx4qV6dZwplgZi5AyQtrh7fCyvB1moIGm1M5kp3/77vv31kdfTyZjIYvYrRIw24pd7Bvzwv4t3qLYGr0HZRtYu7LgbpjqnIm1xyMywVrGichEa+0EgbEWRgkkrEhd3G1VqlyItb0W8gLbLWwVkc3W2g0itFvsJgJ5rmm5/1jc7Rys/w+PTgk8PmA8mwAAAABJRU5ErkJggg0K
// @author skirda
// @grant 	GM_xmlhttpRequest
// @copyright  public domain
// @downloadURL https://update.greasyfork.org/scripts/21053/Aliexpress%20Google%20reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/21053/Aliexpress%20Google%20reminder.meta.js
// ==/UserScript==

var AGR_version="0.20.4.0";

var macroExec="https://script.google.com/macros/s/AKfycbzfEiAgpBzBgrQGlU5siBGunEbLVB9EvWrFzkJ4Zdl85mZRnwo/exec";
/*
p3 = Option ==> list - получить список заказов со страницы "Ответы на форму (1)",
                       p2=пусто,
                       p1=email, по которому фильтровать (если пусто, то вернёт весь список заказов)
                upd  - апдейтить дату истечения заказа
                       p2=новая дата в формате yyyymmddThhmmssZ (например, "20170819T180000Z")
                       p1=линк на заказ, например, "https://trade.aliexpress.com/order_detail.htm?orderId=503085479002212"
                          здесь макрос ведёт поиск только по orderId
                       trnum=трекномер (несколько - через запятую)
                arc  - переместить запись со страницы "Ответы на форму (1)" на страницу "Done" (в архив)
                       p2=дата перемещения в архив ("сейчас") в формате yyyymmddThhmmssZ (например, "20170819T180000Z")
                       p1=линк на заказ, например, "https://trade.aliexpress.com/order_detail.htm?orderId=503085479002212"
                          здесь макрос ведёт поиск только по orderId
                disp - спор. переместить запись со страницы "Ответы на форму (1)" на страницу "Disput" (в диспут)
                       p2=дата перемещения в диспут ("сейчас") в формате yyyymmddThhmmssZ (например, "20170819T180000Z")
                       p1=линк на заказ, например, "https://trade.aliexpress.com/order_detail.htm?orderId=503085479002212"
                          здесь макрос ведёт поиск только по orderId
                item - отправить список товаров из "этого" заказа
                       p2= Date
                       p1= OrderURL
                       В POST JSON-массив итемов
                bwlist - получить список заказов со страницы "Ответы на форму (6)",
                       p2=пусто,
                       p1=email, по которому фильтровать (если пусто, то вернёт весь список заказов)
                storelist - получить количество заказов по магазинам
                       p2=пусто,
                       p1=email, по которому фильтровать (если пусто, то вернёт весь список заказов)

Значения p2 и p3 см. в описании параметра p1
*/


var tableBWList=null;
var defaultEmail=""; //

// првоерить, что строка - это JSON-массив
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

// получить из урла link компоненту с именем name
function __getQueryString(link, name)
{
	if (link.indexOf( name + '=' ) <= 0)
    {
		return -1;
    }
    var pos = link.indexOf( name + '=' ) + name.length + 1;
	var len = link.substr(pos).indexOf('&');
	return (len == -1)?link.substr(pos):link.substr(pos,len);
}

// ведущий ноль...
function zero(a){return (a.length==1?"0":"") + a;}

// форматирование дат.
function formatDate(d) {
	return zero(""+d.getDate()) + "." + zero(""+(d.getMonth()+1)) + "." + d.getFullYear() + " " + zero(""+d.getHours()) + ':' + zero(""+d.getMinutes());
}

// получить элементы класса classname не из корня, а начиная с ноды node
function getElementsByClassName(classname, node)
{
	if(!node)
    {
		node = document.getElementsByTagName("body")[0];
    }
	var a = [];
	var re = new RegExp('\\b' + classname + '\\b');
	var els = node.getElementsByTagName("*");
	for (var i=0,j=els.length; i<j; i++)
    {
		if (re.test(els[i].className)) a.push(els[i]);
    }
	return a;
}

function GetLocalEmail()
{
	var email="";

    if (typeof document.AGR_DefaultEmail === "undefined" || document.AGR_DefaultEmail === "")
    {
        email=__GetLocalStorageItem("AGR_email",'string','');
    }
    else
    {
        email=document.AGR_DefaultEmail;
    }
    console.log("1) email=",email);
    console.log("1) AGR_DefaultEmail=",document.AGR_DefaultEmail);

	if (email === "")
	{
		email=prompt("Мыло давай!\nИли поставь и настрой AGR Helper","");
		if (!email || email === ""){alert("Ну как хочешь. Будут проблемы!"); if (!email) email="";}
		localStorage.setItem("AGR_email",email?email:"");
	}
    if (typeof document.AGR_DefaultEmail === "undefined" || document.AGR_DefaultEmail === "")
    {
        document.AGR_DefaultEmail=email;
    }
    console.log("2) email=",email);
    console.log("2) AGR_DefaultEmail=",document.AGR_DefaultEmail);
	return email;
}

function GetLocalCalendar()
{
	var calendar="";

    if (typeof document.AGR_DefaultCalendar === "undefined" || document.AGR_DefaultCalendar === "")
    {
        calendar=__GetLocalStorageItem("AGR_calendar",'string','');
    }
    else
    {
        calendar=document.AGR_DefaultCalendar;
    }
    console.log("1) calendar=",calendar);
    console.log("1) AGR_DefaultCalendar=",document.AGR_DefaultCalendar);

	if (calendar === "" && __GetLocalStorageItem("AGR_calendar_set",'int',0) === 0)
	{
		calendar=prompt("Календарь давай!\nИли поставь и настрой AGR Helper","");
		if (!calendar || calendar === ""){alert("Ну как хочешь. Будем юзать дефолтовый календарь!"); if (!calendar) calendar="";}
		localStorage.setItem("AGR_calendar",calendar?calendar:"");
        localStorage.setItem("AGR_calendar_set",1);
	}
    if (typeof document.AGR_DefaultCalendar === "undefined" || document.AGR_DefaultCalendar === "")
    {
        document.AGR_DefaultCalendar=calendar;
    }
    console.log("2) calendar=",calendar);
    console.log("2) AGR_DefaultCalendar=",document.AGR_DefaultCalendar);
	return calendar;
}


// cross-browser GM_xmlhttpRequest
function crossXmlHttpRequest(details) {
	if (typeof GM_xmlhttpRequest === 'function') // Greasemonkey, Tampermonkey, Firefox extension, Chrome script
	{
        console.log('crossXmlHttpRequest','1');
        GM_xmlhttpRequest(details);
    }
	else if (typeof window.opera !== 'undefined' && window.opera && typeof opera.extension !== 'undefined' && typeof opera.extension.postMessage !== 'undefined') // Opera 12 extension
	{
        console.log('crossXmlHttpRequest','2');
		var index=operaTable.length;
		opera.extension.postMessage({'action':'xhr-'+index, 'url':details.url, 'method':details.method});
		operaTable[index]=details;
	}
	else if (typeof window.opera === 'undefined' && typeof XMLHttpRequest === 'function') // Opera 15+ extension
	{
        console.log('crossXmlHttpRequest','3');
		var xhr=new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (details['onload']) {
					details['onload'](xhr);
				}
			}
		};
		xhr.open(details.method, details.url, details.asinc);
        //xhr.setRequestHeader('','');
		xhr.send();
	}
}

// загрузить данные из гуглотаблицы заказов
function Get_OrderListFromGoogle()
{
    var tableURL=macroExec+"?p1="+ GetLocalEmail() +"&p2=&p3=list";
    console.log("Get_OrderListFromGoogle: responseText", tableURL);
	crossXmlHttpRequest({
		method:'GET',
		url:tableURL,
        ignoreCache: true,
        synchronous:true,
		onload:function(response) {
            console.log(response);
			if (response.readyState === 4 && response.status === 200 && response.responseText)
			{
				console.log("Get_OrderListFromGoogle: responseText",response.responseText);
                var gtable=JSON.parse(response.responseText);
                console.log(gtable);
                if (gtable.result === "ok")
                {
                    document.tableOrderList=gtable.data;
                }
			}
		}
	});
}

function dateToUTCString(d,ot)
{
    console.log("1",d);
	var endTime='';
	if (!ot)
	{
        d.setDate(d.getDate()-1);
		endTime='T180000Z';
    }
	else
    {
		endTime='T' + zero(""+d.getUTCHours()) + zero(""+d.getUTCMinutes()) + zero(""+d.getUTCSeconds()) + 'Z';
    }
    console.log("2",d.getUTCFullYear() + zero(""+(d.getUTCMonth() + 1)) + zero(""+d.getUTCDate()) + endTime);
	return d.getUTCFullYear() + zero(""+(d.getUTCMonth() + 1)) + zero(""+d.getUTCDate()) + endTime;
}

function addAGRLink()
{
	console.log("AGR: addAGRLink()");

	var AGR_calendar=GetLocalCalendar(); /* Это адрес конкретного календаря */
	// localStorage.setItem('AGR_calendar', 'ИД_НУЖНОГО_КАЛЕНДАРЯ@group.calendar.google.com');
	if(!AGR_calendar)
		AGR_calendar=""; // используем дефолтовый календарь

	var AGR_originaltime=false; // если нужно точное время, а не смещение
	// localStorage.setItem('AGR_originaltime', '1');
	var AGR_originaltime0=localStorage.getItem("AGR_originaltime");
	if(AGR_originaltime0)
    {
		AGR_originaltime=AGR_originaltime0=="1"?true:false;
    }

	// получить все ордера на этой странице
	var viewdetaillink=document.getElementsByClassName('view-detail-link');
	console.log("AGR: viewdetaillink.length="+viewdetaillink.length);
	for(let i=0; i< viewdetaillink.length; ++i)
	{
        console.log('viewdetaillink['+i+']',viewdetaillink[i]);
        var parentElement=viewdetaillink[i].parentElement.parentElement.parentElement.parentElement;

        var order_status=getElementsByClassName('order-status', parentElement);
        var orderDone=(order_status[0].getElementsByTagName("span"))[0].innerText == "Завершено";

        // ищем нежданчик в виде спора
        var productAction=getElementsByClassName('product-action', parentElement);
        var orderDispute=false;
        for(let ii=0; ii < productAction.length; ++ii)
        {
            let paa=productAction[ii].getElementsByTagName("a");
            if(paa.length > 0)
            {
                if(paa[0].href.indexOf("orderDispute") > 0)
                {
                    orderDispute=true;
                    break;
                }
            }
        }

        // по наличию кнопки "Подтвердить получение" отсеиваем уже полученное
        var buttonInfo=getElementsByClassName('order-action', parentElement);
        console.log('buttonInfo',buttonInfo);
        var arrb=buttonInfo[0].getElementsByTagName("button");
        console.log('buttonInfo[0]',arrb);
        var foundActiveOrder=false;
        for(let j=0; j < arrb.length; ++j)
        {
            //console.log("arrb[j]",arrb[j]);
            //if(arrb[j].getAttribute('data-order-status') === "WAIT_BUYER_ACCEPT_GOODS")
            if(arrb[j].getAttribute('button_action') === "logisticsTracking")
            {
                foundActiveOrder=true;
                break;
            }
        }
        if (!foundActiveOrder)
        {
            continue;
        }

        // берём инфу по магазину
        var storeInfo=getElementsByClassName('store-info', parentElement);
        //console.log("storeInfo=",storeInfo);
        var arrlsi=storeInfo[0].getElementsByTagName("a"); // ожидается "https://www.aliexpress.com/store/1185416"
        // TODO: Нет больше инфы про store, надо из заказа доставать :-(
        //console.log("arrlsi=",arrlsi);
        var storeId="";
        if (arrlsi[0].href.indexOf("/store/") > -1) // чтобы не получилось "order_detail.htm?orderId=702124254902212" вместо ID-магазина
        {
            storeId=(arrlsi[0].href.split("/").slice(-1)[0]);
        }
        console.log("storeId=",storeId);

        var ohref=viewdetaillink[i].href; //"http://trade.aliexpress.com/order_detail.htm?orderId=75745635252212"
		var oid1=""+(ohref.split("=")[1]); // Alliexpress_75745635252212
        var oid='Alliexpress_'+oid1; // Alliexpress_75745635252212

		if(!document.getElementById(oid))
		{
			console.log("AGR: not found ID='"+oid+"', create");

			var ar=document.createElement("a");
			ar.o=viewdetaillink[i];
            ar.setAttribute('id', oid);
            ar.setAttribute('storeId', storeId);
			ar.style.cursor="pointer";
			ar.setAttribute('calendar',AGR_calendar);

			var dr = new Date();
            var ed=getElementsByClassName('left-sendgoods-day',parentElement);
            if (ed && ed.length > 0)
            {
                //console.log("ed = ",ed);
                dr.setMilliseconds(parseInt(ed[0].getAttribute('lefttime'))-(1000*60*60*6)); // минус 6 часов, чтобы точно на один день назад было
                //console.log("dr=",dr);
                //ar.text=" ("+formatDate(dr)+")";
            }
            var foundData=false;
            for(let j in document.tableOrderList)
            {
                //console.log("orderLink",document.tableOrderList[j].orderLink.substr(document.tableOrderList[j].orderLink.indexOf("orderId=")),"===","ohref",ohref.substr(ohref.indexOf("orderId=")));
                if (__getQueryString(document.tableOrderList[j].orderLink,"orderId") === __getQueryString(ohref,"orderId"))
                {
                    foundData=true;
                    break;
                }
            }
			//if(__GetLocalStorageItem(oid,'bool',false))
            var actionType="";
            if (foundData)
            {
				ar.innerHTML="<br><em>(уже в календаре)</em>";
                ar.title="Жмакни сюда для обновления даты завершения заказа";
                actionType="upd";
            }
            else
            {
                if(!(orderDispute || orderDone))
                {
                    ar.innerHTML="<br><b style='color:#FF0000'>(в календарь нах)</b>";
                    ar.title="Добавить этот заказ в таблицу/календарь";
                    actionType="new";
                }
            }


			//ar.setAttribute('adate', dateToUTCString(dr,AGR_originaltime));
            ar.setAttribute('adate', dr);
            ar.setAttribute('actionType', actionType);
			//document.getElementsByClassName("order-status")

			//viewdetaillink[i].appendChild(ar);
			viewdetaillink[i].parentElement.parentElement.parentElement.nextElementSibling.cells[2].appendChild(ar);

			document.getElementById(oid).onclick=AGR_calendarprocess;

		}
		else
        {
			console.log("AGR: found ID='"+oid+"'");
        }
	}
}



function getLogisticsDetails(u,doc)
{
	console.log("getLogisticsDetails");
    var ares=[];

    var flush_btn=document.getElementsByClassName('flush-btn');
    if (flush_btn && flush_btn.length > 0)
    {
        for(var i=0; i < flush_btn.length; ++i)
        {
            var res={orderid:"",logisticsno:"",logisticstype:""};
            res.orderid=flush_btn[i].getAttribute('orderid');
            res.logisticsno=flush_btn[i].getAttribute('logisticsNo');
            res.logisticstype=flush_btn[i].getAttribute('logisticstype');
            ares.push(res);
        }
    }
    else
    {
        ares.push({orderid:"",logisticsno:"",logisticstype:""});
    }

	console.log("getLogisticsDetails: res: ",ares);
    return ares;
}

function EnumLogisticsNo(logisticsData,delimiter)
{
	var res="";
	if (logisticsData && logisticsData.length > 0)
	{
		for(var i=0; i < logisticsData.length; ++i)
		{
			if (res.length > 0) res+=delimiter;
			res += "" + logisticsData[i].logisticsno;
		}
	}
	return res;
}

function AGR_calendarprocess()
{
	console.log("AGR_calendarprocess");
	var oid=this.id;
	// get title
	var otitle=this.o.parentElement.parentElement.parentElement.parentElement.getElementsByClassName('baobei-name')[0].title;
	// get link to order
	var ohref=this.o.parentElement.parentElement.getElementsByClassName('view-detail-link')[0].href;
	var utcDate=this.getAttribute('adate');
    console.log("utcDate",utcDate);
    utcDate=dateToUTCString(new Date(utcDate));
    console.log("utcDate 2",utcDate);
	var AGR_calendar=this.getAttribute('calendar');
    var storeId=this.getAttribute('storeId');
    //console.log("storeId=",storeId);

	var logisticsData=null;

    // <Get Order Detail>
    {
		var page_request = new XMLHttpRequest();
		console.log("AGR: ohref='"+ohref+"'");
		page_request.open('GET', ohref, false);
		page_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		page_request.send(null);
		if (page_request.readyState == 4 && page_request.status == 200)
		{
			var div = document.createElement('div');
			div.setAttribute('id', "Alliexpress_div_temp");
			div.setAttribute('style', 'display:none;');
			div.innerHTML = page_request.responseText;
			//var dd=document.getElementsByClassName('site-footer');
			//console.dir(dd)
			//dd.appendChild(div);
			document.body.appendChild(div);

			logisticsData=getLogisticsDetails(ohref,document.getElementById('TP_ShippingTable'));
            console.log("** logisticsData **");
            console.log(logisticsData);

            // значение ИД-магазина отсюда получаем
            if (storeId === "")
            {
                var storeInfo=document.getElementsByClassName('user-info');
                if(storeInfo)
                {
                    var shref=storeInfo[0].getElementsByTagName('a')[0].href;
                    if(shref)
                    {
                        let arshref=shref.split("?")[0].split("/");
                        storeId=arshref[arshref.length-1];
                    }
                }
            }
            console.log("storeId=",storeId);
			//var AGR_originaltime0=localStorage.getItem("AGR_originaltime");
			//if(AGR_originaltime0)AGR_originaltime=AGR_originaltime0=="1"?true:false;
			//utcDate=dateToUTCString(new Date(document.getElementsByClassName('order-reminder')[0].getElementsByTagName('strong')[1].innerHTML.trim()+" 00:00:00"),AGR_originaltime);

			document.body.removeChild(document.getElementById("Alliexpress_div_temp"));

			div=null;
		}
	}
    // </Get Order Detail>

    Send_OrderList(this,this.id,"" + (otitle.trim().replace(/%/g,"%25").replace(/ /g,"%20").replace(/#/g,"%23").replace(/\?/g,"%3F").replace(/\&/g,"%26").replace(/\+/g,"%2B")),utcDate,escape(ohref),logisticsData,storeId);

	//localStorage.setItem(this.id, 1);
    {
        var i=null;
        for(i in document.tableOrderList)
            ;
        i=parseInt(i)+1;
        var email= GetLocalEmail();
        document.tableOrderList[i] = {storeId:storeId,trackNumber:EnumLogisticsNo(logisticsData,","),reporter:email,checkDate:utcDate,name:otitle.trim(),remark:"",orderLink:ohref};
    }

    this.innerHTML=(
        (this.getAttribute('actionType') === "upd")?
                    "<br><em style='color:#008800'>(попытка обновления даты)</em>":
                    "<br><em style='color:#008800'>(попытка добавления в таблицу)</em>");
    //this.remove();

}

// отправить/обновить заказ
function Send_OrderList(o,Id,Name,CheckDate,OrderURL,logisticsData,StoreID)
{
    var email= GetLocalEmail();
    var Comment="";
    /*
    entry.1432344676=vskirdin@gmail.com
    entry.1853490256=Aliexpress:+Name
    entry.129702673=2017-10-20
    entry.2030523523=https://trade.aliexpress.com/order_detail.htm?orderId%3D503101525972212
    entry.259194710=RH050582241TR
    entry.789276336=Comment
    entry.1644333095=StoreID
    */
    var url="https://docs.google.com/forms/d/e/1FAIpQLSdagtLRvhnDxBZi9drgb1YhDGZVYsN4VDuUUPylfcHvtldf7g/viewform?"+"entry.1432344676="+email+"&entry.1853490256="+Name+"&entry.129702673="+CheckDate+"&entry.2030523523="+OrderURL+"&entry.259194710="+EnumLogisticsNo(logisticsData,",")+"&entry.789276336="+Comment+"&entry.1644333095="+StoreID;
    var actionType=document.getElementById(Id).getAttribute('actionType');
    console.log("actionType",actionType);

    if (actionType !== 'upd')
    {
        console.log('url ==> ',url);
        window.open(url, '_blank'); // через форму
    }
    else
    {
        url=macroExec+"?p1="+OrderURL+"&p2="+CheckDate+"&p3=upd&trnum="+EnumLogisticsNo(logisticsData,",");
        console.log('url ==> ',url);
        // обновляем молча
        crossXmlHttpRequest({
            method:'GET',
            url:url,
            ignoreCache:true,
            synchronous:true,
            onload:function(response) {
                if (response.readyState === 4 && response.status === 200 && response.responseText)
                {
                    console.log(response);
                    console.log("responseText",response.responseText);
                    if (IsJsonString(response.responseText))
                    {
                        var res=JSON.parse(response.responseText);
                        console.log(res);
                        if(res.result === "ok")
                        {
                            o.innerHTML="<br><em style='color:#008800'>(дата обновлена)</em>";
                        }
                    }
                    else
                    {
                        o.innerHTML="<br><em style='color:#880000'>(ошибка обновления)</em>";
                    }
                }
            }
        });
    }
}


/* *************************************** */
// загрузить данные из гуглотаблицы BW
function Get_BWListFromGoogle()
{
    //console.log("Get_OrderListFromGoogle: responseText", tableURL);
    console.log("start Get_BWListFromGoogle()");
    var tableURL=macroExec+"?p1="+ GetLocalEmail()+"&p2=&p3=bwlist";
	crossXmlHttpRequest({
		method:'GET',
		url:tableURL,
        ignoreCache: true,
        synchronous:true,
		onload:function(response) {
			if (response.readyState === 4 && response.status === 200 && response.responseText)
			{
				console.log("Get_OrderListFromGoogle: responseText",response.responseText);
                var gtable=JSON.parse(response.responseText);
                console.log(gtable);
                if (gtable.result === "ok")
                {
                    document.tableBWList=gtable.data;
                }
			}
		}
	});
}

// загрузить данные из гуглотаблицы BW
function Get_CountItemFromStore()
{
    //console.log("Get_CountItemFromStore: responseText", tableURL);
    console.log("start Get_CountItemFromStore()");
    //tableURL=macroExec+"?p1="+ GetLocalEmail()+"&p2=&p3=storelist";
    var tableURL=macroExec+"?p1=&p2=&p3=storelist";
	crossXmlHttpRequest({
		method:'GET',
		url:tableURL,
        ignoreCache: true,
        synchronous:true,
		onload:function(response) {
			if (response.readyState === 4 && response.status === 200 && response.responseText)
			{
				console.log("Get_CountItemFromStore: responseText",response.responseText);
                var gtable=JSON.parse(response.responseText);
                console.log(gtable);
                if (gtable.result === "ok")
                {
                    document.tableItemsByStore=gtable.data;
                }
			}
		}
	});
}

function DrawStoreTitle(storeId,idst)
{
    function GetStoreForId(storeId)
    {
        var a=[];
        for (let i in document.tableBWList)
        {
            //console.log("i",i,"document.tableBWList[i].storeId",document.tableBWList[i].storeId,"storeId",storeId,"eq?",document.tableBWList[i].storeId === storeId,document.tableBWList[i].storeId ==storeId);
            if(document.tableBWList[i].storeId == parseInt(storeId))
            {
                a.push(document.tableBWList[i]);
            }
        }
        return a;
    };

    function GetCountItemForStoreId(storeId)
    {
        var a=[];
        for (let i in document.tableItemsByStore)
        {
            //console.log("i",i,"document.tableBWList[i].storeId",document.tableBWList[i].storeId,"storeId",storeId,"eq?",document.tableBWList[i].storeId === storeId,document.tableBWList[i].storeId ==storeId);
            if(i == storeId)
            {
                a.push(document.tableItemsByStore[i]);
            }
        }
        return a;
    };

    var arrStore=GetStoreForId(storeId);
    var arrStoreIC=GetCountItemForStoreId(storeId);
    console.log("--- DrawStoreTitle --- ",document.tableBWList,storeId,arrStore,arrStoreIC);

    function __draw(color,remark,achtung,idst,cnt)
	{
        if(window.location.pathname.indexOf("/shopcart/") >= 0 || window.location.pathname.indexOf("/wishlist/") >= 0)
        {
            // <a class="seller-name" href="//www.aliexpress.com/store/2130127">Worldchips</a>
            var shopcart=window.location.pathname.indexOf("/shopcart/") >= 0?true:false;
            document.getElementsByClassName(shopcart?"seller-name":"me-icons store")[idst].innerHTML=
                (remark?
                   "<span title='"+remark+"'><font color='"+color+"'>"+achtung+"[["+document.storeName+"]]</font>&nbsp;{"+cnt.current+" / "+cnt.done+"}</span>":
                   document.storeName+"&nbsp;{"+cnt.current+" / "+cnt.done+"}</span>");
        }
        else
        {
            let classStoreName='store-name';
            let idxStoreName=0;
            let shopName0=document.getElementsByClassName(classStoreName);
            if(shopName0.length == 0)
            {
                classStoreName='shop-name';
                idxStoreName=1;
                shopName0=document.getElementsByClassName(classStoreName);
            }

            if(shopName0.length > 0)
            {
                console.log("remark=",remark);
                document.getElementsByClassName(classStoreName)[0].childNodes[idxStoreName].innerHTML=
                    (remark?
                     "<span title='"+remark+"'><font color='"+color+"'>"+achtung+"[["+document.storeName+"]]</font>&nbsp;{"+cnt.current+" / "+cnt.done+"}</span>":
                     document.storeName+"&nbsp;{"+cnt.current+" / "+cnt.done+"}</span>");
            }
            else
            {
                let pageURL=document.location.origin+"/store/"+pageConfig.storeId;
                let allA=document.getElementsByTagName("a");
                for(let ia=0; ia < allA.length; ++ia)
                {
                    let dhref=allA[ia].getAttribute('data-href');
                    if(dhref === pageURL && allA[ia].firstChild.nodeName === "SPAN")
                    {
                        allA[ia].firstChild.innerHTML=
                    (remark?
                     "<span title='"+remark+"'><font color='"+color+"'>"+achtung+"[["+document.storeName+"]]</font>&nbsp;{"+cnt.current+" / "+cnt.done+"}</span>":
                     document.storeName+"&nbsp;{"+cnt.current+" / "+cnt.done+"}</span>");
                        break;
                    }
                }
            }
        }
	}

    if (arrStore.length > 0)
    {
        if (arrStore.length === 1)
        {
            if (arrStore[0].typelist === "Black")
            {
                __draw("#ff3300",arrStore[0].remark+ " (" + arrStore[0].reporter+ ")\n","[Achtung!] ",idst,(arrStoreIC.length > 0?arrStoreIC[0]:{current:0,done:0}));
            }
            else if (arrStore[0].typelist === "White")
            {
                __draw("#00b300",arrStore[0].remark+ " (" + arrStore[0].reporter+ ")\n","",idst,(arrStoreIC.length > 0?arrStoreIC[0]:{current:0,done:0}));
            }
        }
        else
        {
            let b=0,w=0;
            var comment="Found items = " + arrStore.length + "\n";
            for(let i=0; i < arrStore.length; ++i)
            {
                if (arrStore[i].typelist === "Black") b++; else w++;
                comment += "[" + (i+1) + "] "+arrStore[i].typelist + ": {" + arrStore[i].remark + "} (" + arrStore[i].reporter+ ")\n";
            }
            __draw((b > 0 && w > 0)?"#3333ff":(!w?"#ff3300":"#00b300"),comment,(b > 0 && w > 0)?"[Conflict!] ":(!w?"[Achtung!] ":""),idst,(arrStoreIC.length > 0?arrStoreIC[0]:{current:0,done:0}));
        }
    }
    else
    {
        __draw("#000000",null,null,idst,(arrStoreIC.length > 0?arrStoreIC[0]:{current:0,done:0}));
    }
}

function Send_BWList(typelist)
{
    typelist=this.id === "ARG_BtnBlack"?"Black":"White";
    var email= GetLocalEmail();
    var i=null;
    for(i in document.tableBWList)
        ;
    i=parseInt(i)+1;
    document.tableBWList[i] = {storeId:document.storeId,reporter:email,typelist:typelist,name:document.storeName,remark:""};
    // need refresh & remark
    DrawStoreTitle(document.storeId);
    // https://docs.google.com/forms/d/e/1FAIpQLSfWuZ_0T-G1xhT1CFFRonWDPh9we1dAOtXUeiKJIAOP1AAKtA/viewform?usp=pp_url&entry.1022733612=e-mail&entry.592807727=Black&entry.1754242016=id&entry.266264175=name&entry.1037589638=comment
    //window.open("https://docs.google.com/forms/d/e/1FAIpQLSdvNj2wM2COdyEJQuGvv9UsMM_RTF101tOgo7eD0r4eu2eU1Q/viewform?"+"entry.85261706="+email+"&entry.1236449838=" + typelist + "&entry.657473242="+document.storeId+"&entry.1687495004="+document.storeName, '_blank');
    window.open("https://docs.google.com/forms/d/e/1FAIpQLSfWuZ_0T-G1xhT1CFFRonWDPh9we1dAOtXUeiKJIAOP1AAKtA/viewform?entry.1022733612="+email+"&entry.592807727=" + typelist + "&entry.1754242016="+document.storeId+"&entry.266264175="+document.storeName+"&entry.1037589638=", '_blank');
}

function CreateBWButton()
{
    var nod=document.createElement("span");
    nod.setAttribute('id', 'AGR_' + AGR_version);
    nod.setAttribute('unselectable', 'on');
    nod.setAttribute('class','store-header-container');
    nod.innerHTML="<a id='ARG_BtnWhite' class='AGR_btnLike' title='Send to White'><div class='AGR_icon'></div></a>&nbsp;<a id='ARG_BtnBlack' class='AGR_btnUnLike' title='Send to Black'><div class='AGR_icon'></div></a>";

    let classStoreName='follow-container';
    let butn=document.getElementsByClassName(classStoreName); // store-follow-btn
    if(butn.length == 0)
    {
        classStoreName='store-follow-btn';
        butn=document.getElementsByClassName(classStoreName);
    }
    console.log("butn.length=",butn.length);
    if (butn.length > 0)
    {
        document.getElementsByClassName(classStoreName)[0].parentElement.appendChild(nod);
    }
    else
    {
                let pageURL=document.location.origin+"/store/"+pageConfig.storeId;
                let allA=document.getElementsByTagName("a");
                for(let ia=0; ia < allA.length; ++ia)
                {
                    let dhref=allA[ia].getAttribute('data-href');
                    //console.log("!!!!!!",ia,dhref);
                    if(dhref === pageURL && allA[ia].firstChild.nodeName === "SPAN")
                    {
                        allA[ia].parentElement.parentElement.parentElement.appendChild(nod);
                        break;
                    }
                }
    }

    document.getElementById('ARG_BtnBlack').onclick=Send_BWList;
    document.getElementById('ARG_BtnWhite').onclick=Send_BWList;
}
/* *************************************** */


/* *************************************** */
function collectProduct(storeId,n,isOld)
{
    var i;
    // https://ru.aliexpress.com/item//1525063698.html
    var res=[];
    var prod=document.getElementsByClassName('baobei-name');
    var email= GetLocalEmail();
    for(i=(isOld?0:prod.length/2); i < prod.length; ++i)
    {
        var parentElement=prod[i].parentElement.parentElement.parentElement;
        if (parentElement.id !== "")
        {
            var op={
                name:prod[i].text,
                link:{screen:prod[i].href,prod:"https://ru.aliexpress.com/item//"+__getQueryString(prod[i].href,"productId")+".html"},
                price:{usd:parentElement.getElementsByClassName("price")[0].getAttribute("title"),rub:parentElement.getElementsByClassName("price")[0].innerText.split(" ")[0]},
                count:parseInt(parentElement.getElementsByClassName("quantity")[0].getAttribute("title")),
                storeid:storeId,
                owner:email
            };
            res.push(op);
        }
    }

    return res;
}

function SendProduct(isOld,buttonElement)
{
    // сбор коллекции покупок
        // собираем продукты по этому заказу
    var prod=collectProduct(
        (document.getElementsByClassName('user-name-text')[0].getElementsByTagName("a").length > 0?
            document.getElementsByClassName('user-name-text')[0].getElementsByTagName("a")[0].href.split("/").slice(-1)[0]:
            ""),
        null,isOld);
    console.log(JSON.stringify(prod));

    var OrderURL=escape(window.location.href);
    var url=macroExec+"?p1="+OrderURL+"&p2="+(dateToUTCString(new Date(),true))+"&p3=item";

    crossXmlHttpRequest({
        method:'POST',
        url:url,
        data: JSON.stringify(prod),
        //headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        headers: {'Content-Type': 'application/json'},
        ignoreCache:true,
        synchronous:true,
        onload:function(response) {
            console.log("response=",response);
            if (response.readyState === 4 && response.status === 200 && response.responseText)
            {
                console.log("response.responseText=",response.responseText);
                if (IsJsonString(response.responseText))
                {
                    var res=JSON.parse(response.responseText);
                    console.log("res=",res);
                    if (buttonElement)
                    {
                        if(res.result === "ok")
                        {
                            //buttonElement.innerText='Отправлено в список Items';
                            buttonElement.title += "\n"+res.msg +"\n" + JSON.stringify(res.itemIdx);
                            buttonElement.setAttribute('style', '-moz-user-select: text; color:blue');
                            buttonElement.disabled=true;
                        }
                        else
                        {
                            //buttonElement.innerText='Ошибка отправки списка в Items';
                            buttonElement.title += "\nОшибка отправки списка в Items:\n"+"SendProduct (1)\n" + res.msg +"\nCalendar eventId=" + JSON.stringify(res.eventId);
                            buttonElement.setAttribute('style', '-moz-user-select: text; color:red');
                        }
                    }
                }
                else
                {
                    if (buttonElement)
                    {
                        //buttonElement.innerText='Ошибка отправки списка';
                        buttonElement.title += "\n"+"SendProduct (2)\n";// + res.msg +"\n" + JSON.stringify(res.eventId);
                        buttonElement.setAttribute('style', '-moz-user-select: text; color:red');
                    }
                }
            }
        }
    });
}

function Send_ArcList()
{
    console.log("Send_ArcList()");
    var buttonElement=document.getElementById("AGR_ArcButton");

    buttonElement.innerText='Попытка отправки в архив';
    buttonElement.setAttribute('style', '-moz-user-select: text; color:#bbbb00');
    let actionType=buttonElement.getAttribute('actionType');

    var OrderURL=escape(window.location.href); //escape
    var url=macroExec+"?p1="+(OrderURL)+"&p2="+(dateToUTCString(new Date(),true))+"&p3=arc";
    //disp
    console.log("url",url);
    crossXmlHttpRequest({
        method:'GET',
        url:url,
        ignoreCache:true,
        synchronous:true,
        onload:function(response) {
            if (response.readyState === 4 && response.status === 200 && response.responseText)
            {
                console.log(response);
                console.log("responseText",response.responseText);
                if (IsJsonString(response.responseText))
                {
                    var res=JSON.parse(response.responseText);
                    console.log(res);
                    if(res.result === "ok")
                    {
                        buttonElement.innerText='Отправлено в архив';
                        buttonElement.setAttribute('style', '-moz-user-select: text; color:blue');
                        buttonElement.title="";
                        buttonElement.disabled=true;
                        SendProduct(actionType == 2?true:false,buttonElement);
                    }
                    else
                    {
                        buttonElement.innerText='Ошибка отправки в архив';
                        buttonElement.title="Send_ArcList (1)\n"+res.msg +"\nCalendar eventId=" + JSON.stringify(res.eventId);
                        buttonElement.setAttribute('style', '-moz-user-select: text; color:red');
                        if(actionType == 2)
                        {
                            SendProduct(true,buttonElement);
                        }
                    }
                }
                else
                {
                    buttonElement.innerText='Ошибка отправки в архив';
                    buttonElement.title="Send_ArcList (2)\n";//+res.msg +"\n" + JSON.stringify(res.eventId);
                    buttonElement.setAttribute('style', '-moz-user-select: text; color:red');
                }
            }
        }
    });

}

function Send_DisputList()
{
    console.log("Send_DisputList()");
    var buttonElement=document.getElementById("AGR_DispButton");

    buttonElement.innerText='Попытка отправки в disput';
    buttonElement.setAttribute('style', '-moz-user-select: text; color:#bb00bb');
    let actionType=buttonElement.getAttribute('actionType');

    var OrderURL=escape(window.location.href); //escape
    var url=macroExec+"?p1="+(OrderURL)+"&p2="+(dateToUTCString(new Date(),true))+"&p3=disp";
    //disp
    console.log("url",url);
    crossXmlHttpRequest({
        method:'GET',
        url:url,
        ignoreCache:true,
        synchronous:true,
        onload:function(response) {
            if (response.readyState === 4 && response.status === 200 && response.responseText)
            {
                console.log(response);
                console.log("responseText",response.responseText);
                if (IsJsonString(response.responseText))
                {
                    var res=JSON.parse(response.responseText);
                    console.log(res);
                    if(res.result === "ok")
                    {
                        buttonElement.innerText='Отправлено в disput';
                        buttonElement.setAttribute('style', '-moz-user-select: text; color:blue');
                        buttonElement.disabled=true;
                        SendProduct(actionType == 2?true:false,buttonElement);
                    }
                    else
                    {
                        buttonElement.innerText='Ошибка отправки в disput';
                        buttonElement.title="Send_DisputList (1)\n"+res.msg +"\n" + JSON.stringify(res.eventId);
                        buttonElement.setAttribute('style', '-moz-user-select: text; color:red');
                        if(actionType == 2)
                        {
                            SendProduct(true,buttonElement);
                        }
                    }
                }
                else
                {
                    buttonElement.innerText='Ошибка отправки в disput';
                    buttonElement.title="Send_DisputList (2)\n";//+res.msg +"\n" + JSON.stringify(res.eventId);
                    buttonElement.setAttribute('style', '-moz-user-select: text; color:red');
                }
            }
        }
    });

}

// кнопка "в архив" на странице конкретного заказа
function CreateArcButton()
{
    console.log("CreateArcButton()");
    let foundType=0; // 0 = not found, 1 = confirm, 2 = reAddToCar
    var confirmOrderReceived=document.getElementById('button-confirmOrderReceived');
    if (!confirmOrderReceived)
    {
        confirmOrderReceived=document.getElementById('button-reAddToCart');
        if (confirmOrderReceived)
        {
            foundType=2;
        }
    }
    else
    {
        foundType=1;
    }

    if (foundType > 0)
    {
        console.log(__getQueryString(window.location.href,"orderId"));
        let buttonElement=document.createElement("button");
        buttonElement.setAttribute('id', 'AGR_ArcButton');
        buttonElement.setAttribute('style', '-moz-user-select: text; color:green');
        buttonElement.setAttribute('title',"Относится к Гуглотаблице и Календарю");
        buttonElement.setAttribute('class',"ui-button ui-button-normal");
        buttonElement.setAttribute('orderid',__getQueryString(window.location.href,"orderId"));
        buttonElement.setAttribute('actionType',foundType);
        buttonElement.innerText='Отправить в архив';
        confirmOrderReceived.parentElement.appendChild(buttonElement);
        document.getElementById('AGR_ArcButton').onclick=Send_ArcList;

        let buttonElementD=document.createElement("button");
        buttonElementD.setAttribute('id', 'AGR_DispButton');
        buttonElementD.setAttribute('style', '-moz-user-select: text; color:red');
        buttonElementD.setAttribute('title',"Относится к Гуглотаблице и Календарю");
        buttonElementD.setAttribute('class',"ui-button ui-button-normal");
        buttonElementD.setAttribute('orderid',__getQueryString(window.location.href,"orderId"));
        buttonElement.setAttribute('actionType',foundType);
        buttonElementD.innerText='Отправить в disput';
        confirmOrderReceived.parentElement.appendChild(buttonElementD);
        document.getElementById('AGR_DispButton').onclick=Send_DisputList;
    }
    console.log("foundType = ",foundType);
}
/* *************************************** */

function a2g_FakeLoad()
{
    var storeId=0;
    if(window.location.pathname.indexOf("/item/") >= 0 || window.location.pathname.indexOf("/store/") >= 0)
    {
        if(window.location.pathname.indexOf("/item/") >= 0)
        {
            //var v=document.getElementById("hid_storeId");
            // window.runParams.data.storeModule.storeNum
            if ((typeof window.runParams === "undefined" && typeof runParams === "undefined") || document.tableBWList === null || typeof document.tableBWList === "undefined" || typeof document.tableItemsByStore === "undefined")
            {
                //console.log("typeof window.runParams",(typeof window.runParams));
                setTimeout(a2g_FakeLoad, 2500);
                return;
            }
            //storeId=document.getElementById("hid_storeId");
            if(typeof window.runParams === "undefined")
            {
                storeId=runParams.data.storeModule.storeNum;
            }
            else
            {
                storeId=window.runParams.data.storeModule.storeNum;
            }

            if (storeId == null || typeof storeId === "undefined")
            {
                let shlink=document.getElementsByClassName("store-home-link");
                if(shlink.length > 0)
                {
                    let ashlink=shlink[0].href.split("/");
                    storeId=ashlink[ashlink.length-1];
                }
                else
                {
                    storeId=-1;
                }
            }
            else
            {
                //storeId=storeId.value;
            }
        }
        else
        {
            if (typeof pageConfig === "undefined" || document.tableBWList === null || typeof document.tableBWList === "undefined" || typeof document.tableItemsByStore === "undefined")
            {
                setTimeout(a2g_FakeLoad, 2500);
                return;
            }
            storeId=pageConfig.storeId;
        }
        console.log("item","storeId",storeId);
        document.storeId=storeId;
        let shopName0=document.getElementsByClassName('shop-name');
        console.log("shopName0.length=",shopName0.length);
            if(shopName0.length > 0)
            {
                let idxChildNode=0;
                if(window.location.pathname.indexOf("/store/") >= 0)
                {
                    idxChildNode=1;
                }
                document.storeName=shopName0[0].childNodes[idxChildNode].innerHTML.trim();
            }
            else
            {
                let pageURL=document.location.origin+"/store/"+pageConfig.storeId;
                console.log("pageURL=",pageURL);
                let allA=document.getElementsByTagName("a");
                console.log("allA=",allA.length);
                for(var i=0; i < allA.length; ++i)
                {
                    console.log(i,allA[i]);

                    let dhref=allA[i].getAttribute('data-href');
                    console.log("#####",dhref);
                    if(dhref === pageURL && allA[i].firstChild.nodeName === "SPAN")
                    {
                        document.storeName=allA[i].firstChild.innerText;
                        console.log("[0] document.storeName=",document.storeName,allA[i].firstChild);
                        break;
                    }

                }
            }
        console.log("document.storeName=",document.storeName);
        CreateBWButton();
        DrawStoreTitle(storeId);
    }
    else if(window.location.pathname.indexOf("/shopcart/") >= 0 || window.location.pathname.indexOf("/wishlist/") >= 0)
    {
        if (document.tableBWList === null || typeof document.tableBWList === "undefined" || typeof document.tableItemsByStore === "undefined")
        {
            setTimeout(a2g_FakeLoad, 2500);
            return;
        }
        var shopcart=window.location.pathname.indexOf("/shopcart/") >= 0?true:false;

        var stores=document.getElementsByClassName(shopcart?"seller-name":"me-icons store");
        for(let i=0; i < stores.length; ++i)
        {
            let ahref=stores[i].href.split("/");
            document.storeId=storeId=parseInt(ahref[ahref.length-1]);
            document.storeName=stores[i].innerText;
            console.log("shopcart",document.storeId,document.storeName);
            DrawStoreTitle(storeId,i);
        }
    }
    else if (window.location.pathname.indexOf("/order_list") >= 0 || window.location.pathname.indexOf("/orderList") >= 0)
    {
        console.log("document.tableOrderList",document.tableOrderList);
        if (typeof document.tableOrderList === "undefined" || document.tableOrderList === null)
        {
            setTimeout(a2g_FakeLoad, 2500);
            return;
        }
        var loadOk=false;

        if (document.getElementsByClassName('site-footer') || document.getElementById('btnGotoPageNum'))
        {
            loadOk=true;
        }

        if(!loadOk)
        {
            console.log("AGR: a2g_FakeLoad()");
            setTimeout(a2g_FakeLoad, 2500);
            return;
        }
        addAGRLink();
    }
    else if (window.location.pathname.indexOf("/order_detail") >= 0)
    {
        if (typeof document.tableOrderList === "undefined" || document.tableOrderList === null)
        {
            setTimeout(a2g_FakeLoad, 2500);
            return;
        }

        CreateArcButton();
    }
}


function __GetLocalStorageItem(Name,Type,Def,Arr)
{
    var tmp0=localStorage.getItem(Name);
    if (tmp0)
    {
        switch(Type)
        {
            case 'bool':
                tmp0=(tmp0 === "true" || tmp0 === "1")?true:false;
                break;
            case 'int':
                tmp0=!isNaN(parseInt(tmp0))?parseInt(tmp0):0;
                break;
            case 'arr':
                if (tmp0.length > 0)
                {
                    if(!Arr[tmp0])
                    {
                        tmp0=Def;
                    }
                }
                break;
        }
    }
    else
    {
        tmp0=Def;
    }
    return tmp0;
}

function a2g_Start()
{
    console.log("a2g_Start()",window.AGR_DefaultEmail,window.location);
/*
    if (typeof window.AGR_DefaultEmail === "undefined" || window.AGR_DefaultEmail === "")
    {
        console.log("a2g_Start() ==> fuck",window.AGR_DefaultEmail,window.location);
        setTimeout(a2g_Start,1000);
        return;
    }
*/
    //var likeunlike="data:image/png;base64,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";
    //var likeunlike="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAgCAMAAACy7Q9eAAADAFBMVEX///+jBADV2NykpKVgwwxCmADBhHm+TD2Z5VfupJm+usLqHwV9wkS97ZX64t3jGwJysjy7cGXa19e54JixLR3a8saUu3LxZVO00ZmkxoetrrLuTTnmz8zy39zaGQNz3RZbphm4FwOovpXoysTIxMvzg3WcxnjdVkOPwmXyd2fIKhbl7d2Q5EbQoJih52NZpRXsMxvjw79qxBzCopzodWWy6oTk+NT4+vaK20TiJxDU8bt22SCyHQvth3nVCQBmqirh8dTS48SMt2f2npPx++nsX030i366X1PfYlHcKhPY2de9x8j09PTn3dutLCHie23J7qm/mZCYwXRo0gul4XG9uLbq8+OuHArG3LOC3jKCslvU0tPe6tSw632M4UGwtK5TpAzrKxLcta769fWt4YDjlIi9JhNqtiv508ztOiNbqxa+fXRx1ByppqzdQCu5Pi2G3jrGz9HjJQ192yvCvcXC2qzEPCr0kYTVXU2+WUu+w7t43h/B75lmyBK+lI5hsR3Ly8us4X2wwKS4aFzLGQH0pJmBwUzYOCOi6GXmNR7ybVyPz1nk5OTn99lMnQXIaV661KOU4lK47Yrc4uOrEgLs7OzCy8zqKA90uzbu0My1IQ67u7z26+n5zMar6XPsa1rErKfSIgz029bqsKlguhNu1RPB5qG7KhemqqvarafaIwy0trrffnGqIRHsRC97t0mqzYu1w6x2zinDw8N63SKM2Erc29z87utrpzXDNSLF7KT2+/ZlsyPkW0jM09P01tCf2HDkaVi8UkTzysTqe2ztUj6S4k2n6G2ux5jO8LH+/v5LowLl6ua/jIOavH74wrnDvLpjywnFwcq8qKT0mY3SkorFIgx22hx01CLFYFLFcmZqzBXzeWm6NiTXOSTxtKvsJgytrKxdqxu7xMXL4Ljs1tKA3y69HwrVHAXBaFzp5uiDu1TkTjq0trLt2NWb5VrsY1Hsq6Hc8sqj5GrMxtLq4d/s8vJ64B/kKRG9LhzzxL3ebFzKf3XvvLS0IxG6RDV+WKsxAAAAAXRSTlMAQObYZgAAAAFiS0dEyWq9Z1wAAAAJcEhZcwAALiMAAC4jAXilP3YAAAXzSURBVHjajZYLWFJnGIBTuqycWStL07BSty7LWEaWl5XmJedpufKSoeiJ5m202REzJQZa28oRQwXNKNKSarmuHGmp2TLEQmtqLbJ0E0mzTC3tcqxW+7loQFR7n4fn/Od/vvN+3/Pz34bJTVDuVu4mfw8UgKn+YW/9AoLk7+fNICOhujDfnX19C8PK3+mkjI3fGz/2tIkYQyEk972UEwUgEi2DF5o2QuXyvcv8nQH+qT9cOG0cNMygfii434VoabkFYEmMstwpl/ONffzyAud9zanXlgGupTr7P6MYGvWE0L05/eSaHC1EIjFH2O9eLucbFsl/Mrr6gX9qaqo/QP3ISh0rh/imhBA7UkauIUZpEAaHWQqJQtkWX3mdvo9d55Xg56yPv9+sc/InfBPCXImso1dYI1RTkzHnSmRIjbAmCRjZevXlfk2wa26e1axB+3C2y4qXs6E3hHWSP+jk7S7bNfTutP29L8TFpSY7osyNP5SeYr5uR8KDrKysyYCsrMEGoXn/66xDQnOuByrr/aC3F/wWua9ZsmqpTN1MlrnLJYMxKyo/aT02eXL18gVS6b4Hfn73z0ul0gX77AjXKENZB4XsRz8rOrJlGsgZc8Yt8S5bBF6zyQqh72AwpXIuBldXn/13ant7+4r97ecu7Hnc0w552cHVfw5lHRSan7xBjyCTP1WTtLRrybiw0mTwTiYryJcouuB7eZtbCXY7HtqP+q6l5dWoqqoXlLsTJ9p7HUuAvSi5kIEQemRLpUckRSQDqMTbbXHjoAk5xFLQg6JREEkbJAn9O59wDPvnL89NZ860DAwM7G7/ZeBQgRchobU6vu6egZDvNNOB3oFmWFv3WZeVd7XFVcy0seEuTUqOQBWySJI2e6XrERhO2FGQFjugo6cp9qW9FCa0EkbnSgyE7MYfHejJomDv410p0MzECiYzMSYmpq5UgaKKjtskvnYILyMwTECe3Zx+KFbD7p6mO572UoSQD0vNSYZC2ocOCnR1mU1trW3KiLZ5iYltTCbTmyhCFXR0QqNGCG0caQXD+dj+tOmxuzWE9zRNB0LQ23p+o6FQohNyYzgn1nCmzVMzjbPKejWqQEW2NJ3wMvgURi684L0M9/T0DPc0K0jj8eylFjBssTnIqMLGLgc62nDQhqMv5E5oAMJbM8SQVvg9Hgjxvzma8XhA6Mmr2hNw9Kj9SpDGoinoIwNhXaOPCKUONxJOutRApT6dHy3WBrGuFsFIIP75ioCAqonhL3lplKlgRu5Zjg+ErW7mPTacNk4zGFRqw0FuTMwJMIaJbQAmJyUDCKm7aDohSbwJwTDsyMoDBxw/A0LH50U/AQJBZ6erim84sVmhFdQbDQcvjhjxsfc08AdzOLW1nMiQBuoNhg/tC91AB23FY8hiBI//fHl7OC/NsRPRsHgx0iIQG60U0hgfBhjDMC430i3S29t7DZebEul+ChTIzBToFgEkuHodAwIMw4+eyzvas9kK0xqxzvEqkpEQEnRXUEWlGRnrM0pPlZZmh6xf37/oFpXqwVhLYw1uDk6qgE6NI7D9ldmvD/E6H4IMhA4mfb3bVI65UoyKVgNECpFI11B4UCvSS4a2L35J/QCCIZjV2XVmNwuOYDrgbZeHCtTbYLsb1w5HUQ+wNNSgqLqBehRnCkivN1iWwPUOBsNA+OXUb63g/Hww0WHCtq15oSZ2bLbSCRg9FHqgVOYMmkD/CAhVfXUHrD/k4WP17IPVPnhbQJ7S1BEglyhZk4qpugrVOgUj7iQt2uCQgpSqwpZOGMbuI6C+fPXCuf5NnlJi+hiVHG7MPF4sUtCfok+f0hW3KnzEJd1GJzPUXSIePxuPWGjqa8VfryoMwknedtDzlVMaM312zWcwGPPjjl9Jp+HEbx709ThV/chRZ4o6O4tmb7rrmjdFyX/HVYSFU44Rp2dezDyZTivBRbNNXUPYSlyJqr7Q1bUwVKw6jGO957JEisbhNmzYgMPhBOy33WzYAhzuMACHU5L+z+2LzRKISfx3X7v4pHQBy1TG/wCtFjQKGoYtVAAAAABJRU5ErkJggg==";
    var likeunlike="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAAAgCAMAAAClz5+XAAADAFBMVEUAfSf57+5yuoqwGTOiABrqxcnHhY9JpmjY79/C4szDWGYmlEqq1rzt+vLe8ePq9uzcnaa5PFOsFjCUx6Pw1tnlur9asHYOiThCo2LFZnj5+/e8UWStJDybz62GxJrWmaO1M0kZiT/krLTqztG/Sl4ymlTM5tRVq3Gz28HNhZGlDSlis30KhDT14+TGdoTDXnB8vpLR6teuKD8vllEfkEe6RVmPyKIThzvTipZZrnbkwsTKbXxmt4P0+vX69PTi8ubv19rTgI244MTdo6yMyZ6lCydQq27BS18MiTYWjkCqGTKi0rK11rx5wJAqlE7z3uHBUma1OE7G5dHM6db37e7AYG/jtrvsys7PfouX0KdesXnEY3T2/PitMEU2nlpNqmzShJLk9OmmEi6zIz3enqiMxp////+kBCLu9/ETizvDWWwomU29S2HFanrkvMEcjUEvmVQikkbmx8pqtoK848qCwpZhr3fBVGja7uCt2bry3d7t09a63MbKdIHS69yRzKUCfy+rKkDXjpnt2dvCTWWx2bsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQAAAAEvcAAAAAmAB4fJEAHmMS+FwAIQB4fJEAFRORAD0AAHwNAAB8kP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAigAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAumwCNfJEAAGIS9awAAABQABUAEvmQ6QBCmHz/fJH///+RQo/QnHxFAAEAAAAS96AAgABQwBAAEvmQ6QAAQHz/fJH///8AAAD/DQDUfJAAEviBCe8At3ywAAAA5pnx//+ZsAAYAOYNNtKJAAAAAWJLR0RmLNTZJQAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAiVJREFUeNq1lv1X0mAUx9FaRiYIlq5chhSs2EiLqHQxS8BwFApU0maips/a4iUySzM1e/m/27A8x2fnzsM99fzwPNv94XPu+d5XD/lvx+Ow/BK8nWNumuZYvdLPyG7ofTFibHVKlus/x+afBO4ElV0ZRPvvZ0hBxWoQTys1EF0yzpIrOT9a4AuxaxB6b6hE+kb30ei4Hga17u0mZLPZh0XLtZAMoTOijywmBvFuxxYgdKogEFIWt7HohhIH8zpvWEEcMbCR1IKgIGTF+GrdiQkk+gtXB9Gkdd66vN+mkezw6nMH2nuvWxA2xjM522sy8R6JXvuryBE6GjEiLM/3sIWlFft/KvcKRf4RfEwJ4r9b9f35vHz4jDcX3VNhV5Iq6S7aPHl6jUJv5+gq8RvPXNFnirVaIMjt0PZljhKkLH50ZKH4rqqq7FM3flcxSZuYbJzSWm06Mjk68lD9tBF19X1BnzxumAsl6eSbibxFhc0MtZ8PrwPzmqQNB1aTdDVGxTKyRPT+9pg5tXzJPGfWHzCOfj0tTiHzuKLYYbt1HZyNqQSfQrZRTrK9LsJjt+TJI92+qFsivMzOgegbs1hFiHQgE/mNBqLXW+ju35YkrO9A6D1xHc1mbElCGrjiCAX8ojRslcl3DkQP9OLRDf0RCSsyhPbNst4Ulm2p/aII73y32aHWUnVQEPiBjtHpbDLWcFsnt/KbAl+d6ekcTa5+Zk7eVP/Z+Q1Q+0eWVShz3AAAAABJRU5ErkJggg==";
    //"
    var style = document.createElement("STYLE");
    style.innerHTML = ".AGR_icon {width: 45px;height: 32px;float: left;background: url("+likeunlike+") no-repeat;cursor: pointer;} .AGR_btnLike .AGR_icon {background-position: 0px 0px;} .AGR_btnUnLike .AGR_icon {background-position: -45px 0px;}";
    document.body.appendChild(style);

    if(window.location.pathname.indexOf("/item/") >= 0 || window.location.pathname.indexOf("/store/") >= 0 || window.location.pathname.indexOf("/shopcart/") >= 0 || window.location.pathname.indexOf("/wishlist/") >= 0)
    {
        Get_CountItemFromStore();
        Get_BWListFromGoogle();
    }
    else if (window.location.pathname.indexOf("/order_list") >= 0 || window.location.pathname.indexOf("/orderList") >= 0)
    {
        Get_OrderListFromGoogle();
    }
    else if (window.location.pathname.indexOf("/order_detail") >= 0)
    {
        Get_OrderListFromGoogle();
    }

    a2g_FakeLoad();
}

a2g_Start();
